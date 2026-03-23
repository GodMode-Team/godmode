import type { EventLogEntry } from "./app-events";
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
  ArchivedSessionEntry,
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
import type { LightboxImage, LightboxState } from "./chat/lightbox";
import type { ToolExecutionInfo } from "./types/chat-types";
import type { ChatAttachment, ChatQueueItem, CronFormState, FileTreeNode } from "./ui-types";
import type { NostrProfileFormState } from "./views/channels.nostr-profile-form";
import type { AllyChatMessage } from "./views/ally-chat";

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
  currentModel: string | null;
  availableModels: { id: string; name: string; provider: string }[];
  modelPickerOpen: boolean;
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
  compactionStatus: import("./app-tool-stream").CompactionStatus | null;
  sidebarOpen: boolean;
  sidebarContent: string | null;
  sidebarError: string | null;
  sidebarMimeType: string | null;
  sidebarFilePath: string | null;
  sidebarTitle: string | null;
  /** Sidebar mode: "resource" for files/markdown, "proof" for Proof doc iframe */
  sidebarMode?: "resource" | "proof";
  /** Proof document slug when sidebarMode === "proof" */
  sidebarProofSlug?: string | null;
  /** Fully resolved Proof iframe URL for the current doc */
  sidebarProofUrl?: string | null;
  /** Pre-rendered HTML from proof.get RPC for srcdoc embedding */
  sidebarProofHtml?: string | null;
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
  gatewayRestartPending: boolean;
  gatewayRestartBusy: boolean;
  deployPanelOpen: boolean;
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
  skillsSubTab: "godmode" | "my-skills";
  godmodeSkills: import("./views/skills").GodModeSkillsData | null;
  godmodeSkillsLoading: boolean;
  expandedSkills: Set<string>;
  rosterData: import("./views/agents").RosterAgent[];
  rosterLoading: boolean;
  rosterError: string | null;
  rosterFilter: string;
  expandedAgents: Set<string>;
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
  // Mobile nav drawer
  navDrawerOpen: boolean;
  closeNavDrawer: () => void;
  // Ally side-chat state
  allyPanelOpen?: boolean;
  allyMessages?: AllyChatMessage[];
  allyStream?: string | null;
  allyDraft?: string;
  allyUnread?: number;
  allySending?: boolean;
  allyWorking?: boolean;
  allyAttachments?: import("./ui-types").ChatAttachment[];
  // Private mode (no memory/learning from this chat)
  chatPrivateMode?: boolean;
  /** Maps private session keys → expiry timestamp (ms). */
  privateSessions?: Map<string, number>;
  // Onboarding experience state (6-phase flow)
  onboardingActive?: boolean;
  onboardingPhase?: number;
  onboardingData?: Record<string, unknown> | null;
  // Memory onboarding wizard state
  wizardActive?: boolean;
  wizardState?: import("./views/onboarding-wizard").WizardState | null;
  // Setup tab state (80/20 fast onboarding)
  showSetupTab?: boolean;
  setupCapabilities?: { capabilities: Array<{ id: string; title: string; description: string; icon: string; status: "active" | "available" | "coming-soon"; detail?: string; action?: string }>; percentComplete: number } | null;
  setupCapabilitiesLoading?: boolean;
  setupQuickDone?: boolean;
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
  // Task session + queue handlers (kept from Mission Control for queue/today tab use)
  handleMissionControlAddToQueue: (type: string, title: string) => Promise<void>;
  handleMissionControlOpenSession: (sessionKey: string) => Promise<void>;
  handleMissionControlOpenTaskSession: (sourceTaskId: string) => Promise<void>;
  handleMissionControlStartQueueItem: (itemId: string) => Promise<void>;
  handleSwarmViewProofDoc: (docSlug: string) => Promise<void>;
  handleSwarmViewRunLog: (queueItemId: string) => Promise<void>;
  handleOpenSupportChat: () => void;
  seedSessionWithAgentOutput: (taskTitle: string, output: string, agentPrompt?: string) => Promise<void>;
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
    pendingDeploy: { summary: string; ts: number; files?: string[] } | null;
    fetchOk: boolean | null;
  } | null;
  updateLoading: boolean;
  updateError: string | null;
  updateLastChecked: number | null;
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
  handleGatewayRestartClick: () => void;
  handleGatewayRestartConfirm: () => Promise<void>;
  handleGatewayRestartCancel: () => void;
  handleDeployPanelToggle: () => void;
  handleDeployDismiss: () => Promise<void>;
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
  handlePrivateModeToggle: () => void;
  // Ally side-chat handlers
  handleAllyToggle: () => void;
  handleAllyDraftChange: (text: string) => void;
  handleAllySend: () => Promise<void>;
  handleAllyOpenFull: () => void;
  handleAllyAttachmentsChange: (attachments: import("./ui-types").ChatAttachment[]) => void;
  handleAllyAction: (action: string, target?: string, method?: string, params?: Record<string, unknown>) => Promise<void>;
  // File open handler
  handleOpenFile: (filePath: string) => Promise<void>;
  // Inner Work handlers
  handleSendToSage: (message: string) => Promise<void>;
  handleBackToSessions: () => void;
  // Work tab handlers
  handleWorkFileClick: (path: string) => void;
  handleWorkSkillClick: (skill: string, projectName: string) => void;
  handleResourceClick: (resource: import("./views/work").Resource) => void;
  // Session resources (Manus-style chat strip)
  sessionResources: Array<{ id: string; title: string; type: string; path?: string; url?: string }>;
  sessionResourcesCollapsed: boolean;
  loadSessionResources: () => Promise<void>;
  handleSessionResourceClick: (resource: { path?: string; url?: string }) => void;
  handleToggleSessionResources: () => void;
  handleViewAllResources: () => void;
  handleStartChatWithPrompt: (prompt: string) => void;
  // User profile handlers
  handleUpdateUserProfile: (name: string, avatar: string) => void;
  // Onboarding handlers
  handleOnboardingStart?: () => void;
  handleOnboardingIdentitySubmit?: (identity: { name: string; mission: string; emoji: string }) => Promise<void>;
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
  // Proof sidebar handlers
  handleOpenProofDoc: (slug: string) => Promise<void>;
  handleCloseProofDoc: () => void;
  // Proactive Intel handlers
  handleIntelLoad: () => Promise<void>;
  handleIntelDismiss: (id: string) => Promise<void>;
  handleIntelAct: (id: string) => Promise<void>;
  handleIntelRefresh: () => Promise<void>;
};
