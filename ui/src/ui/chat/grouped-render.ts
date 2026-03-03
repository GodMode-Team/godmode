import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import type { AssistantIdentity } from "../assistant-identity";
import { toSanitizedMarkdownHtml } from "../markdown";
import { toStreamingMarkdownHtml } from "../markdown-streaming";
import type { MessageGroup, ToolExecutionInfo } from "../types/chat-types";
import { renderCopyAsMarkdownButton } from "./copy-as-markdown";
import {
  extractTextCached,
  extractThinkingCached,
  formatApiError,
  formatReasoningMarkdown,
} from "./message-extract";
import { isToolResultMessage, normalizeRoleForGrouping } from "./message-normalizer";
import type { LightboxImage } from "./lightbox";
import { extractToolCards, renderToolCardSidebar } from "./tool-cards";

// Fun verbs for different tool types
const WORKING_VERBS: Record<string, string[]> = {
  exec: ["Executing", "Running", "Conjuring", "Manifesting", "Brewing"],
  read: ["Reading", "Perusing", "Absorbing", "Scanning", "Devouring"],
  write: ["Writing", "Scribbling", "Crafting", "Inscribing", "Authoring"],
  edit: ["Editing", "Refining", "Polishing", "Tweaking", "Sculpting"],
  browser: ["Browsing", "Surfing", "Exploring", "Navigating", "Spelunking"],
  web_search: ["Searching", "Hunting", "Investigating", "Sleuthing", "Scouring"],
  web_fetch: ["Fetching", "Grabbing", "Retrieving", "Summoning", "Acquiring"],
  memory_search: ["Remembering", "Recalling", "Pondering", "Reflecting"],
  image: ["Analyzing", "Examining", "Scrutinizing", "Inspecting", "Beholding"],
  default: ["Working on", "Processing", "Handling", "Tinkering with", "Wrangling"],
};

let _verbIndex = 0;
function getWorkingVerb(toolName: string): string {
  const normalizedTool = toolName.toLowerCase().replace(/[^a-z_]/g, "");
  const verbs = WORKING_VERBS[normalizedTool] ?? WORKING_VERBS.default;
  // Rotate through verbs every 2 seconds based on time
  const idx = Math.floor(Date.now() / 2000) % verbs.length;
  return verbs[idx];
}

export type ImageBlock = {
  url?: string;
  alt?: string;
  omitted?: boolean;
  bytes?: number;
  mimeType?: string;
};

type FileAttachment = {
  fileName: string;
  mimeType: string;
  content: string;
};

// Parsed file upload from text pattern
type ParsedFileUpload = {
  fileName: string;
  fileId: string;
  size: string;
  mimeType: string;
};

// File extension to icon mapping
const FILE_ICONS: Record<string, string> = {
  // Documents
  pdf: "📕",
  doc: "📘",
  docx: "📘",
  txt: "📄",
  rtf: "📄",
  // Spreadsheets
  xls: "📗",
  xlsx: "📗",
  csv: "📊",
  // Presentations
  ppt: "📙",
  pptx: "📙",
  // Images
  jpg: "🖼️",
  jpeg: "🖼️",
  png: "🖼️",
  gif: "🖼️",
  webp: "🖼️",
  svg: "🖼️",
  // Audio
  mp3: "🎵",
  wav: "🎵",
  m4a: "🎵",
  // Video
  mp4: "🎬",
  mov: "🎬",
  avi: "🎬",
  // Archives
  zip: "📦",
  rar: "📦",
  "7z": "📦",
  tar: "📦",
  gz: "📦",
  // Code
  js: "📜",
  ts: "📜",
  py: "📜",
  json: "📜",
  html: "📜",
  css: "📜",
  md: "📜",
  // Default
  default: "📎",
};

function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] ?? FILE_ICONS.default;
}

function getFileTypeLabel(mimeType: string, fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  // Common type labels
  const typeLabels: Record<string, string> = {
    pdf: "PDF Document",
    doc: "Word Document",
    docx: "Word Document",
    xls: "Excel Spreadsheet",
    xlsx: "Excel Spreadsheet",
    csv: "CSV File",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    txt: "Text File",
    md: "Markdown",
    json: "JSON File",
    zip: "ZIP Archive",
    png: "PNG Image",
    jpg: "JPEG Image",
    jpeg: "JPEG Image",
    gif: "GIF Image",
    mp3: "Audio File",
    mp4: "Video File",
  };

  return typeLabels[ext] || mimeType.split("/")[1]?.toUpperCase() || "File";
}

/**
 * Parse "[Files uploaded: filename (fileId: xxx, size: XXkb, type: mime/type)]" patterns
 * Also handles multiple files and the newer format with just filename and metadata
 */
function parseFileUploadsFromText(text: string): ParsedFileUpload[] | null {
  // Pattern: [Files uploaded: name (fileId: id, size: size, type: type), name2 (...)]
  const filesMatch = text.match(/\[Files uploaded:\s*([^\]]+)\]/);
  if (!filesMatch) {
    return null;
  }

  const filesContent = filesMatch[1];
  const files: ParsedFileUpload[] = [];

  // Match each file entry: "filename (fileId: xxx, size: xxx, type: xxx)"
  // or "filename.ext (fileId: xxx, size: xxx, type: xxx)"
  const filePattern = /([^(,]+?)\s*\(fileId:\s*([^,]+),\s*size:\s*([^,]+),\s*type:\s*([^)]+)\)/g;
  let match;

  while ((match = filePattern.exec(filesContent)) !== null) {
    files.push({
      fileName: match[1].trim(),
      fileId: match[2].trim(),
      size: match[3].trim(),
      mimeType: match[4].trim(),
    });
  }

  return files.length > 0 ? files : null;
}

/**
 * Render file upload cards for parsed file references
 */
function renderFileUploadCards(files: ParsedFileUpload[]) {
  return html`
    <div class="chat-file-uploads">
      ${files.map(
        (file) => html`
        <div class="chat-file-upload-card">
          <span class="chat-file-upload-card__icon">${getFileIcon(file.fileName)}</span>
          <div class="chat-file-upload-card__info">
            <span class="chat-file-upload-card__name" title="${file.fileName}">${file.fileName}</span>
            <span class="chat-file-upload-card__meta">${file.size} • ${getFileTypeLabel(file.mimeType, file.fileName)}</span>
          </div>
        </div>
      `,
      )}
    </div>
  `;
}

/**
 * Strip file upload text patterns from a string, returning clean text
 */
function stripFileUploadText(text: string): string {
  return text.replace(/\[Files uploaded:[^\]]+\]\s*/g, "").trim();
}

/**
 * Strip system event block from user message text.
 * System events are prepended to user messages for agent context but should not
 * be displayed in the chat UI. Format: "System: [timestamp] message\n\n<actual user text>"
 *
 * Also filters GatewayRestart: messages which contain multi-line JSON.
 *
 * The system block is separated from the user's actual message by a blank line (\n\n).
 * System events can contain multi-line content (like JSON), so we strip everything
 * up to and including the blank line separator.
 */
function stripSystemLines(text: string): string {
  if (!text) {
    return text;
  }

  // Check for system event prefixes that should be stripped
  const isSystemEvent = text.startsWith("System:") || text.startsWith("GatewayRestart:");

  // System events are at the start, separated from user text by \n\n
  // Find the first occurrence of \n\n which separates system block from user text
  if (isSystemEvent) {
    const separatorIdx = text.indexOf("\n\n");
    if (separatorIdx !== -1) {
      // Everything after \n\n is the user's actual message
      return text.slice(separatorIdx + 2).trim();
    }
    // No separator found - entire message is just system event, return empty
    return "";
  }

  // Fallback: line-by-line removal for any remaining System:/GatewayRestart: lines
  const lines = text.split("\n");
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    return !trimmed.startsWith("System:") && !trimmed.startsWith("GatewayRestart:");
  });
  let result = filtered.join("\n");
  while (result.startsWith("\n")) {
    result = result.slice(1);
  }
  return result.trim();
}

function formatImageSize(bytes?: number): string | null {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) {
    return null;
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${Math.round(bytes)} B`;
}

export function extractImages(message: unknown): ImageBlock[] {
  const m = message as Record<string, unknown>;
  const content = m.content;
  const images: ImageBlock[] = [];

  if (Array.isArray(content)) {
    for (const block of content) {
      if (typeof block !== "object" || block === null) {
        continue;
      }
      const b = block as Record<string, unknown>;

      if (b.type === "image") {
        // Handle source object format (from sendChatMessage)
        const source = b.source as Record<string, unknown> | undefined;
        if (source?.type === "base64" && typeof source.data === "string") {
          const data = source.data;
          const mediaType = (source.media_type as string) || "image/png";
          // If data is already a data URL, use it directly
          const url = data.startsWith("data:") ? data : `data:${mediaType};base64,${data}`;
          images.push({ url });
        } else if (typeof b.data === "string" && typeof b.mimeType === "string") {
          // pi-ai internal format: { type: "image", data: "<base64>", mimeType: "..." }
          const url = b.data.startsWith("data:") ? b.data : `data:${b.mimeType};base64,${b.data}`;
          images.push({ url });
        } else if (typeof b.url === "string") {
          images.push({ url: b.url });
        } else if (b.omitted === true) {
          images.push({
            omitted: true,
            bytes: typeof b.bytes === "number" ? b.bytes : undefined,
            mimeType: typeof b.mimeType === "string" ? b.mimeType : undefined,
            alt: typeof b.fileName === "string" ? b.fileName : undefined,
          });
        }
      } else if (b.type === "image_url") {
        // OpenAI format
        const imageUrl = b.image_url as Record<string, unknown> | undefined;
        if (typeof imageUrl?.url === "string") {
          images.push({ url: imageUrl.url });
        }
      } else if (b.type === "attachment" && typeof b.content === "string") {
        // Handle attachment blocks - check if it's an image
        const mimeType = (b.mimeType as string) || "";
        if (mimeType.startsWith("image/")) {
          images.push({ url: b.content, alt: (b.fileName as string) || undefined });
        }
      }

      // Also check for inline data: URLs in text content
      if (b.type === "text" && typeof b.text === "string") {
        const dataUrlRegex = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g;
        const matches = b.text.match(dataUrlRegex);
        if (matches) {
          for (const url of matches) {
            images.push({ url });
          }
        }
      }

      // Recurse into nested content arrays (tool_result blocks contain nested content with images)
      if (Array.isArray(b.content)) {
        for (const nested of b.content) {
          if (typeof nested !== "object" || nested === null) {
            continue;
          }
          const n = nested as Record<string, unknown>;
          if (n.type === "image") {
            const source = n.source as Record<string, unknown> | undefined;
            if (source?.type === "base64" && typeof source.data === "string") {
              const mediaType = (source.media_type as string) || "image/png";
              const url = source.data.startsWith("data:")
                ? source.data
                : `data:${mediaType};base64,${source.data}`;
              images.push({ url });
            } else if (typeof n.data === "string" && typeof n.mimeType === "string") {
              const url = n.data.startsWith("data:")
                ? n.data
                : `data:${n.mimeType};base64,${n.data}`;
              images.push({ url });
            } else if (n.omitted === true) {
              images.push({
                omitted: true,
                bytes: typeof n.bytes === "number" ? n.bytes : undefined,
                mimeType: typeof n.mimeType === "string" ? n.mimeType : undefined,
                alt: typeof n.fileName === "string" ? n.fileName : undefined,
              });
            }
          }
        }
      }
    }
  }

  // Check for top-level attachments array (some APIs include this)
  const attachments = m.attachments;
  if (Array.isArray(attachments)) {
    for (const att of attachments) {
      if (typeof att !== "object" || att === null) {
        continue;
      }
      const a = att as Record<string, unknown>;
      if (a.type === "image" && typeof a.content === "string") {
        const mimeType = (a.mimeType as string) || "image/png";
        const url = a.content.startsWith("data:")
          ? a.content
          : `data:${mimeType};base64,${a.content}`;
        images.push({ url, alt: (a.fileName as string) || undefined });
      } else if (a.type === "image" && a.omitted === true) {
        images.push({
          omitted: true,
          bytes: typeof a.bytes === "number" ? a.bytes : undefined,
          mimeType: typeof a.mimeType === "string" ? a.mimeType : undefined,
          alt: typeof a.fileName === "string" ? a.fileName : undefined,
        });
      }
    }
  }

  return images;
}

function extractFileAttachments(message: unknown): FileAttachment[] {
  const m = message as Record<string, unknown>;
  const content = m.content;
  const files: FileAttachment[] = [];

  if (Array.isArray(content)) {
    for (const block of content) {
      if (typeof block !== "object" || block === null) {
        continue;
      }
      const b = block as Record<string, unknown>;

      if (b.type === "attachment" && typeof b.content === "string") {
        const mimeType = (b.mimeType as string) || "application/octet-stream";
        // Only include non-image files
        if (!mimeType.startsWith("image/")) {
          files.push({
            fileName: (b.fileName as string) || "file",
            mimeType,
            content: b.content,
          });
        }
      }
    }
  }

  // Check for top-level attachments array
  const attachments = m.attachments;
  if (Array.isArray(attachments)) {
    for (const att of attachments) {
      if (typeof att !== "object" || att === null) {
        continue;
      }
      const a = att as Record<string, unknown>;
      if (a.type === "file" && typeof a.content === "string") {
        files.push({
          fileName: (a.fileName as string) || "file",
          mimeType: (a.mimeType as string) || "application/octet-stream",
          content: a.content,
        });
      }
    }
  }

  return files;
}

export function renderReadingIndicatorGroup(
  assistant?: AssistantIdentity,
  currentToolInfo?: ToolExecutionInfo | null,
) {
  return html`
    <div class="chat-group assistant">
      ${renderAvatar("assistant", {
        assistantName: assistant?.name,
        assistantAvatar: assistant?.avatar,
      })}
      <div class="chat-group-messages">
        ${
          currentToolInfo
            ? html`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${getWorkingVerb(currentToolInfo.name)}</span>
                    <strong>${currentToolInfo.name}</strong>
                  </span>
                </div>
                ${
                  currentToolInfo.details
                    ? html`<span class="chat-working-indicator__details">${currentToolInfo.details}</span>`
                    : nothing
                }
              </div>
            `
            : nothing
        }
        <div class="chat-bubble chat-reading-indicator" aria-hidden="true">
          <span class="chat-reading-indicator__dots">
            <span></span><span></span><span></span>
          </span>
        </div>
        <div class="chat-group-footer">
          <span class="chat-sender-name">${assistant?.name ?? "Assistant"}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderStreamingGroup(
  text: string,
  startedAt: number,
  onOpenSidebar?: (content: string) => void,
  assistant?: AssistantIdentity,
  currentToolInfo?: ToolExecutionInfo | null,
) {
  const timestamp = new Date(startedAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const name = assistant?.name ?? "Assistant";

  return html`
    <div class="chat-group assistant">
      ${renderAvatar("assistant", {
        assistantName: assistant?.name,
        assistantAvatar: assistant?.avatar,
      })}
      <div class="chat-group-messages">
        ${
          currentToolInfo
            ? html`
              <div class="chat-working-indicator">
                <div class="chat-working-indicator__row">
                  <span class="chat-working-indicator__icon">⚙</span>
                  <span class="chat-working-indicator__text">
                    <span class="chat-working-indicator__verb">${getWorkingVerb(currentToolInfo.name)}</span>
                    <strong>${currentToolInfo.name}</strong>
                  </span>
                </div>
                ${
                  currentToolInfo.details
                    ? html`<span class="chat-working-indicator__details">${currentToolInfo.details}</span>`
                    : nothing
                }
              </div>
            `
            : nothing
        }
        ${renderGroupedMessage(
          {
            role: "assistant",
            content: [{ type: "text", text }],
            timestamp: startedAt,
          },
          { isStreaming: true, showReasoning: false },
          onOpenSidebar,
        )}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${name}</span>
          <span class="chat-group-timestamp">${timestamp}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderMessageGroup(
  group: MessageGroup,
  opts: {
    onOpenSidebar?: (content: string) => void;
    onImageClick?: (url: string, allImages: LightboxImage[], index: number) => void;
    resolveImageUrl?: (messageIndex: number, imageIndex: number) => string | null;
    showReasoning: boolean;
    assistantName?: string;
    assistantAvatar?: string | null;
    userName?: string;
    userAvatar?: string | null;
  },
) {
  const normalizedRole = normalizeRoleForGrouping(group.role);
  const assistantName = opts.assistantName ?? "Assistant";
  const userName = opts.userName ?? "You";
  const who =
    normalizedRole === "user"
      ? userName
      : normalizedRole === "assistant"
        ? assistantName
        : normalizedRole;
  const roleClass =
    normalizedRole === "user" ? "user" : normalizedRole === "assistant" ? "assistant" : "other";
  const timestamp = new Date(group.timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return html`
    <div class="chat-group ${roleClass}">
      ${renderAvatar(group.role, {
        assistantName,
        assistantAvatar: opts.assistantAvatar ?? null,
        userName,
        userAvatar: opts.userAvatar ?? null,
      })}
      <div class="chat-group-messages">
        ${group.messages.map((item, index) =>
          renderGroupedMessage(
            item.message,
            {
              isStreaming: group.isStreaming && index === group.messages.length - 1,
              showReasoning: opts.showReasoning,
            },
            opts.onOpenSidebar,
            opts.onImageClick,
            opts.resolveImageUrl,
          ),
        )}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${who}</span>
          <span class="chat-group-timestamp">${timestamp}</span>
        </div>
      </div>
    </div>
  `;
}

function renderAvatar(
  role: string,
  opts?: {
    assistantName?: string;
    assistantAvatar?: string | null;
    userName?: string;
    userAvatar?: string | null;
  },
) {
  const normalized = normalizeRoleForGrouping(role);
  const assistantName = opts?.assistantName?.trim() || "Assistant";
  // Use explicit type check to handle null - null?.trim() returns undefined, not ""
  const assistantAvatar =
    typeof opts?.assistantAvatar === "string" ? opts.assistantAvatar.trim() : "";
  const userName = opts?.userName?.trim() || "You";
  // Use explicit type check to handle null - null?.trim() returns undefined, not ""
  const userAvatar = typeof opts?.userAvatar === "string" ? opts.userAvatar.trim() : "";

  const className =
    normalized === "user"
      ? "user"
      : normalized === "assistant"
        ? "assistant"
        : normalized === "tool"
          ? "tool"
          : "other";

  // User avatar
  if (normalized === "user") {
    if (userAvatar && isAvatarUrl(userAvatar)) {
      return html`<img
        class="chat-avatar ${className}"
        src="${userAvatar}"
        alt="${userName}"
      />`;
    }
    if (userAvatar) {
      return html`<div class="chat-avatar ${className}">${userAvatar}</div>`;
    }
    // Default user initial
    return html`<div class="chat-avatar ${className}">${userName.charAt(0).toUpperCase() || "C"}</div>`;
  }

  // Assistant avatar
  if (normalized === "assistant") {
    if (assistantAvatar && isAvatarUrl(assistantAvatar)) {
      return html`<img
        class="chat-avatar ${className}"
        src="${assistantAvatar}"
        alt="${assistantName}"
      />`;
    }
    if (assistantAvatar) {
      return html`<div class="chat-avatar ${className}" style="color: var(--accent);">${assistantAvatar}</div>`;
    }
    // Default assistant avatar - purple atom symbol ⚛️
    return html`<div class="chat-avatar ${className}" style="color: var(--accent);">⚛️</div>`;
  }

  // Tool avatar
  if (normalized === "tool") {
    return html`<div class="chat-avatar ${className}">⚙</div>`;
  }

  // Other/unknown
  return html`<div class="chat-avatar ${className}">?</div>`;
}

function isAvatarUrl(value: string): boolean {
  return (
    /^https?:\/\//i.test(value) || /^data:image\//i.test(value) || value.startsWith("/") // Relative paths from avatar endpoint
  );
}

function renderMessageImages(
  images: ImageBlock[],
  onImageClick?: (url: string, allImages: LightboxImage[], index: number) => void,
  resolveUrl?: (imgIndex: number) => string | null,
) {
  if (images.length === 0) {
    return nothing;
  }

  // Resolve omitted images from cache where possible
  const resolved: Array<ImageBlock & { resolvedUrl?: string }> = images.map((img, i) => {
    if ((img.omitted || !img.url) && resolveUrl) {
      const url = resolveUrl(i);
      if (url) return { ...img, resolvedUrl: url };
    }
    return img;
  });

  // Collect all clickable images for lightbox navigation
  const clickable: LightboxImage[] = resolved
    .filter((img) => (img.resolvedUrl || img.url) && !img.omitted || img.resolvedUrl)
    .map((img) => ({ url: (img.resolvedUrl || img.url)!, alt: img.alt }));

  return html`
    <div class="chat-message-images">
      ${resolved.map((img) => {
        const displayUrl = img.resolvedUrl || img.url;
        if (!displayUrl) {
          // Still omitted, no cached version available
          const sizeLabel = formatImageSize(img.bytes);
          const typeLabel = img.mimeType ? img.mimeType.replace("image/", "").toUpperCase() : null;
          const meta = [typeLabel, sizeLabel, "preview omitted"].filter(Boolean).join(" - ");
          return html`
            <div
              class="chat-message-image chat-message-image--omitted"
              title=${img.alt ?? "Attached image"}
              aria-label="Attached image preview omitted"
            >
              <span class="chat-message-image__omitted-label">Image attached</span>
              <span class="chat-message-image__omitted-meta">${meta}</span>
            </div>
          `;
        }

        const clickableIdx = clickable.findIndex((c) => c.url === displayUrl);
        return html`
          <img
            src=${displayUrl}
            alt=${img.alt ?? "Attached image"}
            class="chat-message-image"
            @error=${(e: Event) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
            @click=${() => {
              if (onImageClick) {
                onImageClick(displayUrl, clickable, Math.max(0, clickableIdx));
              }
            }}
          />
        `;
      })}
    </div>
  `;
}

function renderFileAttachments(files: FileAttachment[]) {
  if (files.length === 0) {
    return nothing;
  }

  return html`
    <div class="chat-message-files">
      ${files.map((file) => {
        const shortName =
          file.fileName.length > 30 ? file.fileName.slice(0, 27) + "..." : file.fileName;
        return html`
            <a
              href=${file.content}
              download=${file.fileName}
              class="chat-file-attachment"
              title=${file.fileName}
            >
              📎 ${shortName}
            </a>
          `;
      })}
    </div>
  `;
}

function renderGroupedMessage(
  message: unknown,
  opts: { isStreaming: boolean; showReasoning: boolean },
  onOpenSidebar?: (content: string) => void,
  onImageClick?: (url: string, allImages: LightboxImage[], index: number) => void,
  resolveImageUrl?: (messageIndex: number, imageIndex: number) => string | null,
) {
  try {
    return renderGroupedMessageUnsafe(message, opts, onOpenSidebar, onImageClick, resolveImageUrl);
  } catch (err) {
    console.error("[chat] message render error:", err);
    return html`
      <div class="chat-bubble">
        <div class="chat-text"><em>Message failed to render</em></div>
      </div>
    `;
  }
}

function renderGroupedMessageUnsafe(
  message: unknown,
  opts: { isStreaming: boolean; showReasoning: boolean },
  onOpenSidebar?: (content: string) => void,
  onImageClick?: (url: string, allImages: LightboxImage[], index: number) => void,
  resolveImageUrl?: (messageIndex: number, imageIndex: number) => string | null,
) {
  const m = message as Record<string, unknown>;
  const role = typeof m.role === "string" ? m.role : "unknown";
  const isToolResult =
    isToolResultMessage(message) ||
    role.toLowerCase() === "toolresult" ||
    role.toLowerCase() === "tool_result" ||
    typeof m.toolCallId === "string" ||
    typeof m.tool_call_id === "string";

  const toolCards = extractToolCards(message);
  const hasToolCards = toolCards.length > 0;
  const images = extractImages(message);
  const hasImages = images.length > 0;

  // Create a per-image resolver bound to this message's index in the chat history
  const msgIdx = typeof m._chatIdx === "number" ? m._chatIdx : -1;
  const boundResolver = resolveImageUrl && msgIdx >= 0
    ? (imgIdx: number) => resolveImageUrl(msgIdx, imgIdx)
    : undefined;
  const fileAttachments = extractFileAttachments(message);
  const hasFiles = fileAttachments.length > 0;

  const extractedText = extractTextCached(message);
  const extractedThinking =
    opts.showReasoning && role === "assistant" ? extractThinkingCached(message) : null;

  // Parse file uploads from text pattern (user messages with [Files uploaded: ...])
  const parsedFileUploads =
    role === "user" && extractedText ? parseFileUploadsFromText(extractedText) : null;
  const hasFileUploads = parsedFileUploads && parsedFileUploads.length > 0;

  // Strip file upload text and system event lines from user messages
  // System events are prepended for agent context but shouldn't show in the UI
  let cleanedText = extractedText;
  if (role === "user" && cleanedText) {
    cleanedText = stripSystemLines(cleanedText);
  }
  // Strip <system-context> blocks that may leak from prependContext injection
  if (cleanedText) {
    cleanedText = cleanedText.replace(/<system-context\b[^>]*>[\s\S]*?<\/system-context>/gi, "").trim() || null;
  }
  // Convert raw API error JSON to friendly message
  if (cleanedText) {
    const errMsg = formatApiError(cleanedText);
    if (errMsg) cleanedText = errMsg;
  }
  if (hasFileUploads && cleanedText) {
    cleanedText = stripFileUploadText(cleanedText);
  }

  const markdownBase = cleanedText?.trim() ? cleanedText : null;
  const reasoningMarkdown = extractedThinking ? formatReasoningMarkdown(extractedThinking) : null;
  const markdown = markdownBase;
  const canCopyMarkdown = role === "assistant" && Boolean(markdown?.trim());

  const bubbleClasses = [
    "chat-bubble",
    canCopyMarkdown ? "has-copy" : "",
    opts.isStreaming ? "streaming" : "",
    "fade-in",
  ]
    .filter(Boolean)
    .join(" ");

  // For tool results with tool cards, render the cards (and any images).
  // The text is available via the "View" button in the card.
  if (hasToolCards && isToolResult) {
    return html`
      ${hasImages ? renderMessageImages(images, onImageClick, boundResolver) : nothing}
      ${toolCards.map((card) => renderToolCardSidebar(card, onOpenSidebar))}
    `;
  }

  if (
    !markdown &&
    !hasToolCards &&
    !hasImages &&
    !hasFiles &&
    !hasFileUploads &&
    !reasoningMarkdown
  ) {
    // Check for error messages (e.g. context overflow stored in session file)
    const errorMsg = typeof m.errorMessage === "string" ? m.errorMessage : null;
    if (m.stopReason === "error" && errorMsg) {
      let friendlyError = errorMsg;
      const overflowMatch = errorMsg.match(/(\d+)\s*tokens?\s*>\s*(\d+)/);
      if (overflowMatch) {
        const used = parseInt(overflowMatch[1]).toLocaleString();
        const max = parseInt(overflowMatch[2]).toLocaleString();
        friendlyError = `Context overflow: ${used} tokens exceeded the ${max} token limit. The conversation needs to be compacted.`;
      } else if (errorMsg.includes("prompt is too long")) {
        friendlyError = "Context overflow: The conversation is too long for the model.";
      }
      return html`
        <div class="chat-bubble chat-bubble--error fade-in">
          <div class="chat-text">${friendlyError}</div>
        </div>
      `;
    }
    return nothing;
  }

  return html`
    <div class="${bubbleClasses}">
      ${canCopyMarkdown ? renderCopyAsMarkdownButton(markdown!) : nothing}
      ${hasFileUploads ? renderFileUploadCards(parsedFileUploads) : nothing}
      ${renderMessageImages(images, onImageClick, boundResolver)}
      ${renderFileAttachments(fileAttachments)}
      ${
        reasoningMarkdown
          ? html`<details class="chat-thinking-details">
              <summary class="chat-thinking-summary">Thinking...</summary>
              <div class="chat-thinking">${unsafeHTML(
                toSanitizedMarkdownHtml(reasoningMarkdown),
              )}</div>
            </details>`
          : nothing
      }
      ${
        markdown
          ? html`<div class="chat-text">${unsafeHTML(
              opts.isStreaming
                ? toStreamingMarkdownHtml(markdown)
                : toSanitizedMarkdownHtml(markdown),
            )}</div>`
          : nothing
      }
      ${toolCards.map((card) => renderToolCardSidebar(card, onOpenSidebar))}
    </div>
  `;
}

/**
 * Render a compaction summary message with special styling.
 */
export function renderCompactionSummary(message: unknown) {
  const m = message as Record<string, unknown>;
  const summary = typeof m.content === "string" ? m.content : "";
  const keptMessages = typeof m.keptMessages === "number" ? m.keptMessages : null;
  const timestamp =
    typeof m.timestamp === "number"
      ? new Date(m.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "";

  return html`
    <div class="chat-compaction-summary">
      <div class="chat-compaction-summary__header">
        <span class="chat-compaction-summary__icon">📋</span>
        <span class="chat-compaction-summary__title">Context Compacted</span>
        ${
          keptMessages !== null
            ? html`<span class="chat-compaction-summary__kept">${keptMessages} messages kept</span>`
            : nothing
        }
      </div>
      <div class="chat-compaction-summary__content">
        ${unsafeHTML(toSanitizedMarkdownHtml(summary))}
      </div>
      ${
        timestamp
          ? html`<div class="chat-compaction-summary__timestamp">${timestamp}</div>`
          : nothing
      }
    </div>
  `;
}

/**
 * Check if a message is a compaction summary.
 */
export function isCompactionSummary(message: unknown): boolean {
  const m = message as Record<string, unknown>;
  return m.isCompactionSummary === true;
}
