import { render } from "lit";
import { describe, expect, it } from "vitest";
import type { MessageGroup } from "../types/chat-types";
import { renderMessageGroup } from "./grouped-render";

function renderGroup(message: unknown): HTMLDivElement {
  const group: MessageGroup = {
    kind: "group",
    key: "group:user:1",
    role: "user",
    messages: [{ key: "msg:1", message }],
    timestamp: Date.now(),
    isStreaming: false,
  };
  const container = document.createElement("div");
  render(
    renderMessageGroup(group, {
      showReasoning: false,
      assistantName: "TestAlly",
      userName: "TestUser",
    }),
    container,
  );
  return container;
}

describe("grouped-render image history handling", () => {
  it("renders a visible placeholder for sanitized image blocks", () => {
    const container = renderGroup({
      role: "user",
      content: [{ type: "image", mimeType: "image/png", omitted: true, bytes: 1048576 }],
      timestamp: Date.now(),
    });

    const placeholder = container.querySelector(".chat-message-image--omitted");
    expect(placeholder).not.toBeNull();
    expect(placeholder?.textContent ?? "").toContain("Image attached");
    expect(placeholder?.textContent ?? "").toContain("preview omitted");
  });

  it("still renders normal image previews when data is present", () => {
    const container = renderGroup({
      role: "user",
      content: [
        {
          type: "image",
          data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/woAAn8B9FD5fHAAAAAASUVORK5CYII=",
          mimeType: "image/png",
        },
      ],
      timestamp: Date.now(),
    });

    expect(container.querySelector(".chat-message-image")).not.toBeNull();
    expect(container.querySelector(".chat-message-image--omitted")).toBeNull();
  });
});
