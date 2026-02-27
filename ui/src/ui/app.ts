import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  handleChannelConfigReload as handleChannelConfigReloadInternal,
  handleChannelConfigSave as handleChannelConfigSaveInternal,
  handleNostrProfileCancel as handleNostrProfileCancelInternal,
  handleNostrProfileEdit as handleNostrProfileEditInternal,
  handleNostrProfileFieldChange as handleNostrProfileFieldChangeInternal,
  handleNostrProfileImport as handleNostrProfileImportInternal,
  handleNostrProfileSave as handleNostrProfileSaveInternal,
  handleNostrProfileToggleAdvanced as handleNostrProfileToggleAdvancedInternal,
  handleWhatsAppLogout as handleWhatsAppLogoutInternal,
  handleWhatsAppStart as handleWhatsAppStartInternal,
  handleWhatsAppWait as handleWhatsAppWaitInternal,
} from "./app-channels";
import {
  handleAbortChat as handleAbortChatInternal,
  handleSendChat as handleSendChatInternal,
  removeQueuedMessage as removeQueuedMessageInternal,
} from "./app-chat";
import { DEFAULT_CRON_FORM, DEFAULT_LOG_LEVEL_FILTERS } from "./app-defaults";
import type { EventLogEntry } from "./app-events";
import { connectGateway as connectGatewayInternal } from "./app-gateway";
import {
  handleConnected,
  handleDisconnected,
  handleFirstUpdated,
  handleUpdated,
} from "./app-lifecycle";
import { renderApp } from "./app-render";
import {
  exportLogs as exportLogsInternal,
  handleChatScroll as handleChatScrollInternal,
  handleLogsScroll as handleLogsScrollInternal,
  resetChatScroll as resetChatScrollInternal,
} from "./app-scroll";
import {
  applySettings as applySettingsInternal,
  loadCron as loadCronInternal,
  loadOverview as loadOverviewInternal,
  setTab as setTabInternal,
  setTheme as setThemeInternal,
  onPopState as onPopStateInternal,
} from "./app-settings";
import {
  resetToolStream as resetToolStreamInternal,
  type ToolStreamEntry,
} from "./app-tool-stream";
import {
  resolveInjectedAssistantIdentity,
  resolveInjectedUserIdentity,
} from "./assistant-identity";
import { loadAssistantIdentity as loadAssistantIdentityInternal } from "./controllers/assistant-identity";
import type { FailedMessage } from "./controllers/chat";
import { retryPendingMessage } from "./controllers/chat";
// ClickUp task type removed — Mission Control uses native tasks
import type { DevicePairingList } from "./controllers/devices";
import type { ExecApprovalRequest } from "./controllers/exec-approval";
import type { ExecApprovalsFile, ExecApprovalsSnapshot } from "./controllers/exec-approvals";
import {
  loadFocusPulse as loadFocusPulseInternal,
  startMorningSet as startMorningSetInternal,
  setFocus as setFocusInternal,
  completeFocus as completeFocusInternal,
  runPulseCheck as runPulseCheckInternal,
  endDay as endDayInternal,
  type FocusPulseData,
} from "./controllers/focus-pulse";
import {
  loadTrustTracker as loadTrustTrackerInternal,
  addTrustWorkflow as addTrustWorkflowInternal,
  removeTrustWorkflow as removeTrustWorkflowInternal,
  type TrustTrackerData,
} from "./controllers/trust-tracker";
import {
  loadLifetracks as loadLifetracksInternal,
  selectLifetrack as selectLifetrackInternal,
  enableLifetracks as enableLifetracksInternal,
  generateLifetrack as generateLifetrackInternal,
  type LifetrackEntry,
  type LifetracksState,
} from "./controllers/lifetracks";
import { startMeetingNotifications, stopMeetingNotifications } from "./controllers/meeting-notify";
import {
  handleMissionRefresh as handleMissionRefreshInternal,
  handleMissionTaskComplete as handleMissionTaskCompleteInternal,
} from "./controllers/mission";
// GodMode view controllers
import {
  loadMyDay as loadMyDayInternal,
  loadBriefOnly as loadBriefOnlyInternal,
  loadAgentLogOnly as loadAgentLogOnlyInternal,
  openBriefInObsidian as openBriefInObsidianInternal,
  subscribeToAgentLogUpdates,
} from "./controllers/my-day";
import { loadPeople as loadPeopleInternal } from "./controllers/people";
import { loadVisionBoard as loadVisionBoardInternal } from "./controllers/vision-board";
import {
  loadWheelOfLife as loadWheelOfLifeInternal,
  updateWheelOfLife as updateWheelOfLifeInternal,
  enterWheelEditMode as enterWheelEditModeInternal,
  cancelWheelEditMode as cancelWheelEditModeInternal,
} from "./controllers/wheel-of-life";
import {
  loadWork as loadWorkInternal,
  loadProjectDetails as loadProjectDetailsInternal,
} from "./controllers/work";
import { loadWorkspaces as loadWorkspacesInternal } from "./controllers/workspaces";
import type { GatewayBrowserClient, GatewayHelloOk } from "./gateway";
import type { Tab } from "./navigation";
import { loadSettings, type UiSettings } from "./storage";
import type { ResolvedTheme, ThemeMode } from "./theme";
import type { Toast } from "./toast";
import { addToast, createToast, removeToast } from "./toast";
import type {
  AgentsListResult,
  ConfigSnapshot,
  ConfigUiHints,
  CronJob,
  CronRunLogEntry,
  CronStatus,
  HealthSnapshot,
  LogEntry,
  LogLevel,
  PresenceEntry,
  ChannelsStatusSnapshot,
  SessionsListResult,
  SkillStatusReport,
  StatusSummary,
  NostrProfile,
} from "./types";
import type { ToolExecutionInfo } from "./types/chat-types";
import { type ChatAttachment, type ChatQueueItem, type CronFormState } from "./ui-types";
import type { NostrProfileFormState } from "./views/channels.nostr-profile-form";
import type { LifetracksConfig } from "./views/lifetracks";
import type { TaskFilter, WorkspaceDetail, WorkspaceSummary, WorkspaceTask } from "./views/workspaces";

declare global {
  interface Window {
    __OPENCLAW_CONTROL_UI_BASE_PATH__?: string;
  }
}

// Note: These are evaluated lazily via getters to ensure window globals are set
function getInjectedAssistantIdentity() {
  return resolveInjectedAssistantIdentity();
}
function getInjectedUserIdentity() {
  return resolveInjectedUserIdentity();
}

function resolveOnboardingMode(): boolean {
  if (!window.location.search) {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("onboarding");
  if (!raw) {
    return false;
  }
  const normalized = raw.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

const CHAT_FILE_LINK_TAB_PREFIXES = new Set([
  "chat",
  "today",
  "workspaces",
  "work",
  "people",
  "life",
  "data",
  "overview",
  "mission",
  "channels",
  "instances",
  "sessions",
  "cron",
  "skills",
  "nodes",
  "config",
  "debug",
  "logs",
  "wheel-of-life",
  "vision-board",
  "lifetracks",
  "my-day",
]);

const CHAT_FILE_LINK_QUERY_KEYS = ["path", "filePath", "file", "workspacePath"] as const;

@customElement("godmode-app")
export class GodModeApp extends LitElement {
  @state() settings: UiSettings = loadSettings();
  @state() password = "";
  @state() tab: Tab = "chat";
  @state() onboarding = resolveOnboardingMode();
  @state() connected = false;
  @state() reconnecting = false;
  @state() reconnectAttempt = 0;
  @state() theme: ThemeMode = this.settings.theme ?? "system";
  @state() themeResolved: ResolvedTheme = "dark";
  @state() hello: GatewayHelloOk | null = null;
  @state() lastError: string | null = null;
  @state() eventLog: EventLogEntry[] = [];
  private toolStreamSyncTimer: number | null = null;
  private sidebarCloseTimer: number | null = null;
  sessionPickerClickOutsideHandler: ((e: MouseEvent) => void) | null = null;
  sessionSearchClickOutsideHandler: ((e: MouseEvent) => void) | null = null;

  @state() assistantName = getInjectedAssistantIdentity().name;
  @state() assistantAvatar = getInjectedAssistantIdentity().avatar;
  @state() assistantAgentId = getInjectedAssistantIdentity().agentId ?? null;

  @state() userName = getInjectedUserIdentity().name;
  @state() userAvatar = getInjectedUserIdentity().avatar;

  @state() sessionKey = this.settings.sessionKey;
  @state() sessionPickerOpen = false;
  @state() sessionPickerPosition: { top: number; right: number } | null = null;
  @state() sessionPickerSearch = "";
  @state() sessionSearchOpen = false;
  @state() sessionSearchPosition: { top: number; right: number } | null = null;
  @state() sessionSearchQuery = "";
  @state() sessionSearchResults: Array<{
    key: string;
    label?: string;
    displayName?: string;
    matches: Array<{ role: string; text: string; timestamp?: number }>;
  }> = [];
  @state() sessionSearchLoading = false;
  @state() profilePopoverOpen = false;
  @state() profileEditName = "";
  @state() profileEditAvatar = "";
  @state() editingTabKey: string | null = null;
  @state() chatLoading = false;
  @state() chatSending = false;
  @state() chatSendingSessionKey: string | null = null;
  @state() chatMessage = "";
  @state() chatDrafts: Record<string, string> = {}; // Store draft text per session
  @state() chatMessages: unknown[] = [];
  @state() chatToolMessages: unknown[] = [];
  @state() chatStream: string | null = null;
  @state() chatStreamStartedAt: number | null = null;
  @state() chatRunId: string | null = null;
  @state() currentToolName: string | null = null;
  @state() currentToolInfo: ToolExecutionInfo | null = null;
  @state() workingSessions: Set<string> = new Set(); // Sessions currently processing
  @state() compactionStatus: import("./app-tool-stream").CompactionStatus | null = null;
  @state() chatAvatarUrl: string | null = null;
  @state() chatThinkingLevel: string | null = null;
  @state() chatQueue: ChatQueueItem[] = [];
  @state() chatAttachments: ChatAttachment[] = [];
  @state() pendingRetry: FailedMessage | null = null;
  // Sidebar state for tool output viewing
  @state() sidebarOpen = false;
  @state() sidebarContent: string | null = null;
  @state() sidebarError: string | null = null;
  @state() sidebarMimeType: string | null = null;
  @state() sidebarFilePath: string | null = null;
  @state() sidebarTitle: string | null = null;
  @state() splitRatio = this.settings.splitRatio;

  // Update check state
  @state() updateStatus: {
    version: string;
    branch: string | null;
    sha: string | null;
    upstream: string | null;
    ahead: number | null;
    behind: number | null;
    dirty: boolean | null;
    fetchOk: boolean | null;
  } | null = null;
  @state() updateLoading = false;
  @state() updateError: string | null = null;
  @state() updateLastChecked: number | null = null;
  updatePollInterval: number | null = null;

  @state() nodesLoading = false;
  @state() nodes: Array<Record<string, unknown>> = [];
  @state() devicesLoading = false;
  @state() devicesError: string | null = null;
  @state() devicesList: DevicePairingList | null = null;
  @state() execApprovalsLoading = false;
  @state() execApprovalsSaving = false;
  @state() execApprovalsDirty = false;
  @state() execApprovalsSnapshot: ExecApprovalsSnapshot | null = null;
  @state() execApprovalsForm: ExecApprovalsFile | null = null;
  @state() execApprovalsSelectedAgent: string | null = null;
  @state() execApprovalsTarget: "gateway" | "node" = "gateway";
  @state() execApprovalsTargetNodeId: string | null = null;
  @state() execApprovalQueue: ExecApprovalRequest[] = [];
  @state() execApprovalBusy = false;
  @state() execApprovalError: string | null = null;
  @state() pendingGatewayUrl: string | null = null;

  @state() configLoading = false;
  @state() configRaw = "{\n}\n";
  @state() configRawOriginal = "";
  @state() configValid: boolean | null = null;
  @state() configIssues: unknown[] = [];
  @state() configSaving = false;
  @state() configApplying = false;
  @state() updateRunning = false;
  @state() applySessionKey = this.settings.lastActiveSessionKey;
  @state() configSnapshot: ConfigSnapshot | null = null;
  @state() configSchema: unknown = null;
  @state() configSchemaVersion: string | null = null;
  @state() configSchemaLoading = false;
  @state() configUiHints: ConfigUiHints = {};
  @state() configForm: Record<string, unknown> | null = null;
  @state() configFormOriginal: Record<string, unknown> | null = null;
  @state() configFormDirty = false;
  @state() configFormMode: "form" | "raw" = "form";
  @state() configSearchQuery = "";
  @state() configActiveSection: string | null = null;
  @state() configActiveSubsection: string | null = null;

  @state() channelsLoading = false;
  @state() channelsSnapshot: ChannelsStatusSnapshot | null = null;
  @state() channelsError: string | null = null;
  @state() channelsLastSuccess: number | null = null;
  @state() whatsappLoginMessage: string | null = null;
  @state() whatsappLoginQrDataUrl: string | null = null;
  @state() whatsappLoginConnected: boolean | null = null;
  @state() whatsappBusy = false;
  @state() nostrProfileFormState: NostrProfileFormState | null = null;
  @state() nostrProfileAccountId: string | null = null;

  @state() presenceLoading = false;
  @state() presenceEntries: PresenceEntry[] = [];
  @state() presenceError: string | null = null;
  @state() presenceStatus: string | null = null;

  @state() agentsLoading = false;
  @state() agentsList: AgentsListResult | null = null;
  @state() agentsError: string | null = null;

  @state() sessionsLoading = false;
  @state() sessionsResult: SessionsListResult | null = null;
  @state() sessionsError: string | null = null;
  @state() sessionsFilterActive = "";
  @state() sessionsFilterLimit = "120";
  @state() sessionsIncludeGlobal = true;
  @state() sessionsIncludeUnknown = false;

  @state() cronLoading = false;
  @state() cronJobs: CronJob[] = [];
  @state() cronStatus: CronStatus | null = null;
  @state() cronError: string | null = null;
  @state() cronForm: CronFormState = { ...DEFAULT_CRON_FORM };
  @state() cronRunsJobId: string | null = null;
  @state() cronRuns: CronRunLogEntry[] = [];
  @state() cronBusy = false;

  // Mission Control state
  @state() missionLoading = false;
  @state() missionError: string | null = null;
  @state() missionAgents: import("./views/mission-types").MissionAgent[] = [];
  @state() missionActiveRuns: import("./views/mission-types").ActiveRun[] = [];
  @state() missionSubagentRuns: import("./views/mission-types").SubagentRun[] = [];
  @state() missionTasks: import("./views/mission-types").NativeTask[] = [];
  @state() missionFeedItems: import("./views/mission-types").FeedItem[] = [];

  // Workspace onboarding — true when ~/godmode/data/projects.json is empty/missing
  @state() workspaceNeedsSetup = false;

  // Onboarding experience state (6-phase flow)
  @state() onboardingPhase: import("./views/onboarding").OnboardingPhase = 0;
  @state() onboardingData: import("./views/onboarding").OnboardingData | null = null;
  @state() onboardingActive = false;

  // Workspaces state
  @state() workspaces?: WorkspaceSummary[];
  @state() selectedWorkspace: WorkspaceDetail | null = null;
  @state() workspacesSearchQuery = "";
  @state() workspaceItemSearchQuery = "";
  @state() workspacesLoading = false;
  @state() workspacesCreateLoading = false;
  @state() workspacesError: string | null = null;
  @state() allTasks?: WorkspaceTask[];
  @state() taskFilter?: TaskFilter;
  @state() showCompletedTasks?: boolean;

  // My Day state
  @state() myDayLoading = false;
  @state() myDayError: string | null = null;
  @state() todaySelectedDate: string = new Date().toISOString().split("T")[0];
  @state() todayViewMode: "my-day" | "agent-log" = "my-day";

  // Daily Brief state
  @state() dailyBrief?: import("./views/daily-brief").DailyBriefData | null;
  @state() dailyBriefLoading = false;
  @state() dailyBriefError: string | null = null;
  @state() agentLog?: import("./views/my-day").AgentLogData | null;
  @state() agentLogLoading = false;
  @state() agentLogError: string | null = null;
  @state() briefNotes: Record<string, string> = {};
  @state() briefEditing = false;

  @state() chatPrivateMode = false;

  // Life subtab state
  @state() lifeSubtab: "vision-board" | "lifetracks" | "goals" | "wheel-of-life" = "vision-board";
  @state() goals?: import("./views/goals").Goal[];
  @state() goalsLoading = false;
  @state() goalsError: string | null = null;

  // Data tab state
  @state() dataSources?: import("./views/data").DataSource[];
  @state() dataLoading = false;
  @state() dataError: string | null = null;
  @state() dataSubtab: "dashboard" | "sources" = "dashboard";

  // Dynamic HTML slots (AI-generated tab content)
  @state() dynamicSlots: Record<string, string> = {};

  // Work tab state
  @state() workProjects?: import("./views/work").Project[];
  @state() workLoading = false;
  @state() workError: string | null = null;
  @state() workExpandedProjects: Set<string> = new Set();
  @state() workProjectFiles: Record<string, unknown[]> = {};
  @state() workDetailLoading: Set<string> = new Set();

  // People tab state
  @state() peopleList?: import("./views/people").Person[];
  @state() peopleLoading = false;
  @state() peopleError: string | null = null;
  @state() peopleSelected: string | null = null;
  @state() peopleSearchQuery = "";

  // Wheel of Life state
  @state() wheelOfLifeData?: import("./views/wheel-of-life").WheelOfLifeData | null;
  @state() wheelOfLifeLoading = false;
  @state() wheelOfLifeError: string | null = null;
  @state() wheelOfLifeEditMode = false;

  // Vision Board state
  @state() visionBoardData?: import("./views/vision-board").VisionBoardData | null;
  @state() visionBoardLoading = false;
  @state() visionBoardError: string | null = null;
  @state() visionBoardIdentityToday?: string | null;

  // Lifetracks state
  @state() lifetracksData?: LifetrackEntry[] | null;
  @state() lifetracksLoading = false;
  @state() lifetracksError: string | null = null;
  @state() lifetracksCurrentTrack?: LifetrackEntry | null;
  @state() lifetracksConfig?: LifetracksConfig | null;
  @state() lifetracksGenerating = false;
  @state() lifetracksGenerationError: string | null = null;

  @state() skillsLoading = false;
  @state() skillsReport: SkillStatusReport | null = null;
  @state() skillsError: string | null = null;
  @state() skillsFilter = "";
  @state() skillEdits: Record<string, string> = {};
  @state() skillsBusyKey: string | null = null;
  @state() skillMessages: Record<string, SkillMessage> = {};

  @state() debugLoading = false;
  @state() debugStatus: StatusSummary | null = null;
  @state() debugHealth: HealthSnapshot | null = null;
  @state() debugModels: unknown[] = [];
  @state() debugHeartbeat: unknown = null;
  @state() debugCallMethod = "";
  @state() debugCallParams = "{}";
  @state() debugCallResult: string | null = null;
  @state() debugCallError: string | null = null;

  @state() logsLoading = false;
  @state() logsError: string | null = null;
  @state() logsFile: string | null = null;
  @state() logsEntries: LogEntry[] = [];
  @state() logsFilterText = "";
  @state() logsLevelFilters: Record<LogLevel, boolean> = {
    ...DEFAULT_LOG_LEVEL_FILTERS,
  };
  @state() logsAutoFollow = true;
  @state() logsTruncated = false;
  @state() logsCursor: number | null = null;
  @state() logsLastFetchAt: number | null = null;
  @state() logsLimit = 500;
  @state() logsMaxBytes = 250_000;
  @state() logsAtBottom = true;

  @state() toasts: Toast[] = [];

  client: GatewayBrowserClient | null = null;
  private chatScrollFrame: number | null = null;
  private chatScrollTimeout: number | null = null;
  private chatHasAutoScrolled = false;
  private chatUserNearBottom = true;
  private chatIsAutoScrolling = false;
  @state() private chatNewMessagesBelow = false;
  @state() consciousnessStatus: "idle" | "loading" | "ok" | "error" = "idle";

  // Focus Pulse state
  @state() focusPulseData: FocusPulseData | null = null;

  // Trust Tracker state
  @state() trustTrackerData: TrustTrackerData | null = null;
  @state() trustTrackerLoading = false;

  // GodMode Options state
  @state() godmodeOptions: Record<string, unknown> | null = null;
  @state() godmodeOptionsLoading = false;

  private nodesPollInterval: number | null = null;
  private logsPollInterval: number | null = null;
  private debugPollInterval: number | null = null;
  private agentLogPollInterval: number | null = null;
  private agentLogUnsub: (() => void) | null = null;
  private logsScrollFrame: number | null = null;
  private toolStreamById = new Map<string, ToolStreamEntry>();
  private toolStreamOrder: string[] = [];
  refreshSessionsAfterChat = false;
  basePath = "";
  private popStateHandler = () =>
    onPopStateInternal(this as unknown as Parameters<typeof onPopStateInternal>[0]);
  private keydownHandler: (e: KeyboardEvent) => void = () => {};
  private themeMedia: MediaQueryList | null = null;
  private themeMediaHandler: ((event: MediaQueryListEvent) => void) | null = null;
  private topbarObserver: ResizeObserver | null = null;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // Priority: localStorage > window globals > defaults
    // Check localStorage first (from settings)
    if (this.settings.userName) {
      this.userName = this.settings.userName;
    } else {
      // Fall back to window globals
      const userIdentity = getInjectedUserIdentity();
      this.userName = userIdentity.name;
    }

    if (this.settings.userAvatar) {
      this.userAvatar = this.settings.userAvatar;
    } else {
      const userIdentity = getInjectedUserIdentity();
      this.userAvatar = userIdentity.avatar;
    }

    handleConnected(this as unknown as Parameters<typeof handleConnected>[0]);

    if (this.agentLogPollInterval == null) {
      this.agentLogPollInterval = window.setInterval(() => {
        if (!this.connected) {
          return;
        }
        const onTodayTab = this.tab === "today" || this.tab === "my-day";
        if (!onTodayTab || this.todayViewMode !== "agent-log") {
          return;
        }
        void loadAgentLogOnlyInternal(this);
      }, 60_000);
    }

    // Subscribe to agent-log:update WebSocket events for near-instant refresh.
    if (!this.agentLogUnsub && this.client) {
      this.agentLogUnsub = subscribeToAgentLogUpdates(this.client, () => {
        if (this.todayViewMode === "agent-log") {
          void loadAgentLogOnlyInternal(this);
        }
      });
    }

    // Start meeting notifications (polls every 60s, fires toast 15 min before)
    startMeetingNotifications(this);


  }

  protected firstUpdated() {
    handleFirstUpdated(this as unknown as Parameters<typeof handleFirstUpdated>[0]);
  }

  disconnectedCallback() {
    stopMeetingNotifications();
    if (this.agentLogPollInterval != null) {
      clearInterval(this.agentLogPollInterval);
      this.agentLogPollInterval = null;
    }
    if (this.agentLogUnsub) {
      this.agentLogUnsub();
      this.agentLogUnsub = null;
    }
    handleDisconnected(this as unknown as Parameters<typeof handleDisconnected>[0]);
    super.disconnectedCallback();
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    handleUpdated(this as unknown as Parameters<typeof handleUpdated>[0], changed);
  }

  connect() {
    connectGatewayInternal(this as unknown as Parameters<typeof connectGatewayInternal>[0]);
  }

  handleChatScroll(event: Event) {
    handleChatScrollInternal(
      this as unknown as Parameters<typeof handleChatScrollInternal>[0],
      event,
    );
  }

  handleLogsScroll(event: Event) {
    handleLogsScrollInternal(
      this as unknown as Parameters<typeof handleLogsScrollInternal>[0],
      event,
    );
  }

  exportLogs(lines: string[], label: string) {
    exportLogsInternal(lines, label);
  }

  resetToolStream() {
    resetToolStreamInternal(this as unknown as Parameters<typeof resetToolStreamInternal>[0]);
  }

  resetChatScroll() {
    resetChatScrollInternal(this as unknown as Parameters<typeof resetChatScrollInternal>[0]);
  }

  async loadAssistantIdentity() {
    await loadAssistantIdentityInternal(this);
  }

  applySettings(next: UiSettings) {
    applySettingsInternal(this as unknown as Parameters<typeof applySettingsInternal>[0], next);
  }

  setTab(next: Tab) {
    setTabInternal(this as unknown as Parameters<typeof setTabInternal>[0], next);
  }

  setTheme(next: ThemeMode, context?: Parameters<typeof setThemeInternal>[2]) {
    setThemeInternal(this as unknown as Parameters<typeof setThemeInternal>[0], next, context);
  }

  async loadOverview() {
    await loadOverviewInternal(this as unknown as Parameters<typeof loadOverviewInternal>[0]);
  }

  async loadCron() {
    await loadCronInternal(this as unknown as Parameters<typeof loadCronInternal>[0]);
  }

  async handleAbortChat() {
    await handleAbortChatInternal(this as unknown as Parameters<typeof handleAbortChatInternal>[0]);
  }

  async handleConsciousnessFlush() {
    if (!this.client || this.consciousnessStatus === "loading") {return;}
    this.consciousnessStatus = "loading";
    try {
      await this.client.request("godmode.consciousness.flush", {});
      this.consciousnessStatus = "ok";
    } catch {
      this.consciousnessStatus = "error";
    }
    setTimeout(() => {
      if (this.consciousnessStatus !== "loading") {this.consciousnessStatus = "idle";}
    }, 3000);
  }

  // Focus Pulse handlers
  async loadFocusPulse() {
    await loadFocusPulseInternal(this);
  }

  async handleFocusPulseStartMorning() {
    // Switch to chat and kick off the morning priority conversation
    this.setTab("chat" as import("./navigation").Tab);
    const prompt = "Let's do my morning set. Check my daily note for today's Win The Day items, then help me review priorities and pick my #1 focus to lock in.";
    this.chatMessage = prompt;
    void this.handleSendChat(prompt);
  }

  async handleFocusPulseSetFocus(index: number) {
    await setFocusInternal(this, index);
  }

  async handleFocusPulseComplete() {
    await completeFocusInternal(this);
  }

  async handleFocusPulsePulseCheck() {
    await runPulseCheckInternal(this);
  }

  async handleFocusPulseEndDay() {
    await endDayInternal(this);
  }

  // Trust Tracker handlers
  async handleTrustLoad() {
    await loadTrustTrackerInternal(this);
  }

  async handleTrustAddWorkflow(workflow: string) {
    await addTrustWorkflowInternal(this, workflow);
  }

  async handleTrustRemoveWorkflow(workflow: string) {
    await removeTrustWorkflowInternal(this, workflow);
  }

  // Options handlers
  async handleOptionsLoad() {
    const { loadOptions } = await import("./controllers/options.js");
    await loadOptions(this);
  }

  async handleOptionToggle(key: string, value: unknown) {
    const { saveOption } = await import("./controllers/options.js");
    await saveOption(this, key, value);
  }

  removeQueuedMessage(id: string) {
    removeQueuedMessageInternal(
      this as unknown as Parameters<typeof removeQueuedMessageInternal>[0],
      id,
    );
  }

  async handleSendChat(
    messageOverride?: string,
    opts?: Parameters<typeof handleSendChatInternal>[2],
  ) {
    // Auto-compact if context is approaching limit (90%+) before sending
    const activeSession = this.sessionsResult?.sessions?.find((s) => s.key === this.sessionKey);
    if (activeSession) {
      const used = activeSession.totalTokens ?? 0;
      const max =
        activeSession.contextTokens ?? this.sessionsResult?.defaults?.contextTokens ?? 200000;
      const usage = max > 0 ? used / max : 0;

      if (usage >= 0.9 && !this.compactionStatus?.active) {
        // Context is at 90%+ - auto-compact before sending
        this.showToast("Context near limit — auto-compacting...", "info", 3000);
        await this.handleCompactChat();
      }
    }

    await handleSendChatInternal(
      this as unknown as Parameters<typeof handleSendChatInternal>[0],
      messageOverride,
      opts,
    );
  }

  handleToggleSessionPicker() {
    this.sessionPickerOpen = !this.sessionPickerOpen;
  }

  handleToggleSessionSearch(event?: Event) {
    if (!this.sessionSearchOpen && event) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.sessionSearchPosition = {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      };
    }
    this.sessionSearchOpen = !this.sessionSearchOpen;
    if (!this.sessionSearchOpen) {
      this.sessionSearchQuery = "";
      this.sessionSearchResults = [];
    }
  }

  async handleSessionSearchQuery(query: string) {
    this.sessionSearchQuery = query;
    if (!query.trim()) {
      this.sessionSearchResults = [];
      return;
    }
    if (!this.client) {
      return;
    }

    this.sessionSearchLoading = true;
    try {
      const result = await this.client.request<{
        ts: number;
        results: Array<{
          key: string;
          label?: string;
          displayName?: string;
          matches: Array<{ role: string; text: string; timestamp?: number }>;
        }>;
      }>("sessions.searchContent", { query: query.trim(), limit: 20 });
      this.sessionSearchResults = result.results;
    } catch (err) {
      console.error("Session search failed:", err);
      this.sessionSearchResults = [];
    } finally {
      this.sessionSearchLoading = false;
    }
  }

  handleSelectSession(_sessionKey: string) {
    // Close the picker and search
    this.sessionPickerOpen = false;
    this.sessionSearchOpen = false;
    this.sessionSearchQuery = "";
    this.sessionSearchResults = [];

    // Switch to the selected session (same logic as the old dropdown)
    // This will be implemented in app-render.ts where we have access to helper functions
  }

  async handleWhatsAppStart(force: boolean) {
    await handleWhatsAppStartInternal(this, force);
  }

  async handleWhatsAppWait() {
    await handleWhatsAppWaitInternal(this);
  }

  async handleWhatsAppLogout() {
    await handleWhatsAppLogoutInternal(this);
  }

  async handleChannelConfigSave() {
    await handleChannelConfigSaveInternal(this);
  }

  async handleChannelConfigReload() {
    await handleChannelConfigReloadInternal(this);
  }

  async handleCompactChat() {
    if (!this.connected) {
      this.showToast("Cannot compact: not connected", "error");
      return;
    }
    if (!this.sessionKey) {
      this.showToast("Cannot compact: no active session", "error");
      return;
    }

    // Set compaction status to show spinner
    this.compactionStatus = {
      active: true,
      startedAt: Date.now(),
      completedAt: null,
    };

    try {
      // Send /compact as a chat message - uses the proven command path
      // This will be processed by handleCompactCommand on the server
      await this.handleSendChat("/compact");
      // Note: compactionStatus completion is handled by the chat event stream
      // when the server responds with the compaction result
    } catch (err) {
      // Reset on error
      this.compactionStatus = null;
      console.error("Compaction failed:", err);
      this.showToast("Compaction failed", "error");
    }
  }

  /**
   * Inject a compaction summary message into the chat display
   */
  private injectCompactionSummary(summary: string, keptMessages?: number) {
    const compactionMessage = {
      role: "system",
      content: summary,
      timestamp: Date.now(),
      isCompactionSummary: true,
      keptMessages,
    };

    // Add to the beginning of chat messages so it appears at the top of the visible conversation
    this.chatMessages = [compactionMessage, ...this.chatMessages];
  }

  /**
   * Retry a message that failed due to context overflow.
   * Should be called after compacting the conversation.
   */
  async handleRetryMessage() {
    const chatState = {
      client: this.client,
      connected: this.connected,
      sessionKey: this.sessionKey,
      chatLoading: this.chatLoading,
      chatMessages: this.chatMessages,
      chatThinkingLevel: this.chatThinkingLevel,
      chatSending: this.chatSending,
      chatSendingSessionKey: this.chatSendingSessionKey,
      chatMessage: this.chatMessage,
      chatAttachments: this.chatAttachments,
      chatRunId: this.chatRunId,
      chatStream: this.chatStream,
      chatStreamStartedAt: this.chatStreamStartedAt,
      lastError: this.lastError,
      pendingRetry: this.pendingRetry,
    };

    const success = await retryPendingMessage(chatState);

    // Sync state back
    this.chatSending = chatState.chatSending;
    this.chatSendingSessionKey = chatState.chatSendingSessionKey;
    this.chatRunId = chatState.chatRunId;
    this.chatStream = chatState.chatStream;
    this.chatStreamStartedAt = chatState.chatStreamStartedAt;
    this.lastError = chatState.lastError;
    this.pendingRetry = chatState.pendingRetry ?? null;
    this.chatMessages = chatState.chatMessages;

    if (success) {
      this.showToast("Message resent", "success", 2000);
    }
  }

  /**
   * Clear the pending retry without resending.
   */
  handleClearRetry() {
    this.pendingRetry = null;
  }

  handleNostrProfileEdit(accountId: string, profile: NostrProfile | null) {
    handleNostrProfileEditInternal(this, accountId, profile);
  }

  handleNostrProfileCancel() {
    handleNostrProfileCancelInternal(this);
  }

  handleNostrProfileFieldChange(field: keyof NostrProfile, value: string) {
    handleNostrProfileFieldChangeInternal(this, field, value);
  }

  async handleNostrProfileSave() {
    await handleNostrProfileSaveInternal(this);
  }

  async handleNostrProfileImport() {
    await handleNostrProfileImportInternal(this);
  }

  handleNostrProfileToggleAdvanced() {
    handleNostrProfileToggleAdvancedInternal(this);
  }

  async handleExecApprovalDecision(decision: "allow-once" | "allow-always" | "deny") {
    const active = this.execApprovalQueue[0];
    if (!active || !this.client || this.execApprovalBusy) {
      return;
    }
    this.execApprovalBusy = true;
    this.execApprovalError = null;
    try {
      await this.client.request("exec.approval.resolve", {
        id: active.id,
        decision,
      });
      this.execApprovalQueue = this.execApprovalQueue.filter((entry) => entry.id !== active.id);
    } catch (err) {
      this.execApprovalError = `Exec approval failed: ${String(err)}`;
    } finally {
      this.execApprovalBusy = false;
    }
  }

  handleGatewayUrlConfirm() {
    const nextGatewayUrl = this.pendingGatewayUrl;
    if (!nextGatewayUrl) {
      return;
    }
    this.pendingGatewayUrl = null;
    applySettingsInternal(this as unknown as Parameters<typeof applySettingsInternal>[0], {
      ...this.settings,
      gatewayUrl: nextGatewayUrl,
    });
    this.connect();
  }

  handleGatewayUrlCancel() {
    this.pendingGatewayUrl = null;
  }

  // Sidebar handlers for tool output viewing
  handleOpenSidebar(
    content: string,
    opts: { mimeType?: string | null; filePath?: string | null; title?: string | null } = {},
  ) {
    if (this.sidebarCloseTimer != null) {
      window.clearTimeout(this.sidebarCloseTimer);
      this.sidebarCloseTimer = null;
    }
    this.sidebarContent = content;
    this.sidebarError = null;
    this.sidebarMimeType = opts.mimeType?.trim() || null;
    this.sidebarFilePath = opts.filePath?.trim() || null;
    this.sidebarTitle = opts.title?.trim() || null;
    this.sidebarOpen = true;
  }

  handleCloseSidebar() {
    this.sidebarOpen = false;
    // Clear content after transition
    if (this.sidebarCloseTimer != null) {
      window.clearTimeout(this.sidebarCloseTimer);
    }
    this.sidebarCloseTimer = window.setTimeout(() => {
      if (this.sidebarOpen) {
        return;
      }
      this.sidebarContent = null;
      this.sidebarError = null;
      this.sidebarMimeType = null;
      this.sidebarFilePath = null;
      this.sidebarTitle = null;
      this.sidebarCloseTimer = null;
    }, 200);
  }

  async handleOpenFile(filePath: string) {
    if (!this.client || !this.connected) {
      this.showToast("Not connected to gateway", "error");
      return;
    }
    try {
      const result = await this.client.request<{
        content: string;
        size: number;
        truncated: boolean;
        mime?: string;
        contentType?: string;
      }>("files.read", { path: filePath });

      const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
      const mime = result.contentType ?? result.mime ?? (ext === "md" ? "text/markdown" : null);
      const title = filePath.split("/").pop() ?? filePath;

      this.handleOpenSidebar(result.content, {
        mimeType: mime,
        filePath,
        title,
      });
      if (result.truncated) {
        this.showToast(`Opened truncated file: ${filePath}`, "warning");
      }
    } catch (err) {
      console.error("[Chat] Failed to open file:", err);
      this.showToast(`Failed to open file: ${filePath}`, "error");
    }
  }

  handleSplitRatioChange(ratio: number) {
    const newRatio = Math.max(0.4, Math.min(0.7, ratio));
    this.splitRatio = newRatio;
    this.applySettings({ ...this.settings, splitRatio: newRatio });
  }

  private normalizeWorkspacePathCandidate(
    rawPath: string,
    opts: { allowAbsolute?: boolean } = {},
  ): string | null {
    let normalized = rawPath.trim();
    if (!normalized || normalized.startsWith("#")) {
      return null;
    }

    while (normalized.startsWith("./")) {
      normalized = normalized.slice(2);
    }

    normalized = normalized.replaceAll("\\", "/");
    if (!opts.allowAbsolute) {
      while (normalized.startsWith("/")) {
        normalized = normalized.slice(1);
      }
    }

    if (!normalized || normalized.includes("\u0000")) {
      return null;
    }

    return normalized;
  }

  private isAbsoluteFilesystemPath(filePath: string): boolean {
    return filePath.startsWith("/") || filePath.startsWith("~/") || /^[a-z]:[\\/]/i.test(filePath);
  }

  private inferMimeTypeFromPath(filePath: string | null): string | null {
    if (!filePath) {
      return null;
    }
    const normalized = filePath.trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    const extension = normalized.split(".").pop() ?? "";
    if (!extension) {
      return null;
    }
    if (extension === "md" || extension === "markdown" || extension === "mdx") {
      return "text/markdown";
    }
    if (extension === "html" || extension === "htm") {
      return "text/html";
    }
    if (extension === "json" || extension === "json5") {
      return "application/json";
    }
    if (extension === "txt" || extension === "text" || extension === "log") {
      return "text/plain";
    }
    if (extension === "svg" || extension === "svgz") {
      return "image/svg+xml";
    }
    if (
      extension === "avif" ||
      extension === "bmp" ||
      extension === "gif" ||
      extension === "heic" ||
      extension === "heif" ||
      extension === "jpeg" ||
      extension === "jpg" ||
      extension === "png" ||
      extension === "webp"
    ) {
      return `image/${extension === "jpg" ? "jpeg" : extension}`;
    }
    return null;
  }

  private sidebarTitleForPath(filePath: string): string {
    const normalized = filePath.replaceAll("\\", "/").trim();
    if (!normalized) {
      return "Document";
    }
    const parts = normalized.split("/");
    return parts[parts.length - 1] || normalized;
  }

  private async listWorkspaceIdsForPathResolution(): Promise<string[]> {
    const workspaceIds: string[] = [];
    const seen = new Set<string>();
    const addWorkspaceId = (value: unknown) => {
      if (typeof value !== "string") {
        return;
      }
      const workspaceId = value.trim();
      if (!workspaceId || seen.has(workspaceId)) {
        return;
      }
      seen.add(workspaceId);
      workspaceIds.push(workspaceId);
    };

    addWorkspaceId(this.selectedWorkspace?.id);
    for (const workspace of this.workspaces ?? []) {
      addWorkspaceId(workspace.id);
    }

    if (workspaceIds.length > 0 || !this.client || !this.connected) {
      return workspaceIds;
    }

    try {
      const listResult = await this.client.request<{
        workspaces?: Array<{ id?: string }>;
      }>("workspaces.list", {});
      for (const workspace of listResult.workspaces ?? []) {
        addWorkspaceId(workspace.id);
      }
    } catch {
      // Ignore workspace-list errors and fall back to path-based reads.
    }

    return workspaceIds;
  }

  private async openWorkspaceRelativeFileInViewer(filePath: string): Promise<boolean> {
    if (!this.client || !this.connected) {
      return false;
    }

    const workspaceIds = await this.listWorkspaceIdsForPathResolution();
    for (const workspaceId of workspaceIds) {
      try {
        const result = await this.client.request<{
          content: string | null;
          mime?: string;
          contentType?: string;
        }>("workspaces.readFile", { workspaceId, filePath });
        if (typeof result.content !== "string") {
          continue;
        }
        this.handleOpenSidebar(result.content, {
          mimeType: result.contentType ?? result.mime ?? this.inferMimeTypeFromPath(filePath),
          filePath,
          title: this.sidebarTitleForPath(filePath),
        });
        return true;
      } catch {
        // Try the next workspace candidate.
      }
    }

    return false;
  }

  private extractWorkspacePathCandidatesFromHref(rawHref: string): string[] {
    const href = rawHref.trim();
    if (!href) {
      return [];
    }

    const candidates: string[] = [];
    const lowered = href.toLowerCase();
    if (
      lowered.startsWith("mailto:") ||
      lowered.startsWith("tel:") ||
      lowered.startsWith("javascript:") ||
      lowered.startsWith("data:")
    ) {
      return [];
    }

    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(href);
    const isWindowsPath = /^[a-z]:[\\/]/i.test(href);
    if (!hasScheme || isWindowsPath) {
      candidates.push(href);
    }

    let url: URL | null = null;
    try {
      url = new URL(href, window.location.href);
    } catch {
      url = null;
    }

    if (url && /^https?:$/.test(url.protocol) && url.origin === window.location.origin) {
      for (const key of CHAT_FILE_LINK_QUERY_KEYS) {
        const queryValue = url.searchParams.get(key);
        if (queryValue) {
          candidates.push(queryValue);
        }
      }

      const withoutHash = href.split("#")[0] ?? "";
      const withoutQuery = withoutHash.split("?")[0] ?? "";
      const looksRelativePath =
        withoutQuery.length > 0 && !withoutQuery.startsWith("/") && !withoutQuery.includes("://");
      if (looksRelativePath) {
        candidates.push(withoutQuery);
      }

      let pathname = url.pathname;
      if (this.basePath && pathname.startsWith(`${this.basePath}/`)) {
        // Keep leading slash so absolute filesystem paths can still be tried.
        pathname = pathname.slice(this.basePath.length);
      } else if (this.basePath && pathname === this.basePath) {
        pathname = "";
      }

      const trimmedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
      if (trimmedPath) {
        candidates.push(trimmedPath);
        const firstSlash = trimmedPath.indexOf("/");
        if (firstSlash > 0) {
          const firstSegment = trimmedPath.slice(0, firstSlash).toLowerCase();
          if (CHAT_FILE_LINK_TAB_PREFIXES.has(firstSegment)) {
            candidates.push(trimmedPath.slice(firstSlash + 1));
          }
        }
      }

      // Treat non-tab-prefixed absolute paths as filesystem candidates (e.g. /Users/.../file.md).
      if (pathname.startsWith("/") && trimmedPath) {
        const firstSegment = trimmedPath.split("/")[0]?.toLowerCase() ?? "";
        if (!CHAT_FILE_LINK_TAB_PREFIXES.has(firstSegment)) {
          candidates.push(pathname);
        }
      }
    }

    const normalized: string[] = [];
    const seen = new Set<string>();
    for (const candidate of candidates) {
      let decoded = candidate;
      try {
        decoded = decodeURIComponent(candidate);
      } catch {
        // Keep original candidate when decode fails.
      }
      const safe = this.normalizeWorkspacePathCandidate(decoded, { allowAbsolute: true });
      if (!safe || seen.has(safe)) {
        continue;
      }
      seen.add(safe);
      normalized.push(safe);
    }
    return normalized;
  }

  private async openWorkspaceFileInViewer(filePath: string): Promise<boolean> {
    if (!this.client || !this.connected) {
      return false;
    }

    const isAbsolute = this.isAbsoluteFilesystemPath(filePath);
    if (!isAbsolute) {
      if (await this.openWorkspaceRelativeFileInViewer(filePath)) {
        return true;
      }
    }

    try {
      const result = await this.client.request<{
        content: string | null;
        mime?: string;
        contentType?: string;
      }>("workspaces.readFile", { path: filePath });
      if (typeof result.content === "string") {
        this.handleOpenSidebar(result.content, {
          mimeType: result.contentType ?? result.mime ?? this.inferMimeTypeFromPath(filePath),
          filePath,
          title: this.sidebarTitleForPath(filePath),
        });
        return true;
      }
    } catch {
      // Ignore and continue to absolute-path fallback below.
    }

    if (!isAbsolute) {
      return false;
    }

    try {
      const fallback = await this.client.request<{
        content: string;
      }>("files.read", { path: filePath, maxSize: 1_000_000 });
      if (typeof fallback.content !== "string") {
        return false;
      }
      this.handleOpenSidebar(fallback.content, {
        mimeType: this.inferMimeTypeFromPath(filePath),
        filePath,
        title: this.sidebarTitleForPath(filePath),
      });
      return true;
    } catch {
      return false;
    }
  }

  async handleOpenMessageFileLink(href: string): Promise<boolean> {
    const candidates = this.extractWorkspacePathCandidatesFromHref(href);
    if (candidates.length === 0) {
      return false;
    }

    for (const candidate of candidates) {
      if (await this.openWorkspaceFileInViewer(candidate)) {
        return true;
      }
    }

    return false;
  }

  // Toast handlers
  showToast(
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    duration = 3000,
  ) {
    const toast = createToast(message, type, duration);
    this.toasts = addToast(this.toasts, toast);

    if (duration > 0) {
      window.setTimeout(() => {
        this.dismissToast(toast.id);
      }, duration);
    }
  }

  dismissToast(id: string) {
    this.toasts = removeToast(this.toasts, id);
  }

  // Mission Control handlers
  async handleMissionRefresh() {
    await handleMissionRefreshInternal(this);
  }

  async handleMissionTaskComplete(taskId: string) {
    await handleMissionTaskCompleteInternal(this, taskId);
  }

  handleMissionTaskClick(task: import("./views/mission-types").NativeTask) {
    this.openSessionForTask(task);
  }

  /**
   * Opens (or navigates to) a chat session linked to a task.
   * Calls tasks.openSession to get/create a session key, then
   * switches to that session in the chat tab with a contextual prompt.
   */
  private async openSessionForTask(task: import("./views/mission-types").NativeTask) {
    if (!this.client || !this.connected) {
      this.showToast("Not connected to gateway", "error");
      return;
    }

    try {
      const result = await this.client.request<{
        sessionId: string;
        created: boolean;
        task: import("./views/mission-types").NativeTask;
      }>("tasks.openSession", { taskId: task.id });

      if (!result.sessionId) {
        this.showToast("Failed to open session for task", "error");
        return;
      }

      // Navigate to the session
      const { saveDraft } = await import("./app-chat.js");
      const { syncUrlWithSessionKey } = await import("./app-settings.js");
      const { loadChatHistory } = await import("./controllers/chat.js");

      saveDraft(this);

      // Add to open tabs if not already there
      const openTabs = this.settings.openTabs.includes(result.sessionId)
        ? this.settings.openTabs
        : [...this.settings.openTabs, result.sessionId];

      this.applySettings({
        ...this.settings,
        openTabs,
        sessionKey: result.sessionId,
        lastActiveSessionKey: result.sessionId,
        tabLastViewed: {
          ...this.settings.tabLastViewed,
          [result.sessionId]: Date.now(),
        },
      });

      this.sessionKey = result.sessionId;
      this.setTab("chat" as import("./navigation").Tab);

      // If this is a new session, pre-fill with a task context prompt
      if (result.created) {
        const projectCtx = task.project ? ` (project: ${task.project})` : "";
        this.chatMessage = `Let's work on: ${task.title}${projectCtx}`;
      } else {
        this.chatMessage = "";
      }

      this.chatMessages = [];
      this.chatStream = null;
      this.chatStreamStartedAt = null;
      this.chatRunId = null;
      this.resetToolStream();
      this.resetChatScroll();
      void this.loadAssistantIdentity();
      syncUrlWithSessionKey(this, result.sessionId, true);
      void loadChatHistory(this);
      this.requestUpdate();
    } catch (err) {
      console.error("[Mission] Failed to open session for task:", err);
      this.showToast("Failed to open session for task", "error");
    }
  }

  handleMissionOpenDeck() {
    window.open("/deck/", "_blank", "noopener,noreferrer");
  }

  // My Day handlers
  async handleMyDayRefresh() {
    if (this.todayViewMode === "agent-log") {
      await loadAgentLogOnlyInternal(this, { refresh: true });
      return;
    }
    await loadMyDayInternal(this);
  }

  async handleMyDayTaskStatusChange(taskId: string, newStatus: "pending" | "complete") {
    if (!this.client || !this.connected) {
      return;
    }
    try {
      await this.client.request("tasks.update", {
        id: taskId,
        updates: {
          status: newStatus,
          completedAt: newStatus === "complete" ? new Date().toISOString() : null,
        },
      });
    } catch (err) {
      console.error("[MyDay] Failed to update task status:", err);
    }
  }

  // Date navigation handlers
  handleDatePrev() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    this.todaySelectedDate = d.toISOString().split("T")[0];
    if (this.todayViewMode === "agent-log") {
      void loadAgentLogOnlyInternal(this);
      return;
    }
    void loadBriefOnlyInternal(this);
  }

  handleDateNext() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const today = new Date().toISOString().split("T")[0];
    // Don't go past today
    const next = d.toISOString().split("T")[0];
    if (next > today) {
      return;
    }
    this.todaySelectedDate = next;
    if (this.todayViewMode === "agent-log") {
      void loadAgentLogOnlyInternal(this);
      return;
    }
    void loadBriefOnlyInternal(this);
  }

  handleDateToday() {
    this.todaySelectedDate = new Date().toISOString().split("T")[0];
    void loadMyDayInternal(this);
  }

  // Daily Brief handlers
  async handleDailyBriefRefresh() {
    await loadBriefOnlyInternal(this);
  }

  handleDailyBriefOpenInObsidian() {
    const date = this.dailyBrief?.date;
    openBriefInObsidianInternal(date);
  }

  async loadBriefNotes() {
    if (!this.client || !this.connected) {
      return;
    }
    const date = this.todaySelectedDate;
    try {
      const result = await this.client.request<{ notes: Record<string, string> }>(
        "briefNotes.get",
        { date },
      );
      this.briefNotes = result.notes ?? {};
    } catch (err) {
      console.error("[BriefNotes] Load error:", err);
      this.briefNotes = {};
    }
  }

  async handleBriefNoteSave(section: string, text: string) {
    if (!this.client || !this.connected) {
      return;
    }
    const date = this.todaySelectedDate;
    try {
      const result = await this.client.request<{ notes: Record<string, string> }>(
        "briefNotes.update",
        { date, section, text },
      );
      this.briefNotes = result.notes ?? {};
    } catch (err) {
      console.error("[BriefNotes] Save error:", err);
      this.showToast("Failed to save note", "error");
    }
  }

  handleTodayViewModeChange(mode: "my-day" | "agent-log") {
    this.todayViewMode = mode;
    if (mode === "agent-log" && !this.agentLog) {
      void loadAgentLogOnlyInternal(this);
    }
  }

  handlePrivateModeToggle() {
    if (this.chatPrivateMode) {
      // Turning off — just toggle the flag
      this.chatPrivateMode = false;
      this.showToast("Private mode OFF", "info", 2000);
      return;
    }
    // Turning on — create a new private chat session
    this.chatPrivateMode = true;
    this.setTab("chat" as import("./navigation").Tab);
    void import("./app-render.helpers.js").then(({ createNewSession }) => {
      createNewSession(this);
      // Inject system-style notice as first message
      this.chatMessages = [
        {
          role: "assistant",
          content:
            "This is a **private chat**. Nothing from this conversation will be saved to memory. " +
            "The session will be deleted when you close it or after 24 hours.",
          timestamp: Date.now(),
        },
      ];
      this.requestUpdate();
    });
    this.showToast("Private mode ON — new private chat created", "info", 3000);
  }

  async handleBriefSave(content: string) {
    if (!this.client || !this.connected) {
      return;
    }
    const date = this.dailyBrief?.date || this.todaySelectedDate;
    try {
      await this.client.request("dailyBrief.update", { date, content });
      // Update local data without full refresh (avoids resetting textarea)
      if (this.dailyBrief) {
        this.dailyBrief = { ...this.dailyBrief, content, updatedAt: new Date().toISOString() };
      }
    } catch (err) {
      console.error("[DailyBrief] Save error:", err);
      this.showToast("Failed to save brief", "error");
    }
  }

  handleBriefEditStart() {
    this.briefEditing = true;
  }

  handleBriefEditEnd() {
    this.briefEditing = false;
  }

  // Work tab handlers
  async handleWorkRefresh() {
    await loadWorkInternal(this);
  }

  handleWorkToggleProject(projectId: string) {
    const next = new Set(this.workExpandedProjects);
    if (next.has(projectId)) {
      next.delete(projectId);
    } else {
      next.add(projectId);
      // Lazy-load project details on first expand
      if (!this.workProjectFiles[projectId]) {
        void loadProjectDetailsInternal(this, projectId);
      }
    }
    this.workExpandedProjects = next;
  }

  handleWorkPersonClick(personId: string) {
    this.peopleSelected = personId;
    this.setTab("people" as import("./navigation").Tab);
  }

  async handleWorkFileClick(filePath: string) {
    if (!this.client || !this.connected) {
      this.showToast("Not connected to gateway", "error");
      return;
    }

    try {
      const result = await this.client.request<{
        content: string | null;
        mime?: string;
        contentType?: string;
        error?: string;
      }>("workspaces.readFile", { path: filePath });

      if (!result.content) {
        this.showToast(result.error ?? "Failed to read file", "error");
        return;
      }
      this.handleOpenSidebar(result.content, {
        mimeType: result.contentType ?? result.mime ?? this.inferMimeTypeFromPath(filePath),
        filePath,
        title: this.sidebarTitleForPath(filePath),
      });
    } catch (err) {
      console.error("[Work] Failed to read file:", err);
      this.showToast(`Failed to open: ${filePath}`, "error");
    }
  }

  handleWorkSkillClick(skill: string, projectName: string) {
    this.handleStartChatWithPrompt(
      `Tell me about the "${skill}" skill and how it's used in the ${projectName} project.`,
    );
  }

  // People tab handlers
  async handlePeopleRefresh() {
    await loadPeopleInternal(this);
  }

  handlePeopleSelect(personId: string) {
    this.peopleSelected = personId;
  }

  handlePeopleBack() {
    this.peopleSelected = null;
  }

  handlePeopleSearch(query: string) {
    this.peopleSearchQuery = query;
  }

  handlePeopleImport(source: "apple" | "google") {
    const prompt =
      source === "apple"
        ? "Import my contacts from Apple Contacts and organize them into categories."
        : "Import my contacts from Google Contacts and organize them into categories.";
    this.handleStartChatWithPrompt(prompt);
  }

  // Workspaces handlers
  async handleWorkspacesRefresh() {
    await loadWorkspacesInternal(this);
  }

  // Wheel of Life handlers
  async handleWheelOfLifeRefresh() {
    await loadWheelOfLifeInternal(this);
  }

  handleWheelOfLifeEdit() {
    enterWheelEditModeInternal(this);
  }

  handleWheelOfLifeCancel() {
    cancelWheelEditModeInternal(this);
  }

  async handleWheelOfLifeSave(updates: Record<string, { current?: number; target?: number }>) {
    await updateWheelOfLifeInternal(this, updates);
    cancelWheelEditModeInternal(this);
  }

  // Vision Board handlers
  async handleVisionBoardRefresh() {
    await loadVisionBoardInternal(this);
  }

  // Lifetracks handlers
  async handleLifetracksRefresh() {
    await loadLifetracksInternal(this as unknown as LifetracksState);
  }

  handleLifetracksSelectTrack(track: LifetrackEntry) {
    selectLifetrackInternal(this as unknown as LifetracksState, track);
  }

  async handleLifetracksEnable() {
    await enableLifetracksInternal(this as unknown as LifetracksState);
  }

  async handleLifetracksGenerate() {
    await generateLifetrackInternal(this as unknown as LifetracksState);
  }

  // Life subtab handlers
  handleLifeSubtabChange(subtab: "vision-board" | "lifetracks" | "goals" | "wheel-of-life") {
    this.lifeSubtab = subtab;
    // Load data for the selected subtab if not already loaded
    if (subtab === "goals" && !this.goals && !this.goalsLoading) {
      void this.handleGoalsRefresh();
    }
  }

  async handleGoalsRefresh() {
    if (!this.client || !this.connected) {
      return;
    }
    this.goalsLoading = true;
    this.goalsError = null;
    try {
      const result = await this.client.request<{
        goals: import("./views/goals").Goal[];
      }>("goals.get", {});
      this.goals = result.goals ?? [];
    } catch (err) {
      this.goalsError = err instanceof Error ? err.message : "Failed to load goals";
      console.error("[Goals] Load error:", err);
    } finally {
      this.goalsLoading = false;
    }
  }

  // ── Onboarding handlers ──────────────────────────────────────

  /** Phase 0 → 1: User clicked "Let's build your GodMode" */
  handleOnboardingStart() {
    this.onboardingPhase = 1;
    if (this.onboardingData) {
      this.onboardingData = { ...this.onboardingData, phase: 1 };
    }
    void this.client?.request("onboarding.update", { phase: 1, completePhase: 0 });
  }

  /** Phase 1 → 2: User submitted identity form */
  async handleOnboardingIdentitySubmit(identity: import("./views/onboarding").OnboardingIdentity) {
    if (!this.client) {return;}
    try {
      await this.client.request("onboarding.update", {
        phase: 2,
        completePhase: 1,
        identity,
      });
      this.onboardingPhase = 2;
      if (this.onboardingData) {
        this.onboardingData = { ...this.onboardingData, phase: 2, identity };
      }
      // Update the user profile with onboarding identity
      this.userName = identity.name;
      this.userAvatar = identity.emoji;
      this.applySettings({
        ...this.settings,
        userName: identity.name,
        userAvatar: identity.emoji,
      });
      // Switch to chat and start the onboarding conversation
      this.setTab("chat" as import("./navigation").Tab);
      // Trigger the onboarding-master skill via chat
      void import("./app-render.helpers.js").then(({ createNewSession }) => {
        createNewSession(this);
        const greeting = `I just set up my GodMode identity. My name is ${identity.name}${identity.mission ? ` and my mission is: ${identity.mission}` : ""}. Let's set up my workspace.`;
        this.chatMessage = greeting;
        void this.handleSendChat(greeting);
      });
    } catch (err) {
      console.error("[Onboarding] Identity submit failed:", err);
      this.showToast("Failed to save identity", "error");
    }
  }

  /** Skip current onboarding phase (tools overlay, etc.) */
  handleOnboardingSkipPhase() {
    if (!this.client) {return;}
    const nextPhase = Math.min(this.onboardingPhase + 1, 6) as import("./views/onboarding").OnboardingPhase;
    this.onboardingPhase = nextPhase;
    void this.client.request("onboarding.update", {
      phase: nextPhase,
      completePhase: this.onboardingPhase,
    });
  }

  /** Onboarding complete — transition to full UI */
  handleOnboardingComplete() {
    this.onboardingActive = false;
    this.onboardingPhase = 6;
    if (this.onboardingData) {
      this.onboardingData = {
        ...this.onboardingData,
        phase: 6,
        completedAt: new Date().toISOString(),
      };
    }
    void this.client?.request("onboarding.complete", {
      summary: this.onboardingData?.summary ?? null,
    });
    this.showToast("Welcome to GodMode!", "success", 4000);
  }

  handleStartChatWithPrompt(prompt: string) {
    // Switch to chat tab and create a new session with the prompt pre-filled
    this.setTab("chat" as import("./navigation").Tab);
    // Use createNewSession from helpers, then set the chat message
    void import("./app-render.helpers.js").then(({ createNewSession }) => {
      createNewSession(this);
      this.chatMessage = prompt;
      this.requestUpdate();
    });
  }

  // Data tab handlers
  async handleDataRefresh() {
    if (!this.client || !this.connected) {
      return;
    }
    this.dataLoading = true;
    this.dataError = null;
    try {
      const result = await this.client.request<{
        sources: import("./views/data").DataSource[];
      }>("dataSources.list", {});
      this.dataSources = result.sources ?? [];
    } catch (err) {
      this.dataError = err instanceof Error ? err.message : "Failed to load data sources";
      console.error("[Data] Load error:", err);
    } finally {
      this.dataLoading = false;
    }
  }

  handleDataSubtabChange(subtab: "dashboard" | "sources") {
    this.dataSubtab = subtab;
  }

  handleDataConnectSource(sourceId: string) {
    const source = this.dataSources?.find((s) => s.id === sourceId);
    const name = source?.name ?? sourceId;
    this.handleStartChatWithPrompt(`Help me connect and configure the ${name} integration.`);
  }

  handleDataQuerySubmit(query: string) {
    this.handleStartChatWithPrompt(`Query my connected data: ${query}`);
  }

  // User profile handlers
  handleUpdateUserProfile(name: string, avatar: string) {
    const trimmedName = name.trim().slice(0, 50);
    // Avatar can be a data URL (large) or empty - don't truncate data URLs
    const trimmedAvatar = avatar.trim();

    this.userName = trimmedName || "You";
    this.userAvatar = trimmedAvatar || null;

    this.applySettings({
      ...this.settings,
      userName: trimmedName,
      userAvatar: trimmedAvatar,
    });
  }

  render() {
    return renderApp(this);
  }
}
