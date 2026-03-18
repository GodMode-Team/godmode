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
import type { AllyChatMessage } from "./views/ally-chat.js";
import type { DecisionCardItem } from "./views/my-day.js";
import { ALLY_SESSION_KEY, buildAllyContext } from "./controllers/ally.js";
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
import { startMeetingNotifications, stopMeetingNotifications } from "./controllers/meeting-notify";
// GodMode view controllers
import {
  loadMyDay as loadMyDayInternal,
  loadBriefOnly as loadBriefOnlyInternal,
  openBriefInObsidian as openBriefInObsidianInternal,
} from "./controllers/my-day";
import {
  loadWork as loadWorkInternal,
  loadProjectDetails as loadProjectDetailsInternal,
  loadResources as loadResourcesInternal,
  pinResource as pinResourceInternal,
  deleteResource as deleteResourceInternal,
} from "./controllers/work";
import { loadWorkspaces as loadWorkspacesInternal } from "./controllers/workspaces";
import type { GatewayBrowserClient, GatewayHelloOk } from "./gateway";
import type { Tab } from "./navigation";
import { loadSettings, type UiSettings } from "./storage";
import type { ResolvedTheme, ThemeMode } from "./theme";
import type { Toast } from "./toast";
import { addToast, createToast, removeToast, type ToastAction } from "./toast";
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
import type { ToolExecutionInfo } from "./types/chat-types";
import { type ChatAttachment, type ChatQueueItem, type CronFormState } from "./ui-types";
import type { NostrProfileFormState } from "./views/channels.nostr-profile-form";
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

/**
 * Detect automated system messages that shouldn't show in the ally chat.
 * Heartbeat prompts, context-only messages, and NO_REPLY markers.
 */
/**
 * Clean a message for ally display: strip system plumbing, return the
 * human-meaningful content or null if there's nothing worth showing.
 *
 * The main session mixes real conversation with heartbeat prompts,
 * consciousness dumps, cron triggers, and tool output. This function
 * strips the plumbing and keeps the substance — including HEARTBEAT_OK
 * responses that contain real flags ("HEARTBEAT_OK  Two flags: ...").
 */
function cleanForAlly(text: string, role: string): string | null {
  let t = text.trim();
  if (!t) return null;

  // ── Always filter: pure system plumbing ──

  // Heartbeat prompts (user role, sent by cron)
  if (t.startsWith("Read HEARTBEAT.md") || t.startsWith("Read CONSCIOUSNESS.md")) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }

  // Cron triggers
  if (/^System:\s*\[\d{4}-\d{2}-\d{2}/.test(t)) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }

  // NO_REPLY tokens
  if (t === "NO_REPLY" || t.startsWith("NO_REPLY\n")) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }

  // Consciousness/system file dumps (toolResult content shown as message)
  if (/^#\s*(?:🧠|\w+ Consciousness)/i.test(t)) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }
  if (t.startsWith("# WORKING.md") || t.startsWith("# MISTAKES.md")) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }
  // Consciousness dump that starts mid-stream (verification checklists, onboarding philosophy, etc.)
  if (/(?:VERIFIED|FIXED|NEW):\s/.test(t) && /✅|🟡|☑/.test(t) && t.length > 300) {
    console.debug("[Ally] Filtered message (verification dump):", role, t.substring(0, 100));
    return null;
  }
  // Onboarding philosophy / system architecture blocks
  if (/^###\s*(?:Onboarding Philosophy|Self-Surgery Problem|Open Architecture)/i.test(t)) {
    console.debug("[Ally] Filtered message (system block):", role, t.substring(0, 100));
    return null;
  }

  // Pure GodMode Context prefix with no user text
  if (/^\[GodMode Context:[^\]]*\]\s*$/.test(t)) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }

  // ── Strip prefixes, keep substance ──

  // Strip HEARTBEAT_OK / CONSCIOUSNESS_OK prefix — keep the useful flags after it
  t = t.replace(/^(?:HEARTBEAT_OK|CONSCIOUSNESS_OK)\s*/i, "").trim();

  // Strip "Deep work window is yours." prefix
  t = t.replace(/^Deep work window is yours\.\s*/i, "").trim();

  // If nothing left after stripping, it was pure automation
  if (!t) return null;

  // ── Heuristic: skip raw structured data dumps ──

  // Raw calendar data (lines of IDs + ISO timestamps)
  if (/^\w+\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(t) && t.length > 200) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }

  // Agent roster dumps — only filter if the ENTIRE message is a roster dump
  // (starts with the header and has no substantial content before it)
  if (/^##\s*Your Team\s*\(Agent Roster\)/i.test(t) && t.indexOf("\n\n## ") === -1) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }

  // Persistence protocol / agent persona echoed back
  if (/^##?\s*Persistence Protocol/i.test(t) || /^You are resourceful and thorough\.\s*Your job is to GET THE JOB DONE/i.test(t)) {
    console.debug("[Ally] Filtered message (persona leak):", role, t.substring(0, 100));
    return null;
  }
  // Core Behaviors / Core Principles block (persona sections)
  if (/^##?\s*Core (?:Behaviors|Principles)/i.test(t)) {
    console.debug("[Ally] Filtered message (persona leak):", role, t.substring(0, 100));
    return null;
  }
  // Ally role description echoed (matches any ally name)
  if (/^##?\s*Your Role as \w+/i.test(t)) {
    console.debug("[Ally] Filtered message (persona leak):", role, t.substring(0, 100));
    return null;
  }

  // Multi-signal check: if message contains 2+ system context fingerprints, it's a dump
  const tLower = t.toLowerCase();
  const sysSignals = [
    "persistence protocol", "core principles:", "core behaviors",
    "your role as ", "be diligent first time", "exhaust reasonable options",
    "assume capability exists", "elite executive assistant",
    "consciousness context", "working context", "enforcement:",
    "internal system context injected by godmode",
  ];
  if (sysSignals.filter((s) => tLower.includes(s)).length >= 2) {
    console.debug("[Ally] Filtered message (multi-signal system leak):", role, t.substring(0, 100));
    return null;
  }

  // Schedule table headers
  if (/^(?:ID\s+START\s+END\s+SUMMARY)/i.test(t)) {
    console.debug("[Ally] Filtered message:", role, t.substring(0, 100));
    return null;
  }

  // Raw file/directory listing dumps (long runs of filenames with extensions)
  // Matches messages that are mostly .json/.db/.html/.log filenames
  const fileExtMatches = t.match(/\b[\w.-]+\.(?:json\b|db\b|html\b|log\b|flag\b|jsonl\b|bak\b|css\b|js\b|ts\b|md\b|txt\b)/gi);
  if (fileExtMatches && fileExtMatches.length >= 8 && fileExtMatches.join(" ").length > t.length * 0.4) {
    console.debug("[Ally] Filtered message (file listing dump):", role, t.substring(0, 100));
    return null;
  }

  return t;
}

const CHAT_FILE_LINK_TAB_PREFIXES = new Set([
  "chat",
  "today",
  "workspaces",
  "work",
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
  @state() sidebarMode: "resource" | "proof" = "resource";
  @state() sidebarProofSlug: string | null = null;
  @state() sidebarProofUrl: string | null = null;
  @state() sidebarProofHtml: string | null = null;
  @state() splitRatio = this.settings.splitRatio;
  @state() lightbox: LightboxState = createLightboxState();

  // Google Drive picker state
  @state() driveAccounts: Array<{ email: string; client: string; label: string }> = [];
  @state() showDrivePicker = false;
  @state() driveUploading = false;

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
  @state() gatewayRestartPending = false;
  @state() gatewayRestartBusy = false;

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
  @state() setupCapabilities: { capabilities: Array<{ id: string; title: string; description: string; icon: string; status: "active" | "available" | "coming-soon"; detail?: string; action?: string }>; percentComplete: number } | null = null;
  @state() setupCapabilitiesLoading = false;
  @state() setupQuickDone = false;

  // Onboarding integration setup state
  @state() onboardingIntegrations: unknown[] | null = null;
  @state() onboardingCoreProgress: { connected: number; total: number } | null = null;
  @state() onboardingExpandedCard: string | null = null;
  @state() onboardingLoadingGuide: string | null = null;
  @state() onboardingActiveGuide: any | null = null;
  @state() onboardingTestingId: string | null = null;
  @state() onboardingTestResult: { id: string; result: { success: boolean; message: string } } | null = null;
  @state() onboardingConfigValues: Record<string, string> = {};
  @state() onboardingProgress: number | null = null;

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
  @state() taskSearch?: string;
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
  @state() todayViewMode: "brief" | "tasks" | "inbox" = "brief";

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

  // Ally side-chat state
  @state() allyPanelOpen = false;
  @state() allyMessages: AllyChatMessage[] = [];
  @state() allyStream: string | null = null;
  @state() allyDraft = "";
  @state() allyUnread = 0;
  @state() allySending = false;
  @state() allyWorking = false;
  @state() allyAttachments: import("./ui-types").ChatAttachment[] = [];
  @state() todayQueueResults: DecisionCardItem[] = [];
  @state() inboxItems: NonNullable<import("./app-view-state").AppViewState["inboxItems"]> = [];
  @state() inboxLoading = false;
  @state() inboxCount = 0;
  @state() inboxScoringId: string | null = null;
  @state() inboxScoringValue: number | undefined = undefined;
  @state() inboxFeedbackText: string | undefined = undefined;

  @state() chatPrivateMode = false;
  /** Maps private session keys → expiry timestamp (ms). Ephemeral sessions auto-delete. */
  @state() privateSessions: Map<string, number> = new Map();
  private _privateSessionTimer: ReturnType<typeof setInterval> | null = null;

  // Dynamic HTML slots (AI-generated tab content)
  @state() dynamicSlots: Record<string, string> = {};

  // Work tab state
  @state() workProjects?: import("./views/work").Project[];
  @state() workLoading = false;
  @state() workError: string | null = null;
  @state() workExpandedProjects: Set<string> = new Set();
  @state() workProjectFiles: Record<string, unknown[]> = {};
  @state() workDetailLoading: Set<string> = new Set();
  @state() workResources?: import("./views/work").Resource[];
  @state() workResourcesLoading = false;
  @state() workResourceFilter: import("./views/work").ResourceFilter = "all";
  // Session-level resources (Manus-style strip in chat)
  @state() sessionResources: Array<{ id: string; title: string; type: string; path?: string; url?: string }> = [];
  @state() sessionResourcesCollapsed = false;

  @state() skillsLoading = false;
  @state() skillsReport: SkillStatusReport | null = null;
  @state() skillsError: string | null = null;
  @state() skillsFilter = "";
  @state() skillEdits: Record<string, string> = {};
  @state() skillsBusyKey: string | null = null;
  @state() skillMessages: Record<string, SkillMessage> = {};
  @state() skillsSubTab: "godmode" | "my-skills" | "clawhub" = "godmode";
  @state() godmodeSkills: import("./views/skills").GodModeSkillsData | null = null;
  @state() godmodeSkillsLoading = false;
  @state() expandedSkills: Set<string> = new Set();

  @state() rosterData: import("./views/agents").RosterAgent[] = [];
  @state() rosterLoading = false;
  @state() rosterError: string | null = null;
  @state() rosterFilter = "";
  @state() expandedAgents: Set<string> = new Set();

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
  @state() missionControlFullControl = (() => {
    try { return localStorage.getItem("godmode.mc.fullControl") === "1"; } catch { return true; }
  })();
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
  /** Active category filter for dashboards gallery */
  @state() dashboardCategoryFilter: string | null = null;

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

  private nodesPollInterval: number | null = null;
  private logsPollInterval: number | null = null;
  private debugPollInterval: number | null = null;
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

    // Auto-advance to today if the selected date is stale (e.g. app left open overnight)
    const today = localDateString();
    if (this.todaySelectedDate !== today) {
      this.todaySelectedDate = today;
    }

    // daily-brief:update events are handled centrally in app-gateway.ts.

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
    // Clear session-scoped resources so stale chips don't flash on switch
    this.sessionResources = [];
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
    const prompt = "Let's do my morning set. Check my daily note for today's Win The Day items, review my calendar, and then walk me through a proposed plan for the day. Ask me clarifying questions before finalizing anything. Suggest which tasks you can handle vs what I should do myself. Do NOT call the morning_set tool or kick off any agents until I explicitly approve the plan.";
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
  handleMissionControlToggleFullControl() {
    this.missionControlFullControl = !this.missionControlFullControl;
    try { localStorage.setItem("godmode.mc.fullControl", this.missionControlFullControl ? "1" : "0"); } catch { /* non-fatal */ }
  }

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
    void this.loadSessionResources();
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

  async handleSwarmSelectProject(projectId: string) {
    const { selectSwarmProject } = await import("./controllers/mission-control.js");
    await selectSwarmProject(this, projectId);
  }

  async handleSwarmSteer(projectId: string, issueTitle: string, instructions: string) {
    const { steerSwarmAgent } = await import("./controllers/mission-control.js");
    await steerSwarmAgent(this, projectId, issueTitle, instructions);
  }

  async handleSwarmViewProofDoc(docSlug: string) {
    return this.handleOpenProofDoc(docSlug);
  }

  async handleSwarmViewRunLog(queueItemId: string) {
    if (!this.client || !this.connected) return;
    try {
      const result = await this.client.request<{ content?: string; title?: string; mimeType?: string }>(
        "godmode.delegation.runLog",
        { queueItemId },
      );
      if (result?.content) {
        this.handleOpenSidebar(result.content, {
          mimeType: result.mimeType ?? "text/markdown",
          title: result.title ?? "Agent Logs",
        });
      } else {
        this.showToast("No logs available", "error");
      }
    } catch {
      this.showToast("Failed to load agent logs", "error");
    }
  }

  async handleMissionControlViewTaskFiles(itemId: string) {
    try {
      const result = await this.client?.request<{
        files?: Array<{ path: string; name: string; size: number; type: string }>;
      }>("queue.taskFiles", { itemId });
      const files = result?.files ?? [];
      if (files.length === 0) {
        this.showToast("No files found for this task", "info");
        return;
      }
      // Format as markdown for sidebar
      const lines = files.map(
        (f) => `- **${f.name}** (${f.type}, ${(f.size / 1024).toFixed(1)} KB)\n  \`${f.path}\``
      );
      const md = `## Task Files\n\n${lines.join("\n\n")}`;
      this.handleOpenSidebar(md, { title: "Task Files" });
    } catch (e: unknown) {
      console.error("Failed to load task files:", e);
      this.showToast("Failed to load task files", "error");
    }
  }

  // ── Ally Side-Chat Handlers ──────────────────────────────────────────

  async handleAllyAction(action: string, target?: string, method?: string, params?: Record<string, unknown>) {
    if (action === "navigate" && target) {
      this.setTab(target as import("./navigation.js").Tab);
    } else if (action === "rpc" && method && this.client) {
      try {
        await this.client.request(method, params ?? {});
        this.showToast("Done", "success", 2000);
      } catch (e) {
        console.error("[Ally] Action RPC failed:", e);
        this.showToast("Action failed", "error");
      }
    }
  }

  handleAllyToggle() {
    this.allyPanelOpen = !this.allyPanelOpen;
    if (this.allyPanelOpen) {
      this.allyUnread = 0;
      this._loadAllyHistory().then(() => {
        // Double-RAF ensures the panel DOM is fully rendered before scrolling
        this._scrollAllyToBottom();
        requestAnimationFrame(() => this._scrollAllyToBottom());
      });
    }
  }

  handleAllyDraftChange(text: string) {
    this.allyDraft = text;
  }

  handleAllyAttachmentsChange(attachments: import("./ui-types").ChatAttachment[]) {
    this.allyAttachments = attachments;
  }

  async handleAllySend() {
    const text = this.allyDraft.trim();
    const attachments = this.allyAttachments;
    if ((!text && attachments.length === 0) || this.allySending) return;

    // Prepend tab context so the ally knows what the user is looking at
    const context = buildAllyContext(this as any);
    let msg = text ? `${context}\n\n${text}` : context;

    this.allyDraft = "";
    this.allyAttachments = [];
    this.allySending = true;
    this.allyMessages = [...this.allyMessages, { role: "user" as const, content: text || "(image)", timestamp: Date.now() }];

    try {
      // Process image attachments (same pattern as full chat)
      let imageAttachments: Array<{ type: string; mimeType: string; content: string; fileName?: string }> | undefined;
      if (attachments.length > 0) {
        const images: typeof imageAttachments = [];
        for (const att of attachments) {
          if (!att.dataUrl) continue;
          const match = att.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (!match) continue;
          const [, mime, content] = match;
          if (mime.startsWith("image/")) {
            images.push({ type: "image", mimeType: mime, content, fileName: att.fileName });
          }
        }
        if (images.length > 0) {
          imageAttachments = images;
          // Cache images server-side
          try {
            await this.client?.request("images.cache", {
              images: images.map((img) => ({ data: img.content, mimeType: img.mimeType, fileName: img.fileName })),
              sessionKey: ALLY_SESSION_KEY,
            });
          } catch {
            // Non-blocking
          }
        }
      }

      const idempotencyKey = `ally-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      // Force the session's lastChannel to "webchat" so the gateway routes
      // the response here instead of to iMessage. The `channel` param on the
      // agent RPC alone isn't sufficient — the gateway still checks
      // session.lastChannel for delivery routing.
      try {
        await this.client?.request("sessions.patch", {
          key: ALLY_SESSION_KEY,
          lastChannel: "webchat",
        });
      } catch {
        // Non-blocking — best-effort channel override
      }
      await this.client?.request("agent", {
        sessionKey: ALLY_SESSION_KEY,
        message: msg,
        deliver: false,
        channel: "webchat",
        idempotencyKey,
        attachments: imageAttachments,
      });
      // Show reading indicator between RPC success and first streaming delta.
      // Gateway error/aborted events clear allyWorking if the turn fails.
      this.allyWorking = true;

      // Fallback poll: gateway `chat` events may arrive with a canonicalized
      // session key that doesn't match ALLY_SESSION_KEY, or the response may
      // route through an external channel. Poll history to detect completion.
      const lastMsgContent = this.allyMessages[this.allyMessages.length - 1]?.content;
      const pollTimer = setInterval(async () => {
        // Stop polling if working state was already cleared by a gateway event
        if (!this.allyWorking) {
          clearInterval(pollTimer);
          return;
        }
        try {
          await this._loadAllyHistory();
          // Check if a NEW assistant message appeared after the user's message
          const last = this.allyMessages[this.allyMessages.length - 1];
          if (last && last.role === "assistant" && last.content !== lastMsgContent) {
            this.allyWorking = false;
            this.allyStream = null;
            clearInterval(pollTimer);
            this._scrollAllyToBottom();
          }
        } catch {
          // Ignore — will retry on next tick
        }
      }, 5_000);
      // Safety cap: stop polling after 2 minutes regardless
      setTimeout(() => clearInterval(pollTimer), 120_000);
    } catch (e) {
      const errStr = e instanceof Error ? e.message : String(e);
      console.error("[Ally] Failed to send ally message:", errStr);
      // Add error message inline so user sees what went wrong
      this.allyMessages = [
        ...this.allyMessages,
        { role: "assistant" as const, content: `*Send failed: ${errStr}*`, timestamp: Date.now() },
      ];
    } finally {
      this.allySending = false;
    }
  }

  handleAllyOpenFull() {
    // Switch to chat tab and activate the pinned ally session
    this.allyPanelOpen = false;
    this.setTab("chat" as import("./navigation.js").Tab);
    // Activate ally-main via pinned tab — no need to add to openTabs
    this.applySettings({
      ...this.settings,
      sessionKey: ALLY_SESSION_KEY,
      lastActiveSessionKey: ALLY_SESSION_KEY,
      tabLastViewed: {
        ...this.settings.tabLastViewed,
        [ALLY_SESSION_KEY]: Date.now(),
      },
    });
    this.sessionKey = ALLY_SESSION_KEY;
    this.chatMessages = [];
    this.chatStream = null;
    this.chatStreamStartedAt = null;
    this.chatRunId = null;
    this.resetToolStream();
    this.resetChatScroll();
    void this.loadAssistantIdentity();
    void import("./controllers/chat.js").then(({ loadChatHistory }) => loadChatHistory(this));
    void this.loadSessionResources();
  }

  private _scrollAllyToBottom() {
    void this.updateComplete.then(() => {
      requestAnimationFrame(() => {
        const panel = this.renderRoot?.querySelector?.(".ally-panel, .ally-inline")
          ?? document.querySelector(".ally-panel, .ally-inline");
        if (!panel) return;
        const container = panel.querySelector(".ally-panel__messages");
        if (container) container.scrollTop = container.scrollHeight;
      });
    });
  }

  async _loadAllyHistory() {
    try {
      const res = await this.client?.request<{
        messages: Array<{ role: string; content: unknown; timestamp?: number }>;
      }>("chat.history", { sessionKey: ALLY_SESSION_KEY, limit: 100 });
      if (res?.messages) {
        const { extractText, formatApiError } = await import("./chat/message-extract.js");
        this.allyMessages = res.messages
          .map((m) => {
            const role = (m.role as string) ?? "assistant";

            // Skip tool results, system messages, and other non-conversation roles.
            // These carry raw tool output (directory listings, file reads, etc.)
            // that should never appear in the ally bubble.
            const roleLower = role.toLowerCase();
            if (
              roleLower === "tool" ||
              roleLower === "toolresult" ||
              roleLower === "tool_result" ||
              roleLower === "function" ||
              roleLower === "system"
            ) return null;

            // Also detect tool results disguised as assistant messages
            // (messages with toolCallId / tool_call_id fields)
            const raw = m as Record<string, unknown>;
            if (raw.toolCallId || raw.tool_call_id || raw.toolName || raw.tool_name) return null;

            // Skip messages whose content array is ONLY tool blocks (no text).
            // Assistant messages often mix text + tool_use — keep those (extractText grabs only text parts).
            // Only drop messages that have zero text content alongside tool blocks.
            if (Array.isArray(m.content)) {
              const items = m.content as Array<Record<string, unknown>>;
              const hasTextBlock = items.some((item) => {
                const t = (typeof item.type === "string" ? item.type : "").toLowerCase();
                return (t === "text" || t === "") && typeof item.text === "string" && item.text.trim().length > 0;
              });
              if (!hasTextBlock) {
                const hasToolBlocks = items.some((item) => {
                  const t = (typeof item.type === "string" ? item.type : "").toLowerCase();
                  return t === "tool_use" || t === "tool_result" || t === "toolresult" || t === "tooluse";
                });
                if (hasToolBlocks) return null;
              }
            }

            let text = extractText(m);
            if (!text) return null;
            // Convert raw API error JSON to friendly message
            const errMsg = formatApiError(text);
            if (errMsg) text = errMsg;
            // Strip [GodMode Context: ...] prefix
            text = text.replace(/^\[GodMode Context:[^\]]*\]\s*/i, "").trim();
            if (!text) return null;
            // Filter system plumbing, keep real content
            const cleaned = cleanForAlly(text, role);
            if (!cleaned) return null;
            return {
              role: (roleLower === "user" ? "user" : "assistant") as "user" | "assistant",
              content: cleaned,
              timestamp: m.timestamp,
            };
          })
          .filter((m): m is NonNullable<typeof m> => m !== null);

        // Deduplicate consecutive messages with identical role + content.
        // Server history can contain duplicates when the response is delivered
        // to both the web UI and an external channel (iMessage, Telegram).
        const deduped: typeof this.allyMessages = [];
        for (const m of this.allyMessages) {
          const prev = deduped[deduped.length - 1];
          if (prev && prev.role === m.role && prev.content === m.content) continue;
          deduped.push(m);
        }
        this.allyMessages = deduped;
      }
    } catch {
      // History load failed — start fresh
    }
  }

  // ── Decision Card Handlers ──────────────────────────────────────────

  async handleDecisionApprove(id: string) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("queue.approve", { id });
      this.todayQueueResults = this.todayQueueResults.filter(r => r.id !== id);
    } catch (e) {
      console.error("[DecisionCard] Approve failed:", e);
      this.showToast("Failed to approve", "error");
    }
  }

  async handleDecisionReject(id: string) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("queue.reject", { id });
      this.todayQueueResults = this.todayQueueResults.filter(r => r.id !== id);
    } catch (e) {
      console.error("[DecisionCard] Reject failed:", e);
      this.showToast("Failed to reject", "error");
    }
  }

  async handleDecisionDismiss(id: string) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("queue.remove", { id });
      this.todayQueueResults = this.todayQueueResults.filter(r => r.id !== id);
    } catch (e) {
      console.error("[DecisionCard] Dismiss failed:", e);
      this.showToast("Failed to dismiss", "error");
    }
  }

  async handleDecisionMarkComplete(id: string) {
    if (!this.client || !this.connected) return;
    try {
      const item = this.todayQueueResults?.find((r) => r.id === id);
      if (item?.sourceTaskId) {
        await this.client.request("tasks.update", {
          id: item.sourceTaskId,
          status: "complete",
        });
      }
      await this.client.request("queue.remove", { id });
      this.todayQueueResults = this.todayQueueResults.filter(r => r.id !== id);
      this.showToast("Task marked complete", "success");
    } catch (e) {
      console.error("[DecisionCard] Mark complete failed:", e);
      this.showToast("Failed to mark complete", "error");
    }
  }

  async handleDecisionRate(id: string, workflow: string, rating: number) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("trust.rate", { workflow, rating });
      // Below threshold (7) — ask for improvement feedback before dismissing
      const needsFeedback = rating < 7;
      this.todayQueueResults = this.todayQueueResults.map((r) =>
        r.id === id ? { ...r, userRating: rating, feedbackPending: needsFeedback } : r,
      );
      if (!needsFeedback) {
        // Good rating — auto-dismiss cron results, toast for queue items
        const item = this.todayQueueResults?.find((r) => r.id === id);
        if (item?.source === "cron") {
          await this.client.request("queue.remove", { id });
          this.todayQueueResults = this.todayQueueResults.filter((r) => r.id !== id);
        }
        this.showToast(`Rated ${workflow} ${rating}/10`, "success");
      } else {
        this.showToast(`Rated ${workflow} ${rating}/10 — what could be better?`, "info");
      }
    } catch (e) {
      console.error("[DecisionCard] Rate failed:", e);
      this.showToast("Failed to submit rating", "error");
    }
  }

  async handleDecisionFeedback(id: string, workflow: string, feedback: string) {
    if (!this.client || !this.connected) return;
    try {
      // Submit improvement feedback (if provided — skip means empty string)
      if (feedback) {
        await this.client.request("trust.feedback", { workflow, feedback });
        this.showToast(`Feedback saved for ${workflow} — will apply next time`, "success");
      }
      // Dismiss the card now that feedback is collected (or skipped)
      const item = this.todayQueueResults?.find((r) => r.id === id);
      if (item?.source === "cron") {
        await this.client.request("queue.remove", { id });
      }
      this.todayQueueResults = this.todayQueueResults
        .map((r) => r.id === id ? { ...r, feedbackPending: false } : r)
        .filter((r) => !(r.id === id && r.source === "cron"));
    } catch (e) {
      console.error("[DecisionCard] Feedback failed:", e);
      this.showToast("Failed to save feedback", "error");
    }
  }

  async handleDecisionViewOutput(id: string, outputPath: string) {
    if (!this.client || !this.connected) {
      this.showToast("Not connected to gateway", "error");
      return;
    }
    try {
      const result = await this.client.request<{ content: string }>(
        "queue.readOutput",
        { path: outputPath },
      );
      const title = outputPath.split("/").pop() ?? "Agent Output";
      this.handleOpenSidebar(result.content, {
        mimeType: "text/markdown",
        filePath: outputPath,
        title,
      });
    } catch (err) {
      console.error("[DecisionCard] View output failed:", err);
      // Fallback to host files.read
      void this.handleOpenFile(outputPath);
    }
  }

  async handleDecisionOpenChat(id: string) {
    // Open a main chat session with agent output context pre-seeded
    const item = this.todayQueueResults?.find((r) => r.id === id);
    if (!item) return;

    // If the queue item is linked to a task, use the task session flow
    // (creates/reuses session, seeds output, navigates to chat tab)
    if (item.sourceTaskId) {
      await this.handleMissionControlOpenTaskSession(item.sourceTaskId);
      return;
    }

    // No linked task — create a fresh session and seed it with the output
    const { createNewSession } = await import("./app-render.helpers.js");
    createNewSession(this);
    this.setTab("chat" as import("./navigation.js").Tab);

    // Title the session tab with the agent result name
    const { autoTitleCache } = await import("./controllers/sessions.js");
    autoTitleCache.set(this.sessionKey, item.title);

    // Seed with agent output if we have an outputPath
    if (item.outputPath && this.client && this.connected) {
      try {
        const res = await this.client.request<{ content: string }>(
          "queue.readOutput",
          { path: item.outputPath },
        );
        if (res?.content) {
          await this.seedSessionWithAgentOutput(item.title, res.content);
        }
      } catch {
        // Fallback: seed with just the summary
        await this.seedSessionWithAgentOutput(item.title, item.summary);
      }
    } else if (item.summary) {
      await this.seedSessionWithAgentOutput(item.title, item.summary);
    }
  }

  async handleTodayOpenChatToEdit(itemId: string) {
    try {
      // Look up outputPath from queue results
      const item = this.todayQueueResults?.find((r) => r.id === itemId);
      const outputPath = item?.outputPath;

      // Open sidebar with output if we have a path
      if (outputPath && this.client && this.connected) {
        try {
          const res = await this.client.request<{ content: string }>(
            "queue.readOutput",
            { path: outputPath },
          );
          this.handleOpenSidebar(res.content, {
            mimeType: "text/markdown",
            filePath: outputPath,
            title: item?.title ?? outputPath.split("/").pop() ?? "Agent Output",
          });
        } catch {
          // Fallback to host files.read
          await this.handleOpenFile(outputPath);
        }
      }

      // Open ally panel
      this.allyPanelOpen = true;
      this.allyUnread = 0;

      // Switch to chat tab so sidebar is visible
      if (this.tab !== ("chat" as any)) {
        this.setTab("chat" as import("./navigation.js").Tab);
      }
    } catch (e) {
      console.error("Open chat to edit failed:", e);
    }
  }

  /**
   * Seeds a newly opened session with agent output context.
   * Opens the sidebar with the full output (zero token cost) and sends
   * only a compact summary to the chat to avoid wasting thousands of tokens.
   */
  async seedSessionWithAgentOutput(taskTitle: string, output: string, agentPrompt?: string) {
    if (!this.client || !this.connected) return;

    // Open sidebar with the full agent output — zero token cost
    this.handleOpenSidebar(output, {
      title: `Agent Output: ${taskTitle}`,
      filePath: null,
      mimeType: null,
    });

    // Extract a compact summary from the ## Summary section
    const summaryMatch = output.match(/## Summary\n([\s\S]*?)(?=\n## |$)/);
    const summary = summaryMatch
      ? summaryMatch[1].trim().split("\n").slice(0, 3).join("\n")
      : "Output available in sidebar.";

    const compactMessage = [
      `Agent completed **${taskTitle}**.`,
      "",
      summary,
      "",
      "Full output is in the sidebar. What would you like to do?",
    ].join("\n");

    try {
      const { sendChatMessage } = await import("./controllers/chat.js");
      await sendChatMessage(this as any, compactMessage);
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
          void this.loadSessionResources();

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

  async handleDashboardTogglePin(id: string) {
    const { toggleDashboardPin } = await import("./controllers/dashboards.js");
    await toggleDashboardPin(this, id);
  }

  async handleDashboardCreateViaChat(prompt?: string) {
    this.setTab("chat" as import("./navigation").Tab);
    const { createNewSession } = await import("./app-render.helpers.js");
    createNewSession(this);
    void this.handleSendChat(
      prompt ?? "I want to create a custom dashboard. Ask me what data I want to see and design it for me. You can use any of GodMode's data — tasks, calendar, focus pulse, goals, trust scores, agent activity, queue status, coding tasks, workspace stats, and more.",
    );
  }

  handleDashboardCategoryFilter(category: string | null) {
    this.dashboardCategoryFilter = category;
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
      // If path is a URL or served route, open directly (preserves relative links)
      if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
        window.open(path, "_blank", "noopener,noreferrer");
        return;
      }
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

  handleGatewayRestartClick() {
    this.gatewayRestartPending = true;
  }

  async handleGatewayRestartConfirm() {
    if (!this.client || this.gatewayRestartBusy) return;
    this.gatewayRestartBusy = true;
    try {
      await this.client.request("godmode.gateway.restart");
    } catch {
      // Gateway killed mid-request — this is expected
    } finally {
      this.gatewayRestartBusy = false;
      this.gatewayRestartPending = false;
    }
  }

  handleGatewayRestartCancel() {
    this.gatewayRestartPending = false;
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
    this.sidebarMode = "resource";
    this.sidebarProofSlug = null;
    this.sidebarProofUrl = null;
    this.sidebarOpen = true;
  }

  handleCloseSidebar() {
    this.sidebarOpen = false;
    this.showDrivePicker = false;
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
      // Preserve proof slug so the sidebar toggle can re-open it
      if (this.sidebarMode !== "proof") {
        this.sidebarMode = "resource";
        this.sidebarProofSlug = null;
        this.sidebarProofUrl = null;
      }
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

  async handleToggleDrivePicker() {
    if (this.showDrivePicker) {
      this.showDrivePicker = false;
      return;
    }
    // Fetch accounts on first open
    if (this.driveAccounts.length === 0) {
      try {
        const result = await this.client?.request<{
          accounts: Array<{ email: string; client: string; label: string }>;
        }>("files.listDriveAccounts", {});
        this.driveAccounts = result?.accounts ?? [];
      } catch {
        this.driveAccounts = [];
      }
    }
    this.showDrivePicker = true;
  }

  async handlePushToDrive(filePath: string, account?: string) {
    if (this.driveUploading) return;
    this.showDrivePicker = false;

    // If we have a pending batch, redirect to batch handler
    if (this._pendingBatchPaths && this._pendingBatchPaths.length > 0) {
      const paths = this._pendingBatchPaths;
      this._pendingBatchPaths = undefined;
      await this._executeBatchDrive(paths, account);
      return;
    }

    this.driveUploading = true;
    try {
      const params: Record<string, string> = { filePath };
      if (account) params.account = account;
      const result = await this.client?.request<{
        message?: string;
        output?: string;
        driveUrl?: string;
        fileId?: string;
      }>("files.pushToDrive", params);
      const label = account ? ` to ${account.split("@")[0]}` : "";
      const msg = result?.message ?? `Uploaded${label} to Google Drive`;
      const driveUrl = result?.driveUrl;
      this.showToast(
        msg,
        "success",
        driveUrl ? 8000 : 5000,
        driveUrl ? { label: "View in Drive", url: driveUrl } : undefined,
      );
    } catch (e: unknown) {
      console.error("Push to Drive failed:", e);
      const detail =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e !== null && "message" in e
            ? String((e as { message: unknown }).message)
            : "Unknown error";
      // Check for specific gog CLI errors and show helpful setup messages
      if (detail.includes("GOG_NOT_FOUND") || detail.includes("gog CLI not found")) {
        this.showToast(
          "Google Drive not configured. Install gog CLI: npm install -g gog-cli, then run: gog auth add <email> --services drive",
          "warning",
          10000,
        );
      } else if (detail.includes("GOG_AUTH") || detail.includes("auth") && detail.includes("expired")) {
        this.showToast(
          "Google Drive auth expired. Re-authenticate: gog auth add <email> --services drive",
          "warning",
          8000,
        );
      } else {
        this.showToast(`Drive upload failed: ${detail}`, "error", 8000);
      }
    } finally {
      this.driveUploading = false;
    }
  }

  async handleBatchPushToDrive(filePaths: string[]) {
    if (this.driveUploading || filePaths.length === 0) return;

    // If Drive accounts are available and picker isn't shown yet, trigger picker first
    if (!this.driveAccounts || this.driveAccounts.length === 0) {
      // Try loading accounts; if none, proceed without account
      try {
        const res = await this.client?.request<{ accounts?: Array<{ email: string }> }>("files.listDriveAccounts");
        this.driveAccounts = res?.accounts ?? [];
      } catch { /* proceed without account selection */ }
    }

    // If multiple accounts, show picker — store pending batch and let picker callback handle it
    if (this.driveAccounts && this.driveAccounts.length > 1) {
      this._pendingBatchPaths = filePaths;
      this.showDrivePicker = true;
      return;
    }

    const account = this.driveAccounts?.[0]?.email;
    await this._executeBatchDrive(filePaths, account);
  }

  /** @internal Execute batch Drive upload. */
  private async _executeBatchDrive(filePaths: string[], account?: string) {
    this.driveUploading = true;
    this.showToast(`Uploading ${filePaths.length} files to Drive...`, "info", 0);
    try {
      const params: Record<string, unknown> = { filePaths };
      if (account) params.account = account;
      const result = await this.client?.request<{
        message?: string;
        results?: Array<{ path: string; success: boolean; driveUrl?: string; error?: string }>;
      }>("files.batchPushToDrive", params);

      // Dismiss the progress toast
      this.dismissAllToasts();

      const successCount = result?.results?.filter((r) => r.success).length ?? 0;
      const total = result?.results?.length ?? filePaths.length;
      if (successCount === total) {
        this.showToast(`Uploaded ${successCount} files to Google Drive`, "success", 5000);
      } else {
        this.showToast(`Uploaded ${successCount}/${total} files (${total - successCount} failed)`, "warning", 8000);
      }
    } catch (e: unknown) {
      this.dismissAllToasts();
      const detail = e instanceof Error ? e.message : "Unknown error";
      this.showToast(`Batch Drive upload failed: ${detail}`, "error", 8000);
    } finally {
      this.driveUploading = false;
      this._pendingBatchPaths = undefined;
    }
  }

  /** Pending batch paths awaiting account selection from Drive picker. */
  private _pendingBatchPaths?: string[];

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
          path?: string;
        }>("workspaces.readFile", { workspaceId, filePath });
        if (typeof result.content !== "string") {
          continue;
        }
        this.handleOpenSidebar(result.content, {
          mimeType: result.contentType ?? result.mime ?? this.inferMimeTypeFromPath(filePath),
          filePath: result.path ?? filePath,
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

    // Handle file:// URLs — extract the local path directly
    if (href.startsWith("file://")) {
      let filePath = href.slice("file://".length);
      // file:///~/... → ~/...
      if (filePath.startsWith("/~/")) {
        filePath = "~" + filePath.slice(2);
      }
      try {
        filePath = decodeURIComponent(filePath);
      } catch {
        // keep as-is
      }
      candidates.push(filePath);
      // Don't fall through to URL parsing — file:// is fully handled
      const normalized: string[] = [];
      const seen = new Set<string>();
      for (const candidate of candidates) {
        const safe = this.normalizeWorkspacePathCandidate(candidate, { allowAbsolute: true });
        if (!safe || seen.has(safe)) continue;
        seen.add(safe);
        normalized.push(safe);
      }
      return normalized;
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
        path?: string;
      }>("workspaces.readFile", { path: filePath });
      if (typeof result.content === "string") {
        this.handleOpenSidebar(result.content, {
          mimeType: result.contentType ?? result.mime ?? this.inferMimeTypeFromPath(filePath),
          filePath: result.path ?? filePath,
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
    duration = 5000,
    action?: ToastAction,
  ) {
    const toast = createToast(message, type, duration, action);
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

  dismissAllToasts() {
    this.toasts = [];
  }

  // My Day handlers
  async handleMyDayRefresh() {
    await loadMyDayInternal(this);
    // Also refresh decision cards
    this._loadDecisionCards();
  }

  private _loadDecisionCards() {
    import("./controllers/my-day.js").then(async (mod) => {
      this.todayQueueResults = await mod.loadTodayQueueResults(this as any);
    }).catch(() => {});
  }

  /** Public wrapper for gateway event handler to trigger decision card refresh */
  async loadTodayQueueResults(): Promise<void> {
    this._loadDecisionCards();
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

  async handleTodayViewTaskOutput(taskId: string) {
    if (!this.client || !this.connected) return;
    try {
      // Find the queue item linked to this task
      const queueResult = await this.client.request<{
        items: Array<{ id: string; sourceTaskId?: string; result?: { outputPath?: string; summary?: string } }>;
      }>("queue.list", { limit: 100 });
      const qi = queueResult?.items?.find((i) => i.sourceTaskId === taskId);
      if (!qi?.result?.outputPath) {
        this.showToast("No output available for this task", "info");
        return;
      }
      // Read the output and open in sidebar
      const result = await this.client.request<{ content: string }>(
        "queue.readOutput",
        { path: qi.result.outputPath },
      );
      const title = qi.result.outputPath.split("/").pop() ?? "Agent Output";
      this.handleOpenSidebar(result.content, {
        mimeType: "text/markdown",
        filePath: qi.result.outputPath,
        title,
      });
    } catch (err) {
      console.error("[Tasks] View output failed:", err);
      this.showToast("Failed to load agent output", "error");
    }
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
        // Set the tab title to the task name and persist it
        if (result.task?.title) {
          const { autoTitleCache } = await import("./controllers/sessions.js");
          autoTitleCache.set(key, result.task.title);
          // Persist to OpenClaw so it survives refresh
          const { hostPatchSession } = await import("../lib/host-compat.js");
          void hostPatchSession(this.client, key, result.task.title);
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
        void this.loadSessionResources();
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

  async handleDailyBriefGenerate() {
    if (!this.client || !this.connected) return;
    this.dailyBriefLoading = true;
    try {
      await this.client.request("dailyBrief.generate", {});
      await loadBriefOnlyInternal(this);
    } catch (err) {
      this.dailyBriefError = err instanceof Error ? err.message : "Failed to generate brief";
    } finally {
      this.dailyBriefLoading = false;
    }
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

  handleTodayViewModeChange(mode: "brief" | "tasks" | "inbox") {
    this.todayViewMode = mode;
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
      // Notify backend so vault-capture and awareness snapshot skip this session
      if (this.client && this.connected) {
        this.client.request("session.setPrivate", { sessionKey: this.sessionKey, enabled: true }).catch(() => {});
      }
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
      const fallback = remaining[0] || ALLY_SESSION_KEY;
      this.applySettings({
        ...this.settings,
        openTabs: remaining,
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

    // Notify backend to clear private status before deletion
    if (this.client && this.connected) {
      this.client.request("session.setPrivate", { sessionKey, enabled: false }).catch(() => {});
      // Delete from gateway (fire-and-forget, no confirmation prompt)
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
    await Promise.all([loadWorkInternal(this), loadResourcesInternal(this)]);
  }

  async handleResourcePin(id: string, pinned: boolean) {
    await pinResourceInternal(this, id, pinned);
  }

  async handleResourceDelete(id: string) {
    await deleteResourceInternal(this, id);
  }

  handleResourceFilterChange(filter: import("./views/work").ResourceFilter) {
    this.workResourceFilter = filter;
  }

  handleResourceClick(resource: import("./views/work").Resource) {
    if (resource.path) {
      this.handleWorkFileClick(resource.path);
    } else if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  }

  /** Load resources filtered to the current session (for Manus-style chat strip). */
  async loadSessionResources() {
    if (!this.client || !this.connected) return;
    try {
      const result = await this.client.request<{
        resources: Array<{ id: string; title: string; type: string; path?: string; url?: string; sessionKey: string }>;
      }>("resources.list", { sessionKey: this.sessionKey, limit: 20 });
      this.sessionResources = result.resources ?? [];
    } catch (err) {
      console.warn("[SessionResources] load failed:", err);
      this.sessionResources = [];
    }
  }

  handleSessionResourceClick(resource: { path?: string; url?: string }) {
    if (resource.path) {
      void this.handleOpenFile(resource.path);
    } else if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  }

  handleToggleSessionResources() {
    this.sessionResourcesCollapsed = !this.sessionResourcesCollapsed;
  }

  handleViewAllResources() {
    this.setTab("work" as import("./navigation.js").Tab);
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
        path?: string;
        error?: string;
      }>("workspaces.readFile", { path: filePath });

      if (!result.content) {
        this.showToast(result.error ?? "Failed to read file", "error");
        return;
      }
      this.handleOpenSidebar(result.content, {
        mimeType: result.contentType ?? result.mime ?? this.inferMimeTypeFromPath(filePath),
        filePath: result.path ?? filePath,
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
        void this.loadSessionResources();
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
      // Fetch file preview and config diff in parallel
      const [previewResult, diffResult] = await Promise.all([
        this.client.request<{
          files: Array<{ path: string; exists: boolean; wouldCreate: boolean }>;
        }>("onboarding.wizard.preview", this.wizardState.answers),
        this.client.request<{
          additions: Array<{ path: string; current: unknown; recommended: unknown }>;
          changes: Array<{ path: string; current: unknown; recommended: unknown }>;
          matching: string[];
        }>("onboarding.wizard.diff", this.wizardState.answers).catch(() => null),
      ]);

      // Pre-populate file selections: new files checked, existing files unchecked
      const fileSelections: Record<string, boolean> = {};
      for (const f of previewResult.files ?? []) {
        fileSelections[f.path] = f.wouldCreate;
      }

      // Pre-populate config selections: additions checked, changes unchecked
      const configSelections: Record<string, boolean> = {};
      if (diffResult) {
        for (const a of diffResult.additions) configSelections[a.path] = true;
        for (const c of diffResult.changes) configSelections[c.path] = false;
      }

      this.wizardState = {
        ...this.wizardState,
        preview: previewResult.files ?? [],
        diff: diffResult,
        fileSelections,
        configSelections,
      };
      this.requestUpdate();
    } catch (err) {
      console.error("[Wizard] Preview failed:", err);
    }
  }

  handleWizardFileToggle(path: string, checked: boolean) {
    if (!this.wizardState) return;
    this.wizardState = {
      ...this.wizardState,
      fileSelections: { ...this.wizardState.fileSelections, [path]: checked },
    };
    this.requestUpdate();
  }

  handleWizardConfigToggle(path: string, checked: boolean) {
    if (!this.wizardState) return;
    this.wizardState = {
      ...this.wizardState,
      configSelections: { ...this.wizardState.configSelections, [path]: checked },
    };
    this.requestUpdate();
  }

  async handleWizardGenerate() {
    if (!this.client || !this.wizardState) return;
    this.wizardState = { ...this.wizardState, generating: true, error: null };
    this.requestUpdate();

    // Derive skipFiles and skipKeys from unchecked selections
    const skipFiles: string[] = [];
    for (const [path, checked] of Object.entries(this.wizardState.fileSelections)) {
      if (!checked) skipFiles.push(path);
    }
    const skipKeys: string[] = [];
    for (const [path, checked] of Object.entries(this.wizardState.configSelections)) {
      if (!checked) skipKeys.push(path);
    }

    try {
      const result = await this.client.request<{
        success: boolean;
        filesCreated: number;
        filesSkipped: number;
        configPatched: boolean;
        workspacePath: string;
        configError?: string;
      }>("onboarding.wizard.generate", {
        ...this.wizardState.answers,
        skipFiles,
        skipKeys,
      });

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

  async handleQuickSetup(name: string) {
    void import("./controllers/setup.js").then(async ({ quickSetup }) => {
      const success = await quickSetup(this, name);
      if (success) {
        this.setTab("chat" as import("./navigation").Tab);
        // Reload capabilities in background
        void import("./controllers/setup.js").then(({ loadCapabilities }) => loadCapabilities(this));
      }
    });
  }

  handleLoadCapabilities() {
    void import("./controllers/setup.js").then(({ loadCapabilities }) => loadCapabilities(this));
  }

  handleCapabilityAction(id: string) {
    void import("./controllers/setup.js").then(({ capabilityAction }) => capabilityAction(this, id));
  }

  handleHideSetup() {
    void import("./controllers/setup.js").then(({ hideSetup }) => hideSetup(this));
  }

  handleRunAssessment() {
    if (!this.client) return;
    void this.client.request("onboarding.assess", {}).then(() => {
      this.handleLoadCapabilities();
    });
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

  // ── Onboarding integration handlers ──────────────────────────────
  async handleLoadIntegrations() {
    const mod = await import("./controllers/onboarding-setup.js");
    await mod.loadIntegrations(this as any);
  }

  handleExpandCard(id: string | null) {
    void import("./controllers/onboarding-setup.js").then(m => m.expandCard(this as any, id));
  }

  async handleLoadGuide(id: string) {
    const mod = await import("./controllers/onboarding-setup.js");
    await mod.loadGuide(this as any, id);
  }

  async handleTestIntegration(id: string) {
    const mod = await import("./controllers/onboarding-setup.js");
    await mod.testIntegration(this as any, id);
  }

  async handleConfigureIntegration(id: string, values: Record<string, string>) {
    const mod = await import("./controllers/onboarding-setup.js");
    await mod.configureIntegration(this as any, id, values);
  }

  handleUpdateConfigValue(key: string, value: string) {
    this.onboardingConfigValues = { ...this.onboardingConfigValues, [key]: value };
  }

  handleSkipIntegration(id: string) {
    void import("./controllers/onboarding-setup.js").then(m => m.skipIntegration(this as any, id));
  }

  async handleMarkOnboardingComplete() {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("onboarding.complete", {});
      if (this.godmodeOptions) this.godmodeOptions = { ...this.godmodeOptions, "onboarding.complete": true };
      this.showSetupTab = false;
      this.setTab("chat" as import("./navigation").Tab);
    } catch (err) {
      console.error("[onboarding] Failed to mark complete:", err);
    }
  }

  // ── Universal Inbox handlers ──────────────────────────────────

  async handleInboxRefresh() {
    if (!this.client || !this.connected) return;
    this.inboxLoading = true;
    try {
      const result = await this.client.request<{
        items: NonNullable<import("./app-view-state").AppViewState["inboxItems"]>;
        total: number;
        pendingCount: number;
      }>("inbox.list", { status: "pending", limit: 50 });
      this.inboxItems = result.items;
      this.inboxCount = result.pendingCount;
    } catch (err) {
      console.error("[Inbox] Failed to load:", err);
    } finally {
      this.inboxLoading = false;
    }
  }

  async handleInboxScore(itemId: string, score: number, feedback?: string) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("inbox.score", { itemId, score, feedback });
      this.inboxScoringId = null;
      this.inboxScoringValue = undefined;
      this.inboxFeedbackText = undefined;
      await this.handleInboxRefresh();
    } catch (err) {
      console.error("[Inbox] Score failed:", err);
    }
  }

  async handleInboxDismiss(itemId: string) {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("inbox.dismiss", { itemId });
      await this.handleInboxRefresh();
    } catch (err) {
      console.error("[Inbox] Dismiss failed:", err);
    }
  }

  async handleInboxMarkAll() {
    if (!this.client || !this.connected) return;
    try {
      await this.client.request("inbox.markAllComplete", {});
      await this.handleInboxRefresh();
    } catch (err) {
      console.error("[Inbox] Mark all failed:", err);
    }
  }

  async handleInboxViewOutput(itemId: string) {
    const item = this.inboxItems?.find((i) => i.id === itemId);
    if (!item) return;

    // Prefer the actual output file (the deliverable) over the proof doc (a review/QA doc)
    if (item.outputPath && this.client) {
      try {
        const result = await this.client.request<{ content: string }>(
          "files.read",
          { path: item.outputPath, maxSize: 500_000 },
        );
        if (result?.content) {
          this.handleOpenSidebar(result.content, {
            mimeType: "text/markdown",
            filePath: item.outputPath,
            title: item.title,
          });
          return;
        }
      } catch (err) {
        console.error("[Inbox] Failed to load output file:", err);
      }
    }

    // Fall back to Proof doc if no output file
    if (item.proofDocSlug) {
      this.handleOpenProofDoc(item.proofDocSlug);
    }
  }

  async handleInboxViewProof(itemId: string) {
    const item = this.inboxItems?.find((i) => i.id === itemId);
    if (!item?.proofDocSlug) return;
    this.handleOpenProofDoc(item.proofDocSlug);
  }

  handleInboxOpenChat(itemId: string) {
    const item = this.inboxItems?.find((i) => i.id === itemId);

    // Project-completion items open the cowork session
    if (item?.type === "project-completion" && (item as any).coworkSessionId) {
      this.setSessionKey((item as any).coworkSessionId);
      this.setTab("chat" as import("./navigation").Tab);
      // Also open Proof doc in sidebar if available
      if (item?.proofDocSlug) {
        void this.handleOpenProofDoc(item.proofDocSlug);
      }
      return;
    }

    if (item?.source.taskId) {
      void this.handleMissionControlOpenTaskSession(item.source.taskId);
      return;
    }
    if (item?.sessionId) {
      this.setSessionKey(item.sessionId);
      this.setTab("chat" as import("./navigation").Tab);
    }
  }

  handleInboxSetScoring(itemId: string | null, score?: number) {
    // Only reset feedback when opening scoring for a different item
    if (itemId !== this.inboxScoringId) {
      this.inboxFeedbackText = "";
    }
    this.inboxScoringId = itemId;
    this.inboxScoringValue = score ?? 7;
  }

  handleInboxFeedbackChange(text: string) {
    this.inboxFeedbackText = text;
  }

  // ── Proof sidebar handlers ──────────────────────────────────

  async handleOpenProofDoc(slug: string) {
    let title = "Proof Document";
    let filePath: string | null = null;
    let viewUrl: string | null = null;
    if (this.client && this.connected) {
      try {
        const result = await this.client.request<{
          title?: string;
          filePath?: string | null;
          viewUrl?: string;
        }>("proof.get", { slug });
        title = result.title?.trim() || title;
        filePath = result.filePath?.trim() || null;
        viewUrl = result.viewUrl?.trim() || null;
      } catch (err) {
        console.warn("[Proof] Failed to resolve document metadata:", err);
      }
    }
    this.sidebarOpen = true;
    this.sidebarMode = "proof";
    this.sidebarProofSlug = slug;
    this.sidebarProofUrl = viewUrl;
    this.sidebarProofHtml = null;
    this.sidebarFilePath = filePath;
    this.sidebarTitle = title;
  }

  handleCloseProofDoc() {
    this.sidebarMode = "resource";
    this.sidebarProofSlug = null;
    this.sidebarProofUrl = null;
    this.sidebarProofHtml = null;
    this.handleCloseSidebar();
  }

  render() {
    return renderApp(this);
  }
}
