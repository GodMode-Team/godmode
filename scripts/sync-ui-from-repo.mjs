/**
 * sync-ui-from-repo.mjs — Sync built GodMode UI into plugin fallback assets.
 *
 * This keeps assets/godmode-ui aligned for npm installs that skip the build step.
 * Default source is ui/dist (in-repo Vite output).
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(__dirname, "..");

function readFlag(flagName) {
  const index = process.argv.indexOf(flagName);
  if (index === -1 || !process.argv[index + 1]) {
    return null;
  }
  return resolve(process.argv[index + 1]);
}

function hasGodModeRootTag(sourceDir) {
  const indexPath = join(sourceDir, "index.html");
  if (!existsSync(indexPath)) {
    return false;
  }
  try {
    const html = readFileSync(indexPath, "utf8");
    return /<godmode-app\b/i.test(html);
  } catch {
    return false;
  }
}

const sourceDir =
  readFlag("--ui-dir") ||
  (process.env.GODMODE_UI_DIR ? resolve(process.env.GODMODE_UI_DIR) : null) ||
  join(pluginRoot, "ui", "dist");

const destDir = readFlag("--dest") || join(pluginRoot, "assets", "godmode-ui");

if (!hasGodModeRootTag(sourceDir)) {
  console.error(`[sync-ui] Missing valid GodMode UI build at: ${sourceDir}`);
  console.error("[sync-ui] Run UI build first: `pnpm build:ui`.");
  process.exit(1);
}

rmSync(destDir, { recursive: true, force: true });
mkdirSync(destDir, { recursive: true });
cpSync(sourceDir, destDir, {
  recursive: true,
  filter: (src) => !src.endsWith(".map"),
});

console.log(`[sync-ui] Synced ${sourceDir} → ${destDir}`);
