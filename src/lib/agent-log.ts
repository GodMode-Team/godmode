import fsp from "node:fs/promises";
import path from "node:path";
import { GODMODE_ROOT } from "../data-paths.js";
import { getUserTimezone } from "./user-config.js";

const AGENT_LOG_DIR = path.join(GODMODE_ROOT, "memory", "agent-log");

export type ReviewItem = {
  item: string;
  link?: string;
  priority: string;
  notes?: string;
  addedAt: number;
};

export type CompletedItem = {
  item: string;
  output?: string;
  duration?: string;
  completedAt: number;
  userPrompt?: string;
  toolSummary?: string;
  filesRead?: string[];
  filesWritten?: string[];
  messagesSent?: number;
  cronAdds?: number;
  model?: string;
  provider?: string;
  assistantPreview?: string;
  channel?: string;
  channelType?: string;
};

export type ErrorEntry = {
  time: number;
  channel: string;
  channelType: string;
  error: string;
  duration?: string;
  model?: string;
};

export type QueueItem = {
  task: string;
  assignedTo?: string;
  blockedBy?: string;
  addedAt: number;
};

export type ActivityEntry = {
  time: number;
  text: string;
};

export type AgentLogState = {
  date: string;
  needsReview: ReviewItem[];
  completed: CompletedItem[];
  errors: ErrorEntry[];
  queue: QueueItem[];
  activity: ActivityEntry[];
  notes: string[];
};

export type ActiveRun = {
  runId: string;
  sessionKey: string;
  startedAt: number;
  durationMs: number;
};

export type AppendCategory = "review" | "completed" | "queue" | "note" | "activity";

export type AppendEntryParams = {
  category: AppendCategory;
  item: string;
  link?: string;
  output?: string;
  priority?: string;
  notes?: string;
  assignedTo?: string;
  blockedBy?: string;
};

function todayDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: getUserTimezone() });
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: getUserTimezone(),
  });
}

/** Derive a short timezone abbreviation (e.g. "CST", "CDT", "UTC") from the user's IANA timezone. */
function getTimezoneAbbreviation(): string {
  try {
    const tz = getUserTimezone();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value ?? tz;
  } catch {
    return "UTC";
  }
}

function jsonFilePath(date: string): string {
  return path.join(AGENT_LOG_DIR, `${date}.json`);
}

function mdFilePath(date: string): string {
  return path.join(AGENT_LOG_DIR, `${date}.md`);
}

function emptyState(date: string): AgentLogState {
  return {
    date,
    needsReview: [],
    completed: [],
    errors: [],
    queue: [],
    activity: [],
    notes: [],
  };
}

async function ensureDir(): Promise<void> {
  await fsp.mkdir(AGENT_LOG_DIR, { recursive: true });
}

function escapeCell(s: string): string {
  return String(s ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .trim();
}

function renderMarkdown(state: AgentLogState, activeRuns: ActiveRun[]): string {
  const day = new Date(`${state.date}T12:00:00`);
  const dayLabel = day.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const lines: string[] = [];

  lines.push(`# Agent Log — ${dayLabel}`);
  lines.push("");
  lines.push(`*Last updated: ${formatTime(Date.now())} ${getTimezoneAbbreviation()} — Auto-managed by GodMode.*`);
  lines.push("");

  lines.push("### Today at a Glance");
  lines.push(
    `- Active: **${activeRuns.length}** · Completed: **${state.completed.length}** · Needs review: **${state.needsReview.length}** · Queued: **${state.queue.length}** · Errors: **${state.errors.length}**`,
  );
  lines.push("");

  if (state.needsReview.length > 0) {
    lines.push("## Needs Review");
    lines.push("");
    lines.push("| Item | Link | Priority | Notes |");
    lines.push("|---|---|---|---|");
    for (const entry of state.needsReview) {
      lines.push(
        `| ${escapeCell(entry.item)} | ${escapeCell(entry.link ?? "—")} | ${escapeCell(entry.priority || "MEDIUM")} | ${escapeCell(entry.notes ?? "")} |`,
      );
    }
    lines.push("");
  }

  if (activeRuns.length > 0) {
    lines.push("## Active Now");
    lines.push("");
    lines.push("| Session | Started | Elapsed |");
    lines.push("|---|---|---|");
    for (const run of activeRuns) {
      const elapsedSec = Math.max(0, Math.round(run.durationMs / 1000));
      lines.push(
        `| ${escapeCell(run.sessionKey)} | ${escapeCell(formatTime(run.startedAt))} | ${elapsedSec}s |`,
      );
    }
    lines.push("");
  }

  if (state.completed.length > 0) {
    lines.push("## Completed Today");
    lines.push("");
    lines.push("| Item | Deliverable | Duration |");
    lines.push("|---|---|---|");
    const sorted = [...state.completed].sort((a, b) => b.completedAt - a.completedAt);
    for (const entry of sorted) {
      lines.push(
        `| ${escapeCell(entry.item)} | ${escapeCell(entry.output ?? "—")} | ${escapeCell(entry.duration ?? "—")} |`,
      );
    }
    lines.push("");
  }

  if (state.queue.length > 0) {
    lines.push("## Queue");
    lines.push("");
    lines.push("| Task | Assigned To | Blocked By |");
    lines.push("|---|---|---|");
    for (const entry of state.queue) {
      lines.push(
        `| ${escapeCell(entry.task)} | ${escapeCell(entry.assignedTo ?? "—")} | ${escapeCell(entry.blockedBy ?? "—")} |`,
      );
    }
    lines.push("");
  }

  if (state.errors.length > 0) {
    lines.push(`## Errors (${state.errors.length})`);
    lines.push("");
    const sorted = [...state.errors].sort((a, b) => b.time - a.time);
    for (const entry of sorted) {
      const detail = [entry.channel, entry.duration, entry.model].filter(Boolean).join(" · ");
      const prefix = detail ? `${detail} — ` : "";
      lines.push(`- **${formatTime(entry.time)}** ${prefix}${entry.error}`);
    }
    lines.push("");
  }

  if (state.notes.length > 0) {
    lines.push("## Notes");
    lines.push("");
    for (const note of state.notes) {
      lines.push(`- ${note}`);
    }
    lines.push("");
  }

  if (state.activity.length > 0) {
    lines.push("<details>");
    lines.push("<summary><strong>Activity Log</strong></summary>");
    lines.push("");
    const sorted = [...state.activity].sort((a, b) => b.time - a.time);
    for (const entry of sorted) {
      lines.push(`- **${formatTime(entry.time)}** ${entry.text}`);
    }
    lines.push("");
    lines.push("</details>");
    lines.push("");
  }

  return lines.join("\n");
}

async function loadStateFromDisk(date: string): Promise<AgentLogState> {
  try {
    const raw = await fsp.readFile(jsonFilePath(date), "utf-8");
    const parsed = JSON.parse(raw) as Partial<AgentLogState>;
    return {
      date,
      needsReview: Array.isArray(parsed.needsReview) ? parsed.needsReview : [],
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      errors: Array.isArray(parsed.errors) ? parsed.errors : [],
      queue: Array.isArray(parsed.queue) ? parsed.queue : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    };
  } catch {
    return emptyState(date);
  }
}

async function saveStateToDisk(state: AgentLogState): Promise<void> {
  await ensureDir();
  await fsp.writeFile(jsonFilePath(state.date), JSON.stringify(state, null, 2), "utf-8");
  await fsp.writeFile(mdFilePath(state.date), renderMarkdown(state, []), "utf-8");
}

export function getActiveRuns(): ActiveRun[] {
  return [];
}

export async function appendEntry(params: AppendEntryParams): Promise<void> {
  const date = todayDate();
  const state = await loadStateFromDisk(date);
  const now = Date.now();

  if (params.category === "review") {
    state.needsReview.push({
      item: params.item,
      link: params.link,
      priority: params.priority || "MEDIUM",
      notes: params.notes,
      addedAt: now,
    });
  } else if (params.category === "completed") {
    state.completed.push({
      item: params.item,
      output: params.output || params.link,
      completedAt: now,
    });
  } else if (params.category === "queue") {
    state.queue.push({
      task: params.item,
      assignedTo: params.assignedTo,
      blockedBy: params.blockedBy,
      addedAt: now,
    });
  } else if (params.category === "note") {
    state.notes.push(params.item);
  } else {
    state.activity.push({ time: now, text: params.item });
  }

  await saveStateToDisk(state);
}

export async function resolveReviewItem(itemName: string): Promise<boolean> {
  const date = todayDate();
  const state = await loadStateFromDisk(date);
  const needle = itemName.toLowerCase();
  const idx = state.needsReview.findIndex((entry) => entry.item.toLowerCase().includes(needle));
  if (idx < 0) {
    return false;
  }
  state.needsReview.splice(idx, 1);
  await saveStateToDisk(state);
  return true;
}

export async function resolveQueueItem(taskName: string): Promise<boolean> {
  const date = todayDate();
  const state = await loadStateFromDisk(date);
  const needle = taskName.toLowerCase();
  const idx = state.queue.findIndex((entry) => entry.task.toLowerCase().includes(needle));
  if (idx < 0) {
    return false;
  }
  state.queue.splice(idx, 1);
  await saveStateToDisk(state);
  return true;
}

export async function readDailyLog(
  date: string,
): Promise<{ content: string; updatedAt: string; sourcePath: string } | null> {
  const normalizedDate = date.trim() || todayDate();

  if (normalizedDate === todayDate()) {
    const state = await loadStateFromDisk(normalizedDate);
    const content = renderMarkdown(state, getActiveRuns());
    if (!content.trim()) {
      return null;
    }
    await ensureDir();
    await fsp.writeFile(mdFilePath(normalizedDate), content, "utf-8");
    return {
      content,
      updatedAt: new Date().toISOString(),
      sourcePath: `~/godmode/memory/agent-log/${normalizedDate}.md`,
    };
  }

  try {
    const pathname = mdFilePath(normalizedDate);
    const stat = await fsp.stat(pathname);
    const content = await fsp.readFile(pathname, "utf-8");
    if (!content.trim()) {
      return null;
    }
    return {
      content,
      updatedAt: new Date(stat.mtimeMs).toISOString(),
      sourcePath: `~/godmode/memory/agent-log/${normalizedDate}.md`,
    };
  } catch {
    try {
      const state = await loadStateFromDisk(normalizedDate);
      const content = renderMarkdown(state, []);
      if (!content.trim()) {
        return null;
      }
      return {
        content,
        updatedAt: new Date().toISOString(),
        sourcePath: `~/godmode/memory/agent-log/${normalizedDate}.md`,
      };
    } catch {
      return null;
    }
  }
}
