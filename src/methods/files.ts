import { execFile as execFileCb } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { readQueueState } from "../lib/queue-state.js";
import { readWorkspaceConfig } from "../lib/workspaces-config.js";

const execFile = promisify(execFileCb);

/** Environment for gog CLI calls (needs keyring password). */
const GOG_ENV = {
  ...process.env,
  GOG_KEYRING_PASSWORD: process.env.GOG_KEYRING_PASSWORD || "godmode2026",
};

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Resolve a file path that may be relative to a workspace or godmode root.
 * Returns the resolved absolute path or null if not found.
 */
async function resolveFilePath(filePath: string): Promise<string | null> {
  let resolved = filePath;
  if (path.isAbsolute(resolved)) {
    try { await fs.access(resolved); return resolved; } catch { return null; }
  }

  // Expand ~ prefix
  if (resolved.startsWith("~/")) {
    resolved = path.join(process.env.HOME ?? "", resolved.slice(2));
    try { await fs.access(resolved); return resolved; } catch { return null; }
  }

  // Try godmode roots first, then all workspace directories
  const godmodeRoot = process.env.GODMODE_ROOT ?? path.join(process.env.HOME ?? "", "godmode");
  const candidates = [
    path.join(godmodeRoot, resolved),
    path.join(godmodeRoot, "data", resolved),
  ];

  try {
    const wsConfig = await readWorkspaceConfig({ initializeIfMissing: false });
    for (const ws of wsConfig.workspaces) {
      candidates.push(path.join(ws.path, resolved));
    }
  } catch {
    // Workspace config unavailable
  }

  for (const candidate of candidates) {
    try { await fs.access(candidate); return candidate; } catch { /* next */ }
  }
  return null;
}

// ── RPC Handlers ─────────────────────────────────────────────────

/**
 * List Google accounts configured in gog CLI that can be used for Drive uploads.
 */
const listDriveAccounts: GatewayRequestHandler = async ({ respond }) => {
  // Read gog config to get account_clients map
  const configPath = path.join(
    process.env.HOME ?? "~",
    "Library/Application Support/gogcli/config.json",
  );

  try {
    const raw = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(raw) as {
      account_clients?: Record<string, string>;
    };

    const accountClients = config.account_clients ?? {};
    const accounts = Object.entries(accountClients).map(([email, client]) => ({
      email,
      client,
      label: email.split("@")[0] ?? email,
    }));

    respond(true, { accounts });
  } catch {
    // Config not found or unreadable — return empty list
    respond(true, { accounts: [] });
  }
};

/**
 * Upload a file to Google Drive, optionally targeting a specific account.
 * Resolves relative paths against GODMODE_ROOT and common workspace roots.
 */
const pushToDrive: GatewayRequestHandler = async ({ params, respond }) => {
  const { filePath, account, parentFolderId } = params as {
    filePath?: string;
    account?: string;
    parentFolderId?: string;
  };

  if (!filePath) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing filePath" });
    return;
  }

  const resolvedPath = await resolveFilePath(filePath);
  if (!resolvedPath) {
    respond(false, null, { code: "FILE_NOT_FOUND", message: `File not found: ${filePath}` });
    return;
  }

  // Check that gog CLI is available
  try {
    await execFile("which", ["gog"]);
  } catch {
    respond(false, null, {
      code: "GOG_NOT_FOUND",
      message: "gog CLI not found. Install: npm install -g gog-cli",
    });
    return;
  }

  const args = ["drive", "upload", resolvedPath, "--no-input", "--json"];
  if (account) {
    args.push("--account", account);
  }
  if (parentFolderId) {
    args.push("--parent", parentFolderId);
  }

  try {
    const { stdout, stderr } = await execFile("gog", args, {
      timeout: 60_000,
      env: GOG_ENV,
    });
    const accountLabel = account ? ` (${account})` : "";
    const fileName = path.basename(resolvedPath);

    // Try to parse JSON output for file ID / web link
    let driveUrl: string | undefined;
    let fileId: string | undefined;
    try {
      const json = JSON.parse(stdout.trim()) as Record<string, unknown>;
      fileId = (json.id ?? json.fileId ?? json.file_id) as string | undefined;
      driveUrl =
        (json.webViewLink ?? json.web_view_link ?? json.link ?? json.url) as string | undefined;
      if (!driveUrl && fileId) {
        driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
      }
    } catch {
      // Non-JSON output — try to extract a Drive URL from stdout
      const urlMatch = (stdout || stderr).match(/https:\/\/drive\.google\.com\/\S+/);
      if (urlMatch) driveUrl = urlMatch[0];
    }

    respond(true, {
      message: `Uploaded "${fileName}" to Google Drive${accountLabel}`,
      output: (stdout || stderr).trim(),
      driveUrl,
      fileId,
    });
  } catch (e: unknown) {
    // Extract useful error details from gog CLI output
    let message = "Upload failed";
    if (e instanceof Error) {
      // execFile errors include stderr in the message
      const stderr = (e as { stderr?: string }).stderr?.trim();
      message = stderr || e.message;
      // Trim verbose stack traces, keep first line
      if (message.includes("\n")) {
        message = message.split("\n")[0];
      }
    }
    respond(false, null, { code: "DRIVE_UPLOAD_FAILED", message });
  }
};

/**
 * Upload multiple files to Google Drive in a single batch.
 * Processes sequentially (one at a time) with a max of 20 files.
 */
const batchPushToDrive: GatewayRequestHandler = async ({ params, respond }) => {
  const { filePaths, account, parentFolderId } = params as {
    filePaths?: string[];
    account?: string;
    parentFolderId?: string;
  };

  if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing or empty filePaths array" });
    return;
  }

  if (filePaths.length > 20) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Maximum 20 files per batch" });
    return;
  }

  // Check gog availability once
  try {
    await execFile("which", ["gog"]);
  } catch {
    respond(false, null, { code: "GOG_NOT_FOUND", message: "gog CLI not found. Install: npm install -g gog-cli" });
    return;
  }

  const results: Array<{ path: string; success: boolean; driveUrl?: string; error?: string }> = [];

  for (const fp of filePaths) {
    const resolved = await resolveFilePath(fp);
    if (!resolved) {
      results.push({ path: fp, success: false, error: `File not found: ${fp}` });
      continue;
    }

    const args = ["drive", "upload", resolved, "--no-input", "--json"];
    if (account) args.push("--account", account);
    if (parentFolderId) args.push("--parent", parentFolderId);

    try {
      const { stdout, stderr } = await execFile("gog", args, { timeout: 60_000, env: GOG_ENV });
      let driveUrl: string | undefined;
      try {
        const json = JSON.parse(stdout.trim()) as Record<string, unknown>;
        const fileId = (json.id ?? json.fileId ?? json.file_id) as string | undefined;
        driveUrl = (json.webViewLink ?? json.web_view_link ?? json.link ?? json.url) as string | undefined;
        if (!driveUrl && fileId) driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
      } catch {
        const urlMatch = (stdout || stderr).match(/https:\/\/drive\.google\.com\/\S+/);
        if (urlMatch) driveUrl = urlMatch[0];
      }
      results.push({ path: path.basename(resolved), success: true, driveUrl });
    } catch (e: unknown) {
      let message = "Upload failed";
      if (e instanceof Error) {
        const stderr = (e as { stderr?: string }).stderr?.trim();
        message = stderr || e.message;
        if (message.includes("\n")) message = message.split("\n")[0];
      }
      results.push({ path: path.basename(resolved), success: false, error: message });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  respond(true, {
    message: `Uploaded ${successCount}/${results.length} files to Google Drive`,
    results,
  });
};

/**
 * List files associated with a queue task item.
 * Checks the item's outputPath and scans inbox for related files.
 */
const taskFiles: GatewayRequestHandler = async ({ params, respond }) => {
  const { itemId } = params as { itemId?: string };
  if (!itemId) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing itemId" });
    return;
  }

  const files: Array<{ path: string; name: string; size: number; type: string }> = [];

  try {
    const queueState = await readQueueState();
    const item = queueState.items.find((i) => i.id === itemId);

    // Check the main output file
    if (item?.result?.outputPath) {
      const outputPath = item.result.outputPath.startsWith("~/")
        ? path.join(process.env.HOME ?? "", item.result.outputPath.slice(2))
        : item.result.outputPath;
      try {
        const stat = await fs.stat(outputPath);
        files.push({
          path: outputPath,
          name: path.basename(outputPath),
          size: stat.size,
          type: path.extname(outputPath).slice(1) || "file",
        });
      } catch { /* file may not exist */ }
    }

    // Scan inbox for files prefixed with the item ID
    const godmodeRoot = process.env.GODMODE_ROOT ?? path.join(process.env.HOME ?? "", "godmode");
    const inboxDir = path.join(godmodeRoot, "memory", "inbox");
    try {
      const entries = await fs.readdir(inboxDir);
      for (const entry of entries) {
        if (!entry.startsWith(itemId)) continue;
        const fullPath = path.join(inboxDir, entry);
        try {
          const stat = await fs.stat(fullPath);
          if (stat.isFile() && !files.some((f) => f.path === fullPath)) {
            files.push({
              path: fullPath,
              name: entry,
              size: stat.size,
              type: path.extname(entry).slice(1) || "file",
            });
          }
        } catch { /* skip unreadable */ }
      }
    } catch { /* inbox dir may not exist */ }

    respond(true, { files });
  } catch {
    respond(true, { files });
  }
};

/**
 * Read a file's content and metadata. Validates that the path falls within
 * allowed roots (GODMODE_ROOT or Obsidian vault) before reading.
 */
const readFile: GatewayRequestHandler = async ({ params, respond }) => {
  const filePath = (params as { path?: string }).path;
  if (!filePath) {
    respond(false, null, { code: "MISSING_PARAM", message: "path is required" });
    return;
  }

  // SECURITY: Validate path is within allowed roots
  const { isAllowedPath } = await import("../lib/vault-paths.js");
  const resolvedPath = path.resolve(filePath);
  if (!isAllowedPath(resolvedPath)) {
    respond(false, null, { code: "ACCESS_DENIED", message: `Path not allowed: ${filePath}` });
    return;
  }

  try {
    const stat = statSync(resolvedPath);
    if (!stat.isFile()) {
      respond(false, null, { code: "NOT_FILE", message: "Path is not a file" });
      return;
    }

    const MAX_SIZE = 100 * 1024; // 100KB
    const size = stat.size;
    const truncated = size > MAX_SIZE;

    const content = readFileSync(resolvedPath, "utf-8").substring(0, MAX_SIZE);

    // Detect content type from extension
    const ext = path.extname(resolvedPath).toLowerCase().slice(1);
    const mimeMap: Record<string, string> = {
      html: "text/html", md: "text/markdown", json: "application/json",
      js: "text/javascript", ts: "text/typescript", css: "text/css",
      txt: "text/plain", yaml: "text/yaml", yml: "text/yaml",
      xml: "text/xml", csv: "text/csv", py: "text/x-python",
      sh: "text/x-shellscript", svg: "image/svg+xml",
    };
    const contentType = mimeMap[ext] || "text/plain";

    respond(true, { content, size, truncated, contentType });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    respond(false, null, { code: "READ_ERROR", message: msg });
  }
};

// ── Export ────────────────────────────────────────────────────────

export const filesHandlers: Record<string, GatewayRequestHandler> = {
  "files.read": readFile,
  "files.listDriveAccounts": listDriveAccounts,
  "files.pushToDrive": pushToDrive,
  "files.batchPushToDrive": batchPushToDrive,
  "queue.taskFiles": taskFiles,
};
