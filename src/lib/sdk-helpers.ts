/**
 * sdk-helpers.ts — Local re-exports of SDK utilities.
 *
 * jsonResult and withFileLock moved to openclaw/plugin-sdk subpaths in 2026.3.22,
 * but the gateway plugin loader can't resolve subpath imports. Re-export from
 * the local adapter shims so both plugin and standalone builds work.
 */

export { jsonResult } from "../adapter/tool-helpers.js";
export { withFileLock } from "../adapter/file-lock.js";
