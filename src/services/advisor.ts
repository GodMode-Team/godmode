/**
 * advisor.ts — Insight synthesis engine for Proactive Intelligence.
 *
 * Combines Scout findings + Observer patterns into actionable insights.
 * Phase 1 uses deterministic rules only (no LLM calls).
 *
 * Insight categories:
 *   - new-feature       — OC/GM released something relevant
 *   - skill-recommendation — ClawHub skill matches user needs
 *   - config-optimization  — Config change could improve workflow
 *   - workflow-suggestion   — Pattern-based improvement
 *   - trend-alert          — X signal relevant to user's work
 *   - goal-nudge           — Goal needs attention
 *   - health-warning       — Degraded metrics or recurring errors
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { ScoutFinding, ScoutState } from "./scout.js";
import type { UserPatterns, Challenge } from "./observer.js";

// ── Types ──────────────────────────────────────────────────────────────

export type InsightCategory =
  | "new-feature"
  | "skill-recommendation"
  | "config-optimization"
  | "workflow-suggestion"
  | "trend-alert"
  | "goal-nudge"
  | "health-warning";

export type InsightAction = {
  type: "rpc" | "url" | "chat-prompt" | "config-change" | "none";
  label: string;
  payload: Record<string, unknown>;
};

export type Insight = {
  id: string;
  category: InsightCategory;
  title: string;
  body: string;
  priority: "low" | "medium" | "high" | "urgent";
  source: {
    scoutFindings?: string[];
    observerSignals?: string[];
  };
  action?: InsightAction;
  createdAt: number;
  expiresAt?: number;
  dismissed: boolean;
  actedOn: boolean;
};

export type InsightState = {
  insights: Insight[];
  lastAdvisorRun: number;
};

type Logger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
};

// ── Constants ──────────────────────────────────────────────────────────

const INSIGHTS_FILE = join(DATA_DIR, "intel-insights.json");
const MAX_INSIGHTS = 50;
const DISMISS_PRUNE_DAYS = 7;

// ── State persistence ──────────────────────────────────────────────────

export async function readInsightState(): Promise<InsightState> {
  try {
    const raw = await readFile(INSIGHTS_FILE, "utf-8");
    return JSON.parse(raw) as InsightState;
  } catch {
    return { insights: [], lastAdvisorRun: 0 };
  }
}

async function writeInsightState(state: InsightState): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(INSIGHTS_FILE, JSON.stringify(state, null, 2), "utf-8");
}

// ── Helpers ────────────────────────────────────────────────────────────

function insightId(category: string, content: string): string {
  const h = createHash("sha256").update(`${category}:${content}`).digest("hex").slice(0, 16);
  return `insight:${h}`;
}

function pruneInsights(insights: Insight[]): Insight[] {
  const now = Date.now();
  const pruneCutoff = now - DISMISS_PRUNE_DAYS * 86_400_000;

  // Remove expired and old dismissed insights
  let filtered = insights.filter((i) => {
    if (i.expiresAt && now > i.expiresAt) return false;
    if (i.dismissed && i.createdAt < pruneCutoff) return false;
    return true;
  });

  // Cap to max
  if (filtered.length > MAX_INSIGHTS) {
    filtered = filtered
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, MAX_INSIGHTS);
  }

  return filtered;
}

function keywordOverlap(a: string[], b: string[]): number {
  const setB = new Set(b.map((s) => s.toLowerCase()));
  let matches = 0;
  for (const word of a) {
    if (setB.has(word.toLowerCase())) matches++;
  }
  return matches;
}

// ── Synthesis Rules ────────────────────────────────────────────────────

function synthesizeFromScoutFindings(
  findings: ScoutFinding[],
  patterns: UserPatterns | null,
  existingIds: Set<string>,
): Insight[] {
  const insights: Insight[] = [];
  const userKeywords = patterns
    ? [
        ...patterns.taskPatterns.commonProjects,
        ...patterns.codingPatterns.topRepos,
        ...patterns.activityPatterns.frequentSkills.map((s) => s.skill),
      ].map((s) => s.toLowerCase())
    : [];

  for (const finding of findings) {
    if (finding.acknowledged) continue;

    // Rule 1: New OC/GM feature → new-feature insight
    if (finding.source === "openclaw-docs" || finding.source === "godmode-docs") {
      const id = insightId("new-feature", finding.title);
      if (existingIds.has(id)) continue;

      insights.push({
        id,
        category: "new-feature",
        title: finding.title,
        body: finding.summary,
        priority: finding.source === "openclaw-docs" ? "medium" : "low",
        source: { scoutFindings: [finding.id] },
        action: finding.url
          ? { type: "url", label: "View release", payload: { url: finding.url } }
          : undefined,
        createdAt: Date.now(),
        dismissed: false,
        actedOn: false,
      });
    }

    // Rule 2: ClawHub skill matches stuck tasks → skill-recommendation
    if (finding.source === "clawhub" && patterns) {
      const stuckTaskKeywords = patterns.taskPatterns.stuckTasks
        .flatMap((t) => t.title.toLowerCase().split(/\s+/))
        .filter((w) => w.length > 3);

      const overlap = keywordOverlap(finding.keywords, [
        ...stuckTaskKeywords,
        ...userKeywords,
      ]);

      if (overlap >= 2) {
        const id = insightId("skill-recommendation", finding.title);
        if (existingIds.has(id)) continue;

        const matchedTask = patterns.taskPatterns.stuckTasks.find((t) =>
          finding.keywords.some((k) => t.title.toLowerCase().includes(k)),
        );

        insights.push({
          id,
          category: "skill-recommendation",
          title: `Skill match: ${finding.title.replace("ClawHub: ", "")}`,
          body: matchedTask
            ? `Found "${finding.title.replace("ClawHub: ", "")}" on ClawHub — may help with your stuck task "${matchedTask.title}".`
            : `${finding.summary}. Keywords match your recent work.`,
          priority: matchedTask ? "medium" : "low",
          source: { scoutFindings: [finding.id] },
          action: finding.url
            ? { type: "url", label: "View on ClawHub", payload: { url: finding.url } }
            : undefined,
          createdAt: Date.now(),
          dismissed: false,
          actedOn: false,
        });
      }
    }

    // Rule 3: X signal matches user context → trend-alert
    if (finding.source === "x-intel" && userKeywords.length > 0) {
      const overlap = keywordOverlap(finding.keywords, userKeywords);
      if (overlap >= 2) {
        const id = insightId("trend-alert", finding.title);
        if (existingIds.has(id)) continue;

        insights.push({
          id,
          category: "trend-alert",
          title: `Trend: ${finding.title.replace("X: ", "").slice(0, 60)}`,
          body: finding.summary,
          priority: "low",
          source: { scoutFindings: [finding.id] },
          action: finding.url
            ? { type: "url", label: "View on X", payload: { url: finding.url } }
            : undefined,
          createdAt: Date.now(),
          expiresAt: Date.now() + 48 * 60 * 60_000, // 48h expiry for trends
          dismissed: false,
          actedOn: false,
        });
      }
    }
  }

  return insights;
}

function synthesizeFromObserverChallenges(
  patterns: UserPatterns,
  existingIds: Set<string>,
): Insight[] {
  const insights: Insight[] = [];

  for (const challenge of patterns.challenges) {
    switch (challenge.type) {
      case "stuck-task": {
        const id = insightId("health-warning", `stuck:${(challenge.context.taskTitle as string) ?? ""}`);
        if (existingIds.has(id)) continue;
        insights.push({
          id,
          category: "health-warning",
          title: `Stuck task: ${(challenge.context.taskTitle as string) ?? "Unknown"}`,
          body: challenge.description,
          priority: challenge.severity === "high" ? "high" : "medium",
          source: { observerSignals: ["stuck-task"] },
          action: {
            type: "chat-prompt",
            label: "Break down task",
            payload: { prompt: `Help me break down this stuck task into smaller steps: "${challenge.context.taskTitle}"` },
          },
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 86_400_000,
          dismissed: false,
          actedOn: false,
        });
        break;
      }

      case "low-completion": {
        const id = insightId("health-warning", `completion:${Math.round((challenge.context.rate as number) * 100)}`);
        if (existingIds.has(id)) continue;
        insights.push({
          id,
          category: "health-warning",
          title: "Low task completion rate",
          body: challenge.description,
          priority: challenge.severity === "high" ? "high" : "medium",
          source: { observerSignals: ["low-completion"] },
          action: {
            type: "chat-prompt",
            label: "Review priorities",
            payload: { prompt: "Help me review my current tasks and priorities. My completion rate has been low — let's figure out what to focus on." },
          },
          createdAt: Date.now(),
          expiresAt: Date.now() + 3 * 86_400_000,
          dismissed: false,
          actedOn: false,
        });
        break;
      }

      case "stalled-goal": {
        const id = insightId("goal-nudge", `goal:${(challenge.context.goalTitle as string) ?? ""}`);
        if (existingIds.has(id)) continue;
        insights.push({
          id,
          category: "goal-nudge",
          title: `Goal needs attention: ${(challenge.context.goalTitle as string) ?? "Unknown"}`,
          body: challenge.description,
          priority: challenge.severity === "high" ? "high" : "medium",
          source: { observerSignals: ["stalled-goal"] },
          action: {
            type: "chat-prompt",
            label: "Plan next steps",
            payload: { prompt: `My goal "${challenge.context.goalTitle}" hasn't had progress in ${challenge.context.daysSinceProgress} days. Help me plan the next concrete step.` },
          },
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 86_400_000,
          dismissed: false,
          actedOn: false,
        });
        break;
      }

      case "recurring-error": {
        const id = insightId("health-warning", `error:${(challenge.context.errorMessage as string)?.slice(0, 50) ?? ""}`);
        if (existingIds.has(id)) continue;
        insights.push({
          id,
          category: "health-warning",
          title: "Recurring error detected",
          body: challenge.description,
          priority: challenge.severity === "high" ? "high" : "medium",
          source: { observerSignals: ["recurring-error"] },
          createdAt: Date.now(),
          expiresAt: Date.now() + 7 * 86_400_000,
          dismissed: false,
          actedOn: false,
        });
        break;
      }
    }
  }

  return insights;
}

async function synthesizeConfigRecommendations(existingIds: Set<string>, logger: Logger): Promise<Insight[]> {
  const insights: Insight[] = [];
  try {
    const { generateConfigRecommendations } = await import("../methods/onboarding-scanner.js");
    const recommendations = await generateConfigRecommendations();

    for (const rec of recommendations) {
      if (rec.priority === "optional") continue; // Skip optional for now
      const id = insightId("config-optimization", rec.key);
      if (existingIds.has(id)) continue;

      insights.push({
        id,
        category: "config-optimization",
        title: `Config: ${rec.label}`,
        body: `${rec.reason} Current: ${String(rec.currentValue)}, recommended: ${String(rec.recommendedValue)}.`,
        priority: rec.priority === "critical" ? "high" : "medium",
        source: { observerSignals: ["config-scan"] },
        action: {
          type: "config-change",
          label: `Set ${rec.label}`,
          payload: { key: rec.key, value: rec.recommendedValue },
        },
        createdAt: Date.now(),
        dismissed: false,
        actedOn: false,
      });
    }
  } catch (err) {
    logger.warn(`[Advisor] Config recommendation scan failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  return insights;
}

// ── Insight Audit ──────────────────────────────────────────────────────

/**
 * Audit gate — validates insights before they reach the user.
 * Catches false positives, low-quality signals, and redundancies that
 * individual synthesizers might miss.
 */
function auditInsights(insights: Insight[], existing: Insight[], logger: Logger): Insight[] {
  const validatedResults: Insight[] = [];

  for (const insight of insights) {
    const rejection = getAuditRejection(insight, existing);
    if (rejection) {
      logger.info(`[Advisor:Audit] Dropped insight "${insight.title}": ${rejection}`);
      continue;
    }
    validatedResults.push(insight);
  }

  return validatedResults;
}

/**
 * Returns a rejection reason string if the insight should be dropped,
 * or null if it passes audit.
 */
function getAuditRejection(insight: Insight, existing: Insight[]): string | null {
  // 1. Empty or placeholder content
  if (!insight.title?.trim() || !insight.body?.trim()) {
    return "empty title or body";
  }

  // 2. Config insights that say "Current: false" but the feature is clearly
  //    working (the user wouldn't see insights at all if GodMode wasn't loaded)
  if (insight.category === "config-optimization") {
    const selfReferentialKeys = [
      "plugins.enabled",       // If plugins were off, GodMode wouldn't be running
      "gateway.controlUi.enabled", // If the UI were off, user couldn't see this
      "gateway.mode",          // If gateway weren't local, nothing works
    ];
    const actionKey = (insight.action?.payload?.key as string) ?? "";
    if (selfReferentialKeys.includes(actionKey)) {
      // These features are provably working if the insight pipeline itself ran.
      return "self-referential: feature is provably active (insight pipeline is running)";
    }
  }

  // 3. Health warnings with zero-value metrics that aren't meaningful
  //    e.g. "0/0 tasks completed" is not a real signal
  if (insight.category === "health-warning" && insight.title === "Low task completion rate") {
    const match = insight.body.match(/(\d+)\/(\d+)/);
    if (match) {
      const total = parseInt(match[2], 10);
      if (total <= 2) {
        return "insufficient sample size for task completion metric";
      }
    }
  }

  // 4. Duplicate or near-duplicate titles in active insights
  const activeTitles = existing
    .filter((e) => !e.dismissed && !e.actedOn)
    .map((e) => e.title.toLowerCase());
  if (activeTitles.includes(insight.title.toLowerCase())) {
    return "duplicate title already active";
  }

  // 5. Recurring error insights with vague/unhelpful messages
  if (insight.category === "health-warning" && insight.title === "Recurring error detected") {
    const vaguePhrases = [
      "please try again later",
      "unknown error",
      "something went wrong",
    ];
    const bodyLower = insight.body.toLowerCase();
    const isVague = vaguePhrases.some((p) => bodyLower.includes(p) && !bodyLower.includes("fix"));
    if (isVague) {
      // Still allow if it's high-frequency (genuinely useful to surface)
      const match = insight.body.match(/appeared (\d+) times/);
      const count = match ? parseInt(match[1], 10) : 0;
      if (count < 10) {
        return "vague error message with low frequency — not actionable";
      }
    }
  }

  return null;
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Run advisor synthesis: combine Scout findings + Observer patterns
 * into actionable insights. Returns new insight count.
 */
export async function runAdvisorCycle(
  scoutState: ScoutState,
  patterns: UserPatterns | null,
  logger: Logger,
): Promise<{ newInsights: number; totalActive: number }> {
  const state = await readInsightState();
  const existingIds = new Set(state.insights.map((i) => i.id));
  let candidateInsights: Insight[] = [];

  // 1. Synthesize from Scout findings
  const scoutInsights = synthesizeFromScoutFindings(
    scoutState.findings.filter((f) => !f.acknowledged),
    patterns,
    existingIds,
  );
  candidateInsights.push(...scoutInsights);

  // 2. Synthesize from Observer challenges
  if (patterns) {
    const observerInsights = synthesizeFromObserverChallenges(patterns, existingIds);
    candidateInsights.push(...observerInsights);
  }

  // 3. Config recommendations (run less frequently — only if no recent config insights)
  const hasRecentConfigInsight = state.insights.some(
    (i) => i.category === "config-optimization" && Date.now() - i.createdAt < 24 * 60 * 60_000,
  );
  if (!hasRecentConfigInsight) {
    const configInsights = await synthesizeConfigRecommendations(existingIds, logger);
    candidateInsights.push(...configInsights);
  }

  // 4. Audit — drop false positives and low-quality signals before they reach the user
  const newInsights = auditInsights(candidateInsights, state.insights, logger);

  // Merge validated insights
  state.insights.push(...newInsights);
  state.insights = pruneInsights(state.insights);
  state.lastAdvisorRun = Date.now();

  await writeInsightState(state);

  const activeCount = state.insights.filter((i) => !i.dismissed && !i.actedOn).length;
  if (candidateInsights.length > 0) {
    logger.info(
      `[Advisor] Cycle complete: ${candidateInsights.length} candidates → ${newInsights.length} passed audit, ${activeCount} active total`,
    );
  }

  return { newInsights: newInsights.length, totalActive: activeCount };
}

/**
 * Dismiss an insight by ID.
 */
export async function dismissInsight(insightId: string): Promise<boolean> {
  const state = await readInsightState();
  const insight = state.insights.find((i) => i.id === insightId);
  if (!insight) return false;
  insight.dismissed = true;
  await writeInsightState(state);
  return true;
}

/**
 * Mark an insight as acted on.
 */
export async function markInsightActedOn(insightId: string): Promise<boolean> {
  const state = await readInsightState();
  const insight = state.insights.find((i) => i.id === insightId);
  if (!insight) return false;
  insight.actedOn = true;
  await writeInsightState(state);
  return true;
}

/**
 * Get active (non-dismissed, non-expired) insights.
 */
export async function getActiveInsights(category?: InsightCategory): Promise<Insight[]> {
  const state = await readInsightState();
  const now = Date.now();
  return state.insights.filter((i) => {
    if (i.dismissed) return false;
    if (i.expiresAt && now > i.expiresAt) return false;
    if (category && i.category !== category) return false;
    return true;
  }).sort((a, b) => {
    // Sort by priority then recency
    const prio = { urgent: 0, high: 1, medium: 2, low: 3 };
    const prioDiff = prio[a.priority] - prio[b.priority];
    if (prioDiff !== 0) return prioDiff;
    return b.createdAt - a.createdAt;
  });
}
