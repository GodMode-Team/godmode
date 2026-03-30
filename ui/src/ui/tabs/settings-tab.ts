/**
 * <gm-settings> — Extracted Settings/Config tab component.
 *
 * This is the LARGEST tab extraction from the God Component. It encompasses:
 * config editor, channels, presence/instances, agents, sessions, updates,
 * exec approvals, nodes, cron, skills, trust, guardrails, debug, logs,
 * options, and mission-control.
 *
 * BRIDGE PATTERN: For this first pass, the component uses a `host` property
 * pointing back to the parent GodModeApp. This allows incremental migration
 * of handlers without rewriting all ~48 @state properties and their
 * interconnected logic at once. Over time, state and handlers will be pulled
 * into this component or dedicated controllers.
 */

import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { appContext, type AppContext } from "../context/app-context.js";
import { appEventBus } from "../context/event-bus.js";

// -- Render functions (pure view layers) ------------------------------------
import { renderConfig } from "../views/config.js";
import { renderChannels } from "../views/channels.js";
import { renderInstances } from "../views/instances.js";
import { renderSessions } from "../views/sessions.js";
import { renderCron } from "../views/cron.js";
import { renderSkills } from "../views/skills.js";
import { renderAgents } from "../views/agents.js";
import { renderNodes } from "../views/nodes.js";
import { renderDebug } from "../views/debug.js";
import { renderLogs } from "../views/logs.js";
import { renderTrustTracker } from "../views/trust-tracker.js";
import { renderGuardrails } from "../views/guardrails.js";

// -- Controller loaders (data fetch functions) ------------------------------
import { loadChannels } from "../controllers/channels.js";
import {
  loadConfig,
  loadConfigSchema,
  applyConfig,
  saveConfig,
  runUpdate,
  switchModel,
  updateConfigFormValue,
  removeConfigFormValue,
} from "../controllers/config.js";
import {
  loadCronRuns,
  toggleCronJob,
  runCronJob,
  removeCronJob,
  addCronJob,
  loadCronJobs,
  loadCronStatus,
} from "../controllers/cron.js";
import { loadDebug, callDebugMethod } from "../controllers/debug.js";
import {
  approveDevicePairing,
  loadDevices,
  rejectDevicePairing,
  revokeDeviceToken,
  rotateDeviceToken,
} from "../controllers/devices.js";
import {
  loadExecApprovals,
  removeExecApprovalsFormValue,
  saveExecApprovals,
  updateExecApprovalsFormValue,
} from "../controllers/exec-approvals.js";
import { loadLogs } from "../controllers/logs.js";
import { loadNodes } from "../controllers/nodes.js";
import { loadPresence } from "../controllers/presence.js";
import {
  archiveSession,
  deleteSession,
  loadArchivedSessions,
  loadSessions,
  patchSession,
  triggerAutoArchive,
  unarchiveSession,
} from "../controllers/sessions.js";
import {
  installSkill,
  loadGodModeSkills,
  loadSkills,
  saveSkillApiKey,
  updateSkillEdit,
  updateSkillEnabled,
} from "../controllers/skills.js";
import { loadRoster } from "../controllers/agents.js";
import { loadGuardrails } from "../controllers/guardrails.js";
import {
  getEventLogSnapshot,
  loadSecrets,
  loadWebFetchConfig,
  setWebFetchProvider,
  loadSearchConfig,
  setSearchProvider,
  loadProviderConfig,
  setProviderConfig,
} from "../app-gateway.js";
import { scheduleLogsScroll } from "../app-scroll.js";
import {
  setTab,
  syncUrlWithSessionKey,
} from "../app-settings.js";

// ---------------------------------------------------------------------------
// Settings sub-tab type
// ---------------------------------------------------------------------------

export type SettingsSubtab =
  | "config"
  | "channels"
  | "instances"
  | "sessions"
  | "cron"
  | "skills"
  | "agents"
  | "nodes"
  | "debug"
  | "logs"
  | "trust"
  | "guardrails";

const SETTINGS_SUBTABS: Array<{ id: SettingsSubtab; label: string; group: string }> = [
  // Settings group
  { id: "config", label: "Config", group: "Settings" },
  { id: "skills", label: "Skills", group: "Settings" },
  { id: "agents", label: "Agents", group: "Settings" },
  { id: "trust", label: "Trust", group: "Settings" },
  { id: "guardrails", label: "Guardrails", group: "Settings" },
  // System group
  { id: "channels", label: "Channels", group: "System" },
  { id: "sessions", label: "Sessions", group: "System" },
  { id: "cron", label: "Cron", group: "System" },
  { id: "nodes", label: "Nodes", group: "System" },
  { id: "instances", label: "Instances", group: "System" },
  // Dev group
  { id: "debug", label: "Debug", group: "Dev" },
  { id: "logs", label: "Logs", group: "Dev" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@customElement("gm-settings")
export class GmSettings extends LitElement {
  // -- Shared context (provided by root app) --------------------------------

  @consume({ context: appContext, subscribe: true })
  ctx!: AppContext;

  // -- Bridge: reference to the parent GodModeApp for handler delegation -----
  // This allows us to call handlers that haven't been migrated yet.
  // Over time, these will be pulled into this component or controllers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ attribute: false }) host!: any;

  // -- Owned state ----------------------------------------------------------

  @state() settingsSubtab: SettingsSubtab = "config";
  @state() private _initialized = new Set<SettingsSubtab>();
  @state() private _memoryOfflineSystems: string[] = [];

  // -- Event-bus subscriptions ----------------------------------------------

  private _unsubs: Array<() => void> = [];

  // -- Light DOM (no shadow root) so existing CSS classes work ---------------

  override createRenderRoot() {
    return this;
  }

  // -- Lifecycle ------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();

    this._unsubs.push(
      appEventBus.on("refresh-requested", (payload) => {
        if (payload.target === "settings" || payload.target === this.settingsSubtab) {
          void this._loadSubtab(this.settingsSubtab);
        }
      }),
    );

    // Load data for the initial subtab
    void this._loadSubtab(this.settingsSubtab);

    // Fire-and-forget memory pulse check for offline banner
    void this._checkMemoryStatus();
  }

  override disconnectedCallback() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    super.disconnectedCallback();
  }

  // -- Render ---------------------------------------------------------------

  override render() {
    return html`
      <div class="settings-tab">
        ${this._memoryOfflineSystems.length > 0
          ? html`
            <div class="settings-tab__memory-notice" role="status">
              Memory offline: ${this._memoryOfflineSystems.join(", ")} not connected.
              Check the Memory tab for details.
            </div>`
          : nothing}
        ${this._renderSubtabNav()}
        <div class="settings-tab__content">
          ${this._renderActiveSubtab()}
        </div>
      </div>
    `;
  }

  private _renderSubtabNav() {
    let lastGroup = "";
    return html`
      <nav class="settings-tab__nav" aria-label="Settings sections">
        ${SETTINGS_SUBTABS.map((entry) => {
          const groupHeader =
            entry.group !== lastGroup
              ? html`<span class="settings-tab__group-label" role="separator">${entry.group}</span>`
              : nothing;
          lastGroup = entry.group;
          return html`
            ${groupHeader}
            <button
              class="settings-tab__nav-btn ${this.settingsSubtab === entry.id ? "active" : ""}"
              aria-label="${entry.label} settings"
              aria-current=${this.settingsSubtab === entry.id ? "page" : "false"}
              @click=${() => this._switchSubtab(entry.id)}
            >
              ${entry.label}
            </button>
          `;
        })}
      </nav>
    `;
  }

  // -- Sub-tab rendering (delegates to existing view functions) ---------------

  private _renderActiveSubtab() {
    const s = this.host;
    if (!s) return html`<div class="settings-loading">Loading...</div>`;

    switch (this.settingsSubtab) {
      case "config":
        return renderConfig({
          raw: s.configRaw,
          originalRaw: s.configRawOriginal,
          valid: s.configValid,
          issues: s.configIssues,
          loading: s.configLoading,
          saving: s.configSaving,
          applying: s.configApplying,
          updating: s.updateRunning,
          connected: s.connected,
          schema: s.configSchema,
          schemaLoading: s.configSchemaLoading,
          uiHints: s.configUiHints,
          formMode: s.configFormMode,
          formValue: s.configForm,
          originalValue: s.configFormOriginal,
          searchQuery: s.configSearchQuery,
          activeSection: s.configActiveSection,
          activeSubsection: s.configActiveSubsection,
          onRawChange: (next: string) => {
            s.configRaw = next;
          },
          onFormModeChange: (mode: "form" | "raw") => (s.configFormMode = mode),
          onFormPatch: (path: string[], value: unknown) => updateConfigFormValue(s, path, value),
          onSearchChange: (query: string) => (s.configSearchQuery = query),
          onSectionChange: (section: string | null) => {
            s.configActiveSection = section;
            s.configActiveSubsection = null;
          },
          onSubsectionChange: (section: string | null) => (s.configActiveSubsection = section),
          onReload: () => loadConfig(s),
          onSave: () => saveConfig(s),
          onApply: () => applyConfig(s),
          onUpdate: () => runUpdate(s),
          userName: s.userName || "",
          userAvatar: s.userAvatar,
          onUserProfileUpdate: (name: string, avatar: string | null) =>
            s.handleUpdateUserProfile(name, avatar),
          onModelSwitch: (primary: string, fallbacks?: string[]) =>
            switchModel(s, primary, fallbacks),
          secrets: s.secrets ?? [],
          secretsLoading: s.secretsLoading ?? false,
          onSecretsRefresh: () => loadSecrets(s),
          webFetchProvider: s.webFetchProvider ?? "default",
          webFetchLoading: s.webFetchLoading ?? false,
          onWebFetchChange: (provider: string) => setWebFetchProvider(s, provider),
          searchProvider: s.searchProvider ?? "tavily",
          searchExaConfigured: s.searchExaConfigured ?? false,
          searchTavilyConfigured: s.searchTavilyConfigured ?? false,
          searchLoading: s.searchLoading ?? false,
          onSearchProviderChange: (provider: string) => setSearchProvider(s, provider),
          aiProvider: s.aiProvider ?? "anthropic",
          aiProviderModels: s.aiProviderModels ?? { fast: "", standard: "", primary: "" },
          aiProviderAvailable: s.aiProviderAvailable ?? [],
          aiProviderLoading: s.aiProviderLoading ?? false,
          onProviderChange: (provider: string, models?: Record<string, string>) =>
            setProviderConfig(s, provider, models),
        });

      case "channels":
        return renderChannels({
          connected: s.connected,
          loading: s.channelsLoading,
          snapshot: s.channelsSnapshot,
          lastError: s.channelsError,
          lastSuccessAt: s.channelsLastSuccess,
          whatsappMessage: s.whatsappLoginMessage,
          whatsappQrDataUrl: s.whatsappLoginQrDataUrl,
          whatsappConnected: s.whatsappLoginConnected,
          whatsappBusy: s.whatsappBusy,
          configSchema: s.configSchema,
          configSchemaLoading: s.configSchemaLoading,
          configForm: s.configForm,
          configUiHints: s.configUiHints,
          configSaving: s.configSaving,
          configFormDirty: s.configFormDirty,
          nostrProfileFormState: s.nostrProfileFormState,
          nostrProfileAccountId: s.nostrProfileAccountId,
          onRefresh: (probe: boolean) => loadChannels(s, probe),
          onWhatsAppStart: (force: boolean) => s.handleWhatsAppStart(force),
          onWhatsAppWait: () => s.handleWhatsAppWait(),
          onWhatsAppLogout: () => s.handleWhatsAppLogout(),
          onConfigPatch: (path: string[], value: unknown) => updateConfigFormValue(s, path, value),
          onConfigSave: () => s.handleChannelConfigSave(),
          onConfigReload: () => s.handleChannelConfigReload(),
          onNostrProfileEdit: (accountId: string, profile: unknown) =>
            s.handleNostrProfileEdit(accountId, profile),
          onNostrProfileCancel: () => s.handleNostrProfileCancel(),
          onNostrProfileFieldChange: (field: string, value: unknown) =>
            s.handleNostrProfileFieldChange(field, value),
          onNostrProfileSave: () => s.handleNostrProfileSave(),
          onNostrProfileImport: () => s.handleNostrProfileImport(),
          onNostrProfileToggleAdvanced: () => s.handleNostrProfileToggleAdvanced(),
        });

      case "instances":
        return renderInstances({
          loading: s.presenceLoading,
          entries: s.presenceEntries,
          lastError: s.presenceError,
          statusMessage: s.presenceStatus,
          onRefresh: () => loadPresence(s),
        });

      case "sessions":
        return renderSessions({
          loading: s.sessionsLoading,
          result: s.sessionsResult,
          error: s.sessionsError,
          activeMinutes: s.sessionsFilterActive,
          limit: s.sessionsFilterLimit,
          includeGlobal: s.sessionsIncludeGlobal,
          includeUnknown: s.sessionsIncludeUnknown,
          basePath: s.basePath,
          archivedSessions: s.archivedSessions,
          archivedSessionsLoading: s.archivedSessionsLoading,
          archivedSessionsExpanded: s.archivedSessionsExpanded,
          onFiltersChange: (next: {
            activeMinutes: string;
            limit: string;
            includeGlobal: boolean;
            includeUnknown: boolean;
          }) => {
            s.sessionsFilterActive = next.activeMinutes;
            s.sessionsFilterLimit = next.limit;
            s.sessionsIncludeGlobal = next.includeGlobal;
            s.sessionsIncludeUnknown = next.includeUnknown;
          },
          onRefresh: () => {
            loadSessions(s);
            loadArchivedSessions(s);
          },
          onPatch: async (key: string, patch: Record<string, unknown>) => {
            const result = await patchSession(s, key, patch);
            if (
              result.ok &&
              result.canonicalKey !== key &&
              s.settings.openTabs.includes(key)
            ) {
              const newTabs = s.settings.openTabs.map((t: string) =>
                t === key ? result.canonicalKey : t,
              );
              const wasActive = key === s.sessionKey;
              s.applySettings({
                ...s.settings,
                openTabs: newTabs,
                tabLastViewed: {
                  ...s.settings.tabLastViewed,
                  [result.canonicalKey]: s.settings.tabLastViewed[key] ?? Date.now(),
                },
                ...(wasActive
                  ? {
                      sessionKey: result.canonicalKey,
                      lastActiveSessionKey: result.canonicalKey,
                    }
                  : {}),
              });
              if (wasActive) {
                s.sessionKey = result.canonicalKey;
                syncUrlWithSessionKey(s, result.canonicalKey, true);
              }
            }
          },
          onDelete: (key: string) => deleteSession(s, key),
          onArchive: (key: string) => archiveSession(s, key),
          onUnarchive: (key: string) => unarchiveSession(s, key),
          onToggleArchived: () => {
            s.archivedSessionsExpanded = !s.archivedSessionsExpanded;
            if (s.archivedSessionsExpanded && s.archivedSessions.length === 0) {
              loadArchivedSessions(s);
            }
          },
          onAutoArchive: () => triggerAutoArchive(s),
        });

      case "cron":
        return renderCron({
          loading: s.cronLoading,
          status: s.cronStatus,
          jobs: s.cronJobs,
          error: s.cronError,
          busy: s.cronBusy,
          form: s.cronForm,
          channels: s.channelsSnapshot?.channelMeta?.length
            ? s.channelsSnapshot.channelMeta.map((entry: { id: string }) => entry.id)
            : (s.channelsSnapshot?.channelOrder ?? []),
          channelLabels: s.channelsSnapshot?.channelLabels ?? {},
          channelMeta: s.channelsSnapshot?.channelMeta ?? [],
          runsJobId: s.cronRunsJobId,
          runs: s.cronRuns,
          onFormChange: (patch: Record<string, unknown>) =>
            (s.cronForm = { ...s.cronForm, ...patch }),
          onRefresh: () => s.loadCron(),
          onAdd: () => addCronJob(s),
          onToggle: (job: unknown, enabled: boolean) => toggleCronJob(s, job, enabled),
          onRun: (job: unknown) => runCronJob(s, job),
          onRemove: (job: unknown) => removeCronJob(s, job),
          onLoadRuns: (jobId: string) => loadCronRuns(s, jobId),
        });

      case "skills":
        return renderSkills({
          loading: s.skillsLoading,
          report: s.skillsReport,
          error: s.skillsError,
          filter: s.skillsFilter,
          edits: s.skillEdits,
          messages: s.skillMessages,
          busyKey: s.skillsBusyKey,
          subTab: s.skillsSubTab,
          godmodeSkills: s.godmodeSkills ?? null,
          godmodeSkillsLoading: s.godmodeSkillsLoading ?? false,
          expandedSkills: s.expandedSkills ?? new Set(),
          onFilterChange: (next: string) => (s.skillsFilter = next),
          onRefresh: () => {
            loadSkills(s, { clearMessages: true });
            loadGodModeSkills(s);
          },
          onToggle: (key: string, enabled: boolean) => updateSkillEnabled(s, key, enabled),
          onEdit: (key: string, value: string) => updateSkillEdit(s, key, value),
          onSaveKey: (key: string) => saveSkillApiKey(s, key),
          onInstall: (skillKey: string, name: string, installId: string) =>
            installSkill(s, skillKey, name, installId),
          onSubTabChange: (tab: "godmode" | "my-skills") => {
            s.skillsSubTab = tab;
            if (tab === "godmode" && !s.godmodeSkills) {
              loadGodModeSkills(s);
            }
          },
          onToggleExpand: (slug: string) => {
            const next = new Set(s.expandedSkills);
            if (next.has(slug)) {
              next.delete(slug);
            } else {
              next.add(slug);
            }
            s.expandedSkills = next;
          },
        });

      case "agents":
        return renderAgents({
          loading: s.rosterLoading,
          error: s.rosterError,
          roster: s.rosterData ?? [],
          filter: s.rosterFilter ?? "",
          expandedAgents: s.expandedAgents ?? new Set(),
          onFilterChange: (next: string) => (s.rosterFilter = next),
          onRefresh: () => loadRoster(s),
          onToggleExpand: (slug: string) => {
            const next = new Set(s.expandedAgents);
            if (next.has(slug)) {
              next.delete(slug);
            } else {
              next.add(slug);
            }
            s.expandedAgents = next;
          },
        });

      case "nodes":
        return renderNodes({
          loading: s.nodesLoading,
          nodes: s.nodes,
          devicesLoading: s.devicesLoading,
          devicesError: s.devicesError,
          devicesList: s.devicesList,
          configForm:
            s.configForm ??
            (s.configSnapshot?.config as Record<string, unknown> | null),
          configLoading: s.configLoading,
          configSaving: s.configSaving,
          configDirty: s.configFormDirty,
          configFormMode: s.configFormMode,
          execApprovalsLoading: s.execApprovalsLoading,
          execApprovalsSaving: s.execApprovalsSaving,
          execApprovalsDirty: s.execApprovalsDirty,
          execApprovalsSnapshot: s.execApprovalsSnapshot,
          execApprovalsForm: s.execApprovalsForm,
          execApprovalsSelectedAgent: s.execApprovalsSelectedAgent,
          execApprovalsTarget: s.execApprovalsTarget,
          execApprovalsTargetNodeId: s.execApprovalsTargetNodeId,
          onRefresh: () => loadNodes(s),
          onDevicesRefresh: () => loadDevices(s),
          onDeviceApprove: (requestId: string) => approveDevicePairing(s, requestId),
          onDeviceReject: (requestId: string) => rejectDevicePairing(s, requestId),
          onDeviceRotate: (deviceId: string, role: string, scopes: string[]) =>
            rotateDeviceToken(s, { deviceId, role, scopes }),
          onDeviceRevoke: (deviceId: string, role: string) =>
            revokeDeviceToken(s, { deviceId, role }),
          onLoadConfig: () => loadConfig(s),
          onLoadExecApprovals: () => {
            const target =
              s.execApprovalsTarget === "node" && s.execApprovalsTargetNodeId
                ? { kind: "node" as const, nodeId: s.execApprovalsTargetNodeId }
                : { kind: "gateway" as const };
            return loadExecApprovals(s, target);
          },
          onBindDefault: (nodeId: string | null) => {
            if (nodeId) {
              updateConfigFormValue(s, ["tools", "exec", "node"], nodeId);
            } else {
              removeConfigFormValue(s, ["tools", "exec", "node"]);
            }
          },
          onBindAgent: (agentIndex: number, nodeId: string | null) => {
            const basePath = ["agents", "list", agentIndex, "tools", "exec", "node"];
            if (nodeId) {
              updateConfigFormValue(s, basePath, nodeId);
            } else {
              removeConfigFormValue(s, basePath);
            }
          },
          onSaveBindings: () => saveConfig(s),
          onExecApprovalsTargetChange: (kind: "gateway" | "node", nodeId?: string) => {
            s.execApprovalsTarget = kind;
            s.execApprovalsTargetNodeId = nodeId ?? null;
            s.execApprovalsSnapshot = null;
            s.execApprovalsForm = null;
            s.execApprovalsDirty = false;
            s.execApprovalsSelectedAgent = null;
          },
          onExecApprovalsSelectAgent: (agentId: string) => {
            s.execApprovalsSelectedAgent = agentId;
          },
          onExecApprovalsPatch: (path: string[], value: unknown) =>
            updateExecApprovalsFormValue(s, path, value),
          onExecApprovalsRemove: (path: string[]) =>
            removeExecApprovalsFormValue(s, path),
          onSaveExecApprovals: () => {
            const target =
              s.execApprovalsTarget === "node" && s.execApprovalsTargetNodeId
                ? { kind: "node" as const, nodeId: s.execApprovalsTargetNodeId }
                : { kind: "gateway" as const };
            return saveExecApprovals(s, target);
          },
        });

      case "trust": {
        const sessionsCount = s.sessionsResult?.sessions?.length ?? 0;
        return renderTrustTracker({
          connected: s.connected,
          loading: s.trustTrackerLoading,
          data: s.trustTrackerData,
          onAddWorkflow: (w: string) => s.handleTrustAddWorkflow(w),
          onRemoveWorkflow: (w: string) => s.handleTrustRemoveWorkflow(w),
          onRefresh: () => s.handleTrustLoad(),
          guardrailsData: s.guardrailsData,
          consciousnessStatus: s.consciousnessStatus,
          sessionsCount,
          gatewayUptimeMs:
            (s.hello?.snapshot as { uptimeMs?: number } | undefined)?.uptimeMs ?? null,
          onDailyRate: (rating: number, note?: string) => s.handleDailyRate(rating, note),
          updateStatus: s.updateStatus
            ? {
                openclawUpdateAvailable: s.updateStatus.openclawUpdateAvailable,
                pluginUpdateAvailable: s.updateStatus.pluginUpdateAvailable,
                openclawVersion: s.updateStatus.openclawVersion,
                pluginVersion: s.updateStatus.pluginVersion,
                openclawLatest: s.updateStatus.openclawLatest,
                pluginLatest: s.updateStatus.pluginLatest,
              }
            : null,
        });
      }

      case "guardrails":
        return renderGuardrails({
          connected: s.connected,
          loading: s.guardrailsLoading,
          data: s.guardrailsData,
          showAddForm: s.guardrailsShowAddForm,
          onToggle: (gateId: string, enabled: boolean) =>
            s.handleGuardrailToggle(gateId, enabled),
          onThresholdChange: (gateId: string, key: string, value: number) =>
            s.handleGuardrailThresholdChange(gateId, key, value),
          onRefresh: () => s.handleGuardrailsLoad(),
          onCustomToggle: (id: string, enabled: boolean) =>
            s.handleCustomGuardrailToggle(id, enabled),
          onCustomDelete: (id: string) => s.handleCustomGuardrailDelete(id),
          onCustomAdd: (input: unknown) => s.handleCustomGuardrailAdd(input),
          onToggleAddForm: () => s.handleToggleGuardrailAddForm(),
          onOpenAllyChat: (prefill?: string) => {
            s.handleAllyToggle();
            if (prefill) s.handleAllyDraftChange(prefill);
          },
        });

      case "debug":
        return renderDebug({
          loading: s.debugLoading,
          status: s.debugStatus,
          health: s.debugHealth,
          models: s.debugModels,
          heartbeat: s.debugHeartbeat,
          eventLog: s.eventLog,
          callMethod: s.debugCallMethod,
          callParams: s.debugCallParams,
          callResult: s.debugCallResult,
          callError: s.debugCallError,
          onCallMethodChange: (next: string) => (s.debugCallMethod = next),
          onCallParamsChange: (next: string) => (s.debugCallParams = next),
          onRefresh: () => loadDebug(s),
          onCall: () => callDebugMethod(s),
        });

      case "logs":
        return renderLogs({
          loading: s.logsLoading,
          error: s.logsError,
          file: s.logsFile,
          entries: s.logsEntries,
          filterText: s.logsFilterText,
          levelFilters: s.logsLevelFilters,
          autoFollow: s.logsAutoFollow,
          truncated: s.logsTruncated,
          onFilterTextChange: (next: string) => (s.logsFilterText = next),
          onLevelToggle: (level: string, enabled: boolean) => {
            s.logsLevelFilters = { ...s.logsLevelFilters, [level]: enabled };
          },
          onToggleAutoFollow: (next: boolean) => (s.logsAutoFollow = next),
          onRefresh: () => loadLogs(s, { reset: true }),
          onExport: (lines: unknown[], label: string) => s.exportLogs(lines, label),
          onScroll: (event: Event) => s.handleLogsScroll(event),
        });

      default:
        return html`<div class="settings-empty">Select a settings section</div>`;
    }
  }

  // -- Memory status check --------------------------------------------------

  private async _checkMemoryStatus(): Promise<void> {
    try {
      if (!this.ctx?.gateway) return;
      type PulseSystem = { name: string; status: string };
      type PulseData = { systems: PulseSystem[] };
      const pulse = await this.ctx.gateway.request<PulseData>("secondBrain.memoryPulse", {});
      if (pulse?.systems) {
        this._memoryOfflineSystems = pulse.systems
          .filter((s: PulseSystem) => s.status === "offline")
          .map((s: PulseSystem) => s.name);
      }
    } catch {
      // Non-fatal — banner just won't show
    }
  }

  // -- Sub-tab switching + data loading -------------------------------------

  private _switchSubtab(subtab: SettingsSubtab): void {
    if (this.settingsSubtab === subtab) return;
    this.settingsSubtab = subtab;
    void this._loadSubtab(subtab);
  }

  private async _loadSubtab(subtab: SettingsSubtab): Promise<void> {
    const s = this.host;
    if (!s || !this.ctx.connected) return;

    try {
      switch (subtab) {
        case "config":
          await Promise.all([
            loadConfigSchema(s),
            loadConfig(s),
            loadSecrets(s),
            loadWebFetchConfig(s),
            loadSearchConfig(s),
            loadProviderConfig(s),
          ]);
          break;
        case "channels":
          await Promise.all([
            loadChannels(s, true),
            loadConfigSchema(s),
            loadConfig(s),
          ]);
          break;
        case "instances":
          await loadPresence(s);
          break;
        case "sessions":
          await loadSessions(s);
          await loadArchivedSessions(s);
          break;
        case "cron":
          await Promise.all([
            loadChannels(s, false),
            loadCronStatus(s),
            loadCronJobs(s),
          ]);
          break;
        case "skills":
          await loadSkills(s);
          await loadGodModeSkills(s);
          break;
        case "agents":
          await loadRoster(s);
          break;
        case "nodes":
          await Promise.all([
            loadNodes(s),
            loadDevices(s),
            loadConfig(s),
          ]);
          break;
        case "trust":
          await Promise.all([
            typeof s.handleTrustLoad === "function" ? s.handleTrustLoad() : Promise.resolve(),
            loadGuardrails(s),
            loadSessions(s),
          ]);
          break;
        case "guardrails":
          if (typeof s.handleGuardrailsLoad === "function") {
            await s.handleGuardrailsLoad();
          }
          break;
        case "debug":
          await loadDebug(s);
          s.eventLog = getEventLogSnapshot();
          break;
        case "logs":
          s.logsAtBottom = true;
          await loadLogs(s, { reset: true });
          scheduleLogsScroll(s, true);
          break;
      }
    } catch (err) {
      console.error(`[Settings] Failed to load subtab "${subtab}":`, err);
    }

    this._initialized.add(subtab);
  }
}

// ---------------------------------------------------------------------------
// Global tag declaration
// ---------------------------------------------------------------------------

declare global {
  interface HTMLElementTagNameMap {
    "gm-settings": GmSettings;
  }
}
