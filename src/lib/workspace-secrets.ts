/**
 * workspace-secrets.ts — Secure storage for workspace connection secrets.
 *
 * Secrets are stored in ~/.openclaw/workspace-secrets.json (never in the workspace repo).
 * Each workspace has its own secret namespace.
 * File permissions set to 0o600 (owner read/write only).
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SECRETS_PATH = join(
  process.env.OPENCLAW_STATE_DIR || join(homedir(), ".openclaw"),
  "workspace-secrets.json",
);

type SecretStore = Record<string, Record<string, string>>;
// Structure: { [workspaceId]: { [connectionId]: secretValue } }

export function getWorkspaceSecret(workspaceId: string, connectionId: string): string | null {
  const store = loadStore();
  return store[workspaceId]?.[connectionId] ?? null;
}

export function setWorkspaceSecret(workspaceId: string, connectionId: string, value: string): void {
  const store = loadStore();
  if (!store[workspaceId]) store[workspaceId] = {};
  store[workspaceId][connectionId] = value;
  saveStore(store);
}

export function deleteWorkspaceSecret(workspaceId: string, connectionId: string): void {
  const store = loadStore();
  if (store[workspaceId]) {
    delete store[workspaceId][connectionId];
    if (Object.keys(store[workspaceId]).length === 0) delete store[workspaceId];
  }
  saveStore(store);
}

export function deleteWorkspaceSecrets(workspaceId: string): void {
  const store = loadStore();
  delete store[workspaceId];
  saveStore(store);
}

function loadStore(): SecretStore {
  try {
    if (existsSync(SECRETS_PATH)) {
      return JSON.parse(readFileSync(SECRETS_PATH, "utf8"));
    }
  } catch { /* corrupt file, start fresh */ }
  return {};
}

function saveStore(store: SecretStore): void {
  const dir = join(process.env.OPENCLAW_STATE_DIR || join(homedir(), ".openclaw"));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(SECRETS_PATH, JSON.stringify(store, null, 2), { mode: 0o600 });
}
