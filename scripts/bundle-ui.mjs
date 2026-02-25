/**
 * bundle-ui.mjs — Copy the built GodMode UI into the plugin's dist/ folder.
 *
 * Runs after tsup so the npm package ships with the UI assets at
 * dist/godmode-ui/. The plugin's static file handler looks for this
 * path when running as a standalone install (outside the monorepo).
 *
 * Usage: node scripts/bundle-ui.mjs [--ui-dir <path>]
 *   --ui-dir  Override the source UI build directory (default: ../../dist/control-ui)
 */

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(__dirname, "..");
const monorepoRoot = resolve(pluginRoot, "../..");

// Allow override via --ui-dir flag
const uiDirFlagIndex = process.argv.indexOf("--ui-dir");
const uiSource =
	uiDirFlagIndex !== -1 && process.argv[uiDirFlagIndex + 1]
		? resolve(process.argv[uiDirFlagIndex + 1])
		: join(monorepoRoot, "dist", "control-ui");

const uiDest = join(pluginRoot, "dist", "godmode-ui");

if (!existsSync(uiSource)) {
	console.warn(`[bundle-ui] UI source not found at ${uiSource}`);
	console.warn(`[bundle-ui] Run 'pnpm godmode-ui:build' first, then rebuild the plugin.`);
	console.warn(`[bundle-ui] Skipping UI bundling — plugin will work without UI in standalone mode.`);
	process.exit(0);
}

// Verify it's actually a GodMode build (not vanilla OpenClaw)
const indexPath = join(uiSource, "index.html");
if (existsSync(indexPath)) {
	const { readFileSync } = await import("node:fs");
	const html = readFileSync(indexPath, "utf8");
	if (!/<godmode-app\b/i.test(html)) {
		console.warn(`[bundle-ui] WARNING: ${indexPath} does not contain <godmode-app>.`);
		console.warn(`[bundle-ui] This may be a vanilla OpenClaw UI build. Bundling anyway.`);
	}
}

// Copy recursively
mkdirSync(uiDest, { recursive: true });
cpSync(uiSource, uiDest, { recursive: true });

console.log(`[bundle-ui] Copied UI assets from ${uiSource} → ${uiDest}`);
