import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GodModeApp } from "./app";
import type { WorkspaceDetail, WorkspaceSummary } from "./views/workspaces";
import "../styles.css";

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

function makeWorkspaceSummary(overrides: Partial<WorkspaceSummary> = {}): WorkspaceSummary {
  return {
    id: "godmode",
    name: "GodMode",
    emoji: "⚡",
    type: "project",
    path: "~/godmode/memory/projects/godmode",
    artifactCount: 47,
    sessionCount: 12,
    lastUpdated: new Date("2026-02-19T12:00:00.000Z"),
    ...overrides,
  };
}

function makeWorkspaceDetail(overrides: Partial<WorkspaceDetail> = {}): WorkspaceDetail {
  return {
    ...makeWorkspaceSummary(),
    pinned: [],
    pinnedSessions: [],
    outputs: [],
    sessions: [],
    tasks: [],
    ...overrides,
  };
}

describe("Workspaces tab", () => {
  it("maps /work route to Workspaces and renders base layout", async () => {
    const app = mountApp("/work");
    await app.updateComplete;

    expect(app.tab).toBe("workspaces");
    const container = app.querySelector(".workspaces-container");
    expect(container, "Should render .workspaces-container").not.toBeNull();

    const title = app.querySelector(".workspaces-title-text");
    expect(title?.textContent?.trim()).toBe("Workspaces");
    expect(app.querySelector(".workspaces-search-input")).not.toBeNull();
    expect(app.querySelector(".workspaces-create-form")).not.toBeNull();
    expect(app.querySelector(".workspaces-add-btn")?.textContent).toContain("Add Workspace");
  });

  it("shows connected empty state when there are no workspaces", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.workspaces = [];
    app.workspacesLoading = false;
    await app.updateComplete;

    const empty = app.querySelector(".workspaces-empty");
    expect(empty).not.toBeNull();
    expect(empty?.textContent).toContain("No workspaces found");
  });

  it("renders workspace cards when data is provided", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.workspaces = [
      makeWorkspaceSummary({
        id: "godmode",
        name: "GodMode",
      }),
      makeWorkspaceSummary({
        id: "patient-autopilot",
        name: "Patient Autopilot",
        emoji: "🏥",
      }),
    ];
    app.workspacesLoading = false;
    await app.updateComplete;

    const cards = app.querySelectorAll(".workspace-card");
    expect(cards.length).toBe(2);
    expect(app.textContent).toContain("GodMode");
    expect(app.textContent).toContain("Patient Autopilot");
  });

  it("filters workspace cards by top-level search query", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.workspaces = [
      makeWorkspaceSummary({ id: "gm", name: "GodMode" }),
      makeWorkspaceSummary({ id: "pa", name: "Patient Autopilot" }),
    ];
    app.workspacesSearchQuery = "patient";
    app.workspacesLoading = false;
    await app.updateComplete;

    const cards = app.querySelectorAll(".workspace-card");
    expect(cards.length).toBe(1);
    expect(cards[0]?.textContent).toContain("Patient Autopilot");
  });

  it("renders workspace detail sections for pinned/artifacts/sessions", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.workspaces = [makeWorkspaceSummary()];
    app.selectedWorkspace = makeWorkspaceDetail({
      id: "godmode",
      name: "GodMode",
      pinned: [
        {
          path: "outputs/proposal.md",
          name: "proposal.md",
          type: "markdown",
          size: 1200,
          modified: new Date("2026-02-19T12:10:00.000Z"),
        },
      ],
      outputs: [
        {
          path: "outputs/report.html",
          name: "report.html",
          type: "html",
          size: 4200,
          modified: new Date("2026-02-19T12:15:00.000Z"),
        },
      ],
      sessions: [
        {
          id: "sess-1",
          key: "agent:main:main",
          title: "Workspace architecture",
          created: new Date("2026-02-19T10:00:00.000Z"),
          status: "running",
          workspaceSubfolder: null,
        },
      ],
    });
    app.workspacesLoading = false;
    await app.updateComplete;

    const headers = Array.from(app.querySelectorAll(".ws-section__header h3")).map((el) =>
      el.textContent?.trim(),
    );
    expect(headers).toContain("Pinned");
    expect(headers).toContain("Artifacts");
    expect(headers).toContain("Sessions");
    expect(app.querySelectorAll(".ws-list--scroll").length).toBeGreaterThanOrEqual(1);
  });

  it("hides empty pinned section to avoid blank top space", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.selectedWorkspace = makeWorkspaceDetail({
      id: "godmode",
      name: "GodMode",
      pinned: [],
      pinnedSessions: [],
      outputs: [
        {
          path: "outputs/plan.md",
          name: "plan.md",
          type: "markdown",
          size: 900,
          modified: new Date("2026-02-19T12:00:00.000Z"),
        },
      ],
      sessions: [
        {
          id: "sess-1",
          key: "agent:main:main",
          title: "Workspace review",
          created: new Date("2026-02-19T09:00:00.000Z"),
          status: "complete",
          workspaceSubfolder: null,
        },
      ],
    });
    await app.updateComplete;

    const headers = Array.from(app.querySelectorAll(".ws-section__header h3")).map((el) =>
      el.textContent?.trim(),
    );
    expect(headers).not.toContain("Pinned");
    expect(headers).toContain("Artifacts");
    expect(headers).toContain("Sessions");
  });

  it("renders file rows and session rows as clickable buttons", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.selectedWorkspace = makeWorkspaceDetail({
      id: "pa",
      name: "Patient Autopilot",
      pinned: [
        {
          path: "outputs/proposal.md",
          name: "proposal.md",
          type: "markdown",
          size: 1200,
          modified: new Date("2026-02-19T12:00:00.000Z"),
        },
      ],
      sessions: [
        {
          id: "sess-1",
          key: "agent:main:main",
          title: "Review",
          created: new Date("2026-02-19T09:00:00.000Z"),
          status: "complete",
          workspaceSubfolder: null,
        },
      ],
    });
    await app.updateComplete;

    const fileButtons = app.querySelectorAll(".ws-list-main");
    expect(fileButtons.length).toBeGreaterThan(0);
    for (const button of fileButtons) {
      expect(button.tagName.toLowerCase()).toBe("button");
    }

    const sessionRows = app.querySelectorAll(".ws-list-row--button");
    expect(sessionRows.length).toBeGreaterThan(0);
    expect(app.querySelector(".ws-session-dot")).not.toBeNull();
  });

  it("filters detail sections by item search query", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.selectedWorkspace = makeWorkspaceDetail({
      id: "godmode",
      name: "GodMode",
      outputs: [
        {
          path: "outputs/proposal.md",
          name: "proposal.md",
          type: "markdown",
          size: 1000,
          modified: new Date("2026-02-19T10:00:00.000Z"),
        },
        {
          path: "outputs/report.md",
          name: "report.md",
          type: "markdown",
          size: 1000,
          modified: new Date("2026-02-19T10:00:00.000Z"),
        },
      ],
      pinned: [],
      sessions: [
        {
          id: "sess-1",
          key: "agent:main:main",
          title: "Proposal review",
          created: new Date("2026-02-19T10:00:00.000Z"),
          status: "complete",
          workspaceSubfolder: null,
        },
      ],
    });
    (app as unknown as { workspaceItemSearchQuery?: string }).workspaceItemSearchQuery = "proposal";
    app.requestUpdate();
    await app.updateComplete;

    const outputRows = Array.from(app.querySelectorAll(".ws-list-title")).map(
      (el) => el.textContent?.trim() ?? "",
    );
    expect(outputRows).toContain("proposal.md");
    expect(outputRows).not.toContain("report.md");
  });

  it("shows loading state while workspaces are loading", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = true;
    app.workspacesLoading = true;
    app.workspaces = [];
    await app.updateComplete;

    const loading = app.querySelector(".workspaces-loading");
    expect(loading).not.toBeNull();
    expect(loading?.textContent).toContain("Loading workspaces...");
  });

  it("shows disconnected empty state copy when gateway is offline", async () => {
    const app = mountApp("/workspaces");
    await app.updateComplete;

    app.connected = false;
    app.workspacesLoading = false;
    app.workspaces = [];
    await app.updateComplete;

    const empty = app.querySelector(".workspaces-empty");
    expect(empty).not.toBeNull();
    expect(empty?.textContent).toContain("Connect to gateway to see workspaces");
  });
});
