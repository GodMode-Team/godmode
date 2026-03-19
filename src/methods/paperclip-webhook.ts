/**
 * paperclip-webhook.ts — Webhook receiver for Paperclip task completions.
 *
 * When Paperclip completes a task (status "done" or "in_review"), this handler:
 *   1. Reads the issue title and output from the payload
 *   2. Writes the deliverable to ~/godmode/memory/inbox/{task-slug}.md
 *   3. Broadcasts an inbox:new event to the UI
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { MEMORY_DIR } from "../data-paths.js";
import { addInboxItem } from "../services/inbox.js";

// ── Helpers ──────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

// ── Broadcast hook (set by gateway-start) ────────────────────────

let broadcastFn: ((event: string, data: unknown) => void) | null = null;

export function setPaperclipWebhookBroadcast(
  fn: (event: string, data: unknown) => void,
): void {
  broadcastFn = fn;
}

// ── HTTP webhook handler ─────────────────────────────────────────

/**
 * Handle an incoming Paperclip webhook POST.
 * Called from the HTTP handler after the body has been parsed.
 */
export async function handlePaperclipWebhookHttp(
  body: string,
): Promise<void> {
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    console.error("[GodMode] Paperclip webhook: invalid JSON body");
    return;
  }

  // Extract status — accept both top-level and nested under .issue
  const issue = (payload.issue ?? payload) as Record<string, unknown>;
  const status = String(issue.status ?? "");

  if (status !== "done" && status !== "in_review") {
    // Not a completion event — ignore silently
    return;
  }

  const issueId = String(issue.id ?? "unknown");
  const title = String(issue.title ?? "Untitled Task");
  const description = String(issue.description ?? "");
  const output = String(issue.output ?? issue.result ?? description);
  const slug = slugify(title) || `paperclip-${issueId}`;

  // Write deliverable to inbox directory
  const inboxDir = join(MEMORY_DIR, "inbox");
  await mkdir(inboxDir, { recursive: true });

  const content = [
    `# ${title}`,
    "",
    `> Paperclip Issue: ${issueId}`,
    `> Status: ${status}`,
    `> Completed: ${new Date().toISOString()}`,
    "",
    "---",
    "",
    output,
  ].join("\n");

  const filePath = join(inboxDir, `${slug}.md`);
  await writeFile(filePath, content, "utf-8");

  // Add to inbox.json so the UI surfaces it
  try {
    await addInboxItem({
      type: "agent-execution",
      title,
      summary: output.slice(0, 500),
      source: { persona: "paperclip", taskId: issueId },
      outputPath: filePath,
    });
  } catch (err) {
    console.error("[GodMode] Paperclip webhook: failed to add inbox item", err);
  }

  // Auto-register as a resource so it appears in the sidebar resource bar
  try {
    const { resourcesHandlers } = await import("./resources.js");
    const registerHandler = resourcesHandlers["resources.register"];
    if (registerHandler) {
      await registerHandler({
        params: {
          title,
          type: "doc",
          path: filePath,
          sessionKey: "paperclip",
          summary: output.slice(0, 200),
          tags: ["paperclip", "agent-output"],
        },
        respond: () => {},
      } as any);
    }
  } catch { /* non-fatal */ }

  console.log(`[GodMode] Paperclip webhook: task "${title}" (${issueId}) → inbox + resources`);

  // Broadcast to UI
  if (broadcastFn) {
    try {
      broadcastFn("inbox:new", { title, issueId, slug, filePath });
    } catch { /* non-fatal */ }
  }
}
