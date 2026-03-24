/**
 * register-all.ts — The "one codebase, two runtimes" bridge.
 *
 * Registers ALL GodMode methods, tools, and services onto any HostAdapter.
 * Both the OpenClaw plugin (index.ts) and Hermes standalone (standalone.ts)
 * can call this to get the full GodMode treatment.
 *
 * For OpenClaw, index.ts still does its own registration (it predates this file).
 * This file is the Hermes path — it gives Hermes feature parity.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import type { HostAdapter, StandaloneRequestHandler } from "./types.js";


import type { Logger } from "../types/plugin-api.js";
type CleanupEntry = { name: string; fn: () => void | Promise<void> };

export interface RegisterResult {
  methodCount: number;
  cleanup: CleanupEntry[];
}

/**
 * Register all GodMode methods, tools, and services onto the adapter.
 * Services start during this call (queue processor, Honcho, etc.).
 */
export async function registerGodMode(
  adapter: HostAdapter,
  opts: { pluginRoot: string; pluginVersion: string },
): Promise<RegisterResult> {
  const { pluginRoot, pluginVersion } = opts;
  const logger = adapter.logger;
  const cleanup: CleanupEntry[] = [];
  let methodCount = 0;

  // ── 1. Register all method modules ────────────────────────────
  const methodModules: Array<() => Promise<Record<string, unknown>>> = [
    () => import("../methods/tasks.js"),
    () => import("../methods/queue.js"),
    () => import("../methods/goals.js"),
    () => import("../methods/resources.js"),
    () => import("../methods/second-brain.js"),
    () => import("../methods/guardrails.js"),
    () => import("../methods/support.js"),
    () => import("../methods/projects.js"),
    () => import("../methods/workspaces.js"),
    () => import("../methods/daily-brief.js"),
    () => import("../methods/brief-generator.js"),
    () => import("../methods/agent-log.js"),
    () => import("../methods/calendar.js"),
    () => import("../methods/ui-slots.js"),
    () => import("../methods/onboarding.js"),
    () => import("../methods/team-workspace.js"),
    () => import("../methods/team-comms.js"),
    () => import("../methods/trust-tracker.js"),
    () => import("../methods/system-update.js"),
    () => import("../methods/composio-setup.js"),
    () => import("../methods/files.js"),
    () => import("../methods/dashboards.js"),
    () => import("../methods/image-cache.js"),
    () => import("../methods/integrations.js"),
    () => import("../methods/auth.js"),
    () => import("../methods/session-privacy.js"),
    () => import("../methods/ingestion.js"),
    () => import("../services/inbox.js"),
  ];

  for (const load of methodModules) {
    try {
      const mod = await load();
      const handlers = findHandlers(mod);
      if (handlers) {
        for (const [name, handler] of Object.entries(handlers)) {
          if (typeof handler === "function") {
            adapter.registerMethod(name, handler as StandaloneRequestHandler);
            methodCount++;
          }
        }
      }
    } catch (err) {
      logger.warn(`[GodMode] Skipped method module: ${String(err)}`);
    }
  }

  // ── 2. Inline RPC methods ─────────────────────────────────────

  // Agent identity — the UI calls this to resolve the ally name + avatar.
  // On OpenClaw this is a core RPC; standalone runtimes need it registered here.
  adapter.registerMethod("agent.identity.get", (async ({ respond }) => {
    const { getAllyName, getAllyNameLower } = await import("../lib/ally-identity.js");
    respond(true, {
      name: getAllyName(),
      avatar: null,
      agentId: getAllyNameLower(),
    });
  }) as StandaloneRequestHandler);
  methodCount++;

  adapter.registerMethod("godmode.status", (async ({ respond }) => {
    respond(true, {
      plugin: true,
      version: pluginVersion,
      license: { status: "active", tier: "standalone", configured: true },
      methods: methodCount,
      runtime: adapter.runtime,
      source: "standalone",
    });
  }) as StandaloneRequestHandler);
  methodCount++;

  // Active model — UI calls this to display the model pill in the chat toolbar.
  adapter.registerMethod("godmode.config.model", (async ({ respond }) => {
    try {
      const { resolveConfigPath } = await import("../lib/openclaw-state.js");
      const cfgPath = resolveConfigPath();
      if (existsSync(cfgPath)) {
        const raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
        const primary = raw?.agents?.defaults?.model?.primary ?? raw?.defaults?.model?.primary ?? null;
        // Collect available models from providers
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
  }) as StandaloneRequestHandler);
  methodCount++;

  // Set active model — UI model picker calls this for quick model switching.
  adapter.registerMethod("godmode.config.model.set", (async ({ params, respond }) => {
    try {
      const { resolveConfigPath } = await import("../lib/openclaw-state.js");
      const cfgPath = resolveConfigPath();
      const primary = (params as Record<string, unknown>)?.primary as string;
      if (!primary) { respond(false, { error: "primary is required" }); return; }
      let raw: Record<string, unknown> = {};
      if (existsSync(cfgPath)) {
        raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
      }
      // Ensure nested path exists
      if (!raw.agents) raw.agents = {};
      const agents = raw.agents as Record<string, unknown>;
      if (!agents.defaults) agents.defaults = {};
      const defaults = agents.defaults as Record<string, unknown>;
      if (!defaults.model) defaults.model = {};
      const model = defaults.model as Record<string, unknown>;
      model.primary = primary;
      // Auto-set fallback
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
  }) as StandaloneRequestHandler);
  methodCount++;

  adapter.registerMethod("godmode.health", (async ({ respond }) => {
    try {
      const { getHealthReport } = await import("../services/self-heal.js");
      const { sessions } = await import("../lib/health-ledger.js");
      const report = getHealthReport();
      respond(true, {
        ...report,
        activeSessions: sessions.activeCount(),
        activeSessionKeys: sessions.activeKeys(),
      });
    } catch (err) {
      respond(true, { ts: Date.now(), overall: "offline", subsystems: [], error: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  adapter.registerMethod("godmode.health.repair", (async ({ respond }) => {
    try {
      const { runSelfHeal } = await import("../services/self-heal.js");
      const result = await runSelfHeal(logger, (event: string, data: unknown) => {
        adapter.broadcast(event, data);
      });
      respond(true, result);
    } catch (err) {
      respond(false, null, { code: "HEAL_FAILED", message: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  adapter.registerMethod("godmode.skills.list", (async ({ respond }) => {
    try {
      const { loadSkillCards } = await import("../lib/skill-cards.js");
      const { loadSkills } = await import("../lib/skills-registry.js");
      const cards = loadSkillCards().map((c) => ({
        slug: c.slug, name: c.domain, type: "card" as const,
        triggers: c.triggers, tools: c.tools, body: c.body,
      }));
      const skills = loadSkills().map((s) => ({
        slug: s.slug, name: s.name, type: "skill" as const,
        trigger: s.trigger, schedule: s.schedule ?? null,
        persona: s.persona ?? null, taskType: s.taskType,
        priority: s.priority, body: s.body,
      }));
      respond(true, { cards, skills, total: cards.length + skills.length });
    } catch (err) {
      respond(true, { cards: [], skills: [], total: 0, error: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  // sessions.list — the UI calls this to populate the session picker + context badge.
  // Hermes standalone doesn't have a native session registry, so we synthesize one
  // from chat-proxy session files + context-pressure data from safety gates.
  adapter.registerMethod("sessions.list", (async ({ respond }) => {
    try {
      const { readdirSync, readFileSync: readFs, existsSync: exists } = await import("node:fs");
      const { join: joinPath } = await import("node:path");
      const { homedir } = await import("node:os");
      // Use explicit path instead of dynamic import (tsup bundling can break relative imports)
      const dataDir = process.env.GODMODE_ROOT
        ? joinPath(process.env.GODMODE_ROOT, "data")
        : joinPath(homedir(), "godmode", "data");
      const sessionsDir = joinPath(dataDir, "hermes-sessions");

      let rawSessions: Array<{ id: string; createdAt: number; inputTokens: number; outputTokens: number; lastInputTokens: number }> = [];
      if (exists(sessionsDir)) {
        const files = readdirSync(sessionsDir).filter((f: string) => f.endsWith(".json"));
        for (const f of files) {
          try {
            const raw = JSON.parse(readFs(joinPath(sessionsDir, f), "utf-8"));
            rawSessions.push({
              id: raw.id ?? f.replace(".json", ""),
              createdAt: raw.createdAt ?? 0,
              inputTokens: raw.inputTokens ?? 0,
              outputTokens: raw.outputTokens ?? 0,
              lastInputTokens: raw.lastInputTokens ?? 0,
            });
          } catch { /* skip corrupt */ }
        }
        rawSessions.sort((a, b) => b.createdAt - a.createdAt);
      }

      // Map to GatewaySessionRow shape.
      // totalTokens = last turn's prompt_tokens (actual context window size),
      // NOT cumulative sum. The UI uses totalTokens/contextTokens to compute
      // context pressure percentage — cumulative sum caused false overflows.
      const sessions = rawSessions.map((s) => ({
        key: s.id,
        kind: "direct" as const,
        updatedAt: s.createdAt,
        totalTokens: s.lastInputTokens > 0 ? s.lastInputTokens : Math.min(s.inputTokens, 200000),
        contextTokens: 200000,
      }));

      respond(true, {
        ts: Date.now(),
        path: sessionsDir,
        count: sessions.length,
        defaults: { contextTokens: 200000 },
        sessions,
      });
    } catch (err) {
      logger.warn(`[GodMode] sessions.list error: ${String(err)}`);
      respond(true, {
        ts: Date.now(),
        path: "",
        count: 0,
        defaults: { contextTokens: 200000 },
        sessions: [],
        error: String(err),
      });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  adapter.registerMethod("sessions.generateTitle", (async ({ params, respond }) => {
    const userMessage = typeof params.userMessage === "string" ? params.userMessage : "";
    const assistantMessage = typeof params.assistantMessage === "string" ? params.assistantMessage : "";
    if (!userMessage) {
      respond(false, null, { code: "MISSING_PARAM", message: "userMessage is required" });
      return;
    }
    try {
      const { generateSessionTitle } = await import("../lib/auto-title.js");
      const title = await generateSessionTitle(userMessage, assistantMessage);
      respond(true, { title: title ?? null });
    } catch (err) {
      respond(true, { title: null, error: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  // sessions.searchContent — full-text search across Hermes session history.
  // Primary: FTS5 SQLite (fast, pre-indexed). Fallback: hermes-sessions JSON scan.
  adapter.registerMethod("sessions.searchContent", (async ({ params, respond }) => {
    const query = typeof params.query === "string" ? params.query.trim() : "";
    if (!query) {
      respond(true, { ts: Date.now(), results: [] });
      return;
    }
    const limit = Math.min(Math.max(1, typeof params.limit === "number" ? params.limit : 20), 50);

    try {
      // ── Primary: FTS5 SQLite ──────────────────────────────────────
      try {
        const { isSessionSearchReady, searchMessages } = await import("../lib/session-search.js");
        if (isSessionSearchReady()) {
          const hits = searchMessages(query, limit * 3);
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
            type SearchResult = { key: string; displayName?: string; matches: Array<{ role: string; text: string; timestamp?: number }> };
            const ftsResults: SearchResult[] = [];
            for (const [key, matches] of grouped) {
              if (ftsResults.length >= limit) break;
              ftsResults.push({ key, matches });
            }
            respond(true, { ts: Date.now(), results: ftsResults });
            return;
          }
        }
      } catch { /* FTS5 unavailable — fall through */ }

      // ── Fallback: hermes-sessions JSON scan ───────────────────────
      const queryLower = query.toLowerCase();
      const { readdirSync, readFileSync: readFs, existsSync: exists } = await import("node:fs");
      const { join: joinPath } = await import("node:path");
      const { homedir } = await import("node:os");
      const dataDir = process.env.GODMODE_ROOT
        ? joinPath(process.env.GODMODE_ROOT, "data")
        : joinPath(homedir(), "godmode", "data");
      const sessionsDir = joinPath(dataDir, "hermes-sessions");

      type MatchEntry = { role: string; text: string };
      type FallbackResult = { key: string; displayName?: string; matches: MatchEntry[] };
      const results: FallbackResult[] = [];

      if (exists(sessionsDir)) {
        const files = readdirSync(sessionsDir).filter((f: string) => f.endsWith(".json") && f !== "__compat_probe__.json");
        for (const f of files) {
          if (results.length >= limit) break;
          try {
            const raw = JSON.parse(readFs(joinPath(sessionsDir, f), "utf-8"));
            const matches: MatchEntry[] = [];
            if (Array.isArray(raw.messages)) {
              for (const m of raw.messages) {
                if (matches.length >= 3) break;
                const role = m.role;
                if (role !== "user" && role !== "assistant") continue;
                const text = typeof m.content === "string" ? m.content
                  : Array.isArray(m.content) ? m.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join(" ") : "";
                const idx = text.toLowerCase().indexOf(queryLower);
                if (idx === -1) continue;
                const start = Math.max(0, idx - 80);
                const end = Math.min(text.length, idx + queryLower.length + 120);
                let excerpt = text.slice(start, end).replace(/\s+/g, " ").trim();
                if (start > 0) excerpt = "..." + excerpt;
                if (end < text.length) excerpt += "...";
                matches.push({ role, text: excerpt });
              }
            }
            if (matches.length > 0) {
              results.push({ key: raw.id ?? f.replace(".json", ""), matches });
            }
          } catch { /* skip */ }
        }
      }
      respond(true, { ts: Date.now(), results });
    } catch (err) {
      respond(true, { ts: Date.now(), results: [], error: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  // ── Secrets list — proxy through to host system.secrets.list ──
  adapter.registerMethod("godmode.secrets.list", (async ({ respond }) => {
    try {
      const { resolveStateDir } = await import("../lib/openclaw-state.js");
      const { readdirSync, existsSync: exists } = await import("node:fs");
      const { join: joinPath } = await import("node:path");
      const secretsDir = joinPath(resolveStateDir(), "secrets");
      const keys: string[] = [];
      if (exists(secretsDir)) {
        for (const f of readdirSync(secretsDir)) {
          if (f.endsWith(".enc")) {
            keys.push(f.replace(/\.enc$/, ""));
          }
        }
      }
      respond(true, { keys });
    } catch (err) {
      respond(true, { keys: [], error: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  // ── Web fetch provider config ───────────────────────────────────
  adapter.registerMethod("godmode.config.webfetch", (async ({ respond }) => {
    try {
      const { resolveConfigPath } = await import("../lib/openclaw-state.js");
      const cfgPath = resolveConfigPath();
      if (existsSync(cfgPath)) {
        const raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
        const provider = raw?.webFetch?.provider ?? "default";
        respond(true, { provider });
      } else {
        respond(true, { provider: "default" });
      }
    } catch {
      respond(true, { provider: "default" });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  adapter.registerMethod("godmode.config.webfetch.set", (async ({ params, respond }) => {
    try {
      const { resolveConfigPath } = await import("../lib/openclaw-state.js");
      const cfgPath = resolveConfigPath();
      const provider = (params as Record<string, unknown>)?.provider as string;
      if (!provider) { respond(false, { error: "provider is required" }); return; }
      let raw: Record<string, unknown> = {};
      if (existsSync(cfgPath)) {
        raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
      }
      if (!raw.webFetch) raw.webFetch = {};
      (raw.webFetch as Record<string, unknown>).provider = provider;
      writeFileSync(cfgPath, JSON.stringify(raw, null, 2), "utf-8");
      respond(true, { provider });
    } catch (err) {
      respond(false, { error: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  // ── Search provider config ──────────────────────────────────────
  adapter.registerMethod("godmode.config.search", (async ({ respond }) => {
    try {
      const { resolveConfigPath } = await import("../lib/openclaw-state.js");
      const cfgPath = resolveConfigPath();
      let defaultProvider = "tavily";
      let exaConfigured = false;
      let tavilyConfigured = false;
      if (existsSync(cfgPath)) {
        const raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
        defaultProvider = raw?.search?.defaultProvider ?? "tavily";
        // Check if API keys are configured in the config or env
        const keys = raw?.apiKeys ?? raw?.keys ?? {};
        exaConfigured = Boolean(keys.EXA_API_KEY || process.env.EXA_API_KEY);
        tavilyConfigured = Boolean(keys.TAVILY_API_KEY || process.env.TAVILY_API_KEY);
      } else {
        exaConfigured = Boolean(process.env.EXA_API_KEY);
        tavilyConfigured = Boolean(process.env.TAVILY_API_KEY);
      }
      respond(true, { defaultProvider, exaConfigured, tavilyConfigured });
    } catch {
      respond(true, { defaultProvider: "tavily", exaConfigured: false, tavilyConfigured: false });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  adapter.registerMethod("godmode.config.search.set", (async ({ params, respond }) => {
    try {
      const { resolveConfigPath } = await import("../lib/openclaw-state.js");
      const cfgPath = resolveConfigPath();
      const defaultProvider = (params as Record<string, unknown>)?.defaultProvider as string;
      if (!defaultProvider) { respond(false, { error: "defaultProvider is required" }); return; }
      let raw: Record<string, unknown> = {};
      if (existsSync(cfgPath)) {
        raw = JSON.parse(readFileSync(cfgPath, "utf-8"));
      }
      if (!raw.search) raw.search = {};
      (raw.search as Record<string, unknown>).defaultProvider = defaultProvider;
      writeFileSync(cfgPath, JSON.stringify(raw, null, 2), "utf-8");
      respond(true, { defaultProvider });
    } catch (err) {
      respond(false, { error: String(err) });
    }
  }) as StandaloneRequestHandler);
  methodCount++;

  logger.info(`[GodMode] Registered ${methodCount} gateway methods (standalone v${pluginVersion})`);

  // ── 3. Register all tools ─────────────────────────────────────

  const toolImports = [
    () => import("../tools/team-message.js").then((m) => m.createTeamMessageTool),
    () => import("../tools/team-memory.js").then((m) => m.createTeamMemoryWriteTool),
    () => import("../tools/onboard.js").then((m) => m.createOnboardTool),
    () => import("../tools/morning-set.js").then((m) => m.createMorningSetTool),
    () => import("../tools/guardrail.js").then((m) => m.createGuardrailTool),
    () => import("../tools/queue-add.js").then((m) => m.createQueueAddTool),
    () => import("../tools/queue-check.js").then((m) => m.createQueueCheckTool),
    () => import("../tools/queue-action.js").then((m) => m.createQueueActionTool),
    () => import("../tools/trust-rate.js").then((m) => m.createTrustRateTool),
    () => import("../tools/x-read.js").then((m) => m.createXReadTool),
    () => import("../tools/honcho-query.js").then((m) => m.createHonchoQueryTool),
    () => import("../tools/self-repair.js").then((m) => m.createSelfRepairTool),
    () => import("../tools/tasks-tool.js").then((m) => m.createTasksCreateTool),
    () => import("../tools/tasks-tool.js").then((m) => m.createTasksListTool),
    () => import("../tools/tasks-tool.js").then((m) => m.createTasksUpdateTool),
    () => import("../tools/queue-steer.js").then((m) => m.createQueueSteerTool),
    () => import("../tools/delegate-tool.js").then((m) => m.createDelegateTool),
    () => import("../tools/composio-tool.js").then((m) => m.createComposioExecuteTool),
    () => import("../tools/memory-search-shim.js").then((m) => m.createMemorySearchShimTool),
    () => import("../tools/capture-thought.js").then((m) => m.createCaptureThoughtTool),
    () => import("../tools/memory-get-mcp.js").then((m) => m.createMemoryGetMcpTool),
  ];

  let toolCount = 0;
  for (const load of toolImports) {
    try {
      const factory = await load();
      adapter.registerTool(factory as unknown as (ctx: import("./types.js").ToolContext) => import("./types.js").StandaloneAgentTool);
      toolCount++;
    } catch (err) {
      logger.warn(`[GodMode] Skipped tool: ${String(err)}`);
    }
  }
  logger.info(`[GodMode] Registered ${toolCount} tools`);

  // ── 4. Initialize services ────────────────────────────────────
  // Reuse runGatewayStart by passing an adapter-shaped api shim.
  // The api object only needs .logger and broadcast — both available from the adapter.

  const apiShim = {
    logger,
    broadcast: (event: string, data: unknown) => adapter.broadcast(event, data),
    // Stub for detectHostContext which reads api.source
    source: join(pluginRoot, "dist", "index.js"),
    pluginConfig: {},
  };

  try {
    const { runGatewayStart } = await import("../hooks/gateway-start.js");
    await runGatewayStart(apiShim, pluginVersion, pluginRoot, cleanup, methodCount);
    logger.info(`[GodMode] Services initialized — ${cleanup.length} registered for cleanup`);
  } catch (err) {
    logger.warn(`[GodMode] Service initialization partially failed: ${String(err)}`);
  }

  // Init Composio (non-blocking)
  import("../services/composio-client.js")
    .then(({ init }) => init(process.env.COMPOSIO_API_KEY, logger).catch((err) => {
      logger.warn(`[GodMode] Composio init failed: ${String(err)}`);
    }))
    .catch((err) => {
      logger.warn(`[GodMode] Composio module import failed: ${String(err)}`);
    });

  // ── 5. Wire lifecycle hooks (full context parity) ─────────────
  // Hermes gets the SAME context pipeline as OpenClaw via the shared gatherer.
  // Both runtimes call gatherContextInputs() → assembleContext().
  // PARITY RULE: New context sources go in gather-context-inputs.ts, not here.

  if (adapter.onBeforeChat) {
    adapter.onBeforeChat(async (_sessionKey: string, userMessage: string) => {
      try {
        const { gatherContextInputs } = await import("../lib/gather-context-inputs.js");
        const { assembleContext } = await import("../lib/context-budget.js");
        const inputs = await gatherContextInputs({
          sessionKey: _sessionKey,
          userMessage,
          logger,
          pluginRoot,
          // Hermes has no OC-specific safety gate hooks — provider returns []
          safetyNudgeProvider: () => [],
          contextPressure: 0,
          lightMode: false,
          // Hermes has native memory (MEMORY.md/USER.md) — don't warn about
          // Honcho being offline on standalone installs without HONCHO_API_KEY
          suppressMemoryOfflineWarning: true,
        });
        return assembleContext(inputs);
      } catch (err) {
        logger.warn(`[GodMode] Context assembly failed: ${String(err)}`);
        return null;
      }
    });
  }

  if (adapter.onAfterChat) {
    adapter.onAfterChat(async (_sessionKey: string, userMsg: string, assistantMsg: string) => {
      // Memory ingest — learn from the conversation
      try {
        const { forwardMessage } = await import("../lib/memory.js");
        await forwardMessage("user", userMsg, _sessionKey);
        await forwardMessage("assistant", assistantMsg, _sessionKey);
      } catch {
        const { reportDegraded } = await import("../lib/service-health.js");
        reportDegraded("honcho", "Memory message forwarding failed", "Check memory provider in Settings");
      }

      // Identity graph — extract entities from the response
      try {
        const { extractAndStore } = await import("../lib/identity-graph.js");
        await extractAndStore(assistantMsg);
      } catch { /* non-fatal */ }

      // Auto-title — Hermes has no llm_output hook, so we title here
      if (_sessionKey && userMsg && userMsg.length >= 10 && assistantMsg && assistantMsg.length >= 10) {
        void (async () => {
          try {
            const { generateSessionTitle, titledSessions, evictTitledSessions } = await import("../lib/auto-title.js");
            if (titledSessions.has(_sessionKey)) return;

            // Check if session already has a title in the store
            const { loadConfig: loadSessCfg, loadCombinedSessionStoreForGateway, updateSessionStore, resolveAgentStorePath } = await import("../lib/workspace-session-store.js");
            const cfg = await loadSessCfg();
            const { store } = await loadCombinedSessionStoreForGateway(cfg);
            const normalizedKey = _sessionKey.trim().toLowerCase();
            const entry = store[normalizedKey];
            if (entry) {
              const existingTitle = (entry.displayName || entry.label || entry.subject || "").trim();
              if (existingTitle) {
                titledSessions.add(_sessionKey);
                return;
              }
            }

            const title = await generateSessionTitle(userMsg, assistantMsg);
            if (!title) {
              titledSessions.add(_sessionKey);
              return;
            }

            const storePath = resolveAgentStorePath(_sessionKey, cfg);
            await updateSessionStore(storePath, (storeData) => {
              const existing = storeData[normalizedKey] ?? {};
              storeData[normalizedKey] = {
                ...existing,
                displayName: title,
                updatedAt: Date.now(),
              };
            });

            titledSessions.add(_sessionKey);
            evictTitledSessions();
            logger.info(`[GodMode][AutoTitle] Hermes: titled "${_sessionKey}" → "${title}"`);
            adapter.broadcast("sessions:updated", { sessionKey: _sessionKey, title });
          } catch (err) {
            logger.warn(`[GodMode][AutoTitle] Hermes auto-title error: ${String(err)}`);
          }
        })();
      }
    });
  }

  if (adapter.onMessageReceived) {
    adapter.onMessageReceived(async (_sessionKey: string, message: string) => {
      // Action item extraction from brain dumps
      try {
        const { extractActionItems } = await import("../lib/action-items.js");
        extractActionItems(message);
      } catch { /* non-fatal */ }
    });
  }

  return { methodCount, cleanup };
}

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Find the *Handlers export in a module.
 * Every GodMode method module exports exactly one Record<string, Function>.
 */
function findHandlers(mod: Record<string, unknown>): Record<string, Function> | null {
  // Look for named exports ending in "Handlers" first
  for (const [key, val] of Object.entries(mod)) {
    if (key.endsWith("Handlers") && val && typeof val === "object" && !Array.isArray(val)) {
      return val as Record<string, Function>;
    }
  }
  // Fallback: find the first Record<string, Function>
  for (const val of Object.values(mod)) {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const entries = Object.entries(val as Record<string, unknown>);
      if (entries.length > 0 && entries.every(([, v]) => typeof v === "function")) {
        return val as Record<string, Function>;
      }
    }
  }
  return null;
}
