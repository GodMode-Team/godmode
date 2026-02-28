/**
 * guardrails.ts — Gateway methods for the Guardrails safety gate dashboard.
 *
 * Provides RPC handlers to list gates, toggle/configure them, and read activity.
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import {
  readGuardrailsState,
  writeGuardrailsState,
  GATE_DEFAULTS,
  GATE_DESCRIPTORS,
  type GuardrailGateId,
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
  respond(true, { gates });
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

export const guardrailsHandlers: GatewayRequestHandlers = {
  "guardrails.list": listGuardrails,
  "guardrails.set": setGuardrail,
  "guardrails.history": getGuardrailsHistory,
};
