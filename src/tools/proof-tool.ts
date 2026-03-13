/**
 * proof-tool.ts — proof_editor tool for Prosper.
 *
 * Lets the ally create, read, write, and manage Proof documents.
 * Documents open in the sidebar for live co-editing with agents.
 */

import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import {
  appendProofDocument,
  createProofDocument,
  readProofDocument,
  editProofDocument,
  addProofComment,
  listProofDocuments,
  getProofViewUrl,
  shareProofDocument,
} from "../lib/proof-bridge.js";
import { isProofRunning } from "../services/proof-server.js";

export function createProofEditorTool(): AnyAgentTool {
  return {
    label: "Proof Editor",
    name: "proof_editor",
    description:
      "Create and manage collaborative Proof documents. " +
      "Use for any writing that benefits from live co-editing — emails, blog posts, proposals, research briefs. " +
      "The user sees your writing in real-time in the sidebar and can edit alongside you.",
    parameters: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          enum: ["create", "write", "read", "comment", "suggest", "open", "share", "export_gdrive", "list"],
          description: "Action to perform on a Proof document",
        },
        title: {
          type: "string",
          description: "Document title (required for 'create')",
        },
        slug: {
          type: "string",
          description: "Document slug (required for write/read/comment/open)",
        },
        content: {
          type: "string",
          description: "Content to write (for 'create' or 'write')",
        },
        mode: {
          type: "string",
          enum: ["replace", "append"],
          description: "For write actions: replace the document or append to the existing draft",
        },
        comment: {
          type: "string",
          description: "Comment text (for 'comment' action)",
        },
      },
      required: ["action"],
    },
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      if (!isProofRunning()) {
        return jsonResult({
          error: "Proof server is not running. Documents are unavailable.",
        });
      }

      const action = String(params.action ?? "");

      try {
        switch (action) {
          case "create": {
            const title = String(params.title ?? "Untitled");
            const content = typeof params.content === "string" ? params.content : undefined;
            const doc = await createProofDocument(title, content, "ally");
            return jsonResult({
              created: true,
              slug: doc.slug,
              title: doc.title,
              viewUrl: doc.url,
              filePath: doc.filePath,
              message: `Created Proof doc "${doc.title}". Opening in sidebar.`,
              _sidebarAction: { type: "proof", slug: doc.slug },
            });
          }

          case "write": {
            const slug = String(params.slug ?? "");
            if (!slug) return jsonResult({ error: "slug is required for write" });
            const content = String(params.content ?? "");
            const mode = params.mode === "append" ? "append" : "replace";
            await editProofDocument(slug, content, "ally", undefined, mode);
            return jsonResult({
              updated: true,
              slug,
              message: "Document updated. The user can see changes live.",
            });
          }

          case "read": {
            const slug = String(params.slug ?? "");
            if (!slug) return jsonResult({ error: "slug is required for read" });
            const doc = await readProofDocument(slug);
            return jsonResult({
              slug: doc.slug,
              title: doc.title,
              content: doc.content,
              updatedAt: doc.updatedAt,
              filePath: doc.filePath,
            });
          }

          case "comment": {
            const slug = String(params.slug ?? "");
            if (!slug) return jsonResult({ error: "slug is required for comment" });
            const text = String(params.comment ?? "");
            await addProofComment(slug, "ally", text);
            return jsonResult({ commented: true, slug });
          }

          case "suggest": {
            const slug = String(params.slug ?? "");
            if (!slug) return jsonResult({ error: "slug is required for suggest" });
            const text = String(params.comment ?? params.content ?? "");
            await addProofComment(slug, "ally", `[SUGGESTION] ${text}`);
            await appendProofDocument(slug, `> Suggestion from Prosper: ${text}`, "ally", "Prosper");
            return jsonResult({ suggested: true, slug });
          }

          case "open": {
            const slug = String(params.slug ?? "");
            if (!slug) return jsonResult({ error: "slug is required for open" });
            const doc = await readProofDocument(slug);
            return jsonResult({
              slug: doc.slug,
              title: doc.title,
              viewUrl: getProofViewUrl(slug),
              filePath: doc.filePath,
              message: `Opening "${doc.title}" in sidebar.`,
              _sidebarAction: { type: "proof", slug: doc.slug },
            });
          }

          case "share": {
            const slug = String(params.slug ?? "");
            if (!slug) return jsonResult({ error: "slug is required for share" });
            const shared = shareProofDocument(slug);
            return jsonResult({
              shared: true,
              slug,
              viewUrl: shared.viewUrl,
              message: "Shareable link copied. The user can paste it anywhere.",
            });
          }

          case "export_gdrive": {
            const slug = String(params.slug ?? "");
            if (!slug) return jsonResult({ error: "slug is required for export_gdrive" });
            const doc = await readProofDocument(slug);
            return jsonResult({
              exportReady: true,
              slug,
              filePath: doc.filePath,
              message: `Proof doc exported to markdown at ${doc.filePath}. Use the Drive button to upload it.`,
            });
          }

          case "list": {
            const docs = await listProofDocuments();
            return jsonResult({
              documents: docs.slice(0, 20),
              total: docs.length,
            });
          }

          default:
            return jsonResult({ error: `Unknown action: ${action}` });
        }
      } catch (err) {
        return jsonResult({ error: `Proof error: ${String(err)}` });
      }
    },
  };
}
