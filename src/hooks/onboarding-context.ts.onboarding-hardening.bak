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
  const sp = interview?.soulProfile;

  // Track progress across all 6 blocks + basics
  const answered: string[] = [];
  const currentBlock = determineCurrentBlock(interview, sp);

  if (interview?.name) answered.push("name");
  if (interview?.role) answered.push("role");
  if (sp?.ground) answered.push("ground");
  if (sp?.anchor) answered.push("anchor");
  if (sp?.atMyBest) answered.push("atMyBest");
  if (sp?.flowState) answered.push("flowState");
  if (sp?.depletedState) answered.push("depletedState");
  if (sp?.shadowState) answered.push("shadowState");
  if (sp?.recurringPattern) answered.push("recurringPattern");
  if (sp?.disguisedDistraction) answered.push("disguisedDistraction");
  if (sp?.blindSpot) answered.push("blindSpot");
  if (sp?.challengeLevel) answered.push("challengeLevel");
  if (sp?.offLimits) answered.push("offLimits");
  if (sp?.correctionStyle) answered.push("correctionStyle");
  if (sp?.nonNegotiables && sp.nonNegotiables.length > 0) answered.push("nonNegotiables");
  if (sp?.importantPeople && sp.importantPeople.length > 0) answered.push("importantPeople");
  if (sp?.goodDay) answered.push("goodDay");
  if (sp?.annoyingAiBehavior) answered.push("annoyingAiBehavior");
  if (sp?.trustBreakingPhrases && sp.trustBreakingPhrases.length > 0) answered.push("trustBreakingPhrases");
  if (sp?.justGetItDone) answered.push("justGetItDone");
  if (sp?.desiredWorkflows && sp.desiredWorkflows.length > 0) answered.push("desiredWorkflows");
  if (sp?.confirmBeforeActions && sp.confirmBeforeActions.length > 0) answered.push("confirmBeforeActions");

  const totalFields = 22; // name + role + 20 soul fields
  const progress = Math.round((answered.length / totalFields) * 100);

  return `## GodMode Onboarding — Phase 1: Soul Interview

You are conducting a deep, conversational onboarding — not a form. These questions shape the user's SOUL.md,
the file that defines how their AI ally sees them, speaks to them, and serves them. This is the most important
conversation you'll ever have with this person.

**Tone:** Warm, direct, no corporate energy. Like a trusted advisor getting to know someone for real.
**Pace:** One question at a time. Let them talk. Follow up naturally. Don't rush through blocks.
**Save incrementally:** After each answer, save immediately with \`onboarding.update\`.

Progress: ${answered.length}/${totalFields} fields (${progress}%)
${answered.length > 0 ? `Collected: ${answered.join(", ")}` : "Starting fresh."}
Current block: ${currentBlock}

---

### The 6 Blocks

**Start by getting their name if you don't have it yet.** Then move through these blocks in order.

**Block 1: The Ground** ${hasBlock1(interview, sp) ? "(COMPLETE)" : currentBlock === "block1" ? "(CURRENT)" : ""}
*This is where the foundation gets laid — what they're really here for, not their job title.*

- "Before we get into what you do — tell me what you're actually here for. Not your job title. The real answer. What do you believe you're on this earth to build, become, or give?"
  → Save to: \`interview.soulProfile.ground\`

- "What do you return to when everything falls apart? A belief, a practice, a person, a place — what's the anchor?"
  → Save to: \`interview.soulProfile.anchor\`

- "Finish this sentence for me: 'At my best, I'm someone who ___.' Don't think too hard."
  → Save to: \`interview.soulProfile.atMyBest\`

**Block 2: Their Modes** ${hasBlock2(sp) ? "(COMPLETE)" : currentBlock === "block2" ? "(CURRENT)" : ""}
*The Four Selves — mapped to their actual language.*

- "Walk me through what you're like when you're fully in flow. What does that version of you need from me?"
  → Save to: \`interview.soulProfile.flowState\`

- "Now the opposite — what are you like when you're depleted or spiraling? What does that version of you need? What makes it worse?"
  → Save to: \`interview.soulProfile.depletedState\`

- "Is there a version of you that shows up at night or under pressure that you're not totally proud of? What does that look like?"
  → Save to: \`interview.soulProfile.shadowState\`

**Block 3: Pattern Tendencies** ${hasBlock3(sp) ? "(COMPLETE)" : currentBlock === "block3" ? "(CURRENT)" : ""}
*What to watch for and name.*

- "What's the thing you keep doing that you wish you didn't? The pattern you've caught yourself in before?"
  → Save to: \`interview.soulProfile.recurringPattern\`

- "What kind of distraction shows up dressed like an opportunity for you?"
  → Save to: \`interview.soulProfile.disguisedDistraction\`

- "What do your people — partner, close friends, collaborators — say is your biggest blind spot?"
  → Save to: \`interview.soulProfile.blindSpot\`

**Block 4: Truth + Love Calibration** ${hasBlock4(sp) ? "(COMPLETE)" : currentBlock === "block4" ? "(CURRENT)" : ""}
*How to deliver hard things.*

- "On a scale of push-me-hard to give-me-space: how do you want me to challenge you when I see you going sideways?"
  → Save to: \`interview.soulProfile.challengeLevel\`

- "Is there anything that's genuinely off-limits — things I should never bring up or poke at?"
  → Save to: \`interview.soulProfile.offLimits\`

- "When you're wrong about something, what's the best way for me to tell you?"
  → Save to: \`interview.soulProfile.correctionStyle\`

**Block 5: What's Sacred** ${hasBlock5(sp) ? "(COMPLETE)" : currentBlock === "block5" ? "(CURRENT)" : ""}
*Non-negotiables, anchors, what to protect.*

- "What are the non-negotiables in your life — the things that don't get sacrificed for work, no matter what?"
  → Save to: \`interview.soulProfile.nonNegotiables\` (array of strings)

- "Who are the most important people in your life, and what do I need to know about them to serve you well?"
  → Save to: \`interview.soulProfile.importantPeople\` (array of { name, context })

- "What does a good day look like? Not productive — *good*."
  → Save to: \`interview.soulProfile.goodDay\`

**Block 6: What Annoys Them** ${hasBlock6(sp) ? "(COMPLETE)" : currentBlock === "block6" ? "(CURRENT)" : ""}
*Tuning your voice to their tolerance.*

- "What's the most annoying thing an AI has ever done to you?"
  → Save to: \`interview.soulProfile.annoyingAiBehavior\`

- "What phrases or behaviors make you immediately trust me less?"
  → Save to: \`interview.soulProfile.trustBreakingPhrases\` (array of strings)

- "What does 'just get it done' mean to you?"
  → Save to: \`interview.soulProfile.justGetItDone\`

**Block 7: What Should Be Running** ${hasBlock7(sp) ? "(COMPLETE)" : currentBlock === "block7" ? "(CURRENT)" : ""}
*Workflow capture — the automations that justify this system's existence.*

- "If I could just handle 3-5 things for you automatically — every day, without you asking — what would they be? Think: what takes too long, what you forget, what you wish just happened."
  → Save to: \`interview.soulProfile.desiredWorkflows\` (array of strings, e.g. ["Morning brief with calendar + priorities", "Inbox triage — flag urgent, archive noise", "Weekly project status rollup"])

- "What should I always confirm with you before doing? Sending emails, deleting files, posting content — where's the line?"
  → Save to: \`interview.soulProfile.confirmBeforeActions\` (array of strings, e.g. ["Send any email or message", "Delete or overwrite files", "Post anything publicly"])

---

### How to Save

Save each answer as you get it. Use nested paths:
\`\`\`
onboarding.update {
  interview: {
    name: "...",
    role: "...",
    soulProfile: {
      ground: "...",
      anchor: "...",
      // etc
    }
  }
}
\`\`\`

### When to Advance

When you have at minimum: name + Block 1 (The Ground) + Block 4 (Truth Calibration) + Block 6 (What Annoys Them),
you have enough to generate a meaningful SOUL.md. But aim for all 7 blocks.
Block 7 (What Should Be Running) is particularly high-value — it turns onboarding into immediate automation.

If the user wants to skip or wrap up early, that's fine — save what you have and advance to Phase 2.
The SOUL.md will be generated from whatever data is available, and can always be deepened later.

Advance with: \`onboarding.update { phase: 2, completePhase: 1 }\``;
}

// ── Block completion helpers ───────────────────────────────────

type MaybeSoul = {
  ground?: string;
  anchor?: string;
  atMyBest?: string;
  flowState?: string;
  depletedState?: string;
  shadowState?: string;
  recurringPattern?: string;
  disguisedDistraction?: string;
  blindSpot?: string;
  challengeLevel?: string;
  offLimits?: string;
  correctionStyle?: string;
  nonNegotiables?: string[];
  importantPeople?: Array<{ name: string; context: string }>;
  goodDay?: string;
  annoyingAiBehavior?: string;
  trustBreakingPhrases?: string[];
  justGetItDone?: string;
  desiredWorkflows?: string[];
  confirmBeforeActions?: string[];
} | undefined;

type MaybeInterview = {
  name?: string;
  role?: string;
  soulProfile?: MaybeSoul;
} | null;

function hasBlock1(interview: MaybeInterview, sp: MaybeSoul): boolean {
  return Boolean(interview?.name && sp?.ground && sp?.anchor && sp?.atMyBest);
}
function hasBlock2(sp: MaybeSoul): boolean {
  return Boolean(sp?.flowState && sp?.depletedState);
}
function hasBlock3(sp: MaybeSoul): boolean {
  return Boolean(sp?.recurringPattern && sp?.disguisedDistraction);
}
function hasBlock4(sp: MaybeSoul): boolean {
  return Boolean(sp?.challengeLevel && sp?.correctionStyle);
}
function hasBlock5(sp: MaybeSoul): boolean {
  return Boolean((sp?.nonNegotiables && sp.nonNegotiables.length > 0) && sp?.goodDay);
}
function hasBlock6(sp: MaybeSoul): boolean {
  return Boolean(sp?.annoyingAiBehavior && sp?.justGetItDone);
}
function hasBlock7(sp: MaybeSoul): boolean {
  return Boolean(sp?.desiredWorkflows && sp.desiredWorkflows.length > 0);
}

function determineCurrentBlock(interview: MaybeInterview, sp: MaybeSoul): string {
  if (!interview?.name) return "basics";
  if (!hasBlock1(interview, sp)) return "block1";
  if (!hasBlock2(sp)) return "block2";
  if (!hasBlock3(sp)) return "block3";
  if (!hasBlock4(sp)) return "block4";
  if (!hasBlock5(sp)) return "block5";
  if (!hasBlock6(sp)) return "block6";
  if (!hasBlock7(sp)) return "block7";
  return "complete";
}

function buildPhase2Prompt(state: OnboardingState): string {
  const brain = state.secondBrain;
  return `## GodMode Onboarding — Phase 2: Second Brain Setup

Set up the user's memory so nothing gets lost. This is what makes GodMode remember everything
across sessions — conversations, decisions, preferences, people, projects.

Status:
- Memory seeded: ${brain?.memorySeeded ? "Yes" : "No"}
- Daily brief configured: ${brain?.dailyBriefConfigured ? "Yes" : "No"}
${brain?.obsidianPath ? `- Obsidian vault: ${brain.obsidianPath}` : "- No Obsidian vault linked"}

Tasks:
1. Check if ~/godmode/memory/MEMORY.md exists and has content
2. If sparse, seed it with everything from the interview — name, role, mission, communication style, priorities
3. Ask if they use Obsidian — if yes, set OBSIDIAN_VAULT_PATH. This becomes the permanent vault for daily briefs, agent outputs, and knowledge
4. Generate their first daily brief to show the system working — this is the "wow" moment

**Tone:** "Your memory is set up. From now on, I'll remember everything we discuss — you'll never have to repeat yourself."

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
1. Identify which GodMode capabilities can help (skills, queue delegation, memory, cron, dashboards)
2. Suggest specific skills or agent personas that would help
3. Suggest automations (cron jobs, recurring skills, channel routing)
4. Recommend Trust Tracker categories (suggest 3-5 based on their workflows)

Save with \`onboarding.update { audit: { mappings: [...], recommendedTrustWorkflows: [...] } }\`.
When done, advance to Phase 4.`;
}

function buildPhase4Prompt(state: OnboardingState): string {
  const config = state.configuration;
  return `## GodMode Onboarding — Phase 4: Configuration & Integrations

Apply recommended settings AND help set up integrations that power the daily brief.

${config?.changes ? `Changes proposed: ${config.changes.length}, applied: ${config.changes.filter((c) => c.applied).length}` : "No changes proposed yet."}

### Configuration
Based on the assessment (Phase 0) and interview (Phase 1), propose config changes:
- Enable disabled features that match their workflows
- Set thinking level based on their role (higher for technical users)
- Configure heartbeat, memory search, context pruning
- Set up Trust Tracker with recommended workflows from Phase 3

### Integration Setup
Help the user connect their core integrations. Use \`integrations.status\` to check what's configured. For each unconfigured core integration:

1. **X Intelligence** — powers the daily Intel Scan section. Needs XAI_API_KEY from x.ai/api
2. **Tailscale** — critical for remote/VPS access. Needs tailscale CLI + hostname
3. **Google Calendar** — powers Calendar & Meeting Prep sections. Needs gog CLI + OAuth
4. **Obsidian Vault** — Second Brain storage. Needs vault path
5. **GitHub CLI** — coding task orchestration. Needs gh auth login
6. **Messaging** — phone notifications. Direct user to the Channels tab in the UI

For each integration:
- Explain what it powers in the daily brief
- Provide step-by-step setup for their platform
- Use \`integrations.configure\` to save API keys/values
- Use \`integrations.test\` to verify connectivity
- Everything is optional — respect the user's choice to skip

Present each change and get confirmation before applying.
Save with \`onboarding.update { configuration: { changes: [...] } }\`.
When config is applied and user has set up their desired integrations, advance to Phase 5.`;
}

function buildPhase5Prompt(state: OnboardingState): string {
  const firstWin = state.firstWin;
  const interview = state.interview;
  const sp = interview?.soulProfile;

  // Build personalized command suggestions from profile data
  const commandHints: string[] = [];
  if (sp?.desiredWorkflows && sp.desiredWorkflows.length > 0) {
    commandHints.push(`Their desired automations: ${sp.desiredWorkflows.join("; ")}`);
  }
  if (interview?.workflows && interview.workflows.length > 0) {
    commandHints.push(`Their workflows: ${interview.workflows.join(", ")}`);
  }
  if (sp?.ground) {
    commandHints.push(`Their ground/mission: ${sp.ground}`);
  }
  if (interview?.painPoints && interview.painPoints.length > 0) {
    commandHints.push(`Pain points: ${interview.painPoints.join(", ")}`);
  }

  return `## GodMode Onboarding — Phase 5: First Win + Your First 5

This phase has TWO jobs:
1. Give the user a live demo of what GodMode can do
2. Generate their personalized "First 5 Commands" — real things to say that prove the system works

${firstWin?.completed ? "First win completed!" : "Not started yet."}

### Live Demo

Generate a morning brief using \`briefGenerator.generate\`. Even without integrations connected, this will show the user their tasks, queue status, and GodMode tips. This is their first win — make it feel valuable.

Other demos to try:
- Draft an email or message using their connected channels
- Show memory search working with their seeded content
- Queue a background task to demonstrate delegation

### Your First 5 Commands

Based on what you learned during the interview, generate 5 personalized commands the user can try right away.
These should be real, useful things — not toy examples. Each should demonstrate a different GodMode capability.

${commandHints.length > 0 ? `Profile context for personalization:\n${commandHints.map((h) => `- ${h}`).join("\n")}` : ""}

Example format:
1. "Give me my morning brief" — daily brief + calendar + priorities
2. "What did I work on last week?" — memory search across daily notes
3. "Draft a status update for [project]" — writing from context
4. "What's the most important thing I should focus on right now?" — priority filtering
5. "Remind me what [person] told me about [topic]" — people memory recall

Generate commands that map to THEIR workflows, THEIR projects, THEIR people. Don't be generic.

Save with:
\`\`\`
onboarding.update {
  firstWin: {
    demoType: "...",
    outcome: "...",
    firstFiveCommands: ["command 1", "command 2", "command 3", "command 4", "command 5"],
    completed: true
  }
}
\`\`\`

**Present the 5 commands to the user** — this is their "now what?" answer. Make it feel like a gift, not homework.

### Post-First-Win Nudge

After completing Phase 5, include this gentle nudge:
"Now that you've seen GodMode in action, I'd love to learn more about you to personalize your experience. Want to do a quick getting-to-know-you conversation? It takes about 5 minutes and helps me understand your goals, work style, and how I can serve you best."

If they say yes, the soul interview questions from Phase 1 can be used conversationally — but this is optional deepening, not a gate.

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

  const progressHint = `\n\nThe user can ask to check their onboarding progress at any time. ` +
    `If they say something like "check my onboarding progress", "how's my onboarding going", ` +
    `"show onboarding checklist", or "what's left in onboarding", ` +
    `call \`onboarding.checklist\` and present the milestones and steps in a friendly visual format ` +
    `(use checkmarks for completed steps, circles for pending ones).`;

  return { prependContext: prompt + progressHint };
}
