/**
 * proof-bridge.ts — Client wrapper for the Proof editor.
 *
 * All Proof operations go through this bridge. Used by:
 *   - proof_editor tool (Prosper creates/edits docs)
 *   - queue-processor (agents write output to Proof docs)
 *   - UI (opens Proof docs in sidebar via iframe)
 *
 * Configurable target:
 *   - Default: https://www.proofeditor.ai (hosted, zero-setup)
 *   - Self-hosted: set PROOF_API_URL=http://127.0.0.1:4000 (proof-sdk local)
 *   - Sovereignty: self-hosted keeps all data on your machine
 *
 * Auth: Per-document share tokens stored in ~/godmode/data/proof-tokens.json.
 * Local mirror: Markdown copies in ~/godmode/artifacts/proof/ for vault/Drive.
 */

import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { ARTIFACTS_DIR } from "../data-paths.js";
import { secureMkdirSync, secureWriteFileSync } from "./secure-fs.js";
import {
  getTokenForSlug,
  storeToken,
  getTokenMap,
  getProofDocumentFilePath,
} from "../services/proof-server.js";

/** Resolve the Proof API base URL. Self-hosted takes priority. */
const PROOF_API = (process.env.PROOF_API_URL ?? "https://www.proofeditor.ai").replace(/\/+$/, "");
const PROOF_ARTIFACTS_DIR = join(ARTIFACTS_DIR, "proof");

// ── API Helpers ──────────────────────────────────────────────────

async function proofApiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOpts } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOpts.headers as Record<string, string> ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    if (!headers["X-Agent-Id"]) {
      headers["X-Agent-Id"] = "godmode-ally";
    }
  }

  const url = `${PROOF_API}${path}`;
  const res = await fetch(url, { ...fetchOpts, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let errorMsg = `Proof API ${res.status}: ${text}`;
    try {
      const parsed = JSON.parse(text);
      if (parsed.code) errorMsg = `Proof API ${parsed.code}: ${parsed.message ?? text}`;
    } catch { /* raw text is fine */ }
    throw new Error(errorMsg);
  }

  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("json")) {
    return res.json() as Promise<T>;
  }
  return {} as T;
}

/** Write a local markdown mirror for vault capture and Google Drive export. */
function syncLocalMirror(slug: string, title: string, content: string): string {
  const filePath = getProofDocumentFilePath(slug);
  secureMkdirSync(PROOF_ARTIFACTS_DIR);
  const normalized = content.trim().startsWith("#")
    ? content
    : `# ${title}\n\n${content}`.trim() + "\n";
  secureWriteFileSync(filePath, normalized.endsWith("\n") ? normalized : normalized + "\n");
  return filePath;
}

// ── Public API ───────────────────────────────────────────────────

export async function createProofDocument(
  title: string,
  initialContent?: string,
  author?: string,
): Promise<{ slug: string; title: string; url: string; filePath: string }> {
  const markdown = initialContent?.trim()
    ? initialContent
    : `# ${title}\n\n`;

  // POST /share/markdown creates a new doc and returns slug + accessToken
  const result = await proofApiFetch<{
    slug?: string;
    id?: string;
    accessToken?: string;
    tokenUrl?: string;
    url?: string;
  }>(
    "/share/markdown",
    { method: "POST", body: JSON.stringify({ markdown }) },
  );

  let slug = result.slug ?? result.id ?? "";
  let token = result.accessToken ?? "";

  // Fallback: extract from URL if accessToken not in response body
  if (!slug || !token) {
    const urlStr = result.tokenUrl ?? result.url;
    if (urlStr) {
      try {
        const fullUrl = urlStr.startsWith("http") ? urlStr : `${PROOF_API}${urlStr}`;
        const parsed = new URL(fullUrl);
        const pathParts = parsed.pathname.split("/").filter(Boolean);
        if (!slug && pathParts.length >= 2) {
          slug = pathParts[pathParts.length - 1];
        }
        if (!token) {
          token = parsed.searchParams.get("token") ?? "";
        }
      } catch { /* use what we have */ }
    }
  }

  if (!slug) {
    throw new Error("Proof API did not return a document identifier");
  }

  if (token) {
    storeToken(slug, token, title);
  }

  const filePath = syncLocalMirror(slug, title, markdown);

  return {
    slug,
    title,
    url: getProofViewUrl(slug),
    filePath,
  };
}

/** State response from Proof API — includes content + mutation metadata. */
type ProofState = {
  text?: string;
  content?: string;
  markdown?: string;
  title?: string;
  updatedAt?: string;
  revision?: number;
  mutationBase?: { token?: string };
};

/** Read document state from Proof API. Returns content + revision for optimistic concurrency. */
async function readProofState(slug: string, token: string): Promise<ProofState> {
  return proofApiFetch<ProofState>(`/api/agent/${slug}/state`, { token });
}

export async function readProofDocument(
  slug: string,
): Promise<{ slug: string; title: string; content: string; updatedAt: string; filePath: string }> {
  const token = getTokenForSlug(slug);
  if (!token) {
    throw new Error(`No auth token for Proof document: ${slug}`);
  }

  const state = await readProofState(slug, token);

  const content = state.text ?? state.content ?? state.markdown ?? "";
  const title = state.title ?? slug;
  const updatedAt = state.updatedAt ?? new Date().toISOString();
  const filePath = syncLocalMirror(slug, title, content);

  return { slug, title, content, updatedAt, filePath };
}

export async function editProofDocument(
  slug: string,
  content: string,
  author: "agent" | "ally" | "human",
  authorName?: string,
  mode: "replace" | "append" = "replace",
): Promise<void> {
  const token = getTokenForSlug(slug);
  if (!token) {
    throw new Error(`No auth token for Proof document: ${slug}`);
  }

  const agentId = authorName
    ? `godmode-${authorName.toLowerCase().replace(/\s+/g, "-")}`
    : `godmode-${author}`;

  // Read current state for optimistic concurrency (baseRevision)
  const state = await readProofState(slug, token);
  const baseRevision = state.revision;

  if (mode === "replace") {
    await proofApiFetch(`/api/agent/${slug}/ops`, {
      method: "POST",
      token,
      headers: { "X-Agent-Id": agentId, "Idempotency-Key": randomUUID() },
      body: JSON.stringify({
        type: "rewrite.apply",
        by: `ai:${agentId}`,
        content,
        baseRevision,
      }),
    });
  } else {
    await proofApiFetch(`/api/agent/${slug}/edit`, {
      method: "POST",
      token,
      headers: { "X-Agent-Id": agentId, "Idempotency-Key": randomUUID() },
      body: JSON.stringify({
        by: `ai:${agentId}`,
        baseRevision,
        operations: [{ op: "append", section: "", content: "\n\n" + content }],
      }),
    });
  }

  // Update local mirror
  try {
    const state = await readProofDocument(slug);
    syncLocalMirror(slug, state.title, state.content);
  } catch { /* mirror sync failure is non-fatal */ }
}

export async function appendProofDocument(
  slug: string,
  content: string,
  author: "agent" | "ally" | "human",
  authorName?: string,
): Promise<void> {
  await editProofDocument(slug, content, author, authorName, "append");
}

export async function addProofComment(
  slug: string,
  author: string,
  text: string,
  _position?: number,
): Promise<{ id: string }> {
  const token = getTokenForSlug(slug);
  if (!token) {
    throw new Error(`No auth token for Proof document: ${slug}`);
  }

  const agentId = `godmode-${author.toLowerCase().replace(/\s+/g, "-")}`;

  const result = await proofApiFetch<{ id?: string }>(`/api/agent/${slug}/ops`, {
    method: "POST",
    token,
    headers: { "X-Agent-Id": agentId },
    body: JSON.stringify({
      type: "comment.add",
      by: `ai:${agentId}`,
      text,
    }),
  });

  return { id: result.id ?? randomUUID() };
}

export async function listProofDocuments(): Promise<
  Array<{ slug: string; title: string; updatedAt: string; author: string }>
> {
  const tokenMap = getTokenMap();
  return Object.entries(tokenMap).map(([slug, entry]) => ({
    slug,
    title: entry.title ?? slug,
    updatedAt: entry.storedAt,
    author: "ally",
  }));
}

/**
 * Get the Proof editor URL for embedding in sidebar iframe.
 * Points to hosted or self-hosted depending on PROOF_API_URL env.
 */
export function getProofViewUrl(slug: string): string {
  const token = getTokenForSlug(slug);
  if (token) {
    return `${PROOF_API}/d/${slug}?token=${token}`;
  }
  return `${PROOF_API}/d/${slug}`;
}

/** Get the configured API base URL. */
export function getProofApiBase(): string {
  return PROOF_API;
}

/** Get the auth token for a Proof document (used by queue-processor for agent prompts). */
export function getProofToken(slug: string): string | null {
  return getTokenForSlug(slug) ?? null;
}

export function shareProofDocument(slug: string): { slug: string; viewUrl: string } {
  return { slug, viewUrl: getProofViewUrl(slug) };
}

/** Check if the configured Proof API is reachable. */
export async function checkProofHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${PROOF_API}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
