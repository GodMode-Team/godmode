/**
 * GodMode Plugin — Personal AI Operating System
 *
 * Thin wiring layer that registers all GodMode gateway methods, UI routes,
 * lifecycle hooks, and services into the OpenClaw plugin system.
 *
 * All logic lives in extracted modules:
 *   - src/lib/license.ts       — License state (open-source, always valid)
 *   - src/lib/ops-proxy.ts     — Mission Control sidecar proxy
 *   - src/lib/auto-title.ts    — LLM session auto-titling
 *   - src/hooks/gateway-start.ts     — Service initialization
 *   - src/hooks/before-prompt-build.ts — Context injection
 *   - src/hooks/lifecycle-hooks.ts    — Safety gates + session lifecycle
 *   - src/hooks/http-handler.ts       — HTTP route handler
 *   - src/cli/commands.ts             — CLI commands
 *
 * ═══════════════════════════════════════════════════════════════════════
 * Environment Variables — Required vs Optional
 * ═══════════════════════════════════════════════════════════════════════
 *
 * REQUIRED (GodMode will not function without these):
 *   ANTHROPIC_API_KEY      — Model API key. The only hard requirement.
 *                            Also resolved from Claude Code OAuth or
 *                            OpenClaw auth-profiles if not in env.
 *
 * OPTIONAL — graceful degradation when missing:
 *   GODMODE_ROOT           — Workspace root (default: ~/godmode)
 *   OPENCLAW_STATE_DIR     — OC state dir (default: ~/.openclaw)
 *   OPENCLAW_CONFIG_PATH   — OC config path (default: ~/.openclaw/openclaw.json)
 *   OBSIDIAN_VAULT_PATH    — Obsidian vault. Falls back to ~/Documents/VAULT,
 *                            then ~/godmode/memory/ if neither exists.
 *   DAILY_BRIEF_FOLDER     — Vault subfolder for daily notes (default: "01-Daily")
 *   HONCHO_API_KEY         — Honcho memory service. Without this, memory features
 *                            are disabled but chat works perfectly.
 *   GEMINI_API_KEY         — Gemini embeddings (legacy Mem0). No longer required.
 *   GOOGLE_API_KEY         — Google API key (alias for Gemini). No longer required.
 *   OPENAI_API_KEY         — OpenAI embeddings (legacy Mem0). No longer required.
 *   PAPERCLIP_URL          — Paperclip orchestration API. Without this, delegate
 *   PAPERCLIP_API_KEY        tool uses local queue-processor.
 *   PAPERCLIP_COMPANY_ID
 *   COMPOSIO_API_KEY       — Composio third-party tool auth. Without this,
 *                            composio_execute returns a helpful setup message.
 *   GOG_CALENDAR_ACCOUNT   — Google Calendar via gog CLI. Without this,
 *   GOG_CLIENT               calendar methods return empty arrays.
 *   GOG_KEYRING_PASSWORD   — Keyring password for gog CLI.
 *   XAI_API_KEY            — X/Twitter intelligence. Without this, X search
 *                            is unavailable but everything else works.
 *   GODMODE_OWNER          — Owner identifier for Honcho peer (default: "owner")
 *   GODMODE_AGENT_LOG_WRITER_MODULE — Custom agent log writer module path.
 *   GODMODE_DEBUG          — Enable debug logging for memory, retrieval, etc.
 *   GODMODE_GITHUB_REPO    — GitHub repo for auto-filed issues (default: godmode-team/godmode)
 *   OURA_API_TOKEN         — Oura Ring health data. Without this, health
 *                            section in daily brief is skipped.
 *
 * SYSTEM (read-only, not user-configured):
 *   HOME, USER, SHELL, PATH, LANG, TERM, DISPLAY, WAYLAND_DISPLAY
 * ═══════════════════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

// Method handler imports
import { agentLogHandlers } from "./src/methods/agent-log.js";
import { calendarHandlers } from "./src/methods/calendar.js";
// REMOVED (v2 slim): consciousness — Honcho replaces later
import { dailyBriefHandlers } from "./src/methods/daily-brief.js";
import { briefGeneratorHandlers } from "./src/methods/brief-generator.js";
import { goalsHandlers } from "./src/methods/goals.js";
import { onboardingHandlers } from "./src/methods/onboarding.js";
import { projectsHandlers } from "./src/methods/projects.js";
import { tasksHandlers } from "./src/methods/tasks.js";
import { teamCommsHandlers } from "./src/methods/team-comms.js";
// REMOVED (v2 slim): team-curation — not core
import { teamWorkspaceHandlers } from "./src/methods/team-workspace.js";
import { createTeamMessageTool } from "./src/tools/team-message.js";
import { createTeamMemoryWriteTool } from "./src/tools/team-memory.js";
import { integrationsHandlers } from "./src/methods/integrations.js";
import { uiSlotsHandlers } from "./src/methods/ui-slots.js";
import { workspacesHandlers } from "./src/methods/workspaces.js";
import { trustTrackerHandlers } from "./src/methods/trust-tracker.js";
import { systemUpdateHandlers, setPluginVersion } from "./src/methods/system-update.js";
import { createGuardrailTool } from "./src/tools/guardrail.js";
import { createOnboardTool } from "./src/tools/onboard.js";
import { createMorningSetTool } from "./src/tools/morning-set.js";
import { createQueueAddTool } from "./src/tools/queue-add.js";
import { createQueueCheckTool } from "./src/tools/queue-check.js";
import { createQueueActionTool } from "./src/tools/queue-action.js";
import { createTrustRateTool } from "./src/tools/trust-rate.js";
import { createXReadTool } from "./src/tools/x-read.js";
import { createHonchoQueryTool } from "./src/tools/honcho-query.js";
import { createMemorySearchShimTool } from "./src/tools/memory-search-shim.js";
import { createSelfRepairTool } from "./src/tools/self-repair.js";
import { createTasksCreateTool, createTasksListTool, createTasksUpdateTool } from "./src/tools/tasks-tool.js";
// REMOVED (v2 slim): proof-tool — not using Proof
import { createDelegateTool } from "./src/tools/delegate-tool.js";
import { createQueueSteerTool } from "./src/tools/queue-steer.js";
import { createComposioExecuteTool } from "./src/tools/composio-tool.js";
import { composioSetupHandlers } from "./src/methods/composio-setup.js";
import { deployRegistryHandlers } from "./src/methods/project-registry.js";
import { queueHandlers } from "./src/methods/queue.js";
// REMOVED (v2 slim): x-intel — OC has x_read tool
import { filesHandlers } from "./src/methods/files.js";
import { dashboardsHandlers } from "./src/methods/dashboards.js";
// REMOVED (v2 slim): impact-ledger — not core
import { guardrailsHandlers } from "./src/methods/guardrails.js";
import { imageCacheHandlers } from "./src/methods/image-cache.js";
import { secondBrainHandlers } from "./src/methods/second-brain.js";
import { supportHandlers } from "./src/methods/support.js";
// REMOVED (v2 slim): fathom-webhook — replacing with generic meeting webhook
import { authHandlers } from "./src/methods/auth.js";
import { sessionPrivacyHandlers } from "./src/methods/session-privacy.js";
import { resourcesHandlers } from "./src/methods/resources.js";
import { inboxHandlers } from "./src/services/inbox.js";
// REMOVED (v2 slim): proof-server — not using Proof
// REMOVED (v2 slim): swarm-rpc — replaced by delegate tool + queue processor

// Extracted modules
import { initLicenseFromConfig, withLicenseGate, getLicenseState } from "./src/lib/license.js";
import { generateSessionTitle } from "./src/lib/auto-title.js";
import { createStaticFileHandler } from "./src/static-server.js";
import { createGodmodeHttpHandler } from "./src/hooks/http-handler.js";
import { runGatewayStart, runGatewayStop } from "./src/hooks/gateway-start.js";
import { handleBeforePromptBuild } from "./src/hooks/before-prompt-build.js";
import {
  handleMessageReceived,
  handleBeforeReset,
  handleBeforeToolCall,
  handleMessageSending,
  handleLlmOutputPressure,
  handleLlmOutputAutoTitle,
  handleLlmOutputAgentLog,
  handleAfterToolCall,
  handleAfterCompaction,
  handleAgentEnd,
} from "./src/hooks/lifecycle-hooks.js";
import { registerCliCommands } from "./src/cli/commands.js";
// ── Version ───────────────────────────────────────────────────────────
let pluginVersion = "1.0.0";
try {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [join(moduleDir, "package.json"), join(moduleDir, "..", "package.json")];
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    const pkg = JSON.parse(readFileSync(candidate, "utf8"));
    pluginVersion = pkg.version ?? pluginVersion;
    break;
  }
} catch { /* bundled installs may not have package.json */ }
setPluginVersion(pluginVersion);

// ── Service cleanup registry ────────────────────────────────────────
const serviceCleanup: Array<{ name: string; fn: () => void | Promise<void> }> = [];

// ── Ungated methods (work before license) ───────────────────────────
const ungatedMethods = new Set([
  "onboarding.quickSetup", "onboarding.activateLicense", "onboarding.status",
  "onboarding.checklist", "onboarding.capabilities", "onboarding.update",
  "onboarding.complete", "onboarding.reset", "onboarding.assess",
  "onboarding.recommend", "onboarding.configAudit",
  "onboarding.wizard.status", "onboarding.wizard.preview",
  "onboarding.wizard.diff", "onboarding.wizard.generate",
  "onboarding.setupProgress", "onboarding.setupConfigure",
  "onboarding.setupDismiss", "onboarding.setupTest",
  "integrations.status", "integrations.test", "integrations.configure",
  "integrations.setupGuide", "integrations.platformInfo",
  "support.diagnostics", "support.logExchange", "support.escalate",
  "auth.status", "auth.login", "auth.loginPoll", "auth.logout", "auth.account",
  "paperclip.dashboardUrl",
]);

// ── Plugin definition ──────────────────────────────────────────────
const godmodePlugin = {
  id: "godmode",
  name: "GodMode",
  description: "Personal AI Operating System for entrepreneurs",

  register(api: OpenClawPluginApi) {
    const licenseKey = (api.pluginConfig as { licenseKey?: string } | undefined)?.licenseKey;
    initLicenseFromConfig(licenseKey, api.logger);

    // ── 1. Register all gateway RPC methods ───────────────────────
    const allHandlers: Record<string, unknown> = {
      ...projectsHandlers, ...tasksHandlers, ...workspacesHandlers,
      ...dailyBriefHandlers, ...briefGeneratorHandlers, ...goalsHandlers,
      ...agentLogHandlers, ...calendarHandlers, ...uiSlotsHandlers,
      ...onboardingHandlers,
      ...teamWorkspaceHandlers, ...teamCommsHandlers,
      ...trustTrackerHandlers, ...systemUpdateHandlers,
      ...guardrailsHandlers, ...imageCacheHandlers, ...secondBrainHandlers,
      ...queueHandlers, ...dashboardsHandlers, ...supportHandlers,
      ...filesHandlers, ...integrationsHandlers,
      ...authHandlers, ...sessionPrivacyHandlers,
      ...resourcesHandlers,
      ...inboxHandlers,
      ...composioSetupHandlers,
      ...deployRegistryHandlers,
    };

    for (const [method, handler] of Object.entries(allHandlers)) {
      if (ungatedMethods.has(method)) {
        api.registerGatewayMethod(method, handler as Parameters<typeof api.registerGatewayMethod>[1]);
      } else {
        const gated = withLicenseGate(licenseKey, api.logger, handler as Function);
        api.registerGatewayMethod(method, gated as Parameters<typeof api.registerGatewayMethod>[1]);
      }
    }

    api.logger.info(
      `[GodMode] Registered ${Object.keys(allHandlers).length} gateway methods (plugin v${pluginVersion})`,
    );

    // ── 2. Resolve UI asset paths ─────────────────────────────────
    const sourceDir = dirname(api.source);
    const pluginRoot = basename(sourceDir) === "dist" ? resolve(sourceDir, "..") : sourceDir;

    const godmodeUiCandidates = [
      join(pluginRoot, "dist", "godmode-ui"),
      join(pluginRoot, "ui", "dist"),
      join(pluginRoot, "assets", "godmode-ui"),
    ];
    const godmodeUiRoot = godmodeUiCandidates.find((p) => {
      const index = join(p, "index.html");
      if (!existsSync(index)) return false;
      try {
        const html = readFileSync(index, "utf8");
        return /<godmode-app\b/i.test(html);
      } catch { return false; }
    });

    // ── 3. Serve UIs + health endpoint via HTTP ───────────────────
    const godmodeHandler = godmodeUiRoot
      ? createStaticFileHandler(godmodeUiRoot, "/godmode")
      : null;

    const methodCount = Object.keys(allHandlers).length;
    const godmodeHttpHandler = createGodmodeHttpHandler({
      pluginVersion,
      getLicenseState,
      godmodeUiRoot,
      godmodeHandler,
      methodCount,
    });

    if (typeof (api as any).registerHttpRoute === "function") {
      (api as any).registerHttpRoute({ path: "/godmode", handler: godmodeHttpHandler, auth: "plugin", match: "prefix" });
      (api as any).registerHttpRoute({ path: "/reports", handler: godmodeHttpHandler, auth: "plugin", match: "prefix" });
    } else {
      console.warn("[godmode] No HTTP route registration API found — UI and health endpoints unavailable");
    }

    if (godmodeUiRoot) {
      api.logger.info(`[GodMode] Serving UI at /godmode from ${godmodeUiRoot}`);
    } else {
      api.logger.warn("[GodMode] No built UI found. Run 'pnpm build' in the plugin repo.");
    }

    // ── 4. Extra RPC methods (not license-gated) ──────────────────
    api.registerGatewayMethod("sessions.generateTitle", (async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
      const userMessage = typeof params.userMessage === "string" ? params.userMessage : "";
      const assistantMessage = typeof params.assistantMessage === "string" ? params.assistantMessage : "";
      if (!userMessage) {
        respond(false, null, { code: "MISSING_PARAM", message: "userMessage is required" });
        return;
      }
      try {
        const title = await generateSessionTitle(userMessage, assistantMessage);
        respond(true, { title: title ?? null });
      } catch (err) {
        respond(true, { title: null, error: String(err) });
      }
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    api.registerGatewayMethod("sessions.searchContent", (async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
      const query = typeof params.query === "string" ? params.query.trim() : "";
      const limit = typeof params.limit === "number" ? Math.min(params.limit, 50) : 20;
      if (!query) {
        respond(true, { ts: Date.now(), results: [] });
        return;
      }
      try {
        // ── Primary: FTS5 SQLite (fast, pre-indexed) ──────────────────
        try {
          const { isSessionSearchReady, searchMessages } = await import("./src/lib/session-search.js");
          if (isSessionSearchReady()) {
            const hits = searchMessages(query, limit * 3); // over-fetch for grouping by session
            if (hits.length > 0) {
              const grouped = new Map<string, Array<{ role: string; text: string; timestamp?: number }>>();
              for (const hit of hits) {
                if (!grouped.has(hit.sessionKey)) grouped.set(hit.sessionKey, []);
                const arr = grouped.get(hit.sessionKey)!;
                if (arr.length < 3) {
                  const text = hit.content.length > 200 ? hit.content.slice(0, 200) + "..." : hit.content;
                  arr.push({ role: hit.role, text, timestamp: hit.createdAt ? hit.createdAt * 1000 : undefined });
                }
              }
              const ftsResults: Array<{ key: string; displayName?: string; matches: Array<{ role: string; text: string; timestamp?: number }> }> = [];
              for (const [key, matches] of grouped) {
                if (ftsResults.length >= limit) break;
                ftsResults.push({ key, matches });
              }
              respond(true, { ts: Date.now(), results: ftsResults });
              return;
            }
          }
        } catch { /* FTS5 unavailable — fall through to JSONL */ }

        // ── Fallback: brute-force JSONL scan ──────────────────────────
        const queryLower = query.toLowerCase();
        const stateDir = process.env.OPENCLAW_STATE_DIR || join(homedir(), ".openclaw");
        const agentSessionsDir = join(stateDir, "agents", "main", "sessions");
        const sessionsIndexPath = join(agentSessionsDir, "sessions.json");
        if (!existsSync(sessionsIndexPath)) {
          respond(true, { ts: Date.now(), results: [] });
          return;
        }

        const sessionsIndex = JSON.parse(readFileSync(sessionsIndexPath, "utf-8")) as Record<string, {
          sessionId?: string;
          sessionFile?: string;
          updatedAt?: number;
          displayName?: string;
        }>;

        const sessionEntries = Object.entries(sessionsIndex)
          .map(([key, meta]) => ({ key, ...meta }))
          .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
          .slice(0, 200);

        const results: Array<{
          key: string; label?: string; displayName?: string;
          matches: Array<{ role: string; text: string; timestamp?: number }>;
        }> = [];

        for (const s of sessionEntries) {
          if (results.length >= limit) break;

          const nameMatch = [s.displayName, s.key]
            .filter(Boolean)
            .some((f) => f!.toLowerCase().includes(queryLower));

          const sessionFile = s.sessionFile
            ?? (s.sessionId ? join(agentSessionsDir, `${s.sessionId}.jsonl`) : null);
          if (!sessionFile || !existsSync(sessionFile)) {
            if (nameMatch) results.push({ key: s.key, displayName: s.displayName, matches: [] });
            continue;
          }

          const contentMatches: Array<{ role: string; text: string; timestamp?: number }> = [];
          try {
            const raw = readFileSync(sessionFile, "utf-8");
            for (const line of raw.split("\n")) {
              if (!line.trim()) continue;
              let entry: Record<string, unknown>;
              try { entry = JSON.parse(line); } catch { continue; }
              if (entry.type !== "message" || !entry.message) continue;
              const msg = entry.message as Record<string, unknown>;
              const content = typeof msg.content === "string"
                ? msg.content
                : Array.isArray(msg.content)
                  ? msg.content.filter((b: Record<string, unknown>) => b.type === "text").map((b: Record<string, unknown>) => b.text).join(" ")
                  : "";
              const clean = content
                .replace(/<system-context>[\s\S]*?<\/system-context>/g, "")
                .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
                .replace(/<godmode-context>[\s\S]*?<\/godmode-context>/g, "")
                .replace(/<capability-map>[\s\S]*?<\/capability-map>/g, "");
              if (clean.toLowerCase().includes(queryLower)) {
                const idx = clean.toLowerCase().indexOf(queryLower);
                const start = Math.max(0, idx - 40);
                const end = Math.min(clean.length, idx + queryLower.length + 60);
                const snippet = (start > 0 ? "..." : "") +
                  clean.slice(start, end).replace(/\n/g, " ").trim() +
                  (end < clean.length ? "..." : "");
                contentMatches.push({ role: String(msg.role), text: snippet, timestamp: entry.timestamp ? new Date(entry.timestamp as string | number).getTime() : undefined });
              }
              if (contentMatches.length >= 3) break;
            }
          } catch { /* unreadable session file */ }

          if (nameMatch || contentMatches.length > 0) {
            results.push({ key: s.key, displayName: s.displayName, matches: contentMatches });
          }
        }

        respond(true, { ts: Date.now(), results });
      } catch (err) {
        api.logger.warn(`[GodMode] sessions.searchContent error: ${String(err)}`);
        respond(false, null, { code: "SEARCH_ERROR", message: String(err) });
      }
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    api.registerGatewayMethod("godmode.status", (async ({ respond }: { respond: Function }) => {
      const licenseState = getLicenseState();
      respond(true, {
        plugin: true,
        version: pluginVersion,
        license: {
          status: licenseState.status,
          tier: licenseState.tier ?? null,
          configured: !!licenseKey,
        },
        methods: methodCount + 1,
        ui: godmodeUiRoot ? "available" : "not built",
        source: "plugin",
      });
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    // Active model — UI calls this to display the model pill in the chat toolbar.
    api.registerGatewayMethod("godmode.config.model", (async ({ respond }: { respond: Function }) => {
      try {
        const { resolveConfigPath } = await import("./src/lib/openclaw-state.js");
        const cfgPath = resolveConfigPath();
        if (existsSync(cfgPath)) {
          const raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
          const primary = raw?.agents?.defaults?.model?.primary ?? raw?.defaults?.model?.primary ?? null;
          const available: { id: string; name: string; provider: string }[] = [];
          const providers = raw?.models?.providers;
          if (providers && typeof providers === "object") {
            for (const [provKey, prov] of Object.entries(providers)) {
              for (const m of ((prov as Record<string, unknown>).models as any[]) ?? []) {
                available.push({ id: `${provKey}/${m.id}`, name: m.name ?? m.id, provider: provKey });
              }
            }
          }
          respond(true, { primary, available });
        } else {
          respond(true, { primary: null, available: [] });
        }
      } catch {
        respond(true, { primary: null, available: [] });
      }
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    // Set active model — UI model picker calls this for quick model switching.
    api.registerGatewayMethod("godmode.config.model.set", (async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
      try {
        const { resolveConfigPath } = await import("./src/lib/openclaw-state.js");
        const cfgPath = resolveConfigPath();
        const primary = params?.primary as string;
        if (!primary) { respond(false, { error: "primary is required" }); return; }
        let raw: Record<string, unknown> = {};
        if (existsSync(cfgPath)) {
          raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
        }
        if (!raw.agents) raw.agents = {};
        const agents = raw.agents as Record<string, unknown>;
        if (!agents.defaults) agents.defaults = {};
        const defaults = agents.defaults as Record<string, unknown>;
        if (!defaults.model) defaults.model = {};
        const model = defaults.model as Record<string, unknown>;
        model.primary = primary;
        if (primary.startsWith("anthropic/")) {
          model.fallbacks = ["openai-codex/gpt-5.3-codex"];
        } else {
          model.fallbacks = ["anthropic/claude-sonnet-4-6"];
        }
        writeFileSync(cfgPath, JSON.stringify(raw, null, 2), "utf-8");
        respond(true, { primary, fallbacks: model.fallbacks });
      } catch (err) {
        respond(false, { error: String(err) });
      }
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    api.registerGatewayMethod("godmode.health", (async ({ respond }: { respond: Function }) => {
      try {
        const { getHealthReport } = await import("./src/services/self-heal.js");
        const { sessions } = await import("./src/lib/health-ledger.js");
        const { getLastCrash } = await import("./src/lib/restart-sentinel.js");
        const report = getHealthReport();
        const crash = getLastCrash();
        respond(true, {
          ...report,
          activeSessions: sessions.activeCount(),
          activeSessionKeys: sessions.activeKeys(),
          crashRecovery: crash ? {
            error: crash.error,
            downtimeMs: crash.downtimeMs,
            type: crash.type,
            previousSessions: crash.previousSessions,
          } : undefined,
        });
      } catch (err) {
        respond(true, { ts: Date.now(), overall: "offline", subsystems: [], lastRepairSummary: null, activeSessions: 0, error: String(err) });
      }
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    api.registerGatewayMethod("godmode.health.repair", (async ({ respond }: { respond: Function }) => {
      try {
        const { runSelfHeal } = await import("./src/services/self-heal.js");
        const result = await runSelfHeal(api.logger, (event: string, data: unknown) => {
          try { (api as any).broadcast?.(event, data); } catch { /* non-fatal */ }
        });
        respond(true, result);
      } catch (err) {
        respond(false, null, { code: "HEAL_FAILED", message: String(err) });
      }
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    api.registerGatewayMethod("godmode.skills.list", (async ({ respond }: { respond: Function }) => {
      try {
        const { loadSkillCards } = await import("./src/lib/skill-cards.js");
        const { loadSkills } = await import("./src/lib/skills-registry.js");
        const cards = loadSkillCards().map((c) => ({
          slug: c.slug,
          name: c.domain,
          type: "card" as const,
          triggers: c.triggers,
          tools: c.tools,
          body: c.body,
        }));
        const skills = loadSkills().map((s) => ({
          slug: s.slug,
          name: s.name,
          type: "skill" as const,
          trigger: s.trigger,
          schedule: s.schedule ?? null,
          persona: s.persona ?? null,
          taskType: s.taskType,
          priority: s.priority,
          body: s.body,
        }));
        respond(true, { cards, skills, total: cards.length + skills.length });
      } catch (err) {
        respond(true, { cards: [], skills: [], total: 0, error: String(err) });
      }
    }) as Parameters<typeof api.registerGatewayMethod>[1]);

    // ── 5. Lifecycle hooks ────────────────────────────────────────
    api.on("gateway_start", async () => {
      api.logger.info("[GodMode] Gateway started — plugin active");
      await runGatewayStart(api, pluginVersion, pluginRoot, serviceCleanup, methodCount);

      // Init Composio (non-blocking — logs status and continues)
      import("./src/services/composio-client.js").then(({ init }) => {
        init(process.env.COMPOSIO_API_KEY, api.logger).catch(() => {});
      }).catch(() => {});
    });

    api.on("gateway_stop", async () => {
      await runGatewayStop(serviceCleanup, api.logger);
    });

    api.on("message_received", async (event, ctx) => {
      await handleMessageReceived(event, ctx, api);
    });

    api.on("before_prompt_build", async (event, ctx) => {
      return handleBeforePromptBuild(event, ctx, api, pluginRoot);
    });

    api.on("before_reset", async (event, ctx) => {
      await handleBeforeReset(event, ctx, api);
    });

    api.on("before_tool_call", (async (event: Record<string, unknown>, ctx: Record<string, unknown>) => {
      return handleBeforeToolCall(event, ctx, api);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- SDK return type is narrower than our union
    }) as any);

    api.on("message_sending", async (event, ctx) => {
      return handleMessageSending(event, ctx, api);
    });

    api.on("llm_output", async (event, ctx) => {
      await handleLlmOutputPressure(event, ctx, api);
    });

    api.on("llm_output", async (event, ctx) => {
      await handleLlmOutputAutoTitle(event, ctx, api);
    });

    api.on("llm_output", async (event, ctx) => {
      await handleLlmOutputAgentLog(event, ctx);
    });

    api.on("after_compaction", async (event, ctx) => {
      await handleAfterCompaction(event, ctx, api);
    });

    api.on("after_tool_call", async (event, ctx) => {
      await handleAfterToolCall(event, ctx, api);
    });

    api.on("agent_end", async (event: any, ctx: any) => {
      await handleAgentEnd(event, ctx, api);
    });

    // ── 6. Tools ──────────────────────────────────────────────────
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createTeamMessageTool(ctx));
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createTeamMemoryWriteTool(ctx));
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createOnboardTool(ctx));
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createMorningSetTool(ctx));
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createGuardrailTool(ctx));
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createQueueAddTool(ctx));
    api.registerTool(() => createQueueCheckTool());
    api.registerTool(() => createQueueActionTool());
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createTrustRateTool(ctx));
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createXReadTool(ctx));
    api.registerTool((ctx: { sessionKey?: string; agentId?: string }) => createHonchoQueryTool(ctx));
    api.registerTool((ctx: { sessionKey?: string }) => createMemorySearchShimTool(ctx));
    api.registerTool(() => createSelfRepairTool());
    api.registerTool(() => createTasksCreateTool());
    api.registerTool(() => createTasksListTool());
    api.registerTool(() => createTasksUpdateTool());
    // REMOVED (v2 slim): createProofEditorTool
    api.registerTool(() => createQueueSteerTool());
    api.registerTool((ctx: { sessionKey?: string }) => createDelegateTool(ctx));
    api.registerTool(() => createComposioExecuteTool());

    // ── 7. CLI commands ───────────────────────────────────────────
    api.registerCli(
      registerCliCommands({
        pluginVersion,
        licenseKey,
        godmodeUiRoot,
        methodCount,
        api,
      }),
      { commands: ["godmode"] },
    );
  },
};

export default godmodePlugin;
