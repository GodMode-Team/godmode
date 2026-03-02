import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { icons } from "../icons";
import { linkifyFilePaths, sanitizeHtmlFragment, toSanitizedMarkdownHtml } from "../markdown";

export type MarkdownSidebarProps = {
  content: string | null;
  error: string | null;
  mimeType?: string | null;
  filePath?: string | null;
  title?: string | null;
  onClose: () => void;
  onViewRawText: () => void;
  onOpenFile?: (filePath: string) => void;
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

/**
 * Extract the local file path from a file:// href.
 * Returns null if the link is not a local file link.
 */
function filePathFromHref(href: string): string | null {
  if (!href.startsWith("file://")) return null;
  // file:///Users/... → /Users/...
  // file:///~/... → ~/...
  let path = href.slice("file://".length);
  // file:// URLs have an extra leading / for absolute paths
  if (path.startsWith("/~/")) {
    path = "~" + path.slice(2);
  }
  return decodeURIComponent(path);
}

/**
 * Click handler for the markdown container.
 * Intercepts clicks on file:// links and routes to onOpenFile.
 */
function handleMarkdownClick(e: Event, onOpenFile?: (path: string) => void) {
  if (!onOpenFile) return;
  const target = e.target as HTMLElement;
  const anchor = target.closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href) return;
  const filePath = filePathFromHref(href);
  if (!filePath) return;
  // Intercept — don't open as browser navigation
  e.preventDefault();
  e.stopPropagation();
  onOpenFile(filePath);
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
    // Pre-process: auto-link file paths so they're clickable
    const linked = linkifyFilePaths(content);
    return html`<div
      class="sidebar-markdown"
      @click=${(e: Event) => handleMarkdownClick(e, props.onOpenFile)}
    >${unsafeHTML(toSanitizedMarkdownHtml(linked))}</div>`;
  }

  return html`<pre class="sidebar-plain">${content}</pre>`;
}

function isHtmlContent(props: MarkdownSidebarProps): boolean {
  const mime = normalizeMimeType(props);
  return mime === "text/html" || mime === "application/xhtml+xml";
}

function handleOpenInBrowser(content: string) {
  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function renderMarkdownSidebar(props: MarkdownSidebarProps) {
  const resolvedTitle = props.title?.trim() || "Tool Output";
  const showOpenInBrowser = isHtmlContent(props) && props.content;
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
        <div class="sidebar-header-actions">
          ${showOpenInBrowser
            ? html`<button
                class="btn sidebar-open-browser-btn"
                title="Open in browser tab"
                @click=${() => handleOpenInBrowser(props.content!)}
              >Open in Browser</button>`
            : nothing}
          <button @click=${props.onClose} class="btn" title="Close sidebar">
            ${icons.x}
          </button>
        </div>
      </div>
      <div class="sidebar-content">${renderBody(props)}</div>
    </div>
  `;
}
