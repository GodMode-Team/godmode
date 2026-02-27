import { truncateText } from "./format";
import type { ToolExecutionInfo } from "./types/chat-types";

const TOOL_STREAM_LIMIT = 50;
const TOOL_STREAM_THROTTLE_MS = 80;
const TOOL_OUTPUT_CHAR_LIMIT = 120_000;

export type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: string;
  ts: number;
  sessionKey?: string;
  data: Record<string, unknown>;
};

export type ToolStreamEntry = {
  toolCallId: string;
  runId: string;
  sessionKey?: string;
  name: string;
  args?: unknown;
  output?: string;
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
  message: Record<string, unknown>;
  // Display-friendly versions for the work stream UI
  displayArgs?: string;
  resultSummary?: string;
  success?: boolean;
};

type ToolStreamHost = {
  sessionKey: string;
  chatRunId: string | null;
  toolStreamById: Map<string, ToolStreamEntry>;
  toolStreamOrder: string[];
  chatToolMessages: Record<string, unknown>[];
  toolStreamSyncTimer: number | null;
  currentToolName: string | null;
  currentToolInfo: ToolExecutionInfo | null;
};

/** Truncate a string for display */
function truncateDisplay(text: string, max: number): string {
  if (!text) {
    return "";
  }
  const clean = text.trim().replace(/\n/g, " ");
  if (clean.length <= max) {
    return clean;
  }
  return clean.slice(0, max - 1) + "…";
}

/** Safely convert unknown value to string (avoids [object Object]) */
function safeStr(v: unknown): string {
  if (typeof v === "string") {
    return v;
  }
  if (v == null) {
    return "";
  }
  return JSON.stringify(v);
}

/** Format tool arguments for display in the work stream */
function formatArgsForDisplay(toolName: string, args: unknown): string {
  if (!args || typeof args !== "object") {
    return "";
  }
  const a = args as Record<string, unknown>;

  switch (toolName.toLowerCase()) {
    case "exec":
      return a.command ? `\`${truncateDisplay(safeStr(a.command), 60)}\`` : "";
    case "read":
      return a.path || a.file_path
        ? `\`${truncateDisplay(safeStr(a.path || a.file_path), 50)}\``
        : "";
    case "write":
      return a.path || a.file_path
        ? `→ \`${truncateDisplay(safeStr(a.path || a.file_path), 50)}\``
        : "";
    case "edit":
      return a.path || a.file_path
        ? `\`${truncateDisplay(safeStr(a.path || a.file_path), 50)}\``
        : "";
    case "web_search":
      return a.query ? `"${truncateDisplay(safeStr(a.query), 45)}"` : "";
    case "web_fetch":
      try {
        const url = new URL(safeStr(a.url));
        return url.hostname + (url.pathname !== "/" ? url.pathname.slice(0, 30) : "");
      } catch {
        return truncateDisplay(safeStr(a.url || ""), 50);
      }
    case "memory_search":
      return a.query ? `"${truncateDisplay(safeStr(a.query), 45)}"` : "";
    case "browser":
      const action = safeStr(a.action);
      const ref = a.ref ? ` #${safeStr(a.ref)}` : "";
      const targetUrl = a.targetUrl ? ` ${truncateDisplay(safeStr(a.targetUrl), 30)}` : "";
      return `${action}${ref}${targetUrl}`;
    case "message":
      return a.action
        ? `${safeStr(a.action)}${a.target ? ` → ${truncateDisplay(safeStr(a.target), 25)}` : ""}`
        : "";
    case "sessions_spawn":
      return a.task ? `"${truncateDisplay(safeStr(a.task), 40)}"` : "";
    case "cron":
      return a.action ? safeStr(a.action) : "";
    case "files_read":
      return a.fileId ? `file:${truncateDisplay(safeStr(a.fileId), 20)}` : "";
    case "image":
      return a.image ? truncateDisplay(safeStr(a.image), 40) : "";
    default:
      // Show first meaningful key=value
      const keys = Object.keys(a).filter((k) => !["timeout", "timeoutMs"].includes(k));
      if (keys.length === 0) {
        return "";
      }
      const key = keys[0];
      const val = a[key];
      if (typeof val === "string") {
        return `${key}: ${truncateDisplay(val, 35)}`;
      }
      return "";
  }
}

/** Format result output for display summary */
function formatResultSummary(toolName: string, output: string | null | undefined): string {
  if (!output) {
    return "";
  }

  const lower = toolName.toLowerCase();
  const lines = output.split("\n");
  const lineCount = lines.length;
  const charCount = output.length;

  // File reads: show size
  if (["read", "files_read"].includes(lower)) {
    return `${charCount.toLocaleString()} chars${lineCount > 1 ? `, ${lineCount} lines` : ""}`;
  }

  // Commands: show line count or first line
  if (lower === "exec") {
    if (lineCount > 1) {
      return `${lineCount} lines`;
    }
    return truncateDisplay(lines[0], 50);
  }

  // Searches: try to count results
  if (["web_search", "memory_search"].includes(lower)) {
    try {
      const parsed = JSON.parse(output);
      const count = parsed.results?.length ?? parsed.count ?? 0;
      return `${count} result${count !== 1 ? "s" : ""}`;
    } catch {
      return truncateDisplay(output, 40);
    }
  }

  // Browser actions
  if (lower === "browser") {
    if (output.includes("snapshot")) {
      return "snapshot captured";
    }
    if (output.includes("success")) {
      return "success";
    }
    return truncateDisplay(output, 40);
  }

  // Default: character count or truncated text
  if (charCount > 100) {
    return `${charCount.toLocaleString()} chars`;
  }
  return truncateDisplay(output, 50);
}

/** Determine if a result indicates success */
function isSuccessResult(output: string | null | undefined): boolean {
  if (!output) {
    return true;
  } // Empty result often means success
  const lower = output.toLowerCase();
  // Check for common error patterns
  if (
    lower.includes("error:") ||
    lower.includes("failed") ||
    lower.includes("exception") ||
    lower.includes("not found")
  ) {
    return false;
  }
  return true;
}

function extractToolOutputText(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (typeof record.text === "string") {
    return record.text;
  }
  const content = record.content;
  if (!Array.isArray(content)) {
    return null;
  }
  const parts = content
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const entry = item as Record<string, unknown>;
      if (entry.type === "text" && typeof entry.text === "string") {
        return entry.text;
      }
      return null;
    })
    .filter((part): part is string => Boolean(part));
  if (parts.length === 0) {
    return null;
  }
  return parts.join("\n");
}

function formatToolOutput(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  const contentText = extractToolOutputText(value);
  let text: string;
  if (typeof value === "string") {
    text = value;
  } else if (contentText) {
    text = contentText;
  } else {
    try {
      text = JSON.stringify(value, null, 2);
    } catch {
      text = typeof value === "object" ? "[object]" : String(value as string);
    }
  }
  const truncated = truncateText(text, TOOL_OUTPUT_CHAR_LIMIT);
  if (!truncated.truncated) {
    return truncated.text;
  }
  return `${truncated.text}\n\n… truncated (${truncated.total} chars, showing first ${truncated.text.length}).`;
}

function buildToolStreamMessage(entry: ToolStreamEntry): Record<string, unknown> {
  const content: Array<Record<string, unknown>> = [];
  content.push({
    type: "toolcall",
    name: entry.name,
    arguments: entry.args ?? {},
  });
  if (entry.output) {
    content.push({
      type: "toolresult",
      name: entry.name,
      text: entry.output,
    });
  }
  return {
    role: "assistant",
    toolCallId: entry.toolCallId,
    runId: entry.runId,
    content,
    timestamp: entry.startedAt,
  };
}

function trimToolStream(host: ToolStreamHost) {
  if (host.toolStreamOrder.length <= TOOL_STREAM_LIMIT) {
    return;
  }
  const overflow = host.toolStreamOrder.length - TOOL_STREAM_LIMIT;
  const removed = host.toolStreamOrder.splice(0, overflow);
  for (const id of removed) {
    host.toolStreamById.delete(id);
  }
}

function syncToolStreamMessages(host: ToolStreamHost) {
  host.chatToolMessages = host.toolStreamOrder
    .map((id) => host.toolStreamById.get(id)?.message)
    .filter((msg): msg is Record<string, unknown> => Boolean(msg));
}

export function flushToolStreamSync(host: ToolStreamHost) {
  if (host.toolStreamSyncTimer != null) {
    clearTimeout(host.toolStreamSyncTimer);
    host.toolStreamSyncTimer = null;
  }
  syncToolStreamMessages(host);
}

export function scheduleToolStreamSync(host: ToolStreamHost, force = false) {
  if (force) {
    flushToolStreamSync(host);
    return;
  }
  if (host.toolStreamSyncTimer != null) {
    return;
  }
  host.toolStreamSyncTimer = window.setTimeout(
    () => flushToolStreamSync(host),
    TOOL_STREAM_THROTTLE_MS,
  );
}

export function resetToolStream(host: ToolStreamHost) {
  host.toolStreamById.clear();
  host.toolStreamOrder = [];
  host.chatToolMessages = [];
  host.currentToolName = null;
  host.currentToolInfo = null;
  // Clear compaction status so it doesn't bleed across session switches
  const compHost = host as unknown as CompactionHost;
  if (compHost.compactionStatus) {
    compHost.compactionStatus = null;
  }
  if (compHost.compactionClearTimer != null) {
    window.clearTimeout(compHost.compactionClearTimer);
    compHost.compactionClearTimer = null;
  }
  flushToolStreamSync(host);
}

export type CompactionStatus = {
  active: boolean;
  startedAt: number | null;
  completedAt: number | null;
};

type CompactionHost = ToolStreamHost & {
  compactionStatus?: CompactionStatus | null;
  compactionClearTimer?: number | null;
};

const COMPACTION_TOAST_DURATION_MS = 5000;

export function handleCompactionEvent(host: CompactionHost, payload: AgentEventPayload) {
  const data = payload.data ?? {};
  const phase = typeof data.phase === "string" ? data.phase : "";

  // Clear any existing timer
  if (host.compactionClearTimer != null) {
    window.clearTimeout(host.compactionClearTimer);
    host.compactionClearTimer = null;
  }

  if (phase === "start") {
    host.compactionStatus = {
      active: true,
      startedAt: Date.now(),
      completedAt: null,
    };
  } else if (phase === "end") {
    host.compactionStatus = {
      active: false,
      startedAt: host.compactionStatus?.startedAt ?? null,
      completedAt: Date.now(),
    };
    // Auto-clear the toast after duration
    host.compactionClearTimer = window.setTimeout(() => {
      host.compactionStatus = null;
      host.compactionClearTimer = null;
    }, COMPACTION_TOAST_DURATION_MS);
  }
}

export function handleAgentEvent(host: ToolStreamHost, payload?: AgentEventPayload) {
  if (!payload) {
    return;
  }

  // Handle compaction events
  if (payload.stream === "compaction") {
    handleCompactionEvent(host as CompactionHost, payload);
    return;
  }

  if (payload.stream !== "tool") {
    return;
  }
  const sessionKey = typeof payload.sessionKey === "string" ? payload.sessionKey : undefined;
  if (sessionKey && sessionKey !== host.sessionKey) {
    return;
  }
  // Fallback: only accept session-less events for the active run.
  if (!sessionKey && host.chatRunId && payload.runId !== host.chatRunId) {
    return;
  }
  if (host.chatRunId && payload.runId !== host.chatRunId) {
    return;
  }
  if (!host.chatRunId) {
    return;
  }

  const data = payload.data ?? {};
  const toolCallId = typeof data.toolCallId === "string" ? data.toolCallId : "";
  if (!toolCallId) {
    return;
  }
  const name = typeof data.name === "string" ? data.name : "tool";
  const phase = typeof data.phase === "string" ? data.phase : "";
  const args = phase === "start" ? data.args : undefined;
  const output =
    phase === "update"
      ? formatToolOutput(data.partialResult)
      : phase === "result"
        ? formatToolOutput(data.result)
        : undefined;

  const now = Date.now();
  let entry = host.toolStreamById.get(toolCallId);
  if (!entry) {
    entry = {
      toolCallId,
      runId: payload.runId,
      sessionKey,
      name,
      args,
      output,
      startedAt: typeof payload.ts === "number" ? payload.ts : now,
      updatedAt: now,
      message: {},
      displayArgs: args ? formatArgsForDisplay(name, args) : undefined,
    };
    host.toolStreamById.set(toolCallId, entry);
    host.toolStreamOrder.push(toolCallId);
  } else {
    entry.name = name;
    if (args !== undefined) {
      entry.args = args;
      entry.displayArgs = formatArgsForDisplay(name, args);
    }
    if (output !== undefined) {
      entry.output = output;
      entry.resultSummary = formatResultSummary(name, output);
      entry.success = isSuccessResult(output);
    }
    entry.updatedAt = now;
  }

  // Track current tool info for working indicator
  if (phase === "start") {
    host.currentToolName = name;
    host.currentToolInfo = {
      name,
      details: entry.displayArgs || undefined,
      startedAt: entry.startedAt,
    };
  } else if (phase === "result") {
    host.currentToolName = null;
    host.currentToolInfo = null;
    entry.completedAt = now;
    entry.resultSummary = formatResultSummary(name, entry.output);
    entry.success = isSuccessResult(entry.output);
  }

  entry.message = buildToolStreamMessage(entry);
  trimToolStream(host);
  scheduleToolStreamSync(host, phase === "result");
}
