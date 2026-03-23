/**
 * adapter/tool-helpers.ts — Local tool result formatter.
 *
 * Matches the shape returned by `jsonResult` from openclaw/plugin-sdk/agent-runtime.
 * Used by all GodMode tool files via src/lib/sdk-helpers.ts.
 */

/** Wrap a JSON-serializable payload into the standard tool result format. */
export function jsonResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    details: payload,
  };
}
