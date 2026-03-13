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

/** Persisted bridge state (persona↔agent mapping + project↔Proof doc mapping) */
interface BridgeState {
  companyId: string | null;
  agents: Array<{ paperclipId: string; personaSlug: string; role: PaperclipRole }>;
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
  private onCompletionCallback: ((projectId: string, issueTitle: string, status: string) => void) | null = null;
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

  /** Register a callback for when issues complete (used by context injection) */
  onCompletion(cb: (projectId: string, issueTitle: string, status: string) => void): void {
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

    // Prosper = CEO (always)
    if (!existingSlugs.has("prosper")) {
      const agent = await this.api<PcAgent>("POST", `/api/companies/${this.state.companyId}/agents`, {
        name: "Prosper", role: "ceo",
        adapterType: "openclaw_gateway", adapterConfig: {},
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
        adapterType: "openclaw_gateway", adapterConfig: {},
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

    // Wake the lead agent to start work
    if (ceoId) {
      try {
        await this.api("POST", `/api/companies/${this.state.companyId}/agents/${ceoId}/wake`, {
          source: "on_demand", triggerDetail: "manual",
          reason: `New project delegated: ${brief.title}`,
        });
      } catch { /* non-fatal */ }
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

  /** Check Paperclip for issues that moved to done/in_review since last poll */
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
            if (local && this.onCompletionCallback) {
              this.onCompletionCallback(project.projectId, local.title, issue.status);
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

  // ── Helpers ────────────────────────────────────────────────────────

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
