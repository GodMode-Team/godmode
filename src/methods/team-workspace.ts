import { execFile as execFileCb } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { GatewayRequestHandler } from "../types/plugin-api.js";
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

/**
 * workspace.setupFromTemplate — create a team workspace from a bundled template.
 *
 * Templates live in assets/workspace-templates/{slug}.json with optional
 * content directories at assets/workspace-templates/{slug}/.
 *
 * Params:
 * - template (string, required) — template slug (e.g. godmode-dev, project-a, project-b)
 * - github (string, optional) — override git remote
 * - branch (string, optional, default "main")
 * - path (string, optional) — override workspace path
 */
const setupFromTemplate: GatewayRequestHandler = async ({ params, respond }) => {
  const template = typeof params.template === "string" ? String(params.template).trim() : "";
  const githubOverride = typeof params.github === "string" ? String(params.github).trim() : "";
  const branch = typeof params.branch === "string" ? String(params.branch).trim() : "main";
  const explicitPath = typeof params.path === "string" ? String(params.path).trim() : "";

  if (!template) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "template is required"));
    return;
  }

  // Resolve template path relative to the plugin's assets directory
  const { dirname: dirnameFn, join: joinFn, resolve: resolveFn, basename: basenameFn } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const { existsSync, readFileSync } = await import("node:fs");
  const { cp, readdir, stat } = await import("node:fs/promises");

  const moduleDir = dirnameFn(fileURLToPath(import.meta.url));
  // tsup bundles to dist/index.js so moduleDir = dist/
  // dev mode: dist/src/methods/ or src/methods/
  // Check multiple candidate roots (same strategy as index.ts UI asset resolution)
  const pluginRootFromDist = basenameFn(moduleDir) === "dist" ? resolveFn(moduleDir, "..") : moduleDir;
  const pluginRootUp1 = resolveFn(moduleDir, "..");
  const pluginRootUp3 = dirnameFn(dirnameFn(dirnameFn(moduleDir)));
  const templateJsonCandidates = [
    // Bundled: dist/assets/workspace-templates/ (tsup onSuccess copies these)
    joinFn(moduleDir, "assets", "workspace-templates", `${template}.json`),
    // Dev/unbundled: assets/ at plugin root
    joinFn(pluginRootFromDist, "assets", "workspace-templates", `${template}.json`),
    joinFn(pluginRootUp1, "assets", "workspace-templates", `${template}.json`),
    joinFn(pluginRootUp3, "assets", "workspace-templates", `${template}.json`),
  ];

  let templateJsonPath: string | undefined;
  for (const candidate of templateJsonCandidates) {
    if (existsSync(candidate)) {
      templateJsonPath = candidate;
      break;
    }
  }

  if (!templateJsonPath) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.NOT_FOUND, `Template not found: ${template}. Available: godmode-dev`),
    );
    return;
  }

  let templateConfig: {
    name: string;
    slug: string;
    type?: string;
    description?: string;
    gitRemote?: string;
    syncEnabled?: boolean;
    syncInterval?: number;
    paths?: Record<string, string>;
  };

  try {
    templateConfig = JSON.parse(readFileSync(templateJsonPath, "utf-8"));
  } catch (err) {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, `Invalid template JSON: ${err instanceof Error ? err.message : String(err)}`),
    );
    return;
  }

  const name = templateConfig.name;
  const github = githubOverride || templateConfig.gitRemote || "";

  const config = await readWorkspaceConfig();
  const existingIds = new Set(config.workspaces.map((w) => w.id));
  const id = createWorkspaceId(templateConfig.slug || name, existingIds);

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

  // Scaffold team workspace metadata
  const creatorId = await resolveGitMemberId(workspacePath);
  const metadata = await scaffoldTeamWorkspace({
    workspacePath,
    name,
    id,
    github: github || undefined,
    creatorName: creatorId,
    creatorId,
  });

  // Copy template content files (memory/, skills/, etc.) into the workspace
  const templateContentDir = path.dirname(templateJsonPath);
  const templateSlugDir = path.join(templateContentDir, template);
  try {
    const templateStat = await stat(templateSlugDir);
    if (templateStat.isDirectory()) {
      const subdirs = await readdir(templateSlugDir, { withFileTypes: true });
      for (const entry of subdirs) {
        const srcPath = path.join(templateSlugDir, entry.name);
        const dstPath = path.join(workspacePath, entry.name);
        if (entry.isDirectory()) {
          await cp(srcPath, dstPath, { recursive: true, force: false });
        } else if (entry.isFile()) {
          // Copy individual files (e.g., template-level configs)
          const { copyFile } = await import("node:fs/promises");
          await copyFile(srcPath, dstPath);
        }
      }
    }
  } catch {
    // Template content dir may not exist — scaffold already created defaults
  }

  // Initial commit + push
  try {
    const remote = github ? "origin" : undefined;
    await gitAddCommitPush(workspacePath, `Initialize ${name} workspace from template`, remote, branch);
  } catch {
    // Push may fail if repo is empty or no remote — non-fatal
  }

  const workspace: WorkspaceConfigEntry = {
    id,
    name,
    emoji: "👥",
    type: "team",
    path: workspacePath,
    keywords: [id, name.toLowerCase(), templateConfig.slug],
    pinned: [],
    pinnedSessions: [],
    artifactDirs: ["outputs", "artifacts"],
    sync: {
      type: "git",
      remote: github ? "origin" : undefined,
      branch,
      autoPull: { enabled: templateConfig.syncEnabled !== false, interval: "30s" },
      autoPush: { enabled: templateConfig.syncEnabled !== false, debounceMs: 5000 },
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

  const syncService = getWorkspaceSyncService();
  await syncService.refreshFromConfig(config);

  respond(true, {
    workspace: { ...workspace, path: toDisplayPath(workspace.path) },
    metadata,
    template,
  });
};

/**
 * workspace.listTemplates — list available workspace templates.
 */
const listTemplates: GatewayRequestHandler = async ({ respond }) => {
  const { dirname: dirnameFn, join: joinFn, resolve: resolveFn, basename: basenameFn } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const { readdir, readFile: readFileFn } = await import("node:fs/promises");

  const moduleDir = dirnameFn(fileURLToPath(import.meta.url));
  const pluginRootFromDist = basenameFn(moduleDir) === "dist" ? resolveFn(moduleDir, "..") : moduleDir;
  const pluginRootUp1 = resolveFn(moduleDir, "..");
  const pluginRootUp3 = dirnameFn(dirnameFn(dirnameFn(moduleDir)));

  const templateDirs = [
    joinFn(moduleDir, "assets", "workspace-templates"),
    joinFn(pluginRootFromDist, "assets", "workspace-templates"),
    joinFn(pluginRootUp1, "assets", "workspace-templates"),
    joinFn(pluginRootUp3, "assets", "workspace-templates"),
  ];

  const templates: Array<{ slug: string; name: string; type?: string; description?: string }> = [];
  const seen = new Set<string>();

  for (const dir of templateDirs) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
        const slug = entry.name.replace(/\.json$/, "");
        if (seen.has(slug)) continue;
        seen.add(slug);

        try {
          const raw = await readFileFn(joinFn(dir, entry.name), "utf-8");
          const config = JSON.parse(raw);
          templates.push({
            slug,
            name: config.name ?? slug,
            type: config.type,
            description: config.description,
          });
        } catch {
          templates.push({ slug, name: slug });
        }
      }
    } catch {
      // Directory may not exist
    }
  }

  respond(true, { templates });
};

/**
 * workspace.resolveConflict — resolve git merge conflicts for a team workspace.
 *
 * Params:
 * - workspaceId (string, required)
 * - strategy ("ours" | "theirs", required)
 */
const resolveConflict: GatewayRequestHandler = async ({ params, respond }) => {
  const workspaceId = typeof params.workspaceId === "string" ? String(params.workspaceId).trim() : "";
  const strategy = typeof params.strategy === "string" ? String(params.strategy).trim() : "";

  if (!workspaceId) {
    respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "workspaceId is required"));
    return;
  }
  if (strategy !== "ours" && strategy !== "theirs") {
    respond(
      false,
      undefined,
      errorShape(ErrorCodes.INVALID_REQUEST, 'strategy must be "ours" or "theirs"'),
    );
    return;
  }

  const config = await readWorkspaceConfig();
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace) {
    respond(false, undefined, errorShape(ErrorCodes.NOT_FOUND, `workspace not found: ${workspaceId}`));
    return;
  }

  const opts = { cwd: workspace.path, maxBuffer: 5 * 1024 * 1024 };
  try {
    // Abort any in-progress rebase (pull --rebase leaves git mid-rebase on conflict)
    await execFile("git", ["rebase", "--abort"], opts).catch(() => {});
    // Also abort any in-progress merge, in case the conflict came from a non-rebase pull
    await execFile("git", ["merge", "--abort"], opts).catch(() => {});

    // Now resolve: reset to the chosen side and commit
    if (strategy === "ours") {
      // "ours" = keep local HEAD as-is (rebase --abort already restored it)
      // Pull remote and force-resolve any remaining conflicts to ours
      await execFile("git", ["pull", "--no-rebase", "-X", "ours"], opts).catch((err: unknown) => console.warn("[team-workspace] git pull (ours) failed:", err instanceof Error ? err.message : String(err)));
    } else {
      // "theirs" = accept remote changes
      await execFile("git", ["pull", "--no-rebase", "-X", "theirs"], opts).catch((err: unknown) => console.warn("[team-workspace] git pull (theirs) failed:", err instanceof Error ? err.message : String(err)));
    }
    // Stage anything left over and commit if needed
    await execFile("git", ["add", "-A"], opts);
    const message = strategy === "ours" ? "resolve: keep local" : "resolve: accept remote";
    try {
      await execFile("git", ["commit", "-m", message], opts);
    } catch (commitErr) {
      const msg = commitErr instanceof Error ? commitErr.message : String(commitErr);
      if (!msg.toLowerCase().includes("nothing to commit")) {
        throw commitErr;
      }
    }
  } catch (err) {
    respond(
      false,
      undefined,
      errorShape(
        ErrorCodes.GIT_ERROR,
        `Conflict resolution failed: ${err instanceof Error ? err.message : String(err)}`,
      ),
    );
    return;
  }

  // Resume sync now that conflict is resolved
  const syncService = getWorkspaceSyncService();
  await syncService.resume(workspaceId);

  respond(true, { workspaceId, strategy, resolved: true });
};

export const teamWorkspaceHandlers: GatewayRequestHandlers = {
  "workspace.createTeam": createTeam,
  "workspace.provisionTeam": provisionTeam,
  "workspace.joinTeam": joinTeam,
  "workspace.leaveTeam": leaveTeam,
  "workspace.syncNow": syncNow,
  "workspace.syncStatus": syncStatus,
  "workspace.setupFromTemplate": setupFromTemplate,
  "workspace.listTemplates": listTemplates,
  "workspace.resolveConflict": resolveConflict,
};
