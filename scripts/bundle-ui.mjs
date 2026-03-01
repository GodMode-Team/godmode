/**
 * bundle-ui.mjs — Copy built GodMode UI assets into plugin dist/.
 *
 * GodMode UI source resolution order:
 * 1) --ui-dir <path>
 * 2) GODMODE_UI_DIR=<path>
 * 3) <plugin>/ui/dist (in-repo Vite build output)
 * 4) <plugin>/assets/godmode-ui (committed fallback snapshot)
 *
 * Missing assets fail the build by default to avoid shipping a plugin without UI.
 * Set GODMODE_UI_OPTIONAL=1 to skip a missing bundle.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

function readEnvPath(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    return null;
  }
  return resolve(value);
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

function assertExplicitSource({ label, pathValue, validator, hint }) {
  if (!pathValue) {
    return;
  }
  if (validator(pathValue)) {
    return;
  }
  console.error(`[bundle-ui] ${label} was set but is not a valid built bundle: ${pathValue}`);
  console.error(`[bundle-ui] ${hint}`);
  process.exit(1);
}

function writeBundleSourceMeta(dest, source, kind) {
  const metadata = {
    kind,
    source,
    builtAt: new Date().toISOString(),
  };
  writeFileSync(join(dest, ".bundle-source.json"), `${JSON.stringify(metadata, null, 2)}\n`);
}

function copyBundle({
  label,
  candidates,
  destination,
  validator,
  optionalEnv,
  missingHint,
  afterCopy,
}) {
  const source = candidates.find((candidate) => validator(String(candidate)));
  if (!source) {
    const optional = process.env[optionalEnv] === "1";
    const detail = `No ${label} source found. Checked: ${candidates.join(", ")}`;
    if (optional) {
      console.warn(`[bundle-ui] ${detail}`);
      console.warn(`[bundle-ui] ${optionalEnv}=1 set; skipping ${label}.`);
      return false;
    }
    console.error(`[bundle-ui] ${detail}`);
    console.error(`[bundle-ui] ${missingHint}`);
    process.exit(1);
  }

  mkdirSync(destination, { recursive: true });
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, {
    recursive: true,
    filter: (src) => !src.endsWith(".map"),
  });
  if (afterCopy) {
    afterCopy(destination, source);
  }
  console.log(`[bundle-ui] Copied ${label} assets from ${source} → ${destination}`);
  return source;
}

const uiDirFlag = readFlag("--ui-dir");
const uiDirEnv = readEnvPath("GODMODE_UI_DIR");

assertExplicitSource({
  label: "--ui-dir",
  pathValue: uiDirFlag,
  validator: hasGodModeRootTag,
  hint: "Run a UI build first or pass a directory that includes <godmode-app> in index.html.",
});

assertExplicitSource({
  label: "GODMODE_UI_DIR",
  pathValue: uiDirEnv,
  validator: hasGodModeRootTag,
  hint: "Run a UI build first or point GODMODE_UI_DIR at a built UI directory.",
});

const uiCandidates = [
  uiDirFlag,
  uiDirEnv,
  join(pluginRoot, "ui", "dist"),
  join(pluginRoot, "assets", "godmode-ui"),
].filter(Boolean);

copyBundle({
  label: "GodMode UI",
  candidates: uiCandidates,
  destination: join(pluginRoot, "dist", "godmode-ui"),
  validator: hasGodModeRootTag,
  optionalEnv: "GODMODE_UI_OPTIONAL",
  missingHint: "Run 'pnpm build:ui' first or pass --ui-dir containing <godmode-app>.",
  afterCopy: (destination, source) => {
    writeBundleSourceMeta(destination, source, "godmode-ui");
  },
});
