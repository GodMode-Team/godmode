/**
 * trust-refinement.ts — Writes user feedback directly into persona/skill markdown files.
 *
 * When a user rates a workflow < 7 and provides improvement feedback,
 * this module appends it to the matching persona or skill file's
 * `## User Feedback` section. Since persona.body and skill.body are
 * injected verbatim into agent prompts, the feedback automatically
 * reaches future runs with zero additional injection code.
 *
 * When the feedback section exceeds MAX_RAW_ITEMS, Haiku consolidates
 * it into concise directives to prevent bloat.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { existsSync, readdirSync } from "node:fs";
import { MEMORY_DIR } from "../data-paths.js";
import { getVaultPath, VAULT_FOLDERS } from "./vault-paths.js";
import { MODEL_HAIKU, MAX_RAW_FEEDBACK_ITEMS } from "./constants.js";

const MAX_RAW_ITEMS = MAX_RAW_FEEDBACK_ITEMS;
const FEEDBACK_HEADING = "## User Feedback";

// ── File Resolution ──────────────────────────────────────────────

/** Find the markdown file path for a workflow name (persona or skill). */
export function resolveWorkflowFile(workflow: string): string | null {
  const normalized = workflow.toLowerCase().replace(/[_-]/g, " ");

  // Search agent-roster dirs
  for (const dir of rosterDirs()) {
    const match = findInDir(dir, normalized);
    if (match) return match;
  }

  // Search skill dirs
  for (const dir of skillDirs()) {
    const match = findInDir(dir, normalized);
    if (match) return match;
  }

  return null;
}

function rosterDirs(): string[] {
  const dirs: string[] = [];
  const vault = getVaultPath();
  if (vault) {
    const vaultRoster = join(vault, VAULT_FOLDERS.system, "agent-roster");
    if (existsSync(vaultRoster)) dirs.push(vaultRoster);
  }
  const localRoster = join(MEMORY_DIR, "agent-roster");
  if (existsSync(localRoster)) dirs.push(localRoster);
  return dirs;
}

function skillDirs(): string[] {
  const dirs: string[] = [];
  const vault = getVaultPath();
  if (vault) {
    const vaultSkills = join(vault, VAULT_FOLDERS.system, "skills");
    if (existsSync(vaultSkills)) dirs.push(vaultSkills);
  }
  const homeSkills = join(MEMORY_DIR, "..", "skills");
  if (existsSync(homeSkills)) dirs.push(homeSkills);
  return dirs;
}

function findInDir(dir: string, normalized: string): string | null {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        const slug = basename(entry.name, ".md").toLowerCase().replace(/[_-]/g, " ");
        if (slug === normalized) {
          return join(dir, entry.name);
        }
      } else if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const match = findInDir(join(dir, entry.name), normalized);
        if (match) return match;
      }
    }
  } catch {
    // Skip unreadable dirs
  }
  return null;
}

// ── Feedback Application ─────────────────────────────────────────

/**
 * Append feedback to the matching persona or skill markdown file.
 * Consolidates via Haiku when the section exceeds MAX_RAW_ITEMS.
 */
export async function applyFeedbackToFile(
  workflow: string,
  feedback: string,
): Promise<{ applied: boolean; filePath?: string; consolidated?: boolean }> {
  const filePath = resolveWorkflowFile(workflow);
  if (!filePath) return { applied: false };

  try {
    const content = await readFile(filePath, "utf-8");
    const updated = appendFeedback(content, feedback);
    let finalContent = updated.content;
    let consolidated = false;

    if (updated.itemCount > MAX_RAW_ITEMS) {
      const condensed = await consolidateFeedback(updated.feedbackItems);
      if (condensed) {
        finalContent = replaceFeedbackSection(content, condensed);
        consolidated = true;
      }
    }

    await writeFile(filePath, finalContent, "utf-8");
    return { applied: true, filePath, consolidated };
  } catch (err) {
    console.error(`[TrustRefinement] Failed to write feedback to ${filePath}:`, err);
    return { applied: false };
  }
}

// ── Content Manipulation ─────────────────────────────────────────

function appendFeedback(content: string, feedback: string): {
  content: string;
  itemCount: number;
  feedbackItems: string[];
} {
  const feedbackLine = `- ${feedback.trim()}`;
  const headingIdx = content.indexOf(FEEDBACK_HEADING);

  if (headingIdx === -1) {
    // No existing section — append at end
    const newContent = content.trimEnd() + `\n\n${FEEDBACK_HEADING}\n${feedbackLine}\n`;
    return { content: newContent, itemCount: 1, feedbackItems: [feedback.trim()] };
  }

  // Find existing items (stop at the next heading to avoid cross-section leakage)
  const afterHeading = content.slice(headingIdx + FEEDBACK_HEADING.length);
  const sectionLines: string[] = [];
  for (const line of afterHeading.split("\n")) {
    if (sectionLines.length > 0 && (line.startsWith("## ") || line.startsWith("# "))) break;
    sectionLines.push(line);
  }
  const existingItems = sectionLines
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());

  // Insert the new line after the last existing item
  const lines = content.split("\n");
  let insertIdx = lines.length;
  let inSection = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(FEEDBACK_HEADING)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      // End of section: hit another heading or end of file
      if (lines[i].startsWith("## ") || lines[i].startsWith("# ")) {
        insertIdx = i;
        break;
      }
      if (lines[i].startsWith("- ")) {
        insertIdx = i + 1;
      }
    }
  }

  lines.splice(insertIdx, 0, feedbackLine);
  const allItems = [...existingItems, feedback.trim()];
  return { content: lines.join("\n"), itemCount: allItems.length, feedbackItems: allItems };
}

function replaceFeedbackSection(content: string, consolidated: string[]): string {
  const headingIdx = content.indexOf(FEEDBACK_HEADING);
  if (headingIdx === -1) return content;

  // Find section boundaries
  const before = content.slice(0, headingIdx);
  const afterHeading = content.slice(headingIdx + FEEDBACK_HEADING.length);
  const lines = afterHeading.split("\n");

  // Find where the next section starts (or end of file)
  let afterSection = "";
  for (let i = 0; i < lines.length; i++) {
    if (i > 0 && (lines[i].startsWith("## ") || lines[i].startsWith("# "))) {
      afterSection = lines.slice(i).join("\n");
      break;
    }
  }

  const newSection = `${FEEDBACK_HEADING}\n${consolidated.map((f) => `- ${f}`).join("\n")}\n`;
  return before + newSection + (afterSection ? "\n" + afterSection : "");
}

// ── LLM Consolidation ────────────────────────────────────────────

async function consolidateFeedback(items: string[]): Promise<string[] | null> {
  try {
    const { spawn } = await import("node:child_process");

    const prompt = [
      "Consolidate these user feedback items for an AI agent into 3-4 concise, actionable directives.",
      "Merge duplicates, keep the most specific guidance, drop anything vague.",
      "Return ONLY the consolidated bullet points, one per line, starting with '- '.",
      "",
      "Feedback items:",
      ...items.map((f) => `- ${f}`),
    ].join("\n");

    const result = await new Promise<string>((resolve, reject) => {
      const proc = spawn("claude", ["-p", "--model", MODEL_HAIKU], {
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 30_000,
      });

      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
      proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });
      proc.on("close", (code: number | null) => {
        if (code === 0 && stdout.trim()) resolve(stdout.trim());
        else reject(new Error(stderr || `exit ${code}`));
      });
      proc.on("error", reject);
      proc.stdin.write(prompt);
      proc.stdin.end();
    });

    // Parse bullet points from response
    const consolidated = result
      .split("\n")
      .filter((l) => l.trim().startsWith("- "))
      .map((l) => l.trim().slice(2).trim())
      .filter(Boolean);

    return consolidated.length > 0 ? consolidated : null;
  } catch (err) {
    console.error("[TrustRefinement] Consolidation failed, keeping raw items:", err);
    return null;
  }
}
