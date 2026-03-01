import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { platform, arch } from "node:os";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { GODMODE_ROOT, localDateString } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const SUPPORT_LOGS_DIR = join(GODMODE_ROOT, "support-logs");
const CONVERSATIONS_DIR = join(SUPPORT_LOGS_DIR, "conversations");
const ESCALATIONS_DIR = join(SUPPORT_LOGS_DIR, "escalations");

// ── Diagnostics ─────────────────────────────────────────────────

type DiagnosticsResult = {
  pluginVersion: string;
  platform: string;
  arch: string;
  nodeVersion: string;
  godmodeRoot: string;
  timestamp: string;
};

export async function collectDiagnosticsInternal(): Promise<DiagnosticsResult> {
  let pluginVersion = "unknown";
  try {
    const pkgPath = join(dirname(new URL(import.meta.url).pathname), "..", "..", "package.json");
    const raw = await readFile(pkgPath, "utf-8");
    pluginVersion = JSON.parse(raw).version ?? "unknown";
  } catch {
    // package.json not readable — non-fatal
  }
  return {
    pluginVersion,
    platform: platform(),
    arch: arch(),
    nodeVersion: process.version,
    godmodeRoot: GODMODE_ROOT,
    timestamp: new Date().toISOString(),
  };
}

const collectDiagnostics: GatewayRequestHandler = async ({ respond }) => {
  try {
    const diagnostics = await collectDiagnosticsInternal();
    respond(true, diagnostics);
  } catch (err) {
    respond(false, null, { code: "DIAGNOSTICS_FAILED", message: String(err) });
  }
};

// ── Conversation Logging ────────────────────────────────────────

function timeStr(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export async function logExchangeInternal(
  role: "user" | "assistant",
  content: string,
): Promise<void> {
  const dateStr = localDateString();
  const logFile = join(CONVERSATIONS_DIR, `${dateStr}.md`);
  await mkdir(CONVERSATIONS_DIR, { recursive: true });

  const label = role === "user" ? "Customer" : "Atlas";
  const entry = `### ${timeStr()} — ${label}\n${content.trim()}\n\n`;

  let existing = "";
  try {
    existing = await readFile(logFile, "utf-8");
  } catch {
    // New file — write header
    existing = `# Support Conversations — ${dateStr}\n\n`;
  }
  await writeFile(logFile, existing + entry, "utf-8");
}

const logExchange: GatewayRequestHandler = async ({ params, respond }) => {
  const { role, content } = params as { role?: string; content?: string };
  if (!role || !content) {
    respond(false, null, { code: "INVALID_PARAMS", message: "role and content are required" });
    return;
  }
  try {
    await logExchangeInternal(role as "user" | "assistant", content);
    respond(true, { logged: true });
  } catch (err) {
    respond(false, null, { code: "LOG_FAILED", message: String(err) });
  }
};

// ── Escalation ──────────────────────────────────────────────────

const escalate: GatewayRequestHandler = async ({ params, respond }) => {
  const { summary, diagnostics, conversationExcerpt } = params as {
    summary?: string;
    diagnostics?: Record<string, unknown>;
    conversationExcerpt?: string;
  };
  if (!summary) {
    respond(false, null, { code: "INVALID_PARAMS", message: "summary is required" });
    return;
  }
  try {
    const now = new Date();
    const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const ticketFile = join(ESCALATIONS_DIR, `${ts}.json`);
    await mkdir(ESCALATIONS_DIR, { recursive: true });
    const ticket = {
      timestamp: now.toISOString(),
      summary,
      diagnostics: diagnostics ?? (await collectDiagnosticsInternal()),
      conversationExcerpt: conversationExcerpt ?? null,
      status: "open",
    };
    await writeFile(ticketFile, JSON.stringify(ticket, null, 2), "utf-8");
    respond(true, { ticketPath: ticketFile, status: "open" });
  } catch (err) {
    respond(false, null, { code: "ESCALATION_FAILED", message: String(err) });
  }
};

// ── Exports ─────────────────────────────────────────────────────

export const supportHandlers: GatewayRequestHandlers = {
  "support.diagnostics": collectDiagnostics,
  "support.logExchange": logExchange,
  "support.escalate": escalate,
};
