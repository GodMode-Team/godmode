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
import { readFileSync } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import {
  DATA_DIR,
  GODMODE_ROOT,
  MEMORY_DIR,
  resolveVaultPath,
  DAILY_FOLDER,
  localDateString,
} from "../data-paths.js";
import { getUserTimezone, getUserLocation, getTempUnit } from "../lib/user-config.js";

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
      const value = line.slice(eqIdx + 1).trim();
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
      `gog calendar events --account ${account} --client ${client} --json 2>/dev/null || gog calendar events --account ${account} --client ${client}`,
      {
        timeout: EXEC_TIMEOUT,
        env: {
          ...process.env,
          PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH}`,
        },
      },
    );

    // Try JSON parse first
    try {
      const parsed = JSON.parse(stdout);
      if (Array.isArray(parsed)) {
        return { events: parsed };
      }
      if (parsed.events) {
        return { events: parsed.events };
      }
    } catch {
      // Fall back to text parsing
    }

    // Text format: id\tstartStr\tendStr\ttitle
    const events: CalendarEvent[] = [];
    for (const line of stdout.trim().split("\n").filter(Boolean)) {
      const parts = line.split(/\s{2,}|\t/).map((p) => p.trim());
      if (parts.length < 4) continue;
      const [id, startStr, endStr, ...titleParts] = parts;
      try {
        const startTime = new Date(startStr).getTime();
        const endTime = new Date(endStr).getTime();
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
        `${fromH > 12 ? fromH - 12 : fromH}${fromH >= 12 ? "PM" : "AM"}-${toH > 12 ? toH - 12 : toH}${toH >= 12 ? "PM" : "PM"}`,
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

// ── Data source: Oura ────────────────────────────────────────────────────────

type OuraData = {
  readiness: number | null;
  sleepScore: number | null;
  sleepDuration: string | null;
  hrv: number | null;
  rhr: number | null;
  mode: string;
  insight: string;
};

async function fetchOuraData(): Promise<OuraData> {
  const token = getEnv("OURA_API_TOKEN");
  if (!token) {
    return {
      readiness: null,
      sleepScore: null,
      sleepDuration: null,
      hrv: null,
      rhr: null,
      mode: "Unknown",
      insight: "Oura data unavailable — OURA_API_TOKEN not set.",
    };
  }

  const yesterday = yesterdayDate();

  try {
    // Fetch readiness
    const readinessResp = await fetch(
      `https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${yesterday}`,
      { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) },
    );
    const readinessData = (await readinessResp.json()) as {
      data?: Array<{ score?: number; contributors?: Record<string, number> }>;
    };
    const latest = readinessData.data?.[readinessData.data.length - 1];
    const readiness = latest?.score ?? null;

    // Fetch sleep
    const sleepResp = await fetch(
      `https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${yesterday}`,
      { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) },
    );
    const sleepData = (await sleepResp.json()) as {
      data?: Array<{
        score?: number;
        contributors?: Record<string, number>;
      }>;
    };
    const sleepLatest = sleepData.data?.[sleepData.data.length - 1];
    const sleepScore = sleepLatest?.score ?? null;

    // Fetch heart rate / HRV from sleep periods
    const sleepPeriodsResp = await fetch(
      `https://api.ouraring.com/v2/usercollection/sleep?start_date=${yesterday}`,
      { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) },
    );
    const sleepPeriods = (await sleepPeriodsResp.json()) as {
      data?: Array<{
        average_hrv?: number;
        lowest_heart_rate?: number;
        total_sleep_duration?: number;
      }>;
    };
    const longestSleep = sleepPeriods.data?.reduce(
      (longest, current) =>
        (current.total_sleep_duration ?? 0) > (longest?.total_sleep_duration ?? 0)
          ? current
          : longest,
      sleepPeriods.data[0],
    );
    const hrv = longestSleep?.average_hrv ?? null;
    const rhr = longestSleep?.lowest_heart_rate ?? null;
    const totalSleepSec = longestSleep?.total_sleep_duration ?? null;
    const sleepDuration = totalSleepSec
      ? `${Math.floor(totalSleepSec / 3600)}h ${Math.floor((totalSleepSec % 3600) / 60)}m`
      : null;

    // Determine mode
    let mode = "Unknown";
    let modeEmoji = "⚪";
    if (readiness !== null) {
      if (readiness >= 85) {
        mode = "Peak";
        modeEmoji = "🟢";
      } else if (readiness >= 70) {
        mode = "Steady State";
        modeEmoji = "🟡";
      } else if (readiness >= 55) {
        mode = "Conserve";
        modeEmoji = "🟠";
      } else {
        mode = "Recovery";
        modeEmoji = "🔴";
      }
    }

    const insight = generateOuraInsight(readiness, sleepScore, hrv);

    return {
      readiness,
      sleepScore,
      sleepDuration,
      hrv,
      rhr,
      mode: `${readiness ?? "--"} ${modeEmoji} ${mode}`,
      insight,
    };
  } catch (err) {
    return {
      readiness: null,
      sleepScore: null,
      sleepDuration: null,
      hrv: null,
      rhr: null,
      mode: "Unknown",
      insight: `Oura fetch failed: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }
}

function generateOuraInsight(
  readiness: number | null,
  sleep: number | null,
  hrv: number | null,
): string {
  if (readiness === null) return "No Oura data available. Trust your body.";

  const parts: string[] = [];
  if (readiness >= 85) {
    parts.push("Peak day — push hard on your top priority.");
  } else if (readiness >= 70) {
    parts.push("Solid foundation. Execute the plan, take breaks every 90 min.");
  } else if (readiness >= 55) {
    parts.push("Conserve mode. Prioritize deep work in the morning, protect your evening.");
  } else {
    parts.push("Recovery day. Minimum viable work, extra rest.");
  }

  if (hrv !== null && hrv < 30) {
    parts.push("HRV is low — add breathwork between focus sessions.");
  }
  if (sleep !== null && sleep < 60) {
    parts.push("Sleep was rough — consider a power nap if energy dips.");
  }

  return parts.join(" ");
}

function formatBodyCheck(oura: OuraData): string {
  const readinessStr = oura.readiness !== null ? String(oura.readiness) : "--";
  const sleepStr = oura.sleepScore !== null ? String(oura.sleepScore) : "--";
  const sleepDur = oura.sleepDuration ? ` (${oura.sleepDuration})` : "";
  const hrvStr = oura.hrv !== null ? `${oura.hrv}ms` : "--ms";
  const rhrStr = oura.rhr !== null ? `${oura.rhr}bpm` : "--bpm";

  return `**Readiness: ${oura.mode}** · Sleep ${sleepStr}${sleepDur} · HRV ${hrvStr} · RHR ${rhrStr}\n\n${oura.insight}`;
}

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

// XAI key loading now shared via x-client service
import { getXaiApiKey } from "../services/x-client.js";

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
      const optionsPath = join(
        process.env.GODMODE_ROOT || join((await import("node:os")).homedir(), "godmode"),
        "data",
        "godmode-options.json",
      );
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

// ── Data source: Proactive Intelligence insights ──────────────────────────────

async function formatIntelligenceSection(): Promise<string | null> {
  // Check if brief integration is enabled
  try {
    const optionsPath = join(
      process.env.GODMODE_ROOT || join((await import("node:os")).homedir(), "godmode"),
      "data",
      "godmode-options.json",
    );
    const raw = JSON.parse(await readFile(optionsPath, "utf-8")) as Record<string, unknown>;
    if (raw["proactiveIntel.briefIntegration.enabled"] === false) return null;
    if (raw["proactiveIntel.enabled"] === false) return null;
  } catch {
    // Options not available — proceed with defaults (enabled)
  }

  try {
    const { getActiveInsights } = await import("../services/advisor.js");
    const { readUserPatterns } = await import("../services/observer.js");

    const insights = await getActiveInsights();
    const patterns = await readUserPatterns();

    if (insights.length === 0 && !patterns) return null;

    const lines: string[] = [];

    // Top insights
    if (insights.length > 0) {
      const topInsights = insights.slice(0, 5);
      lines.push(`**${insights.length} active insight${insights.length === 1 ? "" : "s"}:**`);
      lines.push("");
      for (const insight of topInsights) {
        const prio = insight.priority === "high" || insight.priority === "urgent" ? "**!!**" : "";
        lines.push(`- ${prio} ${insight.title}`);
      }
      if (insights.length > 5) {
        lines.push(`\n*+${insights.length - 5} more — check Discoveries tab*`);
      }
    }

    // Pattern summary
    if (patterns) {
      lines.push("");
      const parts: string[] = [];
      if (patterns.taskPatterns.completionRate7d > 0) {
        parts.push(`Completion rate: ${Math.round(patterns.taskPatterns.completionRate7d * 100)}%`);
      }
      if (patterns.taskPatterns.stuckTasks.length > 0) {
        parts.push(`${patterns.taskPatterns.stuckTasks.length} stuck task${patterns.taskPatterns.stuckTasks.length === 1 ? "" : "s"}`);
      }
      if (patterns.goalStatus.stalledGoals.length > 0) {
        parts.push(`${patterns.goalStatus.stalledGoals.length} stalled goal${patterns.goalStatus.stalledGoals.length === 1 ? "" : "s"}`);
      }
      if (parts.length > 0) {
        lines.push(`**Patterns:** ${parts.join(" · ")}`);
      }
    }

    return lines.length > 0 ? lines.join("\n") : null;
  } catch {
    return null;
  }
}

// ── Data source: Overnight Agent Work (queue processor) ──────────────────────

async function formatOvernightWorkSection(): Promise<string | null> {
  const { readQueueState } = await import("../lib/queue-state.js");
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
  const wtdMatch = content.match(
    /##\s*(?:🎯\s*)?Win The Day[\s\S]*?(?=^##\s[^#]|\n---\n|$)/m,
  );
  if (wtdMatch) {
    const checkboxRegex = /^(?:\d+\.|-|\*)\s*\[ \]\s*(.+)$/gm;
    let match;
    while ((match = checkboxRegex.exec(wtdMatch[0])) !== null) {
      const title = match[1]
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\s*[—–]\s+.+$/, "")
        .trim();
      if (title) result.unfinishedTasks.push(title);
    }
  }

  // Extract Tomorrow Handoff section
  const handoffMatch = content.match(
    /##\s*Tomorrow\s*(?:Handoff|Plan|Priorities)[\s\S]*?(?=^##\s[^#]|\n---\n|$)/m,
  );
  if (handoffMatch) {
    const items = handoffMatch[0]
      .split("\n")
      .slice(1) // skip heading
      .map((l) => l.replace(/^\s*[-*]\s*/, "").trim())
      .filter(Boolean);
    result.tomorrowHandoff = items;
  }

  // Extract Yesterday's Impact section for reference
  const impactMatch = content.match(
    /##\s*(?:📈\s*)?(?:Yesterday'?s?\s*)?Impact[\s\S]*?(?=^##\s[^#]|\n---\n|$)/m,
  );
  if (impactMatch) {
    result.yesterdayImpact = impactMatch[0]
      .split("\n")
      .slice(1)
      .join("\n")
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

  // Read chief aim from THESIS.md (no hardcoded fallback)
  let chiefAim = "";
  try {
    const thesis = await readFile(join(MEMORY_DIR, "THESIS.md"), "utf-8");
    const aimMatch = thesis.match(/(?:chief\s*aim|vision|mission)[:\s]*>?\s*(.+)/i);
    if (aimMatch) chiefAim = aimMatch[1].trim();
  } catch {
    // No THESIS.md — chief aim stays empty
  }

  return {
    chiefAim,
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
    throw new Error("Obsidian vault path not configured. Set OBSIDIAN_VAULT_PATH.");
  }

  const filePath = join(vaultPath, DAILY_FOLDER, `${briefDate}.md`);
  const warnings: string[] = [];

  // Fetch all data sources in parallel
  const [calendar, oura, weather, context, xIntel, carryForward] = await Promise.all([
    fetchCalendarEvents().catch((e) => ({
      events: [] as CalendarEvent[],
      error: String(e),
    })),
    fetchOuraData().catch(() => ({
      readiness: null,
      sleepScore: null,
      sleepDuration: null,
      hrv: null,
      rhr: null,
      mode: "Unknown",
      insight: "Oura fetch failed.",
    })),
    fetchWeather().catch(() => ({
      temp: null as number | null,
      condition: "Unknown",
      icon: "🌤️",
    })),
    readContextData(),
    fetchXIntelligence().catch(() => ({
      items: [] as XIntelItem[],
      error: "X fetch failed",
    })),
    extractCarryForward(vaultPath).catch(() => ({
      unfinishedTasks: [] as string[],
      tomorrowHandoff: [] as string[],
      actionItems: [] as string[],
      yesterdayImpact: null as string | null,
    })),
  ]);

  if (calendar.error) warnings.push(`Calendar: ${calendar.error}`);
  if (xIntel.error) warnings.push(`X Intel: ${xIntel.error}`);

  // Determine day type
  const meetingCount = calendar.events.filter((e) => {
    const s = new Date();
    s.setHours(0, 0, 0, 0);
    return e.startTime >= s.getTime() && e.startTime < s.getTime() + 86_400_000;
  }).length;
  const dayType =
    meetingCount === 0
      ? "**Focus Day** — Deep work, building, minimal meetings"
      : meetingCount <= 2
        ? "**Buffer Day** — Meetings + focused work"
        : "**Meeting Day** — Execution between calls";

  // Weather line
  const userLocation = getUserLocation();
  const unit = getTempUnit();
  const weatherLine =
    weather.temp !== null && userLocation
      ? `${weather.icon} ${weather.condition} ${weather.temp}°${unit} · ${userLocation}`
      : userLocation
        ? userLocation
        : "";

  // Build carry-forward section for Win The Day
  const allCarryItems = [
    ...carryForward.tomorrowHandoff,
    ...carryForward.unfinishedTasks.filter(
      (t) => !carryForward.tomorrowHandoff.some((h) => h.toLowerCase().includes(t.toLowerCase())),
    ),
  ];

  // Win The Day: carry-forward items as numbered checkboxes + session links
  // Load tasks and queue data for session linking
  let tasksForLinking: { id: string; title: string; sessionId: string | null; status: string }[] = [];
  let queueItemsForLinking: { sourceTaskId?: string; status: string }[] = [];
  const godmodeHost = process.env.GODMODE_WEB_HOST ?? process.env.TAILSCALE_HOSTNAME ?? "";
  try {
    const { readTasks } = await import("./tasks.js");
    const tasksData = await readTasks();
    tasksForLinking = tasksData.tasks.filter(t => t.status === "pending");
  } catch { /* non-fatal */ }
  try {
    const { readQueueState } = await import("../lib/queue-state.js");
    const queueState = await readQueueState();
    queueItemsForLinking = queueState.items;
  } catch { /* non-fatal */ }

  const winTheDayLines: string[] = [];
  let idx = 1;
  for (const item of allCarryItems.slice(0, 6)) {
    let sessionLink = "";
    if (godmodeHost) {
      // Try to match carry-forward item to a tasks.json task
      const matchedTask = tasksForLinking.find(
        t => t.title.toLowerCase() === item.toLowerCase() ||
             item.toLowerCase().includes(t.title.toLowerCase()),
      );
      if (matchedTask) {
        const hasWork = queueItemsForLinking.some(
          qi => qi.sourceTaskId === matchedTask.id && (qi.status === "review" || qi.status === "done"),
        );
        if (hasWork && matchedTask.sessionId) {
          sessionLink = ` [→ Review](${godmodeHost}/godmode/chat?session=${encodeURIComponent(matchedTask.sessionId)})`;
        } else if (matchedTask.sessionId) {
          sessionLink = ` [→ Open](${godmodeHost}/godmode/chat?session=${encodeURIComponent(matchedTask.sessionId)})`;
        } else {
          sessionLink = ` [→ Open](${godmodeHost}/godmode/chat?openTask=${encodeURIComponent(matchedTask.id)})`;
        }
      }
    }
    winTheDayLines.push(`${idx}. [ ] **${item}**${sessionLink}`);
    idx++;
  }
  if (winTheDayLines.length === 0) {
    winTheDayLines.push("*Set your top priorities for today.*");
  }

  // Action items from yesterday's notes
  const actionItemLines: string[] = [];
  if (carryForward.actionItems.length > 0) {
    for (const item of carryForward.actionItems.slice(0, 8)) {
      actionItemLines.push(`- [ ] ${item}`);
    }
  }

  // Assemble sections
  const sections: string[] = [];
  const brief: string[] = [];

  // Header — compact context line
  brief.push(`# Daily Brief — ${formattedDate()}`);
  const headerParts = [weatherLine, dayType].filter(Boolean);
  brief.push(headerParts.join(" · "));
  brief.push("");

  // Chief Aim — single blockquote (only if configured)
  if (context.chiefAim) {
    brief.push(`> ${context.chiefAim}`);
    brief.push("");
  }

  // Win The Day — the core of the brief, first real content
  sections.push("Win The Day");
  brief.push("## Win The Day");
  brief.push("");
  brief.push(winTheDayLines.join("\n"));
  brief.push("");

  // Action Items from Yesterday (if any)
  if (actionItemLines.length > 0) {
    sections.push("Action Items from Yesterday");
    brief.push("### Action Items from Yesterday");
    brief.push("");
    brief.push(actionItemLines.join("\n"));
    brief.push("");
  }

  // Streak counter — only shown if user has configured a streak in CONTEXT.md
  if (context.streakDay !== null) {
    brief.push(`**${context.streakLabel}:** Day ${context.streakDay}`);
    brief.push("");
  }
  brief.push("---");
  brief.push("");

  // Overnight Work (from queue processor)
  try {
    const overnightSection = await formatOvernightWorkSection();
    if (overnightSection) {
      sections.push("Your Agents Overnight");
      brief.push("## Your Agents Overnight");
      brief.push("");
      brief.push(overnightSection);
      brief.push("");
      brief.push("---");
      brief.push("");
    }
  } catch {
    // Queue not available — skip silently
  }

  // Calendar & Comms — merged section for external inputs
  sections.push("Calendar & Comms");
  brief.push("## Calendar & Comms");
  brief.push("");
  brief.push("**Schedule:**");
  brief.push(formatCalendarSection(calendar.events, calendar.error));
  brief.push("");

  // Meeting Prep
  const meetingPrep = await formatMeetingPrepSection(calendar.events);
  if (meetingPrep && meetingPrep !== "_No external meetings today._") {
    brief.push("### Meeting Prep");
    brief.push("");
    brief.push(meetingPrep);
    brief.push("");
  }

  // Communications
  brief.push("**Comms — Action Needed:**");
  brief.push("*Check Front inbox for urgent items.*");
  brief.push("");
  brief.push("---");
  brief.push("");

  // Yesterday's Impact
  if (carryForward.yesterdayImpact) {
    sections.push("Yesterday's Impact");
    brief.push("## Yesterday's Impact");
    brief.push("");
    brief.push(carryForward.yesterdayImpact);
    brief.push("");
    brief.push("---");
    brief.push("");
  }

  // X Intelligence
  sections.push("X Intelligence");
  brief.push("## X Intelligence");
  brief.push("");
  brief.push(formatXIntelligence(xIntel.items, xIntel.error));
  brief.push("");
  brief.push("---");
  brief.push("");

  // GodMode Intelligence (from Proactive Intel system)
  try {
    const intelSection = await formatIntelligenceSection();
    if (intelSection) {
      sections.push("GodMode Intelligence");
      brief.push("## GodMode Intelligence");
      brief.push("");
      brief.push(intelSection);
      brief.push("");
      brief.push("---");
      brief.push("");
    }
  } catch {
    // Proactive Intel not available — skip silently
  }

  // Notes — user's notebook, never touched by AI
  sections.push("Notes");
  brief.push("## Notes");
  brief.push("");
  brief.push("*(Your notebook — never touched by AI)*");
  brief.push("");
  brief.push("---");
  brief.push("");

  // Body Check — below the fold, informational not motivational
  sections.push("Body Check");
  brief.push("## Body Check");
  brief.push("");
  brief.push(formatBodyCheck(oura));
  brief.push("");
  brief.push("---");
  brief.push("");

  // Today's Impact (Evening) — filled at end of day
  sections.push("Today's Impact");
  brief.push("## Today's Impact (Evening)");
  brief.push("");
  brief.push("");

  // Evening Review — filled at 9PM
  sections.push("Evening Review");
  brief.push("## Evening Review");
  brief.push("");
  brief.push("");

  // Streak reminder in evening (only if configured)
  if (context.streakDay !== null) {
    brief.push(`**${context.streakLabel}:** Day ${context.streakDay} — Well done.`);
    brief.push("");
  }

  // Retain — session harvests
  sections.push("Retain");
  brief.push("## Retain");
  brief.push("");
  brief.push("");

  // Footer
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: getUserTimezone(),
  });
  brief.push("---");
  brief.push("");
  brief.push(`*Generated at ${timeStr} CT · GodMode daily brief generator*`);

  const briefContent = brief.join("\n");

  // Write to vault
  await mkdir(join(vaultPath, DAILY_FOLDER), { recursive: true });
  await writeFile(filePath, briefContent, "utf-8");

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

// ── RPC Handler ──────────────────────────────────────────────────────────────

const generateBrief: GatewayRequestHandler = async ({ params, respond }) => {
  const { date, dryRun } = params as { date?: string; dryRun?: boolean };

  try {
    if (dryRun) {
      // Dry run: gather data but don't write
      const vaultPath = resolveVaultPath();
      if (!vaultPath) {
        respond(false, null, {
          code: "INVALID_REQUEST",
          message: "Obsidian vault path not configured",
        });
        return;
      }

      const [calendar, oura, weather, xIntel, carryForward] = await Promise.all([
        fetchCalendarEvents(),
        fetchOuraData(),
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
          oura: {
            readiness: oura.readiness,
            sleepScore: oura.sleepScore,
            mode: oura.mode,
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

    const result = await generateDailyBrief(date);
    respond(true, result);
  } catch (err) {
    console.error("[BriefGenerator] Error:", err);
    respond(false, null, {
      code: "GENERATION_FAILED",
      message: err instanceof Error ? err.message : "Failed to generate daily brief",
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
export { fetchCalendarEvents, fetchOuraData, fetchWeather, fetchXIntelligence, extractCarryForward };
