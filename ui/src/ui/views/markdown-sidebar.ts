import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { icons } from "../icons";
import { sanitizeHtmlFragment, toSanitizedMarkdownHtml } from "../markdown";

export type MarkdownSidebarProps = {
  content: string | null;
  error: string | null;
  mimeType?: string | null;
  filePath?: string | null;
  title?: string | null;
  onClose: () => void;
  onViewRawText: () => void;
};

const MARKDOWN_EXTENSIONS = new Set(["md", "markdown", "mdx"]);
const HTML_EXTENSIONS = new Set(["htm", "html"]);
const IMAGE_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "heic",
  "heif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "svgz",
  "webp",
]);

function basenamePath(filePath: string): string {
  const normalized = filePath.replaceAll("\\", "/").trim();
  if (!normalized) {
    return filePath;
  }
  const segments = normalized.split("/");
  return segments[segments.length - 1] || normalized;
}

function inferMimeFromPath(filePath: string | null): string | null {
  if (!filePath) {
    return null;
  }
  const normalized = filePath.trim().toLowerCase();
  const extension = normalized.split(".").pop() ?? "";
  if (!extension) {
    return null;
  }
  if (MARKDOWN_EXTENSIONS.has(extension)) {
    return "text/markdown";
  }
  if (HTML_EXTENSIONS.has(extension)) {
    return "text/html";
  }
  if (IMAGE_EXTENSIONS.has(extension)) {
    if (extension === "svg" || extension === "svgz") {
      return "image/svg+xml";
    }
    if (extension === "jpg") {
      return "image/jpeg";
    }
    return `image/${extension}`;
  }
  if (extension === "json" || extension === "json5") {
    return "application/json";
  }
  if (extension === "txt" || extension === "text" || extension === "log") {
    return "text/plain";
  }
  return null;
}

function normalizeMimeType(props: MarkdownSidebarProps): string {
  const raw = props.mimeType?.split(";")[0]?.trim().toLowerCase() ?? "";
  if (raw) {
    return raw;
  }
  const trimmedContent = props.content?.trim() ?? "";
  if (trimmedContent.startsWith("data:image/")) {
    const match = /^data:(image\/[^;]+);/i.exec(trimmedContent);
    if (match?.[1]) {
      return match[1].toLowerCase();
    }
    return "image/*";
  }
  return inferMimeFromPath(props.filePath ?? null) ?? "text/markdown";
}

function renderBody(props: MarkdownSidebarProps) {
  if (props.error) {
    return html`
      <div class="callout danger">${props.error}</div>
      <button @click=${props.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;
  }

  if (!props.content) {
    return html`
      <div class="muted">No content available</div>
    `;
  }

  const mimeType = normalizeMimeType(props);
  const content = props.content;
  const trimmed = content.trim();

  if (mimeType.startsWith("image/")) {
    if (trimmed.startsWith("data:image/")) {
      return html`
        <div class="sidebar-image">
          <img src=${trimmed} alt=${basenamePath(props.filePath ?? "Image preview")} />
        </div>
      `;
    }
    return html`
      <div class="callout">
        Image preview unavailable for this payload format.
      </div>
      <button @click=${props.onViewRawText} class="btn" style="margin-top: 12px;">
        View Raw Text
      </button>
    `;
  }

  if (mimeType === "text/html" || mimeType === "application/xhtml+xml") {
    // Render full HTML pages in a sandboxed iframe so styles/layout are preserved
    const blob = new Blob([content], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    return html`<iframe
      class="sidebar-html-frame"
      src=${blobUrl}
      sandbox="allow-same-origin"
      @load=${(e: Event) => {
        // Clean up blob URL after load
        URL.revokeObjectURL(blobUrl);
        // Auto-size iframe to content height
        const iframe = e.target as HTMLIFrameElement;
        try {
          const h = iframe.contentDocument?.documentElement?.scrollHeight;
          if (h) iframe.style.height = `${h}px`;
        } catch { /* cross-origin fallback — keep default height */ }
      }}
    ></iframe>`;
  }

  if (mimeType === "text/markdown" || mimeType === "text/x-markdown") {
    return html`<div class="sidebar-markdown">${unsafeHTML(toSanitizedMarkdownHtml(content))}</div>`;
  }

  return html`<pre class="sidebar-plain">${content}</pre>`;
}

export function renderMarkdownSidebar(props: MarkdownSidebarProps) {
  const resolvedTitle = props.title?.trim() || "Tool Output";
  return html`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title-wrap">
          <div class="sidebar-title">${resolvedTitle}</div>
          ${
            props.filePath
              ? html`<div class="sidebar-path" title=${props.filePath}>${props.filePath}</div>`
              : nothing
          }
        </div>
        <button @click=${props.onClose} class="btn" title="Close sidebar">
          ${icons.x}
        </button>
      </div>
      <div class="sidebar-content">${renderBody(props)}</div>
    </div>
  `;
}
