/**
 * proof-server.ts — Proof service integration for GodMode.
 *
 * Manages per-document auth tokens and provides RPC handlers for the UI.
 * All document operations delegate to proof-bridge.ts which calls the
 * configured Proof API (hosted proofeditor.ai or self-hosted proof-sdk).
 *
 * Token storage: ~/godmode/data/proof-tokens.json
 * Local mirrors:  ~/godmode/artifacts/proof/<slug>.md
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { ARTIFACTS_DIR, DATA_DIR } from "../data-paths.js";
import { secureMkdirSync } from "../lib/secure-fs.js";

type Logger = { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void };

// ── Types ────────────────────────────────────────────────────────

export type ProofDocument = {
  slug: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  filePath: string;
  edits: ProofEdit[];
};

export type ProofEdit = {
  id: string;
  author: "agent" | "ally" | "human";
  authorName?: string;
  content: string;
  timestamp: string;
  range?: { start: number; end: number };
};

export type ProofComment = {
  id: string;
  author: string;
  text: string;
  position?: number;
  timestamp: string;
};

// ── Paths ────────────────────────────────────────────────────────

const PROOF_ARTIFACTS_DIR = join(ARTIFACTS_DIR, "proof");

export function getProofDocumentFilePath(slug: string): string {
  return join(PROOF_ARTIFACTS_DIR, `${slug}.md`);
}

// ── Share token persistence ─────────────────────────────────────

const TOKENS_PATH = join(DATA_DIR, "proof-tokens.json");

type TokenEntry = { token: string; title?: string; storedAt: string };

function loadTokens(): Record<string, TokenEntry> {
  try {
    if (existsSync(TOKENS_PATH)) {
      return JSON.parse(readFileSync(TOKENS_PATH, "utf-8"));
    }
  } catch { /* corrupt file — start fresh */ }
  return {};
}

function saveTokens(tokens: Record<string, TokenEntry>): void {
  mkdirSync(dirname(TOKENS_PATH), { recursive: true });
  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

export function getTokenForSlug(slug: string): string | undefined {
  return loadTokens()[slug]?.token;
}

export function storeToken(slug: string, token: string, title?: string): void {
  const tokens = loadTokens();
  tokens[slug] = { token, title, storedAt: new Date().toISOString() };
  saveTokens(tokens);
}

export function getTokenMap(): Record<string, TokenEntry> {
  return loadTokens();
}

// ── Service lifecycle ───────────────────────────────────────────

let _initialized = false;

/**
 * Initialize the Proof service — ensures directories and token map exist.
 * No HTTP server; all operations go through proof-bridge → Proof API.
 */
export async function initProofService(log: Logger): Promise<boolean> {
  try {
    secureMkdirSync(dirname(TOKENS_PATH));
    secureMkdirSync(PROOF_ARTIFACTS_DIR);
    // Ensure token file exists
    if (!existsSync(TOKENS_PATH)) {
      saveTokens({});
    }
    _initialized = true;

    // Check if the configured Proof API is reachable
    try {
      const { checkProofHealth } = await import("../lib/proof-bridge.js");
      const healthy = await checkProofHealth();
      if (healthy) {
        log.info("[Proof] Connected to Proof API");
      } else {
        log.warn("[Proof] Proof API not reachable — documents will fail until API is available");
      }
    } catch {
      log.warn("[Proof] Could not check Proof API health");
    }

    // Register with health ledger
    try {
      const { health } = await import("../lib/health-ledger.js");
      health.signal("proof-service", true, { mode: "api-client" });
    } catch { /* non-fatal */ }

    return true;
  } catch (err) {
    try {
      const { health } = await import("../lib/health-ledger.js");
      health.signal("proof-service", false, { error: String(err) });
    } catch { /* non-fatal */ }
    log.warn(`[Proof] Service init failed: ${String(err)}`);
    return false;
  }
}

/**
 * Whether the Proof service is initialized.
 * Always returns true after init — the hosted API is the dependency, not a local server.
 */
export function isProofRunning(): boolean {
  return _initialized;
}

/**
 * Get the Proof editor view URL for a document.
 * Delegates to proof-bridge which handles hosted vs self-hosted URL.
 */
export function getProofViewUrl(slug: string): string {
  // Inline the URL construction to avoid circular import at module load time.
  // proof-bridge.ts imports from this file, so we can't import from it at top level.
  const PROOF_API = (process.env.PROOF_API_URL ?? "https://www.proofeditor.ai").replace(/\/+$/, "");
  const token = getTokenForSlug(slug);
  if (token) {
    return `${PROOF_API}/d/${slug}?token=${token}`;
  }
  return `${PROOF_API}/d/${slug}`;
}

// ── RPC Handlers ────────────────────────────────────────────────
// These are called from the UI via the gateway RPC system.
// They delegate to proof-bridge for actual API calls.

export const proofHandlers: Record<string, Function> = {
  "proof.status": async ({ respond }: { respond: Function }) => {
    respond(true, {
      running: isProofRunning(),
      hosted: true,
      apiBase: (process.env.PROOF_API_URL ?? "https://www.proofeditor.ai").replace(/\/+$/, ""),
    });
  },

  "proof.get": async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
    const slug = typeof params.slug === "string" ? params.slug.trim() : "";
    if (!slug) {
      respond(false, null, { code: "INVALID_REQUEST", message: "slug is required" });
      return;
    }
    try {
      const { readProofDocument, getProofViewUrl: bridgeViewUrl } = await import("../lib/proof-bridge.js");
      // If the doc fetch succeeds, trust it — don't gate on /health which can be flaky
      const doc = await readProofDocument(slug);
      respond(true, {
        slug: doc.slug,
        title: doc.title,
        content: doc.content,
        updatedAt: doc.updatedAt,
        viewUrl: bridgeViewUrl(slug),
        filePath: doc.filePath,
      });
    } catch (err) {
      // Fallback: return what we know from the token map + local markdown mirror
      const token = getTokenForSlug(slug);
      if (token) {
        const tokens = loadTokens();
        const filePath = getProofDocumentFilePath(slug);
        let content: string | undefined;
        try {
          if (existsSync(filePath)) {
            content = readFileSync(filePath, "utf-8");
          }
        } catch { /* non-fatal */ }
        respond(true, {
          slug,
          title: tokens[slug]?.title ?? slug,
          // Omit viewUrl — API is unreachable, iframe would be dead
          filePath,
          content: content ?? `# ${tokens[slug]?.title ?? slug}\n\n*This document was created but Proof is currently unavailable. Content will appear when Proof comes back online.*\n`,
          localFallback: true,
        });
      } else {
        respond(false, null, { code: "NOT_FOUND", message: `Proof document not found: ${String(err)}` });
      }
    }
  },

  "proof.save": async ({ params, respond }: { params: Record<string, unknown>; respond: Function }) => {
    const slug = typeof params.slug === "string" ? params.slug.trim() : "";
    const content = typeof params.content === "string" ? params.content : "";
    const rawAuthor = typeof params.author === "string" ? params.author : "human";
    const author: "agent" | "ally" | "human" =
      rawAuthor === "agent" || rawAuthor === "ally" ? rawAuthor : "human";
    if (!slug) {
      respond(false, null, { code: "INVALID_REQUEST", message: "slug is required" });
      return;
    }
    try {
      const { editProofDocument } = await import("../lib/proof-bridge.js");
      await editProofDocument(slug, content, author);
      respond(true, { saved: true });
    } catch (err) {
      respond(false, null, { code: "SAVE_FAILED", message: String(err) });
    }
  },

  "proof.list": async ({ respond }: { respond: Function }) => {
    try {
      const { listProofDocuments, getProofViewUrl: bridgeViewUrl } = await import("../lib/proof-bridge.js");
      const docs = await listProofDocuments();
      const documents = docs.map((doc) => ({
        slug: doc.slug,
        title: doc.title,
        updatedAt: doc.updatedAt,
        viewUrl: bridgeViewUrl(doc.slug),
        filePath: getProofDocumentFilePath(doc.slug),
      }));
      respond(true, { documents });
    } catch (err) {
      respond(false, null, { code: "LIST_FAILED", message: String(err) });
    }
  },
};
