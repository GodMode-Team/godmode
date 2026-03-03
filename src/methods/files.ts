import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { readWorkspaceConfig } from "../lib/workspaces-config.js";

const execFile = promisify(execFileCb);

/** Environment for gog CLI calls (needs keyring password). */
const GOG_ENV = {
  ...process.env,
  GOG_KEYRING_PASSWORD: process.env.GOG_KEYRING_PASSWORD || "godmode2026",
};

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

  // Resolve the file path — might be relative to a workspace or godmode root
  let resolvedPath = filePath;
  if (!path.isAbsolute(resolvedPath)) {
    // Expand ~ prefix
    if (resolvedPath.startsWith("~/")) {
      resolvedPath = path.join(process.env.HOME ?? "", resolvedPath.slice(2));
    } else {
      // Try godmode roots first, then all workspace directories
      const godmodeRoot = process.env.GODMODE_ROOT ?? path.join(process.env.HOME ?? "", "godmode");
      const candidates = [
        path.join(godmodeRoot, resolvedPath),
        path.join(godmodeRoot, "data", resolvedPath),
      ];

      // Also search all workspace directories
      try {
        const wsConfig = await readWorkspaceConfig({ initializeIfMissing: false });
        for (const ws of wsConfig.workspaces) {
          candidates.push(path.join(ws.path, resolvedPath));
        }
      } catch {
        // Workspace config unavailable — skip
      }

      let found = false;
      for (const candidate of candidates) {
        try {
          await fs.access(candidate);
          resolvedPath = candidate;
          found = true;
          break;
        } catch {
          // try next
        }
      }
      if (!found) {
        respond(false, null, {
          code: "FILE_NOT_FOUND",
          message: `File not found: ${filePath}`,
        });
        return;
      }
    }
  }

  // Verify file exists before calling gog
  try {
    await fs.access(resolvedPath);
  } catch {
    respond(false, null, {
      code: "FILE_NOT_FOUND",
      message: `File not found: ${resolvedPath}`,
    });
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

// ── Export ────────────────────────────────────────────────────────

export const filesHandlers: Record<string, GatewayRequestHandler> = {
  "files.listDriveAccounts": listDriveAccounts,
  "files.pushToDrive": pushToDrive,
};
