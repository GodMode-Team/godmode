import type { EventLogEntry } from "./app-events";
import type { FailedMessage } from "./controllers/chat";
import type { DevicePairingList } from "./controllers/devices";
import type { ExecApprovalRequest } from "./controllers/exec-approval";
import type { ExecApprovalsFile, ExecApprovalsSnapshot } from "./controllers/exec-approvals";
import type { SkillMessage } from "./controllers/skills";
import type { GatewayBrowserClient, GatewayHelloOk } from "./gateway";
import type { Tab } from "./navigation";
import type { UiSettings } from "./storage";
import type { ThemeMode } from "./theme";
import type { ThemeTransitionContext } from "./theme-transition";
import type { Toast } from "./toast";
import type {
  AgentsListResult,
  ChannelsStatusSnapshot,
  ConfigSnapshot,
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
import type { ToolExecutionInfo } from "./types/chat-types";
import type { ChatAttachment, ChatQueueItem, CronFormState, FileTreeNode } from "./ui-types";
import type { NostrProfileFormState } from "./views/channels.nostr-profile-form";
import type { DataSource } from "./views/data";
import type { Goal } from "./views/goals";
import type { Agent, FeedItem, NativeTask } from "./views/mission-types";
import type { AgentLogData, DailyBriefData } from "./views/my-day";
import type { Person } from "./views/people";
import type { Project } from "./views/work";
import type { TaskFilter, WorkspaceDetail, WorkspaceSummary, WorkspaceTask } from "./views/workspaces";

export type AppViewState = {
  settings: UiSettings;
  password: string;
  tab: Tab;
  toasts: Toast[];
  onboarding: boolean;
  basePath: string;
  connected: boolean;
  reconnecting: boolean;
  reconnectAttempt: number;
  theme: ThemeMode;
  themeResolved: "light" | "dark";
  hello: GatewayHelloOk | null;
  lastError: string | null;
  eventLog: EventLogEntry[];
  assistantName: string;
  assistantAvatar: string | null;
  userName: string;
  userAvatar: string | null;
  assistantAgentId: string | null;
  sessionKey: string;
  sessionPickerOpen: boolean;
  sessionPickerPosition: { top: number; right: number } | null;
  sessionPickerSearch: string;
  sessionSearchOpen: boolean;
  sessionSearchPosition: { top: number; right: number } | null;
  sessionSearchQuery: string;
  sessionSearchResults: Array<{
    key: string;
    label?: string;
    displayName?: string;
    matches: Array<{ role: string; text: string; timestamp?: number }>;
  }>;
  sessionSearchLoading: boolean;
  profilePopoverOpen: boolean;
  profileEditName: string;
  profileEditAvatar: string;
  editingTabKey: string | null;
  currentToolName: string | null;
  currentToolInfo: ToolExecutionInfo | null;
  workingSessions: Set<string>;
  chatUserNearBottom: boolean;
  chatNewMessagesBelow: boolean;
  consciousnessStatus: "idle" | "loading" | "ok" | "error";
  chatLoading: boolean;
  chatSending: boolean;
  chatSendingSessionKey: string | null;
  chatQueueMode: boolean;
  chatMessage: string;
  chatDrafts: Record<string, string>;
  chatAttachments: ChatAttachment[];
  chatMessages: unknown[];
  chatToolMessages: unknown[];
  chatStream: string | null;
  chatStreamStartedAt: number | null;
  chatRunId: string | null;
  chatAvatarUrl: string | null;
  chatThinkingLevel: string | null;
  chatQueue: ChatQueueItem[];
  pendingRetry: FailedMessage | null;
  compactionStatus: import("./app-tool-stream").CompactionStatus | null;
  sidebarOpen: boolean;
  sidebarContent: string | null;
  sidebarError: string | null;
  sidebarMimeType: string | null;
  sidebarFilePath: string | null;
  sidebarTitle: string | null;
  splitRatio: number;
  nodesLoading: boolean;
  nodes: Array<Record<string, unknown>>;
  devicesLoading: boolean;
  devicesError: string | null;
  devicesList: DevicePairingList | null;
  execApprovalsLoading: boolean;
  execApprovalsSaving: boolean;
  execApprovalsDirty: boolean;
  execApprovalsSnapshot: ExecApprovalsSnapshot | null;
  execApprovalsForm: ExecApprovalsFile | null;
  execApprovalsSelectedAgent: string | null;
  execApprovalsTarget: "gateway" | "node";
  execApprovalsTargetNodeId: string | null;
  execApprovalQueue: ExecApprovalRequest[];
  execApprovalBusy: boolean;
  execApprovalError: string | null;
  pendingGatewayUrl: string | null;
  configLoading: boolean;
  configRaw: string;
  configRawOriginal: string;
  configValid: boolean | null;
  configIssues: unknown[];
  configSaving: boolean;
  configApplying: boolean;
  updateRunning: boolean;
  configSnapshot: ConfigSnapshot | null;
  configSchema: unknown | null;
  configSchemaLoading: boolean;
  configUiHints: Record<string, unknown>;
  configForm: Record<string, unknown> | null;
  configFormOriginal: Record<string, unknown> | null;
  configFormMode: "form" | "raw";
  channelsLoading: boolean;
  channelsSnapshot: ChannelsStatusSnapshot | null;
  channelsError: string | null;
  channelsLastSuccess: number | null;
  whatsappLoginMessage: string | null;
  whatsappLoginQrDataUrl: string | null;
  whatsappLoginConnected: boolean | null;
  whatsappBusy: boolean;
  nostrProfileFormState: NostrProfileFormState | null;
  nostrProfileAccountId: string | null;
  configFormDirty: boolean;
  presenceLoading: boolean;
  presenceEntries: PresenceEntry[];
  presenceError: string | null;
  presenceStatus: string | null;
  agentsLoading: boolean;
  agentsList: AgentsListResult | null;
  agentsError: string | null;
  sessionsLoading: boolean;
  sessionsResult: SessionsListResult | null;
  sessionsError: string | null;
  sessionsFilterActive: string;
  sessionsFilterLimit: string;
  sessionsIncludeGlobal: boolean;
  sessionsIncludeUnknown: boolean;
  cronLoading: boolean;
  cronJobs: CronJob[];
  cronStatus: CronStatus | null;
  cronError: string | null;
  cronForm: CronFormState;
  cronRunsJobId: string | null;
  cronRuns: CronRunLogEntry[];
  cronBusy: boolean;
  skillsLoading: boolean;
  skillsReport: SkillStatusReport | null;
  skillsError: string | null;
  skillsFilter: string;
  skillEdits: Record<string, string>;
  skillMessages: Record<string, SkillMessage>;
  skillsBusyKey: string | null;
  debugLoading: boolean;
  debugStatus: StatusSummary | null;
  debugHealth: HealthSnapshot | null;
  debugModels: unknown[];
  debugHeartbeat: unknown | null;
  debugCallMethod: string;
  debugCallParams: string;
  debugCallResult: string | null;
  debugCallError: string | null;
  logsLoading: boolean;
  logsError: string | null;
  logsFile: string | null;
  logsEntries: LogEntry[];
  logsFilterText: string;
  logsLevelFilters: Record<LogLevel, boolean>;
  logsAutoFollow: boolean;
  logsTruncated: boolean;
  // Mission Control state
  missionLoading: boolean;
  missionTasks: NativeTask[];
  missionError: string | null;
  missionAgents: Agent[];
  missionFeedItems: FeedItem[];
  missionSelectedTask: NativeTask | null;
  // Workspaces state
  workspaces?: WorkspaceSummary[];
  selectedWorkspace?: WorkspaceDetail | null;
  workspacesSearchQuery?: string;
  workspaceItemSearchQuery?: string;
  workspaceExpandedFolders?: Set<string>;
  workspacesLoading?: boolean;
  workspacesCreateLoading?: boolean;
  workspacesError?: string | null;
  allTasks?: WorkspaceTask[];
  taskFilter?: TaskFilter;
  showCompletedTasks?: boolean;
  // My Day state
  myDayLoading?: boolean;
  myDayError?: string | null;
  todaySelectedDate?: string;
  todayViewMode?: "my-day" | "agent-log";
  // Daily Brief state
  dailyBrief?: DailyBriefData | null;
  dailyBriefLoading?: boolean;
  dailyBriefError?: string | null;
  briefEditing?: boolean;
  // Agent Log state
  agentLog?: AgentLogData | null;
  agentLogLoading?: boolean;
  agentLogError?: string | null;
  // Private mode (no memory/learning from this chat)
  chatPrivateMode?: boolean;
  // Work tab state
  workProjects?: Project[];
  workLoading?: boolean;
  workError?: string | null;
  workExpandedProjects?: Set<string>;
  workProjectFiles?: Record<string, unknown[]>;
  workDetailLoading?: Set<string>;
  // People tab state
  peopleList?: Person[];
  peopleLoading?: boolean;
  peopleError?: string | null;
  peopleSelected?: string | null;
  peopleSearchQuery?: string;
  // Lifetracks state
  lifetracksData?: import("./controllers/lifetracks").LifetrackEntry[] | null;
  lifetracksLoading?: boolean;
  lifetracksError?: string | null;
  lifetracksCurrentTrack?: import("./controllers/lifetracks").LifetrackEntry | null;
  // Life tab subtab state
  lifeSubtab?: "vision-board" | "lifetracks" | "goals" | "wheel-of-life";
  // Goals state
  goals?: Goal[];
  goalsLoading?: boolean;
  goalsError?: string | null;
  // Data tab state
  dataSources?: DataSource[];
  dataLoading?: boolean;
  dataError?: string | null;
  dataSubtab?: "dashboard" | "sources";
  // Onboarding experience state (6-phase flow)
  onboardingActive?: boolean;
  onboardingPhase?: import("./views/onboarding").OnboardingPhase;
  onboardingData?: import("./views/onboarding").OnboardingData | null;
  // Focus Pulse state
  focusPulseData?: import("./controllers/focus-pulse").FocusPulseData | null;
  // Trust Tracker state
  trustTrackerData: import("./controllers/trust-tracker").TrustTrackerData | null;
  trustTrackerLoading: boolean;
  handleTrustLoad: () => Promise<void>;
  handleTrustAddWorkflow: (workflow: string) => Promise<void>;
  handleTrustRemoveWorkflow: (workflow: string) => Promise<void>;
  // GodMode Options state
  godmodeOptions: Record<string, unknown> | null;
  godmodeOptionsLoading: boolean;
  // Dynamic HTML slot state (AI-generated tab content)
  dynamicSlots: Record<string, string>;
  // Update check state
  updateStatus: {
    version: string;
    branch: string | null;
    sha: string | null;
    upstream: string | null;
    ahead: number | null;
    behind: number | null;
    dirty: boolean | null;
    fetchOk: boolean | null;
  } | null;
  updateLoading: boolean;
  updateError: string | null;
  updateLastChecked: number | null;
  // File explorer state
  explorerOpen: boolean;
  explorerPath: string;
  explorerTree: FileTreeNode[];
  explorerLoading: boolean;
  explorerError: string | null;
  explorerSelectedFile: string | null;
  explorerExpandedPaths: Set<string>;
  client: GatewayBrowserClient | null;
  connect: () => void;
  setTab: (tab: Tab) => void;
  setTheme: (theme: ThemeMode, context?: ThemeTransitionContext) => void;
  applySettings: (next: UiSettings) => void;
  loadOverview: () => Promise<void>;
  loadAssistantIdentity: () => Promise<void>;
  loadCron: () => Promise<void>;
  handleWhatsAppStart: (force: boolean) => Promise<void>;
  handleWhatsAppWait: () => Promise<void>;
  handleWhatsAppLogout: () => Promise<void>;
  handleChannelConfigSave: () => Promise<void>;
  handleChannelConfigReload: () => Promise<void>;
  handleNostrProfileEdit: (accountId: string, profile: NostrProfile | null) => void;
  handleNostrProfileCancel: () => void;
  handleNostrProfileFieldChange: (field: keyof NostrProfile, value: string) => void;
  handleNostrProfileSave: () => Promise<void>;
  handleNostrProfileImport: () => Promise<void>;
  handleNostrProfileToggleAdvanced: () => void;
  handleExecApprovalDecision: (decision: "allow-once" | "allow-always" | "deny") => Promise<void>;
  handleGatewayUrlConfirm: () => void;
  handleGatewayUrlCancel: () => void;
  handleConfigLoad: () => Promise<void>;
  handleConfigSave: () => Promise<void>;
  handleConfigApply: () => Promise<void>;
  handleConfigFormUpdate: (path: string, value: unknown) => void;
  handleConfigFormModeChange: (mode: "form" | "raw") => void;
  handleConfigRawChange: (raw: string) => void;
  handleInstallSkill: (key: string) => Promise<void>;
  handleUpdateSkill: (key: string) => Promise<void>;
  handleToggleSkillEnabled: (key: string, enabled: boolean) => Promise<void>;
  handleUpdateSkillEdit: (key: string, value: string) => void;
  handleSaveSkillApiKey: (key: string, apiKey: string) => Promise<void>;
  handleCronToggle: (jobId: string, enabled: boolean) => Promise<void>;
  handleCronRun: (jobId: string) => Promise<void>;
  handleCronRemove: (jobId: string) => Promise<void>;
  handleCronAdd: () => Promise<void>;
  handleCronRunsLoad: (jobId: string) => Promise<void>;
  handleCronFormUpdate: (path: string, value: unknown) => void;
  handleSessionsLoad: () => Promise<void>;
  handleSessionsPatch: (key: string, patch: unknown) => Promise<void>;
  handleLoadNodes: () => Promise<void>;
  handleLoadPresence: () => Promise<void>;
  handleLoadSkills: () => Promise<void>;
  handleLoadDebug: () => Promise<void>;
  handleLoadLogs: () => Promise<void>;
  handleDebugCall: () => Promise<void>;
  handleRunUpdate: () => Promise<void>;
  setPassword: (next: string) => void;
  setSessionKey: (next: string) => void;
  handleToggleSessionPicker: () => void;
  handleToggleSessionSearch: (event?: Event) => void;
  handleSessionSearchQuery: (query: string) => void;
  handleSelectSession: (sessionKey: string) => void;
  setChatMessage: (next: string) => void;
  handleChatSend: () => Promise<void>;
  handleChatAbort: () => Promise<void>;
  handleChatSelectQueueItem: (id: string) => void;
  handleChatDropQueueItem: (id: string) => void;
  handleChatClearQueue: () => void;
  handleLogsFilterChange: (next: string) => void;
  handleLogsLevelFilterToggle: (level: LogLevel) => void;
  handleLogsAutoFollowToggle: (next: boolean) => void;
  handleCallDebugMethod: (method: string, params: string) => Promise<void>;
  resetToolStream: () => void;
  resetChatScroll: () => void;
  scrollChatToBottom: () => void;
  handleChatScroll: (event: Event) => void;
  handleSendChat: (
    messageOverride?: string,
    opts?: { restoreDraft?: boolean; queue?: boolean },
  ) => Promise<void>;
  handleAbortChat: () => Promise<void>;
  handleConsciousnessFlush: () => Promise<void>;
  handleCompactChat: () => Promise<void>;
  handleRetryMessage: () => Promise<void>;
  handleClearRetry: () => void;
  removeQueuedMessage: (id: string) => void;
  handleOpenSidebar: (
    content: string,
    opts?: { mimeType?: string | null; filePath?: string | null; title?: string | null },
  ) => void;
  handleOpenMessageFileLink: (href: string) => Promise<boolean>;
  handleCloseSidebar: () => void;
  handleSplitRatioChange: (ratio: number) => void;
  // File explorer handlers
  handleToggleExplorer: () => void;
  handleExplorerPathChange: (path: string) => void;
  handleToggleFolder: (path: string) => void;
  handleSelectFile: (path: string) => void;
  loadExplorerTree: () => Promise<void>;
  // Toast handlers
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number,
  ) => void;
  dismissToast: (id: string) => void;
  // Mission Control handlers
  handleMissionRefresh: () => Promise<void>;
  handleMissionTaskClick: (task: NativeTask) => void;
  handleMissionTaskStatusChange: (taskId: string, newStatus: string) => Promise<void>;
  // My Day handlers
  handleMyDayRefresh: () => Promise<void>;
  handleMyDayTaskStatusChange: (taskId: string, newStatus: "pending" | "complete") => Promise<void>;
  // Date navigation handlers
  handleDatePrev: () => void;
  handleDateNext: () => void;
  handleDateToday: () => void;
  // Daily Brief handlers
  handleDailyBriefRefresh: () => Promise<void>;
  handleDailyBriefOpenInObsidian: () => void;
  handleBriefSave: (content: string) => Promise<void>;
  handleBriefEditStart: () => void;
  handleBriefEditEnd: () => void;
  // Today view mode handler
  handleTodayViewModeChange: (mode: "my-day" | "agent-log") => void;
  handlePrivateModeToggle: () => void;
  // Inner Work handlers
  handleSendToSage: (message: string) => Promise<void>;
  handleBackToSessions: () => void;
  // Work tab handlers
  handleWorkRefresh: () => Promise<void>;
  handleWorkToggleProject: (projectId: string) => void;
  handleWorkPersonClick: (personId: string) => void;
  handleWorkFileClick: (path: string) => void;
  handleWorkSkillClick: (skill: string, projectName: string) => void;
  // People tab handlers
  handlePeopleRefresh: () => Promise<void>;
  handlePeopleSelect: (personId: string) => void;
  handlePeopleBack: () => void;
  handlePeopleSearch: (query: string) => void;
  // Workspaces handlers
  handleWorkspacesRefresh: () => Promise<void>;
  // Lifetracks handlers
  handleLifetracksRefresh: () => Promise<void>;
  handleLifetracksSelectTrack: (track: import("./controllers/lifetracks").LifetrackEntry) => void;
  // Life tab handlers
  handleLifeSubtabChange: (
    subtab: "vision-board" | "lifetracks" | "goals" | "wheel-of-life",
  ) => void;
  handleGoalsRefresh: () => Promise<void>;
  handleStartChatWithPrompt: (prompt: string) => void;
  // Data tab handlers
  handleDataRefresh: () => Promise<void>;
  handleDataSubtabChange: (subtab: "dashboard" | "sources") => void;
  handleDataConnectSource: (sourceId: string) => void;
  handleDataQuerySubmit: (query: string) => void;
  // User profile handlers
  handleUpdateUserProfile: (name: string, avatar: string) => void;
  // Onboarding handlers
  handleOnboardingStart?: () => void;
  handleOnboardingIdentitySubmit?: (identity: import("./views/onboarding").OnboardingIdentity) => Promise<void>;
  handleOnboardingSkipPhase?: () => void;
  handleOnboardingComplete?: () => void;
  // Focus Pulse handlers
  loadFocusPulse: () => Promise<void>;
  handleFocusPulseStartMorning: () => Promise<void>;
  handleFocusPulseSetFocus: (index: number) => Promise<void>;
  handleFocusPulseComplete: () => Promise<void>;
  handleFocusPulsePulseCheck: () => Promise<void>;
  handleFocusPulseEndDay: () => Promise<void>;
  // Options handlers
  handleOptionsLoad: () => Promise<void>;
  handleOptionToggle: (key: string, value: unknown) => Promise<void>;
};
