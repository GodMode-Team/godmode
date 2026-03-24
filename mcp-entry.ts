#!/usr/bin/env node
/**
 * mcp-entry.ts — MCP stdio server exposing all GodMode tools to Hermes.
 *
 * Hermes connects via MCP (Model Context Protocol) to call GodMode workspace
 * tools: queue management, task CRUD, delegation, trust rating, memory, etc.
 *
 * Configure in ~/.hermes/config.yaml:
 *   mcp_servers:
 *     godmode:
 *       command: "node"
 *       args: ["/path/to/godmode/dist/mcp-entry.js"]
 */

import { GodModeMcpServer } from "./src/adapter/hermes/mcp-server.js";

async function main() {
  const server = new GodModeMcpServer();

  // All 18 GodMode tool factories — same list as register-all.ts and index.ts
  const toolImports = [
    () => import("./src/tools/queue-add.js").then((m) => m.createQueueAddTool),
    () => import("./src/tools/queue-check.js").then((m) => m.createQueueCheckTool),
    () => import("./src/tools/queue-action.js").then((m) => m.createQueueActionTool),
    () => import("./src/tools/queue-steer.js").then((m) => m.createQueueSteerTool),
    () => import("./src/tools/tasks-tool.js").then((m) => m.createTasksCreateTool),
    () => import("./src/tools/tasks-tool.js").then((m) => m.createTasksListTool),
    () => import("./src/tools/tasks-tool.js").then((m) => m.createTasksUpdateTool),
    () => import("./src/tools/delegate-tool.js").then((m) => m.createDelegateTool),
    () => import("./src/tools/trust-rate.js").then((m) => m.createTrustRateTool),
    () => import("./src/tools/self-repair.js").then((m) => m.createSelfRepairTool),
    () => import("./src/tools/team-message.js").then((m) => m.createTeamMessageTool),
    () => import("./src/tools/team-memory.js").then((m) => m.createTeamMemoryWriteTool),
    () => import("./src/tools/guardrail.js").then((m) => m.createGuardrailTool),
    () => import("./src/tools/onboard.js").then((m) => m.createOnboardTool),
    () => import("./src/tools/morning-set.js").then((m) => m.createMorningSetTool),
    () => import("./src/tools/x-read.js").then((m) => m.createXReadTool),
    () => import("./src/tools/honcho-query.js").then((m) => m.createHonchoQueryTool),
    () => import("./src/tools/composio-tool.js").then((m) => m.createComposioExecuteTool),
    () => import("./src/tools/memory-get-mcp.js").then((m) => m.createMemoryGetMcpTool),
    () => import("./src/tools/memory-search-shim.js").then((m) => m.createMemorySearchShimTool),
    () => import("./src/tools/capture-thought.js").then((m) => m.createCaptureThoughtTool),
  ];

  let loaded = 0;
  for (const load of toolImports) {
    try {
      const factory = await load();
      server.registerTool(factory);
      loaded++;
    } catch (err) {
      console.error(`[GodMode MCP] Skipped tool: ${String(err)}`);
    }
  }

  console.error(`[GodMode MCP] Loaded ${loaded} tools, starting MCP server on stdio...`);
  server.start();
}

main().catch((err) => {
  console.error("[GodMode MCP] Fatal error:", err);
  process.exit(1);
});
