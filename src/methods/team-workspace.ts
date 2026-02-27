import { execFile as execFileCb } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import {
  addMemberToWorkspace,
  readWorkspaceMetadata,
  resolveGitMemberId,
  scaffoldTeamWorkspace,
} from "../lib/team-workspace-scaffold.js";
import { getWorkspaceSyncService } from "../lib/workspace-sync-service.js";
import {
  createWorkspaceId,
  ensureWorkspaceFolders,
  findWorkspaceById,
  readWorkspaceConfig,
  resolveGodModeRoot,
  toDisplayPath,
  writeWorkspaceConfig,
  type WorkspaceConfigEntry,
} from "../lib/workspaces-config.js";

const execFile = promisify(execFileCb);

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const ErrorCodes = {
  INVALID_REQUEST: "INVALID_REQUEST",
  GIT_ERROR: "GIT_ERROR",
  NOT_FOUND: "NOT_FOUND",
} as const;

function errorShape(code: string, message: string) {
  return { code, message };
}

async function gitClone(repoUrl: string, targetPath: string, branch?: string): Promise<void> {
  const baseArgs = ["clone", repoUrl, targetPath];
  const args = branch ? ["clone", "--branch", branch, repoUrl, targetPath] : baseArgs;
  try {
    await execFile("git", args, { maxBuffer: 10 * 1024 * 1024 });
    return;
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
    const branchMissing =
      Boolean(branch) &&
      message.includes("remote branch") &&
      message.includes("not found in upstream origin");
    if (!branchMissing) {
      throw err;
    }
  }

  // Empty repos often have no default branch yet; retry clone without --branch.
  await rm(targetPath, { recursive: true, force: true }).catch(() => {});
  await execFile("git", baseArgs, { maxBuffer: 10 * 1024 * 1024 });
}

async function gitInit(targetPath: string): Promise<void> {
  await execFile("git", ["init"], { cwd: targetPath, maxBuffer: 1024 * 1024 });
}

async function gitAddCommitPush(
  targetPath: string,
  message: string,
  remote?: string,
  branch?: string,
): Promise<void> {
  const opts = { cwd: targetPath, maxBuffer: 5 * 1024 * 1024 };
  await execFile("git", ["add", "-A"], opts);
  try {
    await execFile("git", ["commit", "-m", message], opts);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.toLowerCase().includes("nothing to commit")) {
      throw err;
    }
  }
  if (remote) {
    await execFile("git", ["push", remote, branch || "main"], opts);
  }
}

function resolveGithubUrl(github: string): string {
  if (github.startsWith("http://") || github.startsWith("https://") || github.startsWith("git@")) {
    return github;
  }
  // "org/repo" shorthand
  return `https://github.com/${github}.git`;
}

function slugifyRepoName(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `godmode-${Date.now()}`;
}

async function ensureGithubRepo(params: {
  github: string;
  privateRepo: boolean;
  description?: string;
}): Promise<{ created: boolean }> {
  const viewArgs = ["repo", "view", params.github, "--json", "name"];
  try {
    await execFile("gh", viewArgs, { maxBuffer: 1024 * 1024 });
    return { created: false };
  } catch {
    // Create below.
  }

  const createArgs = ["repo", "create", params.github, params.privateRepo ? "--private" : "--public"];
  if (params.description) {
    createArgs.push("--description", params.description);
  }
  createArgs.push("--confirm");
  await execFile("gh", createArgs, { maxBuffer: 10 * 1024 * 1024 });
  return { created: true };
}

/**
 * workspace.createTeam — create a new team workspace backed by a GitHub repo.
 *
 * Params:
 * - name (string, required)
 * - github (string, optional) — "org/repo" or full URL. If provided, clones; otherwise inits locally.
 * - branch (string, optional, default "main")
 * - path (string, optional) — override workspace path
 */
const createTeam: GatewayRequestHandler = async ({ params, respond }) => {
  const name = typeof params.name === "string" ? String(params.name).trim() : "";
  const github = typeof params.github === "string" ? String(params.github).trim() : "";
  const branch = typeof params.branch === "string" ? String(params.branch).trim() : "main";
  const explicitPath = typeof params.path === "string" ? String(params.path).trim() : "";

  if (!name) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "name is required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const existingIds = new Set(config.workspaces.map((w) => w.id));
  const id = createWorkspaceId(name, existingIds);

  const root = resolveGodModeRoot();
  const workspacePath = explicitPath
    ? path.resolve(explicitPath)
    : path.join(root, "clients", id);

  try {
    if (github) {
      await gitClone(resolveGithubUrl(github), workspacePath, branch);
    } else {
      await ensureWorkspaceFolders(workspacePath, "team");
      await gitInit(workspacePath);
    }
  } catch (err) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.GIT_ERROR, `Git setup failed: ${err instanceof Error ? err.message : String(err)}`),
    );
    return;
  }

  const creatorId = await resolveGitMemberId(workspacePath);
  const metadata = await scaffoldTeamWorkspace({
    workspacePath,
    name,
    id,
    github: github || undefined,
    creatorName: creatorId,
    creatorId,
  });

  // Initial commit + push if remote exists
  try {
    const remote = github ? "origin" : undefined;
    await gitAddCommitPush(workspacePath, `Initialize ${name} team workspace`, remote, branch);
  } catch {
    // Push may fail if repo is empty or no remote — non-fatal
  }

  const workspace: WorkspaceConfigEntry = {
    id,
    name,
    emoji: "👥",
    type: "team",
    path: workspacePath,
    keywords: [id, name.toLowerCase()],
    pinned: [],
    pinnedSessions: [],
    artifactDirs: ["outputs", "artifacts"],
    sync: {
      type: "git",
      remote: github ? "origin" : undefined,
      branch,
      autoPull: { enabled: true, interval: "30s" },
      autoPush: { enabled: true, debounceMs: 5000 },
    },
    team: {
      github: github || undefined,
      role: "admin",
      memberId: creatorId,
    },
    curation: { enabled: true },
  };

  config.workspaces.push(workspace);
  await writeWorkspaceConfig(config);

  // Refresh sync service to pick up the new workspace
  const syncService = getWorkspaceSyncService();
  await syncService.refreshFromConfig(config);

  respond(true, {
    workspace: { ...workspace, path: toDisplayPath(workspace.path) },
    metadata,
  });
};

/**
 * workspace.joinTeam — clone an existing team workspace and join as a member.
 *
 * Params:
 * - github (string, required) — "org/repo" or full URL
 * - branch (string, optional, default "main")
 * - path (string, optional)
 */
const joinTeam: GatewayRequestHandler = async ({ params, respond }) => {
  const github = typeof params.github === "string" ? String(params.github).trim() : "";
  const branch = typeof params.branch === "string" ? String(params.branch).trim() : "main";
  const explicitPath = typeof params.path === "string" ? String(params.path).trim() : "";

  if (!github) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "github is required"));
    return;
  }

  const config = await readWorkspaceConfig();

  // Derive name from github "org/repo" or URL
  const repoName = github.split("/").pop()?.replace(/\.git$/, "") || "team";
  const existingIds = new Set(config.workspaces.map((w) => w.id));
  const id = createWorkspaceId(repoName, existingIds);

  const root = resolveGodModeRoot();
  const workspacePath = explicitPath
    ? path.resolve(explicitPath)
    : path.join(root, "clients", id);

  try {
    await gitClone(resolveGithubUrl(github), workspacePath, branch);
  } catch (err) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.GIT_ERROR, `Clone failed: ${err instanceof Error ? err.message : String(err)}`),
    );
    return;
  }

  const metadata = await readWorkspaceMetadata(workspacePath);
  if (!metadata) {
    // Not a GodMode team workspace — clean up and fail
    try {
      const { rm } = await import("node:fs/promises");
      await rm(workspacePath, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup
    }
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "Repository is not a GodMode team workspace (missing .godmode/workspace.json). " +
          "Use 'workspace.createTeam' to initialize a new team workspace instead.",
      ),
    );
    return;
  }

  const memberId = await resolveGitMemberId(workspacePath);
  const displayName = metadata.name || repoName;

  // Add ourselves as a member
  if (metadata) {
    await addMemberToWorkspace({
      workspacePath,
      memberId,
      memberName: memberId,
      role: "member",
    });

    try {
      await gitAddCommitPush(workspacePath, `${memberId} joined workspace`, "origin", branch);
    } catch {
      // Non-fatal — push may fail
    }
  }

  const workspace: WorkspaceConfigEntry = {
    id,
    name: displayName,
    emoji: "👥",
    type: "team",
    path: workspacePath,
    keywords: [id, displayName.toLowerCase()],
    pinned: [],
    pinnedSessions: [],
    artifactDirs: ["outputs", "artifacts"],
    sync: {
      type: "git",
      remote: "origin",
      branch,
      autoPull: { enabled: true, interval: "30s" },
      autoPush: { enabled: true, debounceMs: 5000 },
    },
    team: {
      github,
      role: "member",
      memberId,
    },
    curation: metadata ? { enabled: true } : undefined,
  };

  config.workspaces.push(workspace);
  await writeWorkspaceConfig(config);

  const syncService = getWorkspaceSyncService();
  await syncService.refreshFromConfig(config);

  respond(true, {
    workspace: { ...workspace, path: toDisplayPath(workspace.path) },
    metadata,
  });
};

/**
 * workspace.leaveTeam — remove a team workspace from local config.
 *
 * Params:
 * - workspaceId (string, required)
 * - removeMember (boolean, optional) — also remove self from workspace.json
 */
const leaveTeam: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const removeMember = Boolean(params.removeMember);

  if (!workspaceId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId is required"));
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `workspace not found: ${workspaceId}`));
    return;
  }

  if (workspace.type !== "team") {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspace is not a team workspace"));
    return;
  }

  if (removeMember) {
    const metadata = await readWorkspaceMetadata(workspace.path);
    if (metadata) {
      const memberId = workspace.team?.memberId || (await resolveGitMemberId(workspace.path));
      metadata.members = metadata.members.filter((m) => m.id !== memberId);
      const { writeFile } = await import("node:fs/promises");
      const metadataPath = path.join(workspace.path, ".godmode", "workspace.json");
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2) + "\n", "utf-8");

      try {
        await gitAddCommitPush(workspace.path, `${memberId} left workspace`);
      } catch {
        // Non-fatal
      }
    }
  }

  config.workspaces = config.workspaces.filter((w) => w.id !== workspace.id);
  await writeWorkspaceConfig(config);

  const syncService = getWorkspaceSyncService();
  await syncService.refreshFromConfig(config);

  respond(true, { ok: true, removed: workspaceId });
};

/**
 * workspace.syncNow — trigger immediate git sync for a workspace.
 *
 * Params:
 * - workspaceId (string, required)
 */
const syncNow: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";

  if (!workspaceId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId is required"));
    return;
  }

  const syncService = getWorkspaceSyncService();
  const status = await syncService.manualSync(workspaceId);
  respond(true, { workspaceId, sync: status });
};

/**
 * workspace.syncStatus — get current sync state for a workspace.
 *
 * Params:
 * - workspaceId (string, optional) — if omitted, returns all
 */
const syncStatus: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const syncService = getWorkspaceSyncService();

  if (workspaceId) {
    const status = syncService.getStatus(workspaceId);
    respond(true, { workspaceId, sync: status });
  } else {
    const statuses = syncService.listStatuses();
    respond(true, { statuses });
  }
};

/**
 * workspace.provisionTeam — create a GitHub repo (if missing) and bootstrap
 * a team workspace against it in one step.
 *
 * Params:
 * - name (string, required)
 * - org (string, optional, default "godmode-team")
 * - repo (string, optional, defaults to slugified name)
 * - privateRepo (boolean, optional, default true)
 * - branch (string, optional, default "main")
 * - path (string, optional)
 */
const provisionTeam: GatewayRequestHandler = async ({ params, respond }) => {
  const name = typeof params.name === "string" ? String(params.name).trim() : "";
  const org = typeof params.org === "string" ? String(params.org).trim() : "godmode-team";
  const repoRaw = typeof params.repo === "string" ? String(params.repo).trim() : "";
  const branch = typeof params.branch === "string" ? String(params.branch).trim() : "main";
  const privateRepo = params.privateRepo !== false;
  const explicitPath = typeof params.path === "string" ? String(params.path).trim() : "";

  if (!name) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "name is required"));
    return;
  }
  if (!org) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "org is required"));
    return;
  }

  const repo = repoRaw || slugifyRepoName(name);
  const github = `${org}/${repo}`;

  try {
    await ensureGithubRepo({
      github,
      privateRepo,
      description: `GodMode workspace for ${name}`,
    });
  } catch (err) {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.GIT_ERROR,
        `Failed to provision GitHub repo ${github}: ${err instanceof Error ? err.message : String(err)}`,
      ),
    );
    return;
  }

  const createParams = { name, github, branch, path: explicitPath };
  await createTeam({
    params: createParams,
    respond,
  } as unknown as Parameters<GatewayRequestHandler>[0]);
};

export const teamWorkspaceHandlers: GatewayRequestHandlers = {
  "workspace.createTeam": createTeam,
  "workspace.provisionTeam": provisionTeam,
  "workspace.joinTeam": joinTeam,
  "workspace.leaveTeam": leaveTeam,
  "workspace.syncNow": syncNow,
  "workspace.syncStatus": syncStatus,
};
