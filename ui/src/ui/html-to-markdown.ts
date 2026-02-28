/**
 * HTML-to-Markdown converter for the daily brief WYSIWYG editor.
 *
 * Handles the subset of HTML elements produced by `marked` + DOMPurify:
 * h1-h6, p, strong/b, em/i, a, ul/ol/li (including task-list checkboxes),
 * pre/code, blockquote, hr, br, table, del.
 *
 * The converter walks the DOM tree and emits markdown text. It is intentionally
 * simple and does not try to be a general-purpose converter — only the elements
 * used in daily briefs need to round-trip cleanly.
 */

// ── Public API ──────────────────────────────────────────────────────────

/**
 * Convert an HTML string (or a container element's innerHTML) to markdown.
 */
export function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild as HTMLElement;
  if (!root) {
    return "";
  }
  const ctx: ConvertContext = { listDepth: 0, orderedIndex: [] };
  const raw = convertChildren(root, ctx);
  return cleanUpMarkdown(raw);
}

// ── Internal types ──────────────────────────────────────────────────────

type ConvertContext = {
  listDepth: number;
  orderedIndex: number[];
};

// ── Node conversion ─────────────────────────────────────────────────────

function convertNode(node: Node, ctx: ConvertContext): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  switch (tag) {
    case "h1":
      return `# ${inlineText(el, ctx)}\n\n`;
    case "h2":
      return `## ${inlineText(el, ctx)}\n\n`;
    case "h3":
      return `### ${inlineText(el, ctx)}\n\n`;
    case "h4":
      return `#### ${inlineText(el, ctx)}\n\n`;
    case "h5":
      return `##### ${inlineText(el, ctx)}\n\n`;
    case "h6":
      return `###### ${inlineText(el, ctx)}\n\n`;

    case "p":
      return `${convertChildren(el, ctx)}\n\n`;

    case "br":
      return "\n";

    case "hr":
      return "---\n\n";

    case "strong":
    case "b":
      return `**${convertChildren(el, ctx)}**`;

    case "em":
    case "i":
      return `*${convertChildren(el, ctx)}*`;

    case "del":
      return `~~${convertChildren(el, ctx)}~~`;

    case "a": {
      const href = el.getAttribute("href") ?? "";
      const text = convertChildren(el, ctx);
      if (!href || href === text) {
        return text;
      }
      return `[${text}](${href})`;
    }

    case "code": {
      // If inside a <pre>, handled by the pre case
      if (el.parentElement?.tagName.toLowerCase() === "pre") {
        return el.textContent ?? "";
      }
      const code = el.textContent ?? "";
      return `\`${code}\``;
    }

    case "pre": {
      const codeEl = el.querySelector("code");
      const text = codeEl ? codeEl.textContent ?? "" : el.textContent ?? "";
      // Try to detect language class (e.g. "language-js")
      const langClass = codeEl?.className.match(/language-(\S+)/);
      const lang = langClass ? langClass[1] : "";
      return `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
    }

    case "blockquote": {
      const inner = convertChildren(el, ctx).trim();
      const lines = inner.split("\n");
      return lines.map((line) => `> ${line}`).join("\n") + "\n\n";
    }

    case "ul":
      return convertList(el, ctx, false);

    case "ol":
      return convertList(el, ctx, true);

    case "li":
      return convertListItem(el, ctx);

    case "input": {
      if (el.getAttribute("type") === "checkbox") {
        const checked = (el as HTMLInputElement).checked;
        // No trailing space — marked always emits a space text node after
        // the <input>, so adding one here would produce a double space that
        // confuses Obsidian's checkbox parser.
        return checked ? "[x]" : "[ ]";
      }
      return "";
    }

    case "table":
      return convertTable(el, ctx);

    case "div":
    case "span":
    case "section":
    case "article":
    case "main":
    case "header":
    case "footer":
    case "nav":
    case "aside":
    case "figure":
    case "figcaption":
    case "details":
    case "summary":
      return convertChildren(el, ctx);

    default:
      return convertChildren(el, ctx);
  }
}

function convertChildren(el: HTMLElement, ctx: ConvertContext): string {
  let result = "";
  for (const child of Array.from(el.childNodes)) {
    result += convertNode(child, ctx);
  }
  return result;
}

/**
 * Collect inline text from an element, stripping block-level newlines.
 */
function inlineText(el: HTMLElement, ctx: ConvertContext): string {
  return convertChildren(el, ctx).replace(/\n+/g, " ").trim();
}

// ── Lists ───────────────────────────────────────────────────────────────

function convertList(el: HTMLElement, ctx: ConvertContext, ordered: boolean): string {
  const items = Array.from(el.children).filter(
    (child) => child.tagName.toLowerCase() === "li",
  );
  const indent = "  ".repeat(ctx.listDepth);
  let result = "";

  for (let i = 0; i < items.length; i++) {
    const li = items[i] as HTMLElement;
    const childCtx: ConvertContext = {
      listDepth: ctx.listDepth + 1,
      orderedIndex: [...ctx.orderedIndex, i + 1],
    };
    const prefix = ordered ? `${i + 1}. ` : "- ";
    const content = convertListItem(li, childCtx);
    result += `${indent}${prefix}${content}\n`;
  }

  // Add trailing newline after top-level lists
  if (ctx.listDepth === 0) {
    result += "\n";
  }
  return result;
}

function convertListItem(el: HTMLElement, ctx: ConvertContext): string {
  let result = "";
  for (const child of Array.from(el.childNodes)) {
    const childTag = (child as HTMLElement).tagName?.toLowerCase();
    if (childTag === "ul" || childTag === "ol") {
      // Nested list — add a newline then convert
      result += "\n" + convertNode(child, ctx);
    } else {
      result += convertNode(child, ctx);
    }
  }
  return result.trim();
}

// ── Tables ──────────────────────────────────────────────────────────────

function convertTable(el: HTMLElement, ctx: ConvertContext): string {
  const rows: string[][] = [];
  const headerRow = el.querySelector("thead tr");
  const bodyRows = el.querySelectorAll("tbody tr");

  if (headerRow) {
    const cells = Array.from(headerRow.querySelectorAll("th, td")).map(
      (cell) => inlineText(cell as HTMLElement, ctx),
    );
    rows.push(cells);
  }

  for (const row of Array.from(bodyRows)) {
    const cells = Array.from(row.querySelectorAll("td, th")).map(
      (cell) => inlineText(cell as HTMLElement, ctx),
    );
    rows.push(cells);
  }

  // If no thead, treat first row from <table> direct <tr> as header
  if (rows.length === 0) {
    const allRows = el.querySelectorAll("tr");
    for (const row of Array.from(allRows)) {
      const cells = Array.from(row.querySelectorAll("td, th")).map(
        (cell) => inlineText(cell as HTMLElement, ctx),
      );
      rows.push(cells);
    }
  }

  if (rows.length === 0) {
    return "";
  }

  // Determine column widths
  const colCount = Math.max(...rows.map((r) => r.length));
  const colWidths: number[] = [];
  for (let c = 0; c < colCount; c++) {
    colWidths[c] = Math.max(3, ...rows.map((r) => (r[c] ?? "").length));
  }

  // Build table markdown
  let result = "";
  const formatRow = (cells: string[]) => {
    const padded = colWidths.map((w, i) => (cells[i] ?? "").padEnd(w));
    return `| ${padded.join(" | ")} |`;
  };

  // Header row
  result += formatRow(rows[0]) + "\n";
  // Separator
  result += `| ${colWidths.map((w) => "-".repeat(w)).join(" | ")} |\n`;
  // Body rows
  for (let i = 1; i < rows.length; i++) {
    result += formatRow(rows[i]) + "\n";
  }

  return result + "\n";
}

// ── Cleanup ─────────────────────────────────────────────────────────────

/**
 * Clean up markdown output: collapse excessive blank lines,
 * trim leading/trailing whitespace, and ensure a trailing newline.
 */
function cleanUpMarkdown(raw: string): string {
  let md = raw;
  // Replace non-breaking spaces (U+00A0) with regular spaces —
  // contenteditable and paste events inject these, breaking marked's
  // task-list checkbox detection (which requires ASCII space after [ ])
  md = md.replace(/\u00a0/g, " ");
  // Collapse 3+ newlines to 2
  md = md.replace(/\n{3,}/g, "\n\n");
  // Trim
  md = md.trim();
  // Ensure trailing newline
  if (md && !md.endsWith("\n")) {
    md += "\n";
  }
  return md;
}
