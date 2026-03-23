/**
 * restart-sentinel.ts — Restart awareness for GodMode.
 *
 * On gateway_stop: writes a sentinel with active session state.
 * On gateway_start: reads it to calculate downtime and inject awareness.
 * One-shot: consumed on first read, cleared after injection.
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";

const SENTINEL_PATH = join(DATA_DIR, "restart-sentinel.json");
const CRASH_SENTINEL_PATH = join(DATA_DIR, "crash-sentinel.json");

export interface RestartSentinel {
  ts: number;
  pid: number;
  activeSessions: string[];
  services: string[];
  reason: "graceful" | "signal" | "unknown";
}

export interface RestartInfo {
  downtimeMs: number;
  previousSessions: string[];
  previousServices: string[];
  reason: string;
}

export interface CrashSentinel {
  ts: number;
  pid: number;
  error: string;
  stack: string;
  type: "uncaughtException" | "unhandledRejection";
  activeSessions: string[];
}

export interface CrashInfo {
  downtimeMs: number;
  error: string;
  stack: string;
  type: string;
  previousSessions: string[];
}

let lastCrash: CrashInfo | null = null;

let lastRestart: RestartInfo | null = null;

/**
 * Write sentinel before shutdown. Call from runGatewayStop().
 */
export function writeSentinel(
  activeSessions: string[],
  services: string[],
  reason: RestartSentinel["reason"] = "graceful",
): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    const sentinel: RestartSentinel = {
      ts: Date.now(),
      pid: process.pid,
      activeSessions,
      services,
      reason,
    };
    writeFileSync(SENTINEL_PATH, JSON.stringify(sentinel, null, 2), "utf-8");
  } catch { /* non-fatal — if we can't write, startup won't read */ }
}

/**
 * Write crash sentinel before process death. Called from global error handlers.
 * Synchronous — must complete before process exits.
 */
export function writeCrashSentinel(
  error: string,
  stack: string,
  type: CrashSentinel["type"],
  activeSessions: string[] = [],
): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    const sentinel: CrashSentinel = {
      ts: Date.now(),
      pid: process.pid,
      error,
      stack,
      type,
      activeSessions,
    };
    writeFileSync(CRASH_SENTINEL_PATH, JSON.stringify(sentinel, null, 2), "utf-8");
  } catch { /* last-resort — if we can't write, at least we tried */ }
}

/**
 * Read and consume sentinel on startup. Call from runGatewayStart().
 */
export function consumeSentinel(): RestartInfo | null {
  try {
    if (!existsSync(SENTINEL_PATH)) return null;
    const raw = readFileSync(SENTINEL_PATH, "utf-8");
    unlinkSync(SENTINEL_PATH);
    const sentinel: RestartSentinel = JSON.parse(raw);
    const info: RestartInfo = {
      downtimeMs: Date.now() - sentinel.ts,
      previousSessions: sentinel.activeSessions,
      previousServices: sentinel.services,
      reason: sentinel.reason,
    };
    lastRestart = info;
    return info;
  } catch {
    return null;
  }
}

/**
 * Read and consume crash sentinel on startup.
 */
export function consumeCrashSentinel(): CrashInfo | null {
  try {
    if (!existsSync(CRASH_SENTINEL_PATH)) return null;
    const raw = readFileSync(CRASH_SENTINEL_PATH, "utf-8");
    unlinkSync(CRASH_SENTINEL_PATH);
    const sentinel: CrashSentinel = JSON.parse(raw);
    const info: CrashInfo = {
      downtimeMs: Date.now() - sentinel.ts,
      error: sentinel.error,
      stack: sentinel.stack,
      type: sentinel.type,
      previousSessions: sentinel.activeSessions,
    };
    lastCrash = info;
    return info;
  } catch {
    return null;
  }
}

export function getLastCrash(): CrashInfo | null {
  return lastCrash;
}

export function clearLastCrash(): void {
  lastCrash = null;
}

/**
 * Get the last restart info (for context injection). Consumed after first read.
 */
export function getLastRestart(): RestartInfo | null {
  return lastRestart;
}

/**
 * Clear restart info after it's been injected into context.
 */
export function clearLastRestart(): void {
  lastRestart = null;
}
