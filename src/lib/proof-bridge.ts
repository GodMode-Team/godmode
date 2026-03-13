/**
 * proof-bridge.ts — Client wrapper for the Proof document server.
 *
 * All Proof operations go through this bridge. Used by:
 *   - proof_editor tool (Prosper creates/edits docs)
 *   - queue-processor (agents write output to Proof docs)
 *   - UI (opens Proof docs in sidebar via iframe)
 */

import {
  getProofPort,
  getProofViewUrl as getServerProofViewUrl,
  isProofRunning,
} from "../services/proof-server.js";

type ProofResponse<T> = T & { error?: string };

async function proofFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  if (!isProofRunning()) {
    throw new Error("Proof server is not running");
  }
  const port = getProofPort();
  const url = `http://127.0.0.1:${port}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
  });
  const data = await res.json() as ProofResponse<T>;
  if (!res.ok) {
    throw new Error((data as any).error ?? `Proof API error: ${res.status}`);
  }
  return data;
}

// ── Public API ───────────────────────────────────────────────────

export async function createProofDocument(
  title: string,
  initialContent?: string,
  author?: string,
): Promise<{ slug: string; title: string; url: string; filePath: string }> {
  const doc = await proofFetch<{ slug: string; title: string; filePath: string }>("/documents", {
    method: "POST",
    body: JSON.stringify({ title, content: initialContent, author }),
  });
  return { ...doc, url: getServerProofViewUrl(doc.slug) };
}

export async function readProofDocument(
  slug: string,
): Promise<{ slug: string; title: string; content: string; updatedAt: string; filePath: string }> {
  return proofFetch(`/documents/${slug}`);
}

export async function editProofDocument(
  slug: string,
  content: string,
  author: "agent" | "ally" | "human",
  authorName?: string,
  mode: "replace" | "append" = "replace",
): Promise<void> {
  await proofFetch(`/documents/${slug}`, {
    method: "PUT",
    body: JSON.stringify({ content, author, authorName, mode }),
  });
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
  position?: number,
): Promise<{ id: string }> {
  return proofFetch(`/documents/${slug}/comments`, {
    method: "POST",
    body: JSON.stringify({ author, text, position }),
  });
}

export async function listProofDocuments(): Promise<
  Array<{ slug: string; title: string; updatedAt: string; author: string }>
> {
  const result = await proofFetch<{ documents: Array<{ slug: string; title: string; updatedAt: string; author: string }> }>("/documents");
  return result.documents;
}

/**
 * Get the iframe URL for embedding a Proof doc in the sidebar.
 */
export function getProofViewUrl(slug: string): string {
  return getServerProofViewUrl(slug);
}

/**
 * Get the API base URL for the Proof server.
 */
export function getProofApiBase(): string {
  const port = getProofPort();
  return `http://127.0.0.1:${port}`;
}

export function shareProofDocument(slug: string): { slug: string; viewUrl: string } {
  return { slug, viewUrl: getProofViewUrl(slug) };
}
