import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

const execFile = promisify(execFileCb);

// ── RPC Handlers ─────────────────────────────────────────────────

const pushToDrive: GatewayRequestHandler = async ({ params, respond }) => {
  const { filePath } = params as { filePath?: string };
  if (!filePath) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing filePath" });
    return;
  }

  try {
    const { stdout } = await execFile("gog", ["drive", "upload", filePath], {
      timeout: 30_000,
    });
    respond(true, { message: "Uploaded to Google Drive", output: stdout.trim() });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed";
    respond(false, null, { code: "DRIVE_UPLOAD_FAILED", message });
  }
};

// ── Export ────────────────────────────────────────────────────────

export const filesHandlers: Record<string, GatewayRequestHandler> = {
  "files.pushToDrive": pushToDrive,
};
