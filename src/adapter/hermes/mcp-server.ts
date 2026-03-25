/**
 * hermes/mcp-server.ts — Expose GodMode tools as an MCP stdio server.
 *
 * Hermes connects to this as an MCP server, making GodMode's 15 tools
 * (queue_add, delegate, tasks, trust_rate, etc.) available alongside
 * Hermes's 40+ built-in tools.
 *
 * Protocol: JSON-RPC 2.0 over stdin/stdout (MCP stdio transport).
 *
 * MCP methods implemented:
 *   - initialize → capabilities + server info
 *   - tools/list → list all registered tools
 *   - tools/call → execute a tool
 */

import type { StandaloneAgentTool, ToolContext } from "../types.js";

// ── Types ────────────────────────────────────────────────────────

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

interface McpToolDef {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// ── MCP Server ───────────────────────────────────────────────────

export class GodModeMcpServer {
  private tools: Map<string, StandaloneAgentTool> = new Map();
  private buffer = "";

  /** Register a tool from a factory function. */
  registerTool(factory: (ctx: ToolContext) => StandaloneAgentTool): void {
    const tool = factory({ sessionKey: undefined });
    this.tools.set(tool.name, tool);
  }

  /** Start listening on stdin and writing to stdout. */
  start(): void {
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => {
      this.buffer += chunk;
      this.processBuffer();
    });
    process.stdin.on("end", () => {
      process.exit(0);
    });
  }

  /** Get MCP tool definitions for all registered tools. */
  getToolDefinitions(): McpToolDef[] {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: {
        type: "object" as const,
        properties: tool.parameters.properties,
        required: tool.parameters.required,
      },
    }));
  }

  // ── Internal ─────────────────────────────────────────────────

  private processBuffer(): void {
    // MCP uses Content-Length header framing or newline-delimited JSON
    // Try newline-delimited first (simpler)
    const lines = this.buffer.split("\n");
    this.buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Skip Content-Length headers
      if (trimmed.startsWith("Content-Length:")) continue;

      try {
        const req = JSON.parse(trimmed) as JsonRpcRequest;
        this.handleRequest(req).catch((err) => {
          process.stderr.write(`[MCP] Unhandled request error: ${err}\n`);
        });
      } catch {
        // Skip non-JSON lines
      }
    }
  }

  private async handleRequest(req: JsonRpcRequest): Promise<void> {
    switch (req.method) {
      case "initialize":
        this.sendResponse(req.id ?? null, {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: {
            name: "godmode-tools",
            version: "1.0.0",
          },
        });
        break;

      case "notifications/initialized":
        // No response needed for notifications
        break;

      case "tools/list":
        this.sendResponse(req.id ?? null, {
          tools: this.getToolDefinitions(),
        });
        break;

      case "tools/call": {
        const toolName = req.params?.name as string;
        const toolArgs = (req.params?.arguments ?? {}) as Record<string, unknown>;

        const tool = this.tools.get(toolName);
        if (!tool) {
          this.sendError(req.id ?? null, -32601, `Unknown tool: ${toolName}`);
          break;
        }

        try {
          const result = await tool.execute(`mcp-${Date.now()}`, toolArgs);
          this.sendResponse(req.id ?? null, {
            content: [{ type: "text", text: result.text }],
          });
        } catch (err) {
          this.sendResponse(req.id ?? null, {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  error: err instanceof Error ? err.message : String(err),
                }),
              },
            ],
            isError: true,
          });
        }
        break;
      }

      default:
        if (req.id !== undefined) {
          this.sendError(req.id, -32601, `Method not found: ${req.method}`);
        }
    }
  }

  private sendResponse(id: string | number | null, result: unknown): void {
    const msg: JsonRpcResponse = { jsonrpc: "2.0", id, result };
    const json = JSON.stringify(msg);
    process.stdout.write(`${json}\n`);
  }

  private sendError(id: string | number | null, code: number, message: string): void {
    const msg: JsonRpcResponse = { jsonrpc: "2.0", id, error: { code, message } };
    const json = JSON.stringify(msg);
    process.stdout.write(`${json}\n`);
  }
}
