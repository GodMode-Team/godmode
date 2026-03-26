/**
 * <file-viewer> — Universal file viewer for the sidebar.
 *
 * Renders ANY file type the user might want to view:
 * - Images (jpg, png, gif, webp, svg, avif, heic, bmp)
 * - Video (mp4, webm, mov, avi)
 * - Audio (mp3, wav, m4a, ogg, flac)
 * - HTML (sandboxed iframe, live preview)
 * - Markdown (rendered with syntax highlighting)
 * - Code (syntax highlighted with line numbers)
 * - PDF (embedded viewer)
 * - SVG (inline render)
 * - CSV/TSV (table preview)
 * - JSON (formatted tree)
 * - Plain text (monospace with line numbers)
 */

import { html, nothing, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { linkifyFilePaths, sanitizeHtmlFragment, toSanitizedMarkdownHtml } from "../markdown.js";

// ── File type detection ──────────────────────────────────────────────────────

const EXT_GROUPS: Record<string, Set<string>> = {
  image: new Set(["avif", "bmp", "gif", "heic", "heif", "ico", "jpeg", "jpg", "png", "svg", "svgz", "tiff", "webp"]),
  video: new Set(["mp4", "webm", "mov", "avi", "mkv", "m4v", "ogv"]),
  audio: new Set(["mp3", "wav", "m4a", "ogg", "flac", "aac", "wma", "opus"]),
  markdown: new Set(["md", "markdown", "mdx"]),
  html: new Set(["htm", "html", "xhtml"]),
  pdf: new Set(["pdf"]),
  csv: new Set(["csv", "tsv"]),
  json: new Set(["json", "json5", "jsonl", "geojson"]),
  code: new Set([
    "js", "jsx", "ts", "tsx", "py", "rb", "go", "rs", "java", "c", "cpp", "h", "hpp",
    "cs", "php", "swift", "kt", "scala", "lua", "r", "sql", "sh", "bash", "zsh",
    "fish", "ps1", "bat", "cmd", "yaml", "yml", "toml", "ini", "cfg", "conf",
    "xml", "xsl", "dtd", "wsdl", "graphql", "gql", "proto", "tf", "hcl",
    "dockerfile", "makefile", "cmake", "gradle", "vue", "svelte", "astro",
  ]),
  text: new Set(["txt", "text", "log", "rtf", "env", "gitignore", "editorconfig"]),
};

export type FileViewerContentType =
  | "image" | "video" | "audio" | "markdown" | "html" | "pdf"
  | "csv" | "json" | "code" | "text" | "svg" | "unknown";

export function detectContentType(filePath: string | null, mimeType: string | null, content: string | null): FileViewerContentType {
  const ext = extractExt(filePath);
  const mime = (mimeType ?? "").split(";")[0].trim().toLowerCase();

  // MIME-based detection first
  if (mime.startsWith("image/")) return ext === "svg" || ext === "svgz" ? "svg" : "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (mime === "text/html" || mime === "application/xhtml+xml") return "html";
  if (mime === "text/markdown" || mime === "text/x-markdown") return "markdown";
  if (mime === "text/csv" || mime === "text/tab-separated-values") return "csv";
  if (mime === "application/json" || mime.endsWith("+json")) return "json";

  // Extension-based detection
  if (ext) {
    if (ext === "svg" || ext === "svgz") return "svg";
    for (const [type, exts] of Object.entries(EXT_GROUPS)) {
      if (exts.has(ext)) return type as FileViewerContentType;
    }
  }

  // Content sniffing
  if (content) {
    const trimmed = content.trim();
    if (trimmed.startsWith("data:image/")) return "image";
    if (trimmed.startsWith("data:video/")) return "video";
    if (trimmed.startsWith("data:audio/")) return "audio";
    if (trimmed.startsWith("data:application/pdf")) return "pdf";
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) return "html";
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try { JSON.parse(trimmed); return "json"; } catch { /* not json */ }
    }
    if (trimmed.startsWith("<svg")) return "svg";
  }

  return ext ? "code" : "text"; // Default: treat as code if has extension, else text
}

function extractExt(filePath: string | null): string {
  if (!filePath) return "";
  const base = filePath.replace(/\\/g, "/").split("/").pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

// ── Language label for code files ────────────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  js: "JavaScript", jsx: "JSX", ts: "TypeScript", tsx: "TSX",
  py: "Python", rb: "Ruby", go: "Go", rs: "Rust", java: "Java",
  c: "C", cpp: "C++", cs: "C#", php: "PHP", swift: "Swift",
  kt: "Kotlin", scala: "Scala", lua: "Lua", r: "R", sql: "SQL",
  sh: "Shell", bash: "Bash", zsh: "Zsh", ps1: "PowerShell",
  yaml: "YAML", yml: "YAML", toml: "TOML", json: "JSON",
  xml: "XML", html: "HTML", css: "CSS", scss: "SCSS", less: "LESS",
  graphql: "GraphQL", proto: "Protobuf", tf: "Terraform",
  dockerfile: "Dockerfile", makefile: "Makefile",
  vue: "Vue", svelte: "Svelte", astro: "Astro", md: "Markdown",
};

function getLangLabel(filePath: string | null): string {
  const ext = extractExt(filePath);
  return LANG_LABELS[ext] || ext.toUpperCase() || "Text";
}

// ── SVG Icons (clean, no emoji) ──────────────────────────────────────────────

export const FILE_TYPE_ICONS: Record<string, TemplateResult> = {
  image: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  video: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/></svg>`,
  audio: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  markdown: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8v8l3-3 3 3V8"/><path d="m17 12-2-2v4"/></svg>`,
  html: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/><path d="m14 4-4 16"/></svg>`,
  pdf: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M10 13h4"/><path d="M10 17h4"/></svg>`,
  csv: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
  json: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>`,
  code: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/></svg>`,
  text: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>`,
  svg: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M3 12h4M17 12h4M12 3v4M12 17v4"/></svg>`,
  unknown: html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`,
};

export function getFileTypeIcon(type: FileViewerContentType): TemplateResult {
  return FILE_TYPE_ICONS[type] || FILE_TYPE_ICONS.unknown;
}

// ── Content renderers ────────────────────────────────────────────────────────

export type FileViewerProps = {
  content: string | null;
  error: string | null;
  filePath: string | null;
  mimeType: string | null;
  title: string | null;
  onOpenFile?: (filePath: string) => void;
};

function renderImageContent(content: string, filePath: string | null): TemplateResult {
  const src = content.trim().startsWith("data:") ? content.trim() : content;
  const alt = filePath ? filePath.split("/").pop() ?? "Image" : "Image";
  return html`
    <div class="fv-image-wrap">
      <img class="fv-image" src=${src} alt=${alt} loading="lazy"
        @error=${(e: Event) => { (e.target as HTMLElement).classList.add("fv-image--broken"); }} />
    </div>
  `;
}

function renderVideoContent(content: string, filePath: string | null, mimeType: string | null): TemplateResult {
  const ext = extractExt(filePath);
  const type = mimeType || `video/${ext === "mov" ? "quicktime" : ext || "mp4"}`;
  const src = content.trim().startsWith("data:") ? content.trim() : content;
  return html`
    <div class="fv-video-wrap">
      <video class="fv-video" controls preload="metadata">
        <source src=${src} type=${type} />
        Your browser does not support this video format.
      </video>
    </div>
  `;
}

function renderAudioContent(content: string, filePath: string | null, mimeType: string | null): TemplateResult {
  const ext = extractExt(filePath);
  const type = mimeType || `audio/${ext || "mpeg"}`;
  const src = content.trim().startsWith("data:") ? content.trim() : content;
  const name = filePath ? filePath.split("/").pop() ?? "Audio" : "Audio";
  return html`
    <div class="fv-audio-wrap">
      <div class="fv-audio-icon">${FILE_TYPE_ICONS.audio}</div>
      <div class="fv-audio-name">${name}</div>
      <audio class="fv-audio" controls preload="metadata">
        <source src=${src} type=${type} />
        Your browser does not support this audio format.
      </audio>
    </div>
  `;
}

function renderSvgContent(content: string): TemplateResult {
  // Sanitize and render SVG inline
  const sanitized = sanitizeHtmlFragment(content);
  return html`
    <div class="fv-svg-wrap">
      ${unsafeHTML(sanitized)}
    </div>
  `;
}

function renderHtmlContent(content: string): TemplateResult {
  // Uses srcdoc instead of Blob URLs so Lit's dirty-checking skips the DOM
  // update when content hasn't changed (prevents iframe reload on unrelated re-renders).
  return html`
    <iframe
      class="fv-html-frame"
      .srcdoc=${content}
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      @load=${(e: Event) => {
        const iframe = e.target as HTMLIFrameElement;
        try {
          const h = iframe.contentDocument?.documentElement?.scrollHeight;
          if (h && h > 200) iframe.style.height = `${Math.min(h, 2000)}px`;
        } catch { /* cross-origin */ }
      }}
    ></iframe>
  `;
}

function renderPdfContent(content: string): TemplateResult {
  if (content.trim().startsWith("data:application/pdf")) {
    return html`<iframe class="fv-pdf-frame" src=${content.trim()} type="application/pdf"></iframe>`;
  }
  return html`<div class="fv-fallback"><span class="fv-fallback-icon">${FILE_TYPE_ICONS.pdf}</span><p>PDF preview unavailable. Use "Open in Browser" to view.</p></div>`;
}

function renderMarkdownContent(content: string, onOpenFile?: (path: string) => void): TemplateResult {
  const linked = linkifyFilePaths(content);
  return html`
    <div class="fv-markdown" @click=${(e: Event) => {
      if (!onOpenFile) return;
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("file://")) return;
      e.preventDefault();
      e.stopPropagation();
      let fp = href.slice(7);
      if (fp.startsWith("/~/")) fp = "~" + fp.slice(2);
      try { fp = decodeURIComponent(fp); } catch { /* keep */ }
      onOpenFile(fp);
    }}>
      ${unsafeHTML(toSanitizedMarkdownHtml(linked))}
    </div>
  `;
}

function renderCsvContent(content: string): TemplateResult {
  const lines = content.trim().split("\n").slice(0, 200);
  if (lines.length === 0) return html`<div class="fv-fallback">Empty file</div>`;

  const delimiter = content.includes("\t") ? "\t" : ",";
  const parseRow = (line: string) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue; }
      if (char === delimiter && !inQuotes) { cells.push(current.trim()); current = ""; continue; }
      current += char;
    }
    cells.push(current.trim());
    return cells;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);

  return html`
    <div class="fv-table-wrap">
      <table class="fv-table">
        <thead>
          <tr>${headers.map((h) => html`<th>${h}</th>`)}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => html`<tr>${row.map((cell) => html`<td>${cell}</td>`)}</tr>`)}
        </tbody>
      </table>
      ${lines.length >= 200 ? html`<div class="fv-table-overflow">Showing first 200 rows</div>` : nothing}
    </div>
  `;
}

function renderJsonContent(content: string): TemplateResult {
  let formatted: string;
  try {
    const parsed = JSON.parse(content);
    formatted = JSON.stringify(parsed, null, 2);
  } catch {
    formatted = content;
  }
  return renderCodeContent(formatted, "json");
}

function renderCodeContent(content: string, lang?: string): TemplateResult {
  const lines = content.split("\n");
  const digits = String(lines.length).length;
  return html`
    <div class="fv-code-wrap">
      ${lang ? html`<div class="fv-code-lang">${LANG_LABELS[lang] || lang.toUpperCase()}</div>` : nothing}
      <pre class="fv-code"><code>${lines.map((line, i) => {
        const num = String(i + 1).padStart(digits, " ");
        return html`<span class="fv-line"><span class="fv-line-num">${num}</span><span class="fv-line-text">${line}\n</span></span>`;
      })}</code></pre>
    </div>
  `;
}

function renderTextContent(content: string): TemplateResult {
  return renderCodeContent(content, "");
}

// ── Main render ──────────────────────────────────────────────────────────────

export function renderFileViewerBody(props: FileViewerProps): TemplateResult {
  if (props.error) {
    return html`<div class="fv-error"><div class="fv-error-icon">⚠</div><div class="fv-error-text">${props.error}</div></div>`;
  }
  if (!props.content) {
    return html`<div class="fv-empty">No content available</div>`;
  }

  const type = detectContentType(props.filePath, props.mimeType, props.content);
  const content = props.content;

  switch (type) {
    case "image": return renderImageContent(content, props.filePath);
    case "svg": return renderSvgContent(content);
    case "video": return renderVideoContent(content, props.filePath, props.mimeType);
    case "audio": return renderAudioContent(content, props.filePath, props.mimeType);
    case "html": return renderHtmlContent(content);
    case "pdf": return renderPdfContent(content);
    case "markdown": return renderMarkdownContent(content, props.onOpenFile);
    case "csv": return renderCsvContent(content);
    case "json": return renderJsonContent(content);
    case "code": return renderCodeContent(content, extractExt(props.filePath) || undefined);
    case "text": return renderTextContent(content);
    default: return renderTextContent(content);
  }
}

/**
 * Utility: get a human-readable type label for display.
 */
export function getTypeLabel(filePath: string | null, mimeType: string | null, content: string | null): string {
  const type = detectContentType(filePath, mimeType, content);
  const ext = extractExt(filePath);
  const labels: Record<FileViewerContentType, string> = {
    image: LANG_LABELS[ext] || ext.toUpperCase() || "Image",
    video: "Video",
    audio: "Audio",
    markdown: "Markdown",
    html: "HTML Document",
    pdf: "PDF",
    csv: ext === "tsv" ? "TSV Data" : "CSV Data",
    json: "JSON",
    code: getLangLabel(filePath),
    text: "Text",
    svg: "SVG",
    unknown: "File",
  };
  return labels[type] || "File";
}
