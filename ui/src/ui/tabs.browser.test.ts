import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GodModeApp } from "./app";
import "../styles.css";

const originalConnect = GodModeApp.prototype.connect;

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

describe("tab strip — 3 core tabs only", () => {
  it("renders exactly Chat, Today, Work as main nav items", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    // Get all nav items in the first (unlabeled) nav group
    const allNavItems = app.querySelectorAll<HTMLAnchorElement>("a.nav-item");
    const mainTabs: { href: string; text: string }[] = [];

    for (const item of allNavItems) {
      const href = item.getAttribute("href") ?? "";
      // Main tabs are /chat, /today, /work — filter out Control/Agent/Settings groups
      if (["/chat", "/today", "/work"].includes(href)) {
        const textEl = item.querySelector(".nav-item__text");
        mainTabs.push({ href, text: textEl?.textContent?.trim() ?? "" });
      }
    }

    expect(mainTabs).toHaveLength(3);
    expect(mainTabs[0]).toEqual({ href: "/chat", text: "Chat" });
    expect(mainTabs[1]).toEqual({ href: "/today", text: "Today" });
    expect(mainTabs[2]).toEqual({ href: "/work", text: "Work" });
  });

  it("does NOT render People, Life, or Data tabs", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const removedPaths = ["/people", "/life", "/data"];
    for (const path of removedPaths) {
      const link = app.querySelector<HTMLAnchorElement>(`a.nav-item[href="${path}"]`);
      expect(link, `Tab with href="${path}" should not exist`).toBeNull();
    }
  });

  it("navigates to Workspaces tab when clicking its nav item", async () => {
    const app = mountApp("/chat");
    await app.updateComplete;

    const link = app.querySelector<HTMLAnchorElement>('a.nav-item[href="/work"]');
    expect(link).not.toBeNull();
    link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

    await app.updateComplete;
    expect(app.tab).toBe("work");
    expect(window.location.pathname).toBe("/work");
  });

  it("shows Workspaces tab as active when navigated to /work", async () => {
    const app = mountApp("/work");
    await app.updateComplete;

    const link = app.querySelector<HTMLAnchorElement>('a.nav-item[href="/work"]');
    expect(link).not.toBeNull();
    expect(link?.classList.contains("active")).toBe(true);
  });
});
