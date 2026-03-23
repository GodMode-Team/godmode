/**
 * sdk-shim-infra-runtime.ts — Standalone shim for `openclaw/plugin-sdk/infra-runtime`.
 *
 * Re-exports withFileLock for the Hermes standalone build.
 */

export { withFileLock } from "./file-lock.js";
