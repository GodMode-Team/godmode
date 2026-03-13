/**
 * proof-viewer.ts — Proof document viewer for the sidebar.
 *
 * Embeds the Proof document editor in an iframe pointed at the
 * Proof server's rendered HTML view. Supports live co-editing:
 * agents write via API, humans edit in the iframe.
 */

import { html, nothing } from "lit";
import { icons } from "../icons";

export type ProofViewerProps = {
  slug: string;
  proofPort?: number;
  onClose: () => void;
};

/**
 * Render the Proof document viewer in the sidebar.
 * Uses an iframe to the Proof server's /documents/:slug/view endpoint.
 */
export function renderProofViewer(props: ProofViewerProps) {
  const port = props.proofPort ?? 4000;
  const viewUrl = `http://127.0.0.1:${port}/documents/${props.slug}/view`;

  return html`
    <div class="sidebar-panel proof-viewer">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">Proof Document</div>
          <div class="sidebar-path" title=${viewUrl}>Live co-editing</div>
        </div>
        <div class="sidebar-header-actions">
          <button
            class="btn sidebar-open-browser-btn"
            title="Open in browser"
            @click=${() => window.open(viewUrl, "_blank", "noopener,noreferrer")}
          >Open in Browser</button>
          <button @click=${props.onClose} class="btn" title="Close sidebar">
            ${icons.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content proof-content" style="padding: 0;">
        <iframe
          src=${viewUrl}
          class="proof-iframe"
          style="width: 100%; height: 100%; border: none; flex: 1;"
          sandbox="allow-same-origin allow-scripts allow-forms"
        ></iframe>
      </div>
    </div>
  `;
}
