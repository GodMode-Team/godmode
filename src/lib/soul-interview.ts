/**
 * soul-interview.ts — Soul Interview Engine
 *
 * The conversational "first date" with GodMode. Not a form — a conversation.
 * Phase A (Quick Win, ~2 min): Name, what they do, one thing to help with TODAY.
 * Phase B (Soul Questions, ~5-10 min): Deep identity — optional, only if receptive.
 */
import type { SoulProfile } from "../services/onboarding.js";

export type InterviewPhase = "quick-win" | "soul-questions" | "complete";

const PHASE_B_QUESTIONS = [
  { key: "wantMore", q: "What's one thing you want more of in your life?" },
  { key: "atBest", q: "When you're at your best, what does that look like?" },
  { key: "pattern", q: "What's a pattern you keep falling into that you'd like to change?" },
  { key: "perfectTuesday", q: "What does a perfect Tuesday look like for you?" },
  { key: "beyondMoney", q: "What matters more to you than money?" },
  { key: "neverThinkAbout", q: "If I could handle one type of task so you never had to think about it again, what would it be?" },
] as const;

// ── Prompt Builder ───────────────────────────────────────────────

export function buildSoulInterviewPrompt(
  phase: InterviewPhase,
  existingProfile: Partial<SoulProfile> | null,
): string {
  if (phase === "complete") {
    return `## Soul Interview — Complete\nYou know this person. Use what you learned naturally, not as a checklist.`;
  }
  const collected = summarizeCollected(existingProfile);
  if (phase === "quick-win") {
    return `## Soul Interview — Phase A: Quick Win (~2 min)
You're meeting this person for the first time. Warm, direct, zero corporate energy.
**Rules:** Ask ONE question at a time. Follow up naturally. Not a form.
**Questions (in order):**
1. "What should I call you?"
2. "What do you do? Not your LinkedIn headline — the real version."
3. "What's one thing you want help with TODAY? Something concrete I can act on right now."
**After the TODAY answer:** Immediately do something useful — queue a task, draft something.
Show value BEFORE asking for more. Then: "That's running. I'd love to understand you better
so I can actually be useful long-term. Got 5 more minutes?" If rushed, skip to saving. If
receptive, flow into Phase B soul questions.
Save with: \`onboarding.update { interview: { name: "...", role: "..." } }\`
${collected ? `Already collected: ${collected}` : "Starting fresh."}`;
  }
  // soul-questions
  const answered = getAnsweredKeys(existingProfile);
  const remaining = PHASE_B_QUESTIONS.filter((q) => !answered.has(q.key));
  return `## Soul Interview — Phase B: Soul Questions (~5-10 min)
You've delivered a quick win. Now go deeper — like a sharp friend who pays attention.
**Rules:** ONE question at a time. Let them talk. Skip redundant ones. Don't push short answers.
**Remaining questions:**
${remaining.map((q, i) => `${i + 1}. "${q.q}"`).join("\n")}
**Map answers:** "want more" -> ground/goodDay | "at your best" -> atMyBest | "pattern" -> recurringPattern | "perfect Tuesday" -> goodDay | "more than money" -> nonNegotiables[] | "handle one task" -> desiredWorkflows[]
Save each: \`onboarding.update { interview: { soulProfile: { atMyBest: "..." } } }\`
After 3+ questions or user signals done, call \`godmode_onboard\` with all data.
${collected ? `Collected: ${collected}` : "No soul data yet."} Progress: ${answered.size}/${PHASE_B_QUESTIONS.length}`;
}

// ── Soul Data Extractor ──────────────────────────────────────────

export function extractSoulData(
  conversation: Array<{ role: string; content: string }>,
): Partial<SoulProfile> {
  const profile: Partial<SoulProfile> = {};
  const allText = conversation.filter((m) => m.role === "user").map((m) => m.content).join(" ");
  if (!allText) return profile;

  const best = allText.match(/at my best[,.]?\s*I(?:'m| am)\s+(.{10,200})/i);
  if (best) profile.atMyBest = best[1].trim().replace(/\.$/, "");

  const pat = allText.match(/I keep (?:doing|going back to|falling into)\s+(.{10,200})/i);
  if (pat) profile.recurringPattern = pat[1].trim().replace(/\.$/, "");

  const neg = allText.match(/(?:non-?negotiable|never sacrifice|always protect)[s:]*\s*(.{10,300})/i);
  if (neg) {
    const items = neg[1].split(/[,;]|\band\b/).map((s) => s.trim()).filter((s) => s.length > 2);
    if (items.length > 0) profile.nonNegotiables = items;
  }

  const auto = allText.match(/(?:automate|handle for me|never have to)[s:]*\s*(.{10,300})/i);
  if (auto) {
    const items = auto[1].split(/[,;]|\band\b/).map((s) => s.trim()).filter((s) => s.length > 3);
    if (items.length > 0) profile.desiredWorkflows = items;
  }
  return profile;
}

// ── SOUL.md Section Generator ────────────────────────────────────

export function generateSoulSections(profile: SoulProfile): string {
  const s: string[] = [];
  const add = (heading: string, lines: (string | false | undefined | null)[]) => {
    const valid = lines.filter(Boolean) as string[];
    if (valid.length) s.push(`\n## ${heading}`, ...valid);
  };
  add("Who They Are", [
    profile.ground && `- **Purpose:** ${profile.ground}`,
    profile.anchor && `- **Anchor:** ${profile.anchor}`,
    profile.atMyBest && `- **At their best:** ${profile.atMyBest}`,
  ]);
  add("How They Work", [
    profile.flowState && `- **In flow:** ${profile.flowState}`,
    profile.depletedState && `- **When depleted:** ${profile.depletedState}`,
    profile.shadowState && `- **Under pressure:** ${profile.shadowState}`,
  ]);
  add("Patterns to Watch", [
    profile.recurringPattern && `- **Recurring pattern:** ${profile.recurringPattern}`,
    profile.disguisedDistraction && `- **Disguised distraction:** ${profile.disguisedDistraction}`,
    profile.blindSpot && `- **Blind spot:** ${profile.blindSpot}`,
  ]);
  add("How to Talk to Them", [
    profile.challengeLevel && `- **Challenge level:** ${profile.challengeLevel}`,
    profile.correctionStyle && `- **When they're wrong:** ${profile.correctionStyle}`,
    profile.offLimits && `- **Off limits:** ${profile.offLimits}`,
  ]);
  add("What's Sacred", [
    profile.nonNegotiables?.length ? `- **Non-negotiables:** ${profile.nonNegotiables.join(", ")}` : null,
    profile.importantPeople?.length ? `- **Important people:** ${profile.importantPeople.map((p) => `${p.name} (${p.context})`).join(", ")}` : null,
    profile.goodDay && `- **A good day:** ${profile.goodDay}`,
  ]);
  add("AI Preferences", [
    profile.annoyingAiBehavior && `- **Annoying AI behavior:** ${profile.annoyingAiBehavior}`,
    profile.trustBreakingPhrases?.length ? `- **Trust breakers:** ${profile.trustBreakingPhrases.join(", ")}` : null,
    profile.justGetItDone && `- **"Just get it done" means:** ${profile.justGetItDone}`,
  ]);
  if (profile.desiredWorkflows?.length) {
    s.push("\n## What Should Be Running", ...profile.desiredWorkflows.map((w) => `- ${w}`));
    if (profile.confirmBeforeActions?.length)
      s.push(`\n**Always confirm before:** ${profile.confirmBeforeActions.join(", ")}`);
  }
  return s.join("\n").trim();
}

// ── Helpers ──────────────────────────────────────────────────────

function summarizeCollected(p: Partial<SoulProfile> | null): string {
  if (!p) return "";
  const f: string[] = [];
  if (p.ground) f.push("ground"); if (p.anchor) f.push("anchor");
  if (p.atMyBest) f.push("atMyBest"); if (p.flowState) f.push("flowState");
  if (p.depletedState) f.push("depletedState"); if (p.recurringPattern) f.push("recurringPattern");
  if (p.goodDay) f.push("goodDay"); if (p.nonNegotiables?.length) f.push("nonNegotiables");
  if (p.desiredWorkflows?.length) f.push("desiredWorkflows");
  if (p.challengeLevel) f.push("challengeLevel"); if (p.correctionStyle) f.push("correctionStyle");
  if (p.annoyingAiBehavior) f.push("annoyingAiBehavior"); if (p.justGetItDone) f.push("justGetItDone");
  return f.join(", ");
}

function getAnsweredKeys(p: Partial<SoulProfile> | null): Set<string> {
  const k = new Set<string>();
  if (!p) return k;
  if (p.ground || p.goodDay) k.add("wantMore"); if (p.atMyBest) k.add("atBest");
  if (p.recurringPattern) k.add("pattern"); if (p.goodDay) k.add("perfectTuesday");
  if (p.nonNegotiables?.length) k.add("beyondMoney");
  if (p.desiredWorkflows?.length) k.add("neverThinkAbout");
  return k;
}
