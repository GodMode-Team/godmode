/**
 * Onboarding Gateway Methods — Deep Onboarding System
 *
 * Manages the 7-phase consultative onboarding for GodMode users:
 *   Phase 0: Assessment (config health score, gap analysis)
 *   Phase 1: Interview (name, role, mission, workflows, pain points)
 *   Phase 2: Second Brain (memory setup, Obsidian, daily brief)
 *   Phase 3: Workflow Audit (capability mapping, skill recommendations)
 *   Phase 4: Configuration (apply optimal settings)
 *   Phase 5: First Win (demo daily brief)
 *   Phase 6: Grand Reveal (summary, before/after)
 *
 * State persisted to ~/godmode/data/onboarding.json
 */

import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { DATA_DIR, GODMODE_ROOT } from "../data-paths.js";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import { existsSync } from "node:fs";
import { invalidateIdentityCache } from "../lib/awareness-snapshot.js";
import { generateRosterConfig } from "../lib/agent-roster.js";
import type { GatewayRequestHandler } from "../types/plugin-api.js";
import {
  type OnboardingState,
  type OnboardingPhase,
  type SetupStep,
  type SetupProgress,
  SETUP_STEPS,
  emptyOnboardingState,
} from "./onboarding-types.js";
import { runAssessment, generateConfigRecommendations } from "./onboarding-scanner.js";
import {
  getIntegrationsForPlatform,
  detectAllIntegrations,
} from "../lib/integration-registry.js";
import {
  generateWorkspaceFiles,
  patchOCConfig,
  checkOnboardingStatus,
  previewOnboarding,
  computeConfigDiff,
  sanitizeAnswers,
  type OnboardingAnswers,
} from "../services/onboarding.js";
import { readEnvFile, writeEnvVar, getEnvVar } from "../lib/env-writer.js";

// ── Checklist Types ─────────────────────────────────────────────

type ChecklistStep = {
  id: string;
  label: string;
  completed: boolean;
  detail?: string;
};

type ChecklistMilestone = {
  id: string;
  phase: number;
  title: string;
  description: string;
  emoji: string;
  status: "complete" | "in-progress" | "locked";
  steps: ChecklistStep[];
};

type OnboardingChecklist = {
  milestones: ChecklistMilestone[];
  percentComplete: number;
  currentPhase: number;
  completedAt: string | null;
};

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const ONBOARDING_FILE = join(DATA_DIR, "onboarding.json");

// ── Helpers ──────────────────────────────────────────────────────

async function readOnboarding(): Promise<OnboardingState> {
  try {
    const raw = await readFile(ONBOARDING_FILE, "utf-8");
    const parsed = JSON.parse(raw) as OnboardingState;
    // Ensure new fields exist for old state files
    return {
      ...emptyOnboardingState(),
      ...parsed,
    };
  } catch {
    return emptyOnboardingState();
  }
}

async function writeOnboarding(state: OnboardingState): Promise<void> {
  await secureMkdir(DATA_DIR);
  await secureWriteFile(ONBOARDING_FILE, JSON.stringify(state, null, 2) + "\n");
}

/**
 * Public export of deriveSetupProgress for use in onboarding-context.ts.
 * Named differently to avoid confusion with the internal helper.
 */
export async function deriveSetupProgressForContext(): Promise<SetupProgress> {
  return deriveSetupProgress();
}

/** Derive current setup progress by checking actual system state. */
async function deriveSetupProgress(): Promise<SetupProgress> {
  const state = await readOnboarding();
  const envVars = readEnvFile();

  // Check name from onboarding state
  const name = state.interview?.name || state.identity?.name || undefined;
  const allyName = state.allyName || undefined;

  // Check API keys from process.env first, then .env file
  const apiKeyConfigured = Boolean(
    process.env.ANTHROPIC_API_KEY || envVars["ANTHROPIC_API_KEY"],
  );
  const honchoConfigured = Boolean(
    process.env.HONCHO_API_KEY || envVars["HONCHO_API_KEY"],
  );
  const composioConfigured = Boolean(
    process.env.COMPOSIO_API_KEY || envVars["COMPOSIO_API_KEY"],
  );

  // Check Obsidian vault
  const obsidianPathValue = process.env.OBSIDIAN_VAULT_PATH || envVars["OBSIDIAN_VAULT_PATH"] || state.secondBrain?.obsidianPath;
  const obsidianConfigured = Boolean(obsidianPathValue && existsSync(obsidianPathValue));

  // Derive completed steps
  const completedSteps: SetupStep[] = [];
  if (name) completedSteps.push("welcome");
  if (apiKeyConfigured) completedSteps.push("api-key");
  if (honchoConfigured) completedSteps.push("memory");
  if (composioConfigured) completedSteps.push("integrations");
  if (obsidianConfigured) completedSteps.push("second-brain");

  // Derive current step (first incomplete step)
  const stepOrder: SetupStep[] = ["welcome", "api-key", "memory", "integrations", "second-brain"];
  const currentStep = stepOrder.find((s) => !completedSteps.includes(s)) ?? "second-brain";

  // Check dismissed flag
  let dismissed = false;
  try {
    const dismissedPath = join(DATA_DIR, "setup-dismissed.json");
    const raw = await readFile(dismissedPath, "utf-8");
    const parsed = JSON.parse(raw) as { dismissed?: boolean };
    dismissed = parsed.dismissed === true;
  } catch { /* not dismissed */ }

  // Composio integrations (empty for now — populated when Composio is configured)
  const composioIntegrations: Record<string, { id: string; name: string; connected: boolean; icon?: string }> = {};

  // Determine if setup is complete (all required steps done)
  const requiredSteps = SETUP_STEPS.filter((s) => s.required).map((s) => s.step);
  const allRequiredComplete = requiredSteps.every((s) => completedSteps.includes(s));
  const completedAt = allRequiredComplete ? (state.completedAt ?? new Date().toISOString()) : undefined;

  return {
    currentStep,
    completedSteps,
    name,
    timezone: process.env.TZ || envVars["TZ"] || undefined,
    allyName,
    apiKeyConfigured,
    honchoConfigured,
    composioConfigured,
    composioIntegrations,
    obsidianConfigured,
    obsidianPath: obsidianPathValue || undefined,
    startedAt: state.startedAt || undefined,
    completedAt,
    dismissed,
  };
}

/** Deep merge helper for nested objects. Arrays are replaced, not merged. */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (
      val !== null &&
      val !== undefined &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      typeof (result as Record<string, unknown>)[key] === "object" &&
      (result as Record<string, unknown>)[key] !== null &&
      !Array.isArray((result as Record<string, unknown>)[key])
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        (result as Record<string, unknown>)[key] as Record<string, unknown>,
        val as Record<string, unknown>,
      );
    } else {
      (result as Record<string, unknown>)[key] = val;
    }
  }
  return result;
}

// ── Checklist Builder ────────────────────────────────────────────

/**
 * Derive milestone status from the current phase and completed phases list.
 * A milestone is "complete" if its phase appears in completedPhases,
 * "in-progress" if it matches the current active phase, or "locked" otherwise.
 */
function milestoneStatus(
  milestonePhase: number,
  currentPhase: number,
  completedPhases: number[],
): "complete" | "in-progress" | "locked" {
  if (completedPhases.includes(milestonePhase)) return "complete";
  if (milestonePhase === currentPhase) return "in-progress";
  return "locked";
}

function buildPhase0Steps(state: OnboardingState): ChecklistStep[] {
  const a = state.assessment;
  return [
    {
      id: "p0-run-assessment",
      label: "Run assessment",
      completed: a !== null,
      detail: a ? `Score: ${a.healthScore}/100` : undefined,
    },
    {
      id: "p0-review-score",
      label: "Review score",
      completed: a !== null && state.completedPhases.includes(0),
      detail: a ? `${a.features.filter((f) => f.enabled).length}/${a.features.length} features enabled` : undefined,
    },
    {
      id: "p0-identify-gaps",
      label: "Identify gaps",
      completed: state.completedPhases.includes(0),
      detail: a
        ? (() => {
            const gaps: string[] = [];
            if (a.authMethod === "none") gaps.push("auth");
            if (!a.memoryStatus.hasMemoryMd) gaps.push("memory");
            if (a.channelsConnected.length === 0) gaps.push("channels");
            return gaps.length > 0 ? `Gaps: ${gaps.join(", ")}` : "No major gaps";
          })()
        : undefined,
    },
  ];
}

function buildPhase1Steps(state: OnboardingState): ChecklistStep[] {
  const i = state.interview;
  const sp = i?.soulProfile;
  return [
    {
      id: "p1-name",
      label: "Your name & role",
      completed: Boolean(i?.name),
      detail: i?.name ? `${i.name}${i.role ? ` (${i.role})` : ""}` : undefined,
    },
    {
      id: "p1-ground",
      label: "The Ground",
      completed: Boolean(sp?.ground && sp?.anchor && sp?.atMyBest),
      detail: sp?.ground ? truncate(sp.ground, 50) : undefined,
    },
    {
      id: "p1-modes",
      label: "Your Modes",
      completed: Boolean(sp?.flowState && sp?.depletedState),
      detail: sp?.flowState ? "Flow + depleted mapped" : undefined,
    },
    {
      id: "p1-patterns",
      label: "Pattern Tendencies",
      completed: Boolean(sp?.recurringPattern || sp?.disguisedDistraction),
      detail: sp?.recurringPattern ? truncate(sp.recurringPattern, 40) : undefined,
    },
    {
      id: "p1-truth",
      label: "Truth + Love Calibration",
      completed: Boolean(sp?.challengeLevel && sp?.correctionStyle),
      detail: sp?.challengeLevel ? truncate(sp.challengeLevel, 40) : undefined,
    },
    {
      id: "p1-sacred",
      label: "What's Sacred",
      completed: Boolean(sp?.nonNegotiables && sp.nonNegotiables.length > 0),
      detail: sp?.nonNegotiables ? `${sp.nonNegotiables.length} non-negotiables` : undefined,
    },
    {
      id: "p1-voice",
      label: "Voice Tuning",
      completed: Boolean(sp?.annoyingAiBehavior && sp?.justGetItDone),
      detail: sp?.annoyingAiBehavior ? "AI preferences set" : undefined,
    },
    {
      id: "p1-workflows",
      label: "What Should Be Running",
      completed: Boolean(sp?.desiredWorkflows && sp.desiredWorkflows.length > 0),
      detail: sp?.desiredWorkflows ? `${sp.desiredWorkflows.length} automations` : undefined,
    },
  ];
}

function buildPhase2Steps(state: OnboardingState): ChecklistStep[] {
  const sb = state.secondBrain;
  return [
    {
      id: "p2-memory",
      label: "Seed MEMORY.md",
      completed: Boolean(sb?.memorySeeded),
    },
    {
      id: "p2-obsidian",
      label: "Connect Obsidian",
      completed: Boolean(sb?.obsidianPath),
      detail: sb?.obsidianPath ? `Path: ${sb.obsidianPath}` : undefined,
    },
    {
      id: "p2-daily-brief",
      label: "Configure daily brief",
      completed: Boolean(sb?.dailyBriefConfigured),
    },
  ];
}

function buildPhase3Steps(state: OnboardingState): ChecklistStep[] {
  const au = state.audit;
  return [
    {
      id: "p3-map",
      label: "Map workflows to OC skills",
      completed: Boolean(au?.mappings && au.mappings.length > 0),
      detail:
        au?.mappings && au.mappings.length > 0
          ? `${au.mappings.length} mapped`
          : undefined,
    },
    {
      id: "p3-automations",
      label: "Identify automations",
      completed: Boolean(
        au?.mappings && au.mappings.some((m) => m.automations.length > 0),
      ),
      detail: au?.mappings
        ? (() => {
            const count = au.mappings.reduce((n, m) => n + m.automations.length, 0);
            return count > 0 ? `${count} automations` : undefined;
          })()
        : undefined,
    },
    {
      id: "p3-trust",
      label: "Set up Trust Tracker categories",
      completed: Boolean(
        au?.recommendedTrustWorkflows && au.recommendedTrustWorkflows.length > 0,
      ),
      detail:
        au?.recommendedTrustWorkflows && au.recommendedTrustWorkflows.length > 0
          ? au.recommendedTrustWorkflows.slice(0, 3).join(", ")
          : undefined,
    },
  ];
}

function buildPhase4Steps(state: OnboardingState): ChecklistStep[] {
  const cfg = state.configuration;
  const hasChanges = Boolean(cfg?.changes && cfg.changes.length > 0);
  const appliedCount = cfg?.changes?.filter((c) => c.applied).length ?? 0;
  const totalCount = cfg?.changes?.length ?? 0;
  return [
    {
      id: "p4-audit",
      label: "Run config audit",
      completed: hasChanges,
      detail: hasChanges ? `${totalCount} recommendations found` : undefined,
    },
    {
      id: "p4-settings",
      label: "Apply recommended settings",
      completed: hasChanges && appliedCount > 0,
      detail: hasChanges ? `${appliedCount}/${totalCount} applied` : undefined,
    },
    {
      id: "p4-features",
      label: "Enable GodMode features",
      completed: appliedCount >= totalCount && totalCount > 0,
    },
    {
      id: "p4-channels",
      label: "Set up channels",
      completed: Boolean(cfg?.completed),
    },
  ];
}

function buildPhase5Steps(state: OnboardingState): ChecklistStep[] {
  const fw = state.firstWin;
  return [
    {
      id: "p5-pick",
      label: "Pick a demo task",
      completed: Boolean(fw?.demoType),
      detail: fw?.demoType ? fw.demoType.replace(/-/g, " ") : undefined,
    },
    {
      id: "p5-run",
      label: "Run it live",
      completed: Boolean(fw?.outcome),
    },
    {
      id: "p5-celebrate",
      label: "Celebrate the result",
      completed: Boolean(fw?.completed),
    },
  ];
}

function buildPhase6Steps(state: OnboardingState): ChecklistStep[] {
  const gr = state.grandReveal;
  return [
    {
      id: "p6-review",
      label: "Review your setup",
      completed: Boolean(gr),
      detail: gr ? `Score: ${gr.healthBefore} -> ${gr.healthAfter}` : undefined,
    },
    {
      id: "p6-guide",
      label: "Get your GodMode guide",
      completed: Boolean(state.completedAt),
    },
  ];
}

/** Truncate a string to maxLen with ellipsis. */
function truncate(s: string, maxLen: number): string {
  return s.length > maxLen ? s.slice(0, maxLen - 1) + "\u2026" : s;
}

/** Build a full checklist from the current onboarding state. */
function buildChecklist(state: OnboardingState): OnboardingChecklist {
  const phase = state.phase;
  const cp = state.completedPhases;

  const milestones: ChecklistMilestone[] = [
    {
      id: "health-scan",
      phase: 0,
      title: "Health Scan",
      description: "Scan your current OpenClaw config and identify gaps",
      emoji: "\u{1FA7A}",
      status: milestoneStatus(0, phase, cp),
      steps: buildPhase0Steps(state),
    },
    {
      id: "get-to-know-you",
      phase: 1,
      title: "Get to Know You",
      description: "Tell me about yourself so I can personalize everything",
      emoji: "\u{1F44B}",
      status: milestoneStatus(1, phase, cp),
      steps: buildPhase1Steps(state),
    },
    {
      id: "second-brain",
      phase: 2,
      title: "Second Brain",
      description: "Set up your memory, notes, and daily brief",
      emoji: "\u{1F9E0}",
      status: milestoneStatus(2, phase, cp),
      steps: buildPhase2Steps(state),
    },
    {
      id: "workflow-mapping",
      phase: 3,
      title: "Workflow Mapping",
      description: "Map your workflows to OpenClaw capabilities",
      emoji: "\u{1F5FA}\uFE0F",
      status: milestoneStatus(3, phase, cp),
      steps: buildPhase3Steps(state),
    },
    {
      id: "configure-and-tune",
      phase: 4,
      title: "Configure & Tune",
      description: "Apply recommended settings and enable features",
      emoji: "\u{2699}\uFE0F",
      status: milestoneStatus(4, phase, cp),
      steps: buildPhase4Steps(state),
    },
    {
      id: "first-win",
      phase: 5,
      title: "First Win",
      description: "See GodMode in action with a live demo",
      emoji: "\u{1F3C6}",
      status: milestoneStatus(5, phase, cp),
      steps: buildPhase5Steps(state),
    },
    {
      id: "godmode-unlocked",
      phase: 6,
      title: "You're in GodMode",
      description: "Review your transformation and get your guide",
      emoji: "\u{1F525}",
      status: milestoneStatus(6, phase, cp),
      steps: buildPhase6Steps(state),
    },
  ];

  // Calculate percentComplete from all steps across all milestones
  const allSteps = milestones.flatMap((m) => m.steps);
  const completedSteps = allSteps.filter((s) => s.completed).length;
  const percentComplete =
    allSteps.length > 0 ? Math.round((completedSteps / allSteps.length) * 100) : 0;

  return {
    milestones,
    percentComplete,
    currentPhase: phase,
    completedAt: state.completedAt,
  };
}

/** Build a default checklist when no onboarding state file exists. */
function buildDefaultChecklist(): OnboardingChecklist {
  return buildChecklist(emptyOnboardingState());
}

// ── Handlers ─────────────────────────────────────────────────────

export const onboardingHandlers: GatewayRequestHandlers = {
  /**
   * Get a structured onboarding checklist with progress tracking.
   * Returns milestones with sub-steps, completion status, and percent complete.
   */
  "onboarding.checklist": async ({ respond }) => {
    const state = await readOnboarding();
    // readOnboarding always returns a valid state (defaults if file missing)
    respond(true, buildChecklist(state));
  },

  /**
   * Get capability cards for the Setup tab progress tracker.
   * Returns status for each GodMode capability: active, available, or coming-soon.
   */
  "onboarding.capabilities": async ({ respond }) => {
    try {
      const state = await readOnboarding();
      const integrations = getIntegrationsForPlatform();
      const integrationStatuses = await detectAllIntegrations();

      type CapCard = {
        id: string;
        title: string;
        description: string;
        icon: string;
        status: "active" | "available" | "coming-soon";
        detail?: string;
        action?: string;
      };

      const cards: CapCard[] = [];

      // Identity
      const hasIdentity = Boolean(state.identity?.name && state.interview?.completed);
      cards.push({
        id: "identity",
        title: "Your Identity",
        description: "Teach your ally who you are, how you work, and what matters to you.",
        icon: "\u{1F9EC}",
        status: hasIdentity ? "active" : "available",
        detail: hasIdentity ? `Configured for ${state.identity!.name}` : undefined,
        action: hasIdentity ? undefined : "Set Up Identity",
      });

      // Daily Brief
      let briefEnabled = false;
      try {
        const optionsFile = join(DATA_DIR, "godmode-options.json");
        const raw = await readFile(optionsFile, "utf-8");
        const opts = JSON.parse(raw) as Record<string, unknown>;
        briefEnabled = opts["dailyBrief.enabled"] !== false;
      } catch { /* default: not configured */ }
      cards.push({
        id: "daily-brief",
        title: "Daily Brief",
        description: "Morning intelligence briefing with schedule, news, and priorities.",
        icon: "\u{2600}\uFE0F",
        status: briefEnabled ? "active" : "available",
        action: briefEnabled ? undefined : "Enable",
      });

      // Google Calendar
      const calStatus = integrationStatuses["google-calendar"];
      const calWorking = calStatus?.working || calStatus?.configured;
      cards.push({
        id: "google-calendar",
        title: "Google Calendar",
        description: "See your schedule, get meeting prep, and manage events.",
        icon: "\u{1F4C5}",
        status: calWorking ? "active" : "available",
        detail: calWorking ? "Connected" : undefined,
        action: calWorking ? undefined : "Connect",
      });

      // GitHub
      const ghStatus = integrationStatuses["github"];
      const ghWorking = ghStatus?.working || ghStatus?.configured;
      cards.push({
        id: "github",
        title: "GitHub",
        description: "PR reviews, issue tracking, and repo intelligence.",
        icon: "\u{1F4BB}",
        status: ghWorking ? "active" : "available",
        detail: ghWorking ? "Connected" : undefined,
        action: ghWorking ? undefined : "Connect",
      });

      // Obsidian Vault
      let vaultConfigured = false;
      try {
        const vaultPaths = [
          join(homedir(), "Documents", "VAULT"),
          join(homedir(), "Documents", "Obsidian"),
        ];
        vaultConfigured = vaultPaths.some((p) => existsSync(p));
      } catch { /* ignore */ }
      cards.push({
        id: "obsidian-vault",
        title: "Second Brain",
        description: "Connect your Obsidian vault for persistent AI memory.",
        icon: "\u{1F9E0}",
        status: vaultConfigured ? "active" : "available",
        detail: vaultConfigured ? "Vault detected" : undefined,
        action: vaultConfigured ? undefined : "Connect",
      });

      // Agent Queue
      cards.push({
        id: "agent-queue",
        title: "Agent Queue",
        description: "Delegate tasks to background agents that work while you don't.",
        icon: "\u{1F916}",
        status: "available",
        action: "Learn More",
      });

      // Safety Gates (always active)
      cards.push({
        id: "safety-gates",
        title: "Safety Gates",
        description: "Loop breaker, prompt shield, and output guardrails protecting you.",
        icon: "\u{1F6E1}\uFE0F",
        status: "active",
        detail: "4 gates active",
      });

      // Smart Memory
      cards.push({
        id: "smart-memory",
        title: "Smart Memory",
        description: "Your ally remembers context across sessions and conversations.",
        icon: "\u{1F4AD}",
        status: state.secondBrain?.memorySeeded ? "active" : "available",
        action: state.secondBrain?.memorySeeded ? undefined : "Set Up Identity",
      });

      const activeCount = cards.filter((c) => c.status === "active").length;
      const percentComplete = Math.round((activeCount / cards.length) * 100);

      respond(true, { capabilities: cards, percentComplete });
    } catch (err) {
      respond(false, undefined, {
        code: "CAPABILITIES_ERROR",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },

  /**
   * Get current onboarding status. Returns the full state.
   */
  "onboarding.status": async ({ respond }) => {
    const state = await readOnboarding();
    respond(true, state);
  },

  /**
   * Deep-merge update to onboarding state.
   * Accepts any partial updates for any phase data.
   */
  "onboarding.update": async ({ params, respond, context }) => {
    const state = await readOnboarding();

    // Phase advancement
    if (typeof params.phase === "number" && params.phase >= 0 && params.phase <= 6) {
      state.phase = params.phase as OnboardingPhase;
    }

    // Ally name (user naming their AI ally)
    if (typeof params.allyName === "string" && params.allyName.trim()) {
      state.allyName = params.allyName.trim();
      // Clear cached ally name so it picks up the new value immediately
      try {
        const { clearAllyNameCache } = await import("../lib/ally-identity.js");
        clearAllyNameCache();
      } catch { /* best-effort */ }
    }

    // Legacy: identity (backward compat)
    if (params.identity && typeof params.identity === "object") {
      const id = params.identity as Record<string, unknown>;
      state.identity = {
        name: String(id.name ?? state.identity?.name ?? ""),
        mission: String(id.mission ?? state.identity?.mission ?? ""),
        emoji: String(id.emoji ?? state.identity?.emoji ?? ""),
      };
    }

    // Legacy: tools array
    if (Array.isArray(params.tools)) {
      state.tools = params.tools as OnboardingState["tools"];
    }

    // Legacy: summary
    if (params.summary && typeof params.summary === "object") {
      state.summary = params.summary as OnboardingState["summary"];
    }

    // Deep onboarding: interview
    if (params.interview && typeof params.interview === "object") {
      state.interview = deepMerge(
        state.interview ?? { name: "", completed: false },
        params.interview as Record<string, unknown>,
      );
      // Sync identity from interview
      if (state.interview.name && !state.identity) {
        state.identity = {
          name: state.interview.name,
          mission: state.interview.mission ?? "",
          emoji: state.interview.emoji ?? "\u{1F680}",
        };
      }
    }

    // Deep onboarding: secondBrain
    if (params.secondBrain && typeof params.secondBrain === "object") {
      state.secondBrain = deepMerge(
        state.secondBrain ?? { memorySeeded: false, dailyBriefConfigured: false, completed: false },
        params.secondBrain as Record<string, unknown>,
      );
    }

    // Deep onboarding: audit
    if (params.audit && typeof params.audit === "object") {
      const auditParam = params.audit as Record<string, unknown>;
      // Support both old { findings: [] } and new { mappings: [], ... } format
      if (Array.isArray(auditParam.findings)) {
        // Legacy format — no-op for deep onboarding, keep for compat
      }
      if (auditParam.mappings || auditParam.recommendedTrustWorkflows) {
        state.audit = deepMerge(
          state.audit ?? { mappings: [], recommendedTrustWorkflows: [], completed: false },
          auditParam,
        );
      }
    }

    // Deep onboarding: configuration
    if (params.configuration && typeof params.configuration === "object") {
      state.configuration = deepMerge(
        state.configuration ?? { changes: [], completed: false },
        params.configuration as Record<string, unknown>,
      );
    }

    // Deep onboarding: firstWin
    if (params.firstWin && typeof params.firstWin === "object") {
      state.firstWin = deepMerge(
        state.firstWin ?? { demoType: "daily-brief" as const, completed: false },
        params.firstWin as Record<string, unknown>,
      ) as typeof state.firstWin;
    }

    // Deep onboarding: grandReveal
    if (params.grandReveal && typeof params.grandReveal === "object") {
      state.grandReveal = params.grandReveal as OnboardingState["grandReveal"];
    }

    // Phase completion tracking
    if (typeof params.completePhase === "number") {
      if (!state.completedPhases.includes(params.completePhase)) {
        state.completedPhases.push(params.completePhase);
        state.completedPhases.sort();
      }
    }

    await writeOnboarding(state);

    try {
      context?.broadcast?.("onboarding:update", state);
    } catch { /* broadcast best-effort */ }

    respond(true, state);
  },

  /**
   * Mark onboarding as complete. Writes final timestamp and phase 6.
   */
  "onboarding.complete": async ({ params, respond, context }) => {
    const state = await readOnboarding();
    state.phase = 6;
    state.completedAt = new Date().toISOString();

    if (!state.completedPhases.includes(6)) {
      state.completedPhases.push(6);
      state.completedPhases.sort();
    }

    // Accept grand reveal summary
    if (params.grandReveal && typeof params.grandReveal === "object") {
      state.grandReveal = params.grandReveal as OnboardingState["grandReveal"];
    }

    // Accept legacy summary
    if (params.summary && typeof params.summary === "object") {
      state.summary = params.summary as OnboardingState["summary"];
    }

    await writeOnboarding(state);

    // Auto-configure roster based on onboarding answers
    try {
      const rosterConfig = await generateRosterConfig(state);
      try {
        context?.broadcast?.("roster:configured", rosterConfig);
      } catch { /* broadcast best-effort */ }
    } catch {
      // Non-fatal — roster config generation failure doesn't block onboarding
    }

    try {
      context?.broadcast?.("onboarding:update", state);
    } catch { /* broadcast best-effort */ }

    respond(true, state);
  },

  /**
   * Reset onboarding to Phase 0. Used for "start over" or testing.
   */
  "onboarding.reset": async ({ respond, context }) => {
    const state = emptyOnboardingState();
    await writeOnboarding(state);

    try {
      context?.broadcast?.("onboarding:update", state);
    } catch { /* broadcast best-effort */ }

    respond(true, state);
  },

  /**
   * Run the configuration assessment scanner.
   * Reads the user's OC config, memory, auth, channels, skills and produces
   * a health score (0-100) with detailed findings.
   */
  "onboarding.assess": async ({ respond, context }) => {
    const assessment = await runAssessment();

    // Store in state
    const state = await readOnboarding();
    state.assessment = assessment;
    await writeOnboarding(state);

    try {
      context?.broadcast?.("onboarding:update", state);
    } catch { /* broadcast best-effort */ }

    respond(true, { assessment });
  },

  /**
   * Generate workflow-to-capability recommendations based on interview data.
   * Takes the user's workflows and pain points and maps them to OC features.
   */
  "onboarding.recommend": async ({ params, respond }) => {
    const workflows = Array.isArray(params.workflows) ? (params.workflows as string[]) : [];
    const painPoints = Array.isArray(params.painPoints) ? (params.painPoints as string[]) : [];
    const tools = Array.isArray(params.tools) ? (params.tools as string[]) : [];

    // Simple capability mapping based on keywords
    const mappings = workflows.map((workflow) => {
      const wf = workflow.toLowerCase();
      const capabilities: string[] = [];
      const recommendedSkills: string[] = [];
      const automations: string[] = [];

      // Email-related
      if (wf.includes("email") || wf.includes("draft") || wf.includes("inbox")) {
        capabilities.push("channels (email)", "memory search", "skills");
        recommendedSkills.push("email-drafter", "inbox-triage");
        automations.push("cron: morning inbox summary");
      }

      // Code/dev-related
      if (wf.includes("code") || wf.includes("review") || wf.includes("pr") || wf.includes("dev")) {
        capabilities.push("sub-agents", "extended thinking", "background queue");
        recommendedSkills.push("code-review", "git-workflow");
      }

      // Meeting-related
      if (wf.includes("meeting") || wf.includes("prep") || wf.includes("call")) {
        capabilities.push("calendar", "memory search", "daily brief");
        recommendedSkills.push("meeting-prep", "note-taker");
        automations.push("cron: pre-meeting brief");
      }

      // Writing/content
      if (wf.includes("writ") || wf.includes("content") || wf.includes("blog") || wf.includes("doc")) {
        capabilities.push("extended thinking", "memory search", "skills");
        recommendedSkills.push("long-form-writer", "content-planner");
      }

      // Research
      if (wf.includes("research") || wf.includes("analys")) {
        capabilities.push("sub-agents", "extended thinking", "web search");
        recommendedSkills.push("research-agent", "competitive-intel");
      }

      // Planning/management
      if (wf.includes("plan") || wf.includes("project") || wf.includes("manag")) {
        capabilities.push("memory", "daily brief", "background queue");
        recommendedSkills.push("project-tracker", "weekly-review");
        automations.push("cron: weekly review prompt");
      }

      // Default capabilities for any workflow
      if (capabilities.length === 0) {
        capabilities.push("memory search", "extended thinking");
      }

      return {
        workflow,
        capabilities: [...new Set(capabilities)],
        recommendedSkills: [...new Set(recommendedSkills)],
        automations: [...new Set(automations)],
      };
    });

    // Suggest Trust Tracker categories (top 5 from workflows)
    const recommendedTrustWorkflows = workflows.slice(0, 5);

    respond(true, { mappings, recommendedTrustWorkflows });
  },

  /**
   * Audit the user's OC config and generate specific recommendations.
   * Returns prioritized list of config changes needed for optimal GodMode.
   * Used during Phase 4 (Configure & Tune) of onboarding.
   */
  "onboarding.configAudit": async ({ respond, context }) => {
    const recommendations = await generateConfigRecommendations();

    const critical = recommendations.filter((r) => r.priority === "critical");
    const recommended = recommendations.filter((r) => r.priority === "recommended");
    const optional = recommendations.filter((r) => r.priority === "optional");

    // Store recommendations in onboarding state as pending config changes
    const state = await readOnboarding();
    state.configuration = state.configuration ?? { changes: [], completed: false };
    state.configuration.changes = recommendations.map((r) => ({
      key: r.key,
      label: r.label,
      from: r.currentValue,
      to: r.recommendedValue,
      applied: false,
    }));
    await writeOnboarding(state);

    try {
      context?.broadcast?.("onboarding:update", state);
    } catch { /* broadcast best-effort */ }

    respond(true, {
      total: recommendations.length,
      critical,
      recommended,
      optional,
      message: critical.length > 0
        ? `Found ${critical.length} critical and ${recommended.length} recommended config changes.`
        : recommendations.length > 0
          ? `Found ${recommendations.length} recommendations to optimize your setup.`
          : "Your config looks good! No changes needed.",
    });
  },

  // ── Quick Setup (80/20 fast onboarding) ────────────────────────

  /**
   * Quick setup: name only → identity saved, auto-navigate to Chat.
   * Called from the Setup tab for instant onboarding.
   * This handler is registered WITHOUT license gate so new users can use it.
   */
  "onboarding.quickSetup": async ({ params, respond, context }) => {
    const name = typeof params.name === "string" ? params.name.trim() : "";
    if (!name) {
      respond(false, null, { code: "INVALID_REQUEST", message: "name is required" });
      return;
    }

    const state = await readOnboarding();

    // Save identity
    state.identity = {
      name,
      mission: "",
      emoji: "\u{1F680}",
    };
    state.interview = {
      ...state.interview,
      name,
      completed: false,
    };

    // Mark phases 0-4 as complete (quick setup skips to First Win)
    if (!state.completedPhases.includes(0)) state.completedPhases.push(0);
    if (!state.completedPhases.includes(1)) state.completedPhases.push(1);
    if (!state.completedPhases.includes(2)) state.completedPhases.push(2);
    if (!state.completedPhases.includes(3)) state.completedPhases.push(3);
    if (!state.completedPhases.includes(4)) state.completedPhases.push(4);
    state.completedPhases.sort();
    // Jump straight to Phase 5 (First Win) so the user sees a brief immediately
    if (state.phase < 5) state.phase = 5 as OnboardingPhase;

    if (!state.startedAt) {
      state.startedAt = new Date().toISOString();
    }

    await writeOnboarding(state);

    // Write a minimal USER.md so the awareness snapshot knows the user's name
    try {
      const userMdPath = join(GODMODE_ROOT, "USER.md");
      if (!existsSync(userMdPath)) {
        await secureMkdir(GODMODE_ROOT);
        await secureWriteFile(
          userMdPath,
          `# USER.md - About Your Human\n\n- **Name:** ${name}\n`,
        );
      }
      invalidateIdentityCache();
    } catch {
      // Non-fatal — name will be picked up on next full onboarding
    }

    try {
      context?.broadcast?.("onboarding:update", state);
    } catch { /* broadcast best-effort */ }

    respond(true, { state });
  },

  /**
   * Activate a license key by writing it to openclaw.json.
   * This handler is registered WITHOUT license gate so new users can use it.
   * For dev keys (GM-DEV-*), also updates the in-memory license state.
   */
  "onboarding.activateLicense": async ({ params, respond }) => {
    const key = typeof params.key === "string" ? params.key.trim() : "";
    if (!key || !key.startsWith("GM-")) {
      respond(false, null, {
        code: "INVALID_KEY",
        message: "License key must start with GM-",
      });
      return;
    }

    // Locate openclaw.json
    const stateDir = process.env.OPENCLAW_STATE_DIR || join(homedir(), ".openclaw");
    const configPath = join(stateDir, "openclaw.json");

    try {
      // Read existing config
      let config: Record<string, unknown> = {};
      try {
        const raw = await readFile(configPath, "utf-8");
        config = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        // Config may not exist yet — create it
      }

      // Deep-set plugins.entries.godmode.config.licenseKey
      if (!config.plugins || typeof config.plugins !== "object") {
        config.plugins = {};
      }
      const plugins = config.plugins as Record<string, unknown>;
      plugins.enabled = true;
      if (!plugins.entries || typeof plugins.entries !== "object") {
        plugins.entries = {};
      }
      const entries = plugins.entries as Record<string, unknown>;
      if (!entries.godmode || typeof entries.godmode !== "object") {
        entries.godmode = {};
      }
      const godmode = entries.godmode as Record<string, unknown>;
      godmode.enabled = true;
      if (!godmode.config || typeof godmode.config !== "object") {
        godmode.config = {};
      }
      const godmodeConfig = godmode.config as Record<string, unknown>;
      godmodeConfig.licenseKey = key;

      // Also ensure gateway basics
      if (!config.gateway || typeof config.gateway !== "object") {
        config.gateway = {};
      }
      const gateway = config.gateway as Record<string, unknown>;
      if (!gateway.mode) gateway.mode = "local";
      if (!gateway.controlUi || typeof gateway.controlUi !== "object") {
        gateway.controlUi = {};
      }
      (gateway.controlUi as Record<string, unknown>).enabled = true;

      // Auto-generate a gateway auth token if one doesn't exist
      // Supports both gateway.token (legacy) and gateway.auth.token (standard)
      let gatewayTokenGenerated = false;
      const existingAuth = gateway.auth as Record<string, unknown> | undefined;
      const hasExistingToken = Boolean(gateway.token) || Boolean(existingAuth?.token);
      if (!hasExistingToken) {
        if (!gateway.auth || typeof gateway.auth !== "object") {
          gateway.auth = {};
        }
        const gwAuth = gateway.auth as Record<string, unknown>;
        gwAuth.mode = "token";
        gwAuth.token = randomBytes(32).toString("hex");
        gatewayTokenGenerated = true;
      }

      // Write back
      await secureMkdir(stateDir);
      await secureWriteFile(configPath, JSON.stringify(config, null, 2) + "\n");

      const isDevKey = key.startsWith("GM-DEV-") || key === "GM-INTERNAL";
      const tokenNote = gatewayTokenGenerated
        ? " Gateway security token auto-generated."
        : "";
      respond(true, {
        saved: true,
        configPath,
        isDevKey,
        gatewayTokenGenerated,
        needsRestart: true,
        message: isDevKey
          ? `Dev license activated.${tokenNote} Gateway restart recommended to apply.`
          : `License saved.${tokenNote} Restart the gateway to activate: openclaw gateway restart`,
      });
    } catch (err) {
      respond(false, null, {
        code: "WRITE_FAILED",
        message: `Failed to write config: ${err instanceof Error ? err.message : "unknown error"}. Try running: openclaw godmode activate ${key}`,
      });
    }
  },

  // ── Setup Flow (5-step simplified onboarding) ──────────────────

  /**
   * Get setup progress by checking actual system state.
   * Derives currentStep, completedSteps, and integration status.
   */
  "onboarding.setupProgress": async ({ respond }) => {
    try {
      const progress = await deriveSetupProgress();
      respond(true, progress);
    } catch (err) {
      respond(false, undefined, {
        code: "SETUP_PROGRESS_ERROR",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },

  /**
   * Configure a specific setup step.
   * Writes values to onboarding.json and/or .env as appropriate.
   */
  "onboarding.setupConfigure": async ({ params, respond, context }) => {
    const step = params.step as SetupStep | undefined;
    const values = (params.values as Record<string, string>) ?? {};

    if (!step || !SETUP_STEPS.some((s) => s.step === step)) {
      respond(false, undefined, {
        code: "INVALID_STEP",
        message: `Invalid setup step: ${String(step)}. Valid steps: ${SETUP_STEPS.map((s) => s.step).join(", ")}`,
      });
      return;
    }

    try {
      const state = await readOnboarding();

      switch (step) {
        case "welcome": {
          const name = values.name?.trim();
          const timezone = values.timezone?.trim();
          if (!name) {
            respond(false, undefined, { code: "MISSING_NAME", message: "name is required for the welcome step" });
            return;
          }
          // Save to onboarding state
          state.interview = {
            ...state.interview,
            name,
            completed: state.interview?.completed ?? false,
          };
          state.identity = {
            name,
            mission: state.identity?.mission ?? "",
            emoji: state.identity?.emoji ?? "\u{1F680}",
          };
          if (!state.startedAt) state.startedAt = new Date().toISOString();

          // Write USER.md for awareness snapshot
          try {
            const userMdPath = join(GODMODE_ROOT, "USER.md");
            if (!existsSync(userMdPath)) {
              await secureMkdir(GODMODE_ROOT);
              await secureWriteFile(
                userMdPath,
                `# USER.md - About Your Human\n\n- **Name:** ${name}\n${timezone ? `- **Timezone:** ${timezone}\n` : ""}`,
              );
            }
            invalidateIdentityCache();
          } catch { /* non-fatal */ }

          // Save timezone to .env if provided
          if (timezone) {
            writeEnvVar("TZ", timezone);
          }

          // Ally name
          if (values.allyName?.trim()) {
            state.allyName = values.allyName.trim();
            try {
              const { clearAllyNameCache } = await import("../lib/ally-identity.js");
              clearAllyNameCache();
            } catch { /* best-effort */ }
          }
          break;
        }

        case "api-key": {
          const apiKey = values.ANTHROPIC_API_KEY?.trim();
          if (!apiKey) {
            respond(false, undefined, { code: "MISSING_KEY", message: "ANTHROPIC_API_KEY is required" });
            return;
          }
          writeEnvVar("ANTHROPIC_API_KEY", apiKey);
          break;
        }

        case "memory": {
          const honchoKey = values.HONCHO_API_KEY?.trim();
          if (!honchoKey) {
            respond(false, undefined, { code: "MISSING_KEY", message: "HONCHO_API_KEY is required" });
            return;
          }
          writeEnvVar("HONCHO_API_KEY", honchoKey);
          break;
        }

        case "integrations": {
          const composioKey = values.COMPOSIO_API_KEY?.trim();
          if (!composioKey) {
            respond(false, undefined, { code: "MISSING_KEY", message: "COMPOSIO_API_KEY is required" });
            return;
          }
          writeEnvVar("COMPOSIO_API_KEY", composioKey);
          break;
        }

        case "screenpipe": {
          // Screenpipe is auto-detected — configure just marks it acknowledged
          // No env var needed; detection happens via localhost:3030 health check
          break;
        }

        case "second-brain": {
          const vaultPath = values.OBSIDIAN_VAULT_PATH?.trim();
          if (!vaultPath) {
            respond(false, undefined, { code: "MISSING_PATH", message: "OBSIDIAN_VAULT_PATH is required" });
            return;
          }
          // Validate the path exists
          if (!existsSync(vaultPath)) {
            respond(false, undefined, { code: "INVALID_PATH", message: `Path does not exist: ${vaultPath}` });
            return;
          }
          writeEnvVar("OBSIDIAN_VAULT_PATH", vaultPath);
          state.secondBrain = {
            ...state.secondBrain,
            obsidianPath: vaultPath,
            memorySeeded: state.secondBrain?.memorySeeded ?? false,
            dailyBriefConfigured: state.secondBrain?.dailyBriefConfigured ?? false,
            completed: state.secondBrain?.completed ?? false,
          };
          break;
        }
      }

      await writeOnboarding(state);

      try {
        context?.broadcast?.("onboarding:update", state);
      } catch { /* broadcast best-effort */ }

      // Re-derive progress after the update
      const progress = await deriveSetupProgress();
      respond(true, progress);
    } catch (err) {
      respond(false, undefined, {
        code: "SETUP_CONFIGURE_ERROR",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },

  /**
   * Dismiss the setup flow — user wants to do it later.
   */
  "onboarding.setupDismiss": async ({ respond }) => {
    try {
      const state = await readOnboarding();
      // Store dismissed flag — we'll use a custom field on the state
      // Store in a way that deriveSetupProgress can read it
      const dismissedPath = join(DATA_DIR, "setup-dismissed.json");
      await secureMkdir(DATA_DIR);
      await secureWriteFile(dismissedPath, JSON.stringify({ dismissed: true, at: new Date().toISOString() }) + "\n");
      respond(true, { dismissed: true });
    } catch (err) {
      respond(false, undefined, {
        code: "DISMISS_ERROR",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },

  /**
   * Test a specific setup integration to verify it works.
   */
  "onboarding.setupTest": async ({ params, respond }) => {
    const step = params.step as SetupStep | undefined;
    if (!step || !SETUP_STEPS.some((s) => s.step === step)) {
      respond(false, undefined, {
        code: "INVALID_STEP",
        message: `Invalid setup step: ${String(step)}`,
      });
      return;
    }

    try {
      switch (step) {
        case "api-key": {
          const key = getEnvVar("ANTHROPIC_API_KEY");
          if (!key) {
            respond(true, { success: false, message: "No ANTHROPIC_API_KEY found in environment or .env file." });
            return;
          }
          // Validate key format (sk-ant-...)
          if (key.startsWith("sk-ant-") || key.startsWith("sk-")) {
            respond(true, { success: true, message: "Anthropic API key is configured and has valid format." });
          } else {
            respond(true, { success: false, message: "ANTHROPIC_API_KEY exists but doesn't match expected format (sk-ant-... or sk-...)." });
          }
          return;
        }

        case "memory": {
          const key = getEnvVar("HONCHO_API_KEY");
          if (!key) {
            respond(true, { success: false, message: "No HONCHO_API_KEY found in environment or .env file." });
            return;
          }
          respond(true, { success: true, message: "Honcho API key is configured." });
          return;
        }

        case "integrations": {
          const key = getEnvVar("COMPOSIO_API_KEY");
          if (!key) {
            respond(true, { success: false, message: "No COMPOSIO_API_KEY found in environment or .env file." });
            return;
          }
          // Try initializing Composio client
          try {
            const { init } = await import("../services/composio-client.js");
            await init(key);
            respond(true, { success: true, message: "Composio API key is valid and client initialized." });
          } catch (err) {
            respond(true, { success: false, message: `Composio key found but init failed: ${err instanceof Error ? err.message : String(err)}` });
          }
          return;
        }

        case "screenpipe": {
          try {
            const resp = await fetch("http://localhost:3030/health", { signal: AbortSignal.timeout(3_000) });
            if (resp.ok) {
              respond(true, { success: true, message: "Screenpipe is running and healthy. Screen & audio memory active." });
            } else {
              respond(true, { success: false, message: `Screenpipe returned status ${resp.status}. Try restarting it with \`screenpipe\`.` });
            }
          } catch {
            respond(true, { success: false, message: "Screenpipe not running. Install with `brew install screenpipe` (macOS) then run `screenpipe` to start." });
          }
          return;
        }

        case "second-brain": {
          const vaultPath = getEnvVar("OBSIDIAN_VAULT_PATH");
          if (!vaultPath) {
            respond(true, { success: false, message: "No OBSIDIAN_VAULT_PATH configured." });
            return;
          }
          if (!existsSync(vaultPath)) {
            respond(true, { success: false, message: `Path does not exist: ${vaultPath}` });
            return;
          }
          // Check for .md files
          try {
            const { readdirSync } = await import("node:fs");
            const files = readdirSync(vaultPath);
            const mdFiles = files.filter((f: string) => f.endsWith(".md"));
            if (mdFiles.length > 0) {
              respond(true, { success: true, message: `Obsidian vault found with ${mdFiles.length} markdown files.` });
            } else {
              respond(true, { success: true, message: "Vault path exists but contains no .md files yet. That's OK — GodMode will create them." });
            }
          } catch {
            respond(true, { success: false, message: `Cannot read directory: ${vaultPath}` });
          }
          return;
        }

        case "welcome": {
          // Welcome step doesn't need testing — it's just name/timezone
          respond(true, { success: true, message: "Welcome step doesn't require a connectivity test." });
          return;
        }
      }
    } catch (err) {
      respond(true, { success: false, message: `Test failed: ${err instanceof Error ? err.message : String(err)}` });
    }
  },

  // ── Memory Onboarding Wizard Handlers ───────────────────────────

  /**
   * Check workspace status: which memory files exist/are missing.
   * Used by the UI wizard to detect if onboarding is needed.
   */
  "onboarding.wizard.status": async ({ respond }) => {
    const status = await checkOnboardingStatus(GODMODE_ROOT);
    respond(true, { ...status, workspacePath: GODMODE_ROOT });
  },

  /**
   * Preview what the wizard would generate (without writing anything).
   * Returns a list of files + config changes for the review screen.
   */
  "onboarding.wizard.preview": async ({ params, respond }) => {
    const answers = parseWizardAnswers(params);
    const preview = await previewOnboarding(answers, GODMODE_ROOT);
    respond(true, preview);
  },

  /**
   * Compute a config diff between user's current OC config and GodMode's recommendations.
   * Read-only — never writes anything. Used by the review screen to show what would change.
   */
  "onboarding.wizard.diff": async ({ params, respond }) => {
    const answers = parseWizardAnswers(params);
    const diff = await computeConfigDiff(answers);
    respond(true, diff);
  },

  /**
   * Run the wizard: generate all workspace files and patch OC config.
   * Accepts the 8 onboarding answers from the UI form.
   * Optional skipFiles/skipKeys for selective generation (existing user path).
   */
  "onboarding.wizard.generate": async ({ params, respond, context }) => {
    const answers = parseWizardAnswers(params);
    const force = Boolean(params.force);
    const shouldPatchConfig = params.patchConfig !== false;
    const skipFiles = Array.isArray(params.skipFiles) ? (params.skipFiles as string[]) : [];
    const skipKeys = Array.isArray(params.skipKeys) ? (params.skipKeys as string[]) : [];

    // If soul profile data exists in onboarding state, merge it into answers
    const state0 = await readOnboarding();
    if (state0.interview?.soulProfile && !answers.soulProfile) {
      answers.soulProfile = state0.interview.soulProfile as OnboardingAnswers["soulProfile"];
    }

    // Generate workspace files (skip user-deselected files)
    const fileResults = await generateWorkspaceFiles(answers, GODMODE_ROOT, { force, skipFiles });
    const created = fileResults.filter((f) => f.created).length;
    const skipped = fileResults.filter((f) => f.skipped).length;

    // Patch OC config (skip user-deselected config keys)
    let configResult: { patched: boolean; error?: string } = { patched: false };
    if (shouldPatchConfig) {
      configResult = await patchOCConfig(answers, undefined, { skipKeys });
    }

    // Update onboarding state to reflect wizard completion
    const state = await readOnboarding();
    state.interview = {
      name: answers.name,
      role: answers.focus,
      mission: answers.focus,
      workflows: answers.projects,
      completed: true,
    };
    state.secondBrain = {
      memorySeeded: true,
      dailyBriefConfigured: false,
      completed: true,
    };
    state.identity = {
      name: answers.name,
      mission: answers.focus,
      emoji: "\u{1F680}",
    };
    if (!state.completedPhases.includes(1)) state.completedPhases.push(1);
    if (!state.completedPhases.includes(2)) state.completedPhases.push(2);
    state.completedPhases.sort();
    if (state.phase < 3) state.phase = 3 as OnboardingPhase;
    await writeOnboarding(state);

    // Auto-configure roster based on wizard answers
    try {
      await generateRosterConfig(state);
    } catch {
      // Non-fatal
    }

    try {
      context?.broadcast?.("onboarding:update", state);
      context?.broadcast?.("onboarding:wizard-complete", {
        filesCreated: created,
        filesSkipped: skipped,
        configPatched: configResult.patched,
      });
    } catch { /* broadcast best-effort */ }

    respond(true, {
      success: true,
      filesCreated: created,
      filesSkipped: skipped,
      files: fileResults.map((f) => ({
        path: f.path,
        created: f.created,
        skipped: f.skipped,
      })),
      configPatched: configResult.patched,
      configError: configResult.error,
      workspacePath: GODMODE_ROOT,
    });
  },
};

// ── Wizard Param Parser ──────────────────────────────────────────

/**
 * Extract OnboardingAnswers from raw RPC params, delegating all
 * validation, defaults, and length limits to sanitizeAnswers().
 */
function parseWizardAnswers(params: Record<string, unknown>): OnboardingAnswers {
  return sanitizeAnswers({
    name: typeof params.name === "string" ? params.name : undefined,
    timezone: typeof params.timezone === "string" ? params.timezone : undefined,
    focus: typeof params.focus === "string" ? params.focus : undefined,
    projects: Array.isArray(params.projects) ? (params.projects as string[]) : undefined,
    commStyle: typeof params.commStyle === "string" ? params.commStyle : undefined,
    hardRules: Array.isArray(params.hardRules) ? (params.hardRules as string[]) : undefined,
    keyPeople: Array.isArray(params.keyPeople) ? (params.keyPeople as string[]) : undefined,
    defaultModel: typeof params.defaultModel === "string" ? params.defaultModel : undefined,
  });
}
