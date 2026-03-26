import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { appContext, type AppContext, createDefaultAppContext } from "./context/app-context.js";
import { appEventBus } from "./context/event-bus.js";
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
import {
  type LightboxImage,
  type LightboxState,
  createLightboxState,
  openLightbox,
  closeLightbox,
  lightboxNav,
} from "./chat/lightbox";
import { loadAssistantIdentity as loadAssistantIdentityInternal } from "./controllers/assistant-identity";
import type { AllyChatMessage } from "./views/ally-chat.js";
import type { DecisionCardItem } from "./tabs/today-tab.js";
import { ALLY_SESSION_KEY, buildAllyContext } from "./controllers/ally.js";
import type { DevicePairingList } from "./controllers/devices";
import type { ExecApprovalRequest } from "./controllers/exec-approval";
import type { ExecApprovalsFile, ExecApprovalsSnapshot } from "./controllers/exec-approvals";
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
  @provide({ context: appContext })
  @state() _ctx: AppContext = createDefaultAppContext();

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

  @state() currentModel: string | null = null;
  @state() availableModels: { id: string; name: string; provider: string }[] = [];
  @state() modelPickerOpen = false;
  @state() modelCacheTs = 0;

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
  @state() navDrawerOpen = false;
  closeNavDrawer = () => { this.navDrawerOpen = false; };
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
  @state() deployPanelOpen = false;

  @state() configLoading = false;
  @state() configRaw = "{\n}\n";
  @state() configRawOriginal = "";
  @state() configValid: boolean | null = null;
  @state() configIssues: unknown[] = [];
  @state() configSaving = false;
  @state() configApplying = false;
  @state() updateRunning = false;
  @state() pluginUpdateRunning = false;
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
  @state() onboardingPhase: number = 0;
  @state() onboardingData: Record<string, unknown> | null = null;
  @state() onboardingActive = false;

  // Memory onboarding wizard state
  @state() wizardActive = false;
  @state() wizardState: import("./views/onboarding-wizard").WizardState | null = null;

  // Setup tab state (80/20 fast onboarding)
  @state() showSetupTab = false;
  // Setup bar state (sidebar onboarding stepper)
  @state() setupBarDismissed = false;
  @state() setupProgress: import("./views/setup-bar").SetupProgress | null = null;
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

  // Ally side-chat state
  @state() allyPanelOpen = false;
  @state() allyMessages: AllyChatMessage[] = [];
  @state() allyStream: string | null = null;
  @state() allyDraft = "";
  @state() allyUnread = 0;
  @state() allySending = false;
  @state() allyWorking = false;
  @state() allyAttachments: import("./ui-types").ChatAttachment[] = [];
  @state() chatPrivateMode = false;
  /** Maps private session keys → expiry timestamp (ms). Ephemeral sessions auto-delete. */
  @state() privateSessions: Map<string, number> = new Map();
  private _privateSessionTimer: ReturnType<typeof setInterval> | null = null;

  // Dynamic HTML slots (AI-generated tab content)
  @state() dynamicSlots: Record<string, string> = {};

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
  @state() skillsSubTab: "godmode" | "my-skills" = "godmode";
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
  @state() private chatUserNearBottom = true;
  private chatIsAutoScrolling = false;
  @state() private chatNewMessagesBelow = false;
  @state() consciousnessStatus: "idle" | "loading" | "ok" | "error" = "idle";

  // Trust Tracker state
  @state() trustTrackerData: TrustTrackerData | null = null;
  @state() trustTrackerLoading = false;

  // Guardrails state
  @state() guardrailsData: GuardrailsViewData | null = null;
  @state() guardrailsLoading = false;
  @state() guardrailsShowAddForm = false;

  // ── Secrets / WebFetch / Search provider config ─────────────────
  @state() secrets: string[] = [];
  @state() secretsLoading = false;
  @state() webFetchProvider: string = "default";
  @state() webFetchLoading = false;
  @state() searchProvider: string = "tavily";
  @state() searchExaConfigured = false;
  @state() searchTavilyConfigured = false;
  @state() searchLoading = false;

  // Custom tabs state
  @state() customTabs: Array<import("./views/custom-tab-renderer").CustomTabManifest> = [];
  @state() customTabData: Record<string, unknown> = {};
  @state() customTabLoading = false;
  @state() customTabErrors: Record<string, string> = {};

  /** Stashed session key to restore when leaving an active dashboard */
  dashboardPreviousSessionKey: string | null = null;

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

    // Start meeting notifications (polls every 60s, fires toast 15 min before)
    startMeetingNotifications(this);

    // Restore tracked private sessions from localStorage (expire stale ones)
    this._restorePrivateSessions();

    // Listen for cross-tab chat navigation (e.g. "Create via Chat" from dashboards)
    this._eventBusUnsubs.push(
      appEventBus.on("chat-navigate", (payload) => {
        if (payload.sessionKey && payload.sessionKey !== this.sessionKey) {
          if (payload.sessionKey === "new") {
            // Generate a fresh session key for new sessions
            this.sessionKey = `webchat-${Date.now()}`;
          } else {
            this.sessionKey = payload.sessionKey;
          }
        }
        if (payload.tab === "chat") {
          this.setTab("chat");
        }
        if (payload.message) {
          this.chatMessage = payload.message;
        }
      }),
    );
  }

  private _eventBusUnsubs: Array<() => void> = [];

  protected firstUpdated() {
    handleFirstUpdated(this as unknown as Parameters<typeof handleFirstUpdated>[0]);
  }

  disconnectedCallback() {
    stopMeetingNotifications();
    this._stopPrivateSessionTimer();
    for (const unsub of this._eventBusUnsubs) unsub();
    this._eventBusUnsubs = [];
    handleDisconnected(this as unknown as Parameters<typeof handleDisconnected>[0]);
    super.disconnectedCallback();
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    handleUpdated(this as unknown as Parameters<typeof handleUpdated>[0], changed);
    this._syncContext();
  }

  private _syncContext() {
    const prev = this._ctx;
    // Only update if scalar values actually changed to avoid infinite re-render loop
    if (
      prev.connected === this.connected &&
      prev.reconnecting === this.reconnecting &&
      prev.sessionKey === this.sessionKey &&
      prev.assistantName === this.assistantName &&
      prev.assistantAvatar === this.assistantAvatar &&
      prev.userName === this.userName &&
      prev.userAvatar === this.userAvatar &&
      prev.theme === this.theme &&
      prev.themeResolved === this.themeResolved &&
      prev.settings === this.settings &&
      prev.basePath === this.basePath &&
      prev.gateway === this.client
    ) {
      return;
    }
    this._ctx = {
      connected: this.connected,
      reconnecting: this.reconnecting,
      sessionKey: this.sessionKey,
      assistantName: this.assistantName,
      assistantAvatar: this.assistantAvatar,
      userName: this.userName,
      userAvatar: this.userAvatar,
      theme: this.theme,
      themeResolved: this.themeResolved,
      settings: this.settings,
      basePath: this.basePath,
      gateway: this.client,
      send: (method: string, params?: unknown) =>
        this.client?.request(method, params) ?? Promise.reject(new Error("Not connected")),
      setTab: (tab) => this.setTab(tab),
      addToast: (message: string, variant?: string) =>
        this.showToast(message, (variant as "success" | "error" | "warning" | "info") ?? "info"),
      openSidebar: (opts) =>
        this.handleOpenSidebar(opts.content, {
          title: opts.title,
          mimeType: opts.mimeType,
          filePath: opts.filePath,
        }),
      closeSidebar: () => this.handleCloseSidebar(),
    };
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

  // Task session helpers (kept for queue/today tab — originally part of Mission Control)
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

  async handleHitlAction(checkpointId: string, action: string, modifiedInstructions?: string) {
    if (!this.client) return;
    try {
      await this.client.request("queue.hitl.respond", {
        checkpointId,
        action,
        modifiedInstructions,
      });
      // Remove the checkpoint from local state
      const hitlSelf = this as unknown as { hitlCheckpoints?: Array<Record<string, unknown>> };
      if (hitlSelf.hitlCheckpoints) {
        hitlSelf.hitlCheckpoints = hitlSelf.hitlCheckpoints.filter(
          (cp) => cp.id !== checkpointId,
        );
      }
      const actionLabel = action === "continue" ? "Approved" : action === "abort" ? "Aborted" : "Modified";
      this.showToast(`Checkpoint ${actionLabel.toLowerCase()}`, "success", 2000);
      this.requestUpdate();
    } catch (e) {
      console.error("[HITL] Respond failed:", e);
      this.showToast("Failed to respond to checkpoint", "error");
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
    } catch {
      this.showToast("Failed to add to queue", "error");
    }
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
    // Compaction is handled by OC core — no UI-side intercept needed.
    // OC will auto-compact when context pressure is critical.

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

  handleDeployPanelToggle() {
    this.deployPanelOpen = !this.deployPanelOpen;
  }

  async handleDeployDismiss() {
    if (!this.client) return;
    try {
      await this.client.request("godmode.deploy.dismiss");
    } catch {
      // Best effort — file may already be gone
    }
    this.deployPanelOpen = false;
    // Clear pendingDeploy from local state
    if (this.updateStatus) {
      this.updateStatus = { ...this.updateStatus, pendingDeploy: null };
    }
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

  async handleOpenFile(filePath: string, fallbackContent?: string) {
    if (!this.client || !this.connected) {
      // When gateway is unavailable, use fallback content if provided
      // (tool cards carry the file content in the message text)
      if (fallbackContent) {
        const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
        const FORCED_MIME: Record<string, string> = {
          md: "text/markdown", markdown: "text/markdown", mdx: "text/markdown",
          json: "application/json", json5: "application/json",
          yaml: "text/yaml", yml: "text/yaml",
          csv: "text/csv", tsv: "text/tab-separated-values",
          html: "text/html", htm: "text/html",
        };
        const mime = FORCED_MIME[ext] ?? null;
        const title = filePath.split("/").pop() ?? filePath;
        this.showToast("Opening cached version (gateway offline)", "warning");
        this.handleOpenSidebar(fallbackContent, { mimeType: mime, filePath, title });
        return;
      }
      this.showToast("Not connected to gateway", "error");
      return;
    }

    let resolvedPath = filePath;

    // If the path looks like a bare filename (no slashes, no ~ prefix), resolve it first
    if (!filePath.includes("/") && !filePath.includes("\\") && !filePath.startsWith("~")) {
      try {
        const resolved = await this.client.request<{ path: string; size: number }>(
          "files.resolve",
          { filename: filePath },
        );
        resolvedPath = resolved.path;
      } catch {
        // Resolution failed — fall through and try files.read with original path
        // (it will likely fail too, but gives a consistent error)
      }
    }

    try {
      const result = await this.client.request<{
        content: string;
        size: number;
        truncated: boolean;
        mime?: string;
        contentType?: string;
      }>("files.read", { path: resolvedPath });

      const ext = resolvedPath.split(".").pop()?.toLowerCase() ?? "";
      // Force correct MIME for known text-based extensions regardless of what
      // the gateway reports (it may default to application/octet-stream).
      const FORCED_MIME: Record<string, string> = {
        md: "text/markdown", markdown: "text/markdown", mdx: "text/markdown",
        json: "application/json", json5: "application/json",
        yaml: "text/yaml", yml: "text/yaml",
        csv: "text/csv", tsv: "text/tab-separated-values",
        html: "text/html", htm: "text/html",
      };
      const mime = FORCED_MIME[ext] ?? result.contentType ?? result.mime ?? null;
      const title = resolvedPath.split("/").pop() ?? resolvedPath;

      this.handleOpenSidebar(result.content, {
        mimeType: mime,
        filePath: resolvedPath,
        title,
      });
      if (result.truncated) {
        this.showToast(`Opened truncated file: ${title}`, "warning");
      }
    } catch (err) {
      console.error("[Chat] Failed to open file via gateway:", err);

      // Fallback 1: Try HTTP artifact endpoint for inbox files
      const inboxMatch = resolvedPath.match(/\/inbox\/([^/]+)$/);
      if (inboxMatch) {
        try {
          const resp = await fetch(`${this.basePath}/godmode/artifacts/${encodeURIComponent(inboxMatch[1])}`);
          if (resp.ok) {
            const content = await resp.text();
            const ext = resolvedPath.split(".").pop()?.toLowerCase() ?? "";
            const FALLBACK_MIME: Record<string, string> = {
              md: "text/markdown", markdown: "text/markdown", mdx: "text/markdown",
              json: "application/json", yaml: "text/yaml", yml: "text/yaml",
              csv: "text/csv", html: "text/html", htm: "text/html",
            };
            const mime = FALLBACK_MIME[ext] ?? resp.headers.get("content-type") ?? null;
            const title = resolvedPath.split("/").pop() ?? resolvedPath;
            this.handleOpenSidebar(content, { mimeType: mime, filePath: resolvedPath, title });
            return;
          }
        } catch {
          // Fall through to fallback content or error
        }
      }

      // Fallback 2: Use cached content from tool result if available
      if (fallbackContent) {
        const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
        const FALLBACK_MIME: Record<string, string> = {
          md: "text/markdown", markdown: "text/markdown", mdx: "text/markdown",
          json: "application/json", yaml: "text/yaml", yml: "text/yaml",
          csv: "text/csv", html: "text/html", htm: "text/html",
        };
        const mime = FALLBACK_MIME[ext] ?? null;
        const title = filePath.split("/").pop() ?? filePath;
        this.showToast("Opening cached version (file read failed)", "warning");
        this.handleOpenSidebar(fallbackContent, { mimeType: mime, filePath, title });
        return;
      }

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

    // Handle godmode-file:// URLs — bare filenames wrapped by linkifyFilePaths (BUG-009)
    if (href.startsWith("godmode-file://")) {
      let filename = href.slice("godmode-file://".length);
      try { filename = decodeURIComponent(filename); } catch { /* keep as-is */ }
      candidates.push(filename);
      return candidates;
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
      await (await import("./controllers/chat.js")).loadChatHistory(this);
      const { scheduleChatScroll } = await import("./app-scroll.js");
      scheduleChatScroll(this as unknown as Parameters<typeof scheduleChatScroll>[0], true);
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

  // Work tab handlers

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
        resources: Array<{ id: string; title: string; type: string; path?: string; url?: string; sessionKey: string; proofSlug?: string }>;
      }>("resources.list", { sessionKey: this.sessionKey, limit: 20 });
      const resources = result.resources ?? [];

      // Also scan chat messages for proof docs not in the registry
      const proofSlugs = new Set(resources.filter(r => r.proofSlug).map(r => r.proofSlug));
      if (this.chatMessages?.length) {
        for (const msg of this.chatMessages) {
          const m = msg as Record<string, unknown>;
          const content = Array.isArray(m.content) ? m.content : [];
          for (const block of content as Array<Record<string, unknown>>) {
            const text = typeof block.text === "string" ? block.text : typeof block.content === "string" ? block.content : null;
            if (!text) continue;
            try {
              const parsed = JSON.parse(text) as { _sidebarAction?: { type?: string; slug?: string }; title?: string; filePath?: string };
              if (parsed._sidebarAction?.type === "proof" && parsed._sidebarAction.slug && !proofSlugs.has(parsed._sidebarAction.slug)) {
                proofSlugs.add(parsed._sidebarAction.slug);
                resources.unshift({
                  id: `proof:${parsed._sidebarAction.slug}`,
                  title: parsed.title ?? "Proof Document",
                  type: "doc",
                  path: parsed.filePath,
                  sessionKey: this.sessionKey,
                  proofSlug: parsed._sidebarAction.slug,
                });
              }
            } catch { /* not JSON */ }
          }
        }
      }

      this.sessionResources = resources;
    } catch (err) {
      console.warn("[SessionResources] load failed:", err);
      this.sessionResources = [];
    }
  }

  handleSessionResourceClick(resource: { path?: string; url?: string; proofSlug?: string }) {
    if ((resource as any).proofSlug) {
      void this.handleOpenProofDoc((resource as any).proofSlug);
    } else if (resource.path) {
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
  async handleOnboardingIdentitySubmit(identity: { name: string; mission: string; emoji: string }) {
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
    const nextPhase = Math.min(this.onboardingPhase + 1, 6) as number;
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

  // ── Setup bar handlers (sidebar onboarding stepper) ──────────

  continueSetup() {
    const currentStep = this.setupProgress?.currentStep ?? "welcome";
    this._navigateToSetupStep(currentStep);
  }

  dismissSetup() {
    this.setupBarDismissed = true;
    void import("./controllers/setup.js").then(({ dismissSetupBar }) => dismissSetupBar(this));
  }

  handleSetupStepClick(stepId: string) {
    this._navigateToSetupStep(stepId);
  }

  /** Load setup progress from the unified RPC endpoint */
  async loadSetupProgress() {
    const mod = await import("./controllers/setup.js");
    await mod.loadSetupProgress(this);
  }

  private _navigateToSetupStep(stepId: string) {
    const prompts: Record<string, string> = {
      "welcome": "Let's get started! What should I call you?",
      "api-key": "Help me connect my Anthropic API key so you can work at full power.",
      "memory": "Help me set up persistent memory with Honcho so you remember our conversations.",
      "integrations": "Help me connect my tools via Composio — starting with Google and GitHub.",
      "screenpipe": "Enable ambient memory so you can recall what I've been working on from my screen and audio.",
      "second-brain": "Help me link my Obsidian vault to my Memory.",
    };
    const prompt = prompts[stepId] ?? "Help me continue setting up GodMode.";
    this.handleStartChatWithPrompt(prompt);
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
      this.showSetupTab = false;
      this.setTab("chat" as import("./navigation").Tab);
    } catch (err) {
      console.error("[onboarding] Failed to mark complete:", err);
    }
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
