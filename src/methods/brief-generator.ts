/**
 * brief-generator.ts — Daily Brief generation engine.
 *
 * Assembles a complete daily brief from multiple data sources:
 *   - Calendar events (gog CLI)
 *   - Oura biometrics (REST API)
 *   - Weather (OpenWeather API)
 *   - Yesterday's brief (carry-forward tasks, Tomorrow Handoff, action items from Notes)
 *   - X/Twitter intelligence (bird CLI bookmarks)
 *   - Goals / Chief Aim (~/godmode/data/goals.json)
 *   - CONTEXT.md (streak counter, strategic context)
 *
 * Exposed as `dailyBrief.generate` RPC handler.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { homedir } from "node:os";
import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  DATA_DIR,
  GODMODE_ROOT,
  MEMORY_DIR,
  resolveVaultPath,
  DAILY_FOLDER,
  localDateString,
} from "../data-paths.js";
import { getUserTimezone, getUserLocation, getTempUnit } from "../lib/user-config.js";
import { loadLatestReflection } from "../lib/evening-reflection.js";
import { resolveAnthropicKey } from "../lib/anthropic-auth.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const execAsync = promisify(exec);
const EXEC_TIMEOUT = 15_000;

// ── Env helpers ──────────────────────────────────────────────────────────────

function loadEnv(): Record<string, string> {
  const envPath = join(GODMODE_ROOT, ".env");
  const vars: Record<string, string> = {};
  try {
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      if (line.startsWith("#") || !line.includes("=")) continue;
      const eqIdx = line.indexOf("=");
      const key = line.slice(0, eqIdx).trim();
      let value = line.slice(eqIdx + 1).trim();
      // Strip surrounding quotes (single or double)
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key) vars[key] = value;
    }
  } catch {
    // .env not found
  }
  return vars;
}

function getEnv(key: string): string {
  return process.env[key] || loadEnv()[key] || "";
}

// ── LLM helpers ──────────────────────────────────────────────────────────────

/** Resolve Anthropic API key — delegates to canonical resolver */
function resolveAnthropicAuth(): string | null {
  return resolveAnthropicKey();
}

/** Call Claude via `claude` CLI (OAuth/Claude Max). Always uses Max subscription. */
async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  opts?: { model?: string; maxTokens?: number },
): Promise<string | null> {
  // Always use the CLI which routes through OAuth/Max subscription.
  // Never call the direct API — that bills to the API account.
  return callClaudeCLI(systemPrompt, userPrompt, opts);
}

/** Direct Anthropic Messages API call (requires API key, not OAuth). */
async function callClaudeDirectAPI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  opts?: { model?: string; maxTokens?: number },
): Promise<string | null> {
  const model = opts?.model ?? "claude-sonnet-4-6-20250514";
  const maxTokens = opts?.maxTokens ?? 8192;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.error(`[BriefGenerator] Claude API ${resp.status}: ${body.slice(0, 300)}`);
      return null;
    }

    const data = (await resp.json()) as {
      content?: Array<{ type: string; text?: string }>;
      error?: { message?: string };
    };

    if (data.error?.message) {
      console.error(`[BriefGenerator] Claude API error: ${data.error.message}`);
      return null;
    }

    return data.content?.find((c) => c.type === "text")?.text ?? null;
  } catch (err) {
    console.error(`[BriefGenerator] Claude API call failed: ${err instanceof Error ? err.message : "unknown"}`);
    return null;
  }
}

/** Call Claude via the `claude` CLI in print mode. Handles OAuth/Max auth natively. */
async function callClaudeCLI(
  systemPrompt: string,
  userPrompt: string,
  opts?: { model?: string; maxTokens?: number },
): Promise<string | null> {
  const { spawn } = await import("node:child_process");

  // Map full model IDs to CLI-friendly aliases
  const modelMap: Record<string, string> = {
    "claude-sonnet-4-6-20250514": "sonnet",
    "claude-opus-4-6": "opus",
    "claude-haiku-4-5-20251001": "haiku",
  };
  const rawModel = opts?.model ?? "claude-sonnet-4-6-20250514";
  const model = modelMap[rawModel] ?? rawModel;

  try {
    console.log(`[BriefGenerator] Using claude CLI (model: ${model})...`);

    // Use spawn + stdin to avoid ARG_MAX limits with large prompts
    const combined = `<system>${systemPrompt}</system>\n\n${userPrompt}`;

    return new Promise<string | null>((resolve) => {
      const child = spawn("claude", ["-p", "--model", model], {
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 180_000,
        env: { ...process.env, PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH}` },
      });

      const chunks: Buffer[] = [];
      const errChunks: Buffer[] = [];

      child.stdout.on("data", (d: Buffer) => chunks.push(d));
      child.stderr.on("data", (d: Buffer) => errChunks.push(d));

      child.on("close", (code) => {
        const out = Buffer.concat(chunks).toString("utf-8").trim();
        const err = Buffer.concat(errChunks).toString("utf-8").trim();

        if (err) console.warn(`[BriefGenerator] claude CLI stderr: ${err.slice(0, 200)}`);

        if (code !== 0 || !out) {
          console.error(`[BriefGenerator] claude CLI exit ${code}, output length=${out.length}`);
          resolve(null);
          return;
        }
        resolve(out);
      });

      child.on("error", (e) => {
        console.error(`[BriefGenerator] claude CLI spawn error: ${e.message}`);
        resolve(null);
      });

      child.stdin.write(combined);
      child.stdin.end();
    });
  } catch (err) {
    console.error(`[BriefGenerator] claude CLI failed: ${err instanceof Error ? err.message.slice(0, 300) : "unknown"}`);
    return null;
  }
}

// ── Date helpers ─────────────────────────────────────────────────────────────

function todayDate(): string {
  return localDateString();
}

function yesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateString(d);
}

function dayOfWeek(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: getUserTimezone(),
  });
}

function formattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: getUserTimezone(),
  });
}

function daysSince(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
}

// ── Data source: Calendar ────────────────────────────────────────────────────

type CalendarEvent = {
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  location?: string;
  attendees?: string[];
};

async function fetchCalendarEvents(): Promise<{
  events: CalendarEvent[];
  error?: string;
}> {
  const account = getEnv("GOG_CALENDAR_ACCOUNT");
  const client = getEnv("GOG_CLIENT") || "godmode";
  if (!account) {
    return { events: [], error: "GOG_CALENDAR_ACCOUNT not set" };
  }

  try {
    const { stdout } = await execAsync(
      `gog calendar events --account ${account} --client ${client} --today --json`,
      {
        timeout: EXEC_TIMEOUT,
        env: {
          ...process.env,
          PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH}`,
          GOG_KEYRING_PASSWORD: getEnv("GOG_KEYRING_PASSWORD") || "",
        },
      },
    );

    // Parse Google Calendar API JSON format (gog returns raw GCal objects)
    try {
      const parsed = JSON.parse(stdout);
      const rawEvents = Array.isArray(parsed) ? parsed : parsed.events ?? [];
      const events: CalendarEvent[] = [];
      for (const e of rawEvents) {
        // Google Calendar API: start/end are objects with dateTime or date
        const startStr = e.start?.dateTime ?? e.start?.date ?? e.startTime;
        const endStr = e.end?.dateTime ?? e.end?.date ?? e.endTime;
        if (!startStr) continue;
        const startTime = new Date(startStr).getTime();
        const endTime = endStr ? new Date(endStr).getTime() : startTime;
        if (isNaN(startTime)) continue;
        events.push({
          id: e.id ?? "",
          title: e.summary ?? e.title ?? "(no title)",
          startTime,
          endTime,
          duration: Math.round((endTime - startTime) / 60_000),
          location: e.location,
          attendees: e.attendees
            ?.filter((a: { self?: boolean }) => !a.self)
            .map((a: { email?: string }) => a.email)
            .filter(Boolean),
        });
      }
      return { events };
    } catch {
      // Fall back to text parsing
    }

    // Text format fallback: id\tstartStr\tendStr\ttitle
    const events: CalendarEvent[] = [];
    for (const line of stdout.trim().split("\n").filter(Boolean)) {
      const parts = line.split(/\s{2,}|\t/).map((p) => p.trim());
      if (parts.length < 4) continue;
      const [id, startStr, endStr, ...titleParts] = parts;
      try {
        const startTime = new Date(startStr).getTime();
        const endTime = new Date(endStr).getTime();
        if (isNaN(startTime)) continue;
        events.push({
          id,
          title: titleParts.join(" "),
          startTime,
          endTime,
          duration: Math.round((endTime - startTime) / 60_000),
        });
      } catch {
        // skip unparseable lines
      }
    }
    return { events };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "gog CLI failed";
    // Detect the recurring scope issue: token exists but lacks calendar permission
    if (msg.includes("No auth for calendar") || msg.includes("no auth") || msg.includes("401")) {
      return {
        events: [],
        error:
          "Calendar token missing calendar scope. Fix: gog auth add YOUR_EMAIL --services calendar --client godmode",
      };
    }
    return { events: [], error: msg };
  }
}

function formatCalendarSection(events: CalendarEvent[], error?: string): string {
  if (error && events.length === 0) {
    if (error.includes("not set")) {
      return `> ⚠️ Calendar not connected. Run: \`gog auth add YOUR_EMAIL --services calendar --client godmode\`\n\nNo meetings scheduled.`;
    }
    if (error.includes("calendar scope") || error.includes("No auth for calendar")) {
      return `> ⚠️ Calendar token exists but lacks calendar scope. Run:\n> \`gog auth add YOUR_EMAIL --services calendar --client godmode\`\n> *(The \`--services calendar\` flag is required — without it, gog only authorizes user-info scope)*\n\nNo meetings scheduled.`;
    }
    return `> ⚠️ Calendar error: ${error}\n\nNo meetings scheduled.`;
  }

  if (events.length === 0) {
    return "No meetings scheduled.\n\n**Deep Work Windows:** Full day available for deep work";
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  const todayEvents = events
    .filter((e) => e.startTime >= todayStart.getTime() && e.startTime < todayEnd.getTime())
    .sort((a, b) => a.startTime - b.startTime);

  if (todayEvents.length === 0) {
    return "No meetings scheduled.\n\n**Deep Work Windows:** Full day available for deep work";
  }

  const lines: string[] = [];
  for (const evt of todayEvents) {
    const time = new Date(evt.startTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: getUserTimezone(),
    });
    const duration = evt.duration ? ` (${evt.duration}min)` : "";
    lines.push(`- **${time}** — ${evt.title}${duration}`);
  }

  // Calculate deep work windows
  const windows: string[] = [];
  let lastEnd = 8 * 60; // 8 AM in minutes
  for (const evt of todayEvents) {
    const startMin =
      new Date(evt.startTime).getHours() * 60 + new Date(evt.startTime).getMinutes();
    if (startMin - lastEnd >= 60) {
      const fromH = Math.floor(lastEnd / 60);
      const toH = Math.floor(startMin / 60);
      windows.push(
        `${fromH > 12 ? fromH - 12 : fromH}${fromH >= 12 ? "PM" : "AM"}-${toH > 12 ? toH - 12 : toH}${toH >= 12 ? "PM" : "AM"}`,
      );
    }
    lastEnd = Math.max(lastEnd, startMin + (evt.duration || 30));
  }

  if (windows.length > 0) {
    lines.push("");
    lines.push(`**Deep Work Windows:** ${windows.join(", ")}`);
  }

  return lines.join("\n");
}

async function lookupPersonContext(name: string): Promise<string | null> {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const peopleDir = join(MEMORY_DIR, "bank", "people");
  const candidates = [
    join(peopleDir, `${slug}.md`),
  ];

  // Also try first-last.md format (split on space)
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const firstLast = `${parts[0].toLowerCase()}-${parts[parts.length - 1].toLowerCase()}`;
    if (firstLast !== slug) {
      candidates.push(join(peopleDir, `${firstLast}.md`));
    }
  }

  for (const filePath of candidates) {
    try {
      const raw = await readFile(filePath, "utf-8");
      const contextLines = raw
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith("#"));
      const top = contextLines.slice(0, 3);
      if (top.length > 0) {
        return top.join(" | ");
      }
    } catch {
      // File not found — try next candidate
    }
  }

  return null;
}

async function formatMeetingPrepSection(events: CalendarEvent[]): Promise<string> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  const todayEvents = events
    .filter((e) => e.startTime >= todayStart.getTime() && e.startTime < todayEnd.getTime())
    .sort((a, b) => a.startTime - b.startTime);

  if (todayEvents.length === 0) {
    return "No external meetings today.";
  }

  const lines: string[] = [];
  for (const evt of todayEvents) {
    const time = new Date(evt.startTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: getUserTimezone(),
    });
    lines.push(`**${evt.title}** at ${time}`);
    if (evt.attendees && evt.attendees.length > 0) {
      for (const attendee of evt.attendees) {
        const context = await lookupPersonContext(attendee);
        if (context) {
          lines.push(`- **${attendee}** — ${context}`);
        } else {
          lines.push(`- ${attendee} — *No prior context*`);
        }
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ── Data source: Oura (REMOVED — user has no Oura Ring) ─────────────────────


// ── Data source: Weather ─────────────────────────────────────────────────────

type WeatherData = {
  temp: number | null;
  condition: string;
  icon: string;
};

async function fetchWeather(): Promise<WeatherData> {
  // Use wttr.in — free, no API key needed
  const location = getUserLocation();
  if (!location) {
    // No location configured — skip weather
    return { temp: null, condition: "Unknown", icon: "🌤️" };
  }
  try {
    const encoded = encodeURIComponent(location);
    const resp = await fetch(`https://wttr.in/${encoded}?format=j1`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!resp.ok) {
      throw new Error(`Weather API ${resp.status}: ${resp.statusText}`);
    }
    const data = (await resp.json()) as {
      current_condition?: Array<{
        temp_F?: string;
        temp_C?: string;
        weatherDesc?: Array<{ value?: string }>;
        humidity?: string;
        weatherCode?: string;
      }>;
    };
    const current = data.current_condition?.[0];
    if (!current) return { temp: null, condition: "Unknown", icon: "🌤️" };

    const unit = getTempUnit();
    const tempRaw = unit === "C" ? current.temp_C : current.temp_F;
    const temp = tempRaw ? parseInt(tempRaw, 10) : null;
    const condition = current.weatherDesc?.[0]?.value ?? "Unknown";
    const code = parseInt(current.weatherCode ?? "0", 10);

    // Weather code → emoji mapping (wttr.in codes based on WWO)
    let icon = "🌤️";
    if (code <= 113) icon = "☀️";
    else if (code <= 119) icon = "⛅";
    else if (code <= 143) icon = "☁️";
    else if (code <= 299) icon = "🌧️";
    else if (code <= 399) icon = "❄️";
    else if (code >= 386) icon = "⛈️";

    return { temp, condition, icon };
  } catch {
    return { temp: null, condition: "Unknown", icon: "🌤️" };
  }
}

// ── Data source: X Intelligence ──────────────────────────────────────────────

type XIntelItem = {
  author: string;
  text: string;
  url?: string;
};

// REMOVED (v2 slim): x-client import — inline XAI key resolution
function getXaiApiKey(): string | undefined {
  return process.env.XAI_API_KEY;
}

/**
 * Fetch X intelligence via XAI Responses API with x_search tool.
 * Searches for AI/tech/business topics relevant to the user's work.
 */
async function fetchXIntelligence(): Promise<{
  items: XIntelItem[];
  error?: string;
}> {
  const apiKey = getXaiApiKey();
  if (!apiKey) {
    return { items: [], error: "XAI_API_KEY not set in ~/.openclaw/.env or ~/godmode/.env" };
  }

  try {
    // Read user-configured topics from options, fall back to default
    let topics: string | undefined;
    try {
      const { readFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const optionsPath = join(DATA_DIR, "godmode-options.json");
      const raw = JSON.parse(await readFile(optionsPath, "utf-8")) as Record<string, unknown>;
      if (typeof raw["dailyIntel.topics"] === "string" && raw["dailyIntel.topics"].trim()) {
        topics = raw["dailyIntel.topics"].trim();
      }
    } catch {
      // Options file not found or unreadable — use default
    }

    const query = topics
      ? `Latest news and developments about: ${topics}. Focus on actionable insights from the last 24 hours.`
      : "Latest AI agent news, Claude updates, developer tools, and SaaS automation trends from the last 24 hours. Focus on actionable insights for an AI-first SaaS founder.";

    const resp = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-4-1-fast-non-reasoning",
        tools: [{ type: "x_search" }],
        input: query,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.error(`[XIntel] API returned ${resp.status}: ${body.slice(0, 200)}`);
      return { items: [], error: `XAI API ${resp.status}: ${resp.statusText}` };
    }

    const data = (await resp.json()) as {
      output?: Array<{
        type: string;
        content?: Array<{ type: string; text?: string }>;
        results?: Array<{ url?: string; title?: string }>;
      }>;
      error?: { message?: string };
    };

    if (data.error?.message) {
      console.error(`[XIntel] API error: ${data.error.message}`);
      return { items: [], error: data.error.message };
    }

    // Extract text response
    const textOutput = data.output
      ?.filter((o) => o.type === "message")
      ?.flatMap((o) => o.content ?? [])
      ?.filter((c) => c.type === "output_text")
      ?.map((c) => c.text ?? "")
      ?.join("\n");

    // Extract citation URLs from search results (custom_tool_call or x_search_call)
    const citations: string[] = [];
    // Parse URLs from the text output itself (inline citation links like [[1]](url))
    const urlRegex = /\[(?:\[\d+\])?\]\((https:\/\/x\.com\/[^)]+)\)/g;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(textOutput ?? "")) !== null) {
      if (urlMatch[1] && !citations.includes(urlMatch[1])) {
        citations.push(urlMatch[1]);
      }
    }

    if (!textOutput) {
      console.error("[XIntel] No text output extracted from response");
      return { items: [], error: "No results from XAI x_search" };
    }

    // Parse the text response into structured items
    const items: XIntelItem[] = [];
    const lines = textOutput.split("\n").filter((l) => l.trim());

    // Extract bullet points or numbered items as intel items
    for (const line of lines) {
      const bulletMatch = line.match(/^[-*•]\s+(.+)/);
      const numberedMatch = line.match(/^\d+\.\s+(.+)/);
      const content = bulletMatch?.[1] ?? numberedMatch?.[1];
      if (content && content.length > 20) {
        // Try to extract author handle from content
        const handleMatch = content.match(/@(\w+)/);
        items.push({
          author: handleMatch ? `@${handleMatch[1]}` : "X",
          text: content.replace(/@\w+\s*/, "").trim(),
          url: citations.shift(),
        });
      }
    }

    // If no structured items found, use the whole text as one item
    if (items.length === 0 && textOutput.length > 20) {
      items.push({
        author: "XAI",
        text: textOutput.slice(0, 300),
      });
    }

    console.log(`[XIntel] Success: ${items.length} items, ${citations.length} citations`);
    return { items: items.slice(0, 8) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "XAI API call failed";
    console.error(`[XIntel] Fetch failed: ${msg}`);
    return { items: [], error: msg };
  }
}

function formatXIntelligence(items: XIntelItem[], error?: string): string {
  if (error && items.length === 0) {
    if (error.includes("not set")) {
      return `> ⚠️ XAI API key not configured. Add XAI_API_KEY to ~/.openclaw/.env`;
    }
    return `No X intel scan today. (${error})`;
  }

  if (items.length === 0) {
    return "No X intel available.";
  }

  const lines: string[] = [`**${items.length} signals from X:**`, ""];
  for (const item of items.slice(0, 6)) {
    const truncated = item.text.length > 160 ? item.text.slice(0, 160) + "…" : item.text;
    const urlSuffix = item.url ? ` ([source](${item.url}))` : "";
    lines.push(`- ${truncated}${urlSuffix}`);
  }

  if (items.length > 6) {
    lines.push(`\n*+${items.length - 6} more signals*`);
  }

  return lines.join("\n");
}

// ── Data source: Overnight Agent Work (queue processor) ──────────────────────

async function formatOvernightWorkSection(): Promise<string | null> {
  let readQueueState: Awaited<typeof import("../lib/queue-state.js")>["readQueueState"];
  try {
    ({ readQueueState } = await import("../lib/queue-state.js"));
  } catch {
    return null; // Queue state module unavailable — skip overnight work section
  }
  const state = await readQueueState();

  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const recentItems = state.items.filter(
    (item) =>
      (item.status === "review" || item.status === "done") &&
      item.completedAt != null &&
      item.completedAt >= cutoff,
  );

  if (recentItems.length === 0) return null;

  const lines: string[] = [];
  let reviewCount = 0;

  for (const item of recentItems) {
    const statusLabel = item.status === "review" ? "Ready for review" : "Approved";
    lines.push(`**${item.title}** — ${statusLabel}`);

    if (item.result?.summary) {
      const truncated =
        item.result.summary.length > 150
          ? item.result.summary.slice(0, 150) + "..."
          : item.result.summary;
      lines.push(`  ${truncated}`);
    }
    if (item.result?.outputPath) {
      lines.push(`  Output: \`${item.result.outputPath}\``);
    }
    if (item.result?.prUrl) {
      lines.push(`  PR: ${item.result.prUrl}`);
    }

    if (item.status === "review") reviewCount++;
    lines.push("");
  }

  if (reviewCount > 0) {
    lines.push(
      `**${reviewCount} item${reviewCount === 1 ? "" : "s"} awaiting your review** — check Mission Control`,
    );
  }

  return lines.join("\n");
}

// ── Data source: Front Inbox (Communications) ───────────────────────────────

type FrontConversation = {
  subject: string;
  status: string;
  assignee: string;
  lastFrom: string;
  snippet: string;
  tags: string[];
};

async function fetchFrontInbox(): Promise<{
  conversations: FrontConversation[];
  error?: string;
}> {
  const token = getEnv("FRONT_API_TOKEN");
  if (!token) {
    return { conversations: [], error: "FRONT_API_TOKEN not set" };
  }

  try {
    const resp = await fetch(
      "https://api2.frontapp.com/conversations?limit=25&sort_by=date&sort_order=desc",
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!resp.ok) {
      return { conversations: [], error: `Front API ${resp.status}` };
    }

    const data = (await resp.json()) as {
      _results?: Array<{
        subject?: string;
        status?: string;
        assignee?: { email?: string };
        tags?: Array<{ name?: string }>;
        last_message?: { author?: { email?: string }; body?: string };
      }>;
    };

    const conversations: FrontConversation[] = (data._results ?? [])
      .slice(0, 25)
      .map((c) => ({
        subject: c.subject || "(no subject)",
        status: c.status || "unknown",
        assignee: c.assignee?.email || "unassigned",
        lastFrom: c.last_message?.author?.email || "unknown",
        snippet: (c.last_message?.body ?? "").slice(0, 200),
        tags: (c.tags ?? []).map((t) => t.name ?? ""),
      }));

    return { conversations };
  } catch (err) {
    return {
      conversations: [],
      error: `Front fetch failed: ${err instanceof Error ? err.message : "unknown"}`,
    };
  }
}

// ── Data source: Evening Review / Tomorrow Handoff ──────────────────────────

async function extractEveningReview(
  vaultPath: string,
): Promise<{ tomorrowHandoff: string; reflection: string }> {
  const yesterday = yesterdayDate();
  const filePath = join(vaultPath, DAILY_FOLDER, `${yesterday}.md`);

  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    return { tomorrowHandoff: "_No evening review from last night._", reflection: "" };
  }

  // Extract Tomorrow Handoff section
  const handoffMatch = content.match(
    /##\s*Tomorrow\s*(?:Handoff|Plan|Priorities)\s*\n([\s\S]*?)(?=\n##\s[^#]|\n---)/m,
  );
  const tomorrowHandoff = handoffMatch?.[1]?.trim() || "_No evening review from last night._";

  // Extract Evening Reflection / Evening Review section
  const reflectionMatch = content.match(
    /##\s*(?:Evening\s*(?:Review|Reflection)|\w+\s*Reflection)\s*\n([\s\S]*?)(?=\n##\s[^#]|\n---)/m,
  );
  const reflection = reflectionMatch?.[1]?.trim() || "";

  return { tomorrowHandoff, reflection };
}

// ── Data source: Quote of the Day ───────────────────────────────────────────

const QUOTES: string[] = [
  '"The best time to plant a tree was twenty years ago. The second best time is now."|Chinese Proverb',
  '"Your work is going to fill a large part of your life. Don\'t settle."|Steve Jobs',
  '"The only way to do great work is to love what you do."|Steve Jobs',
  '"What you seek is seeking you."|Rumi',
  '"Be the change you wish to see in the world."|Mahatma Gandhi',
  '"The future belongs to those who believe in the beauty of their dreams."|Eleanor Roosevelt',
  '"It is not the critic who counts."|Theodore Roosevelt',
  '"The impediment to action advances action. What stands in the way becomes the way."|Marcus Aurelius',
  '"I have not failed. I\'ve just found 10,000 ways that won\'t work."|Thomas Edison',
  '"Simplicity is the ultimate sophistication."|Leonardo da Vinci',
  '"In the middle of difficulty lies opportunity."|Albert Einstein',
  '"The only person you are destined to become is the person you decide to be."|Ralph Waldo Emerson',
  '"Do not go where the path may lead, go instead where there is no path and leave a trail."|Ralph Waldo Emerson',
  '"Courage is not the absence of fear, but the triumph over it."|Nelson Mandela',
  '"The wound is the place where the Light enters you."|Rumi',
  '"You miss 100% of the shots you don\'t take."|Wayne Gretzky',
  '"Everything you\'ve ever wanted is on the other side of fear."|George Addair',
  '"The mind is everything. What you think you become."|Buddha',
  '"God does not call the qualified. He qualifies the called."|Rick Warren',
  '"Stop trying to calm the storm. Calm yourself. The storm will pass."|Timber Hawkeye',
  '"Action is the foundational key to all success."|Pablo Picasso',
  '"We are what we repeatedly do. Excellence, then, is not an act, but a habit."|Aristotle',
  '"Life shrinks or expands in proportion to one\'s courage."|Anaïs Nin',
  '"The best way to predict the future is to create it."|Peter Drucker',
  '"Faith is taking the first step even when you don\'t see the whole staircase."|Martin Luther King Jr.',
  '"Let go of who you think you are supposed to be and embrace who you are."|Brené Brown',
  '"It always seems impossible until it\'s done."|Nelson Mandela',
  '"The quieter you become, the more you can hear."|Ram Dass',
  '"You are never too old to set another goal or to dream a new dream."|C.S. Lewis',
  '"Not all those who wander are lost."|J.R.R. Tolkien',
];

function getQuoteOfDay(): { text: string; author: string } {
  // Try to read from a quotes file first (user-customizable)
  const quotesPath = join(GODMODE_ROOT, "data", "quotes.md");
  let lines = QUOTES;
  try {
    const raw = readFileSync(quotesPath, "utf-8");
    const fileLines = raw.split("\n").filter((l) => l.trim() && l.includes("|"));
    if (fileLines.length > 0) lines = fileLines;
  } catch { /* use built-in quotes */ }

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  const pick = lines[dayOfYear % lines.length];

  const parts = pick.split("|");
  const text = (parts[0] ?? "").replace(/^"/, "").replace(/"$/, "").trim();
  const author = (parts[1] ?? "Unknown").trim();
  return { text, author };
}

// ── Data source: Yesterday's brief (carry-forward + action items) ────────────

type CarryForwardResult = {
  unfinishedTasks: string[];
  tomorrowHandoff: string[];
  actionItems: string[];
  yesterdayImpact: string | null;
};

async function extractCarryForward(vaultPath: string): Promise<CarryForwardResult> {
  const yesterday = yesterdayDate();
  const filePath = join(vaultPath, DAILY_FOLDER, `${yesterday}.md`);

  const result: CarryForwardResult = {
    unfinishedTasks: [],
    tomorrowHandoff: [],
    actionItems: [],
    yesterdayImpact: null,
  };

  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    return result;
  }

  // Extract unchecked tasks from Win The Day
  // NOTE: Don't use $ in the lookahead — in multiline mode $ matches end-of-line,
  // causing the lazy quantifier to match zero characters on the heading line itself.
  const wtdMatch = content.match(
    /##\s*(?:🎯\s*)?Win The Day\s*\n([\s\S]*?)(?=\n##\s[^#]|\n---)/m,
  );
  if (wtdMatch) {
    const sectionBody = wtdMatch[1];
    const checkboxRegex = /^(?:\d+\.|-|\*)\s*\[ \]\s*(.+)$/gm;
    let match;
    while ((match = checkboxRegex.exec(sectionBody)) !== null) {
      const title = match[1]
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\s*[—–]\s+.+$/, "")
        .trim();
      if (title) result.unfinishedTasks.push(title);
    }
  }

  // Extract Tomorrow Handoff section
  const handoffMatch = content.match(
    /##\s*Tomorrow\s*(?:Handoff|Plan|Priorities)\s*\n([\s\S]*?)(?=\n##\s[^#]|\n---)/m,
  );
  if (handoffMatch) {
    const items = handoffMatch[1]
      .split("\n")
      .map((l) => l.replace(/^\s*[-*]\s*/, "").trim())
      .filter(Boolean);
    result.tomorrowHandoff = items;
  }

  // Extract Yesterday's Impact section for reference
  const impactMatch = content.match(
    /##\s*(?:📈\s*)?(?:Yesterday'?s?\s*)?Impact\s*\n([\s\S]*?)(?=\n##\s[^#]|\n---)/m,
  );
  if (impactMatch) {
    result.yesterdayImpact = impactMatch[1]
      .trim()
      .slice(0, 500);
  }

  // Extract action items from Notes section (brain dumps, meeting notes)
  result.actionItems = extractActionItemsFromNotes(content);

  return result;
}

/**
 * Extract action items from the Notes section and any unstructured text.
 *
 * Looks for:
 * - Lines starting with "- " that aren't checkboxes (bullet tasks)
 * - Labeled sections like "FIXES:", "EXTRA:", "ACTION:", "TODO:"
 * - Sentences with task-like patterns ("need to", "should", "follow up with")
 * - Meeting notes with action items
 */
function extractActionItemsFromNotes(content: string): string[] {
  const items: string[] = [];
  const seen = new Set<string>();

  // Find the Notes section(s)
  const notesSections: string[] = [];
  const h2Regex = /^##\s+(.+)$/gm;
  const allMatches = Array.from(content.matchAll(h2Regex));
  for (let i = 0; i < allMatches.length; i++) {
    const heading = allMatches[i][1].toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    if (
      heading === "notes" ||
      heading.includes("meeting notes") ||
      heading.includes("brain dump") ||
      heading.includes("captured")
    ) {
      const start = (allMatches[i].index ?? 0) + allMatches[i][0].length;
      const end = i + 1 < allMatches.length ? (allMatches[i + 1].index ?? content.length) : content.length;
      notesSections.push(content.slice(start, end));
    }
  }

  // Also check for labeled task blocks anywhere in the document
  const labeledBlockRegex = /^(?:FIXES|EXTRA|TODO|ACTION\s*ITEMS?|FOLLOW\s*UPS?|NEXT\s*STEPS?):\s*$/gim;
  let labelMatch;
  while ((labelMatch = labeledBlockRegex.exec(content)) !== null) {
    const blockStart = labelMatch.index + labelMatch[0].length;
    // Read until next heading or double newline or EOF
    const blockEnd = content.indexOf("\n\n", blockStart + 1);
    const sectionEnd = content.indexOf("\n##", blockStart);
    const end = Math.min(
      blockEnd > 0 ? blockEnd : content.length,
      sectionEnd > 0 ? sectionEnd : content.length,
    );
    notesSections.push(content.slice(blockStart, end));
  }

  for (const section of notesSections) {
    const lines = section.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("##")) continue;

      // Skip checked checkboxes
      if (/^\s*(?:\d+\.|-|\*)\s*\[[xX]\]/.test(trimmed)) continue;

      // Unchecked checkboxes are tasks
      const uncheckedMatch = trimmed.match(/^(?:\d+\.|-|\*)\s*\[ \]\s*(.+)/);
      if (uncheckedMatch) {
        const item = uncheckedMatch[1].replace(/\*\*(.+?)\*\*/g, "$1").trim();
        if (item && !seen.has(item.toLowerCase())) {
          items.push(item);
          seen.add(item.toLowerCase());
        }
        continue;
      }

      // Bullet items that look like tasks (start with - and have verb-like content)
      const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
      if (bulletMatch) {
        const text = bulletMatch[1].trim();
        // Filter: must have enough content and look like an action item
        if (
          text.length > 10 &&
          !text.startsWith("http") &&
          !text.match(/^(✨|🔧|📊|💡)\s/) && // skip impact-style bullets
          isActionItem(text)
        ) {
          const clean = text.replace(/\*\*(.+?)\*\*/g, "$1").trim();
          if (!seen.has(clean.toLowerCase())) {
            items.push(clean);
            seen.add(clean.toLowerCase());
          }
        }
        continue;
      }

      // Plain text lines with task-like language
      if (isActionItem(trimmed) && trimmed.length > 15 && trimmed.length < 200) {
        const clean = trimmed.replace(/\*\*(.+?)\*\*/g, "$1").trim();
        if (!seen.has(clean.toLowerCase())) {
          items.push(clean);
          seen.add(clean.toLowerCase());
        }
      }
    }
  }

  return items;
}

/** Check if a line of text looks like an actionable task. */
function isActionItem(text: string): boolean {
  const lower = text.toLowerCase();
  const taskPatterns = [
    /^(need|needs)\s+to\b/,
    /^should\s+/,
    /^must\s+/,
    /^todo:?\s*/i,
    /^action:?\s*/i,
    /^follow\s*up\b/i,
    /^remind\s+me\b/i,
    /^send\s+/i,
    /^fix\s+/i,
    /^build\s+/i,
    /^create\s+/i,
    /^update\s+/i,
    /^check\s+(if|whether|on|with)\b/i,
    /^review\s+/i,
    /^schedule\s+/i,
    /^call\s+/i,
    /^email\s+/i,
    /^reach\s+out\b/i,
    /^set\s+up\b/i,
    /^investigate\s+/i,
    /^look\s+into\b/i,
  ];
  return taskPatterns.some((p) => p.test(lower));
}

// ── Data source: Context ─────────────────────────────────────────────────────

type ContextData = {
  chiefAim: string;
  activeGoals: Array<{ title: string; area?: string; progress?: number }>;
  streakDay: number | null;
  streakLabel: string;
  streakStart: string | null;
  carryForwardLines: string[];
};

async function readContextData(): Promise<ContextData> {
  // Read CONTEXT.md for strategic carry-forward
  const contextPath = join(MEMORY_DIR, "CONTEXT.md");
  let contextLines: string[] = [];
  let streakStart: string | null = null;
  let streakLabel = "Streak";

  try {
    const raw = await readFile(contextPath, "utf-8");
    contextLines = raw
      .split("\n")
      .filter((l) => l.startsWith("- "))
      .map((l) => l.slice(2).trim());

    // Extract optional streak counter (user-defined label + start date)
    // Supports: "streak: 2026-01-01", "fitness start: 2026-01-01", "meditation streak: 2026-01-01"
    const streakMatch = raw.match(/(?:(\w[\w\s]*?)\s+)?(?:streak|start)[:\s]+(\d{4}-\d{2}-\d{2})/i);
    if (streakMatch) {
      if (streakMatch[1]) streakLabel = streakMatch[1].trim();
      streakStart = streakMatch[2];
    }
  } catch {
    // CONTEXT.md not found
  }

  // Read chief aim: goals.json first, then THESIS.md heading/label fallback
  let chiefAim = "";
  let activeGoals: Array<{ title: string; area?: string; progress?: number }> = [];
  try {
    const goalsRaw = await readFile(join(DATA_DIR, "goals.json"), "utf-8");
    const goalsData = JSON.parse(goalsRaw) as {
      chiefAim?: string;
      goals?: Array<{ title?: string; text?: string; area?: string; progress?: number; status?: string }>;
    };
    if (goalsData.chiefAim) {
      chiefAim = goalsData.chiefAim;
    } else if (goalsData.goals && goalsData.goals.length > 0) {
      const firstGoal = goalsData.goals[0];
      chiefAim = firstGoal.title || firstGoal.text || "";
    }
    // Collect active goals for the brief
    if (goalsData.goals) {
      activeGoals = goalsData.goals
        .filter(g => !g.status || g.status === "active")
        .map(g => ({ title: g.title || g.text || "", area: g.area, progress: g.progress }))
        .filter(g => g.title);
    }
  } catch { /* goals.json not found or invalid */ }

  if (!chiefAim) {
    try {
      const thesis = await readFile(join(MEMORY_DIR, "THESIS.md"), "utf-8");
      // Only match when used as a label at start of line (heading or bold),
      // followed by a colon/separator — not inline mentions
      const aimMatch = thesis.match(
        /^(?:#+\s*|\*{2})?(?:chief\s*aim|vision|mission)\b(?:\*{2})?\s*[:—]\s*>?\s*(.+)/im,
      );
      if (aimMatch) chiefAim = aimMatch[1].trim();
    } catch {
      // No THESIS.md — chief aim stays empty
    }
  }

  return {
    chiefAim,
    activeGoals,
    streakDay: streakStart ? daysSince(streakStart) : null,
    streakLabel,
    streakStart,
    carryForwardLines: contextLines,
  };
}

// ── Brief assembly ───────────────────────────────────────────────────────────

type GenerateResult = {
  date: string;
  path: string;
  sections: string[];
  warnings: string[];
  carryForward: {
    unfinishedTasks: number;
    actionItems: number;
    tomorrowHandoff: number;
  };
};

async function generateDailyBrief(date?: string): Promise<GenerateResult> {
  const briefDate = date || todayDate();
  const vaultPath = resolveVaultPath();
  if (!vaultPath) {
    return {
      date: briefDate,
      path: "",
      sections: [],
      warnings: ["Obsidian vault path not configured. Set OBSIDIAN_VAULT_PATH."],
      carryForward: { unfinishedTasks: 0, actionItems: 0, tomorrowHandoff: 0 },
    };
  }

  const filePath = join(vaultPath, DAILY_FOLDER, `${briefDate}.md`);
  const warnings: string[] = [];

  // Preserve existing Notes section (sacred — never touched by AI)
  // CRITICAL: If extraction fails, keep the ENTIRE original notes section verbatim.
  // Never silently lose user content.
  let existingNotes = "";
  let existingNotesRaw = ""; // Full section including header, used as safety fallback
  try {
    const existing = await readFile(filePath, "utf-8");
    // Find the ## Notes header (or variants like ## Your Notes)
    const notesHeaderMatch = existing.match(/^(## (?:Your )?Notes)\s*$/m);
    if (notesHeaderMatch) {
      const headerIdx = existing.indexOf(notesHeaderMatch[0]);
      const afterHeader = existing.slice(headerIdx + notesHeaderMatch[0].length);
      // Extract content up to the next ## header or end of file
      const nextHeaderIdx = afterHeader.search(/\n## /);
      const sectionBody = nextHeaderIdx >= 0
        ? afterHeader.slice(0, nextHeaderIdx)
        : afterHeader;
      existingNotesRaw = notesHeaderMatch[0] + sectionBody;
      // Clean the body: strip placeholder text, keep user content
      const cleaned = sectionBody
        .replace(/^\*\(Your notebook.*\)\*\s*\n?/gm, "")
        .replace(/^\*Add notes throughout.*\*\s*\n?/gm, "")
        .trim();
      if (cleaned) {
        existingNotes = cleaned;
      }
      // Safety check: if the original section had non-whitespace content beyond
      // the placeholder text, but our cleaned extraction is empty, something went wrong.
      // Preserve the raw section body as-is to avoid data loss.
      const rawBodyTrimmed = sectionBody.trim();
      if (rawBodyTrimmed && !cleaned) {
        // Check if raw body has meaningful content beyond placeholder text
        const withoutPlaceholders = rawBodyTrimmed
          .replace(/\*\(Your notebook.*\)\*/g, "")
          .replace(/\*Add notes throughout.*\*/g, "")
          .trim();
        if (withoutPlaceholders) {
          console.warn("[BriefGenerator] Notes extraction returned empty but section has content — preserving raw");
          existingNotes = withoutPlaceholders;
        }
      }
    }
  } catch { /* file doesn't exist yet */ }

  // Preserve existing Agent Sessions section
  let agentSessionsBlock = "";
  try {
    const existing = await readFile(filePath, "utf-8");
    const sessionIdx = existing.indexOf("## Agent Sessions");
    if (sessionIdx >= 0) {
      const afterSession = existing.slice(sessionIdx);
      const nextHeading = afterSession.indexOf("\n## ", 1);
      agentSessionsBlock =
        "\n" + (nextHeading > 0 ? afterSession.slice(0, nextHeading) : afterSession).trimEnd() + "\n";
    }
  } catch { /* file doesn't exist yet */ }

  // ── Gather all data sources in parallel ──────────────────────────
  const [
    calendar, weather, context, xIntel, carryForward,
    frontInbox, eveningReview, overnightWork,
    cronFailures, latestReflection,
  ] = await Promise.all([
    fetchCalendarEvents().catch((e) => ({ events: [] as CalendarEvent[], error: String(e) })),
    fetchWeather().catch(() => ({ temp: null as number | null, condition: "Unknown", icon: "🌤️" })),
    readContextData(),
    fetchXIntelligence().catch(() => ({ items: [] as XIntelItem[], error: "X fetch failed" })),
    extractCarryForward(vaultPath).catch(() => ({
      unfinishedTasks: [] as string[], tomorrowHandoff: [] as string[],
      actionItems: [] as string[], yesterdayImpact: null as string | null,
    })),
    fetchFrontInbox().catch(() => ({ conversations: [] as FrontConversation[], error: "Front fetch failed" })),
    extractEveningReview(vaultPath).catch(() => ({ tomorrowHandoff: "", reflection: "" })),
    formatOvernightWorkSection().catch(() => null),
    (async () => {
      try {
        const { scanForFailures } = await import("../services/failure-notify.js");
        return await scanForFailures();
      } catch { return null; }
    })(),
    loadLatestReflection().catch(() => null),
  ]);

  if (calendar.error) warnings.push(`Calendar: ${calendar.error}`);
  if (xIntel.error) warnings.push(`X Intel: ${xIntel.error}`);
  if (frontInbox.error) warnings.push(`Front: ${frontInbox.error}`);

  // Load tasks for context — wired into the LLM prompt as a first-class data source
  let pendingTasks: { id: string; title: string; status: string; dueDate?: string | null; priority?: string }[] = [];
  try {
    const { readTasks } = await import("./tasks.js");
    const tasksData = await readTasks();
    pendingTasks = tasksData.tasks.filter((t: { status: string }) => t.status === "pending");
  } catch { /* non-fatal */ }

  // Quote of the day
  const quote = getQuoteOfDay();

  // Context values
  const userLocation = getUserLocation();
  const unit = getTempUnit();
  const weatherStr = weather.temp !== null
    ? `${weather.condition} ${weather.temp}°${unit}`
    : "Weather unavailable";
  const dateDisplay = formattedDate();
  const dow = new Date().getDay(); // 0=Sun
  const dayType = [1, 3, 5].includes(dow) ? "Focus Day — Deep work, building, minimal meetings"
    : [2, 4].includes(dow) ? "Buffer Day — Meetings, admin, catch-up"
    : "Weekend — Recharge, family, strategic thinking";

  // Format raw data blocks for the LLM prompt
  const calendarRaw = calendar.events.length > 0
    ? calendar.events.map((e) => {
        const start = new Date(e.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: getUserTimezone() });
        const end = e.endTime ? new Date(e.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: getUserTimezone() }) : "";
        return `${start}–${end}: ${e.title}`;
      }).join("\n")
    : "No meetings scheduled.";

  const frontRaw = frontInbox.conversations.length > 0
    ? JSON.stringify(frontInbox.conversations.slice(0, 20), null, 2)
    : "No inbox data available.";

  const tasksRaw = pendingTasks.length > 0
    ? pendingTasks.map((t) => {
        const due = t.dueDate ? ` (due: ${t.dueDate})` : "";
        const pri = t.priority && t.priority !== "medium" ? ` [${t.priority}]` : "";
        return `- ${t.title}${due}${pri}`;
      }).join("\n")
    : "No pending tasks.";

  const carryoverRaw = [
    ...carryForward.unfinishedTasks.map((t) => `- [ ] ${t}`),
    ...carryForward.actionItems.map((t) => `- [ ] ${t}`),
  ].join("\n") || "All clear from yesterday.";

  // REMOVED (v2 slim): impact-ledger — using carry-forward only
  let impactRaw = carryForward.yesterdayImpact || "";

  // Supplement with agent-log data for yesterday (completed items, session activity)
  try {
    const { readDailyLog } = await import("../lib/agent-log.js");
    const yesterdayLog = await readDailyLog(yesterdayDate());
    if (yesterdayLog?.content) {
      // Extract key stats from the log markdown
      const completedMatch = yesterdayLog.content.match(/Completed:\s*\*\*(\d+)\*\*/);
      const errorsMatch = yesterdayLog.content.match(/Errors:\s*\*\*(\d+)\*\*/);
      const completedCount = completedMatch ? Number(completedMatch[1]) : 0;
      const errorCount = errorsMatch ? Number(errorsMatch[1]) : 0;

      if (completedCount > 0 || errorCount > 0) {
        const logLine = `Agent log: ${completedCount} completed items${errorCount > 0 ? `, ${errorCount} errors` : ""} yesterday.`;
        impactRaw = impactRaw ? `${impactRaw}\n${logLine}` : logLine;
      }
    }
  } catch { /* agent-log not available — non-fatal */ }

  if (!impactRaw) impactRaw = "No impact report.";
  const xIntelRaw = xIntel.items.length > 0
    ? formatXIntelligence(xIntel.items, xIntel.error)
    : xIntel.error || "No X intel scan today.";

  // ── Build LLM prompt ────────────────────────────────────────────
  const BRIEF_SYSTEM_PROMPT = `You are a daily brief renderer for GodMode, a personal AI operating system. Given a template and raw data, produce a clean, scannable markdown daily brief that a founder looks forward to reading.

RULES:
1. Output ONLY the rendered markdown. No explanations, no code fences, no preamble.
2. Follow the template structure EXACTLY — sections in this order: Chief Aim, LifeTrack, Win The Day, Calendar, Communications, Yesterday's Impact, X Intelligence. Never add or reorder.
3. NO emoji in section headers. Clean: "## Chief Aim" not "## 🎯 Chief Aim"
4. Do NOT include the Notes section — it is appended separately after you.
5. The brief should end after the X Intelligence section (with its trailing ---).
6. Be CONCISE. This must be scannable in 60 seconds. Respect the reader's time.
7. For Calendar, calculate deep work windows (gaps of 90+ minutes with no meetings).
8. For Meeting Prep, only prep EXTERNAL meetings (skip internal huddles/standups). Include context about attendees if available.
9. For Communications, categorize by urgency: Action Needed (🟡), FYI.
10. Win The Day priorities: FIRST use evening review carryover (Tomorrow Handoff from yesterday). Then fill Bonus section with remaining tasks. Deduplicate.
11. If a data source is empty, show a one-line placeholder. Never skip a section.
12. All Win The Day items must use checkbox format: "1. [ ] **Task** — context"
13. Bonus items use: "- Task description"

CRITICAL: The "Tomorrow Handoff" section from yesterday's evening review is your PRIMARY source for today's Win The Day priorities. These are items the user explicitly identified as important for today. Put them FIRST in the numbered priority list, then supplement with pending tasks and carryover items. The "Pending Tasks" from tasks.json are a FIRST-CLASS data source — use them for the Bonus section and to fill any remaining priority slots after the Tomorrow Handoff items.`;

  const briefUserPrompt = `Render today's daily brief using the template and data below.

## Pre-computed Values
- Date Display: ${dateDisplay}
- Day Type: ${dayType}
- Weather: ${weatherStr}
- Location: ${userLocation || "Not configured"}
- Quote: "${quote.text}"
- Quote Author: ${quote.author}
- Yesterday: ${yesterdayDate()}
${context.chiefAim ? `- Chief Aim: ${context.chiefAim}` : "- Chief Aim: (not configured — omit section)"}
${context.streakDay !== null ? `- ${context.streakLabel}: Day ${context.streakDay}` : ""}

## Template Structure

# Daily Brief — {date_display}

**Day {n}** · {weather} · {location}

---

## Chief Aim

> {chief_aim}

**{streak_label}:** Day {streak_days} 🔥
**{day_type}**

---

## LifeTrack

> *{quote}*
> — {author}

---

## Win The Day

{PRIORITY SOURCE: Use evening review carryover (Tomorrow Handoff) as the PRIMARY source for numbered priorities. These are what the user committed to last night. If no evening review exists, fall back to pending tasks + carryover items.}

1. [ ] **{priority 1}** — {context}
2. [ ] **{priority 2}** — {context}
3. [ ] **{priority 3}** — {context}

### Bonus

{Remaining tasks not already covered by the priorities above. Deduplicate. Format: - task description}

---

## Calendar

{Calendar events as time table. Show full day.}

**Deep Work Windows:** {list 90+ min gaps}

### Meeting Prep

{External meetings only. For each: name, time, context, prep. If none: _No external meetings today._}

---

## Communications

{From Front inbox data. Categorize:}
**Action Needed:** 🟡 items
**FYI:** items
{If empty: _Inbox clear. Nice._}

---

## Yesterday's Impact

{Compact metrics line + 2-3 bullet key wins. Keep it tight.}

---

## X Intelligence

{From X intel data. If available, extract actionable signals. If not: _No X intel scan today._}

---

## RAW DATA

### PRIORITY SOURCE: Evening Review — Tomorrow Handoff (${yesterdayDate()})
These are the items the user explicitly committed to last night. Use them FIRST for Win The Day priorities.
${eveningReview.tomorrowHandoff || "(no evening review from yesterday)"}

### Evening Reflection (${yesterdayDate()})
${eveningReview.reflection || "(none)"}

### Yesterday's Reflection${latestReflection ? ` (${latestReflection.date})` : ""}
${latestReflection
  ? `- **Moved the needle:** ${latestReflection.movedNeedle}\n- **Busywork:** ${latestReflection.busywork}\n- **Avoiding:** ${latestReflection.avoiding}`
  : "(no reflection captured)"}

### Current Pending Tasks (from tasks.json — FIRST-CLASS source for Win The Day)
${tasksRaw}

### Impact Report (${yesterdayDate()})
${impactRaw}

### Front Inbox
${frontRaw}

### Calendar (${briefDate})
${calendarRaw}

### X Intelligence
${xIntelRaw}

### Carryover (incomplete from yesterday)
${carryoverRaw}

### Active Goals
${context.activeGoals.length > 0
  ? context.activeGoals.map(g => `- ${g.title}${g.area ? ` [${g.area}]` : ""}${g.progress != null ? ` (${g.progress}%)` : ""}`).join("\n")
  : "(no goals set)"}

### Agent Work Overnight
${overnightWork || "(none)"}

### Overnight Failures
${cronFailures && cronFailures.cronErrors.length > 0
  ? cronFailures.cronErrors.map(e => `- ${e.name}: ${e.consecutiveErrors} consecutive errors (last run: ${e.lastRunAt ?? "unknown"})`).join("\n")
  : "(all clear — no failures)"}
${cronFailures && cronFailures.cronErrors.length > 0 ? "\nIMPORTANT: Surface these failures prominently in the brief. The user needs to know what broke overnight." : ""}`;

  // Trust feedback is now baked directly into persona/skill markdown files
  // by trust-refinement.ts — no runtime injection needed here.

  // ── Call Claude to render the brief ─────────────────────────────
  console.log("[BriefGenerator] Calling Claude Sonnet 4.6 to render brief...");
  let briefContent = await callClaude(BRIEF_SYSTEM_PROMPT, briefUserPrompt, {
    model: "claude-sonnet-4-6-20250514",
    maxTokens: 8192,
  });

  const sections: string[] = [];

  if (briefContent) {
    // Extract section names for the response
    const headingRegex = /^## (.+)$/gm;
    let match;
    while ((match = headingRegex.exec(briefContent)) !== null) {
      sections.push(match[1].trim());
    }
    console.log(`[BriefGenerator] LLM rendered ${sections.length} sections`);
  } else {
    // Fallback: template-based assembly when no LLM available
    console.warn("[BriefGenerator] No LLM available — using template fallback");
    warnings.push("LLM unavailable — brief generated with template fallback");
    briefContent = [
      `# Daily Brief — ${dateDisplay}`,
      `${weatherStr} · ${userLocation || ""} · **${dayType}**`,
      "",
      context.chiefAim ? `> ${context.chiefAim}\n` : "",
      context.streakDay !== null ? `**${context.streakLabel}:** Day ${context.streakDay}\n` : "",
      "---", "",
      "## Win The Day", "",
      carryForward.unfinishedTasks.length > 0
        ? carryForward.unfinishedTasks.map((t, i) => `${i + 1}. [ ] **${t}**`).join("\n")
        : "*Set your top priorities for today.*",
      "", "---", "",
      "## Calendar", "", calendarRaw, "", "---", "",
      "## Communications", "",
      frontInbox.conversations.length > 0
        ? frontInbox.conversations.slice(0, 10).map((c) => `- **${c.subject}** (${c.status})`).join("\n")
        : "*Check your inbox for urgent items.*",
      "", "---", "",
      carryForward.yesterdayImpact ? `## Yesterday's Impact\n\n${carryForward.yesterdayImpact}\n\n---\n` : "",
      latestReflection ? `## Yesterday's Reflection (${latestReflection.date})\n\n- **Moved the needle:** ${latestReflection.movedNeedle}\n- **Busywork:** ${latestReflection.busywork}\n- **Avoiding:** ${latestReflection.avoiding}\n\n---\n` : "",
    ].filter(Boolean).join("\n");
    sections.push("Win The Day", "Calendar", "Communications");
  }

  // Append Notes section (sacred — never touched by AI)
  briefContent += "\n\n## Notes\n\n*(Your notebook — never touched by AI)*\n\n";
  if (existingNotes) briefContent += existingNotes + "\n\n";
  sections.push("Notes");

  // Append evening placeholders
  briefContent += "---\n\n## Today's Impact (Evening)\n\n\n";
  briefContent += "## Evening Review\n\n\n";
  briefContent += "## Tomorrow Handoff\n\n\n";
  sections.push("Today's Impact", "Evening Review", "Tomorrow Handoff");

  // Footer
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: getUserTimezone(),
  });
  briefContent += `---\n\n*Generated at ${timeStr} CT · GodMode daily brief generator*\n`;

  // Append preserved Agent Sessions
  if (agentSessionsBlock) briefContent += agentSessionsBlock;

  // Write to vault
  await mkdir(join(vaultPath, DAILY_FOLDER), { recursive: true });
  await writeFile(filePath, briefContent, "utf-8");

  // Backup to godmode memory
  const backupDir = join(MEMORY_DIR, "daily");
  try {
    await mkdir(backupDir, { recursive: true });
    await writeFile(join(backupDir, `${briefDate}.md`), briefContent, "utf-8");
  } catch { /* backup non-fatal */ }

  return {
    date: briefDate,
    path: filePath,
    sections,
    warnings,
    carryForward: {
      unfinishedTasks: carryForward.unfinishedTasks.length,
      actionItems: carryForward.actionItems.length,
      tomorrowHandoff: carryForward.tomorrowHandoff.length,
    },
  };
}

// ── Starter Brief (zero-integration fallback) ────────────────────────────────

const STARTER_TIPS = [
  "Try saying 'queue a research task on [topic]' to delegate work to an agent.",
  "You can connect your Google Calendar for a richer morning brief — ask me how.",
  "Want me to set up a recurring skill? Just tell me what you want done and when.",
  "Your Second Brain in Obsidian is where all your agent outputs land — check it out.",
  "Rate your agent outputs to build trust scores — the system learns from your feedback.",
  "Tell me your top 3 goals and I'll weave them into every morning brief.",
  "Ask me to create a dashboard — I'll build a live view of anything you want to track.",
  "You can say 'evening capture' at the end of the day to reflect and set up tomorrow.",
  "Try 'what should I focus on?' and I'll analyze your tasks, calendar, and energy.",
  "Ask me to write a persona for a specific role — content writer, researcher, admin.",
  "Your daily brief gets smarter over time as I learn your patterns and preferences.",
  "Say 'review my queue' to see what your agents have been working on overnight.",
  "Connect your Oura ring for biometric-aware energy prescriptions in your brief.",
  "You can teach me about yourself — just chat naturally and I'll remember what matters.",
  "Try 'help me plan my week' and I'll pull from your goals, tasks, and calendar.",
];

/**
 * Generate a lightweight brief that works with zero integrations.
 * Only needs name + timezone (no Calendar, no X Intel, no Obsidian).
 */
async function generateStarterBrief(): Promise<{
  date: string;
  markdown: string;
  starterBrief: true;
  sections: string[];
  warnings: string[];
}> {
  const briefDate = todayDate();
  const dateDisplay = formattedDate();

  // Resolve user name from onboarding or USER.md
  let userName = "friend";
  try {
    const onboardingPath = join(DATA_DIR, "onboarding.json");
    const raw = await readFile(onboardingPath, "utf-8");
    const ob = JSON.parse(raw) as { interview?: { name?: string }; identity?: { name?: string } };
    userName = ob.interview?.name || ob.identity?.name || userName;
  } catch { /* non-fatal */ }
  if (userName === "friend") {
    try {
      const { resolveIdentityDir } = await import("../lib/vault-paths.js");
      const identityResult = resolveIdentityDir();
      if (identityResult) {
        const userMd = await readFile(join(identityResult.path, "USER.md"), "utf-8");
        const nameMatch = userMd.match(/^[-*]\s*\*\*(?:Name|Full Name)[:\s]*\*\*\s*(.+)$/mi);
        if (nameMatch) userName = nameMatch[1].trim();
      }
    } catch { /* non-fatal */ }
  }

  // Tasks
  let taskLines = "No pending tasks yet. Tell me what you're working on!";
  try {
    const { readTasks } = await import("./tasks.js");
    const data = await readTasks();
    const pending = data.tasks.filter((t: { status: string; title: string }) => t.status === "pending");
    if (pending.length > 0) {
      taskLines = pending.slice(0, 5).map((t: { title: string; dueDate?: string | null; priority?: string }) => {
        const due = t.dueDate ? ` (due: ${t.dueDate})` : "";
        const pri = t.priority && t.priority !== "medium" ? ` [${t.priority}]` : "";
        return `- [ ] ${t.title}${due}${pri}`;
      }).join("\n");
      if (pending.length > 5) taskLines += `\n- ...and ${pending.length - 5} more`;
    }
  } catch { /* non-fatal */ }

  // Queue
  let queueLine = "Queue is empty. Delegate something!";
  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const qs = await readQueueState();
    const processing = qs.items.filter((i: { status: string }) => i.status === "processing").length;
    const review = qs.items.filter((i: { status: string }) => i.status === "review").length;
    const queued = qs.items.filter((i: { status: string }) => i.status === "queued").length;
    if (processing > 0 || review > 0 || queued > 0) {
      const parts: string[] = [];
      if (processing > 0) parts.push(`${processing} processing`);
      if (review > 0) parts.push(`${review} ready for review`);
      if (queued > 0) parts.push(`${queued} queued`);
      queueLine = parts.join(", ");
    }
  } catch { /* non-fatal */ }

  // Goals
  let goalsLines = "";
  try {
    const goalsRaw = await readFile(join(DATA_DIR, "goals.json"), "utf-8");
    const goalsData = JSON.parse(goalsRaw) as {
      goals?: Array<{ title?: string; text?: string; area?: string; progress?: number; status?: string }>;
    };
    const active = (goalsData.goals ?? [])
      .filter(g => !g.status || g.status === "active")
      .filter(g => g.title || g.text);
    if (active.length > 0) {
      goalsLines = active.slice(0, 4).map(g => {
        const title = g.title || g.text || "";
        const progress = g.progress != null ? ` — ${g.progress}%` : "";
        return `- ${title}${progress}`;
      }).join("\n");
    }
  } catch { /* non-fatal */ }

  // Yesterday's reflection
  let reflectionLines: string[] = [];
  try {
    const reflection = await loadLatestReflection();
    if (reflection) {
      reflectionLines = [
        `## Yesterday's Reflection (${reflection.date})`,
        `- **Moved the needle:** ${reflection.movedNeedle}`,
        `- **Busywork:** ${reflection.busywork}`,
        `- **Avoiding:** ${reflection.avoiding}`,
        "",
      ];
    }
  } catch { /* non-fatal */ }

  // Tip of the day (rotate by day of year)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  const tip = STARTER_TIPS[dayOfYear % STARTER_TIPS.length];

  const sections = [
    `# Good morning, ${userName}`,
    dateDisplay,
    "",
    "---",
    "",
    ...(goalsLines ? [
      "## Goals",
      goalsLines,
      "",
    ] : []),
    ...reflectionLines,
    "## Today's Focus",
    taskLines,
    "",
    "## Agent Queue",
    queueLine,
    "",
    "## Tip of the Day",
    `> ${tip}`,
    "",
    "---",
    "",
    "*Want a richer brief? Connect your calendar and X intelligence in Settings > Config.*",
  ];

  const markdown = sections.join("\n");

  return {
    date: briefDate,
    markdown,
    starterBrief: true,
    sections: ["focus", "queue", "tip"],
    warnings: [],
  };
}

// ── RPC Handler ──────────────────────────────────────────────────────────────

const generateBrief: GatewayRequestHandler = async ({ params, respond }) => {
  const { date, dryRun } = params as { date?: string; dryRun?: boolean };

  try {
    if (dryRun) {
      // Dry run: gather data but don't write
      const vaultPath = resolveVaultPath();
      if (!vaultPath) {
        // No vault — return starter brief info
        const starter = await generateStarterBrief();
        respond(true, { dryRun: true, starterBrief: true, markdown: starter.markdown });
        return;
      }

      const [calendar, weather, xIntel, carryForward] = await Promise.all([
        fetchCalendarEvents(),
        fetchWeather(),
        fetchXIntelligence(),
        extractCarryForward(vaultPath),
      ]);

      respond(true, {
        dryRun: true,
        sources: {
          calendar: {
            eventCount: calendar.events.length,
            error: calendar.error || null,
          },
          weather: {
            temp: weather.temp,
            condition: weather.condition,
          },
          xIntelligence: {
            bookmarkCount: xIntel.items.length,
            error: xIntel.error || null,
          },
          carryForward: {
            unfinishedTasks: carryForward.unfinishedTasks.length,
            actionItems: carryForward.actionItems.length,
            tomorrowHandoff: carryForward.tomorrowHandoff.length,
          },
        },
      });
      return;
    }

    // Check if vault is configured — if not, generate starter brief
    const vaultPath = resolveVaultPath();
    if (!vaultPath) {
      const starter = await generateStarterBrief();
      respond(true, starter);
      return;
    }

    const result = await generateDailyBrief(date);
    respond(true, result);
  } catch (err) {
    console.error("[BriefGenerator] Error:", err);
    respond(false, null, {
      code: "GENERATION_FAILED",
      message: `Failed to generate daily brief (${err instanceof Error ? err.message : "unknown error"})`,
    });
  }
};

/**
 * Extract action items from a specific daily note.
 * Useful for re-processing yesterday's notes on demand.
 */
const extractActions: GatewayRequestHandler = async ({ params, respond }) => {
  const { date } = params as { date?: string };
  const targetDate = date || yesterdayDate();

  const vaultPath = resolveVaultPath();
  if (!vaultPath) {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: "Obsidian vault path not configured",
    });
    return;
  }

  const filePath = join(vaultPath, DAILY_FOLDER, `${targetDate}.md`);
  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch {
    respond(true, { date: targetDate, actionItems: [], message: "No daily note found" });
    return;
  }

  const actionItems = extractActionItemsFromNotes(content);
  respond(true, {
    date: targetDate,
    actionItems,
    message: actionItems.length > 0
      ? `Found ${actionItems.length} action items in ${targetDate} notes`
      : `No action items found in ${targetDate} notes`,
  });
};

export const briefGeneratorHandlers: GatewayRequestHandlers = {
  "dailyBrief.generate": generateBrief,
  "dailyBrief.extractActions": extractActions,
};

// Export for use by other modules
export { fetchCalendarEvents, fetchWeather, fetchXIntelligence, extractCarryForward, generateDailyBrief, resolveAnthropicAuth };
