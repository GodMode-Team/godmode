/**
 * helpers.ts — Shared utilities for all ingestion pipelines.
 *
 * Provides safe file naming, directory creation, daily note appending,
 * and people file management used across calendar, email, fathom, etc.
 */

import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { MEMORY_DIR, localDateString } from "../../data-paths.js";

/**
 * Convert an arbitrary name to a filesystem-safe slug.
 * Lowercase, alphanumeric + hyphens only, max 60 chars.
 */
export function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Ensure a directory exists (recursive mkdir). */
export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

/** Return today's date as YYYY-MM-DD in local timezone. */
export function todayString(): string {
  return localDateString();
}

/**
 * Append content under a section heading in today's daily note.
 * Creates the file if it doesn't exist. Returns the file path.
 */
export async function appendToDaily(
  section: string,
  content: string,
): Promise<string> {
  const dailyDir = join(MEMORY_DIR, "daily");
  await ensureDir(dailyDir);

  const filePath = join(dailyDir, `${todayString()}.md`);

  if (!existsSync(filePath)) {
    await writeFile(filePath, `# ${todayString()}\n\n`, "utf-8");
  }

  const existing = await readFile(filePath, "utf-8");
  const sectionHeader = `## ${section}`;

  if (!existing.includes(sectionHeader)) {
    await appendFile(filePath, `\n${sectionHeader}\n\n`, "utf-8");
  }

  await appendFile(filePath, `${content}\n`, "utf-8");
  return filePath;
}

/**
 * Create or update a person's markdown file in memory/people/.
 * If the file exists, appends the interaction. Otherwise creates a stub.
 */
export async function updatePersonFile(
  name: string,
  email: string | null,
  interaction: string,
): Promise<void> {
  const peopleDir = join(MEMORY_DIR, "people");
  await ensureDir(peopleDir);

  const slug = safeName(name);
  if (!slug) return;

  const filePath = join(peopleDir, `${slug}.md`);
  const today = todayString();

  if (existsSync(filePath)) {
    // Append interaction to existing file
    await appendFile(filePath, `- [${today}] ${interaction}\n`, "utf-8");
  } else {
    // Create new person stub
    const emailLine = email ? `- **Email:** ${email}\n` : "";
    const stub = [
      `# ${name}`,
      "",
      emailLine + `- **First seen:** ${today}`,
      "",
      "## Interactions",
      `- [${today}] ${interaction}`,
      "",
    ].join("\n");
    await writeFile(filePath, stub, "utf-8");
  }
}
