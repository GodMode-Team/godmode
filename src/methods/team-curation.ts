import fs from "node:fs/promises";
import path from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { getCurationAgentService } from "../services/curation-agent.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const ErrorCodes = {
  INVALID_REQUEST: "INVALID_REQUEST",
  NOT_FOUND: "NOT_FOUND",
} as const;

function errorShape(code: string, message: string) {
  return { code, message };
}

/**
 * curation.run — manually trigger curation for a workspace.
 *
 * Params:
 * - workspaceId (string, required)
 */
const run: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";

  if (!workspaceId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId is required"));
    return;
  }

  const service = getCurationAgentService();
  const result = await service.runCuration(workspaceId);
  respond(result.ok, result.ok ? { workspaceId, ...result } : undefined, result.ok ? undefined : errorShape("CURATION_FAILED", result.error || "unknown"));
};

/**
 * curation.status — get curation status for a workspace.
 *
 * Params:
 * - workspaceId (string, optional) — if omitted, returns all
 */
const status: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const service = getCurationAgentService();

  if (workspaceId) {
    const state = service.getStatus(workspaceId);
    respond(true, { workspaceId, curation: state });
  } else {
    const statuses = service.listStatuses();
    respond(true, { statuses });
  }
};

/**
 * curation.candidates — read SOP candidates file for a workspace.
 *
 * Params:
 * - workspaceId (string, required)
 */
const candidates: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";

  if (!workspaceId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId is required"));
    return;
  }

  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `workspace not found: ${workspaceId}`));
    return;
  }

  const candidatesPath = path.join(workspace.path, "memory", "sop-candidates.md");
  try {
    const content = await fs.readFile(candidatesPath, "utf-8");
    respond(true, { workspaceId, content });
  } catch {
    respond(true, { workspaceId, content: null });
  }
};

export const teamCurationHandlers: GatewayRequestHandlers = {
  "curation.run": run,
  "curation.status": status,
  "curation.candidates": candidates,
};
