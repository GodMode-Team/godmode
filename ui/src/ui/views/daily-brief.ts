import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { htmlToMarkdown } from "../html-to-markdown.js";
import { toEditableMarkdownHtml } from "../markdown.js";
import { extractOpenablePathFromEventTarget } from "../openable-file-path.js";

// ===== Types =====

export type DailyBriefData = {
  date: string; // "2026-02-04"
  content: string; // Raw markdown
  summary: {
    readiness: number | null;
    readinessMode: string | null;
    weather: { temp: number; condition: string; icon: string } | null;
    tasks: { total: number; completed: number };
  };
  sections: string[];
  updatedAt: string; // ISO timestamp
};

export type DailyBriefProps = {
  connected: boolean;
  data: DailyBriefData | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onOpenInObsidian?: () => void;
  onSaveBrief?: (content: string) => void;
  onToggleCheckbox?: (index: number, checked: boolean) => void;
  onOpenFile?: (path: string) => void;
};

// ===== Helper Functions =====

/**
 * Normalize content that may contain literal `\n` characters (two-char sequences)
 * instead of real newlines. This happens when cron jobs or AI agents write
 * JSON-escaped content directly to the markdown file.
 */
function normalizeBriefNewlines(content: string): string {
  // Only fix if the content looks like it has literal \n (single-line blob)
  if (content.includes("\n") && content.indexOf("\n") < content.length - 1) {
    // Already has real newlines — leave it alone
    return content;
  }
  // Replace literal two-char \n sequences with real newlines
  return content.replace(/\\n/g, "\n");
}

function formatUpdatedAt(isoStr: string): string {
  const date = new Date(isoStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function buildObsidianUrl(date: string): string {
  const vault = "VAULT";
  const file = encodeURIComponent(`01-Daily/${date}`);
  return `obsidian://open?vault=${vault}&file=${file}`;
}

// ===== Auto-save =====

let _saveTimer: ReturnType<typeof setTimeout> | null = null;
let _lastSavedContent: string | null = null;

function debounceSave(content: string, onSave: (c: string) => void, delayMs = 1500) {
  if (_saveTimer) {
    clearTimeout(_saveTimer);
  }
  _saveTimer = setTimeout(() => {
    if (content !== _lastSavedContent) {
      _lastSavedContent = content;
      onSave(content);
    }
  }, delayMs);
}

function flushSave(content: string, onSave: (c: string) => void) {
  if (_saveTimer) {
    clearTimeout(_saveTimer);
  }
  if (content !== _lastSavedContent) {
    _lastSavedContent = content;
    onSave(content);
  }
}

// ===== Contenteditable helpers =====

/**
 * Get the current markdown content from the contenteditable container
 * by converting its innerHTML back to markdown.
 *
 * IMPORTANT: Before reading innerHTML, sync every checkbox's `.checked`
 * DOM property to its HTML `checked` attribute.  Browsers toggle the
 * property on click but do NOT update the attribute, and innerHTML
 * serialises attributes — so without this step the serialised HTML
 * would contain stale checkbox state and the save would silently
 * revert user toggles.
 */
function getEditableMarkdown(container: HTMLElement): string {
  for (const cb of container.querySelectorAll('input[type="checkbox"]')) {
    const input = cb as HTMLInputElement;
    if (input.checked) {
      input.setAttribute("checked", "");
    } else {
      input.removeAttribute("checked");
    }
  }
  return htmlToMarkdown(container.innerHTML);
}

// ===== Main Render Function =====

export function renderDailyBrief(props: DailyBriefProps) {
  const {
    data,
    loading,
    error,
    onRefresh,
    onOpenInObsidian,
    onSaveBrief,
    onToggleCheckbox,
    onOpenFile,
  } = props;

  if (loading) {
    return html`
      <div class="my-day-card brief-section">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">\uD83D\uDCCA</span>
            <span>DAILY BRIEF</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="brief-loading">
            <div class="spinner"></div>
            <span>Loading brief...</span>
          </div>
        </div>
      </div>
    `;
  }

  if (error) {
    return html`
      <div class="my-day-card brief-section">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">\uD83D\uDCCA</span>
            <span>DAILY BRIEF</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="brief-error">
            <span class="error-icon">\u26A0\uFE0F</span>
            <span>${error}</span>
            ${
              onRefresh
                ? html`<button class="retry-button" @click=${onRefresh}>Retry</button>`
                : nothing
            }
          </div>
        </div>
      </div>
    `;
  }

  if (!data || !data.content) {
    return html`
      <div class="my-day-card brief-section">
        <div class="my-day-card-header">
          <div class="my-day-card-title">
            <span class="my-day-card-icon">\uD83D\uDCCA</span>
            <span>DAILY BRIEF</span>
          </div>
        </div>
        <div class="my-day-card-content">
          <div class="brief-empty">
            <span class="empty-icon">\uD83D\uDCDD</span>
            <span>No brief available for today</span>
            <span class="empty-hint">Brief compiles at 5:00 AM</span>
          </div>
        </div>
      </div>
    `;
  }

  // Sync saved-content tracker when data changes (e.g. after refresh)
  if (_lastSavedContent === null) {
    _lastSavedContent = data.content;
  }

  // --- Always-live contenteditable: input handler with auto-save ---
  const handleInput = (e: Event) => {
    const container = e.currentTarget as HTMLElement;
    if (onSaveBrief) {
      const md = getEditableMarkdown(container);
      debounceSave(md, onSaveBrief);
    }
  };

  // --- Keyboard shortcuts ---
  const handleKeydown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + S = save immediately
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      const container = e.currentTarget as HTMLElement;
      if (onSaveBrief) {
        const md = getEditableMarkdown(container);
        flushSave(md, onSaveBrief);
      }
    }

    // Ctrl/Cmd + L = toggle checkbox on current line (Obsidian-style)
    if ((e.ctrlKey || e.metaKey) && e.key === "l") {
      e.preventDefault();
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const node = sel.focusNode;
      const li = node instanceof HTMLElement
        ? node.closest("li")
        : node?.parentElement?.closest("li");
      if (li) {
        const existingCb = li.querySelector('input[type="checkbox"]');
        if (existingCb) {
          // Remove checkbox (toggle off)
          existingCb.nextSibling?.nodeType === Node.TEXT_NODE &&
            existingCb.nextSibling.textContent === " " &&
            existingCb.nextSibling.remove();
          existingCb.remove();
        } else {
          // Add checkbox (toggle on)
          const cb = document.createElement("input");
          cb.type = "checkbox";
          li.insertBefore(document.createTextNode(" "), li.firstChild);
          li.insertBefore(cb, li.firstChild);
        }
        // Trigger save
        const container = e.currentTarget as HTMLElement;
        if (onSaveBrief) {
          const md = getEditableMarkdown(container);
          debounceSave(md, onSaveBrief);
        }
      }
    }

    // Enter in a checkbox list = auto-continue with checkbox
    if (e.key === "Enter" && !e.shiftKey) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const node = sel.focusNode;
      const li = node instanceof HTMLElement
        ? node.closest("li")
        : node?.parentElement?.closest("li");
      if (li && li.querySelector('input[type="checkbox"]')) {
        // Let browser create the new <li>, then inject a checkbox into it
        setTimeout(() => {
          const newSel = window.getSelection();
          if (!newSel || newSel.rangeCount === 0) return;
          const newNode = newSel.focusNode;
          const newLi = newNode instanceof HTMLElement
            ? newNode.closest("li")
            : newNode?.parentElement?.closest("li");
          if (newLi && newLi !== li && !newLi.querySelector('input[type="checkbox"]')) {
            const cb = document.createElement("input");
            cb.type = "checkbox";
            newLi.insertBefore(cb, newLi.firstChild);
            newLi.insertBefore(document.createTextNode(" "), cb.nextSibling);
            // Place cursor after the checkbox + space
            const range = document.createRange();
            range.setStartAfter(cb.nextSibling!);
            range.collapse(true);
            newSel.removeAllRanges();
            newSel.addRange(range);
          }
        }, 0);
      }
    }
  };

  // --- Handle clicks: checkboxes + file links ---
  const handleClick = (e: Event) => {
    const target = e.target as HTMLElement;

    // Checkbox toggle — use surgical server-side read-modify-write so we
    // never overwrite the full file from stale in-memory HTML.  This keeps
    // Obsidian's file-watcher happy and avoids clobbering external edits.
    if (target.tagName === "INPUT" && target.getAttribute("type") === "checkbox") {
      const input = target as HTMLInputElement;
      const container = e.currentTarget as HTMLElement;
      if (onToggleCheckbox && container) {
        // Count which checkbox this is (0-indexed)
        const allCheckboxes = Array.from(
          container.querySelectorAll('input[type="checkbox"]'),
        );
        const index = allCheckboxes.indexOf(input);
        if (index >= 0) {
          onToggleCheckbox(index, input.checked);
        }
      }
      return;
    }

    // File links
    const localPath = extractOpenablePathFromEventTarget(e.target);
    if (localPath && onOpenFile) {
      e.preventDefault();
      void onOpenFile(localPath);
    }
  };

  const editableHtml = toEditableMarkdownHtml(normalizeBriefNewlines(data.content));

  return html`
    <div class="my-day-card brief-section brief-editor">
      <div class="my-day-card-header">
        <div class="my-day-card-title">
          <span class="my-day-card-icon">\uD83D\uDCCA</span>
          <span>DAILY BRIEF</span>
        </div>
        <div class="brief-header-actions">
          <span class="brief-updated">${formatUpdatedAt(data.updatedAt)}</span>
          ${
            onOpenInObsidian
              ? html`
                <a
                  href="${buildObsidianUrl(data.date)}"
                  class="brief-obsidian-link"
                  title="Open in Obsidian"
                  @click=${(e: Event) => {
                    e.preventDefault();
                    onOpenInObsidian();
                  }}
                >
                  <span class="obsidian-icon">\uD83D\uDCD3</span>
                </a>
              `
              : nothing
          }
          ${
            onRefresh
              ? html`
                <button class="brief-refresh-btn" @click=${onRefresh} title="Refresh">
                  \uD83D\uDD04
                </button>
              `
              : nothing
          }
        </div>
      </div>

      <div class="my-day-card-content">
        <div class="brief-content brief-content--live">
          <div
            class="brief-rendered brief-editable"
            contenteditable="true"
            spellcheck="false"
            @input=${handleInput}
            @keydown=${handleKeydown}
            @click=${handleClick}
          >${unsafeHTML(editableHtml)}</div>
        </div>
      </div>
    </div>
  `;
}
