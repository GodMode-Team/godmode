/**
 * adapter/tool-helpers.ts — Standalone tool result formatter.
 *
 * Equivalent to `jsonResult` from openclaw/plugin-sdk.
 * Used by all 15 GodMode tool files.
 */

import type { AgentToolResult } from "./types.js";

/** Wrap a JSON-serializable payload into the standard tool result format. */
export function jsonResult(payload: unknown): AgentToolResult {
  return { type: "text", text: JSON.stringify(payload, null, 2) };
}
