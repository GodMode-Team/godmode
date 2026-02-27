import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { toSanitizedMarkdownHtml } from "../markdown.js";
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
  onOpenFile?: (path: string) => void;
  editing?: boolean;
  onEditStart?: () => void;
  onEditEnd?: () => void;
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

// ===== Scroll position tracking =====

let _savedScrollTop = 0;

// ===== Main Render Function =====

export function renderDailyBrief(props: DailyBriefProps) {
  const {
    data,
    loading,
    error,
    onRefresh,
    onOpenInObsidian,
    onSaveBrief,
    onOpenFile,
    editing,
    onEditStart,
    onEditEnd,
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

  // --- Click rendered markdown to enter edit mode ---
  const handleReadClick = (e: Event) => {
    const localPath = extractOpenablePathFromEventTarget(e.target);
    if (localPath && onOpenFile) {
      e.preventDefault();
      void onOpenFile(localPath);
      return;
    }
    const container = e.currentTarget as HTMLElement;
    _savedScrollTop = container.scrollTop;
    onEditStart?.();
    // After Lit re-renders with the textarea, restore scroll + focus
    setTimeout(() => {
      const card = container.closest(".brief-editor") ?? container.parentElement;
      const newContainer = card?.querySelector(".brief-content") as HTMLElement | null;
      if (newContainer) {
        newContainer.scrollTop = _savedScrollTop;
      }
      const textarea = card?.querySelector(".brief-editor-textarea") as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.focus();
      }
    }, 0);
  };

  // --- Edit mode handlers ---
  const handleInput = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    if (onSaveBrief) {
      debounceSave(textarea.value, onSaveBrief);
    }
  };

  const handleBlur = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    const container = textarea.closest(".brief-content");
    if (container) {
      _savedScrollTop = container.scrollTop;
    }
    if (onSaveBrief) {
      flushSave(textarea.value, onSaveBrief);
    }
    onEditEnd?.();
  };

  const renderContent = () => {
    if (editing) {
      return html`
        <div class="brief-content brief-content--edit">
          <textarea
            class="brief-editor-textarea"
            .value=${data.content}
            @input=${handleInput}
            @blur=${handleBlur}
            spellcheck="false"
          ></textarea>
        </div>
      `;
    }
    return html`
      <div class="brief-content brief-content--read" @click=${handleReadClick}>
        <div class="brief-rendered">
          ${unsafeHTML(toSanitizedMarkdownHtml(normalizeBriefNewlines(data.content)))}
        </div>
      </div>
    `;
  };

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
        ${renderContent()}
      </div>
    </div>
  `;
}
