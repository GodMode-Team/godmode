/**
 * guardrails.ts — Gateway methods for the Guardrails safety gate dashboard.
 *
 * Provides RPC handlers to list gates, toggle/configure them, and read activity.
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import {
  readGuardrailsState,
  writeGuardrailsState,
  addCustomGuardrail,
  removeCustomGuardrail,
  GATE_DEFAULTS,
  GATE_DESCRIPTORS,
  type GuardrailGateId,
  type CustomGuardrail,
} from "../services/guardrails.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const ALL_GATE_IDS = Object.keys(GATE_DEFAULTS) as GuardrailGateId[];

const listGuardrails: GatewayRequestHandler = async ({ respond }) => {
  const state = await readGuardrailsState();
  const gates = ALL_GATE_IDS.map((id) => ({
    id,
    ...(state.gates[id] ?? GATE_DEFAULTS[id]),
    ...GATE_DESCRIPTORS[id],
  }));
  respond(true, { gates, custom: state.custom ?? [] });
};

const setGuardrail: GatewayRequestHandler = async ({ params, respond, context }) => {
  const { gateId, enabled, thresholds } = (params ?? {}) as {
    gateId?: string;
    enabled?: boolean;
    thresholds?: Record<string, number>;
  };

  if (!gateId || typeof gateId !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "gateId is required" });
    return;
  }

  if (!(gateId in GATE_DEFAULTS)) {
    respond(false, null, { code: "INVALID_REQUEST", message: `Unknown gate: ${gateId}` });
    return;
  }

  const state = await readGuardrailsState();
  const id = gateId as GuardrailGateId;
  const gate = state.gates[id] ?? { ...GATE_DEFAULTS[id] };

  if (typeof enabled === "boolean") gate.enabled = enabled;
  if (thresholds && typeof thresholds === "object") {
    gate.thresholds = { ...(gate.thresholds ?? {}), ...thresholds };
  }

  state.gates[id] = gate;
  await writeGuardrailsState(state);

  context?.broadcast?.("guardrails:update", { gates: state.gates }, { dropIfSlow: true });
  respond(true, { gateId, ...gate });
};

const getGuardrailsHistory: GatewayRequestHandler = async ({ params, respond }) => {
  const { gateId, limit } = (params ?? {}) as { gateId?: string; limit?: number };
  const state = await readGuardrailsState();
  let entries = state.activity.slice().reverse();
  if (gateId) entries = entries.filter((e) => e.gateId === gateId);
  if (limit && limit > 0) entries = entries.slice(0, limit);
  respond(true, { activity: entries, total: entries.length });
};

const addCustomGuardrailHandler: GatewayRequestHandler = async ({ params, respond, context }) => {
  const input = (params as { guardrail?: Partial<CustomGuardrail> })?.guardrail;

  if (!input || typeof input !== "object") {
    respond(false, null, { code: "INVALID_REQUEST", message: "guardrail object is required" });
    return;
  }

  if (!input.name || typeof input.name !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "name is required" });
    return;
  }
  if (!input.trigger || typeof input.trigger !== "object") {
    respond(false, null, { code: "INVALID_REQUEST", message: "trigger is required" });
    return;
  }
  if (!input.trigger.tool || typeof input.trigger.tool !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "trigger.tool is required" });
    return;
  }
  if (!Array.isArray(input.trigger.patterns) || input.trigger.patterns.length === 0) {
    respond(false, null, { code: "INVALID_REQUEST", message: "trigger.patterns must be a non-empty array" });
    return;
  }
  if (input.action !== "block") {
    respond(false, null, { code: "INVALID_REQUEST", message: 'action must be "block"' });
    return;
  }
  if (!input.message || typeof input.message !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "message is required" });
    return;
  }

  try {
    const guardrail = await addCustomGuardrail({
      id: input.id ?? "",
      name: input.name,
      description: input.description ?? "",
      enabled: input.enabled ?? true,
      trigger: { tool: input.trigger.tool, patterns: input.trigger.patterns },
      action: "block",
      message: input.message,
    });
    context?.broadcast?.("guardrails:update", {}, { dropIfSlow: true });
    respond(true, { guardrail });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code ?? "INTERNAL_ERROR";
    const message = err instanceof Error ? err.message : String(err);
    respond(false, null, { code, message });
  }
};

const removeCustomGuardrailHandler: GatewayRequestHandler = async ({ params, respond, context }) => {
  const { id } = (params ?? {}) as { id?: string };

  if (!id || typeof id !== "string") {
    respond(false, null, { code: "INVALID_REQUEST", message: "id is required" });
    return;
  }

  const result = await removeCustomGuardrail(id);
  if (result.removed) {
    context?.broadcast?.("guardrails:update", {}, { dropIfSlow: true });
  }
  respond(true, result);
};

export const guardrailsHandlers: GatewayRequestHandlers = {
  "guardrails.list": listGuardrails,
  "guardrails.set": setGuardrail,
  "guardrails.history": getGuardrailsHistory,
  "guardrails.addCustom": addCustomGuardrailHandler,
  "guardrails.removeCustom": removeCustomGuardrailHandler,
};
