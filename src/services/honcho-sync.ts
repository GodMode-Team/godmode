/**
 * honcho-sync.ts — Vault sync for Honcho user model.
 *
 * Queries Honcho for user priorities, patterns, and relationships,
 * then writes the results as markdown files to the vault or fallback directory.
 */

import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { queryPeer, isHonchoReady } from "./honcho-client.js";

/**
 * Sync Honcho's user model insights to the vault as markdown files.
 * Best-effort — failures are logged but never thrown.
 */
export async function syncHonchoToVault(sessionKey = "system:honcho-sync"): Promise<void> {
  if (!isHonchoReady()) return;

  // Resolve output directory: vault Brain/Identity or fallback
  let outDir: string;
  try {
    const { resolveIdentityDir } = await import("../lib/vault-paths.js");
    const identityResult = resolveIdentityDir();
    outDir = identityResult?.path ?? join(
      process.env.GODMODE_ROOT ?? join(process.env.HOME ?? "", "godmode"),
      "memory", "honcho",
    );
  } catch {
    outDir = join(
      process.env.GODMODE_ROOT ?? join(process.env.HOME ?? "", "godmode"),
      "memory", "honcho",
    );
  }

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const queries: Array<{ question: string; filename: string }> = [
    {
      question: "What are this user's current priorities and goals?",
      filename: "honcho-priorities.md",
    },
    {
      question: "What patterns have you noticed in how this user works?",
      filename: "honcho-patterns.md",
    },
    {
      question: "What key relationships and people matter to this user?",
      filename: "honcho-people.md",
    },
  ];

  for (const { question, filename } of queries) {
    try {
      const answer = await queryPeer(question, sessionKey);
      if (answer && answer.trim().length > 10) {
        const content = `# ${question}\n\n_Synced: ${new Date().toISOString()}_\n\n${answer}\n`;
        await writeFile(join(outDir, filename), content, "utf-8");
      }
    } catch (err) {
      console.warn(`[GodMode] Honcho sync error for ${filename}: ${String(err)}`);
    }
  }
}
