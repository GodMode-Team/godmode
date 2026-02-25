/**
 * bundle-ui.mjs — Copy a built GodMode UI into dist/godmode-ui.
 *
 * Source resolution order:
 * 1) --ui-dir <path>
 * 2) <plugin>/dist/control-ui
 * 3) <plugin>/../../dist/control-ui (monorepo build output)
 * 4) <plugin>/assets/godmode-ui (committed fallback snapshot)
 *
 * If no source exists, the script fails by default to prevent shipping a
 * plugin build with missing UI assets.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(__dirname, "..");
const monorepoRoot = resolve(pluginRoot, "../..");
const fallbackUiSource = join(pluginRoot, "assets", "godmode-ui");
const pluginUiBuildOutput = join(pluginRoot, "dist", "control-ui");

// Allow override via --ui-dir flag
const uiDirFlagIndex = process.argv.indexOf("--ui-dir");
const explicitUiSource =
  uiDirFlagIndex !== -1 && process.argv[uiDirFlagIndex + 1]
    ? resolve(process.argv[uiDirFlagIndex + 1])
    : null;

const uiDest = join(pluginRoot, "dist", "godmode-ui");
const candidateSources = [
  explicitUiSource,
  pluginUiBuildOutput,
  join(monorepoRoot, "dist", "control-ui"),
  fallbackUiSource,
].filter(Boolean);

const uiSource = candidateSources.find((candidate) => existsSync(String(candidate)));

if (!uiSource) {
  const optional = process.env.GODMODE_UI_OPTIONAL === "1";
  const detail = `No UI source found. Checked: ${candidateSources.join(", ")}`;
  if (optional) {
    console.warn(`[bundle-ui] ${detail}`);
    console.warn("[bundle-ui] GODMODE_UI_OPTIONAL=1 set; skipping UI bundling.");
    process.exit(0);
  }
  console.error(`[bundle-ui] ${detail}`);
  console.error(
    "[bundle-ui] Provide --ui-dir <path> or commit fallback UI assets under assets/godmode-ui.",
  );
  process.exit(1);
}

// Verify the root app tag exists.
const indexPath = join(uiSource, "index.html");
if (existsSync(indexPath)) {
  const html = readFileSync(indexPath, "utf8");
  if (!/<(godmode|openclaw)-app\b/i.test(html)) {
    console.warn(
      `[bundle-ui] WARNING: ${indexPath} does not appear to include a known app root element.`,
    );
  }
}

// Copy recursively.
mkdirSync(uiDest, { recursive: true });
rmSync(uiDest, { recursive: true, force: true });
mkdirSync(uiDest, { recursive: true });
cpSync(uiSource, uiDest, {
  recursive: true,
  filter: (src) => !src.endsWith(".map"),
});

console.log(`[bundle-ui] Copied UI assets from ${uiSource} → ${uiDest}`);
