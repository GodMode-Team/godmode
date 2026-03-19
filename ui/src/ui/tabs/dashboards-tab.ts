/**
 * <gm-dashboards> — Extracted Dashboards tab component.
 *
 * Owns all dashboard-related @state properties (moved out of the God Component).
 * Consumes AppContext for shared state (connected, gateway, sidebar, toast, nav).
 * Delegates rendering to ../views/dashboards.js and data loading to
 * ../controllers/dashboards.js.  Cross-tab actions (create via chat, open session)
 * go through the event bus.
 */

import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";
import {
  renderDashboards,
  type DashboardsProps,
} from "../views/dashboards.js";
import {
  loadDashboards,
  loadDashboard,
  deleteDashboard,
  toggleDashboardPin,
  type DashboardManifest,
  type DashboardsState,
} from "../controllers/dashboards.js";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement("gm-dashboards")
export class GmDashboards extends LitElement {
  // -- Shared context (provided by root app) --------------------------------

  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  // -- Owned state (all dashboard properties) --------------------------------

  @state() dashboardsList: DashboardManifest[] | undefined;
  @state() dashboardsLoading = false;
  @state() dashboardsError: string | null = null;
  @state() activeDashboardId: string | null = null;
  @state() activeDashboardHtml: string | null = null;
  @state() activeDashboardManifest: DashboardManifest | null = null;
  @state() dashboardCategoryFilter: string | null = null;

  /** Track which dashboard sessions are currently "working" (streaming). */
  @state() private _workingSessionIds = new Set<string>();

  // -- Event-bus subscription cleanup ----------------------------------------

  private _unsubs: Array<() => void> = [];

  // -- Light DOM (no shadow root) so existing CSS classes work ---------------

  override createRenderRoot() {
    return this;
  }

  // -- DashboardsState interface for controller functions --------------------

  get client() {
    return this.ctx.gateway;
  }

  get connected() {
    return this.ctx.connected;
  }

  // -- Lifecycle -------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();

    // Listen for external refresh requests (e.g. after an agent creates a dashboard)
    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "dashboards") {
          void this._refresh();
        }
      }),
    );

    // Auto-load initial data
    void this._refresh();
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    super.disconnectedCallback();
  }

  // -- Render ----------------------------------------------------------------

  override render() {
    const sessionId = this.activeDashboardManifest?.sessionId;

    return renderDashboards({
      connected: this.ctx.connected,
      loading: this.dashboardsLoading,
      error: this.dashboardsError,
      dashboards: this.dashboardsList,
      activeDashboardId: this.activeDashboardId,
      activeDashboardHtml: this.activeDashboardHtml,
      activeDashboardManifest: this.activeDashboardManifest,
      isWorking: sessionId
        ? this._workingSessionIds.has(sessionId)
        : false,
      onSelectDashboard: (id) => this._onSelectDashboard(id),
      onDeleteDashboard: (id) => this._onDeleteDashboard(id),
      onCreateViaChat: (prompt?: string) => this._onCreateViaChat(prompt),
      onTogglePin: (id) => this._onTogglePin(id),
      categoryFilter: this.dashboardCategoryFilter ?? undefined,
      onCategoryFilter: (cat) => this._onCategoryFilter(cat),
      onBack: () => this._onBack(),
      onRefresh: () => this._refresh(),
      onOpenSession: (id) => this._onOpenSession(id),
    } satisfies DashboardsProps);
  }

  // -- Handlers (logic moved from app.ts) ------------------------------------

  private async _refresh(): Promise<void> {
    await loadDashboards(this as unknown as DashboardsState);
    this.requestUpdate();
  }

  private async _onSelectDashboard(id: string): Promise<void> {
    await loadDashboard(this as unknown as DashboardsState, id);
    this.requestUpdate();

    // Open/get the persistent session for this dashboard so inline chat works
    if (this.ctx.gateway && this.ctx.connected) {
      try {
        const result = await this.ctx.gateway.request<{
          sessionId: string;
          created: boolean;
          manifest: { title: string; id: string; widgets?: string[] };
        }>("dashboards.openSession", { dashboardId: id });

        if (result?.sessionId) {
          // Update manifest with sessionId
          if (this.activeDashboardManifest) {
            this.activeDashboardManifest = {
              ...this.activeDashboardManifest,
              sessionId: result.sessionId,
            };
          }

          // Navigate chat to this session via event bus
          appEventBus.emit("chat-navigate", {
            sessionKey: result.sessionId,
          });
        }
      } catch (err) {
        console.error("[Dashboards] Failed to init session on select:", err);
        // Non-critical — dashboard still renders, just no inline chat
      }
    }
  }

  private async _onDeleteDashboard(id: string): Promise<void> {
    await deleteDashboard(this as unknown as DashboardsState, id);
    this.requestUpdate();
  }

  private async _onTogglePin(id: string): Promise<void> {
    await toggleDashboardPin(this as unknown as DashboardsState, id);
    this.requestUpdate();
  }

  private _onCreateViaChat(prompt?: string): void {
    appEventBus.emit("chat-navigate", {
      sessionKey: "new",
      tab: "chat",
      message:
        prompt ??
        "I want to create a custom dashboard. Ask me what data I want to see " +
          "and design it for me. You can use any of GodMode's data \u2014 tasks, " +
          "calendar, focus pulse, goals, trust scores, agent activity, queue " +
          "status, coding tasks, workspace stats, and more.",
    });
  }

  private _onCategoryFilter(category: string | null): void {
    this.dashboardCategoryFilter = category;
  }

  private _onBack(): void {
    this.activeDashboardId = null;
    this.activeDashboardHtml = null;
    this.activeDashboardManifest = null;
  }

  private _onOpenSession(dashboardId: string): void {
    const sessionId = this.activeDashboardManifest?.sessionId;
    if (!sessionId) {
      this.ctx.addToast("No session for this dashboard", "error");
      return;
    }

    // Clear active dashboard state — user is intentionally leaving to chat
    this.activeDashboardId = null;
    this.activeDashboardHtml = null;
    this.activeDashboardManifest = null;

    // Navigate to the dashboard's chat session
    appEventBus.emit("chat-navigate", {
      sessionKey: sessionId,
      tab: "chat",
    });
  }
}

// Ensure the module is importable as a side-effect registration
declare global {
  interface HTMLElementTagNameMap {
    "gm-dashboards": GmDashboards;
  }
}
