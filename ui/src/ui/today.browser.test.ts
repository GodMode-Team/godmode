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

describe("Today tab — simplified markdown brief viewer", () => {
  it("renders a markdown content area (brief-section)", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const briefSection = app.querySelector(".brief-section");
    expect(briefSection, "Should have a .brief-section element").not.toBeNull();
  });

  it("does NOT render a calendar widget (schedule-section)", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const calendarWidget = app.querySelector(".schedule-section");
    expect(calendarWidget, "Should NOT have a .schedule-section").toBeNull();

    const calendarTimeline = app.querySelector(".calendar-timeline");
    expect(calendarTimeline, "Should NOT have a .calendar-timeline").toBeNull();
  });

  it("does NOT render a tasks module (tasks-section)", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const tasksSection = app.querySelector(".tasks-section");
    expect(tasksSection, "Should NOT have a .tasks-section").toBeNull();

    const tasksList = app.querySelector(".tasks-list");
    expect(tasksList, "Should NOT have a .tasks-list").toBeNull();
  });

  it("does NOT render agents section", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const agentsSection = app.querySelector(".agents-section");
    expect(agentsSection, "Should NOT have an .agents-section").toBeNull();
  });

  it("renders the My Day / Agent Log toggle", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const toggle = app.querySelector(".today-view-toggle");
    expect(toggle, "Should have a .today-view-toggle element").not.toBeNull();

    // Check there are two toggle buttons: My Day and Agent Log
    const buttons = app.querySelectorAll(".today-view-toggle button");
    expect(buttons.length).toBe(2);

    const labels = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(labels).toContain("My Day");
    expect(labels).toContain("Agent Log");
  });

  it("renders date navigation with prev/next arrows", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const dateNav = app.querySelector(".today-date-nav");
    expect(dateNav, "Should have .today-date-nav").not.toBeNull();

    const dateLabel = app.querySelector(".today-date-label");
    expect(dateLabel, "Should have a .today-date-label").not.toBeNull();

    // Should have prev and next buttons
    const dateBtns = app.querySelectorAll(".today-date-btn");
    expect(dateBtns.length).toBeGreaterThanOrEqual(2);
  });

  it("brief is always-editable (no click-to-edit toggle)", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    // The brief section should exist
    const briefSection = app.querySelector(".brief-section");
    expect(briefSection, "Brief section should exist").not.toBeNull();

    // Should NOT have the old click-to-edit wrapper
    const contentWrapper = app.querySelector(".brief-content-wrapper");
    expect(contentWrapper, "Should NOT have old .brief-content-wrapper").toBeNull();

    // Should NOT have old edit toggle buttons or Save/Cancel
    const editToggle = app.querySelector(".brief-edit-toggle-btn");
    expect(editToggle, "Should NOT have .brief-edit-toggle-btn").toBeNull();
    const saveBtn = app.querySelector(".brief-edit-save-btn");
    expect(saveBtn, "Should NOT have .brief-edit-save-btn").toBeNull();
  });

  it("does NOT render readiness score or summary stats in header", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const summaryStats = app.querySelector(".my-day-summary");
    expect(summaryStats, "Should NOT have .my-day-summary").toBeNull();

    const summaryValue = app.querySelector(".summary-value");
    expect(summaryValue, "Should NOT have .summary-value").toBeNull();
  });

  it("does NOT render the split layout with tasks panel", async () => {
    const app = mountApp("/today");
    await app.updateComplete;

    const tasksPanel = app.querySelector(".today-tasks-panel");
    expect(tasksPanel, "Should NOT have .today-tasks-panel").toBeNull();
  });
});
