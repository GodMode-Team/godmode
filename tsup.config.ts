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
	// Copy non-TS assets that are loaded via import.meta.url at runtime
	onSuccess: "cp src/lib/auth-public-key.pem dist/auth-public-key.pem",
});
