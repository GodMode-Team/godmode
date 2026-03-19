/**
 * <gm-today> — Self-contained Today/My-Day tab component.
 *
 * Extracted from the God Component (app.ts) as part of the decomposition.
 * Owns all Today-related @state properties and delegates rendering to the
 * existing `renderMyDay()` / `renderMyDayToolbar()` view functions.
 */

import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { localDateString } from "../format.js";
import { renderMyDay, renderMyDayToolbar } from "../views/my-day.js";
import type { MyDayProps, DecisionCardItem, AgentLogData } from "../views/my-day.js";
import type { DailyBriefData } from "../views/daily-brief.js";
import type { WorkspaceTask } from "../views/workspaces.js";
import type { InboxViewItem } from "../views/inbox.js";
import type { TrustSummaryData, MyDayState } from "../controllers/my-day.js";
import {
  loadMyDay,
  loadBriefOnly,
  loadAgentLogOnly,
  loadTodayTasksWithQueueStatus,
  loadTodayQueueResults,
  loadInboxItems,
  loadTrustSummary,
  openBriefInObsidian,
  syncTodayTasks,
} from "../controllers/my-day.js";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement("gm-today")
export class GmToday extends LitElement {
  // ── Shared context (read-only from parent) ─────────────────────────
  @consume({ context: appContext, subscribe: true })
  accessor ctx!: AppContext;

  // ── My Day state (owned by this component) ─────────────────────────

  @state() myDayLoading = false;
  @state() myDayError: string | null = null;

  // Date navigation
  @state() todaySelectedDate: string = localDateString();
  @state() todayViewMode: "brief" | "tasks" | "inbox" = "brief";

  // Daily Brief
  @state() dailyBrief: DailyBriefData | null = null;
  @state() dailyBriefLoading = false;
  @state() dailyBriefError: string | null = null;

  // Agent Log
  @state() agentLog: AgentLogData | null = null;
  @state() agentLogLoading = false;
  @state() agentLogError: string | null = null;

  // Brief notes
  @state() briefNotes: Record<string, string> = {};

  // Today tasks
  @state() todayTasks: WorkspaceTask[] = [];
  @state() todayTasksLoading = false;
  @state() todayEditingTaskId: string | null = null;
  @state() todayShowCompleted = false;

  // Decision cards (overnight agent results)
  @state() todayQueueResults: DecisionCardItem[] = [];

  // Universal inbox
  @state() inboxItems: InboxViewItem[] = [];
  @state() inboxLoading = false;
  @state() inboxCount = 0;
  @state() inboxScoringId: string | null = null;
  @state() inboxScoringValue: number | undefined = undefined;
  @state() inboxFeedbackText: string | undefined = undefined;
  @state() inboxSortOrder: "newest" | "oldest" = "newest";

  // Trust summary
  @state() trustSummary: TrustSummaryData | null = null;

  // ── Light DOM (existing CSS classes work) ──────────────────────────

  override createRenderRoot() {
    return this;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  override connectedCallback() {
    super.connectedCallback();
    // Auto-load data once context is available
    this.updateComplete.then(() => {
      if (this.ctx?.connected) {
        void this._loadAll();
      }
    });
  }

  // ── MyDayState bridge ──────────────────────────────────────────────
  // The controller functions from my-day.ts mutate a MyDayState object.
  // We create a thin proxy that maps mutations back to @state properties.

  private get _state(): MyDayState {
    return {
      client: this.ctx?.gateway ?? null,
      connected: this.ctx?.connected ?? false,

      // My Day
      myDayLoading: this.myDayLoading,
      myDayError: this.myDayError,

      // Daily Brief
      dailyBrief: this.dailyBrief,
      dailyBriefLoading: this.dailyBriefLoading,
      dailyBriefError: this.dailyBriefError,

      // Agent Log
      agentLog: this.agentLog,
      agentLogLoading: this.agentLogLoading,
      agentLogError: this.agentLogError,

      // Brief notes
      briefNotes: this.briefNotes,

      // Date
      todaySelectedDate: this.todaySelectedDate,

      // View mode
      todayViewMode: this.todayViewMode,

      // Tasks
      todayTasks: this.todayTasks,
      todayTasksLoading: this.todayTasksLoading,

      // Trust
      trustSummary: this.trustSummary,

      // Inbox
      inboxItems: this.inboxItems,
      inboxLoading: this.inboxLoading,
      inboxCount: this.inboxCount,

      // Methods
      loadBriefNotes: () => this._loadBriefNotes(),
    };
  }

  /** Sync mutated controller state back into reactive @state properties. */
  private _syncFromState(s: MyDayState) {
    this.myDayLoading = s.myDayLoading ?? false;
    this.myDayError = s.myDayError ?? null;
    this.dailyBrief = s.dailyBrief ?? null;
    this.dailyBriefLoading = s.dailyBriefLoading ?? false;
    this.dailyBriefError = s.dailyBriefError ?? null;
    this.agentLog = s.agentLog ?? null;
    this.agentLogLoading = s.agentLogLoading ?? false;
    this.agentLogError = s.agentLogError ?? null;
    this.briefNotes = s.briefNotes ?? {};
    this.todayTasks = s.todayTasks ?? [];
    this.todayTasksLoading = s.todayTasksLoading ?? false;
    this.trustSummary = s.trustSummary ?? null;
    this.inboxItems = s.inboxItems ?? [];
    this.inboxLoading = s.inboxLoading ?? false;
    this.inboxCount = s.inboxCount ?? 0;
  }

  // ── Data loading ───────────────────────────────────────────────────

  private async _loadAll() {
    const s = this._state;
    await loadMyDay(s);
    this._syncFromState(s);
    // Also load decision cards
    void this._loadDecisionCards();
  }

  private async _loadBriefOnly() {
    const s = this._state;
    await loadBriefOnly(s);
    this._syncFromState(s);
  }

  private async _loadBriefNotes() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const date = this.todaySelectedDate;
    try {
      const result = await gateway.request<{ notes: Record<string, string> }>(
        "briefNotes.get",
        { date },
      );
      this.briefNotes = result.notes ?? {};
    } catch (err) {
      console.error("[GmToday] Brief notes load error:", err);
      this.briefNotes = {};
    }
  }

  private async _loadDecisionCards() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      const s = this._state;
      this.todayQueueResults = await loadTodayQueueResults(s);
    } catch {
      // Non-fatal
    }
  }

  /** Reload everything (used by refresh button). */
  async refresh() {
    await this._loadAll();
  }

  // ── Date navigation handlers ───────────────────────────────────────

  private _handleDatePrev() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    this.todaySelectedDate = localDateString(d);
    void this._loadBriefOnly();
  }

  private _handleDateNext() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const today = localDateString();
    const next = localDateString(d);
    if (next > today) return;
    this.todaySelectedDate = next;
    void this._loadBriefOnly();
  }

  private _handleDateToday() {
    this.todaySelectedDate = localDateString();
    void this._loadAll();
  }

  // ── Daily Brief handlers ───────────────────────────────────────────

  private async _handleDailyBriefRefresh() {
    await this._loadBriefOnly();
  }

  private async _handleDailyBriefGenerate() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    this.dailyBriefLoading = true;
    try {
      await gateway.request("dailyBrief.generate", {});
      await this._loadBriefOnly();
    } catch (err) {
      this.dailyBriefError = err instanceof Error ? err.message : "Failed to generate brief";
    } finally {
      this.dailyBriefLoading = false;
    }
  }

  private _handleDailyBriefOpenInObsidian() {
    const date = this.dailyBrief?.date;
    openBriefInObsidian(date);
  }

  private async _handleBriefSave(content: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const date = this.dailyBrief?.date || this.todaySelectedDate;
    try {
      await gateway.request("dailyBrief.update", { date, content });
      if (this.dailyBrief) {
        this.dailyBrief = { ...this.dailyBrief, updatedAt: new Date().toISOString() };
      }
    } catch (err) {
      console.error("[GmToday] Brief save failed:", err);
      this.ctx?.addToast?.("Failed to save brief", "error");
    }
  }

  private async _handleBriefToggleCheckbox(index: number, checked: boolean) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const date = this.dailyBrief?.date || this.todaySelectedDate;
    try {
      await gateway.request("dailyBrief.toggleCheckbox", { date, index, checked });
      if (this.dailyBrief) {
        this.dailyBrief = { ...this.dailyBrief, updatedAt: new Date().toISOString() };
      }
    } catch (err) {
      console.error("[GmToday] Checkbox toggle failed:", err);
    }
  }

  // ── View mode ──────────────────────────────────────────────────────

  private _handleViewModeChange(mode: "brief" | "tasks" | "inbox") {
    this.todayViewMode = mode;
  }

  // ── Morning Set / Evening Capture ──────────────────────────────────

  private _handleStartMorningSet() {
    // Delegate to parent app via context — this needs chat tab + new session
    this.ctx?.setTab?.("chat" as any);
    const prompt =
      "Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.";
    void this.ctx?.send?.("chat.send", { message: prompt });
  }

  private _handleEveningCapture() {
    this.ctx?.setTab?.("chat" as any);
    const prompt =
      "Let's do my evening capture. Walk me through these:\n1. What went well today?\n2. What didn't get done?\n3. What should tomorrow's brief prioritize?\n4. Ask me for an overall GodMode score (1-10) for today and any feedback. Submit it with the daily rating tool.";
    void this.ctx?.send?.("chat.send", { message: prompt });
  }

  // ── Task handlers ──────────────────────────────────────────────────

  private async _handleTaskStatusChange(taskId: string, currentStatus: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    const newStatus = currentStatus === "complete" ? "pending" : "complete";
    try {
      await gateway.request("tasks.update", {
        id: taskId,
        status: newStatus,
        completedAt: newStatus === "complete" ? new Date().toISOString() : null,
      });
      const s = this._state;
      await loadTodayTasksWithQueueStatus(s);
      this.todayTasks = s.todayTasks ?? [];
      this.todayTasksLoading = s.todayTasksLoading ?? false;
    } catch (err) {
      console.error("[GmToday] Task status change failed:", err);
    }
  }

  private async _handleCreateTask(title: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("tasks.create", {
        title,
        dueDate: localDateString(),
        priority: "medium",
        source: "chat",
      });
      const s = this._state;
      await loadTodayTasksWithQueueStatus(s);
      this.todayTasks = s.todayTasks ?? [];
      this.todayTasksLoading = s.todayTasksLoading ?? false;
    } catch (err) {
      console.error("[GmToday] Create task failed:", err);
      this.ctx?.addToast?.("Failed to create task", "error");
    }
  }

  private _handleEditTask(taskId: string | null) {
    this.todayEditingTaskId = taskId;
  }

  private async _handleUpdateTask(taskId: string, updates: { title?: string; dueDate?: string | null }) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("tasks.update", { id: taskId, ...updates });
      this.todayEditingTaskId = null;
      const s = this._state;
      await loadTodayTasksWithQueueStatus(s);
      this.todayTasks = s.todayTasks ?? [];
      this.todayTasksLoading = s.todayTasksLoading ?? false;
    } catch (err) {
      console.error("[GmToday] Update task failed:", err);
      this.ctx?.addToast?.("Failed to update task", "error");
    }
  }

  private _handleToggleCompleted() {
    this.todayShowCompleted = !this.todayShowCompleted;
  }

  private async _handleViewTaskOutput(taskId: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      const queueResult = await gateway.request<{
        items: Array<{ id: string; sourceTaskId?: string; result?: { outputPath?: string; summary?: string } }>;
      }>("queue.list", { limit: 100 });
      const qi = queueResult?.items?.find((i) => i.sourceTaskId === taskId);
      if (!qi?.result?.outputPath) {
        this.ctx?.addToast?.("No output available for this task", "info");
        return;
      }
      const result = await gateway.request<{ content: string }>(
        "queue.readOutput",
        { path: qi.result.outputPath },
      );
      const title = qi.result.outputPath.split("/").pop() ?? "Agent Output";
      this.ctx?.openSidebar?.({
        content: result.content,
        mimeType: "text/markdown",
        filePath: qi.result.outputPath,
        title,
      });
    } catch (err) {
      console.error("[GmToday] View task output failed:", err);
      this.ctx?.addToast?.("Failed to load agent output", "error");
    }
  }

  private _handleStartTask(taskId: string) {
    // Task session opening requires chat tab navigation + session management
    // which is complex app-level state. Dispatch an event for the parent to handle.
    this.dispatchEvent(new CustomEvent("today-start-task", {
      detail: { taskId },
      bubbles: true,
      composed: true,
    }));
  }

  // ── Decision card handlers ─────────────────────────────────────────

  private async _handleDecisionApprove(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("queue.approve", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
    } catch (e) {
      console.error("[GmToday] Approve failed:", e);
      this.ctx?.addToast?.("Failed to approve", "error");
    }
  }

  private async _handleDecisionReject(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("queue.reject", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
    } catch (e) {
      console.error("[GmToday] Reject failed:", e);
      this.ctx?.addToast?.("Failed to reject", "error");
    }
  }

  private async _handleDecisionDismiss(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("queue.remove", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
    } catch (e) {
      console.error("[GmToday] Dismiss failed:", e);
      this.ctx?.addToast?.("Failed to dismiss", "error");
    }
  }

  private async _handleDecisionMarkComplete(id: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      const item = this.todayQueueResults?.find((r) => r.id === id);
      if (item?.sourceTaskId) {
        await gateway.request("tasks.update", { id: item.sourceTaskId, status: "complete" });
      }
      await gateway.request("queue.remove", { id });
      this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
      this.ctx?.addToast?.("Task marked complete", "success");
    } catch (e) {
      console.error("[GmToday] Mark complete failed:", e);
      this.ctx?.addToast?.("Failed to mark complete", "error");
    }
  }

  private async _handleDecisionRate(id: string, workflow: string, rating: number) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("trust.rate", { workflow, rating });
      const needsFeedback = rating < 7;
      this.todayQueueResults = this.todayQueueResults.map((r) =>
        r.id === id ? { ...r, userRating: rating, feedbackPending: needsFeedback } : r,
      );
      if (!needsFeedback) {
        const item = this.todayQueueResults?.find((r) => r.id === id);
        if (item?.source === "cron") {
          await gateway.request("queue.remove", { id });
          this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
        }
        this.ctx?.addToast?.(`Rated ${workflow} ${rating}/10`, "success");
      } else {
        this.ctx?.addToast?.(`Rated ${workflow} ${rating}/10 — what could be better?`, "info");
      }
    } catch (e) {
      console.error("[GmToday] Rate failed:", e);
      this.ctx?.addToast?.("Failed to submit rating", "error");
    }
  }

  private async _handleDecisionFeedback(id: string, workflow: string, feedback: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      if (feedback) {
        await gateway.request("trust.feedback", { workflow, feedback });
        this.ctx?.addToast?.(`Feedback saved for ${workflow} — will apply next time`, "success");
      }
      const item = this.todayQueueResults?.find((r) => r.id === id);
      if (item?.source === "cron") {
        await gateway.request("queue.remove", { id });
      }
      this.todayQueueResults = this.todayQueueResults
        .map((r) => (r.id === id ? { ...r, feedbackPending: false } : r))
        .filter((r) => !(r.id === id && r.source === "cron"));
    } catch (e) {
      console.error("[GmToday] Feedback failed:", e);
      this.ctx?.addToast?.("Failed to save feedback", "error");
    }
  }

  private _handleDecisionViewOutput(id: string, outputPath: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) {
      this.ctx?.addToast?.("Not connected to gateway", "error");
      return;
    }
    gateway
      .request<{ content: string }>("queue.readOutput", { path: outputPath })
      .then((result) => {
        const title = outputPath.split("/").pop() ?? "Agent Output";
        this.ctx?.openSidebar?.({
          content: result.content,
          mimeType: "text/markdown",
          filePath: outputPath,
          title,
        });
      })
      .catch((err) => {
        console.error("[GmToday] View output failed:", err);
        // Dispatch event for parent to handle file opening
        this.dispatchEvent(new CustomEvent("today-open-file", {
          detail: { path: outputPath },
          bubbles: true,
          composed: true,
        }));
      });
  }

  private _handleDecisionOpenChat(id: string) {
    // Opening chat for a decision card requires complex session management.
    // Dispatch an event for the parent to handle.
    this.dispatchEvent(new CustomEvent("today-decision-open-chat", {
      detail: { id, item: this.todayQueueResults?.find((r) => r.id === id) },
      bubbles: true,
      composed: true,
    }));
  }

  // ── Inbox handlers ─────────────────────────────────────────────────

  private async _handleInboxRefresh() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    this.inboxLoading = true;
    try {
      const result = await gateway.request<{
        items: InboxViewItem[];
        total: number;
        pendingCount: number;
      }>("inbox.list", { status: "pending", limit: 50 });
      this.inboxItems = result.items;
      this.inboxCount = result.pendingCount;
    } catch (err) {
      console.error("[GmToday] Inbox load failed:", err);
    } finally {
      this.inboxLoading = false;
    }
  }

  private async _handleInboxScore(itemId: string, score: number, feedback?: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("inbox.score", { itemId, score, feedback });
      this.inboxScoringId = null;
      this.inboxScoringValue = undefined;
      this.inboxFeedbackText = undefined;
      await this._handleInboxRefresh();
    } catch (err) {
      console.error("[GmToday] Inbox score failed:", err);
    }
  }

  private async _handleInboxDismiss(itemId: string) {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("inbox.dismiss", { itemId });
      await this._handleInboxRefresh();
    } catch (err) {
      console.error("[GmToday] Inbox dismiss failed:", err);
    }
  }

  private async _handleInboxMarkAll() {
    const gateway = this.ctx?.gateway;
    if (!gateway || !this.ctx?.connected) return;
    try {
      await gateway.request("inbox.markAllComplete", {});
      await this._handleInboxRefresh();
    } catch (err) {
      console.error("[GmToday] Inbox mark all failed:", err);
    }
  }

  private _handleInboxViewOutput(itemId: string) {
    const item = this.inboxItems?.find((i) => i.id === itemId);
    if (!item) return;
    const gateway = this.ctx?.gateway;
    if (item.outputPath && gateway) {
      gateway
        .request<{ content: string }>("files.read", { path: item.outputPath, maxSize: 500_000 })
        .then((result) => {
          if (result?.content) {
            this.ctx?.openSidebar?.({
              content: result.content,
              mimeType: "text/markdown",
              filePath: item.outputPath!,
              title: item.title,
            });
          }
        })
        .catch((err) => {
          console.error("[GmToday] Inbox view output failed:", err);
        });
      return;
    }
    // Fall back to proof doc via event
    if (item.proofDocSlug) {
      this.dispatchEvent(new CustomEvent("today-open-proof", {
        detail: { slug: item.proofDocSlug },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _handleInboxViewProof(itemId: string) {
    const item = this.inboxItems?.find((i) => i.id === itemId);
    if (!item?.proofDocSlug) return;
    this.dispatchEvent(new CustomEvent("today-open-proof", {
      detail: { slug: item.proofDocSlug },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleInboxOpenChat(itemId: string) {
    // Complex session management — dispatch event for parent
    this.dispatchEvent(new CustomEvent("today-inbox-open-chat", {
      detail: { itemId, item: this.inboxItems?.find((i) => i.id === itemId) },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleInboxSetScoring(itemId: string | null, score?: number) {
    if (itemId !== this.inboxScoringId) {
      this.inboxFeedbackText = "";
    }
    this.inboxScoringId = itemId;
    this.inboxScoringValue = score ?? 7;
  }

  private _handleInboxFeedbackChange(text: string) {
    this.inboxFeedbackText = text;
  }

  private _handleInboxSortToggle() {
    this.inboxSortOrder = this.inboxSortOrder === "newest" ? "oldest" : "newest";
  }

  // ── Trust handlers ─────────────────────────────────────────────────

  private async _handleTrustDailyRate(rating: number) {
    const gateway = this.ctx?.gateway;
    if (!gateway) return;
    try {
      await gateway.request("trust.dailyRate", { rating });
      if (this.trustSummary) {
        this.trustSummary = { ...this.trustSummary, todayRated: true };
      }
    } catch (err) {
      console.error("[GmToday] Daily rate failed:", err);
      this.ctx?.addToast?.("Failed to submit daily rating", "error");
    }
  }

  private _handleNavigateToTrust() {
    this.ctx?.setTab?.("trust" as any);
  }

  // ── File open handler ──────────────────────────────────────────────

  private _handleOpenFile(path: string) {
    this.dispatchEvent(new CustomEvent("today-open-file", {
      detail: { path },
      bubbles: true,
      composed: true,
    }));
  }

  // ── Render ─────────────────────────────────────────────────────────

  /**
   * Render the toolbar (date nav, view mode tabs, quick actions).
   * Called separately by the parent to place in the page header area.
   */
  renderToolbar() {
    return renderMyDayToolbar({
      connected: this.ctx?.connected ?? false,
      onRefresh: () => void this.refresh(),
      selectedDate: this.todaySelectedDate,
      onDatePrev: () => this._handleDatePrev(),
      onDateNext: () => this._handleDateNext(),
      onDateToday: () => this._handleDateToday(),
      viewMode: this.todayViewMode,
      onViewModeChange: (mode) => this._handleViewModeChange(mode),
      focusPulseActive: false,
      onStartMorningSet: () => this._handleStartMorningSet(),
      inboxItems: this.inboxItems,
      inboxCount: this.inboxCount,
      onEveningCapture: () => this._handleEveningCapture(),
    });
  }

  override render() {
    const props: MyDayProps = {
      connected: this.ctx?.connected ?? false,
      loading: this.myDayLoading,
      error: this.myDayError,
      onRefresh: () => void this.refresh(),

      // Daily Brief
      dailyBrief: this.dailyBrief,
      dailyBriefLoading: this.dailyBriefLoading,
      dailyBriefError: this.dailyBriefError,
      onBriefRefresh: () => void this._handleDailyBriefRefresh(),
      onBriefGenerate: () => void this._handleDailyBriefGenerate(),
      onBriefOpenInObsidian: () => this._handleDailyBriefOpenInObsidian(),
      onBriefSave: (content: string) => void this._handleBriefSave(content),
      onBriefToggleCheckbox: (index: number, checked: boolean) =>
        void this._handleBriefToggleCheckbox(index, checked),
      onOpenFile: (path: string) => this._handleOpenFile(path),

      // Date navigation
      selectedDate: this.todaySelectedDate,
      onDatePrev: () => this._handleDatePrev(),
      onDateNext: () => this._handleDateNext(),
      onDateToday: () => this._handleDateToday(),

      // View mode
      viewMode: this.todayViewMode,
      onViewModeChange: (mode) => this._handleViewModeChange(mode),

      // Agent log
      agentLog: this.agentLog,
      agentLogLoading: this.agentLogLoading,
      agentLogError: this.agentLogError,
      onAgentLogRefresh: () => void this.refresh(),

      // Focus Pulse / Morning Set
      focusPulseActive: false,
      onStartMorningSet: () => this._handleStartMorningSet(),

      // Today tasks
      todayTasks: this.todayTasks,
      todayTasksLoading: this.todayTasksLoading,
      onToggleTaskComplete: (taskId: string, currentStatus: string) =>
        void this._handleTaskStatusChange(taskId, currentStatus),
      onStartTask: (taskId: string) => this._handleStartTask(taskId),
      onViewTaskOutput: (taskId: string) => void this._handleViewTaskOutput(taskId),

      // Task panel additions
      onCreateTask: (title: string) => void this._handleCreateTask(title),
      onEditTask: (taskId: string | null) => this._handleEditTask(taskId),
      onUpdateTask: (taskId: string, updates: { title?: string; dueDate?: string | null }) =>
        void this._handleUpdateTask(taskId, updates),
      editingTaskId: this.todayEditingTaskId,
      showCompletedTasks: this.todayShowCompleted,
      onToggleCompletedTasks: () => this._handleToggleCompleted(),

      // Decision cards
      decisionCards:
        (this.todayQueueResults ?? []).length > 0
          ? {
              items: this.todayQueueResults,
              onApprove: (id: string) => void this._handleDecisionApprove(id),
              onReject: (id: string) => void this._handleDecisionReject(id),
              onDismiss: (id: string) => void this._handleDecisionDismiss(id),
              onViewOutput: (id: string, path: string) => this._handleDecisionViewOutput(id, path),
              onOpenChat: (id: string) => this._handleDecisionOpenChat(id),
              onMarkComplete: (id: string) => void this._handleDecisionMarkComplete(id),
              onRate: (id: string, workflow: string, rating: number) =>
                void this._handleDecisionRate(id, workflow, rating),
              onFeedback: (id: string, workflow: string, feedback: string) =>
                void this._handleDecisionFeedback(id, workflow, feedback),
            }
          : undefined,

      // Inbox
      inboxItems: this.inboxItems,
      inboxLoading: this.inboxLoading,
      inboxCount: this.inboxCount,
      inboxScoringId: this.inboxScoringId,
      inboxScoringValue: this.inboxScoringValue,
      inboxFeedbackText: this.inboxFeedbackText,
      onInboxViewOutput: (itemId: string) => this._handleInboxViewOutput(itemId),
      onInboxViewProof: (itemId: string) => this._handleInboxViewProof(itemId),
      onInboxOpenChat: (itemId: string) => this._handleInboxOpenChat(itemId),
      onInboxDismiss: (itemId: string) => void this._handleInboxDismiss(itemId),
      onInboxScore: (itemId: string, score: number, feedback?: string) =>
        void this._handleInboxScore(itemId, score, feedback),
      onInboxSetScoring: (itemId: string | null, score?: number) =>
        this._handleInboxSetScoring(itemId, score),
      onInboxFeedbackChange: (text: string) => this._handleInboxFeedbackChange(text),
      onInboxSortToggle: () => this._handleInboxSortToggle(),
      inboxSortOrder: this.inboxSortOrder,
      onInboxMarkAll: () => void this._handleInboxMarkAll(),

      // Trust summary
      trustSummary: this.trustSummary,
      onTrustDailyRate: (rating: number) => void this._handleTrustDailyRate(rating),
      onNavigateToTrust: () => this._handleNavigateToTrust(),

      // Evening capture
      onEveningCapture: () => this._handleEveningCapture(),
    };

    return renderMyDay(props);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gm-today": GmToday;
  }
}
