/**
 * fathom-processor.ts — Post-meeting processor for Fathom webhook queue.
 *
 * Watches ~/godmode/data/meeting-queue.json for pending meetings and:
 *   1. Creates NativeTasks from action items
 *   2. Files meeting notes to the Obsidian vault
 *   3. Drafts follow-up emails
 *   4. Appends key decisions to WORKING.md
 *   5. Broadcasts a notification to the ally chat
 *   6. Marks the meeting as processed
 *
 * Lifecycle: initFathomProcessor() -> startFathomProcessor() -> stopFathomProcessor()
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { DATA_DIR, localDateString } from "../data-paths.js";
import {
  getVaultPath,
  isAllowedPath,
  resolveWorkingPath,
  VAULT_FOLDERS,
} from "../lib/vault-paths.js";

// ── Types (mirrored from fathom-webhook.ts to avoid circular deps) ──

type MeetingAttendee = {
  name: string | null;
  email: string | null;
  isExternal: boolean;
};

type MeetingActionItem = {
  description: string;
  assigneeName: string | null;
  assigneeEmail: string | null;
  completed: boolean;
};

type MeetingQueueItem = {
  id: number;
  receivedAt: string;
  status: "pending" | "processing" | "processed" | "failed";
  title: string;
  date: string;
  durationMin: number;
  attendees: MeetingAttendee[];
  summary: string | null;
  transcript: string | null;
  actionItems: MeetingActionItem[];
  fathomUrl: string;
  shareUrl: string;
  processedAt: string | null;
  processedNotes: string | null;
  error: string | null;
};

type MeetingQueue = {
  version: 1;
  webhookConfigured: boolean;
  webhookSecret: string | null;
  meetings: MeetingQueueItem[];
};

// ── Constants ────────────────────────────────────────────────────────

const QUEUE_FILE = join(DATA_DIR, "meeting-queue.json");
const EMAIL_DRAFTS_DIR = join(DATA_DIR, "email-drafts");
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// ── Module state ─────────────────────────────────────────────────────

let logger: { info: (m: string) => void; warn: (m: string) => void; error?: (m: string) => void } = console;
let broadcastFn: ((event: string, data: unknown) => void) | null = null;
let processingInterval: ReturnType<typeof setInterval> | null = null;

// In-process mutex to prevent concurrent queue read/write races
let processingLock: Promise<void> = Promise.resolve();

function withQueueLock<T>(fn: () => Promise<T>): Promise<T> {
  const prev = processingLock;
  let resolve: () => void;
  processingLock = new Promise<void>((r) => { resolve = r; });
  return prev.then(fn).finally(() => resolve!());
}

// ── Public lifecycle ─────────────────────────────────────────────────

export function initFathomProcessor(log: typeof logger): void {
  logger = log;
}

export function setBroadcast(fn: (event: string, data: unknown) => void): void {
  broadcastFn = fn;
}

export function startFathomProcessor(): void {
  // Process any pending meetings immediately
  processAllPending().catch((err) =>
    logger.warn(`[FathomProcessor] Initial processing failed: ${String(err)}`),
  );

  // Then check every 5 minutes for new ones
  processingInterval = setInterval(() => {
    processAllPending().catch((err) =>
      logger.warn(`[FathomProcessor] Tick failed: ${String(err)}`),
    );
  }, POLL_INTERVAL_MS);
}

export function stopFathomProcessor(): void {
  if (processingInterval) {
    clearInterval(processingInterval);
    processingInterval = null;
  }
}

/**
 * Process a single meeting by ID. Called directly from the webhook handler
 * for immediate processing after a new meeting is queued.
 */
export async function processMeetingById(meetingId: number): Promise<void> {
  return withQueueLock(async () => {
    const queue = await readMeetingQueue();
    const meeting = queue.meetings.find((m) => m.id === meetingId);
    if (!meeting) {
      logger.warn(`[FathomProcessor] Meeting ${meetingId} not found in queue`);
      return;
    }
    if (meeting.status !== "pending") {
      logger.warn(`[FathomProcessor] Meeting ${meetingId} is not pending (status: ${meeting.status})`);
      return;
    }
    await processMeeting(meeting);
  });
}

// ── Queue I/O ────────────────────────────────────────────────────────

async function readMeetingQueue(): Promise<MeetingQueue> {
  try {
    const raw = await readFile(QUEUE_FILE, "utf-8");
    return JSON.parse(raw) as MeetingQueue;
  } catch {
    return {
      version: 1,
      webhookConfigured: false,
      webhookSecret: null,
      meetings: [],
    };
  }
}

async function writeMeetingQueue(queue: MeetingQueue): Promise<void> {
  await mkdir(dirname(QUEUE_FILE), { recursive: true });
  await writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2), "utf-8");
}

// ── Core processing ──────────────────────────────────────────────────

async function processAllPending(): Promise<void> {
  return withQueueLock(async () => {
    const queue = await readMeetingQueue();

    // Recover any meetings stuck in "processing" (crash recovery)
    for (const m of queue.meetings) {
      if (m.status === "processing") {
        const stuckSince = m.processedAt ? Date.now() - new Date(m.processedAt).getTime() : Infinity;
        if (stuckSince > 10 * 60 * 1000) { // stuck > 10 min
          logger.warn(`[FathomProcessor] Recovering stuck meeting "${m.title}" (${m.id})`);
          m.status = "pending";
        }
      }
    }

    const pending = queue.meetings.filter((m) => m.status === "pending");
    if (pending.length === 0) return;

    logger.info(`[FathomProcessor] Found ${pending.length} pending meeting(s) to process`);

    for (const meeting of pending) {
      try {
        await processMeeting(meeting);
      } catch (err) {
        logger.warn(
          `[FathomProcessor] Failed to process meeting "${meeting.title}" (${meeting.id}): ${String(err)}`,
        );
        // Re-read queue to avoid clobbering concurrent writes, then mark as failed
        const freshQueue = await readMeetingQueue();
        const target = freshQueue.meetings.find((m) => m.id === meeting.id);
        if (target) {
          target.status = "failed";
          target.error = err instanceof Error ? err.message : String(err);
          await writeMeetingQueue(freshQueue);
        }
      }
    }
  });
}

async function processMeeting(meeting: MeetingQueueItem): Promise<void> {
  logger.info(`[FathomProcessor] Processing: "${meeting.title}" (${meeting.id})`);

  // Mark as processing
  const queue = await readMeetingQueue();
  const queueMeeting = queue.meetings.find((m) => m.id === meeting.id);
  if (queueMeeting) {
    queueMeeting.status = "processing";
    await writeMeetingQueue(queue);
  }

  const processingNotes: string[] = [];
  const meetingDate = meeting.date ? meeting.date.split("T")[0] : localDateString();

  // ── Step 1: Create tasks from action items ─────────────────────
  let tasksCreated = 0;
  try {
    tasksCreated = await createTasksFromActionItems(meeting);
    processingNotes.push(`${tasksCreated} task(s) created`);
  } catch (err) {
    processingNotes.push(`Task creation failed: ${String(err)}`);
    logger.warn(`[FathomProcessor] Task creation failed for ${meeting.id}: ${String(err)}`);
  }

  // ── Step 2: File meeting summary to vault ──────────────────────
  try {
    await fileMeetingToVault(meeting, meetingDate);
    processingNotes.push("Meeting notes filed to vault");
  } catch (err) {
    processingNotes.push(`Vault filing failed: ${String(err)}`);
    logger.warn(`[FathomProcessor] Vault filing failed for ${meeting.id}: ${String(err)}`);
  }

  // ── Step 3: Draft follow-up email ──────────────────────────────
  try {
    await draftFollowUpEmail(meeting);
    processingNotes.push("Follow-up email drafted");
  } catch (err) {
    processingNotes.push(`Email draft failed: ${String(err)}`);
    logger.warn(`[FathomProcessor] Email draft failed for ${meeting.id}: ${String(err)}`);
  }

  // ── Step 4: Update WORKING.md with key decisions ───────────────
  try {
    await appendDecisionsToWorking(meeting, meetingDate);
    processingNotes.push("Decisions appended to WORKING.md");
  } catch (err) {
    processingNotes.push(`WORKING.md update failed: ${String(err)}`);
    logger.warn(`[FathomProcessor] WORKING.md update failed for ${meeting.id}: ${String(err)}`);
  }

  // ── Step 5: Broadcast notification ─────────────────────────────
  try {
    broadcastMeetingNotification(meeting, tasksCreated);
    processingNotes.push("Notification sent");
  } catch (err) {
    processingNotes.push(`Notification failed: ${String(err)}`);
  }

  // ── Step 6: Mark as processed ──────────────────────────────────
  const finalQueue = await readMeetingQueue();
  const finalMeeting = finalQueue.meetings.find((m) => m.id === meeting.id);
  if (finalMeeting) {
    finalMeeting.status = "processed";
    finalMeeting.processedAt = new Date().toISOString();
    finalMeeting.processedNotes = processingNotes.join("; ");
    await writeMeetingQueue(finalQueue);
  }

  logger.info(
    `[FathomProcessor] Completed: "${meeting.title}" — ${processingNotes.join("; ")}`,
  );
}

// ── Step 1: Create tasks from action items ───────────────────────────

async function createTasksFromActionItems(meeting: MeetingQueueItem): Promise<number> {
  if (!meeting.actionItems || meeting.actionItems.length === 0) return 0;

  const { updateTasks } = await import("../methods/tasks.js");
  let created = 0;

  await updateTasks((data) => {
    for (const item of meeting.actionItems) {
      if (!item.description || item.completed) continue;

      // Check for duplicates by title
      const normalizedDesc = item.description.toLowerCase().trim();
      const isDuplicate = data.tasks.some(
        (t) => t.title.toLowerCase().trim() === normalizedDesc,
      );
      if (isDuplicate) continue;

      const dueDate = parseDateFromText(item.description);

      data.tasks.push({
        id: randomUUID(),
        title: item.description,
        status: "pending",
        project: null,
        dueDate,
        priority: "medium",
        createdAt: new Date().toISOString(),
        completedAt: null,
        source: "import",
        sessionId: null,
        briefSection: "Action Items",
      });
      created++;
    }
  });

  return created;
}

/**
 * Attempt to extract a date from action item text.
 * Looks for patterns like "by Friday", "by March 10", "by 2026-03-10", "tomorrow", "next week".
 * Returns YYYY-MM-DD string or null.
 */
function parseDateFromText(text: string): string | null {
  // ISO date: 2026-03-10
  const isoMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (isoMatch) return isoMatch[1];

  const now = new Date();

  // "tomorrow"
  if (/\btomorrow\b/i.test(text)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return localDateString(d);
  }

  // "next week"
  if (/\bnext\s+week\b/i.test(text)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 7);
    return localDateString(d);
  }

  // "by Friday", "by Monday", etc.
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayMatch = text.match(/\bby\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
  if (dayMatch) {
    const targetDay = dayNames.indexOf(dayMatch[1].toLowerCase());
    if (targetDay >= 0) {
      const d = new Date(now);
      const currentDay = d.getDay();
      let daysAhead = targetDay - currentDay;
      if (daysAhead <= 0) daysAhead += 7;
      d.setDate(d.getDate() + daysAhead);
      return localDateString(d);
    }
  }

  // "by March 10", "by Jan 5", etc.
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  const monthAbbrevs = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const monthMatch = text.match(
    /\bby\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})\b/i,
  );
  if (monthMatch) {
    const monthStr = monthMatch[1].toLowerCase();
    let monthIdx = monthNames.indexOf(monthStr);
    if (monthIdx === -1) monthIdx = monthAbbrevs.indexOf(monthStr);
    if (monthIdx >= 0) {
      const day = parseInt(monthMatch[2], 10);
      const year = now.getFullYear();
      const d = new Date(year, monthIdx, day);
      // If the date is in the past, assume next year
      if (d < now) d.setFullYear(year + 1);
      return localDateString(d);
    }
  }

  return null;
}

// ── Step 2: File meeting notes to vault ──────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function fileMeetingToVault(meeting: MeetingQueueItem, meetingDate: string): Promise<void> {
  const vaultPath = getVaultPath();
  if (!vaultPath) {
    logger.warn("[FathomProcessor] No vault configured — skipping vault filing");
    return;
  }

  // ── Append to daily note ──────────────────────────────────────
  const dailyDir = join(vaultPath, VAULT_FOLDERS.daily);
  const dailyFilePath = join(dailyDir, `${meetingDate}.md`);

  if (!isAllowedPath(dailyFilePath)) {
    logger.warn(`[FathomProcessor] Daily note path not allowed: ${dailyFilePath}`);
    return;
  }

  // Ensure directory exists
  if (!existsSync(dailyDir)) {
    mkdirSync(dailyDir, { recursive: true });
  }

  let dailyContent = "";
  try {
    dailyContent = await readFile(dailyFilePath, "utf-8");
  } catch {
    // File doesn't exist — create fresh
    dailyContent = `# Daily Brief - ${meetingDate}\n`;
  }

  // Append meeting section if not already present
  const meetingAnchor = `<!-- fathom-meeting-${meeting.id} -->`;
  if (!dailyContent.includes(meetingAnchor)) {
    const attendeeList = meeting.attendees
      .map((a) => a.name || a.email || "Unknown")
      .join(", ");

    const meetingSection = [
      "",
      "## Meetings",
      "",
      meetingAnchor,
      `### ${meeting.title}`,
      "",
      `- **Duration:** ${meeting.durationMin} min`,
      `- **Attendees:** ${attendeeList || "N/A"}`,
      meeting.fathomUrl ? `- **Recording:** [Fathom](${meeting.fathomUrl})` : "",
      "",
      meeting.summary ? meeting.summary : "_No summary available._",
      "",
      meeting.actionItems.length > 0
        ? "**Action Items:**\n" +
          meeting.actionItems
            .map((ai) => {
              const assignee = ai.assigneeName ? ` (@${ai.assigneeName})` : "";
              return `- [ ] ${ai.description}${assignee}`;
            })
            .join("\n")
        : "",
      "",
    ]
      .filter((line) => line !== undefined)
      .join("\n");

    // If there's already a ## Meetings section, append inside it.
    // Otherwise, append at the end.
    if (dailyContent.includes("## Meetings")) {
      // Find the end of the Meetings section (next ## or end of file)
      const meetingsIdx = dailyContent.indexOf("## Meetings");
      const nextSectionMatch = dailyContent.slice(meetingsIdx + 11).match(/\n## /);
      const insertPoint = nextSectionMatch
        ? meetingsIdx + 11 + (nextSectionMatch.index ?? dailyContent.length)
        : dailyContent.length;
      dailyContent =
        dailyContent.slice(0, insertPoint) +
        "\n" + meetingAnchor + "\n" +
        `### ${meeting.title}\n\n` +
        `- **Duration:** ${meeting.durationMin} min\n` +
        `- **Attendees:** ${attendeeList || "N/A"}\n` +
        (meeting.fathomUrl ? `- **Recording:** [Fathom](${meeting.fathomUrl})\n` : "") +
        "\n" +
        (meeting.summary ? meeting.summary + "\n" : "_No summary available._\n") +
        "\n" +
        (meeting.actionItems.length > 0
          ? "**Action Items:**\n" +
            meeting.actionItems
              .map((ai) => {
                const assignee = ai.assigneeName ? ` (@${ai.assigneeName})` : "";
                return `- [ ] ${ai.description}${assignee}`;
              })
              .join("\n") +
            "\n"
          : "") +
        "\n" +
        dailyContent.slice(insertPoint);
    } else {
      dailyContent += meetingSection;
    }

    await writeFile(dailyFilePath, dailyContent, "utf-8");
    logger.info(`[FathomProcessor] Appended meeting to daily note: ${dailyFilePath}`);
  }

  // ── Create standalone meeting note ────────────────────────────
  const meetingsDir = join(vaultPath, VAULT_FOLDERS.resources, "Meetings");
  const meetingSlug = slugify(meeting.title);
  const meetingFilePath = join(meetingsDir, `${meetingDate}-${meetingSlug}.md`);

  if (!isAllowedPath(meetingFilePath)) {
    logger.warn(`[FathomProcessor] Meeting note path not allowed: ${meetingFilePath}`);
    return;
  }

  if (!existsSync(meetingsDir)) {
    mkdirSync(meetingsDir, { recursive: true });
  }

  const attendeeNames = meeting.attendees
    .map((a) => a.name || a.email || "Unknown")
    .filter(Boolean);

  const keyDecisions = extractKeyDecisions(meeting.summary);

  const meetingNote = [
    "---",
    `title: "${escapeYaml(meeting.title)}"`,
    `date: ${meetingDate}`,
    `attendees: [${attendeeNames.map((n) => `"${escapeYaml(n)}"`).join(", ")}]`,
    `duration: ${meeting.durationMin}`,
    `fathom_url: "${meeting.fathomUrl}"`,
    `share_url: "${meeting.shareUrl}"`,
    `meeting_id: ${meeting.id}`,
    "---",
    "",
    `# ${meeting.title}`,
    "",
    `**Date:** ${meetingDate}  `,
    `**Duration:** ${meeting.durationMin} minutes  `,
    `**Attendees:** ${attendeeNames.join(", ") || "N/A"}`,
    "",
    "## Summary",
    "",
    meeting.summary || "_No summary available._",
    "",
    "## Key Decisions",
    "",
    keyDecisions.length > 0
      ? keyDecisions.map((d) => `- ${d}`).join("\n")
      : "_No key decisions extracted._",
    "",
    "## Action Items",
    "",
    meeting.actionItems.length > 0
      ? meeting.actionItems
          .map((ai) => {
            const assignee = ai.assigneeName ? ` (@${ai.assigneeName})` : "";
            const status = ai.completed ? "[x]" : "[ ]";
            return `- ${status} ${ai.description}${assignee}`;
          })
          .join("\n")
      : "_No action items._",
    "",
    "## Transcript",
    "",
    "<details>",
    "<summary>Full transcript (click to expand)</summary>",
    "",
    meeting.transcript || "_No transcript available._",
    "",
    "</details>",
    "",
  ].join("\n");

  await writeFile(meetingFilePath, meetingNote, "utf-8");
  logger.info(`[FathomProcessor] Created meeting note: ${meetingFilePath}`);
}

function escapeYaml(text: string): string {
  return text.replace(/"/g, '\\"').replace(/\n/g, " ");
}

/**
 * Extract key decisions from the meeting summary.
 * Looks for lines that indicate decisions: "decided", "agreed", "confirmed",
 * "will", "action:", bullet points under decision-like headings.
 */
function extractKeyDecisions(summary: string | null): string[] {
  if (!summary) return [];

  const decisions: string[] = [];
  const lines = summary.split("\n");

  const decisionPatterns = [
    /\b(?:decided|agreed|confirmed|approved|committed)\b/i,
    /\b(?:decision|resolution|outcome)\s*:/i,
    /\bwill\s+(?:be|do|start|move|proceed|implement|create|build|launch|ship|send|review|prepare|schedule|update|follow)\b/i,
  ];

  let inDecisionSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if we entered a "Decisions" or "Key Decisions" section heading
    if (/^#+\s*(?:key\s+)?decisions?\b/i.test(trimmed)) {
      inDecisionSection = true;
      continue;
    }
    // Exit decision section on next heading
    if (inDecisionSection && /^#+\s/.test(trimmed)) {
      inDecisionSection = false;
      continue;
    }

    // Collect lines from a decision section
    if (inDecisionSection && trimmed.startsWith("-")) {
      decisions.push(trimmed.replace(/^-\s*/, ""));
      continue;
    }

    // Check for decision-indicating patterns in any line
    for (const pattern of decisionPatterns) {
      if (pattern.test(trimmed) && trimmed.length > 10 && trimmed.length < 300) {
        // Clean up bullet markers
        const cleaned = trimmed.replace(/^[-*]\s*/, "").replace(/^\[.\]\s*/, "");
        if (cleaned && !decisions.includes(cleaned)) {
          decisions.push(cleaned);
        }
        break;
      }
    }
  }

  return decisions.slice(0, 10); // Cap at 10 decisions
}

// ── Step 3: Draft follow-up email ────────────────────────────────────

async function draftFollowUpEmail(meeting: MeetingQueueItem): Promise<void> {
  const externalAttendees = meeting.attendees.filter((a) => a.isExternal);
  if (externalAttendees.length === 0) {
    logger.info(`[FathomProcessor] No external attendees — skipping email draft for ${meeting.id}`);
    return;
  }

  if (!existsSync(EMAIL_DRAFTS_DIR)) {
    mkdirSync(EMAIL_DRAFTS_DIR, { recursive: true });
  }

  const toList = externalAttendees
    .map((a) => {
      if (a.email && a.name) return `${a.name} <${a.email}>`;
      return a.email || a.name || "Unknown";
    })
    .join(", ");

  const meetingDate = meeting.date ? meeting.date.split("T")[0] : localDateString();

  // Build action items with owners
  const actionItemLines = meeting.actionItems
    .filter((ai) => !ai.completed)
    .map((ai) => {
      const owner = ai.assigneeName || "TBD";
      return `- ${ai.description} (Owner: ${owner})`;
    });

  // Build a concise summary (first 3 sentences or 300 chars of summary)
  let briefSummary = "Thank you for the productive meeting.";
  if (meeting.summary) {
    const sentences = meeting.summary
      .replace(/\n/g, " ")
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);
    briefSummary = sentences.slice(0, 3).join(" ");
    if (briefSummary.length > 300) {
      briefSummary = briefSummary.slice(0, 297) + "...";
    }
  }

  const emailContent = [
    `---`,
    `to: ${toList}`,
    `subject: "Follow-up: ${escapeYaml(meeting.title)}"`,
    `date: ${meetingDate}`,
    `meeting_id: ${meeting.id}`,
    `status: draft`,
    `---`,
    ``,
    `Hi all,`,
    ``,
    `Thank you for joining the meeting on ${meetingDate} regarding "${meeting.title}."`,
    ``,
    briefSummary,
    ``,
    actionItemLines.length > 0
      ? `## Action Items\n\n${actionItemLines.join("\n")}`
      : "",
    ``,
    `## Next Steps`,
    ``,
    `Please review the action items above and let me know if anything needs to be adjusted.`,
    meeting.shareUrl
      ? `\nYou can review the full meeting recording here: ${meeting.shareUrl}`
      : "",
    ``,
    `Best regards`,
    ``,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  const draftPath = join(EMAIL_DRAFTS_DIR, `${meeting.id}.md`);
  await writeFile(draftPath, emailContent, "utf-8");
  logger.info(`[FathomProcessor] Email draft saved: ${draftPath}`);
}

// ── Step 4: Update WORKING.md ────────────────────────────────────────

async function appendDecisionsToWorking(
  meeting: MeetingQueueItem,
  meetingDate: string,
): Promise<void> {
  const keyDecisions = extractKeyDecisions(meeting.summary);
  if (keyDecisions.length === 0) return;

  const { path: workingPath } = resolveWorkingPath();
  if (!isAllowedPath(workingPath)) {
    logger.warn(`[FathomProcessor] WORKING.md path not allowed: ${workingPath}`);
    return;
  }

  // Ensure parent directory exists
  const parentDir = dirname(workingPath);
  if (!existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }

  let content = "";
  try {
    content = await readFile(workingPath, "utf-8");
  } catch {
    content = "# Working Memory\n";
  }

  const decisionsBlock = [
    "",
    `### ${meeting.title} (${meetingDate})`,
    ...keyDecisions.map((d) => `- ${d}`),
    "",
  ].join("\n");

  // Find or create "## Recent Decisions" section
  const sectionHeader = "## Recent Decisions";
  if (content.includes(sectionHeader)) {
    // Append after the header line
    const headerIdx = content.indexOf(sectionHeader);
    const afterHeader = headerIdx + sectionHeader.length;
    content =
      content.slice(0, afterHeader) +
      "\n" +
      decisionsBlock +
      content.slice(afterHeader);
  } else {
    // Append section at the end
    const separator = content.endsWith("\n") ? "\n" : "\n\n";
    content += `${separator}${sectionHeader}\n${decisionsBlock}`;
  }

  await writeFile(workingPath, content, "utf-8");
  logger.info(`[FathomProcessor] Appended ${keyDecisions.length} decision(s) to WORKING.md`);
}

// ── Step 5: Broadcast notification ───────────────────────────────────

function broadcastMeetingNotification(meeting: MeetingQueueItem, tasksCreated: number): void {
  if (!broadcastFn) return;

  const message = [
    `Meeting processed: ${meeting.title}`,
    `- ${tasksCreated} action item(s) created as tasks`,
    `- Meeting notes filed to vault`,
    `- Follow-up email drafted -> ~/godmode/data/email-drafts/${meeting.id}.md`,
  ].join("\n");

  broadcastFn("fathom:meeting-processed", {
    meetingId: meeting.id,
    title: meeting.title,
    tasksCreated,
    message,
  });
}
