/**
 * Export the current conversation as a downloadable markdown file.
 */

import { normalizeMessage, normalizeRoleForGrouping } from "./message-normalizer";

/**
 * Format a timestamp as a readable date string.
 */
function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a single normalized message into markdown.
 */
function formatMessage(
  message: unknown,
  assistantName: string,
): string | null {
  const normalized = normalizeMessage(message);
  const groupRole = normalizeRoleForGrouping(normalized.role);

  // Skip system messages — they are injected context, not conversation
  if (groupRole === "system") {
    return null;
  }

  // Tool results: show as collapsed details block
  if (groupRole === "tool") {
    const parts: string[] = [];
    for (const item of normalized.content) {
      if (item.name) {
        parts.push(`**Tool:** ${item.name}`);
      }
      if (item.text) {
        // Truncate very long tool results
        const text = item.text.length > 2000
          ? item.text.slice(0, 2000) + "\n\n... (truncated)"
          : item.text;
        parts.push(text);
      }
    }
    if (parts.length === 0) {
      return null;
    }
    return `<details>\n<summary>Tool result</summary>\n\n${parts.join("\n\n")}\n\n</details>`;
  }

  // Determine display name
  const displayRole = groupRole === "user" || normalized.role === "User"
    ? "User"
    : assistantName;

  // Collect text content; handle tool_call items inline
  const textParts: string[] = [];
  for (const item of normalized.content) {
    if (item.type === "text" && item.text) {
      textParts.push(item.text);
    } else if (item.type === "tool_call" && item.name) {
      const argStr = item.args
        ? `\`${JSON.stringify(item.args).slice(0, 200)}\``
        : "";
      textParts.push(`> **Called tool:** \`${item.name}\` ${argStr}`);
    }
  }

  if (textParts.length === 0) {
    return null;
  }

  const timestamp = formatTimestamp(normalized.timestamp);
  return `## ${displayRole}\n_${timestamp}_\n\n${textParts.join("\n\n")}`;
}

/**
 * Format a date as YYYY-MM-DD for the filename.
 */
function formatDateForFilename(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Sanitize the session key for use in a filename.
 */
function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 60);
}

/**
 * Export the current conversation as a markdown file download.
 *
 * @param messages - The raw messages array from state.chatMessages
 * @param sessionKey - The current session key
 * @param assistantName - The display name of the assistant
 */
export function exportConversationAsMarkdown(
  messages: unknown[],
  sessionKey: string,
  assistantName: string,
): void {
  if (!messages || messages.length === 0) {
    return;
  }

  const name = assistantName || "Assistant";
  const sections: string[] = [];

  // Header
  sections.push(`# Conversation Export`);
  sections.push(`**Session:** \`${sessionKey}\`  `);
  sections.push(`**Exported:** ${formatTimestamp(Date.now())}  `);
  sections.push(`**Assistant:** ${name}`);
  sections.push("---");

  // Format each message
  for (const msg of messages) {
    const formatted = formatMessage(msg, name);
    if (formatted) {
      sections.push(formatted);
    }
  }

  const markdown = sections.join("\n\n") + "\n";

  // Create and trigger download
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `session-${sanitizeKey(sessionKey)}-${formatDateForFilename()}.md`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  requestAnimationFrame(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
