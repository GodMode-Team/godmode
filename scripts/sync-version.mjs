#!/usr/bin/env node
/**
 * sync-version.mjs — Keep openclaw.plugin.json version in sync with package.json.
 *
 * Run automatically via npm's "version" lifecycle hook.
 * Usage: node scripts/sync-version.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const pluginPath = join(root, "openclaw.plugin.json");
const plugin = JSON.parse(readFileSync(pluginPath, "utf8"));

if (plugin.version !== pkg.version) {
	plugin.version = pkg.version;
	writeFileSync(pluginPath, JSON.stringify(plugin, null, 2) + "\n");
	console.log(`Synced openclaw.plugin.json version to ${pkg.version}`);
} else {
	console.log(`Versions already in sync: ${pkg.version}`);
}
