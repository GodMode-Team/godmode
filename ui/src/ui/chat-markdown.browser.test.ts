import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GodModeApp } from "./app";

// Save original method for prototype stub restoration in afterEach
const originalConnect = Object.getOwnPropertyDescriptor(GodModeApp.prototype, "connect")!
  .value as GodModeApp["connect"];

function mountApp(pathname: string) {
  window.history.replaceState({}, "", pathname);
  const app = document.createElement("godmode-app") as GodModeApp;
  document.body.append(app);
  return app;
}

beforeEach(() => {
  GodModeApp.prototype.connect = () => {
    // no-op: avoid real gateway WS connections in browser tests
  };
  window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
  localStorage.clear();
  document.body.innerHTML = "";
});

afterEach(() => {
  GodModeApp.prototype.connect = originalConnect;
  window.__OPENCLAW_CONTROL_UI_BASE_PATH__ = undefined;
  localStorage.clear();
  document.body.innerHTML = "";
});

describe("chat markdown rendering", () => {
  it("renders markdown inside tool output sidebar", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const timestamp = Date.now();
    app.chatMessages = [
      {
        role: "assistant",
        content: [
          { type: "toolcall", name: "noop", arguments: {} },
          { type: "toolresult", name: "noop", text: "Hello **world**" },
        ],
        timestamp,
      },
    ];

    await app.updateComplete;

    const toolCards = Array.from(app.querySelectorAll<HTMLElement>(".chat-tool-card"));
    const toolCard = toolCards.find((card) =>
      card.querySelector(".chat-tool-card__preview, .chat-tool-card__inline"),
    );
    expect(toolCard).not.toBeUndefined();
    toolCard?.click();

    await app.updateComplete;

    const strong = app.querySelector(".sidebar-markdown strong");
    expect(strong?.textContent).toBe("world");
  });

  it("opens workspace-relative file links from chat messages in the document viewer", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const relativePath = "docs/LINK-RELIABILITY-PROTOCOL.md";
    const request = vi.fn(async (method: string, params: Record<string, unknown>) => {
      if (method === "workspaces.list") {
        return { workspaces: [{ id: "godmode" }] };
      }
      if (method === "workspaces.readFile" && params.path === relativePath) {
        return { content: null, error: "path does not exist" };
      }
      if (
        method === "workspaces.readFile" &&
        params.workspaceId === "godmode" &&
        params.filePath === relativePath
      ) {
        return {
          content: "# Link Reliability Protocol\n\nLoaded from workspace-relative path.",
          contentType: "text/markdown",
        };
      }
      return { content: null };
    });

    app.client = { request } as unknown as GodModeApp["client"];
    app.connected = true;
    app.chatMessages = [
      {
        role: "assistant",
        content: `Open [protocol](${relativePath})`,
        timestamp: Date.now(),
      },
    ];
    await app.updateComplete;

    const link = app.querySelector<HTMLAnchorElement>(".chat-text a");
    expect(link).not.toBeNull();
    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledWith("workspaces.list", {});
      expect(request).toHaveBeenCalledWith("workspaces.readFile", {
        workspaceId: "godmode",
        filePath: relativePath,
      });
      expect(app.sidebarOpen).toBe(true);
    });
    const heading = app.querySelector<HTMLElement>(".sidebar-markdown h1");
    expect(heading?.textContent).toContain("Link Reliability Protocol");
  });

  it("opens same-origin tab-prefixed html links in the document viewer", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const request = vi.fn(async (method: string, params: Record<string, unknown>) => {
      if (method === "workspaces.readFile" && params.path === "outputs/report.html") {
        return { content: "<h1>Report</h1><p>From html file.</p>", contentType: "text/html" };
      }
      return { content: null };
    });

    app.client = { request } as unknown as GodModeApp["client"];
    app.connected = true;
    app.chatMessages = [
      {
        role: "assistant",
        content: "Open [report](/chat/outputs/report.html)",
        timestamp: Date.now(),
      },
    ];
    await app.updateComplete;

    const link = app.querySelector<HTMLAnchorElement>(".chat-text a");
    expect(link).not.toBeNull();
    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledWith("workspaces.readFile", { path: "outputs/report.html" });
      expect(app.sidebarOpen).toBe(true);
    });
    await app.updateComplete;
    const iframe = app.querySelector<HTMLIFrameElement>(".sidebar-html-frame");
    expect(iframe).not.toBeNull();
  });

  it("renders image files in the sidebar viewer", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBgR2xvwAAAABJRU5ErkJggg==";
    const request = vi.fn(async (method: string, params: Record<string, unknown>) => {
      if (method === "workspaces.readFile" && params.path === "outputs/diagram.png") {
        return { content: dataUrl, contentType: "image/png" };
      }
      return { content: null };
    });

    app.client = { request } as unknown as GodModeApp["client"];
    app.connected = true;
    app.chatMessages = [
      {
        role: "assistant",
        content: "Open [diagram](outputs/diagram.png)",
        timestamp: Date.now(),
      },
    ];
    await app.updateComplete;

    const link = app.querySelector<HTMLAnchorElement>(".chat-text a");
    expect(link).not.toBeNull();
    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledWith("workspaces.readFile", { path: "outputs/diagram.png" });
      expect(app.sidebarOpen).toBe(true);
    });
    const image = app.querySelector<HTMLImageElement>(".sidebar-image img");
    expect(image).not.toBeNull();
    expect(image?.getAttribute("src")).toBe(dataUrl);
  });

  it("opens inline code file paths from chat messages in the document viewer", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const absolutePath =
      "/home/testuser/godmode/PA-SHARED-MEMORY-IMPLEMENTATION-BRIEF-2026-02-20.md";
    const request = vi.fn(async (method: string, params: Record<string, unknown>) => {
      if (method === "workspaces.readFile" && params.path === absolutePath) {
        return { content: null, error: "path is outside allowed workspace directories" };
      }
      if (method === "files.read" && params.path === absolutePath) {
        return { content: "# Brief\n\nOpened from inline code path." };
      }
      return { content: null };
    });

    app.client = { request } as unknown as GodModeApp["client"];
    app.connected = true;
    app.chatMessages = [
      {
        role: "assistant",
        content: `Saved to \`${absolutePath}\``,
        timestamp: Date.now(),
      },
    ];
    await app.updateComplete;

    const codePath = app.querySelector<HTMLElement>(".chat-text code");
    expect(codePath).not.toBeNull();
    const innerTextNode = codePath?.firstChild;
    if (innerTextNode) {
      innerTextNode.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
      );
    } else {
      codePath?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
      );
    }

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledWith("workspaces.readFile", { path: absolutePath });
      expect(request).toHaveBeenCalledWith("files.read", {
        path: absolutePath,
        maxSize: 1_000_000,
      });
      expect(app.sidebarOpen).toBe(true);
    });
    const heading = app.querySelector<HTMLElement>(".sidebar-markdown h1");
    expect(heading?.textContent).toContain("Brief");
  });

  it("opens tilde-prefixed file links from chat messages in the document viewer", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const tildePath = "~/godmode/artifacts/trp-vsl-titan-audit.html";
    const request = vi.fn(async (method: string, params: Record<string, unknown>) => {
      if (method === "workspaces.readFile" && params.path === tildePath) {
        return { content: null, error: "path is outside allowed workspace directories" };
      }
      if (method === "files.read" && params.path === tildePath) {
        return {
          content: "<h1>TRP VSL Titan Audit</h1><p>Report content.</p>",
          contentType: "text/html",
        };
      }
      return { content: null };
    });

    app.client = { request } as unknown as GodModeApp["client"];
    app.connected = true;
    app.chatMessages = [
      {
        role: "assistant",
        content: `Here you go: [📄 TRP VSL Titan Audit](${tildePath})`,
        timestamp: Date.now(),
      },
    ];
    await app.updateComplete;

    const link = app.querySelector<HTMLAnchorElement>(".chat-text a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe(tildePath);
    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    await vi.waitFor(() => {
      // Check that the workspace readFile was attempted first
      expect(request).toHaveBeenCalledWith("workspaces.readFile", { path: tildePath });
    });
    await vi.waitFor(() => {
      // Then the files.read fallback should be called for absolute paths
      expect(request).toHaveBeenCalledWith("files.read", {
        path: tildePath,
        maxSize: 1_000_000,
      });
    });
    await vi.waitFor(() => {
      expect(app.sidebarOpen).toBe(true);
    });
    await app.updateComplete;
    const iframe = app.querySelector<HTMLIFrameElement>(".sidebar-html-frame");
    expect(iframe).not.toBeNull();
  });

  it("opens workspace-relative inline code file paths from chat list content", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const relativePath = "docs/LINK-RELIABILITY-PROTOCOL.md";
    const request = vi.fn(async (method: string, params: Record<string, unknown>) => {
      if (method === "workspaces.list") {
        return { workspaces: [{ id: "godmode" }] };
      }
      if (
        method === "workspaces.readFile" &&
        params.workspaceId === "godmode" &&
        params.filePath === relativePath
      ) {
        return {
          content: "# Link Reliability\n\nOpened from inline code list item.",
          contentType: "text/markdown",
        };
      }
      return { content: null };
    });

    app.client = { request } as unknown as GodModeApp["client"];
    app.connected = true;
    app.chatMessages = [
      {
        role: "assistant",
        content: `2. New protocol doc\n   - \`${relativePath}\``,
        timestamp: Date.now(),
      },
    ];
    await app.updateComplete;

    const codePath = app.querySelector<HTMLElement>(".chat-text code");
    expect(codePath).not.toBeNull();
    const innerTextNode = codePath?.firstChild;
    if (innerTextNode) {
      innerTextNode.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
      );
    } else {
      codePath?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
      );
    }

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledWith("workspaces.list", {});
      expect(request).toHaveBeenCalledWith("workspaces.readFile", {
        workspaceId: "godmode",
        filePath: relativePath,
      });
      expect(app.sidebarOpen).toBe(true);
    });
    const heading = app.querySelector<HTMLElement>(".sidebar-markdown h1");
    expect(heading?.textContent).toContain("Link Reliability");
  });
});
