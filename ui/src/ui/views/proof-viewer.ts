/**
 * proof-viewer.ts — Proof document viewer for the sidebar.
 *
 * Embeds the Proof document editor using srcdoc (HTML fetched via RPC)
 * to avoid cross-origin/mixed-content issues when the UI loads over HTTPS.
 * Supports live co-editing: agents write via API, humans edit in the iframe.
 * Save operations use postMessage to communicate with the parent.
 */

import { html, nothing } from "lit";
import { icons } from "../icons";

export type ProofViewerProps = {
  slug: string;
  title?: string | null;
  viewUrl?: string | null;
  /** Pre-rendered HTML from proof.get RPC (srcdoc mode) */
  htmlContent?: string | null;
  filePath?: string | null;
  onClose: () => void;
  onPushToDrive?: (filePath: string, account?: string) => void;
  onSaveContent?: (slug: string, content: string) => void;
};

/**
 * Render the Proof document viewer in the sidebar.
 * Prefers srcdoc (htmlContent) over src URL for HTTPS compatibility.
 */
export function renderProofViewer(props: ProofViewerProps) {
  const directUrl = `http://127.0.0.1:4000/documents/${props.slug}/view`;
  const title = props.title?.trim() || props.slug;
  const useHtml = !!props.htmlContent;

  return html`
    <div class="sidebar-panel proof-viewer">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${title}</div>
          <div class="sidebar-path" title=${directUrl}>Live co-editing via Proof</div>
        </div>
        <div class="sidebar-header-actions">
          <button
            class="btn sidebar-open-browser-btn"
            title="Copy direct link"
            @click=${async () => {
              try {
                await navigator.clipboard.writeText(directUrl);
              } catch {
                window.prompt("Copy Proof link", directUrl);
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
            title="Open in browser (local access only — requires direct connection to the gateway machine)"
            @click=${() => window.open(directUrl, "_blank", "noopener,noreferrer")}
          >Open Local</button>
          <button @click=${props.onClose} class="btn" title="Close sidebar">
            ${icons.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content proof-content" style="padding: 0;">
        ${useHtml
          ? html`<iframe
              .srcdoc=${props.htmlContent}
              class="proof-iframe"
              style="width: 100%; height: 100%; border: none; flex: 1;"
              sandbox="allow-same-origin allow-scripts allow-forms"
            ></iframe>`
          : html`<iframe
              src=${directUrl}
              class="proof-iframe"
              style="width: 100%; height: 100%; border: none; flex: 1;"
              sandbox="allow-same-origin allow-scripts allow-forms"
            ></iframe>`
        }
      </div>
    </div>
  `;
}
