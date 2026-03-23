import { html, nothing } from "lit";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import {
  renderMessageGroup,
  renderReadingIndicatorGroup,
  renderStreamingGroup,
  renderCompactionSummary,
  isCompactionSummary,
} from "../chat/grouped-render";
import type { LightboxImage } from "../chat/lightbox";
import { normalizeMessage, normalizeRoleForGrouping } from "../chat/message-normalizer";
import { isSystemPromptNoise } from "../chat/system-noise-filter";
import { icons } from "../icons";
import type { ToastType } from "../toast";
import type { SessionsListResult } from "../types";
import type { ChatItem, MessageGroup, ToolExecutionInfo } from "../types/chat-types";
import type { ChatAttachment, ChatQueueItem } from "../ui-types";
import { validateFilesForUpload } from "../upload-constants";
import { renderMarkdownSidebar } from "./markdown-sidebar";
import { renderAllyInline, type AllyChatProps } from "./ally-chat";
import "../components/resizable-divider";

export type CompactionIndicatorStatus = {
  active: boolean;
  startedAt: number | null;
  completedAt: number | null;
};

/** Format "anthropic/claude-opus-4-6" → "Opus 4.6" */
function formatModelLabel(raw: string): string {
  const modelId = raw.includes("/") ? raw.split("/").pop()! : raw;
  const m = modelId.match(/claude-(\w+)-(\d+)-(\d+)/);
  if (m) {
    const family = m[1].charAt(0).toUpperCase() + m[1].slice(1);
    return `${family} ${m[2]}.${m[3]}`;
  }
  return modelId.replace(/^claude-/, "").replace(/-/g, " ");
}

export type ChatProps = {
  basePath?: string;
  sessionKey: string;
  onSessionKeyChange: (next: string) => void;
  thinkingLevel: string | null;
  showThinking: boolean;
  loading: boolean;
  sending: boolean;
  sendingSessionKey?: string | null; // Which session is actively sending
  canAbort?: boolean;
  compactionStatus?: CompactionIndicatorStatus | null;
  messages: unknown[];
  toolMessages: unknown[];
  stream: string | null;
  streamStartedAt: number | null;
  assistantAvatarUrl?: string | null;
  draft: string;
  queue: ChatQueueItem[];
  connected: boolean;
  canSend: boolean;
  disabledReason: string | null;
  error: string | null;
  sessions: SessionsListResult | null;
  // Focus mode
  focusMode: boolean;
  // Sidebar state
  sidebarOpen?: boolean;
  sidebarContent?: string | null;
  sidebarError?: string | null;
  sidebarMimeType?: string | null;
  sidebarFilePath?: string | null;
  sidebarTitle?: string | null;
  sidebarMode?: "resource" | "proof";
  sidebarProofSlug?: string | null;
  sidebarProofUrl?: string | null;
  sidebarProofHtml?: string | null;
  splitRatio?: number;
  assistantName: string;
  assistantAvatar: string | null;
  userName?: string;
  userAvatar?: string | null;
  currentModel?: string | null;
  availableModels?: { id: string; name: string; provider: string }[];
  modelPickerOpen?: boolean;
  onToggleModelPicker?: () => void;
  onSwitchModel?: (modelId: string) => void;
  // Working indicator
  currentToolName?: string | null;
  currentToolInfo?: ToolExecutionInfo | null;
  isWorking?: boolean; // True when session is actively processing
  // Scroll state
  showScrollButton?: boolean;
  showNewMessages?: boolean;
  onScrollToBottom?: () => void;
  onClearNewMessages?: () => void;
  // Image attachments
  attachments?: ChatAttachment[];
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
  // Event handlers
  onRefresh: () => void;
  onToggleFocusMode: () => void;
  onDraftChange: (next: string) => void;
  onSend: (queue?: boolean) => void;
  onAbort?: () => void;
  onCompact?: () => void;
  onQueueRemove: (id: string) => void;
  onNewSession: () => void;
  onConsciousnessFlush?: () => void;
  consciousnessStatus?: "idle" | "loading" | "ok" | "error";
  onOpenSidebar?: (
    content: string,
    opts?: { mimeType?: string | null; filePath?: string | null; title?: string | null },
  ) => void;
  onMessageLinkClick?: (href: string) => boolean | Promise<boolean>;
  onCloseSidebar?: () => void;
  onOpenProof?: (slug: string) => void;
  onOpenFile?: (filePath: string) => void;
  onSplitRatioChange?: (ratio: number) => void;
  onImageClick?: (url: string, allImages: LightboxImage[], index: number) => void;
  resolveImageUrl?: (messageIndex: number, imageIndex: number) => string | null;
  onChatScroll?: (event: Event) => void;
  // Toast notifications for file upload errors
  showToast?: (message: string, type: ToastType) => void;
  // Ally inline panel (for split sidebar layout)
  allyPanelOpen?: boolean;
  allyProps?: AllyChatProps | null;
  // Push to Google Drive
  onPushToDrive?: (filePath: string, account?: string) => void;
  driveAccounts?: Array<{ email: string; client: string; label: string }>;
  showDrivePicker?: boolean;
  driveUploading?: boolean;
  onToggleDrivePicker?: () => void;
  // Private session mode
  privateMode?: boolean;
  onTogglePrivateMode?: () => void;
  // Session resources strip
  sessionResources?: Array<{ id: string; title: string; type: string; path?: string; url?: string }>;
  sessionResourcesCollapsed?: boolean;
  onToggleSessionResources?: () => void;
  onSessionResourceClick?: (resource: { path?: string; url?: string }) => void;
  onViewAllResources?: () => void;
};

const COMPACTION_TOAST_DURATION_MS = 5000;

function resolveConsciousnessIconSrc(basePath?: string): string {
  const trimmedBasePath = (basePath ?? "").trim();
  if (!trimmedBasePath || trimmedBasePath === "/") {
    return "/consciousness-icon.webp";
  }
  const normalizedBasePath = trimmedBasePath.startsWith("/")
    ? trimmedBasePath
    : `/${trimmedBasePath}`;
  const withoutTrailingSlash = normalizedBasePath.endsWith("/")
    ? normalizedBasePath.slice(0, -1)
    : normalizedBasePath;
  return `${withoutTrailingSlash}/consciousness-icon.webp`;
}

function adjustTextareaHeight(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function estimateContextUsage(props: ChatProps): number | null {
  // Use actual token data from the sessions list
  const activeSession = props.sessions?.sessions?.find((row) => row.key === props.sessionKey);

  if (!activeSession) {
    return null;
  }

  const used = activeSession.totalTokens ?? 0;
  const max = activeSession.contextTokens ?? props.sessions?.defaults?.contextTokens ?? 200000;

  if (max <= 0) {
    return null;
  }

  return used / max;
}

function renderContextBadge(props: ChatProps) {
  const usage = estimateContextUsage(props);
  if (usage === null) {
    return nothing;
  }

  const percentage = Math.round(usage * 100);
  const colorClass = percentage >= 90 ? "danger" : percentage >= 70 ? "warn" : "ok";

  // Get token details for tooltip
  const activeSession = props.sessions?.sessions?.find((row) => row.key === props.sessionKey);
  const used = activeSession?.totalTokens ?? 0;
  const max = activeSession?.contextTokens ?? props.sessions?.defaults?.contextTokens ?? 200000;

  // Context budget tier info
  const tierLabel =
    percentage >= 90
      ? "Soul + identity only"
      : percentage >= 70
        ? "P0 + P1 active"
        : "Full context";

  const trimmedNote =
    percentage >= 90
      ? html`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--danger">
          Schedule, tasks, skill cards trimmed
        </span>`
      : percentage >= 70
        ? html`<span class="chat-context-badge__tier-note chat-context-badge__tier-note--warn">
            Meetings, cron, queue review trimmed
          </span>`
        : nothing;

  const tierRows = html`
    <span class="chat-context-badge__tier ${percentage < 70 ? "active" : "trimmed"}">P3 Safety nudges, onboarding</span>
    <span class="chat-context-badge__tier ${percentage < 70 ? "active" : "trimmed"}">P2 Meetings, cron, queue review</span>
    <span class="chat-context-badge__tier ${percentage < 90 ? "active" : "trimmed"}">P1 Schedule, tasks, skill cards</span>
    <span class="chat-context-badge__tier active">P0 Soul, identity, memory</span>
  `;

  return html`
    <button
      type="button"
      class="chat-context-badge chat-context-badge--${colorClass}"
      role="status"
      aria-label="Context window: ${percentage}% used (${tierLabel}). Click to compact."
      @click=${() => props.onCompact?.()}
      ?disabled=${!props.connected}
    >
      ${percentage}%
      <span class="chat-context-badge__bar">
        <span class="chat-context-badge__bar-fill chat-context-badge__bar-fill--${colorClass}" style="width:${percentage}%"></span>
      </span>
      <span class="chat-context-badge__tooltip">
        <span class="chat-context-badge__tooltip-header">
          ${used.toLocaleString()} / ${max.toLocaleString()} tokens
        </span>
        ${trimmedNote}
        <span class="chat-context-badge__tier-list">${tierRows}</span>
        <span class="chat-context-badge__tooltip-action">Click to compact</span>
      </span>
    </button>
  `;
}

function renderCompactionIndicator(status: CompactionIndicatorStatus | null | undefined) {
  if (!status) {
    return nothing;
  }

  if (status.active) {
    return html`
      <div class="compaction-bar compaction-bar--active">
        <span class="compaction-bar__icon">${icons.loader}</span>
        <span class="compaction-bar__text">Optimizing context...</span>
      </div>
    `;
  }

  if (status.completedAt) {
    const elapsed = Date.now() - status.completedAt;
    if (elapsed < COMPACTION_TOAST_DURATION_MS) {
      return html`
        <div class="compaction-bar compaction-bar--complete">
          <span class="compaction-bar__icon">${icons.check}</span>
          <span class="compaction-bar__text">Context optimized</span>
        </div>
      `;
    }
  }

  return nothing;
}

function generateAttachmentId(): string {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
  }
}

function handleDragEnter(e: DragEvent, element: HTMLElement) {
  e.preventDefault();
  e.stopPropagation();
  element.classList.add("chat--drag-over");
}

function handleDragLeave(e: DragEvent, element: HTMLElement) {
  e.preventDefault();
  e.stopPropagation();
  // Only remove class if we're leaving the element entirely
  const rect = element.getBoundingClientRect();
  if (
    e.clientX <= rect.left ||
    e.clientX >= rect.right ||
    e.clientY <= rect.top ||
    e.clientY >= rect.bottom
  ) {
    element.classList.remove("chat--drag-over");
  }
}

function handleDrop(e: DragEvent, props: ChatProps) {
  e.preventDefault();
  e.stopPropagation();

  const element = e.currentTarget as HTMLElement;
  element.classList.remove("chat--drag-over");

  const files = e.dataTransfer?.files;
  if (!files || files.length === 0 || !props.onAttachmentsChange) {
    return;
  }

  // Validate files before processing
  const currentAttachments = props.attachments ?? [];
  const existingSize = currentAttachments.reduce((sum, att) => {
    return sum + (att.dataUrl?.length ?? 0) * 0.75;
  }, 0);

  const { validFiles, errors } = validateFilesForUpload(files, existingSize);

  // Show validation errors
  for (const error of errors) {
    props.showToast?.(error, "error");
  }

  if (validFiles.length === 0) {
    return;
  }

  // Original working pattern: accumulate all files, update once at end
  const newAttachments: ChatAttachment[] = [];
  let pending = validFiles.length;

  for (const file of validFiles) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const dataUrl = reader.result as string;
      newAttachments.push({
        id: generateAttachmentId(),
        dataUrl,
        mimeType: file.type || "application/octet-stream",
        fileName: file.name,
      });
      pending--;
      if (pending === 0) {
        props.onAttachmentsChange?.([...currentAttachments, ...newAttachments]);
      }
    });

    reader.addEventListener("error", () => {
      props.showToast?.(`Failed to read "${file.name}"`, "error");
      pending--;
      if (pending === 0 && newAttachments.length > 0) {
        props.onAttachmentsChange?.([...currentAttachments, ...newAttachments]);
      }
    });

    reader.readAsDataURL(file);
  }
}

function handlePaste(e: ClipboardEvent, props: ChatProps) {
  const items = e.clipboardData?.items;
  if (!items || !props.onAttachmentsChange) {
    return;
  }

  const imageFiles: File[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        imageFiles.push(file);
      }
    }
  }

  if (imageFiles.length === 0) {
    return;
  }

  e.preventDefault();

  // Validate pasted images
  const currentAttachments = props.attachments ?? [];
  const existingSize = currentAttachments.reduce((sum, att) => {
    return sum + (att.dataUrl?.length ?? 0) * 0.75;
  }, 0);

  const { validFiles, errors } = validateFilesForUpload(imageFiles, existingSize);

  for (const error of errors) {
    props.showToast?.(error, "error");
  }

  if (validFiles.length === 0) {
    return;
  }

  // Original working pattern: accumulate all, update once at end
  const newAttachments: ChatAttachment[] = [];
  let pending = validFiles.length;

  for (const file of validFiles) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const dataUrl = reader.result as string;
      newAttachments.push({
        id: generateAttachmentId(),
        dataUrl,
        mimeType: file.type,
        fileName: file.name || "pasted-image",
      });
      pending--;
      if (pending === 0) {
        props.onAttachmentsChange?.([...currentAttachments, ...newAttachments]);
      }
    });

    reader.addEventListener("error", () => {
      props.showToast?.("Failed to read pasted image", "error");
      pending--;
      if (pending === 0 && newAttachments.length > 0) {
        props.onAttachmentsChange?.([...currentAttachments, ...newAttachments]);
      }
    });

    reader.readAsDataURL(file);
  }
}

function handleFileSelect(e: Event, props: ChatProps) {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files || !props.onAttachmentsChange) {
    return;
  }

  // Validate files before processing
  const currentAttachments = props.attachments ?? [];
  const existingSize = currentAttachments.reduce((sum, att) => {
    return sum + (att.dataUrl?.length ?? 0) * 0.75;
  }, 0);

  const { validFiles, errors } = validateFilesForUpload(files, existingSize);

  // Show validation errors
  for (const error of errors) {
    props.showToast?.(error, "error");
  }

  if (validFiles.length === 0) {
    input.value = "";
    return;
  }

  // Original working pattern: accumulate all, update once at end
  const newAttachments: ChatAttachment[] = [];
  let pending = validFiles.length;

  for (const file of validFiles) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const dataUrl = reader.result as string;
      newAttachments.push({
        id: generateAttachmentId(),
        dataUrl,
        mimeType: file.type || "application/octet-stream",
        fileName: file.name,
      });
      pending--;
      if (pending === 0) {
        props.onAttachmentsChange?.([...currentAttachments, ...newAttachments]);
      }
    });

    reader.addEventListener("error", () => {
      props.showToast?.(`Failed to read "${file.name}"`, "error");
      pending--;
      if (pending === 0 && newAttachments.length > 0) {
        props.onAttachmentsChange?.([...currentAttachments, ...newAttachments]);
      }
    });

    reader.readAsDataURL(file);
  }

  // Reset so same file can be selected again
  input.value = "";
}

function renderAttachmentPreview(props: ChatProps) {
  const attachments = props.attachments ?? [];
  if (attachments.length === 0) {
    return nothing;
  }

  return html`
    <div class="chat-attachments">
      ${attachments.map((att) => {
        const isImage = att.mimeType.startsWith("image/");
        const fileName = att.fileName || "file";
        const shortName = fileName.length > 40 ? fileName.slice(0, 37) + "..." : fileName;

        return html`
          <div class="chat-attachment ${isImage ? "" : "chat-attachment--file"}">
            ${
              isImage
                ? html`<img src=${att.dataUrl} alt="Attachment preview" class="chat-attachment__img" />`
                : html`<div class="chat-attachment__file">
                  ${icons.fileText}
                  <span class="chat-attachment__filename" title=${fileName}>${shortName}</span>
                </div>`
            }
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${() => {
                const next = (props.attachments ?? []).filter((a) => a.id !== att.id);
                props.onAttachmentsChange?.(next);
              }}
            >
              ${icons.x}
            </button>
          </div>
        `;
      })}
    </div>
  `;
}

function isPlainPrimaryClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function openAnchorFallback(anchor: HTMLAnchorElement) {
  const href = anchor.href;
  if (!href) {
    return;
  }
  if (anchor.target === "_blank") {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.assign(href);
}

function extractPathCandidateFromCode(text: string): string | null {
  const candidate = text.trim();
  if (!candidate || candidate.includes("\n")) {
    return null;
  }
  if (
    candidate.startsWith("/") ||
    candidate.startsWith("~/") ||
    candidate.startsWith("./") ||
    candidate.startsWith("../") ||
    /^[a-z]:[\\/]/i.test(candidate)
  ) {
    return candidate;
  }
  // Relative path with slashes and a file extension
  if (/^[^:\s]+\/[^\s]+$/.test(candidate) && /\.[a-z0-9]{1,12}$/i.test(candidate)) {
    return candidate;
  }
  // Bare filename with extension (e.g. "godmode-v5.png", "report.pdf")
  if (/^[^\s/\\:*?"<>|]+\.[a-z0-9]{1,12}$/i.test(candidate) && candidate.length <= 100) {
    return candidate;
  }
  return null;
}

async function handleChatThreadLinkClick(event: MouseEvent, props: ChatProps) {
  const rawTarget = event.target;
  const target =
    rawTarget instanceof Element
      ? rawTarget
      : rawTarget instanceof Node
        ? rawTarget.parentElement
        : null;
  if (!target) {
    return;
  }

  if (!props.onMessageLinkClick || !isPlainPrimaryClick(event)) {
    return;
  }

  const anchor = target.closest("a");
  if (anchor instanceof HTMLAnchorElement) {
    if (anchor.hasAttribute("download")) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href) {
      return;
    }

    // Proof links: intercept proofeditor.ai URLs and open in sidebar instead of browser.
    if (props.onOpenProof) {
      try {
        const proofMatch = href.match(/(?:proofeditor\.ai|127\.0\.0\.1:\d+|localhost:\d+)\/d\/([a-zA-Z0-9_-]+)/);
        if (proofMatch) {
          event.preventDefault();
          props.onOpenProof(proofMatch[1]);
          return;
        }
      } catch { /* fall through */ }
    }

    // External URLs: open synchronously via window.open BEFORE any await.
    // Calling window.open after an await breaks the user-gesture chain and
    // gets silently blocked by popup blockers / webview security.
    try {
      const url = new URL(href, window.location.href);
      if (/^https?:$/.test(url.protocol) && url.origin !== window.location.origin) {
        event.preventDefault();
        window.open(url.href, "_blank", "noopener,noreferrer");
        return;
      }
    } catch {
      // Not a valid URL — fall through to workspace file handler
    }

    event.preventDefault();
    const handled = await props.onMessageLinkClick(href);
    if (!handled) {
      openAnchorFallback(anchor);
    }
    return;
  }

  const code = target.closest("code");
  if (!(code instanceof HTMLElement)) {
    return;
  }

  const codeText = (code.textContent ?? "").trim();

  // URLs inside <code> blocks — open in browser directly
  if (/^https?:\/\/\S+$/i.test(codeText)) {
    event.preventDefault();
    window.open(codeText, "_blank", "noopener,noreferrer");
    return;
  }

  // Bare domains in <code> blocks (e.g. go.example.com/page) — prefix https://
  if (/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}(\/\S*)?$/i.test(codeText)) {
    event.preventDefault();
    window.open(`https://${codeText}`, "_blank", "noopener,noreferrer");
    return;
  }

  const pathCandidate = extractPathCandidateFromCode(codeText);
  if (!pathCandidate) {
    return;
  }

  event.preventDefault();
  await props.onMessageLinkClick(pathCandidate);
}

const RESOURCE_ICONS: Record<string, string> = {
  html_report: "📊",
  plan: "📋",
  analysis: "🔍",
  code: "💻",
  doc: "📝",
  data: "📦",
  image: "🖼️",
  script: "⚙️",
};

function renderSessionResourcesStrip(props: ChatProps) {
  const resources = props.sessionResources;
  if (!resources || resources.length === 0) return nothing;
  if (props.sessionResourcesCollapsed) {
    return html`
      <div class="session-resources-strip">
        <div class="session-resources-header">
          <span class="session-resources-label">Resources (${resources.length})</span>
          <button class="session-resources-toggle" @click=${props.onToggleSessionResources}>▲</button>
        </div>
      </div>
    `;
  }
  const shown = resources.slice(0, 5);
  return html`
    <div class="session-resources-strip">
      <div class="session-resources-header">
        <span class="session-resources-label">Resources (${resources.length})</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${resources.length > 5
            ? html`<button class="session-resources-view-all" @click=${props.onViewAllResources}>View all</button>`
            : nothing}
          <button class="session-resources-toggle" @click=${props.onToggleSessionResources}>▼</button>
        </div>
      </div>
      <div class="session-resources-cards">
        ${shown.map(
          (r) => html`
            <button
              class="session-resource-chip"
              @click=${() => props.onSessionResourceClick?.(r)}
            >
              <span>${RESOURCE_ICONS[r.type] || "📄"}</span>
              <span>${r.title}</span>
            </button>
          `,
        )}
      </div>
    </div>
  `;
}

export function renderChat(props: ChatProps) {
  const canCompose = props.connected;
  const isBusy = props.sending || props.stream !== null;
  const _canAbort = Boolean(props.canAbort && props.onAbort);
  const activeSession = props.sessions?.sessions?.find((row) => row.key === props.sessionKey);
  const reasoningLevel = activeSession?.reasoningLevel ?? "off";
  const showReasoning = props.showThinking && reasoningLevel !== "off";
  const assistantIdentity = {
    name: props.assistantName,
    avatar: props.assistantAvatar ?? props.assistantAvatarUrl ?? null,
  };

  const hasAttachments = (props.attachments?.length ?? 0) > 0;
  const composePlaceholder = props.connected
    ? hasAttachments
      ? "Add a message or paste more images..."
      : "Message (↩ to send, ⌘↩ to queue, Shift+↩ for line breaks)"
    : "Connect to the gateway to start chatting…";

  const splitRatio = props.splitRatio ?? 0.6;
  const sidebarOpen = Boolean(props.sidebarOpen && props.onCloseSidebar);
  const thread = html`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${props.onChatScroll}
      @click=${(event: MouseEvent) => void handleChatThreadLinkClick(event, props)}
    >
      ${
        props.loading
          ? html`
              <div class="muted">Loading chat…</div>
            `
          : nothing
      }
      ${repeat(
        buildChatItems(props),
        (item) => item.key,
        (item) => {
          try {
            if (item.kind === "reading-indicator") {
              return renderReadingIndicatorGroup(assistantIdentity, props.currentToolInfo);
            }

            if (item.kind === "stream") {
              return renderStreamingGroup(
                item.text,
                item.startedAt,
                props.onOpenSidebar,
                assistantIdentity,
                props.currentToolInfo,
              );
            }

            if (item.kind === "compaction-summary") {
              return renderCompactionSummary(item.message);
            }

            if (item.kind === "group") {
              // Create a resolver that maps (messageIndex, imageIndex) for each message in this group
              const resolveImageUrl = props.resolveImageUrl
                ? (msgIdx: number, imgIdx: number) => props.resolveImageUrl!(msgIdx, imgIdx)
                : undefined;
              return renderMessageGroup(item, {
                onOpenSidebar: props.onOpenSidebar,
                onOpenFile: props.onOpenFile,
                onOpenProof: props.onOpenProof,
                onPushToDrive: props.onPushToDrive,
                onImageClick: props.onImageClick,
                resolveImageUrl,
                showReasoning,
                assistantName: props.assistantName,
                assistantAvatar: assistantIdentity.avatar,
                userName: props.userName,
                userAvatar: props.userAvatar,
              });
            }

            return nothing;
          } catch (err) {
            console.error("[chat] item render error:", err, item.key);
            return nothing;
          }
        },
      )}
    </div>
  `;

  return html`
    <section 
      class="card chat"
      @dragover=${handleDragOver}
      @dragenter=${(e: DragEvent) => handleDragEnter(e, e.currentTarget as HTMLElement)}
      @dragleave=${(e: DragEvent) => handleDragLeave(e, e.currentTarget as HTMLElement)}
      @drop=${(e: DragEvent) => handleDrop(e, props)}
    >
      ${props.privateMode
        ? html`<div class="callout callout--private" aria-live="polite">
            <span style="margin-right:6px">🔒</span>
            <strong>Private Session</strong> — Nothing from this conversation will be saved to memory or vault.
          </div>`
        : nothing
      }

      ${props.disabledReason ? html`<div class="callout">${props.disabledReason}</div>` : nothing}

      ${props.error ? html`<div class="callout danger">${props.error}</div>` : nothing}

      ${renderCompactionIndicator(props.compactionStatus)}

      ${
        props.focusMode
          ? html`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${props.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${icons.x}
            </button>
          `
          : nothing
      }

      <div
        class="chat-split-container ${sidebarOpen ? "chat-split-container--open" : ""}"
      >
        <div
          class="chat-main"
          style="flex: ${sidebarOpen ? `0 0 ${splitRatio * 100}%` : "1 1 100%"}"
          @click=${sidebarOpen ? () => props.onCloseSidebar?.() : nothing}
        >
          ${thread}
          ${
            props.showScrollButton
              ? html`
                <button
                  class="chat-scroll-bottom"
                  type="button"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                  @click=${() => {
                    props.onScrollToBottom?.();
                    props.onClearNewMessages?.();
                  }}
                >
                  ${
                    props.showNewMessages
                      ? html`<span class="chat-scroll-bottom__badge"></span>`
                      : nothing
                  }
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              `
              : nothing
          }
        </div>

        ${
          sidebarOpen
            ? html`
              <resizable-divider
                .splitRatio=${splitRatio}
                @resize=${(e: CustomEvent) => props.onSplitRatioChange?.(e.detail.splitRatio)}
              ></resizable-divider>
              ${props.allyPanelOpen && props.allyProps
                ? html`
                    <div class="chat-sidebar chat-sidebar--split">
                      <div class="chat-sidebar-top">
                      ${renderMarkdownSidebar({
                            content: props.sidebarContent ?? null,
                            error: props.sidebarError ?? null,
                            mimeType: props.sidebarMimeType ?? null,
                            filePath: props.sidebarFilePath ?? null,
                            title: props.sidebarTitle ?? null,
                            onClose: props.onCloseSidebar!,
                            onViewRawText: () => {
                              if (!props.sidebarContent || !props.onOpenSidebar) {
                                return;
                              }
                              props.onOpenSidebar(props.sidebarContent, {
                                mimeType: "text/plain",
                                filePath: props.sidebarFilePath ?? null,
                                title: props.sidebarTitle ?? null,
                              });
                            },
                            onOpenFile: props.onOpenFile,
                            onPushToDrive: props.onPushToDrive,
                            driveAccounts: props.driveAccounts,
                            showDrivePicker: props.showDrivePicker,
                            driveUploading: props.driveUploading,
                            onToggleDrivePicker: props.onToggleDrivePicker,
                          })}
                    </div>
                    <resizable-divider
                      direction="vertical"
                      .splitRatio=${0.6}
                      .minRatio=${0.2}
                      .maxRatio=${0.8}
                    ></resizable-divider>
                    <div class="chat-sidebar-bottom">
                      ${renderAllyInline(props.allyProps)}
                    </div>
                  </div>
                `
                : html`
                  <div class="chat-sidebar">
                    ${renderMarkdownSidebar({
                          content: props.sidebarContent ?? null,
                          error: props.sidebarError ?? null,
                          mimeType: props.sidebarMimeType ?? null,
                          filePath: props.sidebarFilePath ?? null,
                          title: props.sidebarTitle ?? null,
                          onClose: props.onCloseSidebar!,
                          onViewRawText: () => {
                            if (!props.sidebarContent || !props.onOpenSidebar) {
                              return;
                            }
                            props.onOpenSidebar(props.sidebarContent, {
                              mimeType: "text/plain",
                              filePath: props.sidebarFilePath ?? null,
                              title: props.sidebarTitle ?? null,
                            });
                          },
                          onOpenFile: props.onOpenFile,
                          onPushToDrive: props.onPushToDrive,
                          driveAccounts: props.driveAccounts,
                          showDrivePicker: props.showDrivePicker,
                          driveUploading: props.driveUploading,
                          onToggleDrivePicker: props.onToggleDrivePicker,
                        })}
                  </div>
                `
              }
            `
            : nothing
        }
      </div>

      ${
        props.queue.length
          ? html`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${props.queue.length})</div>
              <div class="chat-queue__list">
                ${props.queue.map(
                  (item) => html`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${
                          item.text ||
                          (item.attachments?.length ? `Image (${item.attachments.length})` : "")
                        }
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${() => props.onQueueRemove(item.id)}
                      >
                        ${icons.x}
                      </button>
                    </div>
                  `,
                )}
              </div>
            </div>
          `
          : nothing
      }

      ${renderSessionResourcesStrip(props)}

      <div class="chat-compose">
        <div class="chat-compose__wrapper">
          <input
            type="file"
            id="chat-file-input"
            multiple
            style="display: none"
            @change=${(e: Event) => handleFileSelect(e, props)}
          />
          ${renderAttachmentPreview(props)}

          <div class="chat-compose__input-area">
            <textarea
              class="chat-compose__textarea"
              ${ref((el) => el && adjustTextareaHeight(el as HTMLTextAreaElement))}
              .value=${props.draft}
              ?disabled=${!props.connected}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key !== "Enter") {
                  return;
                }
                if (e.isComposing || e.keyCode === 229) {
                  return;
                }
                if (e.shiftKey) {
                  return;
                } // Allow Shift+Enter for line breaks
                if (!props.connected) {
                  return;
                }
                e.preventDefault();
                // Cmd/Ctrl+Enter = queue (wait turn), regular Enter = send (immediate/interrupt)
                const wantsQueue = e.ctrlKey || e.metaKey;
                if (canCompose) {
                  props.onSend(wantsQueue);
                }
              }}
              @input=${(e: Event) => {
                const target = e.target as HTMLTextAreaElement;
                adjustTextareaHeight(target);
                props.onDraftChange(target.value);
              }}
              @paste=${(e: ClipboardEvent) => handlePaste(e, props)}
              placeholder=${composePlaceholder}
            ></textarea>

            <div class="chat-compose__actions">
              ${props.currentModel ? html`
                <div class="model-picker-inline">
                  <button
                    class="chat-model-label chat-model-label--clickable"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      props.onToggleModelPicker?.();
                    }}
                    title="Switch model"
                  >${formatModelLabel(props.currentModel)} &#9662;</button>
                  ${props.modelPickerOpen && (props.availableModels?.length ?? 0) > 0 ? html`
                    <div class="model-picker-dropdown">
                      ${props.availableModels!.map(m => html`
                        <button
                          class="model-picker-dropdown__item ${m.id === props.currentModel ? 'model-picker-dropdown__item--active' : ''}"
                          @click=${(e: Event) => {
                            e.stopPropagation();
                            if (m.id !== props.currentModel) props.onSwitchModel?.(m.id);
                          }}
                        >
                          <span class="model-picker-dropdown__name">${m.name}</span>
                          <span class="model-picker-dropdown__provider">${m.provider}</span>
                          ${m.id === props.currentModel ? html`<span class="model-picker-dropdown__check">&#10003;</span>` : nothing}
                        </button>
                      `)}
                    </div>
                  ` : nothing}
                </div>
              ` : nothing}
              ${renderContextBadge(props)}

              <button
                class="chat-compose__toolbar-btn"
                type="button"
                title="Attach files"
                ?disabled=${!props.connected}
                @click=${() => {
                  const input = document.getElementById("chat-file-input") as HTMLInputElement;
                  input?.click();
                }}
              >
                ${icons.paperclip}
              </button>

              ${_canAbort
                ? html`
                  <button
                    class="chat-compose__send-btn chat-compose__send-btn--stop"
                    @click=${() => props.onAbort!()}
                    title="Stop generating"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="3" y="3" width="10" height="10" rx="1.5" />
                    </svg>
                  </button>
                `
                : html`
                  <button
                    class="chat-compose__send-btn"
                    ?disabled=${!props.canSend || !props.connected}
                    @click=${() => props.onSend(false)}
                    title=${isBusy ? "Send now - interrupts current run (↵)" : "Send message (↵)"}
                  >
                    ${icons.arrowUp}
                  </button>
                `
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

const CHAT_HISTORY_RENDER_LIMIT = 200;

function groupMessages(items: ChatItem[]): Array<ChatItem | MessageGroup> {
  const result: Array<ChatItem | MessageGroup> = [];
  let currentGroup: MessageGroup | null = null;

  for (const item of items) {
    if (item.kind !== "message") {
      if (currentGroup) {
        result.push(currentGroup);
        currentGroup = null;
      }
      result.push(item);
      continue;
    }

    const normalized = normalizeMessage(item.message);
    const role = normalizeRoleForGrouping(normalized.role);
    const timestamp = normalized.timestamp || Date.now();

    if (!currentGroup || currentGroup.role !== role) {
      if (currentGroup) {
        result.push(currentGroup);
      }
      currentGroup = {
        kind: "group",
        key: `group:${role}:${item.key}`,
        role,
        messages: [{ message: item.message, key: item.key }],
        timestamp,
        isStreaming: false,
      };
    } else {
      currentGroup.messages.push({ message: item.message, key: item.key });
    }
  }

  if (currentGroup) {
    result.push(currentGroup);
  }
  return result;
}

function messageHasImage(message: unknown): boolean {
  const m = message as Record<string, unknown>;
  const content = m.content;
  if (!Array.isArray(content)) {
    return false;
  }
  for (const block of content) {
    if (typeof block !== "object" || block === null) {
      continue;
    }
    const b = block as Record<string, unknown>;
    if (b.type === "image") {
      return true;
    }
    if (Array.isArray(b.content)) {
      for (const nested of b.content) {
        if (typeof nested !== "object" || nested === null) {
          continue;
        }
        if ((nested as Record<string, unknown>).type === "image") {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Returns true when an assistant message has ONLY toolCall/toolUse blocks
 * (no text, no images). These messages produce empty bubbles in the UI
 * and should be hidden when showThinking is off.
 */
function isToolCallOnlyMessage(message: unknown): boolean {
  const m = message as Record<string, unknown>;
  const content = m.content;
  if (!Array.isArray(content) || content.length === 0) {
    return false;
  }
  for (const block of content) {
    if (typeof block !== "object" || block === null) {
      continue;
    }
    const b = block as Record<string, unknown>;
    const t = typeof b.type === "string" ? b.type : "";
    // If there's any non-tool-call block, it's not tool-call-only
    if (t !== "toolCall" && t !== "tool_use" && t !== "thinking") {
      return false;
    }
  }
  return true;
}

function buildChatItems(props: ChatProps): Array<ChatItem | MessageGroup> {
  const items: ChatItem[] = [];
  const history = Array.isArray(props.messages) ? props.messages : [];
  const tools = Array.isArray(props.toolMessages) ? props.toolMessages : [];
  const historyStart = Math.max(0, history.length - CHAT_HISTORY_RENDER_LIMIT);
  if (historyStart > 0) {
    items.push({
      kind: "message",
      key: "chat:history:notice",
      message: {
        role: "system",
        content: `Showing last ${CHAT_HISTORY_RENDER_LIMIT} messages (${historyStart} hidden).`,
        timestamp: Date.now(),
      },
    });
  }
  for (let i = historyStart; i < history.length; i++) {
    const msg = history[i] as Record<string, unknown>;
    // Tag message with its original array index for image cache resolution
    msg._chatIdx = i;

    // Handle compaction summary messages with special rendering
    if (isCompactionSummary(msg)) {
      items.push({
        kind: "compaction-summary" as const,
        key: `compaction:${i}`,
        message: msg,
      } as ChatItem);
      continue;
    }

    // Hide system prompt injections (persona, consciousness dumps, heartbeat prompts)
    if (isSystemPromptNoise(msg)) {
      continue;
    }

    const normalized = normalizeMessage(msg);

    if (!props.showThinking && normalized.role.toLowerCase() === "toolresult") {
      if (!messageHasImage(msg)) {
        continue;
      }
    }

    // Skip assistant messages that have ONLY tool calls (no text or images).
    // These render as empty bubbles and create confusing empty groups when
    // tool results are also hidden (showThinking=false).
    if (
      !props.showThinking &&
      normalized.role.toLowerCase() === "assistant" &&
      isToolCallOnlyMessage(msg)
    ) {
      continue;
    }

    items.push({
      kind: "message",
      key: messageKey(msg, i),
      message: msg,
    });
  }
  if (props.showThinking) {
    for (let i = 0; i < tools.length; i++) {
      items.push({
        kind: "message",
        key: messageKey(tools[i], i + history.length),
        message: tools[i],
      });
    }
  }

  if (props.stream !== null) {
    // Deduplicate: if the last assistant message in history already contains
    // the stream text, skip the stream bubble to prevent the flash-to-duplicate
    // pattern during the final→history transition.
    let streamCoveredByHistory = false;
    if (props.stream.trim().length > 0 && history.length > 0) {
      const lastMsg = history[history.length - 1] as Record<string, unknown>;
      if (
        typeof lastMsg.role === "string" &&
        lastMsg.role.toLowerCase() === "assistant"
      ) {
        const content = lastMsg.content;
        let historyText = "";
        if (typeof content === "string") {
          historyText = content;
        } else if (Array.isArray(content)) {
          historyText = (content as Array<Record<string, unknown>>)
            .filter((b) => b.type === "text" && typeof b.text === "string")
            .map((b) => b.text as string)
            .join("");
        }
        // History covers the stream if it contains at least as much text
        if (historyText.length > 0 && historyText.length >= props.stream.trim().length) {
          streamCoveredByHistory = true;
        }
      }
    }

    if (!streamCoveredByHistory) {
      const key = `stream:${props.sessionKey}:${props.streamStartedAt ?? "live"}`;
      if (props.stream.trim().length > 0) {
        items.push({
          kind: "stream",
          key,
          text: props.stream,
          startedAt: props.streamStartedAt ?? Date.now(),
        });
      } else {
        items.push({ kind: "reading-indicator", key });
      }
    }
  } else if (props.isWorking) {
    // Show working indicator even when not streaming (e.g., running tools)
    const key = `working:${props.sessionKey}`;
    items.push({ kind: "reading-indicator", key });
  } else if (props.sending || props.canAbort) {
    // Fallback: show indicator while sending or if we can abort (run in progress)
    const key = `sending:${props.sessionKey}`;
    items.push({ kind: "reading-indicator", key });
  }

  return groupMessages(items);
}

function messageKey(message: unknown, index: number): string {
  const m = message as Record<string, unknown>;
  const toolCallId = typeof m.toolCallId === "string" ? m.toolCallId : "";
  if (toolCallId) {
    return `tool:${toolCallId}`;
  }
  const id = typeof m.id === "string" ? m.id : "";
  if (id) {
    return `msg:${id}`;
  }
  const messageId = typeof m.messageId === "string" ? m.messageId : "";
  if (messageId) {
    return `msg:${messageId}`;
  }
  // Use timestamp + role as a stable key — avoid array index which shifts
  // when new messages arrive, causing all group keys to change and
  // triggering full DOM destruction via Lit's repeat directive.
  const timestamp = typeof m.timestamp === "number" ? m.timestamp : null;
  const role = typeof m.role === "string" ? m.role : "unknown";
  if (timestamp != null) {
    // Include a content snippet for uniqueness when timestamps collide
    const content = typeof m.content === "string" ? m.content.slice(0, 32) : "";
    return `msg:${role}:${timestamp}:${content || index}`;
  }
  return `msg:${role}:${index}`;
}
