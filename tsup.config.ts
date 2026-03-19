import { resolve } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig([
	// 1. OpenClaw plugin (existing, unchanged)
	{
		entry: ["index.ts"],
		format: ["esm"],
		target: "node22",
		outDir: "dist",
		dts: false,
		clean: true,
		splitting: false,
		sourcemap: false,
		external: [
			"openclaw/plugin-sdk",
		],
		onSuccess: "cp src/lib/auth-public-key.pem dist/auth-public-key.pem && mkdir -p dist/assets/workspace-templates && cp -r assets/workspace-templates/* dist/assets/workspace-templates/ 2>/dev/null || true",
	},
	// 2. Hermes standalone + MCP entry
	{
		entry: ["standalone.ts", "mcp-entry.ts"],
		format: ["esm"],
		target: "node22",
		outDir: "dist",
		dts: false,
		clean: false, // Don't clean — OC build already ran
		splitting: false,
		sourcemap: false,
		noExternal: ["openclaw/plugin-sdk"],
		esbuildOptions(options) {
			options.alias = {
				"openclaw/plugin-sdk": resolve("src/adapter/sdk-shim.ts"),
			};
		},
	},
]);
