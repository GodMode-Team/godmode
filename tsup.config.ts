import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["index.ts"],
	format: ["esm"],
	target: "node22",
	outDir: "dist",
	dts: false, // plugin is runtime-only, not a published TS library
	clean: true,
	splitting: false,
	sourcemap: false, // proprietary plugin — don't ship source maps to npm
	external: [
		"openclaw/plugin-sdk",
	],
});
