import { randomBytes } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

type CredentialsFile = {
  version: 1;
  credentials: Record<string, string>;
};

function expandHome(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (trimmed === "~") return homedir();
  if (trimmed.startsWith("~/")) return join(homedir(), trimmed.slice(2));
  return trimmed;
}

export function resolveGodModeRoot(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.GODMODE_ROOT?.trim();
  if (configured) {
    return resolve(expandHome(configured));
  }
  return join(homedir(), "godmode");
}

export function resolveCredentialsPath(env: NodeJS.ProcessEnv = process.env): string {
  return join(resolveGodModeRoot(env), "data", "credentials.json");
}

function ensureCredentialsDir(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true, mode: 0o700 });
}

function ensureCredentialsFileMode(filePath: string): void {
  if (!existsSync(filePath)) return;
  try {
    chmodSync(filePath, 0o600);
  } catch {
    // Ignore permission repair failures; reads should still proceed.
  }
}

function normalizeCredentialMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  const result: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const normalizedKey = key.trim();
    if (!normalizedKey || typeof raw !== "string") continue;
    if (!raw) continue;
    result[normalizedKey] = raw;
  }
  return result;
}

function loadCredentialsFile(filePath: string): Record<string, string> {
  try {
    if (!existsSync(filePath)) return {};
    ensureCredentialsFileMode(filePath);
    const parsed = JSON.parse(readFileSync(filePath, "utf-8")) as
      | CredentialsFile
      | Record<string, unknown>;
    if (parsed && typeof parsed === "object" && "credentials" in parsed) {
      return normalizeCredentialMap((parsed as CredentialsFile).credentials);
    }
    return normalizeCredentialMap(parsed);
  } catch {
    return {};
  }
}

function writeCredentialsFile(
  credentials: Record<string, string>,
  filePath: string,
): void {
  ensureCredentialsDir(filePath);
  const payload: CredentialsFile = {
    version: 1,
    credentials: credentials,
  };
  const tmpPath = `${filePath}.${randomBytes(4).toString("hex")}.tmp`;
  writeFileSync(
    tmpPath,
    `${JSON.stringify(payload, null, 2)}\n`,
    { encoding: "utf-8", mode: 0o600 },
  );
  renameSync(tmpPath, filePath);
  ensureCredentialsFileMode(filePath);
}

export function loadPersistedCredentials(
  env: NodeJS.ProcessEnv = process.env,
): Record<string, string> {
  return loadCredentialsFile(resolveCredentialsPath(env));
}

export function readPersistedCredential(
  key: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  return loadPersistedCredentials(env)[key] ?? "";
}

export function persistCredential(
  key: string,
  value: string,
  env: NodeJS.ProcessEnv = process.env,
): void {
  const normalizedKey = key.trim();
  if (!normalizedKey) return;
  const credentials = loadPersistedCredentials(env);
  if (value.trim()) {
    credentials[normalizedKey] = value;
  } else {
    delete credentials[normalizedKey];
  }
  writeCredentialsFile(credentials, resolveCredentialsPath(env));
}

export function deletePersistedCredential(
  key: string,
  env: NodeJS.ProcessEnv = process.env,
): void {
  persistCredential(key, "", env);
}

export function mergePersistedCredentialsIntoEnv(
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  const loaded: string[] = [];
  const credentials = loadPersistedCredentials(env);
  for (const [key, value] of Object.entries(credentials)) {
    if (env[key]) continue;
    env[key] = value;
    loaded.push(key);
  }
  return loaded;
}
