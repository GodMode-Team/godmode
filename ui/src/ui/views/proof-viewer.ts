/**
 * proof-viewer.ts — Proof document viewer for the sidebar.
 *
 * Embeds the Proof editor via iframe src URL pointing to the configured
 * Proof API (hosted proofeditor.ai or self-hosted proof-sdk).
 * The hosted editor handles real-time sync — no polling needed.
 */

import { html, nothing } from "lit";
import { icons } from "../icons";

export type ProofViewerProps = {
  slug: string;
  title?: string | null;
  viewUrl?: string | null;
  filePath?: string | null;
  onClose: () => void;
  onPushToDrive?: (filePath: string, account?: string) => void;
};

/**
 * Render the Proof document viewer in the sidebar.
 * Uses the viewUrl from the Proof API (hosted or self-hosted).
 */
export function renderProofViewer(props: ProofViewerProps) {
  const title = props.title?.trim() || props.slug;
  const viewUrl = props.viewUrl || "";

  return html`
    <div class="sidebar-panel proof-viewer">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${title}</div>
          <div class="sidebar-path" title=${viewUrl}>Live co-editing via Proof</div>
        </div>
        <div class="sidebar-header-actions">
          <button
            class="btn sidebar-open-browser-btn"
            title="Copy shareable link"
            @click=${async () => {
              try {
                await navigator.clipboard.writeText(viewUrl);
              } catch {
                window.prompt("Copy Proof link", viewUrl);
              }
            }}
          >Share</button>
          ${props.filePath && props.onPushToDrive
            ? html`<button
                class="btn sidebar-open-browser-btn"
                title="Upload the Proof markdown mirror to Google Drive"
                @click=${() => props.onPushToDrive?.(props.filePath!)}
              >Drive</button>`
            : nothing}
          <button
            class="btn sidebar-open-browser-btn"
            title="Open in browser"
            @click=${() => window.open(viewUrl, "_blank", "noopener,noreferrer")}
          >Open</button>
          <button @click=${props.onClose} class="btn" title="Close sidebar">
            ${icons.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content proof-content" style="padding: 0;">
        ${viewUrl
          ? html`<iframe
              src=${viewUrl}
              class="proof-iframe"
              style="width: 100%; height: 100%; border: none; flex: 1;"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            ></iframe>`
          : html`<div style="padding: 24px; color: #888;">No Proof URL available. Is the Proof API reachable?</div>`
        }
      </div>
    </div>
  `;
}
