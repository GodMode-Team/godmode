import { html, nothing } from "lit";
import { getFileIcon, getFileTypeLabel } from "./file-utils";
import { icons } from "../icons";
import { formatToolDetail, resolveToolDisplay } from "../tool-display";
import type { ToolCard } from "../types/chat-types";
import { TOOL_INLINE_THRESHOLD, TOOL_COLLAPSE_LINE_THRESHOLD } from "./constants";
import { extractTextCached } from "./message-extract";
import { isToolResultMessage } from "./message-normalizer";
import { formatToolOutputForSidebar, getTruncatedPreview } from "./tool-helpers";

export function extractToolCards(message: unknown): ToolCard[] {
  const m = message as Record<string, unknown>;
  const content = normalizeContent(m.content);
  const cards: ToolCard[] = [];

  for (const item of content) {
    const kind = (typeof item.type === "string" ? item.type : "").toLowerCase();
    const isToolCall =
      ["toolcall", "tool_call", "tooluse", "tool_use"].includes(kind) ||
      (typeof item.name === "string" && item.arguments != null);
    if (isToolCall) {
      cards.push({
        kind: "call",
        name: (item.name as string) ?? "tool",
        args: coerceArgs(item.arguments ?? item.args),
      });
    }
  }

  for (const item of content) {
    const kind = (typeof item.type === "string" ? item.type : "").toLowerCase();
    if (kind !== "toolresult" && kind !== "tool_result") {
      continue;
    }
    const text = extractToolText(item);
    // Skip polling messages that clutter the chat
    if (isPollingOutput(text)) {
      continue;
    }
    const name = typeof item.name === "string" ? item.name : "tool";
    cards.push({ kind: "result", name, text });
  }

  if (isToolResultMessage(message) && !cards.some((card) => card.kind === "result")) {
    const name =
      (typeof m.toolName === "string" && m.toolName) ||
      (typeof m.tool_name === "string" && m.tool_name) ||
      "tool";
    const text = extractTextCached(message) ?? undefined;
    // Skip polling messages in fallback path too
    if (!isPollingOutput(text)) {
      cards.push({ kind: "result", name, text });
    }
  }

  return cards;
}

/** Tool names whose args contain a file path worth opening in the sidebar viewer. */
const FILE_TOOLS = new Set(["write", "read", "edit", "attach"]);

function extractFilePathFromArgs(args: unknown): string | null {
  if (!args || typeof args !== "object") return null;
  const record = args as Record<string, unknown>;
  const path = record.path ?? record.file_path ?? record.filePath;
  return typeof path === "string" && path.trim() ? path.trim() : null;
}

/** Extract an absolute file path from tool result text (e.g. "wrote 9722 bytes to /Users/.../file.md"). */
function extractFilePathFromText(text: string | undefined): string | null {
  if (!text) return null;
  const match = text.match(/(?:\/(?:Users|home|tmp|var)\/\S+|~\/\S+)/);
  if (!match) return null;
  // Strip trailing punctuation that isn't part of the path
  return match[0].replace(/[.,;:!?)'"]+$/, "");
}

export function renderToolCardSidebar(
  card: ToolCard,
  onOpenSidebar?: (content: string) => void,
  onOpenFile?: (filePath: string) => void,
  onPushToDrive?: (filePath: string) => void,
) {
  const display = resolveToolDisplay({ name: card.name, args: card.args });
  const detail = formatToolDetail(display);
  const hasText = Boolean(card.text?.trim());

  const filePath = FILE_TOOLS.has(card.name.toLowerCase())
    ? (extractFilePathFromArgs(card.args) ?? extractFilePathFromText(card.text))
    : null;

  // Rich artifact card for file tool results with a detected path
  if (filePath && card.kind === "result") {
    const fileName = filePath.split("/").pop() || filePath;
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const icon = getFileIcon(fileName);
    const typeLabel = getFileTypeLabel(ext, fileName);

    return html`
      <div class="chat-artifact-card">
        <div class="chat-artifact-card__icon">${icon}</div>
        <div class="chat-artifact-card__info">
          <span class="chat-artifact-card__name" title=${filePath}>${fileName}</span>
          <span class="chat-artifact-card__type">${typeLabel}</span>
        </div>
        <div class="chat-artifact-card__actions">
          ${onOpenFile
            ? html`<button class="chat-artifact-card__btn" @click=${(e: Event) => { e.stopPropagation(); onOpenFile(filePath); }}>Open</button>`
            : onOpenSidebar && hasText
              ? html`<button class="chat-artifact-card__btn" @click=${(e: Event) => { e.stopPropagation(); onOpenSidebar(formatToolOutputForSidebar(card.text!)); }}>View</button>`
              : nothing}
          ${onPushToDrive
            ? html`<button class="chat-artifact-card__btn chat-artifact-card__btn--drive" @click=${(e: Event) => { e.stopPropagation(); onPushToDrive(filePath); }}>Drive</button>`
            : nothing}
        </div>
      </div>
    `;
  }

  const canClick = Boolean(onOpenSidebar) || Boolean(onOpenFile && filePath);
  const handleClick = canClick
    ? (e: Event) => {
        e.stopPropagation();
        // For file-oriented tools, open the actual file in the sidebar viewer
        if (onOpenFile && filePath) {
          onOpenFile(filePath);
          return;
        }
        if (onOpenSidebar && hasText) {
          onOpenSidebar(formatToolOutputForSidebar(card.text!));
          return;
        }
        if (onOpenSidebar) {
          const info = `## ${display.label}\n\n${
            detail ? `**Command:** \`${detail}\`\n\n` : ""
          }*No output — tool completed successfully.*`;
          onOpenSidebar(info);
        }
      }
    : undefined;

  const lineCount = card.text ? card.text.split("\n").length : 0;
  const isShort = hasText && (card.text?.length ?? 0) <= TOOL_INLINE_THRESHOLD;
  const showCollapsed = hasText && !isShort && lineCount > TOOL_COLLAPSE_LINE_THRESHOLD;
  const showInline = hasText && !showCollapsed;
  const isEmpty = !hasText;

  const kindClass = card.kind === "call" ? "chat-tool-card--call" : "chat-tool-card--result";

  return html`
    <div
      class="chat-tool-card ${kindClass} ${canClick ? "chat-tool-card--clickable" : ""}"
      @click=${handleClick}
      role=${canClick ? "button" : nothing}
      tabindex=${canClick ? "0" : nothing}
      @keydown=${
        canClick
          ? (e: KeyboardEvent) => {
              if (e.key !== "Enter" && e.key !== " ") {
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              handleClick?.(e);
            }
          : nothing
      }
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${icons[display.icon]}</span>
          <span>${display.label}</span>
        </div>
        ${
          canClick
            ? html`<span class="chat-tool-card__action">${hasText ? "View" : ""} ${icons.check}</span>`
            : nothing
        }
        ${isEmpty && !canClick ? html`<span class="chat-tool-card__status">${icons.check}</span>` : nothing}
      </div>
      ${detail ? html`<div class="chat-tool-card__detail">${detail}</div>` : nothing}
      ${
        isEmpty
          ? html`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `
          : nothing
      }
      ${
        showCollapsed
          ? html`<details class="chat-tool-card__expandable" @click=${(e: Event) => e.stopPropagation()}>
            <summary class="chat-tool-card__preview mono">${getTruncatedPreview(card.text!)}</summary>
            <div class="chat-tool-card__full-output mono">${card.text}</div>
          </details>`
          : nothing
      }
      ${showInline ? html`<div class="chat-tool-card__inline mono">${card.text}</div>` : nothing}
    </div>
  `;
}

function normalizeContent(content: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(content)) {
    return [];
  }
  return content.filter(Boolean) as Array<Record<string, unknown>>;
}

function coerceArgs(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return value;
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function extractToolText(item: Record<string, unknown>): string | undefined {
  if (typeof item.text === "string") {
    return item.text;
  }
  if (typeof item.content === "string") {
    return item.content;
  }
  return undefined;
}

/** Check if tool output is a "(no new output)" polling update that should be hidden.
 *  We keep "Command still running" so user sees process started, and show completions.
 */
function isPollingOutput(text: string | undefined): boolean {
  if (!text) {
    return false;
  }
  const lower = text.toLowerCase();
  // Always show completion messages
  if (lower.includes("process exited")) {
    return false;
  }
  // Hide "no new output" + "still running" combinations
  return lower.includes("(no new output)") && lower.includes("still running");
}
