/**
 * lifecycle-hooks.ts — Safety gate hooks and session lifecycle management.
 *
 * Handles message_received, before_tool_call, message_sending, llm_output,
 * before_reset, and after_compaction hooks.
 */

import { extractSessionKey, safeBroadcast } from "../lib/host-context.js";
import {
  trackToolCall,
  scanForInjection,
  checkOutputLeak,
  checkConfigAccess,
  resetPromptShieldTracking,
  trackContextPressure,
  resetContextPressure,
} from "./safety-gates.js";
import { checkCustomGuardrails, logGateActivity } from "../services/guardrails.js";
import {
  pendingAutoTitles,
  titledSessions,
  evictTitledSessions,
  generateSessionTitle,
} from "../lib/auto-title.js";
import {
  loadConfig as loadSessionConfig,
  loadCombinedSessionStoreForGateway,
  updateSessionStore,
  resolveStorePath,
  deriveSessionTitle,
  isCronSessionKey,
} from "../lib/workspace-session-store.js";

type Logger = { warn: (msg: string) => void; info: (msg: string) => void };

// ── Dashboard save tracking ──────────────────────────────────────────
// Track sessions where dashboards.save was called so we can auto-save
// dashboard HTML if the ally forgets.
const _dashboardSaveCalled = new Set<string>();
const _dashboardSaveCalledTTL = 5 * 60 * 1000; // 5 min
function markDashboardSaved(sessionKey: string): void {
  _dashboardSaveCalled.add(sessionKey);
  setTimeout(() => _dashboardSaveCalled.delete(sessionKey), _dashboardSaveCalledTTL);
}

// ── API Error Shield ──────────────────────────────────────────────────

const API_ERROR_FRIENDLY: Record<string, string> = {
  overloaded_error:
    "I'm experiencing high demand right now. Give me a moment and try again — I'll be right back.",
  rate_limit_error:
    "I've hit a rate limit. Please wait a moment and resend your message.",
  api_error:
    "I ran into a temporary issue. Please try again in a moment.",
  authentication_error:
    "There's a configuration issue with the AI service. Please check Settings or contact support.",
  invalid_request_error:
    "Something went wrong with that request. Please try rephrasing or contact support.",
};

const OVERLOAD_PLAIN =
  "The AI service is temporarily overloaded. Please try again in a moment.";

// ── Overload Tracking ───────────────────────────────────────────────
// Tracks recent overload events so before_prompt_build can go lightweight.

let lastOverloadAt = 0;
let overloadCount = 0;
const OVERLOAD_WINDOW_MS = 120_000; // 2 minute window

/** Check if we've had recent overload errors — used by before_prompt_build to go lightweight */
export function isRecentlyOverloaded(): boolean {
  return Date.now() - lastOverloadAt < OVERLOAD_WINDOW_MS;
}

/** Get recent overload count for diagnostics */
export function getOverloadCount(): number {
  return overloadCount;
}

function recordOverload(): void {
  lastOverloadAt = Date.now();
  overloadCount++;
}

/** Returns a friendly replacement string if `content` is a raw API error, else null. */
function interceptApiError(content: string): string | null {
  const trimmed = content.trim();

  // Plain-text overload message from gateway
  if (trimmed === OVERLOAD_PLAIN) {
    recordOverload();
    return API_ERROR_FRIENDLY.overloaded_error;
  }

  // HTTP status code prefixed errors: "529 {"type":"error",...}" or "400 Unsupported value..."
  const httpPrefixMatch = trimmed.match(/^(\d{3})\s+(.+)/s);
  if (httpPrefixMatch) {
    const status = Number(httpPrefixMatch[1]);
    const body = httpPrefixMatch[2]!;
    if (status === 529 || status === 503) {
      recordOverload();
      // Try to parse JSON body for details
      try {
        const parsed = JSON.parse(body);
        if (parsed?.error?.type === "overloaded_error") {
          return API_ERROR_FRIENDLY.overloaded_error;
        }
      } catch { /* not JSON */ }
      return API_ERROR_FRIENDLY.overloaded_error;
    }
    if (status === 400) {
      // Model compatibility error (e.g., thinking level not supported) — suppress raw error
      return "__SUPPRESS__";
    }
    if (status === 429) {
      recordOverload();
      return API_ERROR_FRIENDLY.rate_limit_error;
    }
  }

  // Raw JSON error payload: {"type":"error","error":{"type":"overloaded_error",...}}
  if (trimmed.includes('"type":"error"') && trimmed.includes('"error"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed?.type === "error" && parsed?.error) {
        const errorType: string = parsed.error.type ?? "unknown_error";
        if (errorType === "overloaded_error" || errorType === "rate_limit_error") {
          recordOverload();
        }
        return (
          API_ERROR_FRIENDLY[errorType] ??
          `I ran into an issue (${errorType}). Please try again in a moment.`
        );
      }
    } catch {
      // Not valid JSON — fall through
    }
  }

  // Catch "Unsupported value" errors from model compatibility issues
  if (trimmed.startsWith("Unsupported value:") || trimmed.includes("is not supported with the")) {
    // Suppress — gateway retries these automatically
    return "__SUPPRESS__";
  }

  return null;
}

// ── message_received ──────────────────────────────────────────────────

export async function handleMessageReceived(
  event: any,
  ctx: any,
  api: any,
): Promise<void> {
  const logger: Logger = api.logger;
  const sessionKey = extractSessionKey(ctx);
  const content = event.content ?? "";

  // Track session activity for restart gate
  if (sessionKey) {
    try {
      const { sessions } = await import("../lib/health-ledger.js");
      sessions.touch(sessionKey);
    } catch { /* non-fatal */ }
  }

  // Reset per-turn tool usage tracker
  try {
    const { resetTurnToolUsage } = await import("./safety-gates.js");
    resetTurnToolUsage(sessionKey);
  } catch { /* non-fatal */ }

  if (content) {
    const result = await scanForInjection(sessionKey, content);
    if (result.flagged) {
      logger.warn(
        `[GodMode][SafetyGate] prompt shield flagged session: ${result.categories.join(", ")}`,
      );
    }

    // Extract action items from brain dumps
    if (sessionKey && content.length >= 15) {
      try {
        const { extractActionItems, actionItemBuffer } = await import("../lib/action-items.js");
        const items = extractActionItems(content);
        if (items.length > 0) {
          actionItemBuffer.add(sessionKey, items);
          logger.info(`[GodMode][ActionItems] Extracted ${items.length} action item(s) from "${sessionKey}"`);
        }
      } catch { /* non-fatal */ }
    }

    // Support session logging
    if (sessionKey === "agent:main:support") {
      try {
        const { logExchangeInternal } = await import("../methods/support.js");
        await logExchangeInternal("user", content);
      } catch { /* non-fatal */ }
    }

    // Server-side auto-title: capture first user message
    if (
      sessionKey &&
      !titledSessions.has(sessionKey) &&
      !pendingAutoTitles.has(sessionKey) &&
      !isCronSessionKey(sessionKey)
    ) {
      pendingAutoTitles.set(sessionKey, content);
      logger.info(`[GodMode][AutoTitle] Captured first message for "${sessionKey}" (${content.slice(0, 60)}...)`);
    }
  }
}

// ── before_reset ──────────────────────────────────────────────────────

export async function handleBeforeReset(
  event: any,
  ctx: any,
  api: any,
): Promise<void> {
  const logger: Logger = api.logger;
  const sessionKey = extractSessionKey(ctx);

  resetPromptShieldTracking(sessionKey);
  resetContextPressure(sessionKey);

  try {
    const { resetEnforcerFlags, resetSessionToolUsage } = await import("./safety-gates.js");
    resetEnforcerFlags(sessionKey);
    resetSessionToolUsage(sessionKey);
  } catch { /* non-fatal */ }

  try {
    const { handleTeamMemoryRoute } = await import("./team-memory-route.js");
    await handleTeamMemoryRoute(event, ctx);
  } catch (err) {
    logger.warn(`[GodMode] team memory route hook error: ${String(err)}`);
  }
}

// ── before_tool_call ──────────────────────────────────────────────────

export async function handleBeforeToolCall(
  event: any,
  ctx: any,
  api: any,
): Promise<{ block: true; blockReason: string } | { prependContext: string } | undefined> {
  const logger: Logger = api.logger;
  const name = event.toolName?.trim().toLowerCase() ?? "";
  const sessionKey = extractSessionKey(ctx);

  // Gate 1: Loop Breaker
  const loopCheck = await trackToolCall(
    sessionKey,
    name,
    (event.params ?? {}) as Record<string, unknown>,
  );
  if (loopCheck.blocked) {
    logger.warn(`[GodMode][SafetyGate] loop breaker fired: ${name}`);
    return { block: true, blockReason: loopCheck.reason! };
  }
  if (loopCheck.warning) {
    logger.info(`[GodMode][SafetyGate] loop breaker warning: ${name}`);
  }

  // Gate 1b: Custom Guardrails
  const customCheck = await checkCustomGuardrails(name, (event.params ?? {}) as Record<string, unknown>);
  if (customCheck.blocked) {
    logger.warn(`[GodMode][SafetyGate] custom guardrail fired: ${customCheck.guardrailId} on ${name}`);
    void logGateActivity(
      `custom:${customCheck.guardrailId}`,
      "blocked",
      `Custom guardrail blocked ${name}: ${customCheck.guardrailId}`,
      sessionKey,
    );
    return { block: true, blockReason: customCheck.message! };
  }

  // Gate 1c: Config Shield
  const configBlock = await checkConfigAccess(name, event.params ?? {}, sessionKey);
  if (configBlock) {
    logger.warn(`[GodMode][SafetyGate] config shield fired: ${name}`);
    return { block: true, blockReason: configBlock };
  }

  // Gate 1d: Ephemeral Path Shield — HARD BLOCK /tmp writes
  try {
    const { checkEphemeralWrite } = await import("./safety-gates.js");
    const ephemeralBlock = checkEphemeralWrite(name, (event.params ?? {}) as Record<string, unknown>, sessionKey);
    if (ephemeralBlock) {
      logger.warn(`[GodMode][SafetyGate] ephemeral path shield BLOCKED: ${name}`);
      return { block: true, blockReason: ephemeralBlock };
    }
  } catch { /* non-fatal */ }

  // Gate 1e: Restart Gate — HARD BLOCK any gateway restart attempt
  try {
    const { checkRestartAttempt } = await import("./safety-gates.js");
    const restartBlock = await checkRestartAttempt(name, (event.params ?? {}) as Record<string, unknown>, sessionKey);
    if (restartBlock) {
      logger.warn(`[GodMode][SafetyGate] restart gate BLOCKED: ${name}`);
      return { block: true, blockReason: restartBlock };
    }
  } catch { /* non-fatal */ }

  // Record tool usage for enforcer gates
  try {
    const { recordToolUsage } = await import("./safety-gates.js");
    recordToolUsage(sessionKey, name);
  } catch { /* non-fatal */ }

  // Track dashboards.save calls so we know if ally saved the dashboard
  if (name === "dashboards.save" && sessionKey) {
    markDashboardSaved(sessionKey);
  }

  return undefined;
}

// ── message_sending ───────────────────────────────────────────────────

export async function handleMessageSending(
  event: any,
  ctx: any,
  api: any,
): Promise<{ cancel: true } | { content: string } | undefined> {
  const logger: Logger = api.logger;
  const sessionKey = extractSessionKey(ctx);
  const content = event.content ?? "";

  // ── API Error Shield — catch raw API errors and show friendly messages ──
  // The gateway sometimes surfaces raw JSON error payloads or plain-text
  // error strings as assistant messages. Intercept and humanize them.
  const friendly = interceptApiError(content);
  if (friendly === "__SUPPRESS__") {
    logger.warn(`[GodMode][ErrorShield] Suppressed transient error (gateway will retry)`);
    return { cancel: true };
  }
  if (friendly) {
    logger.warn(`[GodMode][ErrorShield] Caught raw API error — replacing with friendly message`);
    return { content: friendly };
  }

  // Enforcer gates
  try {
    const { checkEnforcerGates } = await import("./safety-gates.js");
    const enforcerResult = await checkEnforcerGates(sessionKey, content);
    if (enforcerResult?.cancel) {
      logger.warn(`[GodMode][SafetyGate] enforcer gate fired: ${enforcerResult.gate}`);
      return { cancel: true };
    }
  } catch (err) {
    logger.warn(`[GodMode] enforcer gate error: ${String(err)}`);
  }

  // Output Shield
  if (await checkOutputLeak(sessionKey, content)) {
    logger.warn(`[GodMode][SafetyGate] output shield fired — leak blocked`);
    return { cancel: true };
  }

  // Mem0 ingestion (fire and forget)
  try {
    const { isMemoryReady, ingestConversation } = await import("../lib/memory.js");
    if (isMemoryReady() && content.length > 20) {
      void ingestConversation(content, "caleb");
    }
  } catch { /* invisible */ }

  // Identity graph extraction (fire and forget)
  try {
    const { isGraphReady, extractAndStore } = await import("../lib/identity-graph.js");
    if (isGraphReady() && content.length > 30) {
      void extractAndStore(content);
    }
  } catch { /* invisible */ }

  // Dashboard auto-save safety net: if the ally output dashboard-like HTML
  // but didn't call dashboards.save, save it automatically.
  if (sessionKey && !_dashboardSaveCalled.has(sessionKey) && content.length > 500) {
    try {
      const hasStyleBlock = /<style[\s>]/i.test(content);
      const hasHtmlStructure = (/<div[\s>]/i.test(content) || /<section[\s>]/i.test(content))
        && (/<table[\s>]/i.test(content) || /<svg[\s>]/i.test(content) || /<h[1-3][\s>]/i.test(content));
      if (hasStyleBlock && hasHtmlStructure) {
        // Extract a title from the first <h1>, <h2>, or <title> tag
        const titleMatch = content.match(/<(?:h[12]|title)[^>]*>(.*?)<\/(?:h[12]|title)>/i);
        const dashTitle = titleMatch?.[1]?.replace(/<[^>]*>/g, "").trim() || "Untitled Dashboard";

        logger.info(`[GodMode][DashboardAutoSave] Detected unsaved dashboard HTML: "${dashTitle}"`);

        const { saveDashboardDirect } = await import("../methods/dashboards.js");
        void saveDashboardDirect({
          title: dashTitle,
          html: content,
          scope: "global",
          description: "Auto-saved from chat (ally did not call dashboards.save)",
        }).then((result) => {
          if (result?.ok) {
            logger.info(`[GodMode][DashboardAutoSave] Saved dashboard "${dashTitle}" (id: ${result.id})`);
            safeBroadcast(api, "dashboards:updated", { id: result.id, title: dashTitle });
          }
        }).catch((err: unknown) => {
          logger.warn(`[GodMode][DashboardAutoSave] Failed: ${String(err)}`);
        });
      }
    } catch { /* non-fatal */ }
  }

  return undefined;
}

// ── llm_output: context pressure ──────────────────────────────────────

export async function handleLlmOutputPressure(
  event: any,
  ctx: any,
  api: any,
): Promise<void> {
  const logger: Logger = api.logger;
  const sessionKey = extractSessionKey(ctx);
  try {
    const tier = await trackContextPressure(sessionKey, event.usage);
    if (tier === "critical" && sessionKey) {
      safeBroadcast(api, "session:auto-compact", { sessionKey });
      logger.info(`[GodMode] auto-compact broadcast for session: ${sessionKey}`);
    }
  } catch (err) {
    logger.warn(`[GodMode] context pressure tracking error: ${String(err)}`);
  }

  // Support session logging — assistant messages
  const assistantContent = (event as { assistantTexts?: string[] }).assistantTexts?.join("") ?? "";
  if (sessionKey === "agent:main:support" && assistantContent) {
    try {
      const { logExchangeInternal } = await import("../methods/support.js");
      await logExchangeInternal("assistant", assistantContent);
    } catch { /* non-fatal */ }
  }
}

// ── llm_output: auto-title ────────────────────────────────────────────

export async function handleLlmOutputAutoTitle(
  event: any,
  ctx: any,
  api: any,
): Promise<void> {
  const logger: Logger = api.logger;
  const sessionKey = extractSessionKey(ctx);
  if (!sessionKey) return;

  logger.info(`[GodMode][AutoTitle] llm_output fired for "${sessionKey}", pending keys: [${[...pendingAutoTitles.keys()].join(", ")}]`);

  const firstMessage = pendingAutoTitles.get(sessionKey);
  if (!firstMessage) {
    logger.info(`[GodMode][AutoTitle] No pending message for "${sessionKey}" — skipping`);
    return;
  }

  pendingAutoTitles.delete(sessionKey);
  if (titledSessions.has(sessionKey)) return;

  try {
    const cfg = await loadSessionConfig();
    const { store } = await loadCombinedSessionStoreForGateway(cfg);

    const normalizedKey = sessionKey.trim().toLowerCase();
    const entry = store[normalizedKey];
    if (entry) {
      const existingTitle = (entry.displayName || entry.label || entry.subject || "").trim();
      if (existingTitle) {
        titledSessions.add(sessionKey);
        return;
      }
    }

    const assistantText = (event as { assistantTexts?: string[] }).assistantTexts?.join("") ?? "";

    let title = await generateSessionTitle(firstMessage, assistantText);
    logger.info(`[GodMode][AutoTitle] LLM title result: ${title ? `"${title}"` : "null (falling back to string derivation)"}`);
    if (!title) {
      title = deriveSessionTitle(entry ?? {}, firstMessage) ?? null;
      logger.info(`[GodMode][AutoTitle] String fallback result: ${title ? `"${title}"` : "null"}`);
    }
    if (!title) return;

    const storePath = resolveStorePath(cfg.session?.store);
    await updateSessionStore(storePath, (storeData) => {
      const existing = storeData[normalizedKey] ?? {};
      storeData[normalizedKey] = {
        ...existing,
        displayName: title!,
        updatedAt: Date.now(),
      };
    });

    titledSessions.add(sessionKey);
    evictTitledSessions();
    logger.info(`[GodMode] Auto-titled session "${sessionKey}" → "${title}"`);

    safeBroadcast(api, "sessions:updated", { sessionKey, title });
  } catch (err) {
    logger.warn(`[GodMode] Auto-title error for "${sessionKey}": ${String(err)}`);
  }
}

// ── llm_output: agent log ─────────────────────────────────────────────

export async function handleLlmOutputAgentLog(
  event: any,
  ctx: any,
): Promise<void> {
  const sessionKey = extractSessionKey(ctx);
  if (!sessionKey) return;
  if (!sessionKey.includes(":cron:")) return;
  try {
    const { appendEntry } = await import("../lib/agent-log.js");
    const isError = !!event.error;
    const model = event.model ?? "";
    const cronName = sessionKey.split(":cron:")[1]?.split(":")[0] ?? sessionKey;
    if (isError) {
      await appendEntry({
        category: "error" as any,
        item: `Cron "${cronName}" failed: ${String(event.error)}`,
      });
    } else {
      await appendEntry({
        category: "activity",
        item: `Cron "${cronName}" completed (model: ${model})`,
      });
    }
  } catch { /* non-fatal */ }
}

// ── after_compaction ──────────────────────────────────────────────────

export async function handleAfterCompaction(
  _event: any,
  ctx: any,
  api: any,
): Promise<void> {
  const sessionKey = extractSessionKey(ctx);
  resetContextPressure(sessionKey);
  api.logger.info(`[GodMode] context pressure reset after compaction (session: ${sessionKey ?? "unknown"})`);
}
