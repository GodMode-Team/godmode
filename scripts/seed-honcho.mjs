#!/usr/bin/env node
/**
 * seed-honcho.mjs — Pre-train Honcho with existing GodMode memory data.
 *
 * Feeds your identity docs, people profiles, opinions, daily notes,
 * and vault brain files into Honcho as "user" messages so its async
 * reasoning engine builds a deep user model from day one.
 *
 * Usage: node scripts/seed-honcho.mjs
 *
 * Requires: HONCHO_API_KEY in environment (or ~/.openclaw/.env)
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

// ── Load env from ~/.openclaw/.env ──────────────────────────────────
function loadEnv() {
  const envPath = join(process.env.HOME ?? "", ".openclaw", ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

// ── Dynamically import the Honcho SDK ───────────────────────────────
const { Honcho } = await import("@honcho-ai/sdk");

const apiKey = process.env.HONCHO_API_KEY;
if (!apiKey) {
  console.error("HONCHO_API_KEY not set. Add it to ~/.openclaw/.env");
  process.exit(1);
}

const honcho = new Honcho({ apiKey });
const peer = await honcho.peer(process.env.GODMODE_OWNER ?? "owner");
const session = await honcho.session("seed-initial-memory-load");

console.log(`[seed] Honcho connected. Peer: ${peer.id}, Session: seed:initial-memory-load\n`);

// ── Helpers ─────────────────────────────────────────────────────────
function readMd(path) {
  try {
    const content = readFileSync(path, "utf-8").trim();
    return content.length > 20 ? content : null;
  } catch { return null; }
}

function collectMdFiles(dir, maxFiles = 50) {
  if (!existsSync(dir)) return [];
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith(".md"))
      .slice(0, maxFiles)
      .map(f => join(dir, f));
  } catch { return []; }
}

async function feedToHoncho(label, content) {
  if (!content || content.length < 30) return;
  // Truncate very long docs to 4000 chars to stay within limits
  const truncated = content.length > 4000 ? content.slice(0, 4000) + "\n\n[truncated]" : content;
  try {
    await session.addMessages([{
      peerId: peer.id,
      content: `[${label}]\n\n${truncated}`,
      metadata: { role: "user", source: "seed", label },
    }]);
    console.log(`  [ok] ${label} (${truncated.length} chars)`);
  } catch (err) {
    console.warn(`  [err] ${label}: ${String(err)}`);
  }
}

// Small delay to avoid rate limiting
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── 1. Identity Docs (highest priority) ─────────────────────────────
console.log("=== Phase 1: Identity Docs ===");
const vaultIdentity = join(process.env.HOME, "Documents", "VAULT", "08-Identity");
const identityFiles = ["USER.md", "SOUL.md", "IDENTITY.md", "PRINCIPLES.md", "VISION.md", "THESIS.md"];

for (const f of identityFiles) {
  const content = readMd(join(vaultIdentity, f));
  if (content) {
    await feedToHoncho(`Identity: ${f}`, content);
    await sleep(300);
  }
}

// ── 2. People Profiles (relationship graph) ─────────────────────────
console.log("\n=== Phase 2: People Profiles ===");
const peopleDir = join(process.env.HOME, "godmode", "memory", "bank", "people");
const peopleFiles = collectMdFiles(peopleDir, 86); // all of them

for (const f of peopleFiles) {
  const name = basename(f, ".md");
  if (name === "INDEX") continue;
  const content = readMd(f);
  if (content) {
    await feedToHoncho(`Person: ${name}`, content);
    await sleep(200);
  }
}

// ── 3. Opinions & Positioning ───────────────────────────────────────
console.log("\n=== Phase 3: Opinions & Positioning ===");
const opinionFiles = [
  join(process.env.HOME, "godmode", "memory", "bank", "opinions.md"),
  join(process.env.HOME, "godmode", "memory", "topics.md"),
];
for (const f of opinionFiles) {
  const content = readMd(f);
  if (content) {
    await feedToHoncho(`Opinions: ${basename(f)}`, content);
    await sleep(300);
  }
}

// ── 4. Recent Daily Notes (last 14 days) ────────────────────────────
console.log("\n=== Phase 4: Recent Daily Notes ===");
const memoryDir = join(process.env.HOME, "godmode", "memory");
const allDailies = readdirSync(memoryDir)
  .filter(f => /^2026-03-\d{2}\.md$/.test(f))
  .sort()
  .reverse()
  .slice(0, 14);

for (const f of allDailies) {
  const content = readMd(join(memoryDir, f));
  if (content) {
    await feedToHoncho(`Daily Note: ${f}`, content);
    await sleep(300);
  }
}

// ── 5. Vault Brain (companies, knowledge) ───────────────────────────
console.log("\n=== Phase 5: Vault Brain ===");
const brainDirs = [
  join(process.env.HOME, "Documents", "VAULT", "06-Brain", "Companies"),
  join(process.env.HOME, "Documents", "VAULT", "06-Brain", "People"),
  join(process.env.HOME, "Documents", "VAULT", "06-Brain", "Knowledge"),
];
for (const dir of brainDirs) {
  const files = collectMdFiles(dir, 20); // top 20 per category
  for (const f of files) {
    const content = readMd(f);
    if (content) {
      await feedToHoncho(`Brain/${basename(dir)}: ${basename(f)}`, content);
      await sleep(200);
    }
  }
}

// ── 6. Project files ────────────────────────────────────────────────
console.log("\n=== Phase 6: Projects ===");
const projectFiles = collectMdFiles(
  join(process.env.HOME, "godmode", "memory", "bank", "projects"), 10
);
for (const f of projectFiles) {
  const content = readMd(f);
  if (content) {
    await feedToHoncho(`Project: ${basename(f)}`, content);
    await sleep(300);
  }
}

// ── Done ────────────────────────────────────────────────────────────
console.log("\n=== Seeding complete ===");
console.log("Honcho will now asynchronously reason about all this data.");
console.log("The user model will be available for context injection on next gateway start.");
