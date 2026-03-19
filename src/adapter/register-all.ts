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

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import type { HostAdapter, StandaloneRequestHandler } from "./types.js";
import type { TaskItem, QueueItem } from "../types/plugin-api.js";

type CleanupEntry = { name: string; fn: () => void | Promise<void> };
type Logger = { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void };

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
    () => import("../methods/options.js"),
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
    .then(({ init }) => init(process.env.COMPOSIO_API_KEY, logger).catch(() => {}))
    .catch(() => {});

  // ── 5. Wire lifecycle hooks (capability-aware) ────────────────
  // Only hooks that add value alongside the host's capabilities.
  // Hermes handles: memory, personality, skills, compression, tool execution.
  // GodMode adds: workspace context, action items, Honcho ingest, identity graph.

  if (adapter.onBeforeChat) {
    adapter.onBeforeChat(async (_sessionKey: string) => {
      try {
        const { assembleWorkspaceContext } = await import("../lib/context-budget.js");
        const inputs = await gatherWorkspaceInputs(logger);
        return assembleWorkspaceContext(inputs);
      } catch (err) {
        logger.warn(`[GodMode] Workspace context assembly failed: ${String(err)}`);
        return null;
      }
    });
  }

  if (adapter.onAfterChat) {
    adapter.onAfterChat(async (_sessionKey: string, userMsg: string, assistantMsg: string) => {
      // Honcho memory ingest — learn from the conversation
      try {
        const { forwardMessage } = await import("../services/honcho-client.js");
        await forwardMessage("user", userMsg, _sessionKey);
        await forwardMessage("assistant", assistantMsg, _sessionKey);
      } catch {
        const { reportDegraded } = await import("../lib/service-health.js");
        reportDegraded("honcho", "Honcho message forwarding failed", "Check HONCHO_API_KEY in Settings");
      }

      // Identity graph — extract entities from the response
      try {
        const { extractAndStore } = await import("../lib/identity-graph.js");
        await extractAndStore(assistantMsg);
      } catch { /* non-fatal */ }
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

// ── Context Gathering ─────────────────────────────────────────────

/**
 * Gather workspace-level context inputs for Hermes context injection.
 * Reuses the same data sources as before-prompt-build.ts but skips
 * memory/identity (Hermes handles those).
 */
async function gatherWorkspaceInputs(logger: Logger): Promise<Record<string, unknown>> {
  const inputs: Record<string, unknown> = {};

  // Schedule (calendar)
  try {
    // Light approach: read today's schedule via gog CLI
    const { execSync } = await import("node:child_process");
    const today = new Date().toISOString().slice(0, 10);
    const account = process.env.GOG_CALENDAR_ACCOUNT;
    if (account) {
      const cmd = `gog events list --account "${account}" --from "${today}" --to "${today}" --format json 2>/dev/null || echo "[]"`;
      const raw = execSync(cmd, { timeout: 5000 }).toString().trim();
      const events = JSON.parse(raw);
      if (Array.isArray(events) && events.length > 0) {
        const lines = events.slice(0, 5).map((e: { start?: string; summary?: string }) =>
          `- ${e.start?.slice(11, 16) ?? "?"} ${e.summary ?? "Event"}`,
        );
        inputs.schedule = `## Today's Schedule\n${lines.join("\n")}`;
      }
    }
  } catch { /* calendar unavailable — non-fatal */ }

  // Task and queue counts
  try {
    const { readFile } = await import("node:fs/promises");
    const { DATA_DIR } = await import("../data-paths.js");
    const { join } = await import("node:path");

    const tasksRaw = await readFile(join(DATA_DIR, "tasks.json"), "utf-8").catch(() => "[]");
    const tasks = JSON.parse(tasksRaw);
    const pending = Array.isArray(tasks) ? tasks.filter((t: TaskItem) => t.status === "pending") : [];
    const overdue = pending.filter((t: TaskItem) => t.dueDate && new Date(t.dueDate!) < new Date());

    const queueRaw = await readFile(join(DATA_DIR, "queue-state.json"), "utf-8").catch(() => '{"items":[]}');
    const queue = JSON.parse(queueRaw);
    const queueItems = Array.isArray(queue.items) ? queue.items : [];
    const queuePending = queueItems.filter((i: QueueItem) => i.status === "pending" || i.status === "approved");
    const queueDone = queueItems.filter((i: QueueItem) => i.status === "done");

    const counts = [];
    if (pending.length > 0) counts.push(`${pending.length} task(s) pending`);
    if (overdue.length > 0) counts.push(`${overdue.length} OVERDUE`);
    if (queuePending.length > 0) counts.push(`${queuePending.length} queue item(s) waiting`);
    if (queueDone.length > 0) counts.push(`${queueDone.length} queue item(s) done — ready for review`);
    if (counts.length > 0) {
      inputs.operationalCounts = `## Workspace: ${counts.join(", ")}`;
    }

    // Queue review items
    if (queueDone.length > 0) {
      const reviewLines = queueDone.slice(0, 3).map((i: QueueItem) => `- "${i.title}" (${i.type})`);
      inputs.queueReview = `## Queue Items Ready for Review\n${reviewLines.join("\n")}`;
    }

    // Priorities (top 3 tasks by due date)
    if (pending.length > 0) {
      const sorted = [...pending].sort((a: TaskItem, b: TaskItem) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
      const top = sorted.slice(0, 3).map((t: TaskItem) =>
        `- ${t.title}${t.dueDate ? ` (due: ${t.dueDate})` : ""}`,
      );
      inputs.priorities = `## Top Priorities\n${top.join("\n")}`;
    }
  } catch { /* task/queue read failed — non-fatal */ }

  // Skill card (lightweight — just load if keyword matches)
  try {
    const { matchSkillCard } = await import("../lib/skill-cards.js");
    // No user message in this context — skip keyword matching
  } catch { /* non-fatal */ }

  return inputs;
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
