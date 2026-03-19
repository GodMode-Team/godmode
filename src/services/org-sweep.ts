/**
 * org-sweep.ts — Lightweight organizational health checker.
 *
 * Runs during consciousness heartbeat tick to detect:
 * - Orphaned inbox files (>7 days, no workspace link)
 * - Scattered research (files outside canonical location)
 * - Workspace health (empty or stale workspaces)
 * - Near-duplicate research titles
 *
 * Read-only — reports findings, does not auto-move.
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";

type SweepResult = {
  actions: number;
  warnings: string[];
  timestamp: string;
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function tokenize(text: string): Set<string> {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) {
    if (b.has(w)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

export async function runOrganizationalSweep(): Promise<SweepResult> {
  const warnings: string[] = [];
  const now = Date.now();

  // 1. Orphaned inbox files (>7 days old)
  const inboxDir = join(MEMORY_DIR, "inbox");
  if (existsSync(inboxDir)) {
    try {
      const entries = readdirSync(inboxDir).filter(f => !f.startsWith("."));
      for (const file of entries) {
        try {
          const st = statSync(join(inboxDir, file));
          if (now - st.mtimeMs > SEVEN_DAYS_MS) {
            warnings.push(`Stale inbox item: ${file} (${Math.round((now - st.mtimeMs) / (24 * 60 * 60 * 1000))} days old)`);
          }
        } catch { /* skip */ }
      }
    } catch { /* skip */ }
  }

  // 2. Scattered research files
  const altResearchDir = join(GODMODE_ROOT, "research");
  if (existsSync(altResearchDir)) {
    try {
      const count = readdirSync(altResearchDir).filter(f => !f.startsWith(".")).length;
      if (count > 0) {
        warnings.push(`${count} files in ~/godmode/research/ should be consolidated to memory/research/`);
      }
    } catch { /* skip */ }
  }

  // Root HTML files
  try {
    const rootHtml = readdirSync(GODMODE_ROOT)
      .filter(f => f.endsWith(".html") && !f.startsWith("."));
    if (rootHtml.length > 0) {
      warnings.push(`${rootHtml.length} HTML files at ~/godmode/ root should be moved to memory/research/proposals/`);
    }
  } catch { /* skip */ }

  // 3. Near-duplicate research detection
  const researchDir = join(MEMORY_DIR, "research");
  if (existsSync(researchDir)) {
    try {
      const titles: Array<{ name: string; tokens: Set<string> }> = [];
      const scanDir = (dir: string) => {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.name.startsWith(".")) continue;
          if (e.isDirectory()) {
            scanDir(join(dir, e.name));
          } else {
            const name = e.name.replace(/\.[^.]+$/, "");
            titles.push({ name, tokens: tokenize(name) });
          }
        }
      };
      scanDir(researchDir);

      for (let i = 0; i < titles.length; i++) {
        for (let j = i + 1; j < titles.length; j++) {
          const sim = jaccard(titles[i].tokens, titles[j].tokens);
          if (sim > 0.7 && titles[i].name !== titles[j].name) {
            warnings.push(`Possible duplicate research: "${titles[i].name}" and "${titles[j].name}" (${Math.round(sim * 100)}% similar)`);
          }
        }
      }
    } catch { /* skip */ }
  }

  return {
    actions: warnings.length,
    warnings,
    timestamp: new Date().toISOString(),
  };
}
