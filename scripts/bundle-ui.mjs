/**
 * bundle-ui.mjs — Copy built GodMode UI and Deck assets into plugin dist/.
 *
 * GodMode UI source resolution order:
 * 1) --ui-dir <path>
 * 2) GODMODE_UI_DIR=<path>
 * 3) <plugin>/../godmode-ui/dist (local source-of-truth repo)
 * 4) <plugin>/godmode-ui/dist
 * 5) <plugin>/assets/godmode-ui (committed fallback snapshot)
 * 6) <plugin>/../../dist/control-ui (legacy monorepo output)
 *
 * Deck source resolution order:
 * 1) --deck-dir <path>
 * 2) GODMODE_DECK_DIR=<path>
 * 3) <plugin>/deck/dist
 * 4) <plugin>/assets/deck (committed fallback snapshot)
 * 5) sibling workspaces:
 *    - ../openclaw-deck/dist
 *    - ../GodMode/dist/deck
 * 6) <plugin>/../../dist/deck or <plugin>/../../deck/dist
 *
 * Missing assets fail the build by default to avoid shipping a plugin without UIs.
 * Set GODMODE_UI_OPTIONAL=1 or GODMODE_DECK_OPTIONAL=1 to skip a missing bundle.
 *
 * If a sibling godmode-ui repo exists, fallback snapshots are blocked by default.
 * Override with GODMODE_UI_ALLOW_FALLBACK=1 for intentional fallback usage.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(__dirname, "..");
const monorepoRoot = resolve(pluginRoot, "../..");

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

function hasDeckBuildIndex(sourceDir) {
  const indexPath = join(sourceDir, "index.html");
  if (!existsSync(indexPath)) {
    return false;
  }
  try {
    const html = readFileSync(indexPath, "utf8");
    // Reject source/dev index files that still point to /src/main.tsx.
    if (/\/src\/main\.[jt]sx?/.test(html)) {
      return false;
    }
    return /<div id=["']root["']>/.test(html);
  } catch {
    return false;
  }
}

function normalizeDeckIndex(deckDest) {
  const indexPath = join(deckDest, "index.html");
  if (!existsSync(indexPath)) {
    return;
  }
  const html = readFileSync(indexPath, "utf8");
  const normalized = html
    .replaceAll('src="/assets/', 'src="/deck/assets/')
    .replaceAll("src='/assets/", "src='/deck/assets/")
    .replaceAll('href="/assets/', 'href="/deck/assets/')
    .replaceAll("href='/assets/", "href='/deck/assets/");
  if (normalized !== html) {
    writeFileSync(indexPath, normalized);
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
const localUiRepoRoot = join(pluginRoot, "..", "godmode-ui");
const localUiRepoDist = join(localUiRepoRoot, "dist");
const localUiRepoExists = existsSync(join(localUiRepoRoot, "package.json"));

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

if (!uiDirFlag && !uiDirEnv && localUiRepoExists && process.env.GODMODE_UI_ALLOW_FALLBACK !== "1") {
  if (!hasGodModeRootTag(localUiRepoDist)) {
    console.error(
      `[bundle-ui] Found local UI repo (${localUiRepoRoot}) but no valid build at ${localUiRepoDist}.`,
    );
    console.error(`[bundle-ui] Run: (cd ${localUiRepoRoot} && pnpm build)`);
    console.error(
      "[bundle-ui] Or set GODMODE_UI_ALLOW_FALLBACK=1 if you intentionally want to use fallback assets.",
    );
    process.exit(1);
  }
}

const uiCandidates = [
  uiDirFlag,
  uiDirEnv,
  localUiRepoDist,
  join(pluginRoot, "godmode-ui", "dist"),
  join(pluginRoot, "assets", "godmode-ui"),
  join(monorepoRoot, "dist", "control-ui"),
].filter(Boolean);

copyBundle({
  label: "GodMode UI",
  candidates: uiCandidates,
  destination: join(pluginRoot, "dist", "godmode-ui"),
  validator: hasGodModeRootTag,
  optionalEnv: "GODMODE_UI_OPTIONAL",
  missingHint: "Build godmode-ui first or pass --ui-dir containing <godmode-app>.",
  afterCopy: (destination, source) => {
    writeBundleSourceMeta(destination, source, "godmode-ui");
  },
});

const deckDirFlag = readFlag("--deck-dir");
const deckDirEnv = readEnvPath("GODMODE_DECK_DIR");

assertExplicitSource({
  label: "--deck-dir",
  pathValue: deckDirFlag,
  validator: hasDeckBuildIndex,
  hint: "Run a deck build first or pass a built deck directory.",
});

assertExplicitSource({
  label: "GODMODE_DECK_DIR",
  pathValue: deckDirEnv,
  validator: hasDeckBuildIndex,
  hint: "Run a deck build first or point GODMODE_DECK_DIR at a built deck directory.",
});

const deckCandidates = [
  deckDirFlag,
  deckDirEnv,
  join(pluginRoot, "deck", "dist"),
  join(pluginRoot, "assets", "deck"),
  join(pluginRoot, "..", "openclaw-deck", "dist"),
  join(pluginRoot, "..", "GodMode", "dist", "deck"),
  join(monorepoRoot, "dist", "deck"),
  join(monorepoRoot, "deck", "dist"),
].filter(Boolean);

copyBundle({
  label: "Deck",
  candidates: deckCandidates,
  destination: join(pluginRoot, "dist", "deck"),
  validator: hasDeckBuildIndex,
  optionalEnv: "GODMODE_DECK_OPTIONAL",
  missingHint: "Build deck first, pass --deck-dir, or add assets/deck fallback.",
  afterCopy: (destination, source) => {
    normalizeDeckIndex(destination);
    writeBundleSourceMeta(destination, source, "deck");
  },
});
