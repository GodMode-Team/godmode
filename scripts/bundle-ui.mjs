/**
 * bundle-ui.mjs — Copy a built GodMode UI into dist/godmode-ui.
 *
 * Source resolution order:
 * 1) --ui-dir <path>
 * 2) <plugin>/godmode-ui/dist
 * 3) <plugin>/assets/godmode-ui (committed fallback snapshot)
 * 4) <plugin>/../../dist/control-ui (monorepo build output, only if godmode build)
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
const pluginUiBuildOutput = join(pluginRoot, "godmode-ui", "dist");

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
  fallbackUiSource,
  join(monorepoRoot, "dist", "control-ui"),
].filter(Boolean);

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

const uiSource = candidateSources.find((candidate) => hasGodModeRootTag(String(candidate)));

if (!uiSource) {
  const optional = process.env.GODMODE_UI_OPTIONAL === "1";
  const detail = `No GodMode UI source found. Checked: ${candidateSources.join(", ")}`;
  if (optional) {
    console.warn(`[bundle-ui] ${detail}`);
    console.warn("[bundle-ui] GODMODE_UI_OPTIONAL=1 set; skipping UI bundling.");
    process.exit(0);
  }
  console.error(`[bundle-ui] ${detail}`);
  console.error(
    "[bundle-ui] Build godmode-ui first or provide --ui-dir containing <godmode-app>.",
  );
  process.exit(1);
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
