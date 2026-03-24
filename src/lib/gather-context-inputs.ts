/**
 * gather-context-inputs.ts — Shared context gathering for both OC and Hermes runtimes.
 *
 * This module extracts the ~20 context sources that feed into assembleContext().
 * Both before-prompt-build.ts (OpenClaw) and register-all.ts (Hermes) call this
 * to ensure full context parity between runtimes.
 *
 * PARITY RULE: Any new context source added here is automatically available
 * on both runtimes. If you add context gathering to before-prompt-build.ts
 * without adding it here, you're breaking parity.
 */

import { join } from "node:path";
import type { ContextInputs, InputProvenance } from "./context-budget.js";

import type { Logger } from "../types/plugin-api.js";

// ── Per-session TTL cache for expensive async results ───────────────
// Shared across both runtimes. Prevents redundant calls within seconds.

type CachedResult<T> = { value: T; expiresAt: number };
const _gatherCache = new Map<string, CachedResult<unknown>>();
const CACHE_MAX = 100;

function getCached<T>(key: string): T | undefined {
  const entry = _gatherCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    _gatherCache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

function setCache<T>(key: string, value: T, ttlMs: number): void {
  if (_gatherCache.size >= CACHE_MAX) {
    const first = _gatherCache.keys().next().value;
    if (first) _gatherCache.delete(first);
  }
  _gatherCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// ── Options ─────────────────────────────────────────────────────────

export interface GatherContextOptions {
  /** Session key for caching and per-session lookups. */
  sessionKey: string | null;

  /** The user's current message — used for memory search, skill cards, relevance gating. */
  userMessage: string;

  /** Logger for non-fatal warnings. */
  logger: Logger;

  /** Plugin root directory (for skill paths, etc.). */
  pluginRoot: string;

  /** ACP provenance — who sent this message. Null on Hermes (defaults to external_user). */
  provenance?: InputProvenance | null;

  /**
   * OC-specific safety nudges from hook state (prompt shield, output shield, etc.).
   * On Hermes these hooks don't fire, so this returns [].
   */
  safetyNudgeProvider?: () => string[];

  /** Context pressure level (0-1). OC tracks via safety gates; Hermes defaults to 0. */
  contextPressure?: number;

  /** Whether the API is recently overloaded — skip expensive gathering. */
  lightMode?: boolean;

  /** Whether this is the first user message in the session. */
  isFirstTurn?: boolean;

  /**
   * If true, suppress the "Memory Status: Offline" warning when Honcho isn't configured.
   * Set this on Hermes, where the host has its own native memory (MEMORY.md/USER.md).
   * Without this, standalone Hermes installs without HONCHO_API_KEY get a misleading
   * warning telling the model to ask for details Hermes already knows.
   */
  suppressMemoryOfflineWarning?: boolean;
}

// ── Main Gatherer ───────────────────────────────────────────────────

/**
 * Gather all context inputs for assembleContext().
 * Both OC and Hermes call this — any new context source goes here.
 */
export async function gatherContextInputs(opts: GatherContextOptions): Promise<ContextInputs> {
  const { sessionKey, userMessage, logger, pluginRoot, lightMode = false } = opts;
  const provenance = opts.provenance ?? null;
  const contextPressure = opts.contextPressure ?? 0;
  const isFirstTurn = opts.isFirstTurn ?? false;

  // ── P0: Identity anchor ───────────────────────────────────────
  let identityAnchor: string | null = null;
  try {
    const { getIdentityAnchor } = await import("./context-budget.js");
    identityAnchor = await getIdentityAnchor();
  } catch (err) {
    logger.warn(`[GodMode][gather] identity anchor error: ${String(err)}`);
  }

  // ── P0: Honcho context retrieval (skip in light mode) ─────────
  // When the host has native memory (Hermes MEMORY.md/USER.md), report "ready"
  // instead of "offline" if Honcho isn't configured — the host handles it.
  const defaultMemoryStatus = opts.suppressMemoryOfflineWarning ? "ready" : "offline";
  let memoryBlock: string | null = null;
  let memoryStatus: "ready" | "degraded" | "offline" = defaultMemoryStatus;
  if (provenance?.kind !== "inter_session" && !lightMode && sessionKey) {
    const memoryCacheKey = `memory:${sessionKey}`;
    const cached = getCached<{ block: string | null; status: "ready" | "degraded" | "offline" }>(memoryCacheKey);
    if (cached) {
      memoryBlock = cached.block;
      memoryStatus = cached.status;
    } else {
      try {
        const { isMemoryReady, getContext, getMemoryStatus } = await import("./memory.js");
        const { sanitizeForPrompt } = await import("./prompt-sanitizer.js");
        memoryStatus = getMemoryStatus();
        if (isMemoryReady()) {
          const ctx = await getContext(sessionKey);
          if (ctx) memoryBlock = sanitizeForPrompt(ctx, "honcho-context");
          memoryStatus = getMemoryStatus();
        }
        setCache(memoryCacheKey, { block: memoryBlock, status: memoryStatus }, 30_000);
      } catch (err) {
        logger.warn(`[GodMode][gather] Honcho context error (non-fatal): ${String(err)}`);
        memoryStatus = "degraded";
      }
    }
  } else if (lightMode) {
    memoryStatus = "degraded";
  }

  // ── P0: Identity graph (skip in light mode, cached 60s) ───────
  let graphBlock: string | null = null;
  if (provenance?.kind !== "inter_session" && !lightMode) {
    const graphCacheKey = `graph:${sessionKey ?? "global"}`;
    const cachedGraph = getCached<string | null>(graphCacheKey);
    if (cachedGraph !== undefined) {
      graphBlock = cachedGraph;
    } else {
      try {
        const { isGraphReady, queryGraph, formatGraphContext } = await import("./identity-graph.js");
        const { sanitizeForPrompt } = await import("./prompt-sanitizer.js");
        if (isGraphReady()) {
          const graphInput = memoryBlock ? `${userMessage}\n${memoryBlock}` : userMessage;
          if (graphInput.length >= 5) {
            // Use depth=2 when the message likely involves people or relationships
            const PEOPLE_PATTERN = /\b(?:who|team|manager|report|colleague|met|knows?|introduced|work(?:s|ed|ing)?\s+with|relationship|connected|friend|partner|married|family|spouse|sibling|parent|boss|lead|hire[ds]?|referred|mention(?:s|ed)?)\b/i;
            const graphDepth: 1 | 2 = PEOPLE_PATTERN.test(userMessage) ? 2 : 1;
            const graphResults = queryGraph(graphInput, graphDepth);
            const rawGraph = formatGraphContext(graphResults);
            graphBlock = rawGraph ? sanitizeForPrompt(rawGraph, "identity-graph") : null;
          }
        }
        setCache(graphCacheKey, graphBlock, 60_000);
      } catch (e) { logger.warn(`[GodMode][gather] Identity graph query failed: ${(e as Error).message}`); }
    }
  }

  // ── P1: Schedule + meeting prep ───────────────────────────────
  let schedule: string | null = null;
  let meetingPrep: string | null = null;
  let operationalCounts: string | null = null;
  let overdueCount = 0;
  let priorities: string | null = null;

  if (!lightMode) {
    // Schedule: tool hint — only inject if calendar is configured (GOG_CALENDAR_ACCOUNT)
    if (process.env.GOG_CALENDAR_ACCOUNT) {
      schedule = "The user has calendar events today. Use `calendar.events.today` to check their schedule when relevant.";
    }

    // Meeting prep: still pre-inject for upcoming meetings (cached 60s)
    const calCacheKey = "calendar:meetingPrep";
    const cachedMeetingPrep = getCached<string | null>(calCacheKey);
    if (cachedMeetingPrep !== undefined) {
      meetingPrep = cachedMeetingPrep;
    } else {
      try {
        const { fetchCalendarEvents } = await import("../methods/brief-generator.js");
        const result = await fetchCalendarEvents();
        const now = Date.now();
        const upcoming = result.events.filter((e: { startTime: number | string; title: string; attendees?: string[] }) => {
          const start = typeof e.startTime === "number" ? e.startTime : new Date(e.startTime).getTime();
          return start > now && start - now <= 2 * 60 * 60 * 1000;
        });
        if (upcoming.length > 0) {
          const next = upcoming[0] as { startTime: number | string; title: string; attendees?: string[] };
          const startMs = typeof next.startTime === "number" ? next.startTime : new Date(next.startTime).getTime();
          const time = new Date(startMs).toLocaleTimeString("en-US", {
            hour: "numeric", minute: "2-digit", hour12: true,
          });
          const parts = [`## Upcoming: **${next.title}** at ${time}`];
          if (next.attendees && next.attendees.length > 0) {
            parts.push(`Attendees: ${next.attendees.slice(0, 5).join(", ")}`);
          }
          parts.push("Offer meeting prep if not already discussed.");
          meetingPrep = parts.join("\n");
        }
        setCache(calCacheKey, meetingPrep, 60_000);
      } catch (e) { logger.warn(`[GodMode][gather] Calendar fetch error: ${(e as Error).message}`); }
    }

    // Tasks: tool hint, but flag overdue count (cached 30s)
    const tasksCacheKey = "tasks:counts";
    const cachedTasks = getCached<{ overdueCount: number; operationalCounts: string }>(tasksCacheKey);
    if (cachedTasks) {
      overdueCount = cachedTasks.overdueCount;
      operationalCounts = cachedTasks.operationalCounts;
    } else {
      try {
        const { localDateString: lds } = await import("../data-paths.js");
        const today = lds();
        const { readTasks } = await import("../methods/tasks.js");
        const data = await readTasks();
        const pending = data.tasks.filter((t: { status: string }) => t.status === "pending");
        const overdue = pending.filter(
          (t: { dueDate?: string | null }) => t.dueDate != null && t.dueDate <= today,
        );
        overdueCount = overdue.length;
        if (overdueCount > 0) {
          operationalCounts = `${overdueCount} OVERDUE task(s). Surface these early. Use \`tasks_list\` for details.`;
        } else {
          operationalCounts = "Use `tasks_list` and `queue_check` when the user asks about tasks, priorities, or progress.";
        }
        setCache(tasksCacheKey, { overdueCount, operationalCounts }, 30_000);
      } catch {
        operationalCounts = "Use `tasks_list` and `queue_check` when the user asks about tasks, priorities, or progress.";
      }
    }

    // Priorities: tool hint (model reads daily brief itself)
    priorities = null;
  }

  // ── P2: Cron failures ─────────────────────────────────────────
  let cronFailures: string | null = null;
  if (!lightMode) {
    try {
      const { scanForFailures, formatFailuresForSnapshot } = await import("../services/failure-notify.js");
      const failures = await scanForFailures();
      cronFailures = formatFailuresForSnapshot(failures) || null;
    } catch (e) { logger.warn(`[GodMode][gather] Cron failure scan error: ${(e as Error).message}`); }
  }

  // ── P2: Queue review ──────────────────────────────────────────
  let queueReview: string | null = null;
  if (!lightMode) {
    try {
      const { readQueueState } = await import("./queue-state.js");
      const qs = await readQueueState();
      const review = qs.items.filter((i: { status: string }) => i.status === "review").length;
      if (review > 0) {
        queueReview = `${review} queue item(s) ready for review. Prompt the user.`;
      }
    } catch (e) { logger.warn(`[GodMode][gather] Queue review count error: ${(e as Error).message}`); }
  }

  // ── P2: Agent team status ─────────────────────────────────────
  let teamStatus: string | null = null;
  if (!lightMode) {
    try {
      const { readProjects } = await import("./projects-state.js");
      const { readQueueState: readQS } = await import("./queue-state.js");
      const [ps, queueState] = await Promise.all([readProjects(), readQS()]);
      type Project = { projectId: string; title: string; status: string };
      const activeProjects = ps.projects.filter((p: Project) => p.status === "active").slice(0, 3);

      if (activeProjects.length > 0) {
        const lines: string[] = [];
        for (const p of activeProjects as Project[]) {
          type QI = { status: string; meta?: { projectId?: string; paperclipProjectId?: string } };
          const projectItems = queueState.items.filter(
            (qi: QI) => (qi.meta?.projectId ?? qi.meta?.paperclipProjectId) === p.projectId,
          );
          const done = projectItems.filter((qi: QI) => qi.status === "done" || qi.status === "review" || qi.status === "needs-review");
          const failed = projectItems.filter((qi: QI) => qi.status === "failed");
          const active = projectItems.filter((qi: QI) => qi.status === "processing");

          if (done.length > 0 && done.length + failed.length === projectItems.length) {
            lines.push(`READY FOR REVIEW: ${done.length} issue(s) in "${p.title}" — output files are in ~/godmode/memory/inbox/. Present the results to the user in chat.`);
          } else if (failed.length > 0) {
            lines.push(`AT RISK: "${p.title}" — ${failed.length} issue(s) failed. ${active.length} still running.`);
          } else if (active.length > 0) {
            lines.push(`IN PROGRESS: "${p.title}" — ${active.length} issue(s) being worked on.`);
          }
        }
        if (lines.length > 0) {
          teamStatus = "## Agent Team\n" + lines.join("\n");
        }
      }
    } catch (e) { logger.warn(`[GodMode][gather] Agent team status error: ${(e as Error).message}`); }

    // Paperclip deliverables pending review
    try {
      const { listInboxItems } = await import("../services/inbox.js");
      const inbox = await listInboxItems({ status: "pending", limit: 10 });
      type InboxItem = { status: string; source?: { persona?: string }; title?: string; outputPath?: string };
      const pending = inbox.items.filter(
        (i: InboxItem) => i.status === "pending" && i.source?.persona === "paperclip",
      );
      if (pending.length > 0) {
        const deliverableLines = pending.slice(0, 5).map(
          (i: InboxItem) => `- "${i.title}" → ${i.outputPath || "inbox"}`,
        );
        const block =
          `## Deliverables Ready (${pending.length})\n` +
          `Paperclip agents completed work that needs your review:\n` +
          deliverableLines.join("\n") +
          `\n\nPresent each deliverable to the user. Read the output file, summarize key findings, ` +
          `and ask for approval or edits. The file can be opened in the sidebar for detailed review. ` +
          `After the user reviews, mark the inbox item as reviewed.`;
        teamStatus = teamStatus ? teamStatus + "\n\n" + block : block;
      }
    } catch (e) { logger.warn(`[GodMode][gather] Paperclip deliverables check error: ${(e as Error).message}`); }
  }

  // ── P1.5: Action items ────────────────────────────────────────
  let actionItemsBlock: string | null = null;
  if (sessionKey) {
    try {
      const { actionItemBuffer, formatActionItemsForContext } = await import("./action-items.js");
      const items = actionItemBuffer.drain(sessionKey);
      actionItemsBlock = formatActionItemsForContext(items);
    } catch (e) { logger.warn(`[GodMode][gather] Action items extraction error: ${(e as Error).message}`); }
  }

  // ── P1.5: Skill card ─────────────────────────────────────────
  let skillCard: string | null = null;
  if (!lightMode && userMessage.length >= 3) {
    try {
      const { matchSkillCard, formatSkillCard } = await import("./skill-cards.js");
      const matched = matchSkillCard(userMessage);
      if (matched) {
        skillCard = formatSkillCard(matched);
      }
    } catch (e) { logger.warn(`[GodMode][gather] Skill card match error: ${(e as Error).message}`); }
  }

  // ── P2: Skill drafts pending review ───────────────────────────
  let skillDraftCount = 0;
  try {
    const { countPendingDrafts } = await import("./session-distiller.js");
    skillDraftCount = countPendingDrafts();
  } catch (e) { logger.warn(`[GodMode][gather] Skill draft count error: ${(e as Error).message}`); }

  // ── P2: Routing lessons ───────────────────────────────────────
  let routingLessons: string | null = null;
  if (!lightMode) {
    try {
      const { getRoutingLessons, formatRoutingLessons } = await import("./agent-lessons.js");
      const lessons = await getRoutingLessons();
      const formatted = formatRoutingLessons(lessons, userMessage);
      if (formatted) routingLessons = formatted;
    } catch (e) { logger.warn(`[GodMode][gather] Routing lessons error: ${(e as Error).message}`); }
  }

  // ── P3: Safety nudges ─────────────────────────────────────────
  // OC-specific gate nudges come from the provider callback.
  // Runtime-agnostic nudges (escalation, errors, deploy, restart) are gathered here.
  const safetyNudges: string[] = [];

  // OC-specific nudges (prompt shield, output shield, context pressure, enforcer)
  if (opts.safetyNudgeProvider) {
    safetyNudges.push(...opts.safetyNudgeProvider());
  }

  // P3: Tool-grounding gate
  if (userMessage.length >= 3 && !lightMode) {
    try {
      const { generateGroundingInstruction, logGroundingEvent, TOOL_GROUNDING_DEFAULTS } =
        await import("../hooks/tool-grounding-gate.js");
      const guardrailState = await import("../services/guardrails.js").then(
        (m) => m.readGuardrailsStateCached(),
      );
      const tgConfig = {
        ...TOOL_GROUNDING_DEFAULTS,
        ...((guardrailState as Record<string, unknown>).toolGrounding ?? {}),
      };
      const result = generateGroundingInstruction(userMessage, tgConfig);
      if (result) {
        safetyNudges.push(result.instruction);
        if (tgConfig.logViolations) {
          void logGroundingEvent({
            timestamp: new Date().toISOString(),
            sessionKey: sessionKey ?? "unknown",
            userMessage: userMessage.slice(0, 200),
            classification: result.classification.category,
            requiredTools: result.classification.requiredTools,
            injectedInstruction: true,
          });
        }
      }
    } catch (e) { logger.warn(`[GodMode][gather] Tool-grounding gate error: ${(e as Error).message}`); }
  }

  // Conditional: Team bootstrap, onboarding, private session
  try {
    const { handleTeamBootstrap } = await import("../hooks/team-bootstrap.js");
    const teamResult = await handleTeamBootstrap(
      { prompt: "", messages: [] },
      { sessionKey: sessionKey ?? undefined },
    );
    if (teamResult?.prependContext) safetyNudges.push(teamResult.prependContext);
  } catch (e) { logger.warn(`[GodMode][gather] Team bootstrap error: ${(e as Error).message}`); }
  try {
    const { loadOnboardingContext } = await import("../hooks/onboarding-context.js");
    const onboardingResult = await loadOnboardingContext();
    if (onboardingResult?.prependContext) safetyNudges.push(onboardingResult.prependContext);
  } catch (e) { logger.warn(`[GodMode][gather] Onboarding context error: ${(e as Error).message}`); }

  // Private session
  if (sessionKey) {
    try {
      const { isPrivateSession } = await import("./private-session.js");
      const isPrivate = await isPrivateSession(sessionKey);
      if (isPrivate) {
        safetyNudges.push(
          "[Private Session] Nothing from this session is saved to vault or memory. " +
          "Tools and queue still work normally.",
        );
      }
    } catch (e) { logger.warn(`[GodMode][gather] Private session detection error: ${(e as Error).message}`); }
  }

  // Escalation: health warnings
  try {
    const { getEscalationContext } = await import("../services/self-heal.js");
    const escalation = getEscalationContext();
    if (escalation) safetyNudges.push(escalation);
  } catch (e) { logger.warn(`[GodMode][gather] Self-heal escalation error: ${(e as Error).message}`); }

  // Restart awareness
  try {
    const { getLastRestart, clearLastRestart } = await import("./restart-sentinel.js");
    const restart = getLastRestart();
    if (restart && restart.downtimeMs < 10 * 60 * 1000) {
      const downtimeSec = Math.round(restart.downtimeMs / 1000);
      safetyNudges.push(
        `## System Restart\n` +
        `GodMode just restarted (downtime: ~${downtimeSec}s, reason: ${restart.reason}). ` +
        `${restart.previousSessions.length} session(s) were active before shutdown.\n` +
        `Check in with the user: "I just came back online — did I miss anything?"`,
      );
      clearLastRestart();
    }
  } catch (e) { logger.warn(`[GodMode][gather] Restart sentinel error: ${(e as Error).message}`); }

  // Crash recovery awareness
  try {
    const { getLastCrash, clearLastCrash } = await import("./restart-sentinel.js");
    const crash = getLastCrash();
    if (crash && crash.downtimeMs < 30 * 60 * 1000) {
      const downtimeSec = Math.round(crash.downtimeMs / 1000);
      safetyNudges.push(
        `## Crash Recovery\n` +
        `GodMode crashed ${downtimeSec}s ago and has recovered.\n` +
        `- Type: ${crash.type}\n` +
        `- Error: ${crash.error}\n` +
        `- Sessions affected: ${crash.previousSessions.length}\n\n` +
        `Tell the user proactively: "I crashed a moment ago — [brief explanation of the error]. ` +
        `Everything is back online now. Let me know if anything seems off."\n` +
        `Do NOT hide the crash. Users trust transparency.`,
      );
      clearLastCrash();
    }
  } catch (e) { logger.warn(`[GodMode][gather] Crash sentinel error: ${(e as Error).message}`); }

  // Turn-level errors
  try {
    const { turnErrors } = await import("./health-ledger.js");
    const recentErrors = turnErrors.drain();
    if (recentErrors.length > 0) {
      const errorLines = recentErrors.map((e: { operation: string; error: string }) => `- ${e.operation}: ${e.error}`);
      safetyNudges.push([
        "## Recent System Errors",
        "The following errors occurred since the last message. Be transparent with the user.",
        "Use the `godmode_repair` tool to diagnose and attempt auto-repair.",
        "Tell the user what happened and what you're doing about it.",
        ...errorLines,
      ].join("\n"));
    }
  } catch (e) { logger.warn(`[GodMode][gather] Turn-level errors failed: ${(e as Error).message}`); }

  // Pending builder deploy
  try {
    const fsP = await import("node:fs/promises");
    const { DATA_DIR } = await import("../data-paths.js");
    const pendingPath = join(DATA_DIR, "pending-deploy.json");
    const raw = await fsP.readFile(pendingPath, "utf-8").catch(() => "");
    if (raw) {
      const deploy = JSON.parse(raw);
      const age = Date.now() - (deploy.ts || 0);
      const mins = Math.round(age / 60000);
      safetyNudges.push(
        `## Pending Fix Deploy\n` +
        `A builder agent fixed a bug ${mins} minute(s) ago: **${deploy.summary ?? "unknown"}**\n` +
        `Files changed: ${(deploy.files ?? []).join(", ") || "unknown"}\n` +
        `The fix is built and merged but needs a gateway restart to go live.\n` +
        `Tell the user: "A fix is staged. It'll go live next time the gateway restarts, ` +
        `or you can restart now when you're at a good stopping point."`,
      );
    }
  } catch (e) { logger.warn(`[GodMode][gather] Pending deploy check error: ${(e as Error).message}`); }

  return {
    identityAnchor,
    memoryBlock,
    memoryStatus,
    graphBlock,
    schedule,
    operationalCounts,
    priorities,
    meetingPrep,
    cronFailures,
    queueReview,
    teamStatus,
    actionItemsBlock,
    skillCard,
    skillDraftCount,
    routingLessons,
    safetyNudges,
    contextPressure,
    provenance,
    userMessage,
    isFirstTurn,
    overdueCount,
  };
}
