/**
 * GodMode — Resources Registry (STUBBED for v2 slim)
 *
 * Returns empty results. Kept to avoid breaking UI references.
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const list: GatewayRequestHandler = async ({ respond }) => {
  respond(true, { resources: [], total: 0 });
};

const pin: GatewayRequestHandler = async ({ respond }) => {
  respond(true, { ok: true });
};

const remove: GatewayRequestHandler = async ({ respond }) => {
  respond(true, { ok: true });
};

const register: GatewayRequestHandler = async ({ respond }) => {
  respond(true, { id: "stub", title: "stub" });
};

export const resourcesHandlers: GatewayRequestHandlers = {
  "resources.list": list,
  "resources.pin": pin,
  "resources.delete": remove,
  "resources.register": register,
};
