/**
 * GodMode Plugin — Personal AI Operating System
 *
 * Thin wiring layer that registers all GodMode gateway methods, UI routes,
 * lifecycle hooks, and services into the OpenClaw plugin system.
 *
 * All logic lives in extracted modules:
 *   - src/lib/license.ts       — License validation + RPC gate
 *   - src/lib/ops-proxy.ts     — Mission Control sidecar proxy
 *   - src/lib/auto-title.ts    — LLM session auto-titling
 *   - src/hooks/gateway-start.ts     — Service initialization
 *   - src/hooks/before-prompt-build.ts — Context injection
 *   - src/hooks/lifecycle-hooks.ts    — Safety gates + session lifecycle
 *   - src/hooks/http-handler.ts       — HTTP route handler
 *   - src/cli/commands.ts             — CLI commands
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

// Method handler imports
import { agentLogHandlers } from "./src/methods/agent-log.js";
import { calendarHandlers } from "./src/methods/calendar.js";
import { consciousnessHandlers } from "./src/methods/consciousness.js";
import { dailyBriefHandlers } from "./src/methods/daily-brief.js";
import { briefGeneratorHandlers } from "./src/methods/brief-generator.js";
import { goalsHandlers } from "./src/methods/goals.js";
import { onboardingHandlers } from "./src/methods/onboarding.js";
import { projectsHandlers } from "./src/methods/projects.js";
import { tasksHandlers } from "./src/methods/tasks.js";
import { teamCommsHandlers } from "./src/methods/team-comms.js";
import { teamCurationHandlers } from "./src/methods/team-curation.js";
import { teamWorkspaceHandlers } from "./src/methods/team-workspace.js";
import { createTeamMessageTool } from "./src/tools/team-message.js";
import { createTeamMemoryWriteTool } from "./src/tools/team-memory.js";
import { integrationsHandlers } from "./src/methods/integrations.js";
import { uiSlotsHandlers } from "./src/methods/ui-slots.js";
import { workspacesHandlers } from "./src/methods/workspaces.js";
import { optionsHandlers } from "./src/methods/options.js";
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
import { createSelfRepairTool } from "./src/tools/self-repair.js";
import { createTasksCreateTool, createTasksListTool, createTasksUpdateTool } from "./src/tools/tasks-tool.js";
import { createProofEditorTool } from "./src/tools/proof-tool.js";
import { createQueueSteerTool } from "./src/tools/queue-steer.js";
import { queueHandlers } from "./src/methods/queue.js";
import { xIntelHandlers } from "./src/methods/x-intel.js";
import { filesHandlers } from "./src/methods/files.js";
import { dashboardsHandlers } from "./src/methods/dashboards.js";
import { guardrailsHandlers } from "./src/methods/guardrails.js";
import { imageCacheHandlers } from "./src/methods/image-cache.js";
import { secondBrainHandlers } from "./src/methods/second-brain.js";
import { supportHandlers } from "./src/methods/support.js";
import { fathomWebhookHandlers } from "./src/methods/fathom-webhook.js";
import { authHandlers } from "./src/methods/auth.js";
import { sessionPrivacyHandlers } from "./src/methods/session-privacy.js";
import { resourcesHandlers } from "./src/methods/resources.js";
import { inboxHandlers } from "./src/services/inbox.js";

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
  handleAfterCompaction,
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
  "integrations.status", "integrations.test", "integrations.configure",
  "integrations.setupGuide", "integrations.platformInfo",
  "support.diagnostics", "support.logExchange", "support.escalate",
  "auth.status", "auth.login", "auth.loginPoll", "auth.logout", "auth.account",
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
      ...onboardingHandlers, ...consciousnessHandlers,
      ...teamWorkspaceHandlers, ...teamCommsHandlers, ...teamCurationHandlers,
      ...optionsHandlers, ...trustTrackerHandlers, ...systemUpdateHandlers,
      ...guardrailsHandlers, ...imageCacheHandlers, ...secondBrainHandlers,
      ...queueHandlers, ...dashboardsHandlers, ...supportHandlers,
      ...xIntelHandlers, ...filesHandlers, ...integrationsHandlers,
      ...fathomWebhookHandlers, ...authHandlers, ...sessionPrivacyHandlers,
      ...resourcesHandlers,
      ...inboxHandlers,
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
      (api as any).registerHttpRoute({ path: "/godmode", auth: "plugin", match: "prefix", handler: godmodeHttpHandler });
      (api as any).registerHttpRoute({ path: "/ops", auth: "plugin", match: "prefix", handler: godmodeHttpHandler });
      (api as any).registerHttpRoute({ path: "/reports", auth: "plugin", match: "prefix", handler: godmodeHttpHandler });
    } else if (typeof (api as any).registerHttpHandler === "function") {
      (api as any).registerHttpHandler(godmodeHttpHandler);
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
      const query = typeof params.query === "string" ? params.query.trim().toLowerCase() : "";
      const limit = typeof params.limit === "number" ? Math.min(params.limit, 50) : 20;
      if (!query) {
        respond(true, { ts: Date.now(), results: [] });
        return;
      }
      try {
        // Read session index directly from the filesystem (plugin API has no request() method)
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
          .slice(0, 200); // cap to avoid scanning too many

        if (sessionEntries.length === 0) {
          respond(true, { ts: Date.now(), results: [] });
          return;
        }

        const results: Array<{
          key: string; label?: string; displayName?: string;
          matches: Array<{ role: string; text: string; timestamp?: number }>;
        }> = [];

        for (const s of sessionEntries) {
          if (results.length >= limit) break;

          const nameMatch = [s.displayName, s.key]
            .filter(Boolean)
            .some((f) => f!.toLowerCase().includes(query));

          // Resolve the session JSONL file path
          const sessionFile = s.sessionFile
            ?? (s.sessionId ? join(agentSessionsDir, `${s.sessionId}.jsonl`) : null);
          if (!sessionFile || !existsSync(sessionFile)) {
            if (nameMatch) {
              results.push({ key: s.key, displayName: s.displayName, matches: [] });
            }
            continue;
          }

          // Read and search session content
          const contentMatches: Array<{ role: string; text: string; timestamp?: number }> = [];
          try {
            const raw = readFileSync(sessionFile, "utf-8");
            const lines = raw.split("\n");
            for (const line of lines) {
              if (!line.trim()) continue;
              let entry: any;
              try { entry = JSON.parse(line); } catch { continue; }
              if (entry.type !== "message" || !entry.message) continue;
              const msg = entry.message;
              const content = typeof msg.content === "string"
                ? msg.content
                : Array.isArray(msg.content)
                  ? msg.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join(" ")
                  : "";
              const clean = content
                .replace(/<system-context>[\s\S]*?<\/system-context>/g, "")
                .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
                .replace(/<[a-z][a-z_-]*>[\s\S]*?<\/[a-z][a-z_-]*>/g, "");
              if (clean.toLowerCase().includes(query)) {
                const idx = clean.toLowerCase().indexOf(query);
                const start = Math.max(0, idx - 40);
                const end = Math.min(clean.length, idx + query.length + 60);
                const snippet = (start > 0 ? "..." : "") +
                  clean.slice(start, end).replace(/\n/g, " ").trim() +
                  (end < clean.length ? "..." : "");
                contentMatches.push({ role: msg.role, text: snippet, timestamp: entry.timestamp ? new Date(entry.timestamp).getTime() : undefined });
              }
              if (contentMatches.length >= 3) break;
            }
          } catch {
            // Unreadable session file — skip content search
          }

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

    api.registerGatewayMethod("godmode.health", (async ({ respond }: { respond: Function }) => {
      try {
        const { getHealthReport } = await import("./src/services/self-heal.js");
        const { sessions } = await import("./src/lib/health-ledger.js");
        const report = getHealthReport();
        respond(true, {
          ...report,
          activeSessions: sessions.activeCount(),
          activeSessionKeys: sessions.activeKeys(),
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
      await runGatewayStart(api, pluginVersion, pluginRoot, serviceCleanup);
    });

    api.on("gateway_stop", async () => {
      await runGatewayStop(serviceCleanup, api.logger);
    });

    api.on("message_received", async (event: any, ctx: any) => {
      await handleMessageReceived(event, ctx, api);
    });

    api.on("before_prompt_build", async (event: any, ctx: any) => {
      return handleBeforePromptBuild(event, ctx, api, pluginRoot);
    });

    api.on("before_reset", async (event: any, ctx: any) => {
      await handleBeforeReset(event, ctx, api);
    });

    api.on("before_tool_call", (async (event: any, ctx: any) => {
      return handleBeforeToolCall(event, ctx, api);
    }) as any);

    api.on("message_sending", async (event: any, ctx: any) => {
      return handleMessageSending(event, ctx, api);
    });

    api.on("llm_output", async (event: any, ctx: any) => {
      await handleLlmOutputPressure(event, ctx, api);
    });

    api.on("llm_output", async (event: any, ctx: any) => {
      await handleLlmOutputAutoTitle(event, ctx, api);
    });

    api.on("llm_output", async (event: any, ctx: any) => {
      await handleLlmOutputAgentLog(event, ctx);
    });

    api.on("after_compaction", async (event: any, ctx: any) => {
      await handleAfterCompaction(event, ctx, api);
    });

    // ── 6. Tools ──────────────────────────────────────────────────
    api.registerTool((ctx: any) => createTeamMessageTool(ctx));
    api.registerTool((ctx: any) => createTeamMemoryWriteTool(ctx));
    api.registerTool((ctx: any) => createOnboardTool(ctx));
    api.registerTool((ctx: any) => createMorningSetTool(ctx));
    api.registerTool((ctx: any) => createGuardrailTool(ctx));
    api.registerTool((ctx: any) => createQueueAddTool(ctx));
    api.registerTool(() => createQueueCheckTool());
    api.registerTool(() => createQueueActionTool());
    api.registerTool((ctx: any) => createTrustRateTool(ctx));
    api.registerTool((ctx: any) => createXReadTool(ctx));
    api.registerTool(() => createSelfRepairTool());
    api.registerTool(() => createTasksCreateTool());
    api.registerTool(() => createTasksListTool());
    api.registerTool(() => createTasksUpdateTool());
    api.registerTool(() => createProofEditorTool());
    api.registerTool(() => createQueueSteerTool());

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
