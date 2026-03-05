/**
 * GodMode — Consciousness (Awareness Snapshot)
 *
 * `godmode.consciousness.flush` — regenerates awareness snapshot and returns it.
 * `godmode.consciousness.read`  — reads the current awareness snapshot.
 */

import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { setConsciousnessHeartbeatBroadcast } from "../services/consciousness-heartbeat.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

/** Wire the heartbeat's broadcast ref lazily on first RPC call. */
function refreshHeartbeatBroadcast(context: Parameters<GatewayRequestHandler>[0]["context"]): void {
  if (!context?.broadcast) return;
  try {
    setConsciousnessHeartbeatBroadcast(context.broadcast);
  } catch {
    // Heartbeat may not be initialized yet — non-fatal
  }
}

const flush: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);

  try {
    context?.broadcast?.("consciousness:status", { status: "syncing" }, { dropIfSlow: true });

    const { generateSnapshot } = await import("../lib/awareness-snapshot.js");
    const content = await generateSnapshot();
    const lineCount = content.split("\n").length;
    const updatedAt = new Date().toISOString();

    context?.broadcast?.("consciousness:status", {
      status: "ok",
      lineCount,
      updatedAt,
    }, { dropIfSlow: true });

    respond(true, {
      ok: true,
      message: `Awareness snapshot updated (${lineCount} lines)`,
      content,
      lineCount,
      updatedAt,
    });
  } catch (err) {
    context?.broadcast?.("consciousness:status", {
      status: "error",
      message: String(err),
    }, { dropIfSlow: true });

    respond(false, undefined, {
      code: "UNAVAILABLE",
      message: String(err),
    });
  }
};

const read: GatewayRequestHandler = async ({ respond, context }) => {
  refreshHeartbeatBroadcast(context);

  try {
    const { readSnapshot } = await import("../lib/awareness-snapshot.js");
    const content = await readSnapshot();
    if (!content) {
      respond(false, undefined, {
        code: "NOT_FOUND",
        message: "Awareness snapshot not generated yet — run a flush first",
      });
      return;
    }
    respond(true, {
      content,
      lineCount: content.split("\n").length,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    respond(false, undefined, {
      code: "UNAVAILABLE",
      message: String(err),
    });
  }
};

export const consciousnessHandlers: GatewayRequestHandlers = {
  "godmode.consciousness.flush": flush,
  "godmode.consciousness.read": read,
};
