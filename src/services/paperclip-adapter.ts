/**
 * Paperclip Adapter — Thin bridge between Paperclip and GodMode.
 *
 * Paperclip runs as a sidecar (embedded Postgres, port 3100).
 * We communicate via its REST API. The ONLY things this adapter adds:
 *   1. Maps GodMode persona roster → Paperclip agents
 *   2. Creates a Proof doc per issue (our writing/review surface)
 *   3. Polls for issue completion → surfaces results to Prosper
 *
 * Everything else — scheduling, heartbeats, agent execution, task routing —
 * is Paperclip-native. We don't rebuild it. (P9: Conduct, don't rebuild.)
 */

import type { PersonaProfile } from "../lib/agent-roster.js";
import { loadRoster } from "../lib/agent-roster.js";
import { createProofDocument } from "../lib/proof-bridge.js";
import { isProofRunning } from "./proof-server.js";
import { DATA_DIR } from "../data-paths.js";
import fs from "node:fs/promises";
import path from "node:path";
import { homedir } from "node:os";

// ── Types ────────────────────────────────────────────────────────────

type Logger = { info(m: string): void; warn(m: string): void; error(m: string): void };

type PaperclipRole =
  | "ceo" | "cto" | "cmo" | "cfo"
  | "engineer" | "designer" | "pm" | "qa"
  | "devops" | "researcher" | "general";

/** Maps GodMode persona categories → Paperclip agent roles */
const CATEGORY_TO_ROLE: Record<string, PaperclipRole> = {
  engineering: "engineer",
  design: "designer",
  marketing: "cmo",
  creative: "general",
  research: "researcher",
  ops: "devops",
  qa: "qa",
  pm: "pm",
};

const TASK_TYPE_TO_ROLE: Record<string, PaperclipRole> = {
  coding: "engineer",
  creative: "designer",
  research: "researcher",
  review: "qa",
  analysis: "qa",
  ops: "devops",
};

// Paperclip API response shapes (only the fields we use)
interface PcCompany { id: string; name: string; status: string }
interface PcAgent { id: string; companyId: string; name: string; role: PaperclipRole; status: string }
interface PcProject { id: string; name: string; status: string; leadAgentId?: string | null }
interface PcIssue { id: string; title: string; status: string; priority: string; assigneeAgentId?: string | null }

/** Heartbeat run record from Paperclip */
interface PcRun {
  id: string;
  status: string;
  exitCode?: number | null;
  stdoutExcerpt?: string;
  resultJson?: { summary?: string; [k: string]: unknown };
  usageJson?: { inputTokens?: number; outputTokens?: number; cachedTokens?: number } | null;
  finishedAt?: string;
}

/** Enriched run data passed to completion callbacks */
export interface PcRunData {
  runId: string;
  exitCode: number | null;
  outputPreview: string;
  outputPath: string;
  proofDocSlug?: string;
  cost: PcRun["usageJson"];
}

/** Gateway connection details resolved from ~/.openclaw/config.json */
interface GatewayAuth {
  url: string;
  authToken: string;
}

/** Persisted bridge state (persona↔agent mapping + project↔Proof doc mapping) */
interface BridgeState {
  companyId: string | null;
  agents: Array<{ paperclipId: string; personaSlug: string; role: PaperclipRole }>;
  adapterConfigured?: boolean; // true once agents have been configured with gateway adapter
  projects: Array<{
    projectId: string;
    title: string;
    proofWorkspace: string;
    issues: Array<{
      issueId: string;
      title: string;
      personaSlug: string;
      proofDocSlug?: string;
    }>;
    createdAt: string;
  }>;
}

export interface ProjectBrief {
  title: string;
  description: string;
  issues: Array<{
    title: string;
    description: string;
    personaHint?: string;
    priority?: "critical" | "high" | "medium" | "low";
  }>;
}

export interface ProjectStatus {
  projectId: string;
  title: string;
  status: string;
  proofWorkspace: string;
  issues: Array<{
    title: string;
    status: string;
    assignee: string;
    proofDocSlug?: string;
  }>;
}

// ── Singleton ────────────────────────────────────────────────────────

let instance: PaperclipAdapter | null = null;

export function getPaperclipAdapter(): PaperclipAdapter | null {
  return instance;
}

export function isPaperclipRunning(): boolean {
  return instance?.isRunning() ?? false;
}

// ── Adapter ──────────────────────────────────────────────────────────

const STATE_FILE = path.join(DATA_DIR, "paperclip-bridge.json");
const POLL_INTERVAL_MS = 60_000; // Check for completed issues every 60s

export class PaperclipAdapter {
  private apiUrl = "";
  private logger: Logger;
  private running = false;
  private server: { server: unknown; host: string; listenPort: number; apiUrl: string; databaseUrl: string } | null = null;
  private state: BridgeState = { companyId: null, agents: [], projects: [] };
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private onCompletionCallback: ((projectId: string, issueTitle: string, status: string, runData?: PcRunData) => void) | null = null;
  private notifiedIssues = new Set<string>();
  private static MAX_NOTIFIED = 2_000;
  private statusCache = new Map<string, { data: ProjectStatus; ts: number }>();
  private static STATUS_TTL = 30_000; // 30s cache for getStatus

  constructor(logger: Logger) {
    this.logger = logger;
  }

  isRunning(): boolean {
    return this.running;
  }

  // ── Gateway Auth Resolution ──────────────────────────────────────

  /**
   * Resolve WebSocket URL and auth token for the OpenClaw gateway.
   * Reads from ~/.openclaw/config.json, falls back to env vars.
   */
  private async resolveGatewayWsUrl(): Promise<GatewayAuth | null> {
    // Try env vars first (explicit override)
    const envPort = process.env.OPENCLAW_GATEWAY_PORT;
    const envToken = process.env.OPENCLAW_GATEWAY_TOKEN;
    if (envPort && envToken) {
      return { url: `ws://127.0.0.1:${envPort}/ws`, authToken: envToken };
    }

    // Read from ~/.openclaw/config.json
    try {
      const configPath = path.join(
        process.env.OPENCLAW_STATE_DIR || path.join(homedir(), ".openclaw"),
        "config.json",
      );
      const raw = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(raw);
      const port = config?.gateway?.port ?? 18789;
      const token = config?.gateway?.auth?.token;
      if (!token) {
        this.logger.warn("[Paperclip] No gateway.auth.token in config.json");
        return null;
      }
      return { url: `ws://127.0.0.1:${port}/ws`, authToken: token };
    } catch (err) {
      this.logger.warn(`[Paperclip] Failed to resolve gateway auth: ${String(err)}`);
      return null;
    }
  }

  /** Register a callback for when issues complete (used by context injection) */
  onCompletion(cb: (projectId: string, issueTitle: string, status: string, runData?: PcRunData) => void): void {
    this.onCompletionCallback = cb;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────

  async init(): Promise<boolean> {
    try {
      const serverModule = await import("@paperclipai/server" as string) as {
        startServer: () => Promise<{ server: unknown; host: string; listenPort: number; apiUrl: string; databaseUrl: string }>;
      };
      this.server = await serverModule.startServer();
      this.apiUrl = this.server!.apiUrl;
      this.running = true;
      this.logger.info(`[Paperclip] Server started at ${this.apiUrl}`);

      await this.loadState();

      // Ensure company exists
      if (!this.state.companyId || !(await this.verifyCompany(this.state.companyId))) {
        const company = await this.api<PcCompany>("POST", "/api/companies", {
          name: "GodMode Team",
          description: "GodMode agent team — managed by Prosper",
        });
        this.state.companyId = company.id;
        this.state.agents = [];
        this.logger.info(`[Paperclip] Created company: ${company.id}`);
      }

      await this.syncAgents();
      await this.saveState();

      // Start polling for completed issues
      this.pollTimer = setInterval(() => this.pollCompletions().catch(() => {}), POLL_INTERVAL_MS);

      instance = this;
      return true;
    } catch (err) {
      this.logger.warn(`[Paperclip] Failed to initialize: ${String(err)}`);
      this.running = false;
      return false;
    }
  }

  async stop(): Promise<void> {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.server?.server && typeof (this.server.server as any).close === "function") {
      (this.server.server as any).close();
    }
    this.running = false;
    instance = null;
    this.logger.info("[Paperclip] Server stopped");
  }

  // ── Agent Sync (persona roster → Paperclip agents) ────────────────

  private async syncAgents(): Promise<void> {
    const roster = loadRoster();
    const existingSlugs = new Set(this.state.agents.map(a => a.personaSlug));
    let registered = 0;

    // Resolve gateway auth for adapter config
    const gatewayAuth = await this.resolveGatewayWsUrl();
    const adapterConfig = gatewayAuth
      ? {
          url: gatewayAuth.url,
          authToken: gatewayAuth.authToken,
          sessionKeyStrategy: "issue" as const,
          timeoutSec: 1800,
          autoPairOnFirstConnect: true,
        }
      : {};

    // Prosper = CEO (always)
    if (!existingSlugs.has("prosper")) {
      const agent = await this.api<PcAgent>("POST", `/api/companies/${this.state.companyId}/agents`, {
        name: "Prosper", role: "ceo",
        adapterType: "openclaw_gateway", adapterConfig,
        capabilities: "Chief of staff — delegates and reviews all team work",
      });
      this.state.agents.push({ paperclipId: agent.id, personaSlug: "prosper", role: "ceo" });
      registered++;
    }

    const ceoId = this.state.agents.find(a => a.role === "ceo")?.paperclipId;

    for (const persona of roster) {
      const slug = persona.name.toLowerCase().replace(/\s+/g, "-");
      if (existingSlugs.has(slug)) continue;

      const role = this.resolveRole(persona);
      const agent = await this.api<PcAgent>("POST", `/api/companies/${this.state.companyId}/agents`, {
        name: persona.name, role,
        adapterType: "openclaw_gateway", adapterConfig,
        capabilities: persona.mission || persona.taskTypes.join(", "),
        reportsTo: ceoId ?? null,
        metadata: { godmodeSlug: slug },
      });
      this.state.agents.push({ paperclipId: agent.id, personaSlug: slug, role });
      registered++;
    }

    if (registered > 0) {
      this.saveState(); // persist immediately so partial registrations aren't lost on crash
      this.logger.info(`[Paperclip] Synced ${registered} agent(s) (total: ${this.state.agents.length})`);
    }

    // One-time migration: update existing agents that have empty adapterConfig
    if (gatewayAuth && !this.state.adapterConfigured) {
      let migrated = 0;
      for (const agent of this.state.agents) {
        try {
          await this.api("PATCH", `/api/agents/${agent.paperclipId}`, {
            adapterType: "openclaw_gateway",
            adapterConfig,
          });
          migrated++;
        } catch (err) {
          this.logger.warn(`[Paperclip] Failed to migrate adapter config for ${agent.personaSlug}: ${String(err)}`);
        }
      }
      this.state.adapterConfigured = true;
      await this.saveState();
      if (migrated > 0) {
        this.logger.info(`[Paperclip] Migrated adapterConfig for ${migrated} existing agent(s)`);
      }
    }
  }

  private resolveRole(persona: PersonaProfile): PaperclipRole {
    const name = persona.name.toLowerCase();
    for (const [cat, role] of Object.entries(CATEGORY_TO_ROLE)) {
      if (name.includes(cat)) return role;
    }
    for (const tt of persona.taskTypes) {
      if (TASK_TYPE_TO_ROLE[tt]) return TASK_TYPE_TO_ROLE[tt];
    }
    return "general";
  }

  // ── Delegation (the only thing GodMode adds on top of Paperclip) ──

  /**
   * Delegate work to the team. Creates a Paperclip project + issues,
   * and a Proof doc per issue for the agent to write into.
   */
  async delegate(brief: ProjectBrief): Promise<ProjectStatus> {
    if (!this.state.companyId) throw new Error("Paperclip not initialized");

    const ceoId = this.state.agents.find(a => a.role === "ceo")?.paperclipId;

    const project = await this.api<PcProject>("POST", `/api/companies/${this.state.companyId}/projects`, {
      name: brief.title,
      description: brief.description,
      status: "in_progress",
      leadAgentId: ceoId ?? null,
    });

    const workspace = `project-${project.id.slice(0, 8)}`;
    const issueRecords: BridgeState["projects"][0]["issues"] = [];

    // Build toolkit context for issue descriptions
    let toolkitContext = "";
    try {
      const { isToolkitRunning, getToolkitBaseUrl } = await import("./agent-toolkit-server.js");
      if (isToolkitRunning()) {
        toolkitContext = [
          "\n\n---\n## GodMode Toolkit API",
          `Base URL: ${getToolkitBaseUrl()}`,
          "Use /search, /memory, /skills, /awareness, /identity endpoints to access knowledge.",
          "Use /agents/active to check what other agents are working on before starting.",
          "Search before building. Check existing artifacts. Never overwrite without backup.",
        ].join("\n");
      }
    } catch { /* toolkit not available */ }

    // ONE shared Proof doc per project — all agents write to their own sections
    let projectProofSlug: string | undefined;
    if (isProofRunning()) {
      try {
        const sectionHeaders = brief.issues.map((t, i) => `## ${i + 1}. ${t.title}\n\n*Assigned to: ${t.personaHint || "TBD"}*\n\n(Agent will write here)\n`).join("\n---\n\n");
        const doc = await createProofDocument(
          brief.title,
          `# ${brief.title}\n\n${brief.description}\n\n---\n\n${sectionHeaders}`,
          "ally",
        );
        projectProofSlug = doc.slug;
        this.logger.info(`[Paperclip] Shared Proof doc created for project: ${doc.slug}`);
      } catch (err) {
        this.logger.warn(`[Paperclip] Proof doc creation failed for project "${brief.title}": ${String(err)}`);
      }
    }

    for (const task of brief.issues) {
      const assignee = this.findAgent(task.personaHint || "");

      const issue = await this.api<PcIssue>("POST", `/api/companies/${this.state.companyId}/issues`, {
        projectId: project.id,
        title: task.title,
        description: `${task.description}${toolkitContext}`,
        status: "todo",
        priority: task.priority || "medium",
        assigneeAgentId: assignee?.paperclipId ?? null,
      });

      issueRecords.push({
        issueId: issue.id,
        title: task.title,
        personaSlug: assignee?.personaSlug ?? "unassigned",
        proofDocSlug: projectProofSlug, // All issues share the same project Proof doc
      });
    }

    this.state.projects.push({
      projectId: project.id,
      title: brief.title,
      proofWorkspace: workspace,
      issues: issueRecords,
      createdAt: new Date().toISOString(),
    });
    await this.saveState();

    // ── Execute: wake agents via Paperclip or fall back to queue-processor ──
    const usePaperclipExecution = process.env.GODMODE_PAPERCLIP_EXECUTE !== "false"
      && this.state.adapterConfigured;

    if (usePaperclipExecution) {
      // Native Paperclip execution — wake each assigned agent via the heartbeat service
      let woken = 0;
      for (const issueRecord of issueRecords) {
        const agent = this.state.agents.find(a => a.personaSlug === issueRecord.personaSlug);
        if (!agent) continue;

        try {
          await this.api("POST", `/api/agents/${agent.paperclipId}/wakeup`, {
            source: "assignment",
            triggerDetail: "manual",
            reason: `Issue assigned: ${issueRecord.title}`,
            payload: {
              projectId: project.id,
              projectTitle: brief.title,
              projectDescription: brief.description,
              issueTitle: issueRecord.title,
              issueId: issueRecord.issueId,
              proofDocSlug: issueRecord.proofDocSlug,
              personaSlug: issueRecord.personaSlug,
              toolkitContext,
            },
          });
          woken++;
        } catch (err) {
          this.logger.warn(`[Paperclip] Failed to wake agent ${agent.personaSlug}: ${String(err)}`);
        }
      }
      this.logger.info(`[Paperclip] Woke ${woken}/${issueRecords.length} agent(s) via Paperclip execution engine`);
    } else {
      // Fallback: queue-processor bypass (spawns detached Claude child processes)
      this.logger.info(`[Paperclip] Using queue-processor fallback (adapterConfigured=${this.state.adapterConfigured})`);
      try {
        const { updateQueueState, newQueueItemId } = await import("../lib/queue-state.js");
        const { getQueueProcessor } = await import("./queue-processor.js");

        for (const task of brief.issues) {
          const assignee = this.findAgent(task.personaHint || "");
          const issueRecord = issueRecords.find(r => r.title === task.title);
          const taskType = this.inferTaskType(task.personaHint || task.title);
          const proofSlug = issueRecord?.proofDocSlug;

          await updateQueueState((state) => {
            const newItem = {
              id: newQueueItemId(task.title),
              type: taskType,
              title: task.title,
              description:
                `Project: ${brief.title}\n\n${task.description}\n\n` +
                `**Success Criteria:** Complete your section of the project. Write all output to the designated file.` +
                (proofSlug ? `\n\nShared Proof doc slug: ${proofSlug} (optional — file output is primary)` : ""),
              priority: (task.priority === "critical" ? "high" : task.priority === "high" ? "high" : "normal") as "high" | "normal" | "low",
              status: "pending" as const,
              source: "chat" as const,
              createdAt: Date.now(),
              personaHint: assignee?.personaSlug ?? task.personaHint,
              proofDocSlug: proofSlug,
              workspaceId: workspace,
            };
            state.items.push(newItem);
            return newItem;
          });
        }

        const qp = getQueueProcessor();
        if (qp) { void qp.processAllPending(); }
        this.logger.info(`[Paperclip] Queued ${brief.issues.length} issue(s) for execution via queue-processor`);
      } catch (err) {
        this.logger.warn(`[Paperclip] Failed to queue issues for execution: ${String(err)}`);
      }
    }

    return this.buildStatus(this.state.projects[this.state.projects.length - 1], project.status);
  }

  /** Get live project status from Paperclip (cached 30s) */
  async getStatus(projectId: string): Promise<ProjectStatus | null> {
    const local = this.state.projects.find(p => p.projectId === projectId);
    if (!local) return null;

    const cached = this.statusCache.get(projectId);
    if (cached && Date.now() - cached.ts < PaperclipAdapter.STATUS_TTL) return cached.data;

    try {
      const project = await this.api<PcProject>("GET", `/api/companies/${this.state.companyId}/projects/${projectId}`);
      const { items } = await this.api<{ items: PcIssue[] }>("GET", `/api/companies/${this.state.companyId}/issues?projectId=${projectId}`);

      const result: ProjectStatus = {
        projectId,
        title: local.title,
        status: project.status,
        proofWorkspace: local.proofWorkspace,
        issues: local.issues.map(li => {
          const remote = items?.find(i => i.id === li.issueId);
          return {
            title: li.title,
            status: remote?.status ?? "unknown",
            assignee: li.personaSlug,
            proofDocSlug: li.proofDocSlug,
          };
        }),
      };
      this.statusCache.set(projectId, { data: result, ts: Date.now() });
      return result;
    } catch {
      return this.buildStatus(local, "unknown");
    }
  }

  /** Add steering comment to an issue */
  async steer(projectId: string, issueTitle: string, instructions: string): Promise<boolean> {
    const local = this.state.projects.find(p => p.projectId === projectId);
    const issue = local?.issues.find(i => i.title.toLowerCase().includes(issueTitle.toLowerCase()));
    if (!issue) return false;

    try {
      await this.api("POST", `/api/companies/${this.state.companyId}/issues/${issue.issueId}/comments`, {
        body: instructions,
      });
      return true;
    } catch {
      return false;
    }
  }

  /** Cancel a project and all its issues */
  async cancel(projectId: string): Promise<boolean> {
    const local = this.state.projects.find(p => p.projectId === projectId);
    if (!local) return false;

    try {
      for (const issue of local.issues) {
        await this.api("PATCH", `/api/companies/${this.state.companyId}/issues/${issue.issueId}`, {
          status: "cancelled",
        }).catch(() => {});
      }
      await this.api("PATCH", `/api/companies/${this.state.companyId}/projects/${projectId}`, {
        status: "cancelled",
      });
      return true;
    } catch {
      return false;
    }
  }

  /** List all delegated projects */
  listProjects(): Array<{ projectId: string; title: string; issueCount: number; createdAt: string }> {
    return this.state.projects.map(p => ({
      projectId: p.projectId,
      title: p.title,
      issueCount: p.issues.length,
      createdAt: p.createdAt,
    }));
  }

  /** Look up an issue by ID across all projects in bridge state (for before_prompt_build) */
  findIssueInBridge(issueId: string): { project: BridgeState["projects"][0]; issue: BridgeState["projects"][0]["issues"][0] } | null {
    for (const project of this.state.projects) {
      const issue = project.issues.find(i => i.issueId === issueId);
      if (issue) return { project, issue };
    }
    return null;
  }

  /** Readable team roster */
  getTeamRoster(): string {
    if (this.state.agents.length === 0) return "No team members registered.";
    const lines = ["## Agent Team", ""];
    const ceo = this.state.agents.find(a => a.role === "ceo");
    if (ceo) lines.push(`- **CEO** (lead): ${ceo.personaSlug}`);
    for (const a of this.state.agents.filter(a => a.role !== "ceo")) {
      lines.push(`  - **${a.role}**: ${a.personaSlug}`);
    }
    return lines.join("\n");
  }

  // ── Completion Polling ─────────────────────────────────────────────

  /** Check Paperclip for issues that moved to done/in_review since last poll.
   *  When using native execution, also fetches run data (output, cost, exit code). */
  private async pollCompletions(): Promise<void> {
    if (!this.state.companyId) return;

    for (const project of this.state.projects) {
      try {
        const { items } = await this.api<{ items: PcIssue[] }>(
          "GET",
          `/api/companies/${this.state.companyId}/issues?projectId=${project.projectId}`,
        );
        if (!items) continue;

        for (const issue of items) {
          if (issue.status === "done" || issue.status === "in_review") {
            const key = `${project.projectId}:${issue.id}:${issue.status}`;
            if (this.notifiedIssues.has(key)) continue;
            this.notifiedIssues.add(key);
            // Cap set growth — evict oldest entries when limit reached
            if (this.notifiedIssues.size > PaperclipAdapter.MAX_NOTIFIED) {
              const first = this.notifiedIssues.values().next().value;
              if (first) this.notifiedIssues.delete(first);
            }
            const local = project.issues.find(i => i.issueId === issue.id);
            if (!local) continue;

            // Fetch run data if using native Paperclip execution
            let runData: PcRunData | null = null;
            if (this.state.adapterConfigured) {
              runData = await this.fetchLatestRunData(local, project);
            }

            if (this.onCompletionCallback) {
              this.onCompletionCallback(
                project.projectId,
                local.title,
                issue.status,
                runData ?? undefined,
              );
            }
          }
        }
      } catch (err) {
        this.logger.warn(`[Paperclip] Poll error for project ${project.projectId}: ${String(err)}`);
        try {
          const { health } = await import("../lib/health-ledger.js");
          health.signal("paperclip-poll", false, { error: String(err), projectId: project.projectId });
        } catch { /* health ledger not available */ }
      }
    }
  }

  /** Fetch the latest run data for a completed issue's assigned agent */
  private async fetchLatestRunData(
    issue: BridgeState["projects"][0]["issues"][0],
    project: BridgeState["projects"][0],
  ): Promise<PcRunData | null> {
    const agent = this.state.agents.find(a => a.personaSlug === issue.personaSlug);
    if (!agent) return null;

    try {
      const runs = await this.api<PcRun[]>(
        "GET",
        `/api/companies/${this.state.companyId}/heartbeat-runs?agentId=${agent.paperclipId}&limit=5`,
      );
      if (!Array.isArray(runs) || runs.length === 0) return null;

      // Find the most recent completed run for this agent
      const run = runs.find(r => r.status === "completed" || r.status === "failed");
      if (!run) return null;

      // Write output to inbox file
      const output = run.stdoutExcerpt || run.resultJson?.summary || "";
      if (output) {
        try {
          const { MEMORY_DIR } = await import("../data-paths.js");
          const inboxDir = path.join(MEMORY_DIR, "inbox");
          await fs.mkdir(inboxDir, { recursive: true });
          const outPath = path.join(inboxDir, `${issue.issueId}.md`);
          const content = [
            `# ${issue.title}`,
            `**Project:** ${project.title}`,
            `**Agent:** ${issue.personaSlug}`,
            `**Status:** ${run.status}`,
            `**Exit Code:** ${run.exitCode ?? "N/A"}`,
            run.usageJson ? `**Tokens:** input=${run.usageJson.inputTokens ?? 0}, output=${run.usageJson.outputTokens ?? 0}` : "",
            "",
            "---",
            "",
            output,
          ].filter(Boolean).join("\n");
          await fs.writeFile(outPath, content, "utf-8");
          this.logger.info(`[Paperclip] Wrote output to ${outPath}`);
        } catch (err) {
          this.logger.warn(`[Paperclip] Failed to write inbox file for ${issue.issueId}: ${String(err)}`);
        }
      }

      return {
        runId: run.id,
        exitCode: run.exitCode ?? null,
        outputPreview: output.length > 500 ? output.slice(0, 500) + "…" : output,
        outputPath: path.join("~/godmode/memory/inbox", `${issue.issueId}.md`),
        proofDocSlug: issue.proofDocSlug,
        cost: run.usageJson ?? null,
      };
    } catch (err) {
      this.logger.warn(`[Paperclip] Failed to fetch run data for ${issue.personaSlug}: ${String(err)}`);
      return null;
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────

  /** Map persona hints / titles to queue item types for execution */
  private inferTaskType(hint: string): import("../lib/queue-state.js").QueueItemType {
    const h = hint.toLowerCase();
    if (h.includes("engineer") || h.includes("developer") || h.includes("frontend") || h.includes("build") || h.includes("code")) return "coding";
    if (h.includes("research") || h.includes("analyst") || h.includes("seo")) return "research";
    if (h.includes("design") || h.includes("creative") || h.includes("brand") || h.includes("copy") || h.includes("content") || h.includes("writer")) return "creative";
    if (h.includes("review") || h.includes("qa") || h.includes("check")) return "review";
    if (h.includes("ops") || h.includes("deploy") || h.includes("runner")) return "ops";
    return "task";
  }

  private findAgent(hint: string): BridgeState["agents"][0] | undefined {
    if (!hint) return undefined;
    const lower = hint.toLowerCase();
    return (
      this.state.agents.find(a => a.personaSlug === lower) ||
      this.state.agents.find(a => a.personaSlug.includes(lower)) ||
      this.state.agents.find(a => a.role === lower)
    );
  }

  private buildStatus(local: BridgeState["projects"][0], status: string): ProjectStatus {
    return {
      projectId: local.projectId,
      title: local.title,
      status,
      proofWorkspace: local.proofWorkspace,
      issues: local.issues.map(i => ({
        title: i.title,
        status: "pending",
        assignee: i.personaSlug,
        proofDocSlug: i.proofDocSlug,
      })),
    };
  }

  private async verifyCompany(id: string): Promise<boolean> {
    try { await this.api("GET", `/api/companies/${id}`); return true; } catch { return false; }
  }

  private async api<T = unknown>(method: string, apiPath: string, body?: unknown): Promise<T> {
    const url = `${this.apiUrl}${apiPath}`;
    const opts: RequestInit = { method, headers: { "Content-Type": "application/json" } };
    if (body && method !== "GET") opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Paperclip ${method} ${apiPath}: ${res.status} ${text}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("json") ? res.json() as Promise<T> : {} as T;
  }

  private async loadState(): Promise<void> {
    try {
      this.state = JSON.parse(await fs.readFile(STATE_FILE, "utf-8"));
    } catch {
      this.state = { companyId: null, agents: [], projects: [] };
    }
  }

  private async saveState(): Promise<void> {
    await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
    await fs.writeFile(STATE_FILE, JSON.stringify(this.state, null, 2));
  }
}
