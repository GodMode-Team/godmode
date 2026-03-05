import type { EventLogEntry } from "./app-events";
import type { FailedMessage } from "./controllers/chat";
import type { DevicePairingList } from "./controllers/devices";
import type { ExecApprovalRequest } from "./controllers/exec-approval";
import type { ExecApprovalsFile, ExecApprovalsSnapshot } from "./controllers/exec-approvals";
import type { ClawHubMessage } from "./controllers/clawhub";
import type { SkillMessage } from "./controllers/skills";
import type { GatewayBrowserClient, GatewayHelloOk } from "./gateway";
import type { Tab } from "./navigation";
import type { UiSettings } from "./storage";
import type { ThemeMode } from "./theme";
import type { ThemeTransitionContext } from "./theme-transition";
import type { Toast } from "./toast";
import type {
  AgentsListResult,
  ArchivedSessionEntry,
  ChannelsStatusSnapshot,
  ClawHubSearchResult,
  ClawHubSkillDetail,
  ClawHubSkillItem,
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
import type { LightboxImage, LightboxState } from "./chat/lightbox";
import type { ToolExecutionInfo } from "./types/chat-types";
import type { ChatAttachment, ChatQueueItem, CronFormState, FileTreeNode } from "./ui-types";
import type { NostrProfileFormState } from "./views/channels.nostr-profile-form";
import type { DataSource } from "./views/data";
import type { AllyChatMessage } from "./views/ally-chat";
import type { AgentLogData, DailyBriefData, DecisionCardItem } from "./views/my-day";
import type { Project } from "./views/work";
import type { TaskFilter, TaskSort, WorkspaceDetail, WorkspaceSummary, WorkspaceTask } from "./views/workspaces";

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
  lightbox: LightboxState;
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
  archivedSessions: ArchivedSessionEntry[];
  archivedSessionsLoading: boolean;
  archivedSessionsExpanded: boolean;
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
  skillsSubTab: "my-skills" | "clawhub";
  clawhubQuery: string;
  clawhubResults: ClawHubSearchResult[] | null;
  clawhubExploreItems: ClawHubSkillItem[] | null;
  clawhubExploreSort: string;
  clawhubLoading: boolean;
  clawhubError: string | null;
  clawhubDetailSlug: string | null;
  clawhubDetail: ClawHubSkillDetail | null;
  clawhubImporting: string | null;
  clawhubMessage: ClawHubMessage | null;
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
  // Workspaces state
  workspaces?: WorkspaceSummary[];
  selectedWorkspace?: WorkspaceDetail | null;
  workspacesSearchQuery?: string;
  workspaceItemSearchQuery?: string;
  workspaceExpandedFolders?: Set<string>;
  workspaceBrowsePath?: string | null;
  workspaceBrowseEntries?: import("./controllers/workspaces").BrowseEntry[] | null;
  workspaceBreadcrumbs?: Array<{ name: string; path: string }> | null;
  workspaceBrowseSearchQuery?: string;
  workspaceBrowseSearchResults?: Array<{ path: string; name: string; type: string; excerpt?: string }> | null;
  workspacesLoading?: boolean;
  workspacesCreateLoading?: boolean;
  workspacesError?: string | null;
  allTasks?: WorkspaceTask[];
  taskFilter?: TaskFilter;
  taskSort?: TaskSort;
  showCompletedTasks?: boolean;
  editingTaskId?: string | null;
  // My Day state
  myDayLoading?: boolean;
  myDayError?: string | null;
  todaySelectedDate?: string;
  todayViewMode?: "brief" | "command-center" | "agent-log";
  // Today tasks
  todayTasks?: WorkspaceTask[];
  todayTasksLoading?: boolean;
  todayEditingTaskId?: string | null;
  todayShowCompleted?: boolean;
  // Ally side-chat state
  allyPanelOpen?: boolean;
  allyMessages?: AllyChatMessage[];
  allyStream?: string | null;
  allyDraft?: string;
  allyUnread?: number;
  allySending?: boolean;
  allyWorking?: boolean;
  allyAttachments?: import("./ui-types").ChatAttachment[];
  todayQueueResults?: DecisionCardItem[];
  // Daily Brief state
  dailyBrief?: DailyBriefData | null;
  dailyBriefLoading?: boolean;
  dailyBriefError?: string | null;
  // Agent Log state
  agentLog?: AgentLogData | null;
  agentLogLoading?: boolean;
  agentLogError?: string | null;
  // Mission Control state
  missionControlData?: import("./controllers/mission-control").MissionControlData | null;
  missionControlLoading?: boolean;
  missionControlError?: string | null;
  // Private mode (no memory/learning from this chat)
  chatPrivateMode?: boolean;
  /** Maps private session keys → expiry timestamp (ms). */
  privateSessions?: Map<string, number>;
  // Work tab state
  workProjects?: Project[];
  workLoading?: boolean;
  workError?: string | null;
  workExpandedProjects?: Set<string>;
  workProjectFiles?: Record<string, unknown[]>;
  workDetailLoading?: Set<string>;
  // Data tab state
  dataSources?: DataSource[];
  dataLoading?: boolean;
  dataError?: string | null;
  dataSubtab?: "dashboard" | "sources";
  // Onboarding experience state (6-phase flow)
  onboardingActive?: boolean;
  onboardingPhase?: import("./views/onboarding").OnboardingPhase;
  onboardingData?: import("./views/onboarding").OnboardingData | null;
  // Memory onboarding wizard state
  wizardActive?: boolean;
  wizardState?: import("./views/onboarding-wizard").WizardState | null;
  // Setup tab state (80/20 fast onboarding)
  showSetupTab?: boolean;
  setupCapabilities?: { capabilities: Array<{ id: string; title: string; description: string; icon: string; status: "active" | "available" | "coming-soon"; detail?: string; action?: string }>; percentComplete: number } | null;
  setupCapabilitiesLoading?: boolean;
  setupQuickDone?: boolean;
  // Focus Pulse state
  focusPulseData?: import("./controllers/focus-pulse").FocusPulseData | null;
  // Trust Tracker state
  trustTrackerData: import("./controllers/trust-tracker").TrustTrackerData | null;
  trustTrackerLoading: boolean;
  handleTrustLoad: () => Promise<void>;
  handleTrustAddWorkflow: (workflow: string) => Promise<void>;
  handleTrustRemoveWorkflow: (workflow: string) => Promise<void>;
  handleDailyRate: (rating: number, note?: string) => Promise<void>;
  // Guardrails state
  guardrailsData: import("./controllers/guardrails").GuardrailsViewData | null;
  guardrailsLoading: boolean;
  handleGuardrailsLoad: () => Promise<void>;
  handleGuardrailToggle: (gateId: string, enabled: boolean) => Promise<void>;
  handleGuardrailThresholdChange: (gateId: string, key: string, value: number) => Promise<void>;
  // Mission Control handlers
  handleMissionControlRefresh: () => Promise<void>;
  handleMissionControlCancelTask: (taskId: string) => Promise<void>;
  handleMissionControlApproveItem: (id: string) => Promise<void>;
  handleMissionControlRetryItem: (id: string) => Promise<void>;
  handleMissionControlViewDetail: (agent: import("./controllers/mission-control").AgentRunView) => Promise<void>;
  handleMissionControlAddToQueue: (type: string, title: string) => Promise<void>;
  handleMissionControlOpenSession: (sessionKey: string) => Promise<void>;
  handleMissionControlOpenTaskSession: (sourceTaskId: string) => Promise<void>;
  handleMissionControlStartQueueItem: (itemId: string) => Promise<void>;
  handleOpenSupportChat: () => void;
  seedSessionWithAgentOutput: (taskTitle: string, output: string, agentPrompt?: string) => Promise<void>;
  // GodMode Options state
  godmodeOptions: Record<string, unknown> | null;
  godmodeOptionsLoading: boolean;
  // Dynamic HTML slot state (AI-generated tab content)
  dynamicSlots: Record<string, string>;
  // Update check state
  updateStatus: {
    openclawVersion: string;
    openclawLatest: string | null;
    openclawUpdateAvailable: boolean;
    openclawInstallKind: string;
    openclawChannel: string | null;
    pluginVersion: string;
    pluginLatest: string | null;
    pluginUpdateAvailable: boolean;
    fetchOk: boolean | null;
  } | null;
  updateLoading: boolean;
  updateError: string | null;
  updateLastChecked: number | null;
  // Dashboards state
  dashboardsList?: import("./controllers/dashboards").DashboardManifest[];
  dashboardsLoading?: boolean;
  dashboardsError?: string | null;
  activeDashboardId?: string | null;
  activeDashboardHtml?: string | null;
  activeDashboardManifest?: import("./controllers/dashboards").DashboardManifest | null;
  dashboardCategoryFilter?: string | null;
  // SecondBrain state
  secondBrainSubtab?: import("./views/second-brain").SecondBrainSubtab;
  secondBrainLoading?: boolean;
  secondBrainError?: string | null;
  secondBrainIdentity?: import("./views/second-brain").SecondBrainIdentityData | null;
  secondBrainMemoryBank?: import("./views/second-brain").SecondBrainMemoryBankData | null;
  secondBrainAiPacket?: import("./views/second-brain").SecondBrainAiPacketData | null;
  secondBrainSourcesData?: import("./views/second-brain").SecondBrainSourcesData | null;
  secondBrainResearchData?: import("./views/second-brain").SecondBrainResearchData | null;
  secondBrainResearchAddFormOpen?: boolean;
  secondBrainResearchAddForm?: import("./views/second-brain").ResearchAddForm;
  secondBrainResearchCategories?: string[];
  secondBrainSelectedEntry?: import("./views/second-brain").SecondBrainEntryDetail | null;
  secondBrainSearchQuery?: string;
  secondBrainSyncing?: boolean;
  secondBrainBrowsingFolder?: string | null;
  secondBrainFolderEntries?: import("./views/second-brain").SecondBrainMemoryEntry[] | null;
  secondBrainFolderName?: string | null;
  secondBrainCommunityResources?: import("./views/second-brain").CommunityResourcesData | null;
  secondBrainCommunityResourceAddFormOpen?: boolean;
  secondBrainCommunityResourceAddForm?: import("./views/second-brain").CommunityResourceAddForm;
  secondBrainVaultHealth?: import("./views/second-brain").VaultHealthData | null;
  // Second Brain Files tab state
  secondBrainFileTree?: import("./views/second-brain").BrainTreeNode[] | null;
  secondBrainFileTreeLoading?: boolean;
  secondBrainFileSearchQuery?: string;
  secondBrainFileSearchResults?: import("./views/second-brain").BrainSearchResult[] | null;
  // Onboarding integrations state
  onboardingIntegrations: unknown[] | null;
  onboardingCoreProgress: { connected: number; total: number } | null;
  onboardingExpandedCard: string | null;
  onboardingLoadingGuide: string | null;
  onboardingActiveGuide: { integrationId: string; name: string; steps: string; envVars: Array<{ key: string; label: string; description: string; secret: boolean }>; cliDeps: string[] } | null;
  onboardingTestingId: string | null;
  onboardingTestResult: { id: string; result: { success: boolean; message: string } } | null;
  onboardingConfigValues: Record<string, string>;
  onboardingProgress: number | null;
  handleLoadIntegrations: () => void;
  handleExpandCard: (id: string | null) => void;
  handleLoadGuide: (id: string) => void;
  handleTestIntegration: (id: string) => void;
  handleConfigureIntegration: (id: string, values: Record<string, string>) => void;
  handleUpdateConfigValue: (key: string, value: string) => void;
  handleSkipIntegration: (id: string) => void;
  handleMarkOnboardingComplete?: () => void;
  handleOpenSupportChat: () => void;
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
  handleImageClick: (url: string, allImages: LightboxImage[], index: number) => void;
  handleLightboxClose: () => void;
  handleLightboxNav: (delta: number) => void;
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
  // My Day handlers
  handleMyDayRefresh: () => Promise<void>;
  handleMyDayTaskStatusChange: (taskId: string, newStatus: "pending" | "complete") => Promise<void>;
  handleTodayStartTask: (taskId: string) => Promise<void>;
  handleTodayCreateTask: (title: string) => Promise<void>;
  handleTodayEditTask: (taskId: string | null) => void;
  handleTodayUpdateTask: (taskId: string, updates: { title?: string; dueDate?: string | null }) => Promise<void>;
  handleTodayToggleCompleted: () => void;
  // Date navigation handlers
  handleDatePrev: () => void;
  handleDateNext: () => void;
  handleDateToday: () => void;
  // Daily Brief handlers
  handleDailyBriefRefresh: () => Promise<void>;
  handleDailyBriefGenerate: () => Promise<void>;
  handleDailyBriefOpenInObsidian: () => void;
  handleBriefSave: (content: string) => Promise<void>;
  handleBriefToggleCheckbox: (index: number, checked: boolean) => Promise<void>;
  // Today view mode handler
  handleTodayViewModeChange: (mode: "brief" | "command-center" | "agent-log") => void;
  handlePrivateModeToggle: () => void;
  // Ally side-chat handlers
  handleAllyToggle: () => void;
  handleAllyDraftChange: (text: string) => void;
  handleAllySend: () => Promise<void>;
  handleAllyOpenFull: () => void;
  handleAllyAttachmentsChange: (attachments: import("./ui-types").ChatAttachment[]) => void;
  handleAllyAction: (action: string, target?: string, method?: string, params?: Record<string, unknown>) => Promise<void>;
  // Decision card handlers
  handleDecisionApprove: (id: string) => Promise<void>;
  handleDecisionReject: (id: string) => Promise<void>;
  handleDecisionDismiss: (id: string) => Promise<void>;
  handleDecisionViewOutput: (id: string, outputPath: string) => Promise<void>;
  handleDecisionOpenChat: (id: string) => void;
  // File open handler
  handleOpenFile: (filePath: string) => Promise<void>;
  // Inner Work handlers
  handleSendToSage: (message: string) => Promise<void>;
  handleBackToSessions: () => void;
  // Work tab handlers
  handleWorkRefresh: () => Promise<void>;
  handleWorkToggleProject: (projectId: string) => void;
  handleWorkFileClick: (path: string) => void;
  handleWorkSkillClick: (skill: string, projectName: string) => void;
  // People tab handlers
  // Workspaces handlers
  handleWorkspacesRefresh: () => Promise<void>;
  handleWorkspaceBrowse: (folderPath: string) => Promise<void>;
  handleWorkspaceBrowseSearch: (query: string) => Promise<void>;
  handleWorkspaceBrowseBack: () => void;
  handleWorkspaceCreateFolder: (folderPath: string) => Promise<void>;
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
  // Setup tab handlers
  handleQuickSetup?: (name: string) => void;
  handleLoadCapabilities?: () => void;
  handleCapabilityAction?: (id: string) => void;
  handleHideSetup?: () => void;
  handleRunAssessment?: () => void;
  // Memory wizard handlers
  handleWizardOpen?: () => void;
  handleWizardClose?: () => void;
  handleWizardStepChange?: (step: import("./views/onboarding-wizard").WizardStep) => void;
  handleWizardAnswerChange?: (key: string, value: unknown) => void;
  handleWizardPreview?: () => Promise<void>;
  handleWizardGenerate?: () => Promise<void>;
  handleWizardFileToggle?: (path: string, checked: boolean) => void;
  handleWizardConfigToggle?: (path: string, checked: boolean) => void;
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
  // SecondBrain handlers
  handleSecondBrainRefresh: () => Promise<void>;
  handleSecondBrainSubtabChange: (subtab: import("./views/second-brain").SecondBrainSubtab) => void;
  handleSecondBrainSelectEntry: (path: string) => Promise<void>;
  handleSecondBrainOpenInBrowser: (path: string) => Promise<void>;
  handleSecondBrainBrowseFolder: (path: string) => Promise<void>;
  handleSecondBrainBack: () => void;
  handleSecondBrainSearch: (query: string) => void;
  handleSecondBrainSync: () => Promise<void>;
  handleResearchAddFormToggle: () => void;
  handleResearchAddFormChange: (field: string, value: string) => void;
  handleResearchAddSubmit: () => Promise<void>;
  handleResearchSaveViaChat: () => Promise<void>;
  handleCommunityResourceAdd: () => Promise<void>;
  handleCommunityResourceRemove: (id: string) => Promise<void>;
  handleCommunityResourceAddFormToggle: () => void;
  handleCommunityResourceAddFormChange: (field: string, value: string) => void;
  // Second Brain Files tab handlers
  handleSecondBrainFileTreeRefresh: () => Promise<void>;
  handleSecondBrainFileSearch: (query: string) => void;
  handleSecondBrainFileSelect: (path: string) => Promise<void>;
  // Dashboards state + handlers
  dashboardChatOpen?: boolean;
  dashboardPreviousSessionKey?: string | null;
  handleDashboardsRefresh: () => Promise<void>;
  handleDashboardSelect: (id: string) => Promise<void>;
  handleDashboardDelete: (id: string) => Promise<void>;
  handleDashboardCreateViaChat: (prompt?: string) => void;
  handleDashboardTogglePin: (id: string) => Promise<void>;
  handleDashboardCategoryFilter: (category: string | null) => void;
  handleDashboardBack: () => void;
  handleDashboardOpenSession: (dashboardId: string) => Promise<void>;
  // Proactive Intel handlers
  handleIntelLoad: () => Promise<void>;
  handleIntelDismiss: (id: string) => Promise<void>;
  handleIntelAct: (id: string) => Promise<void>;
  handleIntelRefresh: () => Promise<void>;
};
