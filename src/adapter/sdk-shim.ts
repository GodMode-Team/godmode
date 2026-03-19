/**
 * sdk-shim.ts — Build-time replacement for `openclaw/plugin-sdk` in standalone mode.
 *
 * tsup aliases `openclaw/plugin-sdk` → this file for the Hermes standalone build.
 * Re-exports the same symbols the method and tool files expect, backed by
 * standalone implementations (no OpenClaw dependency).
 */

export { withFileLock } from "./file-lock.js";
export { jsonResult } from "./tool-helpers.js";

// Type re-exports — these are erased at compile time, but having them here
// prevents TypeScript from complaining if someone uses a value import.
export type { StandaloneRequestHandler as GatewayRequestHandler } from "./types.js";
export type { StandaloneAgentTool as AnyAgentTool } from "./types.js";

// OpenClawPluginApi is used as a type annotation in host-context.ts — erased at compile time.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type OpenClawPluginApi = Record<string, any>;
