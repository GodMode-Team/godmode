/**
 * corrections.ts — Gateway methods for the correction log and guardrail proposal system.
 *
 * Provides RPCs to list corrections, log new ones, view detected patterns,
 * list proposed guardrails, and approve/dismiss proposals.
 */

import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  readCorrectionLog,
  logCorrection,
  listProposals,
  resolveProposal,
  listPatterns,
  type CorrectionCategory,
  type LogCorrectionInput,
  type GuardrailProposal,
} from "../lib/correction-log.js";
import { addCustomGuardrail } from "../services/guardrails.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── List corrections ──────────────────────────────────────────────

const listCorrections: GatewayRequestHandler = async ({ params, respond }) => {
  const { category, limit } = params as {
    category?: CorrectionCategory;
    limit?: number;
  };

  const log = await readCorrectionLog();
  let entries = log.entries.slice().reverse();

  if (category) {
    entries = entries.filter((e) => e.category === category);
  }
  if (limit && limit > 0) {
    entries = entries.slice(0, limit);
  }

  respond(true, { entries, total: entries.length });
};

// ── Log a correction ──────────────────────────────────────────────

const logCorrectionHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const input = params as Partial<LogCorrectionInput>;

  if (!input.correctionSignal || typeof input.correctionSignal !== "string") {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: "correctionSignal is required",
    });
    return;
  }

  const result = await logCorrection({
    originalText: input.originalText ?? "",
    correctedText: input.correctedText ?? "",
    correctionSignal: input.correctionSignal,
    category: input.category,
    subcategory: input.subcategory,
    sessionKey: input.sessionKey,
    taskType: input.taskType,
    toolInvolved: input.toolInvolved,
    personaHint: input.personaHint,
  });

  respond(true, {
    entry: result.entry,
    patternsDetected: result.newPatterns.length,
    proposalsGenerated: result.newProposals.length,
  });
};

// ── List detected patterns ────────────────────────────────────────

const listPatternsHandler: GatewayRequestHandler = async ({ params, respond }) => {
  const { status } = params as { status?: string };

  const validStatuses = ["detected", "proposed", "accepted", "dismissed"];
  const statusFilter = status && validStatuses.includes(status)
    ? (status as "detected" | "proposed" | "accepted" | "dismissed")
    : undefined;

  const patterns = await listPatterns(statusFilter);
  respond(true, { patterns, total: patterns.length });
};

// ── List proposed guardrails (queue.proposedGuardrails) ──────────

const proposedGuardrails: GatewayRequestHandler = async ({ params, respond }) => {
  const { status } = params as { status?: string };

  const validStatuses = ["draft", "presented", "accepted", "edited", "dismissed"];
  const statusFilter = status && validStatuses.includes(status)
    ? (status as GuardrailProposal["status"])
    : undefined;

  // Default to showing actionable proposals (draft + presented)
  let proposals: GuardrailProposal[];
  if (statusFilter) {
    proposals = await listProposals(statusFilter);
  } else {
    const all = await listProposals();
    proposals = all.filter((p) => p.status === "draft" || p.status === "presented");
  }

  respond(true, { proposals, total: proposals.length });
};

// ── Approve a guardrail proposal (queue.approveGuardrail) ───────

const approveGuardrail: GatewayRequestHandler = async ({ params, respond, context }) => {
  const { proposalId, action, editedContent } = params as {
    proposalId?: string;
    action?: "accepted" | "dismissed" | "edited";
    editedContent?: Partial<GuardrailProposal>;
  };

  if (!proposalId || typeof proposalId !== "string") {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: "proposalId is required",
    });
    return;
  }

  const resolveAction = action ?? "accepted";
  if (!["accepted", "dismissed", "edited"].includes(resolveAction)) {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: 'action must be "accepted", "dismissed", or "edited"',
    });
    return;
  }

  const resolved = await resolveProposal(proposalId, resolveAction, editedContent);
  if (!resolved) {
    respond(false, null, {
      code: "NOT_FOUND",
      message: `Proposal "${proposalId}" not found`,
    });
    return;
  }

  // If accepted and it's a custom-guardrail type, install it
  if (
    (resolveAction === "accepted" || resolveAction === "edited") &&
    resolved.enforcementLevel === "custom-guardrail" &&
    resolved.guardrail
  ) {
    try {
      await addCustomGuardrail({
        name: resolved.guardrail.name,
        description: resolved.guardrail.description,
        enabled: true,
        trigger: resolved.guardrail.trigger,
        action: resolved.guardrail.action,
        message: resolved.guardrail.message,
        ...(resolved.guardrail.redirectTo
          ? { redirectTo: resolved.guardrail.redirectTo }
          : {}),
      });
      context?.broadcast?.("guardrails:update", {}, { dropIfSlow: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      respond(false, null, {
        code: "GUARDRAIL_INSTALL_FAILED",
        message: `Proposal resolved but guardrail install failed: ${message}`,
      });
      return;
    }
  }

  context?.broadcast?.("corrections:update", {}, { dropIfSlow: true });
  respond(true, { proposal: resolved });
};

// ── Export ────────────────────────────────────────────────────────

export const correctionsHandlers: GatewayRequestHandlers = {
  "corrections.list": listCorrections,
  "corrections.log": logCorrectionHandler,
  "corrections.patterns": listPatternsHandler,
  "queue.proposedGuardrails": proposedGuardrails,
  "queue.approveGuardrail": approveGuardrail,
};
