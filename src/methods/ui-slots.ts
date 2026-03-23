import type { GatewayRequestHandler } from "../types/plugin-api.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

export type SlotUpdatePayload = {
  tabId: string;
  html: string | null;
  mode?: "replace" | "append";
};

export const uiSlotsHandlers: GatewayRequestHandlers = {
  "ui.slot.update": async ({ params, respond, context }) => {
    const tabId = params.tabId as string | undefined;
    const html = (params.html as string | null) ?? null;
    const mode = (params.mode as "replace" | "append") ?? "replace";

    if (!tabId) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "tabId is required" });
      return;
    }

    const payload: SlotUpdatePayload = { tabId, html, mode };
    context?.broadcast?.("ui.slot.update", payload, { dropIfSlow: true });
    respond(true, { ok: true });
  },

  "ui.slot.clear": async ({ params, respond, context }) => {
    const tabId = params.tabId as string | undefined;
    if (!tabId) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "tabId is required" });
      return;
    }

    const payload: SlotUpdatePayload = { tabId, html: null, mode: "replace" };
    context?.broadcast?.("ui.slot.update", payload, { dropIfSlow: true });
    respond(true, { ok: true });
  },
};
