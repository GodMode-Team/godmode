/**
 * drive-sync.ts — Every 6h cron: sync recent Google Drive documents via `gog` CLI.
 *
 * Lists recent Drive files, downloads them, and saves to memory/ingested/drive/.
 */

import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { MEMORY_DIR } from "../../data-paths.js";
import { health } from "../../lib/health-ledger.js";
import { safeName, ensureDir } from "./helpers.js";

const execFile = promisify(execFileCb);

const GOG_ACCOUNT =
  process.env.GOG_CALENDAR_ACCOUNT || "caleb@patientautopilot.com";

interface DriveFile {
  id?: string;
  name?: string;
  mimeType?: string;
  modifiedTime?: string;
}

export async function runDriveSync(): Promise<{ filesProcessed: number }> {
  const result = { filesProcessed: 0 };

  try {
    const driveDir = join(MEMORY_DIR, "ingested", "drive");
    await ensureDir(driveDir);

    // List recent files
    const { stdout: lsOutput } = await execFile("gog", [
      "drive",
      "ls",
      "--account",
      GOG_ACCOUNT,
      "--client",
      "godmode",
      "--json",
      "--limit",
      "20",
    ], { timeout: 30_000 });

    let files: DriveFile[];
    try {
      files = JSON.parse(lsOutput);
    } catch {
      health.signal("ingestion.drive", true, { ...result, note: "no parseable output" });
      return result;
    }

    if (!Array.isArray(files)) {
      health.signal("ingestion.drive", true, { ...result, note: "unexpected format" });
      return result;
    }

    for (const file of files) {
      if (!file.id || !file.name) continue;

      try {
        const { stdout: content } = await execFile("gog", [
          "drive",
          "download",
          file.id,
          "--account",
          GOG_ACCOUNT,
          "--client",
          "godmode",
        ], { timeout: 60_000 });

        const slug = safeName(file.name);
        if (!slug) continue;

        const filePath = join(driveDir, `${slug}.md`);
        await writeFile(filePath, content, "utf-8");
        result.filesProcessed++;
      } catch (dlErr) {
        // Skip individual file failures — don't crash the whole sync
        console.warn(`[GodMode] Drive sync: failed to download ${file.name}: ${String(dlErr)}`);
      }
    }

    health.signal("ingestion.drive", true, result);
  } catch (err) {
    health.signal("ingestion.drive", false, {
      error: String(err),
      ...result,
    });
  }

  return result;
}
