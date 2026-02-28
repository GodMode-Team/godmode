import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import {
  updateCodingTaskState,
  type SwarmStage,
} from "../lib/coding-task-state.js";
import {
  readWorkspaceConfig,
  findWorkspaceById,
  detectWorkspaceFromText,
} from "../lib/workspaces-config.js";
import type { CodingOrchestrator } from "./coding-orchestrator.js";

// ── Copy & voice resource paths ────────────────────────────────

const HOME = process.env.HOME ?? process.env.USERPROFILE ?? "/tmp";
const GODMODE_ROOT = process.env.GODMODE_ROOT ?? path.join(HOME, "godmode");

// Global fallbacks
const VOICE_BIBLE = path.join(GODMODE_ROOT, "memory/projects/voice-bible/VOICE-BIBLE-v1.md");
const COPY_SKILL = path.join(GODMODE_ROOT, "skills/copy/SKILL.md");
const BRAND_GUIDE_FALLBACK = path.join(GODMODE_ROOT, "projects/godmode/brand/BRAND-GUIDE.md");

async function readOptionalFile(p: string): Promise<string> {
  try {
    return await fs.readFile(p, "utf-8");
  } catch {
    return "";
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

// ── Workspace-aware resource resolution ────────────────────────

type WorkspaceResources = {
  voiceBible: string;
  copySkill: string;
  brandGuide: string;
  projectContext: string;
  workspaceName: string;
};

/** Search common brand guide filenames in a directory. */
const BRAND_GUIDE_NAMES = [
  "BRAND-GUIDE.md",
  "BRAND-STRATEGY-GUIDE.md",
  "brand-guide.md",
];

async function findBrandGuide(dir: string): Promise<string> {
  for (const name of BRAND_GUIDE_NAMES) {
    const p = path.join(dir, name);
    if (await fileExists(p)) return p;
  }
  // Also check brand/ subdirectory
  for (const name of BRAND_GUIDE_NAMES) {
    const p = path.join(dir, "brand", name);
    if (await fileExists(p)) return p;
  }
  return "";
}

async function resolveWorkspaceResources(
  taskDescription: string,
): Promise<WorkspaceResources> {
  const result: WorkspaceResources = {
    voiceBible: await readOptionalFile(VOICE_BIBLE),
    copySkill: await readOptionalFile(COPY_SKILL),
    brandGuide: "",
    projectContext: "",
    workspaceName: "",
  };

  // Detect workspace from task description
  try {
    const config = await readWorkspaceConfig({ initializeIfMissing: false });
    const detected = detectWorkspaceFromText(config, taskDescription);

    if (detected.workspaceId) {
      const workspace = findWorkspaceById(config, detected.workspaceId);
      if (workspace) {
        result.workspaceName = workspace.name;

        // Search for brand guide in order of priority:
        // 1. Workspace repo directory
        // 2. ~/godmode/projects/{id}/
        // 3. ~/godmode/clients/{id}/
        const searchDirs = [
          workspace.path,
          path.join(GODMODE_ROOT, "projects", workspace.id),
          path.join(GODMODE_ROOT, "clients", workspace.id),
        ];

        for (const dir of searchDirs) {
          const found = await findBrandGuide(dir);
          if (found) {
            result.brandGuide = await readOptionalFile(found);
            break;
          }
        }

        // Look for project context (CONTEXT.md, 00-START-HERE.md)
        for (const dir of searchDirs) {
          for (const name of ["CONTEXT.md", "00-START-HERE.md"]) {
            const p = path.join(dir, name);
            const content = await readOptionalFile(p);
            if (content) {
              result.projectContext += `\n\n## ${name}\n\n${content}`;
            }
          }
        }

        // Check for project-specific copy skill
        const projectCopySkill = path.join(GODMODE_ROOT, "skills", `${workspace.id}-copy`, "SKILL.md");
        const projectCopy = await readOptionalFile(projectCopySkill);
        if (projectCopy) {
          result.copySkill = projectCopy;
        }
      }
    }
  } catch {
    // Workspace detection is best-effort — proceed with global resources
  }

  // Fall back to global brand guide if no project-specific one found
  if (!result.brandGuide) {
    result.brandGuide = await readOptionalFile(BRAND_GUIDE_FALLBACK);
  }

  return result;
}

// ── Swarm stage order ──────────────────────────────────────────

const STAGE_ORDER: SwarmStage[] = ["design", "build", "qc"];

function nextStage(current: SwarmStage): SwarmStage | undefined {
  const idx = STAGE_ORDER.indexOf(current);
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : undefined;
}

// ── Pipeline ───────────────────────────────────────────────────

type Logger = { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void };

export class SwarmPipeline {
  constructor(
    private orchestrator: CodingOrchestrator,
    private logger: Logger,
  ) {}

  async startPipeline(params: {
    taskId: string;
    task: string;
    worktreePath: string;
    branch: string;
    scopeGlobs: string[];
    model?: string;
    planDoc?: string;
  }): Promise<{ started: boolean; error?: string }> {
    const { taskId, worktreePath, task, planDoc } = params;

    // Create .swarm/ directory and task brief
    const swarmDir = path.join(worktreePath, ".swarm");
    try {
      await fs.mkdir(swarmDir, { recursive: true });

      // Read plan doc if available
      let planContent = "";
      if (planDoc) {
        planContent = await readOptionalFile(planDoc.replace(/^~/, HOME));
      }

      await fs.writeFile(
        path.join(swarmDir, "task.md"),
        [
          "# Task Brief",
          "",
          "## Description",
          task,
          "",
          planContent ? "## Plan Document\n\n" + planContent : "",
        ].join("\n"),
        "utf-8",
      );
    } catch (err) {
      return { started: false, error: `Failed to create .swarm/ directory: ${String(err)}` };
    }

    // Initialize swarm state
    await updateCodingTaskState((state) => {
      const t = state.tasks.find((t) => t.id === taskId);
      if (t) {
        t.swarm = {
          enabled: true,
          currentStage: "design",
          stages: {
            design: { status: "pending" },
            build: { status: "pending" },
            qc: { status: "pending" },
          },
        };
      }
    });

    // Spawn the first stage
    return this.spawnStage(params.taskId, "design", params);
  }

  async handleStageCompleted(params: {
    taskId: string;
    stage: SwarmStage;
    exitCode: number;
  }): Promise<void> {
    const { taskId, stage, exitCode } = params;

    this.logger.info(
      `[GodMode][Swarm] Stage "${stage}" completed for task ${taskId} (exit=${exitCode})`,
    );

    // Read current task to get worktree path and other context
    const { result: task } = await updateCodingTaskState((state) => {
      const t = state.tasks.find((t) => t.id === taskId);
      if (t?.swarm) {
        t.swarm.stages[stage].status = exitCode === 0 ? "done" : "failed";
        t.swarm.stages[stage].completedAt = Date.now();
      }
      return t;
    });

    if (!task) {
      this.logger.warn(`[GodMode][Swarm] Task ${taskId} not found for stage completion`);
      return;
    }

    // Validate stage output
    const valid = await this.validateStageOutput(stage, task.worktreePath);
    if (!valid.ok) {
      if (stage === "qc") {
        // QC failures don't block — continue to validation gates
        this.logger.warn(`[GodMode][Swarm] QC validation issue (non-blocking): ${valid.reason}`);
      } else {
        // Design/build failures are fatal
        this.logger.error(`[GodMode][Swarm] Stage "${stage}" output invalid: ${valid.reason}`);
        await this.orchestrator.markTaskFailed(taskId, `${stage} stage: ${valid.reason}`);
        return;
      }
    }

    // Check for next stage
    const next = nextStage(stage);

    if (next) {
      // Advance to next stage
      this.logger.info(`[GodMode][Swarm] Advancing task ${taskId} to stage "${next}"`);
      await this.spawnStage(taskId, next, {
        taskId,
        task: task.description,
        worktreePath: task.worktreePath,
        branch: task.branch,
        scopeGlobs: task.scopeGlobs,
        model: task.model,
      });
    } else {
      // Pipeline complete — hand off to existing completion flow
      this.logger.info(`[GodMode][Swarm] Pipeline complete for task ${taskId}, running validation gates`);
      await this.orchestrator.handleTaskCompleted({
        label: taskId,
        outcome: "ok",
      });
    }
  }

  private async validateStageOutput(
    stage: SwarmStage,
    worktreePath: string,
  ): Promise<{ ok: boolean; reason?: string }> {
    if (stage === "design") {
      // Design must produce a brief
      const briefPath = path.join(worktreePath, ".swarm", "design-brief.md");
      try {
        const content = await fs.readFile(briefPath, "utf-8");
        if (content.trim().length < 50) {
          return { ok: false, reason: "design-brief.md is too short (less than 50 chars)" };
        }
        return { ok: true };
      } catch {
        return { ok: false, reason: "design-brief.md not found — design agent produced no output" };
      }
    }

    if (stage === "build") {
      // Build must have produced at least one commit
      try {
        const { exitCode, stdout } = await this.orchestrator.runCommand(
          ["git", "log", "--oneline", "-1", "--format=%s"],
          { timeoutMs: 5_000, cwd: worktreePath },
        );
        if (exitCode !== 0 || !stdout.trim()) {
          return { ok: false, reason: "no commits found — build agent produced no code" };
        }
        return { ok: true };
      } catch {
        return { ok: false, reason: "could not check git log" };
      }
    }

    // QC — always valid (it's a quality improvement, not a gate)
    return { ok: true };
  }

  private async spawnStage(
    taskId: string,
    stage: SwarmStage,
    params: {
      taskId: string;
      task: string;
      worktreePath: string;
      branch: string;
      scopeGlobs: string[];
      model?: string;
    },
  ): Promise<{ started: boolean; error?: string }> {
    const { task, worktreePath, branch, scopeGlobs, model } = params;

    const prompt = await this.buildStagePrompt(stage, task, worktreePath, branch, scopeGlobs);

    try {
      const claudeBin = process.env.CLAUDE_BIN ?? "/opt/homebrew/bin/claude";
      const args = ["-p", prompt, "--verbose", "--dangerously-skip-permissions"];
      if (model) args.push("--model", model);

      const childEnv = { ...process.env };
      if (childEnv.PATH && !childEnv.PATH.includes("/opt/homebrew/bin")) {
        childEnv.PATH = `/opt/homebrew/bin:${childEnv.PATH}`;
      }

      const child = spawn(claudeBin, args, {
        cwd: worktreePath,
        detached: true,
        stdio: "ignore",
        env: childEnv,
      });

      const pid = child.pid;

      // Update swarm state with PID
      if (pid) {
        await updateCodingTaskState((state) => {
          const t = state.tasks.find((t) => t.id === taskId);
          if (t?.swarm) {
            t.swarm.currentStage = stage;
            t.swarm.stages[stage].status = "running";
            t.swarm.stages[stage].pid = pid;
            t.swarm.stages[stage].startedAt = Date.now();
          }
          // Also update the top-level PID for liveness checks
          if (t) t.pid = pid;
        });
      }

      child.on("exit", (code) => {
        this.logger.info(`[GodMode][Swarm] ${stage} agent for task ${taskId} exited (code=${code})`);
        this.handleStageCompleted({
          taskId,
          stage,
          exitCode: code ?? 1,
        }).catch((err) => {
          this.logger.error(`[GodMode][Swarm] handleStageCompleted error: ${String(err)}`);
        });
      });

      child.on("error", (err) => {
        this.logger.error(`[GodMode][Swarm] ${stage} agent spawn error: ${String(err)}`);
        this.orchestrator.markTaskFailed(taskId, `${stage} spawn error: ${String(err)}`).catch(() => {});
      });

      child.unref();
      this.logger.info(`[GodMode][Swarm] Spawned ${stage} agent for task ${taskId} (pid=${pid})`);
      return { started: true };
    } catch (err) {
      return { started: false, error: String(err) };
    }
  }

  private async buildStagePrompt(
    stage: SwarmStage,
    task: string,
    worktreePath: string,
    branch: string,
    scopeGlobs: string[],
  ): Promise<string> {
    // Resolve workspace-specific resources from the task description
    const res = await resolveWorkspaceResources(task);
    const projectLabel = res.workspaceName ? ` for ${res.workspaceName}` : "";

    const env = [
      "## Environment",
      `- Working directory: ${worktreePath}`,
      `- Branch: ${branch}`,
      `- Scope: ${scopeGlobs.join(", ")}`,
      res.workspaceName ? `- Project: ${res.workspaceName}` : "",
    ].filter(Boolean).join("\n");

    if (stage === "design") {
      return [
        `You are the DESIGN ARCHITECT in a multi-agent coding pipeline${projectLabel}.`,
        "Your job: analyze the codebase and make design decisions. Do NOT write implementation code.",
        "",
        "## Task",
        task,
        "",
        env,
        "",
        "## Instructions",
        "1. Read .swarm/task.md for the full brief and plan document",
        "2. Explore the existing codebase to understand patterns, conventions, and architecture",
        "3. Make design decisions: component structure, file layout, naming, CSS approach, state management",
        "4. Include copy direction: voice attributes, key phrases, tone guidance for each section",
        "5. Write your design brief to: .swarm/design-brief.md",
        "",
        "## Design Brief Format",
        "Your brief MUST include:",
        "- Files to create or modify (with full paths)",
        "- Component hierarchy and interfaces",
        "- Key design decisions with rationale",
        "- Accessibility requirements",
        "- Copy direction (voice, tone, key phrases per section)",
        "",
        "DO NOT write any implementation code. Only decisions and specs.",
        "DO NOT commit. Just write the .swarm/design-brief.md file.",
        "",
        res.voiceBible ? "## Voice Reference\n\n" + res.voiceBible + "\n" : "",
        res.brandGuide ? "## Brand & Design Guide\n\n" + res.brandGuide + "\n" : "",
        res.projectContext ? "## Project Context\n" + res.projectContext + "\n" : "",
      ].join("\n");
    }

    if (stage === "build") {
      const designBrief = await readOptionalFile(path.join(worktreePath, ".swarm", "design-brief.md"));

      return [
        `You are the BUILDER in a multi-agent coding pipeline${projectLabel}.`,
        "A design architect has already made all architectural decisions. Follow the design brief.",
        "",
        "## Task",
        task,
        "",
        env,
        "",
        "## Design Brief (from Design Agent)",
        designBrief || "(No design brief found — proceed with your best judgment)",
        "",
        "## Instructions",
        "1. Read the design brief above carefully — follow it, don't redesign",
        "2. Implement everything specified in the brief",
        "3. Write real, polished copy — NOT placeholders or lorem ipsum",
        "4. Follow the copy pipeline below for all user-facing text",
        "5. Commit all changes with clear, descriptive messages",
        `6. Push the branch: git push -u origin ${branch}`,
        "",
        "## Copy Pipeline (for all user-facing text)",
        "Run this process for headlines, body copy, CTAs, and microcopy:",
        res.copySkill || "(Copy skill not found — write in a direct, action-oriented voice)",
        "",
        res.voiceBible ? "## Voice Reference\n\n" + res.voiceBible + "\n" : "",
      ].join("\n");
    }

    // QC stage
    const designBrief = await readOptionalFile(path.join(worktreePath, ".swarm", "design-brief.md"));

    return [
      `You are the QC REVIEWER in a multi-agent coding pipeline${projectLabel}.`,
      "A builder has implemented the task. Your job: fresh-eyes review and polish.",
      "",
      "## Task",
      task,
      "",
      env,
      "",
      "## Design Brief (original spec)",
      designBrief || "(No design brief found)",
      "",
      "## Review Checklist",
      "1. Does the implementation match the design brief?",
      "2. Accessibility: ARIA labels, keyboard navigation, color contrast, screen reader support",
      "3. Edge cases: empty states, error states, loading states, overflow, responsive",
      "4. Code quality: no dead code, no console.logs, proper error handling",
      "5. Copy quality: run the humanizer checklist below on ALL user-facing text",
      "",
      "## Actions",
      "- FIX small issues directly (typos, missing attributes, style tweaks, AI-sounding copy)",
      "- REPORT architectural issues in .swarm/qc-report.md (do NOT attempt large refactors)",
      "- Commit any fixes with descriptive messages",
      `- Push after fixes: git push origin ${branch}`,
      "",
      "## Copy Humanizer (run on all user-facing text)",
      "Kill these AI patterns on sight:",
      "1. Negative parallelisms: \"It's not just about X — it's about Y\"",
      "2. Em dash overuse: more than 2-3 per section = AI smell",
      "3. Rule of three: \"X, Y, and Z\" repeated across sentences",
      "4. AI vocabulary: additionally, crucial, delve, enhance, fostering, garner, highlight, intricate, landscape, pivotal, showcase, tapestry, testament, underscore, valuable, vibrant",
      "5. Promotional inflation: \"completely new level\", \"fundamentally change\", \"groundbreaking\"",
      "6. Filler phrases: \"In order to\", \"It is important to note\"",
      "7. Synonym cycling: \"The product... The solution... The platform...\" — just say \"it\"",
      "8. Generic conclusions: \"The future looks bright\", \"Exciting times ahead\"",
      "",
      res.copySkill ? "## Full Copy Pipeline Reference\n\n" + res.copySkill + "\n" : "",
    ].join("\n");
  }
}
