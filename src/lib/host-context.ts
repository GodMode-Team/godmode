/**
 * Host Context — Server-side host detection + self-healing compatibility.
 *
 * On every gateway restart, detects the host environment (OpenClaw version,
 * available APIs, field naming conventions) and caches the results.
 * Provides safe wrappers for common operations that vary between host versions.
 *
 * Change detection compares current scan against cached state from last restart
 * and logs detailed diffs so breakages are immediately visible.
 */

import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────

export type HostCapability = {
  available: boolean;
  /** Last tested timestamp (ISO) */
  testedAt: string;
  /** Error message if probe failed */
  error?: string;
};

export type HostContextState = {
  /** Host version string (e.g. "2026.3.1") */
  hostVersion: string;
  /** Whether the broadcast function is available on the api object */
  hasBroadcast: boolean;
  /** Which field name the host uses for session display name */
  sessionNameField: "label" | "displayName" | "unknown";
  /** Which field name the host uses for session key in hook contexts */
  sessionKeyField: "sessionKey" | "conversationId" | "unknown";
  /** Probed RPC method availability */
  methods: Record<string, HostCapability>;
  /** When this scan was performed */
  scannedAt: string;
  /** Plugin version at scan time */
  pluginVersion: string;
};

type HostContextDiff = {
  field: string;
  previous: string;
  current: string;
};

// ── State ──────────────────────────────────────────────────────────

const COMPAT_FILE = join(DATA_DIR, "host-compat.json");

let _context: HostContextState | null = null;

// ── Detection ──────────────────────────────────────────────────────

/**
 * Detect host context by probing the api object.
 * Called once in gateway_start BEFORE services initialize.
 */
export async function detectHostContext(
  api: OpenClawPluginApi,
  pluginVersion: string,
): Promise<{ context: HostContextState; changes: HostContextDiff[] }> {
  const logger = api.logger;

  // Detect host version
  let hostVersion = "unknown";
  try {
    const { execSync } = await import("node:child_process");
    hostVersion = execSync("openclaw --version 2>/dev/null", { timeout: 5000 }).toString().trim();
  } catch {
    // Not on PATH — try api.version if available
    if ((api as Record<string, unknown>).version) {
      hostVersion = String((api as Record<string, unknown>).version);
    }
  }

  // Detect broadcast availability
  const hasBroadcast = typeof (api as unknown as Record<string, unknown>).broadcast === "function";

  // Build context
  const context: HostContextState = {
    hostVersion,
    hasBroadcast,
    sessionNameField: "label", // Default to new convention; runtime validates
    sessionKeyField: "sessionKey", // All current hooks use sessionKey
    methods: {},
    scannedAt: new Date().toISOString(),
    pluginVersion,
  };

  // Load previous context for change detection
  let previous: HostContextState | null = null;
  try {
    const raw = await readFile(COMPAT_FILE, "utf-8");
    previous = JSON.parse(raw) as HostContextState;
  } catch {
    // No previous context — first run
  }

  // Detect changes
  const changes: HostContextDiff[] = [];
  if (previous) {
    if (previous.hostVersion !== context.hostVersion) {
      changes.push({
        field: "hostVersion",
        previous: previous.hostVersion,
        current: context.hostVersion,
      });
    }
    if (previous.hasBroadcast !== context.hasBroadcast) {
      changes.push({
        field: "hasBroadcast",
        previous: String(previous.hasBroadcast),
        current: String(context.hasBroadcast),
      });
    }
    if (previous.sessionNameField !== context.sessionNameField) {
      changes.push({
        field: "sessionNameField",
        previous: previous.sessionNameField,
        current: context.sessionNameField,
      });
    }
  }

  // Log results
  if (changes.length > 0) {
    logger.warn(
      `[GodMode][HostContext] Host changes detected since last restart:\n` +
        changes.map((c) => `  ${c.field}: "${c.previous}" → "${c.current}"`).join("\n"),
    );
  } else if (previous) {
    logger.info(`[GodMode][HostContext] Host unchanged: v${hostVersion}, broadcast=${hasBroadcast}`);
  } else {
    logger.info(`[GodMode][HostContext] First scan: v${hostVersion}, broadcast=${hasBroadcast}`);
  }

  // Persist
  _context = context;
  try {
    await mkdir(dirname(COMPAT_FILE), { recursive: true });
    // Atomic write: temp file + rename to prevent corruption on crash
    const tmpPath = COMPAT_FILE + ".tmp";
    await writeFile(tmpPath, JSON.stringify(context, null, 2), "utf-8");
    await rename(tmpPath, COMPAT_FILE);
  } catch (err) {
    logger.warn(`[GodMode][HostContext] Failed to persist compat state: ${String(err)}`);
  }

  // Broadcast change event if UI is connected
  if (changes.length > 0 && hasBroadcast) {
    safeBroadcast(api, "host:compat-change", { changes, context });
  }

  return { context, changes };
}

/**
 * Run a compatibility scan against critical RPC methods.
 * Probes each method with safe/invalid params to discover availability and schema.
 * Non-blocking — results cached for runtime use.
 */
export async function runCompatScan(
  apiRequest: (method: string, params?: unknown) => Promise<unknown>,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<Record<string, HostCapability>> {
  const methods: Record<string, HostCapability> = {};

  const probes: Array<{ method: string; params: unknown }> = [
    { method: "sessions.list", params: { limit: 1 } },
    { method: "sessions.patch", params: { key: "__compat_probe__" } },
    { method: "config.get", params: {} },
    { method: "chat.history", params: { sessionKey: "__compat_probe__" } },
    { method: "sessions.autoTitle", params: { sessionKey: "__compat_probe__" } },
  ];

  let passed = 0;
  let failed = 0;

  for (const probe of probes) {
    try {
      await apiRequest(probe.method, probe.params);
      methods[probe.method] = { available: true, testedAt: new Date().toISOString() };
      passed++;
    } catch (err) {
      const errMsg = String(err);
      // "unknown method" means the method doesn't exist
      // Other errors (bad params, not found) mean the method exists but our probe params were invalid
      const isMethodMissing =
        errMsg.includes("unknown method") ||
        errMsg.includes("not found") && errMsg.includes("method");
      methods[probe.method] = {
        available: !isMethodMissing,
        testedAt: new Date().toISOString(),
        error: isMethodMissing ? "method not available" : undefined,
      };
      if (isMethodMissing) {
        failed++;
      } else {
        passed++; // Method exists, just bad probe params
      }
    }
  }

  if (_context) {
    _context.methods = methods;
    try {
      await mkdir(dirname(COMPAT_FILE), { recursive: true });
      // Atomic write: temp file + rename to prevent corruption on crash
      const tmpPath = COMPAT_FILE + ".tmp";
      await writeFile(tmpPath, JSON.stringify(_context, null, 2), "utf-8");
      await rename(tmpPath, COMPAT_FILE);
    } catch {
      // Non-fatal
    }
  }

  const removedMethods = Object.entries(methods)
    .filter(([, cap]) => !cap.available)
    .map(([m]) => m);

  if (removedMethods.length > 0) {
    logger.warn(
      `[GodMode][HostContext] Compat scan: ${passed}/${probes.length} passed. ` +
        `REMOVED: ${removedMethods.join(", ")}`,
    );
  } else {
    logger.info(`[GodMode][HostContext] Compat scan: ${passed}/${probes.length} RPCs passed`);
  }

  return methods;
}

// ── Safe Wrappers ──────────────────────────────────────────────────

/**
 * Extract session key from a hook context object.
 * Tries both `sessionKey` and `conversationId` for cross-version compat.
 */
export function extractSessionKey(ctx: unknown): string | undefined {
  if (!ctx || typeof ctx !== "object") return undefined;
  const c = ctx as Record<string, unknown>;
  // Prefer sessionKey (current), fall back to conversationId (possible future rename)
  if (typeof c.sessionKey === "string") return c.sessionKey;
  if (typeof c.conversationId === "string") return c.conversationId;
  return undefined;
}

/**
 * Safe broadcast wrapper. No-op if broadcast is unavailable.
 * Eliminates the unsafe `(api as unknown as Record<string, Function>).broadcast` cast.
 */
export function safeBroadcast(
  api: OpenClawPluginApi,
  event: string,
  data?: unknown,
): void {
  try {
    const broadcastFn = (api as unknown as Record<string, Function>).broadcast;
    if (typeof broadcastFn === "function") {
      broadcastFn(event, data);
    }
  } catch {
    // Broadcast failure is never fatal
  }
}

/**
 * Get the cached host version string.
 */
export function getHostVersion(): string {
  return _context?.hostVersion ?? "unknown";
}

/**
 * Get the cached host context (null if not yet scanned).
 */
export function getHostContext(): HostContextState | null {
  return _context;
}

/**
 * Check if a specific RPC method is known to be available.
 * Returns undefined if not yet probed.
 */
export function isMethodAvailable(method: string): boolean | undefined {
  if (!_context?.methods[method]) return undefined;
  return _context.methods[method].available;
}

/**
 * Get the detected session name field for the current host.
 */
export function getSessionNameField(): "label" | "displayName" | "unknown" {
  return _context?.sessionNameField ?? "label";
}
