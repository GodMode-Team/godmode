import fs from "node:fs/promises";
import path from "node:path";
import { getWorkspaceSyncService } from "../lib/workspace-sync-service.js";
import { readWorkspaceConfig, type WorkspaceConfigEntry } from "../lib/workspaces-config.js";

import type { Logger } from "../types/plugin-api.js";

type CurationState = {
  lastRunAt?: number;
  chunksProcessed: number;
  pendingChunks: number;
  nextScheduledRun?: number;
};

const DEFAULT_THRESHOLD = 10;
const DEFAULT_SCHEDULE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Service that manages workspace memory curation.
 *
 * Monitors team workspaces for new memory files and triggers curation
 * when either the threshold is reached or the schedule fires. Curation
 * involves: git pull -> load memory -> invoke LLM summarization ->
 * write updated files -> git commit + push.
 */
export class CurationAgentService {
  private readonly log: Logger;
  private readonly stateByWorkspace = new Map<string, CurationState>();
  private readonly configCache = new Map<string, { threshold?: number; schedule?: string }>();
  private scheduleTimer: ReturnType<typeof setInterval> | null = null;
  private started = false;

  constructor(logger: Logger) {
    this.log = logger;
  }

  async start(): Promise<void> {
    if (this.started) return;
    this.started = true;

    // Initialize state for team workspaces with curation enabled
    const config = await readWorkspaceConfig({ initializeIfMissing: false });
    for (const workspace of config.workspaces) {
      if (workspace.type !== "team" || !workspace.curation?.enabled) continue;
      this.stateByWorkspace.set(workspace.id, {
        chunksProcessed: 0,
        pendingChunks: 0,
      });
      // Cache curation config
      this.configCache.set(workspace.id, {
        threshold: workspace.curation.threshold,
        schedule: workspace.curation.schedule,
      });
    }

    // Schedule periodic check
    this.scheduleTimer = setInterval(() => {
      void this.checkScheduledCurations();
    }, 60 * 60 * 1000); // Check hourly

    this.log.info(`[Curation] Service started, tracking ${this.stateByWorkspace.size} workspace(s)`);
  }

  stop(): void {
    if (!this.started) return;
    this.started = false;
    if (this.scheduleTimer) {
      clearInterval(this.scheduleTimer);
      this.scheduleTimer = null;
    }
    this.log.info("[Curation] Service stopped");
  }

  /** Called when a new memory chunk is written to a workspace. */
  notifyMemoryWrite(workspaceId: string): void {
    const state = this.stateByWorkspace.get(workspaceId);
    if (!state) return;
    state.pendingChunks += 1;

    const config = this.getCurationConfig(workspaceId);
    const threshold = config?.threshold ?? DEFAULT_THRESHOLD;

    if (state.pendingChunks >= threshold) {
      this.log.info(`[Curation] Threshold reached for ${workspaceId} (${state.pendingChunks}/${threshold})`);
      void this.runCuration(workspaceId);
    }
  }

  /** Manually trigger curation for a workspace. */
  async runCuration(workspaceId: string): Promise<{ ok: boolean; error?: string }> {
    const config = await readWorkspaceConfig({ initializeIfMissing: false });
    const workspace = config.workspaces.find((w) => w.id === workspaceId);
    if (!workspace || workspace.type !== "team") {
      return { ok: false, error: "Not a team workspace" };
    }

    const state = this.stateByWorkspace.get(workspaceId) ?? {
      chunksProcessed: 0,
      pendingChunks: 0,
    };

    this.log.info(`[Curation] Running curation for ${workspaceId}`);

    try {
      // Pull latest from remote
      const syncService = getWorkspaceSyncService();
      await syncService.pullNow(workspaceId);

      // Load memory files
      const memoryDir = path.join(workspace.path, "memory");
      const memoryFiles = await loadMemoryFiles(memoryDir);
      if (memoryFiles.length === 0) {
        this.log.info(`[Curation] No memory files found for ${workspaceId}`);
        state.pendingChunks = 0;
        state.lastRunAt = Date.now();
        this.stateByWorkspace.set(workspaceId, state);
        return { ok: true };
      }

      // Load current MEMORY.md
      const memoryMdPath = path.join(memoryDir, "MEMORY.md");
      let currentMemory = "";
      try {
        currentMemory = await fs.readFile(memoryMdPath, "utf-8");
      } catch {
        // No existing memory
      }

      // Load SOPs
      const agentsMdPath = path.join(workspace.path, "AGENTS.md");
      let currentSops = "";
      try {
        currentSops = await fs.readFile(agentsMdPath, "utf-8");
      } catch {
        // No existing SOPs
      }

      // Build curation prompt
      const curationResult = await runCurationLLM({
        workspace,
        memoryFiles,
        currentMemory,
        currentSops,
        log: this.log,
      });

      if (curationResult.updatedMemory) {
        await fs.writeFile(memoryMdPath, curationResult.updatedMemory, "utf-8");
      }

      if (curationResult.sopCandidates) {
        const candidatesPath = path.join(memoryDir, "sop-candidates.md");
        await fs.writeFile(candidatesPath, curationResult.sopCandidates, "utf-8");
      }

      // Commit and push
      await syncService.pushNow(workspaceId);

      state.chunksProcessed += memoryFiles.length;
      state.pendingChunks = 0;
      state.lastRunAt = Date.now();
      this.stateByWorkspace.set(workspaceId, state);

      this.log.info(`[Curation] Completed for ${workspaceId}, processed ${memoryFiles.length} files`);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.log.error(`[Curation] Failed for ${workspaceId}: ${message}`);
      return { ok: false, error: message };
    }
  }

  getStatus(workspaceId: string): CurationState | null {
    return this.stateByWorkspace.get(workspaceId) ?? null;
  }

  listStatuses(): Record<string, CurationState> {
    const result: Record<string, CurationState> = {};
    for (const [id, state] of this.stateByWorkspace.entries()) {
      result[id] = { ...state };
    }
    return result;
  }

  private getCurationConfig(workspaceId: string): { threshold?: number; schedule?: string } | null {
    return this.configCache.get(workspaceId) ?? null;
  }

  private async checkScheduledCurations(): Promise<void> {
    if (!this.started) return;
    const now = Date.now();

    for (const [workspaceId, state] of this.stateByWorkspace.entries()) {
      const lastRun = state.lastRunAt ?? 0;
      if (now - lastRun >= DEFAULT_SCHEDULE_MS && state.pendingChunks > 0) {
        this.log.info(`[Curation] Scheduled run for ${workspaceId}`);
        await this.runCuration(workspaceId);
      }
    }
  }
}

// ── Memory file loading ──────────────────────────────────────────

type MemoryFile = {
  name: string;
  content: string;
};

async function loadMemoryFiles(memoryDir: string): Promise<MemoryFile[]> {
  const files: MemoryFile[] = [];
  try {
    const entries = await fs.readdir(memoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      // Skip MEMORY.md itself and sop-candidates.md
      if (entry.name === "MEMORY.md" || entry.name === "sop-candidates.md") continue;
      if (!entry.name.endsWith(".md")) continue;
      try {
        const content = await fs.readFile(path.join(memoryDir, entry.name), "utf-8");
        if (content.trim()) {
          files.push({ name: entry.name, content: content.trim() });
        }
      } catch {
        // Skip unreadable files
      }
    }
  } catch {
    // Memory dir may not exist
  }
  return files;
}

// ── LLM Curation ──────────────────────────────────────────────────

type CurationLLMResult = {
  updatedMemory?: string;
  sopCandidates?: string;
};

const CURATION_MODEL = "claude-haiku-4-5-20251001";
const CURATION_MAX_TOKENS = 4096;

function buildCurationPrompt(params: {
  memoryFiles: MemoryFile[];
  currentMemory: string;
  currentSops: string;
}): string {
  const chunks = params.memoryFiles
    .map((f) => `### ${f.name}\n\n${f.content.slice(0, 3000)}`)
    .join("\n\n---\n\n");

  return `You are a team knowledge curator. Your job is to consolidate memory entries into a coherent, deduplicated MEMORY.md and identify SOP candidates.

## Current MEMORY.md
${params.currentMemory || "(empty)"}

## Current AGENTS.md (SOPs)
${params.currentSops || "(none)"}

## New Memory Entries
${chunks}

## Instructions
1. Produce an updated MEMORY.md that:
   - Merges new information with existing content
   - Deduplicates: if a new entry covers something already in MEMORY.md, integrate don't append
   - Keeps the most specific/actionable version of conflicting info
   - Stays under 200 lines
   - Uses clear markdown headers for organization

2. Identify SOP candidates — patterns or rules that appear across multiple entries and should be promoted to AGENTS.md. Only list candidates NOT already in AGENTS.md.

## Output Format
Respond with EXACTLY this structure (no other text):

<memory>
(the full updated MEMORY.md content)
</memory>

<sop-candidates>
(bulleted list of SOP candidates, or "none" if there are no new candidates)
</sop-candidates>`;
}

function parseCurationResponse(text: string): CurationLLMResult {
  const memoryMatch = text.match(/<memory>\s*([\s\S]*?)\s*<\/memory>/);
  const sopMatch = text.match(/<sop-candidates>\s*([\s\S]*?)\s*<\/sop-candidates>/);

  const updatedMemory = memoryMatch?.[1]?.trim() || undefined;
  const rawSop = sopMatch?.[1]?.trim();
  const sopCandidates = rawSop && rawSop.toLowerCase() !== "none" ? rawSop : undefined;

  return { updatedMemory, sopCandidates };
}

async function runCurationLLM(params: {
  workspace: WorkspaceConfigEntry;
  memoryFiles: MemoryFile[];
  currentMemory: string;
  currentSops: string;
  log: Logger;
}): Promise<CurationLLMResult> {
  const { workspace, memoryFiles, currentMemory, currentSops, log } = params;

  // Try LLM-based curation first
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const prompt = buildCurationPrompt({ memoryFiles, currentMemory, currentSops });
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: CURATION_MODEL,
          max_tokens: CURATION_MAX_TOKENS,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (response.ok) {
        const body = (await response.json()) as {
          content: Array<{ type: string; text?: string }>;
        };
        const text = body.content
          ?.filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("");

        if (text) {
          const result = parseCurationResponse(text);
          if (result.updatedMemory) {
            log.info(`[Curation] LLM curation completed for ${workspace.id}`);
            return result;
          }
        }
      } else {
        log.warn(`[Curation] LLM API returned ${response.status} — falling back to merge`);
      }
    } catch (err) {
      log.warn(`[Curation] LLM call failed: ${err instanceof Error ? err.message : String(err)} — falling back to merge`);
    }
  } else {
    log.info("[Curation] No ANTHROPIC_API_KEY — using merge-based curation");
  }

  // Fallback: simple merge-based curation
  return runMergeCuration(params);
}

function runMergeCuration(params: {
  workspace: WorkspaceConfigEntry;
  memoryFiles: MemoryFile[];
  currentMemory: string;
  log: Logger;
}): CurationLLMResult {
  const { workspace, memoryFiles, currentMemory, log } = params;

  const newEntries: string[] = [];
  for (const file of memoryFiles) {
    if (currentMemory.includes(file.name)) continue;
    newEntries.push(`\n## From: ${file.name}\n\n${file.content.slice(0, 2000)}`);
  }

  let updatedMemory: string | undefined;
  if (newEntries.length > 0) {
    updatedMemory = currentMemory.trimEnd() + "\n" + newEntries.join("\n") + "\n";
    log.info(`[Curation] Merge: added ${newEntries.length} entries to MEMORY.md for ${workspace.id}`);
  }

  return { updatedMemory };
}

// ── Singleton ────────────────────────────────────────────────────

let singleton: CurationAgentService | null = null;

export function getCurationAgentService(logger?: Logger): CurationAgentService {
  if (!singleton) {
    singleton = new CurationAgentService(
      logger ?? {
        info: (msg) => console.log(msg),
        warn: (msg) => console.warn(msg),
        error: (msg) => console.error(msg),
      },
    );
  }
  return singleton;
}
