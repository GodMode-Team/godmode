/**
 * Onboarding Gateway Methods — Deep Onboarding System
 *
 * Manages the 7-phase consultative onboarding for GodMode users:
 *   Phase 0: Assessment (config health score, gap analysis)
 *   Phase 1: Interview (name, role, mission, workflows, pain points)
 *   Phase 2: Second Brain (memory setup, Obsidian, daily brief)
 *   Phase 3: Workflow Audit (capability mapping, skill recommendations)
 *   Phase 4: Configuration (apply optimal settings)
 *   Phase 5: First Win (demo daily brief + focus pulse)
 *   Phase 6: Grand Reveal (summary, before/after)
 *
 * State persisted to ~/godmode/data/onboarding.json
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import {
  type OnboardingState,
  type OnboardingPhase,
  emptyOnboardingState,
} from "./onboarding-types.js";
import { runAssessment } from "./onboarding-scanner.js";

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
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ONBOARDING_FILE, JSON.stringify(state, null, 2) + "\n");
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

// ── Handlers ─────────────────────────────────────────────────────

export const onboardingHandlers: GatewayRequestHandlers = {
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
        state.firstWin ?? { demoType: "daily-brief", completed: false },
        params.firstWin as Record<string, unknown>,
      );
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
    } catch {
      // broadcast not available in all contexts
    }

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

    try {
      context?.broadcast?.("onboarding:update", state);
    } catch {}

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
    } catch {}

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
    } catch {}

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
        capabilities.push("sub-agents", "extended thinking", "coding orchestrator");
        recommendedSkills.push("code-review", "git-workflow");
        automations.push("coding task: PR reviews");
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
        capabilities.push("memory", "daily brief", "focus pulse");
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
};
