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
import { localDateString } from "./format";
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
import {
  type LightboxImage,
  type LightboxState,
  createLightboxState,
  openLightbox,
  closeLightbox,
  lightboxNav,
} from "./chat/lightbox";
import { loadAssistantIdentity as loadAssistantIdentityInternal } from "./controllers/assistant-identity";
import type { FailedMessage } from "./controllers/chat";
import { retryPendingMessage } from "./controllers/chat";
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
  submitDailyRating as submitDailyRatingInternal,
  type TrustTrackerData,
} from "./controllers/trust-tracker";
import type { GuardrailsViewData } from "./controllers/guardrails";
import {
  loadLifetracks as loadLifetracksInternal,
  selectLifetrack as selectLifetrackInternal,
  enableLifetracks as enableLifetracksInternal,
  generateLifetrack as generateLifetrackInternal,
  type LifetrackEntry,
  type LifetracksState,
} from "./controllers/lifetracks";
import { startMeetingNotifications, stopMeetingNotifications } from "./controllers/meeting-notify";
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
  ArchivedSessionEntry,
  ChannelsStatusSnapshot,
  ClawHubSearchResult,
  ClawHubSkillDetail,
  ClawHubSkillItem,
  ConfigSnapshot,
  ConfigUiHints,
  CronJob,
  CronRunLogEntry,
  CronStatus,
  HealthSnapshot,
  LogEntry,
  LogLevel,
  NostrProfile,
  PresenceEntry,
  SessionsListResult,
  SkillStatusReport,
  StatusSummary,
} from "./types";
import type { ClawHubMessage } from "./controllers/clawhub";
import type { ToolExecutionInfo } from "./types/chat-types";
import { type ChatAttachment, type ChatQueueItem, type CronFormState } from "./ui-types";
import type { NostrProfileFormState } from "./views/channels.nostr-profile-form";
import type { LifetracksConfig } from "./views/lifetracks";
import type { TaskFilter, TaskSort, WorkspaceDetail, WorkspaceSummary, WorkspaceTask } from "./views/workspaces";

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
  @state() autoRetryAfterCompact = false;
  // Sidebar state for tool output viewing
  @state() sidebarOpen = false;
  @state() sidebarContent: string | null = null;
  @state() sidebarError: string | null = null;
  @state() sidebarMimeType: string | null = null;
  @state() sidebarFilePath: string | null = null;
  @state() sidebarTitle: string | null = null;
  @state() splitRatio = this.settings.splitRatio;
  @state() lightbox: LightboxState = createLightboxState();

  // Update check state
  @state() updateStatus: {
    openclawVersion: string;
    openclawLatest: string | null;
    openclawUpdateAvailable: boolean;
    openclawInstallKind: string;
    openclawChannel: string | null;
    pluginVersion: string;
    pluginLatest: string | null;
    pluginUpdateAvailable: boolean;
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
  @state() archivedSessions: ArchivedSessionEntry[] = [];
  @state() archivedSessionsLoading = false;
  @state() archivedSessionsExpanded = false;

  @state() cronLoading = false;
  @state() cronJobs: CronJob[] = [];
  @state() cronStatus: CronStatus | null = null;
  @state() cronError: string | null = null;
  @state() cronForm: CronFormState = { ...DEFAULT_CRON_FORM };
  @state() cronRunsJobId: string | null = null;
  @state() cronRuns: CronRunLogEntry[] = [];
  @state() cronBusy = false;

  // Workspace onboarding — true when ~/godmode/data/projects.json is empty/missing
  @state() workspaceNeedsSetup = false;

  // Onboarding experience state (6-phase flow)
  @state() onboardingPhase: import("./views/onboarding").OnboardingPhase = 0;
  @state() onboardingData: import("./views/onboarding").OnboardingData | null = null;
  @state() onboardingActive = false;

  // Memory onboarding wizard state
  @state() wizardActive = false;
  @state() wizardState: import("./views/onboarding-wizard").WizardState | null = null;

  // Setup tab state (80/20 fast onboarding)
  @state() showSetupTab = false;
  @state() setupChecklist: unknown = null;
  @state() setupChecklistLoading = false;
  @state() setupQuickDone = false;

  // Workspaces state
  @state() workspaces?: WorkspaceSummary[];
  @state() selectedWorkspace: WorkspaceDetail | null = null;
  @state() workspacesSearchQuery = "";
  @state() workspaceItemSearchQuery = "";
  @state() workspacesLoading = false;
  @state() workspacesCreateLoading = false;
  @state() workspacesError: string | null = null;
  @state() workspaceExpandedFolders: Set<string> = new Set();
  @state() allTasks?: WorkspaceTask[];
  @state() taskFilter?: TaskFilter;
  @state() taskSort?: TaskSort;
  @state() showCompletedTasks?: boolean;
  @state() editingTaskId: string | null = null;

  // Workspace browsing state
  @state() workspaceBrowsePath: string | null = null;
  @state() workspaceBrowseEntries: import("./controllers/workspaces.js").BrowseEntry[] | null = null;
  @state() workspaceBreadcrumbs: Array<{ name: string; path: string }> | null = null;
  @state() workspaceBrowseSearchQuery = "";
  @state() workspaceBrowseSearchResults: Array<{ path: string; name: string; type: string; excerpt?: string }> | null = null;

  // My Day state
  @state() myDayLoading = false;
  @state() myDayError: string | null = null;
  @state() todaySelectedDate: string = localDateString();
  @state() todayViewMode: "my-day" | "agent-log" = "my-day";

  // Daily Brief state
  @state() dailyBrief?: import("./views/daily-brief").DailyBriefData | null;
  @state() dailyBriefLoading = false;
  @state() dailyBriefError: string | null = null;
  @state() agentLog?: import("./views/my-day").AgentLogData | null;
  @state() agentLogLoading = false;
  @state() agentLogError: string | null = null;
  @state() briefNotes: Record<string, string> = {};

  // Today tasks state
  @state() todayTasks: import("./views/workspaces").WorkspaceTask[] = [];
  @state() todayTasksLoading = false;
  @state() todayEditingTaskId: string | null = null;
  @state() todayShowCompleted = false;

  @state() chatPrivateMode = false;
  /** Maps private session keys → expiry timestamp (ms). Ephemeral sessions auto-delete. */
  @state() privateSessions: Map<string, number> = new Map();
  private _privateSessionTimer: ReturnType<typeof setInterval> | null = null;

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
  @state() skillsSubTab: "my-skills" | "clawhub" = "my-skills";
  @state() clawhubQuery = "";
  @state() clawhubResults: ClawHubSearchResult[] | null = null;
  @state() clawhubExploreItems: ClawHubSkillItem[] | null = null;
  @state() clawhubExploreSort = "trending";
  @state() clawhubLoading = false;
  @state() clawhubError: string | null = null;
  @state() clawhubDetailSlug: string | null = null;
  @state() clawhubDetail: ClawHubSkillDetail | null = null;
  @state() clawhubImporting: string | null = null;
  @state() clawhubMessage: ClawHubMessage | null = null;

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
  @state() private chatUserNearBottom = true;
  private chatIsAutoScrolling = false;
  @state() private chatNewMessagesBelow = false;
  @state() consciousnessStatus: "idle" | "loading" | "ok" | "error" = "idle";

  // Focus Pulse state
  @state() focusPulseData: FocusPulseData | null = null;

  // Trust Tracker state
  @state() trustTrackerData: TrustTrackerData | null = null;
  @state() trustTrackerLoading = false;

  // Guardrails state
  @state() guardrailsData: GuardrailsViewData | null = null;
  @state() guardrailsLoading = false;
  @state() guardrailsShowAddForm = false;

  // Mission Control state
  @state() missionControlData: import("./controllers/mission-control.js").MissionControlData | null = null;
  @state() missionControlLoading = false;
  @state() missionControlError: string | null = null;
  missionControlPollInterval: number | null = null;

  // GodMode Options state
  @state() godmodeOptions: Record<string, unknown> | null = null;
  @state() godmodeOptionsLoading = false;

  // Dashboards state
  @state() dashboardsList: import("./controllers/dashboards.js").DashboardManifest[] | undefined;
  @state() dashboardsLoading = false;
  @state() dashboardsError: string | null = null;
  @state() activeDashboardId: string | null = null;
  @state() activeDashboardHtml: string | null = null;
  @state() activeDashboardManifest: import("./controllers/dashboards.js").DashboardManifest | null = null;
  /** Stashed session key to restore when leaving an active dashboard */
  dashboardPreviousSessionKey: string | null = null;
  /** Whether the inline chat panel is expanded */
  @state() dashboardChatOpen = false;

  // Second Brain state
  @state() secondBrainSubtab: import("./views/second-brain").SecondBrainSubtab = "identity";
  @state() secondBrainLoading = false;
  @state() secondBrainError: string | null = null;
  @state() secondBrainIdentity: import("./views/second-brain").SecondBrainIdentityData | null = null;
  @state() secondBrainMemoryBank: import("./views/second-brain").SecondBrainMemoryBankData | null = null;
  @state() secondBrainAiPacket: import("./views/second-brain").SecondBrainAiPacketData | null = null;
  @state() secondBrainSourcesData: import("./views/second-brain").SecondBrainSourcesData | null = null;
  @state() secondBrainResearchData: import("./views/second-brain").SecondBrainResearchData | null = null;
  @state() secondBrainResearchAddFormOpen = false;
  @state() secondBrainResearchAddForm: import("./views/second-brain").ResearchAddForm = { title: "", url: "", category: "", tags: "", notes: "" };
  @state() secondBrainResearchCategories: string[] = [];
  @state() secondBrainSelectedEntry: import("./views/second-brain").SecondBrainEntryDetail | null = null;
  @state() secondBrainSearchQuery = "";
  @state() secondBrainSyncing = false;
  @state() secondBrainBrowsingFolder: string | null = null;
  @state() secondBrainFolderEntries: import("./views/second-brain").SecondBrainMemoryEntry[] | null = null;
  @state() secondBrainFolderName: string | null = null;
  // Second Brain Files tab state
  @state() secondBrainFileTree: import("./views/second-brain").BrainTreeNode[] | null = null;
  @state() secondBrainFileTreeLoading = false;
  @state() secondBrainFileSearchQuery = "";
  @state() secondBrainFileSearchResults: import("./views/second-brain").BrainSearchResult[] | null = null;

  // Proactive Intel state
  @state() intelInsights: import("./controllers/proactive-intel").IntelInsight[] = [];
  @state() intelDiscoveries: import("./controllers/proactive-intel").ScoutFinding[] = [];
  @state() intelPatterns: import("./controllers/proactive-intel").UserPatterns | null = null;
  @state() intelStatus: import("./controllers/proactive-intel").IntelStatus | null = null;
  @state() intelLoading = false;
  @state() intelError: string | null = null;

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

    // Restore tracked private sessions from localStorage (expire stale ones)
    this._restorePrivateSessions();
  }

  protected firstUpdated() {
    handleFirstUpdated(this as unknown as Parameters<typeof handleFirstUpdated>[0]);
  }

  disconnectedCallback() {
    stopMeetingNotifications();
    this._stopPrivateSessionTimer();
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
    // Initialize backend state first — parse daily note, populate items, set active
    await startMorningSetInternal(this);

    // Then switch to chat and kick off the morning priority conversation in a new session
    this.setTab("chat" as import("./navigation").Tab);
    const prompt = "Let's do my morning set. Check my daily note for today's Win The Day items, then help me review priorities and pick my #1 focus to lock in.";
    const { createNewSession } = await import("./app-render.helpers.js");
    createNewSession(this);
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

  async handleDailyRate(rating: number, note?: string) {
    await submitDailyRatingInternal(this, rating, note);
  }

  // Guardrails handlers
  async handleGuardrailsLoad() {
    const { loadGuardrails } = await import("./controllers/guardrails.js");
    await loadGuardrails(this);
  }

  async handleGuardrailToggle(gateId: string, enabled: boolean) {
    const { toggleGuardrail } = await import("./controllers/guardrails.js");
    await toggleGuardrail(this, gateId, enabled);
  }

  async handleGuardrailThresholdChange(gateId: string, key: string, value: number) {
    const { updateGuardrailThreshold } = await import("./controllers/guardrails.js");
    await updateGuardrailThreshold(this, gateId, key, value);
  }

  async handleCustomGuardrailToggle(id: string, enabled: boolean) {
    const { toggleCustomGuardrail } = await import("./controllers/guardrails.js");
    await toggleCustomGuardrail(this, id, enabled);
  }

  async handleCustomGuardrailDelete(id: string) {
    const { deleteCustomGuardrail } = await import("./controllers/guardrails.js");
    await deleteCustomGuardrail(this, id);
  }

  async handleCustomGuardrailAdd(input: import("./controllers/guardrails").AddCustomGuardrailInput) {
    const { addCustomGuardrailFromUI } = await import("./controllers/guardrails.js");
    await addCustomGuardrailFromUI(this, input);
    this.guardrailsShowAddForm = false;
  }

  handleToggleGuardrailAddForm() {
    this.guardrailsShowAddForm = !this.guardrailsShowAddForm;
  }

  // Mission Control handlers
  async handleMissionControlRefresh() {
    const { loadMissionControl } = await import("./controllers/mission-control.js");
    await loadMissionControl(this);
  }

  async handleMissionControlCancelTask(taskId: string) {
    const { cancelCodingTask } = await import("./controllers/mission-control.js");
    await cancelCodingTask(this, taskId);
  }

  async handleMissionControlApproveItem(itemId: string) {
    // Try coding task approval first; fall back to queue item approval
    const { approveCodingTask, approveQueueItem } = await import("./controllers/mission-control.js");
    const wasCodingTask = await approveCodingTask(this, itemId);
    if (!wasCodingTask) {
      await approveQueueItem(this, itemId);
    }
  }

  async handleMissionControlRetryItem(itemId: string) {
    const { retryQueueItem } = await import("./controllers/mission-control.js");
    await retryQueueItem(this, itemId);
  }

  async handleMissionControlViewDetail(agent: import("./controllers/mission-control.js").AgentRunView) {
    const { loadAgentDetail } = await import("./controllers/mission-control.js");
    const detail = await loadAgentDetail(this, agent);
    this.handleOpenSidebar(detail.content, {
      mimeType: detail.mimeType,
      title: detail.title,
    });
  }

  async handleMissionControlOpenSession(sessionKey: string) {
    const openTabs = this.settings.openTabs.includes(sessionKey)
      ? this.settings.openTabs
      : [...this.settings.openTabs, sessionKey];
    this.applySettings({
      ...this.settings,
      openTabs,
      sessionKey,
      lastActiveSessionKey: sessionKey,
      tabLastViewed: {
        ...this.settings.tabLastViewed,
        [sessionKey]: Date.now(),
      },
    });
    this.sessionKey = sessionKey;
    this.setTab("chat" as import("./navigation.js").Tab);
    this.chatMessages = [];
    this.chatStream = null;
    this.chatStreamStartedAt = null;
    this.chatRunId = null;
    this.resetToolStream();
    this.resetChatScroll();
    void this.loadAssistantIdentity();
    const { loadChatHistory } = await import("./controllers/chat.js");
    await loadChatHistory(this);
  }

  async handleMissionControlOpenTaskSession(sourceTaskId: string) {
    if (!this.client || !this.connected) return;
    try {
      const result = await this.client.request<{
        sessionId: string;
        created: boolean;
        task?: { title?: string };
        queueOutput?: string | null;
        agentPrompt?: string | null;
      }>(
        "tasks.openSession",
        { taskId: sourceTaskId },
      );
      if (result?.sessionId) {
        // Set the tab title to the task name (not the auto-generated one from message content)
        if (result.task?.title) {
          const { autoTitleCache } = await import("./controllers/sessions.js");
          autoTitleCache.set(result.sessionId, result.task.title);
        }
        await this.handleMissionControlOpenSession(result.sessionId);
        // Seed empty sessions with agent output so the user has full context.
        // Check chatMessages after load — handles both new and pre-existing empty sessions.
        if (result.queueOutput && this.chatMessages.length === 0) {
          await this.seedSessionWithAgentOutput(
            result.task?.title ?? "task",
            result.queueOutput,
            result.agentPrompt ?? undefined,
          );
        }
      }
    } catch (err) {
      console.error("[MissionControl] Failed to open task session:", err);
      this.showToast("Failed to open session", "error");
    }
  }

  async handleMissionControlStartQueueItem(itemId: string) {
    // Open a session for this queue item so the user can spec it out before processing
    await this.handleMissionControlOpenTaskSession(itemId);
  }

  /**
   * Seeds a newly opened session with agent output so the user has the
   * full context from the agent that worked on the task.
   * Sends the output as a user message so it becomes part of the session
   * history — the assistant will respond with awareness of the agent's work.
   */
  async seedSessionWithAgentOutput(taskTitle: string, output: string, agentPrompt?: string) {
    if (!this.client || !this.connected) return;
    const parts: string[] = [
      `A GodMode agent already worked on this task: **${taskTitle}**`,
    ];

    if (agentPrompt) {
      // Extract just the task section from the prompt (skip system boilerplate)
      const taskMatch = agentPrompt.match(/## Task\n([\s\S]*?)(?=\n## |$)/);
      if (taskMatch) {
        parts.push("", "**What the agent was asked to do:**", taskMatch[1].trim());
      }
    }

    parts.push(
      "",
      "**Agent's output:**",
      "",
      output,
      "",
      "---",
      "",
      "I'm reviewing this. Help me understand the output, flag anything that needs attention, and suggest what to do next.",
    );

    const contextMessage = parts.join("\n");
    try {
      const { sendChatMessage } = await import("./controllers/chat.js");
      await sendChatMessage(this as any, contextMessage);
    } catch (err) {
      console.error("[Session] Failed to seed session with agent output:", err);
    }
  }

  async handleMissionControlAddToQueue(type: string, title: string) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("queue.add", { type, title, priority: "normal" });
      this.showToast("Added to queue", "success", 2000);
      const { loadMissionControl } = await import("./controllers/mission-control.js");
      await loadMissionControl(this);
    } catch {
      this.showToast("Failed to add to queue", "error");
    }
  }

  // Dashboards handlers
  async handleDashboardsRefresh() {
    const { loadDashboards } = await import("./controllers/dashboards.js");
    await loadDashboards(this);
  }

  async handleDashboardSelect(id: string) {
    const { loadDashboard } = await import("./controllers/dashboards.js");
    await loadDashboard(this, id);

    // Open/get the persistent session for this dashboard and switch to it
    // so inline chat panel is powered by the real session
    if (this.client && this.connected) {
      try {
        const result = await this.client.request<{
          sessionId: string;
          created: boolean;
          manifest: { title: string; id: string; widgets?: string[] };
        }>("dashboards.openSession", { dashboardId: id });

        if (result?.sessionId) {
          // Stash the current session so we can restore it when leaving
          this.dashboardPreviousSessionKey = this.sessionKey;

          const nextKey = result.sessionId;
          const { autoTitleCache } = await import("./controllers/sessions.js");
          autoTitleCache.set(nextKey, result.manifest.title);

          // Update manifest with sessionId if it was just created
          if (this.activeDashboardManifest) {
            this.activeDashboardManifest = {
              ...this.activeDashboardManifest,
              sessionId: nextKey,
            };
          }

          // Switch session context
          const { saveDraft } = await import("./app-chat.js");
          saveDraft(this);
          this.sessionKey = nextKey;

          // Load the chat history for inline display
          this.chatMessages = [];
          this.chatStream = null;
          this.chatStreamStartedAt = null;
          this.chatRunId = null;
          this.resetToolStream();
          const { loadChatHistory } = await import("./controllers/chat.js");
          await loadChatHistory(this);

          // Default open the chat panel for dashboards
          this.dashboardChatOpen = true;
        }
      } catch (err) {
        console.error("[Dashboards] Failed to init session on select:", err);
        // Non-critical — dashboard still renders, just no inline chat
      }
    }
  }

  async handleDashboardDelete(id: string) {
    const { deleteDashboard } = await import("./controllers/dashboards.js");
    await deleteDashboard(this, id);
  }

  async handleDashboardCreateViaChat() {
    this.setTab("chat" as import("./navigation").Tab);
    const { createNewSession } = await import("./app-render.helpers.js");
    createNewSession(this);
    void this.handleSendChat(
      "I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.",
    );
  }

  handleDashboardBack() {
    this.activeDashboardId = null;
    this.activeDashboardHtml = null;
    this.activeDashboardManifest = null;
    this.dashboardChatOpen = false;

    // Restore previous session
    if (this.dashboardPreviousSessionKey) {
      const prev = this.dashboardPreviousSessionKey;
      this.dashboardPreviousSessionKey = null;
      void import("./app-chat.js").then(({ saveDraft }) => {
        saveDraft(this);
        this.sessionKey = prev;
        void import("./controllers/chat.js").then(({ loadChatHistory }) => {
          void loadChatHistory(this);
        });
      });
    }
  }

  async handleDashboardOpenSession(dashboardId: string) {
    // Session is already active from handleDashboardSelect — just navigate to chat tab
    const sessionId = this.activeDashboardManifest?.sessionId;
    if (!sessionId) {
      this.showToast("No session for this dashboard", "error");
      return;
    }

    // Clear the stashed key — user is intentionally leaving to chat
    this.dashboardPreviousSessionKey = null;
    this.activeDashboardId = null;
    this.activeDashboardHtml = null;
    this.activeDashboardManifest = null;
    this.dashboardChatOpen = false;

    // Ensure session is in open tabs
    const openTabs = this.settings.openTabs.includes(sessionId)
      ? this.settings.openTabs
      : [...this.settings.openTabs, sessionId];

    this.applySettings({
      ...this.settings,
      openTabs,
      sessionKey: sessionId,
      lastActiveSessionKey: sessionId,
      tabLastViewed: {
        ...this.settings.tabLastViewed,
        [sessionId]: Date.now(),
      },
    });

    this.setTab("chat" as import("./navigation").Tab);
    const { syncUrlWithSessionKey } = await import("./app-settings.js");
    syncUrlWithSessionKey(this, sessionId, true);
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

  // Second Brain handlers
  async handleSecondBrainRefresh() {
    const { loadSecondBrain } = await import("./controllers/second-brain.js");
    await loadSecondBrain(this);
  }

  handleSecondBrainSubtabChange(subtab: import("./views/second-brain").SecondBrainSubtab) {
    this.secondBrainSubtab = subtab;
    this.secondBrainLoading = false;
    this.secondBrainSelectedEntry = null;
    this.secondBrainSearchQuery = "";
    this.secondBrainError = null;
    this.secondBrainBrowsingFolder = null;
    this.secondBrainFolderEntries = null;
    this.secondBrainFolderName = null;
    if (subtab === "intel") {
      // Intel subtab loads its own data
      this.handleIntelLoad().catch((err) => {
        console.error("[Intel] Load after subtab change failed:", err);
        this.intelError = err instanceof Error ? err.message : "Failed to load intel data";
      });
    } else if (subtab === "files") {
      // Files subtab loads its own data
      this.handleSecondBrainFileTreeRefresh().catch((err) => {
        console.error("[SecondBrain] File tree load after subtab change failed:", err);
      });
    } else {
      this.handleSecondBrainRefresh().catch((err) => {
        console.error("[SecondBrain] Refresh after subtab change failed:", err);
        this.secondBrainError = err instanceof Error ? err.message : "Failed to load data";
        this.secondBrainLoading = false;
      });
    }
  }

  async handleSecondBrainSelectEntry(path: string) {
    const isHtml = path.endsWith(".html") || path.endsWith(".htm");

    // HTML files open directly in sidebar — bypass panel loading state
    if (isHtml) {
      try {
        const result = await this.client!.request<{ name: string; content: string }>(
          "secondBrain.memoryBankEntry",
          { path },
        );
        if (result?.content) {
          this.handleOpenSidebar(result.content, {
            mimeType: "text/html",
            filePath: path,
            title: result.name || path.split("/").pop() || "File",
          });
        }
      } catch (err) {
        console.error("[SecondBrain] Failed to open HTML file:", err);
      }
      return;
    }

    const { loadSecondBrainEntry } = await import("./controllers/second-brain.js");
    await loadSecondBrainEntry(this, path);
  }

  async handleSecondBrainOpenInBrowser(path: string) {
    try {
      const result = await this.client!.request<{ name: string; content: string }>(
        "secondBrain.memoryBankEntry",
        { path },
      );
      if (result?.content) {
        const blob = new Blob([result.content], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("[SecondBrain] Failed to open in browser:", err);
    }
  }

  async handleSecondBrainBrowseFolder(path: string) {
    const { browseFolder } = await import("./controllers/second-brain.js");
    await browseFolder(this, path);
  }

  handleSecondBrainBack() {
    if (this.secondBrainSelectedEntry) {
      this.secondBrainSelectedEntry = null;
    } else if (this.secondBrainBrowsingFolder) {
      this.secondBrainBrowsingFolder = null;
      this.secondBrainFolderEntries = null;
      this.secondBrainFolderName = null;
    }
  }

  handleSecondBrainSearch(query: string) {
    this.secondBrainSearchQuery = query;
  }

  async handleSecondBrainSync() {
    const { syncSecondBrain } = await import("./controllers/second-brain.js");
    await syncSecondBrain(this);
  }

  // Second Brain Files tab handlers

  async handleSecondBrainFileTreeRefresh() {
    if (!this.client || !this.connected) return;
    this.secondBrainFileTreeLoading = true;
    try {
      const result = await this.client.request<{
        tree: import("./views/second-brain").BrainTreeNode[];
      }>("secondBrain.fileTree", { depth: 4 });
      this.secondBrainFileTree = result.tree ?? [];
    } catch (err) {
      console.error("[SecondBrain] fileTree failed:", err);
    } finally {
      this.secondBrainFileTreeLoading = false;
    }
  }

  handleSecondBrainFileSearch(query: string) {
    this.secondBrainFileSearchQuery = query;
    if (!query.trim()) {
      this.secondBrainFileSearchResults = null;
      return;
    }
    // Fire search request (simple debounce: last-write-wins)
    void this._doSecondBrainFileSearch(query);
  }

  private async _doSecondBrainFileSearch(query: string) {
    if (!this.client || !this.connected) return;
    try {
      const result = await this.client.request<{
        results: import("./views/second-brain").BrainSearchResult[];
      }>("secondBrain.search", { query, limit: 50 });
      // Only update if query hasn't changed during the request
      if (this.secondBrainFileSearchQuery === query) {
        this.secondBrainFileSearchResults = result.results ?? [];
      }
    } catch (err) {
      console.error("[SecondBrain] search failed:", err);
    }
  }

  async handleSecondBrainFileSelect(path: string) {
    if (!this.client || !this.connected) return;
    try {
      const result = await this.client.request<{ name: string; content: string; updatedAt?: string }>(
        "secondBrain.memoryBankEntry",
        { path },
      );
      if (result?.content) {
        const isHtml = path.endsWith(".html") || path.endsWith(".htm");
        this.handleOpenSidebar(result.content, {
          mimeType: isHtml ? "text/html" : "text/markdown",
          filePath: path,
          title: result.name || path.split("/").pop() || "File",
        });
      }
    } catch (err) {
      console.error("[SecondBrain] Failed to open file:", err);
      this.showToast("Failed to open file", "error");
    }
  }

  handleResearchAddFormToggle() {
    this.secondBrainResearchAddFormOpen = !this.secondBrainResearchAddFormOpen;
    if (this.secondBrainResearchAddFormOpen) {
      this.secondBrainResearchAddForm = { title: "", url: "", category: "", tags: "", notes: "" };
    }
  }

  handleResearchAddFormChange(field: string, value: string) {
    this.secondBrainResearchAddForm = { ...this.secondBrainResearchAddForm, [field]: value };
  }

  async handleResearchAddSubmit() {
    const { addResearch } = await import("./controllers/second-brain.js");
    await addResearch(this);
  }

  async handleResearchSaveViaChat() {
    this.setTab("chat" as import("./navigation").Tab);
    const { createNewSession } = await import("./app-render.helpers.js");
    createNewSession(this);
    void this.handleSendChat(
      "I want to save some research. I'll paste links, bookmarks, or notes — please organize them into ~/godmode/memory/research/ with proper frontmatter (title, url, category, tags, date). Ask me what I'd like to save.",
    );
  }

  async handleAddSource() {
    this.setTab("chat" as import("./navigation").Tab);
    const { createNewSession } = await import("./app-render.helpers.js");
    createNewSession(this);
    void this.handleSendChat(
      "I want to add a new data source to my Second Brain. Help me figure out what I need — whether it's an API integration, a local file sync, or a new skill. Ask me what source I'd like to connect.",
    );
  }

  // Community Resources handlers
  async handleCommunityResourceAdd() {
    const { addCommunityResource } = await import("./controllers/second-brain.js");
    await addCommunityResource(this);
  }

  async handleCommunityResourceRemove(id: string) {
    const { removeCommunityResource } = await import("./controllers/second-brain.js");
    await removeCommunityResource(this, id);
  }

  handleCommunityResourceAddFormToggle() {
    this.secondBrainCommunityResourceAddFormOpen = !this.secondBrainCommunityResourceAddFormOpen;
    if (this.secondBrainCommunityResourceAddFormOpen) {
      this.secondBrainCommunityResourceAddForm = { url: "", label: "", description: "", tags: "" };
    }
  }

  handleCommunityResourceAddFormChange(field: string, value: string) {
    this.secondBrainCommunityResourceAddForm = { ...this.secondBrainCommunityResourceAddForm, [field]: value };
  }

  // Proactive Intel handlers
  async handleIntelLoad() {
    const { loadInsights, loadDiscoveries, loadUserPatterns, loadStatus } = await import("./controllers/proactive-intel.js");
    const state = {
      client: this.client,
      connected: this.connected,
      insights: this.intelInsights ?? [],
      discoveries: this.intelDiscoveries ?? [],
      patterns: this.intelPatterns ?? null,
      status: this.intelStatus ?? null,
      loading: false,
      error: null,
    };
    await Promise.all([loadInsights(state), loadDiscoveries(state), loadUserPatterns(state), loadStatus(state)]);
    this.intelInsights = state.insights;
    this.intelDiscoveries = state.discoveries;
    this.intelPatterns = state.patterns;
    this.intelStatus = state.status;
    this.intelLoading = state.loading;
    this.intelError = state.error;
  }

  async handleIntelDismiss(id: string) {
    const { dismissInsight } = await import("./controllers/proactive-intel.js");
    const state = {
      client: this.client,
      connected: this.connected,
      insights: this.intelInsights ?? [],
      discoveries: this.intelDiscoveries ?? [],
      patterns: this.intelPatterns ?? null,
      status: this.intelStatus ?? null,
      loading: false,
      error: null,
    };
    await dismissInsight(state, id);
    this.intelInsights = state.insights;
  }

  async handleIntelAct(id: string) {
    const { actOnInsight } = await import("./controllers/proactive-intel.js");
    const state = {
      client: this.client,
      connected: this.connected,
      insights: this.intelInsights ?? [],
      discoveries: this.intelDiscoveries ?? [],
      patterns: this.intelPatterns ?? null,
      status: this.intelStatus ?? null,
      loading: false,
      error: null,
    };
    await actOnInsight(state, id);
    this.intelInsights = state.insights;
  }

  async handleIntelRefresh() {
    this.intelLoading = true;
    const { forceRefresh } = await import("./controllers/proactive-intel.js");
    const state = {
      client: this.client,
      connected: this.connected,
      insights: this.intelInsights ?? [],
      discoveries: this.intelDiscoveries ?? [],
      patterns: this.intelPatterns ?? null,
      status: this.intelStatus ?? null,
      loading: true,
      error: null,
    };
    await forceRefresh(state);
    this.intelInsights = state.insights;
    this.intelDiscoveries = state.discoveries;
    this.intelPatterns = state.patterns;
    this.intelStatus = state.status;
    this.intelLoading = false;
    this.intelError = state.error;
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
    // Auto-compact if context is approaching limit (90%+) before sending.
    // Instead of compacting inline and racing with the send, we save the
    // user's message for automatic retry after compaction completes.
    const activeSession = this.sessionsResult?.sessions?.find((s) => s.key === this.sessionKey);
    if (activeSession) {
      const used = activeSession.totalTokens ?? 0;
      const max =
        activeSession.contextTokens ?? this.sessionsResult?.defaults?.contextTokens ?? 200000;
      const usage = max > 0 ? used / max : 0;

      if (usage >= 0.9 && !this.compactionStatus?.active) {
        const message = (messageOverride ?? this.chatMessage).trim();
        const attachments = messageOverride == null ? [...(this.chatAttachments ?? [])] : [];
        if (message || attachments.length > 0) {
          // Save message for auto-retry after compaction
          this.pendingRetry = { message, attachments, timestamp: Date.now() };
          this.autoRetryAfterCompact = true;

          // Add optimistic user message so user sees their message in chat
          this.chatMessages = [
            ...this.chatMessages,
            { role: "user", content: [{ type: "text", text: message }], timestamp: Date.now() },
          ];

          // Clear input field
          if (messageOverride == null) {
            this.chatMessage = "";
            this.chatAttachments = [];
          }

          this.showToast("Context near limit — auto-compacting...", "info", 3000);
          void this.handleCompactChat();
          return; // Will auto-retry after compaction completes
        }
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

  handleImageClick(url: string, allImages: LightboxImage[], index: number) {
    this.lightbox = openLightbox(url, allImages, index);
  }

  handleLightboxClose() {
    this.lightbox = closeLightbox();
  }

  handleLightboxNav(delta: number) {
    this.lightbox = lightboxNav(this.lightbox, delta);
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
        status: newStatus,
        completedAt: newStatus === "complete" ? new Date().toISOString() : null,
      });
      // Refresh today tasks so the UI updates
      const { loadTodayTasksWithQueueStatus } = await import("./controllers/my-day.js");
      await loadTodayTasksWithQueueStatus(this);
    } catch (err) {
      console.error("[MyDay] Failed to update task status:", err);
    }
  }

  async handleTodayCreateTask(title: string) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("tasks.create", {
        title,
        dueDate: localDateString(),
        priority: "medium",
        source: "chat",
      });
      const { loadTodayTasksWithQueueStatus } = await import("./controllers/my-day.js");
      await loadTodayTasksWithQueueStatus(this);
    } catch (err) {
      console.error("[MyDay] Failed to create task:", err);
      this.showToast("Failed to create task", "error");
    }
  }

  handleTodayEditTask(taskId: string | null) {
    this.todayEditingTaskId = taskId;
  }

  async handleTodayUpdateTask(taskId: string, updates: { title?: string; dueDate?: string | null }) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("tasks.update", { id: taskId, ...updates });
      this.todayEditingTaskId = null;
      const { loadTodayTasksWithQueueStatus } = await import("./controllers/my-day.js");
      await loadTodayTasksWithQueueStatus(this);
    } catch (err) {
      console.error("[MyDay] Failed to update task:", err);
      this.showToast("Failed to update task", "error");
    }
  }

  handleTodayToggleCompleted() {
    this.todayShowCompleted = !this.todayShowCompleted;
  }

  async handleTodayStartTask(taskId: string) {
    if (!this.client || !this.connected) {
      return;
    }
    try {
      const result = await this.client.request<{
        sessionId: string;
        sessionKey?: string;
        created: boolean;
        task?: { title?: string };
        queueOutput?: string | null;
        agentPrompt?: string | null;
      }>(
        "tasks.openSession",
        { taskId },
      );
      const key = result?.sessionId ?? result?.sessionKey;
      if (key) {
        // Set the tab title to the task name
        if (result.task?.title) {
          const { autoTitleCache } = await import("./controllers/sessions.js");
          autoTitleCache.set(key, result.task.title);
        }
        this.setTab("chat" as import("./navigation").Tab);
        this.sessionKey = key;
        // Ensure session is in open tabs
        const openTabs = this.settings.openTabs.includes(key)
          ? this.settings.openTabs
          : [...this.settings.openTabs, key];
        this.applySettings({
          ...this.settings,
          sessionKey: key,
          lastActiveSessionKey: key,
          openTabs,
        });
        this.chatMessages = [];
        this.chatStream = null;
        this.chatStreamStartedAt = null;
        this.chatRunId = null;
        this.resetToolStream();
        this.resetChatScroll();
        void this.loadAssistantIdentity();
        const { loadChatHistory } = await import("./controllers/chat.js");
        await loadChatHistory(this);
        // Seed empty sessions with agent output (handles new + pre-existing empty sessions)
        if (result.queueOutput && this.chatMessages.length === 0) {
          void this.seedSessionWithAgentOutput(
            result.task?.title ?? "this task",
            result.queueOutput,
            result.agentPrompt ?? undefined,
          );
        }
        this.requestUpdate();
      }
    } catch (err) {
      console.error("[MyDay] Failed to open session for task:", err);
      this.showToast("Failed to open session for task", "error");
    }
  }

  // Date navigation handlers
  handleDatePrev() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() - 1);
    this.todaySelectedDate = localDateString(d);
    if (this.todayViewMode === "agent-log") {
      void loadAgentLogOnlyInternal(this);
      return;
    }
    void loadBriefOnlyInternal(this);
  }

  handleDateNext() {
    const d = new Date(this.todaySelectedDate + "T12:00:00");
    d.setDate(d.getDate() + 1);
    const today = localDateString();
    // Don't go past today
    const next = localDateString(d);
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
    this.todaySelectedDate = localDateString();
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
      // Turning off — destroy the private session entirely
      const privateKey = this.sessionKey;
      this.chatPrivateMode = false;
      void this._destroyPrivateSession(privateKey);
      this.showToast("Private session destroyed", "info", 2000);
      return;
    }
    // Turning on — create a new ephemeral session with 24h expiry
    this.chatPrivateMode = true;
    this.setTab("chat" as import("./navigation").Tab);
    void import("./app-render.helpers.js").then(({ createNewSession }) => {
      createNewSession(this);
      // Track this session as private with 24h expiry
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      this.privateSessions = new Map(this.privateSessions).set(this.sessionKey, expiresAt);
      this._persistPrivateSessions();
      this._startPrivateSessionTimer();
      // Inject system-style notice as first message
      this.chatMessages = [
        {
          role: "assistant",
          content:
            "This is a **private session**. Nothing will be saved to memory or logs.\n\n" +
            "This session self-destructs when you close it or in **24 hours** — whichever comes first.",
          timestamp: Date.now(),
        },
      ];
      this.requestUpdate();
    });
    this.showToast("Private session created — 24h countdown started", "info", 3000);
  }

  /** Destroy a private session: remove tab, delete from gateway, clean up tracking. */
  async _destroyPrivateSession(sessionKey: string) {
    // Remove from private tracking
    const next = new Map(this.privateSessions);
    next.delete(sessionKey);
    this.privateSessions = next;
    this._persistPrivateSessions();

    // If currently viewing the destroyed session, switch away
    if (this.sessionKey === sessionKey) {
      this.chatPrivateMode = false;
      const remaining = this.settings.openTabs.filter((t) => t !== sessionKey);
      const fallback = remaining[0] || "agent:main:main";
      this.applySettings({
        ...this.settings,
        openTabs: remaining.length > 0 ? remaining : ["agent:main:main"],
        sessionKey: fallback,
        lastActiveSessionKey: fallback,
      });
      this.sessionKey = fallback;
      void (await import("./controllers/chat.js")).loadChatHistory(this);
    } else {
      // Just remove from tabs
      this.applySettings({
        ...this.settings,
        openTabs: this.settings.openTabs.filter((t) => t !== sessionKey),
      });
    }

    // Delete from gateway (fire-and-forget, no confirmation prompt)
    if (this.client && this.connected) {
      this.client.request("sessions.delete", { key: sessionKey, deleteTranscript: true }).catch(() => {});
    }

    if (this.privateSessions.size === 0) {
      this._stopPrivateSessionTimer();
    }
  }

  /** Persist private session map to localStorage so it survives page reloads. */
  private _persistPrivateSessions() {
    const entries = Array.from(this.privateSessions.entries());
    if (entries.length === 0) {
      localStorage.removeItem("godmode.privateSessions");
    } else {
      localStorage.setItem("godmode.privateSessions", JSON.stringify(entries));
    }
  }

  /** Restore private sessions from localStorage on startup. */
  _restorePrivateSessions() {
    try {
      const raw = localStorage.getItem("godmode.privateSessions");
      if (!raw) return;
      const entries: [string, number][] = JSON.parse(raw);
      const now = Date.now();
      const valid = entries.filter(([, exp]) => exp > now);
      this.privateSessions = new Map(valid);
      if (valid.length !== entries.length) {
        // Some expired while offline — destroy them
        const expired = entries.filter(([, exp]) => exp <= now);
        for (const [key] of expired) {
          void this._destroyPrivateSession(key);
        }
      }
      if (this.privateSessions.size > 0) {
        // Check if current session is private
        if (this.privateSessions.has(this.sessionKey)) {
          this.chatPrivateMode = true;
        }
        this._startPrivateSessionTimer();
      }
      this._persistPrivateSessions();
    } catch {
      localStorage.removeItem("godmode.privateSessions");
    }
  }

  /** Start periodic timer to check for expired private sessions and update countdown. */
  private _startPrivateSessionTimer() {
    if (this._privateSessionTimer) return;
    this._privateSessionTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, expiresAt] of this.privateSessions) {
        if (expiresAt <= now) {
          void this._destroyPrivateSession(key);
          this.showToast("Private session expired and was destroyed", "info", 3000);
        }
      }
      // Force re-render to update countdown display
      if (this.privateSessions.size > 0) {
        this.requestUpdate();
      }
    }, 30_000); // Check every 30 seconds
  }

  private _stopPrivateSessionTimer() {
    if (this._privateSessionTimer) {
      clearInterval(this._privateSessionTimer);
      this._privateSessionTimer = null;
    }
  }

  async handleBriefSave(content: string) {
    if (!this.client || !this.connected) {
      return;
    }
    const date = this.dailyBrief?.date || this.todaySelectedDate;
    try {
      await this.client.request("dailyBrief.update", { date, content });
      // Update only metadata — do NOT update content to avoid re-rendering
      // the contenteditable div and losing cursor position during auto-save.
      if (this.dailyBrief) {
        this.dailyBrief = { ...this.dailyBrief, updatedAt: new Date().toISOString() };
      }
      // Note: syncTasksFromBrief runs server-side inside dailyBrief.update
      // (fire-and-forget). No need for a separate client-side sync call.
    } catch (err) {
      console.error("[DailyBrief] Save error:", err);
      this.showToast("Failed to save brief", "error");
    }
  }

  async handleBriefToggleCheckbox(index: number, checked: boolean) {
    if (!this.client || !this.connected) {
      return;
    }
    const date = this.dailyBrief?.date || this.todaySelectedDate;
    try {
      await this.client.request("dailyBrief.toggleCheckbox", { date, index, checked });
      if (this.dailyBrief) {
        this.dailyBrief = { ...this.dailyBrief, updatedAt: new Date().toISOString() };
      }
    } catch (err) {
      console.error("[DailyBrief] Checkbox toggle error:", err);
      this.showToast("Failed to toggle checkbox", "error");
    }
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

  async handleWorkspaceBrowse(folderPath: string) {
    if (!this.selectedWorkspace) return;
    const { browseWorkspaceFolder } = await import("./controllers/workspaces.js");
    const result = await browseWorkspaceFolder(this, this.selectedWorkspace.id, folderPath);
    if (result) {
      this.workspaceBrowsePath = folderPath;
      this.workspaceBrowseEntries = result.entries;
      this.workspaceBreadcrumbs = result.breadcrumbs;
    }
  }

  async handleWorkspaceBrowseSearch(query: string) {
    this.workspaceBrowseSearchQuery = query;
    if (!query.trim() || !this.selectedWorkspace) {
      this.workspaceBrowseSearchResults = null;
      return;
    }
    const { searchWorkspaceFiles } = await import("./controllers/workspaces.js");
    this.workspaceBrowseSearchResults = await searchWorkspaceFiles(
      this,
      this.selectedWorkspace.id,
      query,
    );
  }

  handleWorkspaceBrowseBack() {
    this.workspaceBrowsePath = null;
    this.workspaceBrowseEntries = null;
    this.workspaceBreadcrumbs = null;
    this.workspaceBrowseSearchQuery = "";
    this.workspaceBrowseSearchResults = null;
  }

  async handleWorkspaceCreateFolder(folderPath: string) {
    if (!this.selectedWorkspace) return;
    const { createWorkspaceFolder } = await import("./controllers/workspaces.js");
    const ok = await createWorkspaceFolder(this, this.selectedWorkspace.id, folderPath);
    if (ok && this.workspaceBrowsePath) {
      await this.handleWorkspaceBrowse(this.workspaceBrowsePath);
    }
    if (ok) {
      this.showToast("Folder created", "success", 2000);
    }
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

  handleOpenSupportChat() {
    const supportKey = "agent:main:support";

    // If already on the support session, just switch to chat tab
    if (this.sessionKey === supportKey) {
      this.setTab("chat" as import("./navigation").Tab);
      return;
    }

    // Save current draft before switching
    void import("./app-chat.js").then(({ saveDraft }) => saveDraft(this));

    // Add to open tabs if not already present
    const alreadyOpen = this.settings.openTabs.includes(supportKey);
    const openTabs = alreadyOpen
      ? this.settings.openTabs
      : [...this.settings.openTabs, supportKey];

    this.applySettings({
      ...this.settings,
      openTabs,
      sessionKey: supportKey,
      lastActiveSessionKey: supportKey,
      tabLastViewed: {
        ...this.settings.tabLastViewed,
        [supportKey]: Date.now(),
      },
    });
    this.sessionKey = supportKey;
    this.setTab("chat" as import("./navigation").Tab);
    this.chatMessages = [];
    this.chatStream = null;
    this.chatStreamStartedAt = null;
    this.chatRunId = null;
    this.resetToolStream();
    this.resetChatScroll();
    void this.loadAssistantIdentity();

    // Set auto-title so the tab shows "Support" immediately
    void import("./controllers/sessions.js").then(({ autoTitleCache }) => {
      autoTitleCache.set(supportKey, "Support");
    });

    void import("./controllers/chat.js").then(({ loadChatHistory }) => {
      loadChatHistory(this).then(() => {
        // If this is a fresh support session (no history), seed with welcome message
        if (this.chatMessages.length === 0 && this.sessionKey === supportKey) {
          this.chatMessages = [
            {
              role: "assistant",
              content:
                "**Welcome to GodMode Support**\n\n" +
                "I have full access to your system diagnostics and GodMode knowledge base. " +
                "I can help with:\n\n" +
                "- Troubleshooting issues\n" +
                "- Feature questions and configuration\n" +
                "- Setup guidance\n" +
                "- Escalation to the team if needed\n\n" +
                "What can I help you with?",
              timestamp: Date.now(),
            } as unknown,
          ];
          this.requestUpdate();
        }
      }).catch((err: unknown) => {
        console.error("[Support] Failed to load chat history:", err);
      });
    });
  }

  // ── Memory Onboarding Wizard handlers ─────────────────────────

  handleWizardOpen() {
    void import("./views/onboarding-wizard.js").then(({ emptyWizardState }) => {
      this.wizardState = emptyWizardState();
      this.wizardActive = true;
      this.requestUpdate();
    });
  }

  handleWizardClose() {
    this.wizardActive = false;
    this.wizardState = null;
    this.requestUpdate();
  }

  handleWizardStepChange(step: import("./views/onboarding-wizard").WizardStep) {
    if (!this.wizardState) return;
    this.wizardState = { ...this.wizardState, step };
    this.requestUpdate();
  }

  handleWizardAnswerChange(key: string, value: unknown) {
    if (!this.wizardState) return;
    this.wizardState = {
      ...this.wizardState,
      answers: { ...this.wizardState.answers, [key]: value },
    };
    this.requestUpdate();
  }

  async handleWizardPreview() {
    if (!this.client || !this.wizardState) return;
    try {
      const result = await this.client.request<{
        files: Array<{ path: string; exists: boolean; wouldCreate: boolean }>;
      }>("onboarding.wizard.preview", this.wizardState.answers);
      this.wizardState = { ...this.wizardState, preview: result.files ?? [] };
      this.requestUpdate();
    } catch (err) {
      console.error("[Wizard] Preview failed:", err);
    }
  }

  async handleWizardGenerate() {
    if (!this.client || !this.wizardState) return;
    this.wizardState = { ...this.wizardState, generating: true, error: null };
    this.requestUpdate();
    try {
      const result = await this.client.request<{
        success: boolean;
        filesCreated: number;
        filesSkipped: number;
        configPatched: boolean;
        workspacePath: string;
        configError?: string;
      }>("onboarding.wizard.generate", this.wizardState.answers);

      this.wizardState = {
        ...this.wizardState,
        generating: false,
        step: 9 as import("./views/onboarding-wizard").WizardStep,
        result: {
          filesCreated: result.filesCreated,
          filesSkipped: result.filesSkipped,
          configPatched: result.configPatched,
          workspacePath: result.workspacePath,
        },
      };
      this.requestUpdate();
      this.showToast("Memory system generated!", "success", 4000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate workspace";
      this.wizardState = {
        ...this.wizardState,
        generating: false,
        error: errorMsg,
      };
      this.requestUpdate();
      this.showToast(errorMsg, "error");
    }
  }

  // ── Setup tab handlers ───────────────────────────────────────

  async handleQuickSetup(name: string, licenseKey: string, dailyIntelTopics: string) {
    void import("./controllers/setup.js").then(async ({ quickSetup }) => {
      const success = await quickSetup(this, name, licenseKey, dailyIntelTopics);
      if (success) {
        this.setTab("chat" as import("./navigation").Tab);
        // Reload checklist in background
        void import("./controllers/setup.js").then(({ loadChecklist }) => loadChecklist(this));
      }
    });
  }

  handleLoadSetupChecklist() {
    void import("./controllers/setup.js").then(({ loadChecklist }) => loadChecklist(this));
  }

  handleHideSetup() {
    void import("./controllers/setup.js").then(({ hideSetup }) => hideSetup(this));
  }

  handleRunAssessment() {
    if (!this.client) return;
    void this.client.request("onboarding.assess", {}).then(() => {
      this.handleLoadSetupChecklist();
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
