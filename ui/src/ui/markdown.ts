import DOMPurify from "dompurify";
import { marked } from "marked";
import { truncateText } from "./format";

marked.setOptions({
  gfm: true,
  breaks: true,
  mangle: false,
});

// ── File-path auto-linking ─────────────────────────────────────────────
// Detects absolute file paths in markdown text (outside code blocks)
// and wraps them in clickable links with a file:// scheme.

const FILE_EXT_RE = /\.(html?|css|js|ts|tsx|jsx|json|md|txt|csv|py|sh|yaml|yml|xml|svg|png|jpe?g|gif|webp|pdf|log)$/i;

// Match absolute paths like /Users/... or ~/... with a file extension.
// Negative lookbehind avoids matching paths already inside markdown links.
const FILE_PATH_RE = /(?<![(\[`])(?:~\/|\/(?:Users|home|tmp|var|opt|etc|godmode)\/)[\w/.+@-]+\.\w+/g;

/**
 * Pre-process markdown to wrap bare file paths in clickable links.
 * Skips fenced code blocks (``` ... ```) and inline code (` ... `).
 */
export function linkifyFilePaths(markdown: string): string {
  // Split on fenced code blocks to avoid linkifying inside them
  const parts = markdown.split(/(```[\s\S]*?```|`[^`\n]+`)/g);
  for (let i = 0; i < parts.length; i++) {
    // Odd indices are code blocks/inline code — skip them
    if (i % 2 !== 0) continue;
    parts[i] = parts[i].replace(FILE_PATH_RE, (match) => {
      if (!FILE_EXT_RE.test(match)) return match;
      // Expand ~ to a placeholder that the click handler resolves
      const href = match.startsWith("~/")
        ? `file:///~/${match.slice(2)}`
        : `file://${match}`;
      const basename = match.split("/").pop() ?? match;
      return `[${basename}](${href})`;
    });
  }
  return parts.join("");
}

const allowedTags = [
  "a",
  "article",
  "aside",
  "b",
  "blockquote",
  "br",
  "caption",
  "col",
  "colgroup",
  "code",
  "div",
  "del",
  "details",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "img",
  "i",
  "input",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "span",
  "strong",
  "sub",
  "sup",
  "summary",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
];

const allowedAttrs = [
  "alt",
  "checked",
  "class",
  "decoding",
  "disabled",
  "height",
  "href",
  "loading",
  "open",
  "rel",
  "src",
  "start",
  "target",
  "title",
  "type",
  "width",
  "style",
];

// DOMPurify URI regex — default + file: protocol for local file links
const ALLOWED_URI_RE =
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

let hooksInstalled = false;
const MARKDOWN_CHAR_LIMIT = 140_000;
const MARKDOWN_PARSE_LIMIT = 140_000;
const MARKDOWN_CACHE_LIMIT = 200;
const MARKDOWN_CACHE_MAX_CHARS = 50_000;
const markdownCache = new Map<string, string>();

function getCachedMarkdown(key: string): string | null {
  const cached = markdownCache.get(key);
  if (cached === undefined) {
    return null;
  }
  markdownCache.delete(key);
  markdownCache.set(key, cached);
  return cached;
}

function setCachedMarkdown(key: string, value: string) {
  markdownCache.set(key, value);
  if (markdownCache.size <= MARKDOWN_CACHE_LIMIT) {
    return;
  }
  const oldest = markdownCache.keys().next().value;
  if (oldest) {
    markdownCache.delete(oldest);
  }
}

function installHooks() {
  if (hooksInstalled) {
    return;
  }
  hooksInstalled = true;

  // SECURITY: Restrict <input> to checkbox only (prevent fake form fields)
  DOMPurify.addHook("uponSanitizeElement", (node) => {
    if (
      node instanceof HTMLInputElement &&
      node.getAttribute("type") !== "checkbox"
    ) {
      node.remove();
    }
  });

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (!(node instanceof HTMLAnchorElement)) {
      return;
    }
    const href = node.getAttribute("href");
    if (!href) {
      return;
    }
    node.setAttribute("rel", "noreferrer noopener");
    node.setAttribute("target", "_blank");
  });
}

export function toSanitizedMarkdownHtml(markdown: string): string {
  const input = markdown.trim();
  if (!input) {
    return "";
  }
  installHooks();
  if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
    const cached = getCachedMarkdown(input);
    if (cached !== null) {
      return cached;
    }
  }
  const truncated = truncateText(input, MARKDOWN_CHAR_LIMIT);
  const suffix = truncated.truncated
    ? `\n\n… truncated (${truncated.total} chars, showing first ${truncated.text.length}).`
    : "";
  if (truncated.text.length > MARKDOWN_PARSE_LIMIT) {
    const escaped = escapeHtml(`${truncated.text}${suffix}`);
    const html = `<pre class="code-block">${escaped}</pre>`;
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttrs,
      ALLOWED_URI_REGEXP: ALLOWED_URI_RE,
    });
    if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
      setCachedMarkdown(input, sanitized);
    }
    return sanitized;
  }
  const linked = linkifyFilePaths(`${truncated.text}${suffix}`);
  const rendered = marked.parse(linked) as string;
  const sanitized = DOMPurify.sanitize(rendered, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs,
    ALLOWED_URI_REGEXP: ALLOWED_URI_RE,
  });
  if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
    setCachedMarkdown(input, sanitized);
  }
  return sanitized;
}

/**
 * Render markdown to sanitized HTML suitable for contenteditable editing.
 * Unlike toSanitizedMarkdownHtml, this version does NOT cache and leaves
 * checkbox inputs enabled (no `disabled` attr) so users can toggle them.
 */
export function toEditableMarkdownHtml(markdown: string): string {
  const input = markdown.trim();
  if (!input) {
    return "";
  }
  installHooks();
  const rendered = marked.parse(input) as string;
  const sanitized = DOMPurify.sanitize(rendered, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs,
    ALLOWED_URI_REGEXP: ALLOWED_URI_RE,
  });
  // Remove disabled attr from checkboxes so they are interactive
  return sanitized.replace(/<input([^>]*)\bdisabled\b([^>]*)>/g, "<input$1$2>");
}

export function sanitizeHtmlFragment(markup: string): string {
  const input = markup.trim();
  if (!input) {
    return "";
  }
  installHooks();
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs,
    FORBID_TAGS: ["base", "iframe", "link", "meta", "object", "script"],
  });
}

// ── Dashboard-specific sanitizer ──────────────────────────────────────
// Allows <style> blocks (auto-scoped to .dashboards-content) and SVG
// elements so agent-generated dashboards render with full visual fidelity.

const dashboardTags = [
  ...allowedTags,
  // SVG elements
  "svg",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
  "g",
  "defs",
  "linearGradient",
  "radialGradient",
  "stop",
  "clipPath",
  "mask",
  "use",
  "symbol",
  "marker",
  "pattern",
  "animate",
  "animateTransform",
];

const dashboardAttrs = [
  ...allowedAttrs,
  // SVG attributes
  "viewBox",
  "xmlns",
  "preserveAspectRatio",
  "d",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x",
  "x1",
  "x2",
  "y",
  "y1",
  "y2",
  "dx",
  "dy",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "transform",
  "opacity",
  "points",
  "text-anchor",
  "dominant-baseline",
  "font-size",
  "font-weight",
  "offset",
  "stop-color",
  "stop-opacity",
  "gradientUnits",
  "gradientTransform",
  "marker-start",
  "marker-mid",
  "marker-end",
  "clip-path",
  "patternUnits",
  "patternTransform",
  "rotate",
  "textLength",
  "lengthAdjust",
  "values",
  "dur",
  "repeatCount",
  "attributeName",
  "from",
  "to",
  "begin",
  "calcMode",
  "keySplines",
  "keyTimes",
];

export function sanitizeDashboardHtml(markup: string): string {
  const input = markup.trim();
  if (!input) {
    return "";
  }
  installHooks();

  // Strategy: extract CSS *before* DOMPurify touches it, sanitize only
  // the HTML elements, then scope + re-inject the CSS ourselves.
  // DOMPurify mangles <style> content — we handle CSS separately.
  const { styles, html: bodyHtml } = extractDashboardParts(input);

  // Sanitize only the HTML (no <style> tags to worry about)
  const sanitized = DOMPurify.sanitize(bodyHtml, {
    ALLOWED_TAGS: dashboardTags,
    ALLOWED_ATTR: dashboardAttrs,
    FORBID_TAGS: ["base", "iframe", "link", "meta", "object", "script", "style"],
  });

  // Scope extracted CSS to inner render wrapper (not .dashboards-content
  // which has its own app-level styles that would conflict)
  const scope = ".dashboard-render";
  const scopedStyles = styles
    .map((css) => `<style>${scopeCss(css, scope)}</style>`)
    .join("\n");

  return scopedStyles + sanitized;
}

function extractDashboardParts(markup: string): { styles: string[]; html: string } {
  const styles: string[] = [];

  // Extract ALL <style> blocks from anywhere in the document
  const withoutStyles = markup.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css: string) => {
    styles.push(css);
    return "";
  });

  // Extract body content if present, otherwise use entire content
  const bodyMatch = withoutStyles.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : withoutStyles;

  // Strip document wrapper tags
  const html = content
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?head[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]*\/?>/gi, "")
    .replace(/<link[^>]*\/?>/gi, "");

  return { styles, html };
}

// ── CSS Scoping ───────────────────────────────────────────────────────

function findBlockEnd(text: string, start: number): number {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return text.length;
}

function scopeCss(css: string, scope: string): string {
  // SECURITY: Strip dangerous CSS constructs
  // Strip @import (no external resource loading)
  let text = css.replace(/@import\b[^;]*;/gi, "");
  // Strip IE CSS expressions (execute JS)
  text = text.replace(/expression\s*\(/gi, "/* blocked */(");
  // Strip IE HTC behaviors
  text = text.replace(/behavior\s*:/gi, "/* blocked */:");
  // Strip Firefox XBL bindings
  text = text.replace(/-moz-binding\s*:/gi, "/* blocked */:");

  const output: string[] = [];
  let i = 0;

  while (i < text.length) {
    // Skip whitespace
    if (/\s/.test(text[i])) {
      output.push(text[i]);
      i++;
      continue;
    }

    // Skip CSS comments
    if (text[i] === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      const to = end === -1 ? text.length : end + 2;
      output.push(text.slice(i, to));
      i = to;
      continue;
    }

    // Closing brace from wrapper (@media etc.)
    if (text[i] === "}") {
      output.push("}");
      i++;
      continue;
    }

    // @keyframes — pass entire block through unscoped
    if (/^@(-webkit-)?keyframes\s/.test(text.slice(i, i + 30))) {
      const end = findBlockEnd(text, i);
      output.push(text.slice(i, end));
      i = end;
      continue;
    }

    // @media / @supports / @container — pass header, inner rules scoped on next iterations
    if (/^@(media|supports|container|layer)\b/.test(text.slice(i, i + 20))) {
      const brace = text.indexOf("{", i);
      if (brace === -1) {
        output.push(text.slice(i));
        break;
      }
      output.push(text.slice(i, brace + 1));
      i = brace + 1;
      continue;
    }

    // Regular CSS rule: selectors { declarations }
    const brace = text.indexOf("{", i);
    if (brace === -1) {
      output.push(text.slice(i));
      break;
    }

    const selectorText = text.slice(i, brace).trim();
    const close = text.indexOf("}", brace);
    if (close === -1) {
      output.push(text.slice(i));
      break;
    }

    const declarations = text.slice(brace + 1, close);

    // Scope each comma-separated selector
    const scoped = selectorText
      .split(",")
      .map((s) => {
        const sel = s.trim();
        if (!sel) return s;
        // Universal selector: scope to container and all descendants
        if (sel === "*") return `${scope}, ${scope} *`;
        // Root-level selectors: replace with container scope
        if (/^(html|body|:root)$/i.test(sel)) return scope;
        // Strip body/html/:root prefix from compound selectors
        const stripped = sel.replace(/^(html|body|:root)\s+/i, "");
        return `${scope} ${stripped}`;
      })
      .join(", ");

    output.push(`${scoped} {${declarations}}`);
    i = close + 1;
  }

  return output.join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
