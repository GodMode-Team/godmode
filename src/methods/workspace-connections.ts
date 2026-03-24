/**
 * workspace-connections.ts — RPC handlers for managing workspace tool connections.
 */

import type { GatewayRequestHandler, GatewayRequestHandlers } from "../types/plugin-api.js";
import { findWorkspaceById, readWorkspaceConfig, writeWorkspaceConfig } from "../lib/workspaces-config.js";
import { getWorkspaceSecret, setWorkspaceSecret, deleteWorkspaceSecret } from "../lib/workspace-secrets.js";
import { getConnector, AVAILABLE_CONNECTIONS } from "../services/workspace-connectors/registry.js";
import type { WorkspaceConnection } from "../lib/workspaces-config.js";

/** List available connection types for the setup wizard. */
const listAvailable: GatewayRequestHandler = async ({ respond }) => {
  respond(true, { connections: AVAILABLE_CONNECTIONS });
};

/** List connections configured for a workspace. */
const list: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId } = params as { workspaceId?: string };
  if (!workspaceId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId required" });
    return;
  }
  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }
  respond(true, { connections: ws.connections ?? [] });
};

/** Add or update a connection for a workspace. */
const upsert: GatewayRequestHandler = async ({ params, respond }) => {
  // Runtime type validation before cast
  if (params.workspaceId !== undefined && typeof params.workspaceId !== "string") {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId must be a string" });
    return;
  }
  if (params.secret !== undefined && typeof params.secret !== "string") {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "secret must be a string" });
    return;
  }
  if (params.connection !== undefined && (typeof params.connection !== "object" || params.connection === null || Array.isArray(params.connection))) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "connection must be an object" });
    return;
  }
  if (params.connection !== undefined && typeof params.connection === "object" && params.connection !== null) {
    const conn = params.connection as Record<string, unknown>;
    if (conn.id !== undefined && typeof conn.id !== "string") {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "connection.id must be a string" });
      return;
    }
    if (conn.type !== undefined && typeof conn.type !== "string") {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "connection.type must be a string" });
      return;
    }
    if (conn.name !== undefined && typeof conn.name !== "string") {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "connection.name must be a string" });
      return;
    }
    if (conn.config !== undefined && (typeof conn.config !== "object" || conn.config === null || Array.isArray(conn.config))) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "connection.config must be an object" });
      return;
    }
  }

  const { workspaceId, connection, secret } = params as {
    workspaceId?: string;
    connection?: { id: string; type: string; name: string; config: Record<string, string> };
    secret?: string;
  };
  if (!workspaceId || !connection?.type || !connection?.id) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and connection required" });
    return;
  }

  // Test connection first
  const connector = getConnector(connection.type);
  if (!connector) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: `Unknown connection type: ${connection.type}` });
    return;
  }

  const testResult = await connector.testConnection(connection.config, secret ?? "");
  if (!testResult.ok) {
    respond(false, undefined, { code: "CONNECTION_FAILED", message: testResult.error ?? "Connection test failed" });
    return;
  }

  // Store secret separately (not in git-synced config)
  if (secret) {
    setWorkspaceSecret(workspaceId, connection.id, secret);
  }

  // Update workspace config
  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }

  if (!ws.connections) ws.connections = [];
  const existing = ws.connections.findIndex(c => c.id === connection.id);
  const entry: WorkspaceConnection = {
    id: connection.id,
    type: connection.type,
    name: connection.name,
    status: "connected",
    config: connection.config,
    lastSync: new Date().toISOString(),
  };

  if (existing >= 0) {
    ws.connections[existing] = entry;
  } else {
    ws.connections.push(entry);
  }

  await writeWorkspaceConfig(config);
  respond(true, { connection: entry, testResult });
};

/** Remove a connection from a workspace. */
const remove: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, connectionId } = params as { workspaceId?: string; connectionId?: string };
  if (!workspaceId || !connectionId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and connectionId required" });
    return;
  }

  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }

  ws.connections = (ws.connections ?? []).filter(c => c.id !== connectionId);
  await writeWorkspaceConfig(config);
  deleteWorkspaceSecret(workspaceId, connectionId);
  respond(true, { removed: connectionId });
};

/** Test a connection. */
const test: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, connectionId } = params as { workspaceId?: string; connectionId?: string };
  if (!workspaceId || !connectionId) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and connectionId required" });
    return;
  }

  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  const conn = ws?.connections?.find(c => c.id === connectionId);
  if (!conn) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Connection not found" });
    return;
  }

  const connector = getConnector(conn.type);
  if (!connector) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: `Unknown connector: ${conn.type}` });
    return;
  }

  const secret = getWorkspaceSecret(workspaceId, connectionId) ?? "";
  const result = await connector.testConnection(conn.config, secret);

  // Update status in config
  conn.status = result.ok ? "connected" : "error";
  conn.error = result.ok ? undefined : result.error;
  conn.lastSync = result.ok ? new Date().toISOString() : conn.lastSync;
  await writeWorkspaceConfig(config);

  respond(true, result);
};

/** Search across all connections in a workspace. */
const search: GatewayRequestHandler = async ({ params, respond }) => {
  const { workspaceId, query } = params as { workspaceId?: string; query?: string };
  if (!workspaceId || !query) {
    respond(false, undefined, { code: "INVALID_REQUEST", message: "workspaceId and query required" });
    return;
  }

  const config = await readWorkspaceConfig();
  const ws = findWorkspaceById(config, workspaceId);
  if (!ws) {
    respond(false, undefined, { code: "NOT_FOUND", message: "Workspace not found" });
    return;
  }

  const connections = (ws.connections ?? []).filter(c => c.status === "connected");
  const allResults: Array<{ source: string; results: unknown[] }> = [];

  await Promise.all(connections.map(async (conn) => {
    const connector = getConnector(conn.type);
    if (!connector) return;
    const secret = getWorkspaceSecret(workspaceId, conn.id) ?? "";
    try {
      const result = await connector.search(query, conn.config, secret);
      allResults.push({ source: conn.name, results: result.results });
    } catch { /* skip failed connectors */ }
  }));

  respond(true, { sources: allResults });
};

export const workspaceConnectionHandlers: GatewayRequestHandlers = {
  "workspace.connections.available": listAvailable,
  "workspace.connections.list": list,
  "workspace.connections.upsert": upsert,
  "workspace.connections.remove": remove,
  "workspace.connections.test": test,
  "workspace.connections.search": search,
};
