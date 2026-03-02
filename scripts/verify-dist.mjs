/**
 * verify-dist.mjs — Pre-publish validation for the GodMode plugin.
 *
 * Ensures the dist/ directory contains:
 * 1) dist/index.js  (plugin runtime entry)
 * 2) dist/godmode-ui/index.html  (UI bundle with <godmode-app> root)
 * 3) At least one JS asset in dist/godmode-ui/assets/
 *
 * Fails the build if any check fails, preventing a broken publish.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dist = join(root, "dist");

let ok = true;

function check(label, condition) {
  if (!condition) {
    console.error(`[verify-dist] FAIL: ${label}`);
    ok = false;
  } else {
    console.log(`[verify-dist]   OK: ${label}`);
  }
}

// 1. Plugin entry must exist and be non-trivial
const entryPath = join(dist, "index.js");
check("dist/index.js exists", existsSync(entryPath));
if (existsSync(entryPath)) {
  const size = readFileSync(entryPath).byteLength;
  check(`dist/index.js is non-trivial (${(size / 1024).toFixed(0)} KB)`, size > 10_000);
}

// 2. UI index.html must exist with <godmode-app> root tag
const uiIndex = join(dist, "godmode-ui", "index.html");
check("dist/godmode-ui/index.html exists", existsSync(uiIndex));
if (existsSync(uiIndex)) {
  const html = readFileSync(uiIndex, "utf8");
  check("index.html contains <godmode-app>", /<godmode-app\b/i.test(html));
}

// 3. At least one JS asset in the UI bundle
const assetsDir = join(dist, "godmode-ui", "assets");
if (existsSync(assetsDir)) {
  const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
  check(`UI has JS assets (found ${jsFiles.length})`, jsFiles.length > 0);
} else {
  check("dist/godmode-ui/assets/ directory exists", false);
}

// 4. No source maps leaked into dist
const hasSourceMaps = existsSync(join(dist, "index.js.map"));
if (hasSourceMaps) {
  console.warn("[verify-dist] WARN: dist/index.js.map found — source maps will ship to npm if listed in files");
}

// 5. openclaw.plugin.json must exist at root
check("openclaw.plugin.json exists", existsSync(join(root, "openclaw.plugin.json")));

if (!ok) {
  console.error("\n[verify-dist] Pre-publish check FAILED. Fix the issues above before publishing.");
  process.exit(1);
}

console.log("\n[verify-dist] All checks passed. Package is ready to publish.");
