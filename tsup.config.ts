import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["index.ts"],
	format: ["esm"],
	target: "node22",
	outDir: "dist",
	dts: false, // plugin is runtime-only, not a published TS library
	clean: true,
	splitting: false,
	sourcemap: true,
	external: [
		"openclaw/plugin-sdk",
	],
});
