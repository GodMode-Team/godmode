/**
 * project-registry.ts — RPC handlers for the deploy project registry.
 *
 * Methods:
 *   godmode.deploy.list   — list all registered projects
 *   godmode.deploy.register — register a new project mapping
 *   godmode.deploy.remove — remove a project mapping
 *   godmode.deploy.check  — run deploy guard check
 */

import {
  loadRegistry,
  registerProject,
  removeProject,
  type ProjectEntry,
} from "../lib/project-registry.js";
import { checkDeploy, checkProjectCreation } from "../lib/deploy-guard.js";
import type { GatewayRequestHandler, GatewayRequestHandlers } from "../types/plugin-api.js";

// ── List ──────────────────────────────────────────────────────────────

const listDeployProjects: GatewayRequestHandler = async ({ respond }) => {
  try {
    const entries = await loadRegistry();
    respond(true, { entries, count: entries.length });
  } catch (err) {
    respond(false, null, {
      code: "REGISTRY_LOAD_FAILED",
      message: `Failed to load deploy registry — check that ~/godmode/data/ is readable. (${String(err).slice(0, 100)})`,
    });
  }
};

// ── Register ──────────────────────────────────────────────────────────

const registerDeployProject: GatewayRequestHandler = async ({ params, respond }) => {
  const { domain, repo, localDir, platform, projectName, branch } = params as {
    domain?: string;
    repo?: string;
    localDir?: string;
    platform?: string;
    projectName?: string;
    branch?: string;
  };

  if (!domain || !repo || !platform || !projectName) {
    respond(false, null, {
      code: "INVALID_REQUEST",
      message: "Required fields: domain, repo, platform, projectName",
    });
    return;
  }

  const entry: ProjectEntry = {
    domain,
    repo,
    localDir: localDir ?? "",
    platform: platform as ProjectEntry["platform"],
    projectName,
    branch: branch ?? "main",
    updatedAt: new Date().toISOString(),
  };

  try {
    await registerProject(entry);
    respond(true, { entry, message: `Registered ${domain} → ${repo} (${platform}/${projectName})` });
  } catch (err) {
    respond(false, null, {
      code: "REGISTRY_WRITE_FAILED",
      message: `Failed to register project ${domain} — check disk space and file permissions. (${String(err).slice(0, 100)})`,
    });
  }
};

// ── Remove ────────────────────────────────────────────────────────────

const removeDeployProject: GatewayRequestHandler = async ({ params, respond }) => {
  const { domain } = params as { domain?: string };
  if (!domain) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing domain" });
    return;
  }

  try {
    const removed = await removeProject(domain);
    if (removed) {
      respond(true, { message: `Removed ${domain} from deploy registry` });
    } else {
      respond(false, null, { code: "NOT_FOUND", message: `No registry entry for ${domain}` });
    }
  } catch (err) {
    respond(false, null, {
      code: "REGISTRY_REMOVE_FAILED",
      message: `Failed to remove ${domain} from registry — check file permissions. (${String(err).slice(0, 100)})`,
    });
  }
};

// ── Check ─────────────────────────────────────────────────────────────

const checkDeployProject: GatewayRequestHandler = async ({ params, respond }) => {
  const { domain, repo, projectName, platform, action } = params as {
    domain?: string;
    repo?: string;
    projectName?: string;
    platform?: string;
    action?: "deploy" | "create";
  };

  if (!domain) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing domain" });
    return;
  }

  try {
    if (action === "create" && platform) {
      const result = await checkProjectCreation(domain, platform);
      respond(true, result);
    } else {
      const result = await checkDeploy(domain, repo, projectName);
      respond(true, result);
    }
  } catch (err) {
    respond(false, null, {
      code: "DEPLOY_CHECK_FAILED",
      message: `Deploy guard check failed for ${domain} — verify the project registry is intact. (${String(err).slice(0, 100)})`,
    });
  }
};

// ── Export ─────────────────────────────────────────────────────────────

export const deployRegistryHandlers: GatewayRequestHandlers = {
  "deploy.list": listDeployProjects,
  "deploy.register": registerDeployProject,
  "deploy.remove": removeDeployProject,
  "deploy.check": checkDeployProject,
};
