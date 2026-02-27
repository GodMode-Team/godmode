/**
 * onboarding-context.ts — Prompt hook for deep onboarding.
 *
 * Injects phase-specific guidance into the agent's system prompt so it knows
 * how to lead the user through each onboarding phase conversationally.
 *
 * Returns null when onboarding is complete (no injection).
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { OnboardingState } from "../methods/onboarding-types.js";

const ONBOARDING_FILE = join(DATA_DIR, "onboarding.json");

async function readOnboardingState(): Promise<OnboardingState | null> {
  try {
    const raw = await readFile(ONBOARDING_FILE, "utf-8");
    return JSON.parse(raw) as OnboardingState;
  } catch {
    return null;
  }
}

function phasePrompt(state: OnboardingState): string | null {
  const phase = state.phase;

  // Phase 6+ or completed = no injection
  if (phase >= 6 || state.completedAt) return null;

  switch (phase) {
    case 0:
      return buildPhase0Prompt(state);
    case 1:
      return buildPhase1Prompt(state);
    case 2:
      return buildPhase2Prompt(state);
    case 3:
      return buildPhase3Prompt(state);
    case 4:
      return buildPhase4Prompt(state);
    case 5:
      return buildPhase5Prompt(state);
    default:
      return null;
  }
}

function buildPhase0Prompt(state: OnboardingState): string {
  const assessment = state.assessment;
  if (!assessment) {
    return `## GodMode Onboarding — Phase 0: Assessment

The user is starting GodMode onboarding. Run the assessment first:
- Call \`onboarding.assess\` to scan their current configuration
- Present the health score and highlight gaps
- When they're ready, advance to Phase 1 with \`onboarding.update { phase: 1 }\`

Be encouraging — even a low score means there's a lot of value to unlock.`;
  }

  const score = assessment.healthScore;
  const gaps: string[] = [];
  if (assessment.authMethod === "none") gaps.push("No auth configured");
  if (!assessment.memoryStatus.hasMemoryMd) gaps.push("No MEMORY.md");
  if (assessment.channelsConnected.length === 0) gaps.push("No channels connected");
  if (assessment.skillsInstalled.length === 0) gaps.push("No skills installed");
  const disabledFeatures = assessment.features.filter((f) => !f.enabled);
  if (disabledFeatures.length > 0) {
    gaps.push(`Disabled features: ${disabledFeatures.map((f) => f.label).join(", ")}`);
  }

  return `## GodMode Onboarding — Phase 0: Assessment Complete

Health score: ${score}/100
${gaps.length > 0 ? `Gaps found:\n${gaps.map((g) => `- ${g}`).join("\n")}` : "Looking good! No major gaps."}

Present the score to the user. Explain what each gap means and how we'll fix it during onboarding.
When ready, advance to Phase 1 with \`onboarding.update { phase: 1 }\`.`;
}

function buildPhase1Prompt(state: OnboardingState): string {
  const interview = state.interview;
  const answered: string[] = [];
  const pending: string[] = [];

  if (interview?.name) answered.push("name");
  else pending.push("name (What should I call you?)");

  if (interview?.role) answered.push("role");
  else pending.push("role (What do you do? CEO, developer, designer, etc.)");

  if (interview?.mission) answered.push("mission");
  else pending.push("mission (One sentence — what are you building toward?)");

  if (interview?.dailyRoutine) answered.push("daily routine");
  else pending.push("daily routine (Walk me through a typical work day)");

  if (interview?.tools && interview.tools.length > 0) answered.push("tools");
  else pending.push("tools (What tools/apps do you use daily?)");

  if (interview?.painPoints && interview.painPoints.length > 0) answered.push("pain points");
  else pending.push("pain points (What takes too long or frustrates you?)");

  if (interview?.workflows && interview.workflows.length > 0) answered.push("workflows");
  else pending.push("workflows (Name 3-5 categories of tasks you do regularly)");

  if (interview?.teamOrSolo) answered.push("team/solo");
  else pending.push("team/solo (Do you work solo, with a team, or both?)");

  return `## GodMode Onboarding — Phase 1: Interview

Have a natural conversation to learn about the user. Save answers incrementally using \`onboarding.update\`.

${answered.length > 0 ? `Already collected: ${answered.join(", ")}` : "No data collected yet."}
${pending.length > 0 ? `Still needed:\n${pending.map((p) => `- ${p}`).join("\n")}` : "All questions answered!"}

Ask questions conversationally — don't fire them all at once. Save each answer as you get it:
\`onboarding.update { interview: { name: "...", role: "...", ... } }\`

When all key fields are filled (at minimum: name, workflows, pain points), advance to Phase 2.`;
}

function buildPhase2Prompt(state: OnboardingState): string {
  const brain = state.secondBrain;
  return `## GodMode Onboarding — Phase 2: Second Brain Setup

Help the user set up their memory system.

Status:
- Memory seeded: ${brain?.memorySeeded ? "Yes" : "No"}
- Daily brief configured: ${brain?.dailyBriefConfigured ? "Yes" : "No"}
${brain?.obsidianPath ? `- Obsidian vault: ${brain.obsidianPath}` : "- No Obsidian vault linked"}

Tasks:
1. Check if ~/godmode/memory/MEMORY.md exists and has content
2. If sparse, help seed it with info from the interview (name, role, mission, preferences)
3. Ask if they use Obsidian — if yes, note the vault path
4. Check if daily brief is configured; if not, help set it up

Save progress with \`onboarding.update { secondBrain: { ... } }\`.
When complete, advance to Phase 3.`;
}

function buildPhase3Prompt(state: OnboardingState): string {
  const interview = state.interview;
  const workflows = interview?.workflows ?? [];
  const painPoints = interview?.painPoints ?? [];
  const audit = state.audit;

  return `## GodMode Onboarding — Phase 3: Workflow Audit

Map the user's workflows to OpenClaw capabilities.

User's workflows: ${workflows.length > 0 ? workflows.join(", ") : "(none specified)"}
Pain points: ${painPoints.length > 0 ? painPoints.join(", ") : "(none specified)"}
${audit?.mappings ? `Mappings done: ${audit.mappings.length}` : "No mappings yet."}

For each workflow:
1. Identify which OpenClaw capabilities can help (skills, memory, channels, cron, etc.)
2. Suggest specific skills from ClawHub that would help
3. Suggest automations (cron jobs, memory writes, channel routing)
4. Recommend Trust Tracker categories (suggest 3-5 based on their workflows)

Save with \`onboarding.update { audit: { mappings: [...], recommendedTrustWorkflows: [...] } }\`.
When done, advance to Phase 4.`;
}

function buildPhase4Prompt(state: OnboardingState): string {
  const config = state.configuration;
  return `## GodMode Onboarding — Phase 4: Configuration

Apply recommended settings based on the assessment and interview.

${config?.changes ? `Changes proposed: ${config.changes.length}, applied: ${config.changes.filter((c) => c.applied).length}` : "No changes proposed yet."}

Based on the assessment (Phase 0) and interview (Phase 1), propose config changes:
- Enable disabled features that match their workflows
- Set thinking level based on their role (higher for technical users)
- Configure heartbeat, memory search, context pruning
- Set up Trust Tracker with recommended workflows from Phase 3

Present each change and get confirmation before applying.
Save with \`onboarding.update { configuration: { changes: [...] } }\`.
When all changes are applied, advance to Phase 5.`;
}

function buildPhase5Prompt(state: OnboardingState): string {
  const firstWin = state.firstWin;
  return `## GodMode Onboarding — Phase 5: First Win

Give the user a live demo of what GodMode can do, now that it's configured.

${firstWin?.completed ? "First win completed!" : "Not started yet."}

Suggestions based on their setup:
- Run a morning brief to show them the daily brief system
- Start a Focus Pulse morning set
- Draft an email or message using their connected channels
- Show memory search working with their seeded content

Pick the demo most relevant to their workflows. Make it real, not a simulation.
Save with \`onboarding.update { firstWin: { demoType: "...", outcome: "...", completed: true } }\`.
When done, advance to Phase 6 with \`onboarding.complete\`.`;
}

/**
 * Loads onboarding context for injection into the agent system prompt.
 * Returns void if onboarding is complete or no state exists.
 */
export async function loadOnboardingContext(): Promise<{ prependContext?: string } | void> {
  const state = await readOnboardingState();
  if (!state) return;

  const prompt = phasePrompt(state);
  if (!prompt) return;

  return { prependContext: prompt };
}
