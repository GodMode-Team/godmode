import { homedir } from "node:os";
import { join } from "node:path";

/**
 * GodMode workspace root and shared directory paths.
 * All GodMode data, memory, skills, and docs live under ~/godmode/.
 */

/** GodMode workspace root: ~/godmode (overridable via GODMODE_ROOT env var) */
export const GODMODE_ROOT = process.env.GODMODE_ROOT || join(homedir(), "godmode");

/** Root data directory: ~/godmode/data */
export const DATA_DIR = join(GODMODE_ROOT, "data");

/** Root memory directory: ~/godmode/memory */
export const MEMORY_DIR = join(GODMODE_ROOT, "memory");
