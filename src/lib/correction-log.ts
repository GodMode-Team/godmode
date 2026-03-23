/**
 * Correction Log — Structured correction capture, pattern detection, and guardrail proposal.
 *
 * Reads/writes ~/godmode/data/correction-log.json with file locking.
 * Detects patterns after 3+ similar corrections and drafts guardrail proposals
 * for user approval. Never auto-installs — always proposes.
 */

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "./sdk-helpers.js";
import { DATA_DIR } from "../data-paths.js";

// ── Types ──────────────────────────────────────────────────────────

export type CorrectionCategory =
  | "tone"
  | "format"
  | "accuracy"
  | "scope"
  | "style"
  | "tool-use"
  | "behavior"
  | "content";

export type CorrectionEntry = {
  id: string;
  timestamp: string;
  sessionKey?: string;
  originalText: string;
  correctedText: string;
  correctionSignal: string;
  category: CorrectionCategory;
  subcategory?: string;
  keywords: string[];
  taskType?: string;
  toolInvolved?: string;
  personaHint?: string;
  patternId?: string;
  proposalId?: string;
};

export type DetectedPattern = {
  id: string;
  category: CorrectionCategory;
  subcategory?: string;
  keywords: string[];
  correctionIds: string[];
  count: number;
  firstSeen: string;
  lastSeen: string;
  status: "detected" | "proposed" | "accepted" | "dismissed";
  proposalId?: string;
};

export type GuardrailProposal = {
  id: string;
  patternId: string;
  status: "draft" | "presented" | "accepted" | "edited" | "dismissed";
  enforcementLevel: "feedback-log" | "custom-guardrail" | "safety-gate";
  feedbackEntry?: {
    section: string;
    content: string;
  };
  guardrail?: {
    name: string;
    description: string;
    trigger: { tool: string; patterns: string[] };
    action: "block" | "redirect";
    message: string;
    redirectTo?: string;
  };
  gateSpec?: {
    hook: string;
    description: string;
    suggestedImplementation: string;
  };
  reasoning: string;
  evidenceSummary: string;
  createdAt: string;
  resolvedAt?: string;
};

export type CorrectionLogConfig = {
  maxEntries: number;
  patternThreshold: number;
  patternWindowDays: number;
  autoClassify: boolean;
};

export type CorrectionLog = {
  entries: CorrectionEntry[];
  patterns: DetectedPattern[];
  proposals: GuardrailProposal[];
  config: CorrectionLogConfig;
  updatedAt: string;
};

// ── Constants ──────────────────────────────────────────────────────

const LOG_FILE = path.join(DATA_DIR, "correction-log.json");

const LOCK_OPTIONS = {
  retries: {
    retries: 30,
    factor: 1.35,
    minTimeout: 20,
    maxTimeout: 250,
    randomize: true,
  },
  stale: 20_000,
};

const DEFAULT_CONFIG: CorrectionLogConfig = {
  maxEntries: 500,
  patternThreshold: 3,
  patternWindowDays: 30,
  autoClassify: true,
};

// ── Stopwords for keyword extraction ──────────────────────────────

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "to", "of", "in", "for",
  "on", "with", "at", "by", "from", "as", "into", "through", "during",
  "before", "after", "and", "but", "or", "not", "no", "this", "that",
  "it", "i", "you", "he", "she", "we", "they", "me", "my", "your",
  "his", "her", "our", "their", "don't", "didn't", "won't", "can't",
  "just", "like", "use", "using", "said", "told",
]);

// ── Correction signal detection ───────────────────────────────────

const CORRECTION_SIGNALS = {
  explicit: [
    /\bno[,.]?\s+(don'?t|stop|never|not like that)/i,
    /\bthat'?s (wrong|incorrect|not right|not what I)/i,
    /\bI (said|told you|already|meant)\b/i,
    /\b(from now on|going forward|always|never)\b.*\b(do|use|say|write)\b/i,
  ],
  implicit: [
    /\bactually[,.]?\s/i,
    /\binstead[,.]?\s/i,
    /\bplease (don'?t|stop|use|try)\b/i,
  ],
  strong: [
    /\b(never|stop|don'?t ever|quit|enough)\b/i,
    /\bI'?ve told you (this|that|before)\b/i,
    /\bhow many times\b/i,
  ],
};

// ── State helpers ──────────────────────────────────────────────────

function createDefaultLog(): CorrectionLog {
  return {
    entries: [],
    patterns: [],
    proposals: [],
    config: { ...DEFAULT_CONFIG },
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeLog(input: unknown): CorrectionLog {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createDefaultLog();
  }
  const value = input as Partial<CorrectionLog>;
  return {
    entries: Array.isArray(value.entries) ? value.entries : [],
    patterns: Array.isArray(value.patterns) ? value.patterns : [],
    proposals: Array.isArray(value.proposals) ? value.proposals : [],
    config: {
      ...DEFAULT_CONFIG,
      ...(value.config && typeof value.config === "object" ? value.config : {}),
    },
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
  };
}

async function readLogUnsafe(): Promise<CorrectionLog> {
  try {
    const raw = await fs.readFile(LOG_FILE, "utf-8");
    return sanitizeLog(JSON.parse(raw));
  } catch {
    return createDefaultLog();
  }
}

async function writeLogUnsafe(log: CorrectionLog): Promise<void> {
  log.updatedAt = new Date().toISOString();
  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  await fs.writeFile(LOG_FILE, JSON.stringify(log, null, 2) + "\n", "utf-8");
}

// ── Public API: Read/Write ──────────────────────────────────────────

export async function readCorrectionLog(): Promise<CorrectionLog> {
  return withFileLock(LOG_FILE, LOCK_OPTIONS, async () => readLogUnsafe());
}

export async function updateCorrectionLog<T>(
  updater: (log: CorrectionLog) => Promise<T> | T,
): Promise<{ log: CorrectionLog; result: T }> {
  return withFileLock(LOG_FILE, LOCK_OPTIONS, async () => {
    const log = await readLogUnsafe();
    const result = await updater(log);
    await writeLogUnsafe(log);
    return { log, result };
  });
}

// ── Classification ──────────────────────────────────────────────────

/**
 * Detect whether a user message contains a correction signal.
 * Returns the strongest signal type, or null if no correction detected.
 */
export function detectCorrectionSignal(
  message: string,
): "strong" | "explicit" | "implicit" | null {
  if (message.length < 10) return null;

  for (const re of CORRECTION_SIGNALS.strong) {
    if (re.test(message)) return "strong";
  }
  for (const re of CORRECTION_SIGNALS.explicit) {
    if (re.test(message)) return "explicit";
  }
  for (const re of CORRECTION_SIGNALS.implicit) {
    if (re.test(message)) return "implicit";
  }
  return null;
}

/**
 * Auto-classify a correction into a category based on signal text heuristics.
 */
export function classifyCorrection(signal: string): CorrectionCategory {
  const s = signal.toLowerCase();

  if (/\b(use|try|switch to|instead of)\b.*\b(tool|command|api|search|fetch)\b/i.test(s))
    return "tool-use";
  if (/\b(don'?t ask|just do|stop asking|figure it out|use your tools)\b/i.test(s))
    return "behavior";
  if (/\b(em.?dash|bullet|header|format|long|short|bold|markdown|paragraph)\b/i.test(s))
    return "format";
  if (/\b(tone|formal|casual|corporate|direct|warm|cold|energy|hedg)\b/i.test(s))
    return "tone";
  if (/\b(wrong|incorrect|right (link|url|name|ip)|actual|dead link)\b/i.test(s))
    return "accuracy";
  if (/\b(too (much|many|long|short|detailed|brief)|focus|scope|only|just the)\b/i.test(s))
    return "scope";
  if (/\b(word|phrase|say it|write it|language|voice|rephrase)\b/i.test(s))
    return "style";

  return "content";
}

/**
 * Extract keywords from correction text for clustering.
 */
export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .slice(0, 10);
}

// ── Log a correction ──────────────────────────────────────────────

export type LogCorrectionInput = {
  originalText: string;
  correctedText: string;
  correctionSignal: string;
  category?: CorrectionCategory;
  subcategory?: string;
  sessionKey?: string;
  taskType?: string;
  toolInvolved?: string;
  personaHint?: string;
};

/**
 * Log a correction entry and run pattern detection.
 * Returns the new entry and any newly detected patterns/proposals.
 */
export async function logCorrection(input: LogCorrectionInput): Promise<{
  entry: CorrectionEntry;
  newPatterns: DetectedPattern[];
  newProposals: GuardrailProposal[];
}> {
  const category = input.category ?? classifyCorrection(input.correctionSignal);
  const keywords = extractKeywords(
    `${input.correctionSignal} ${input.correctedText}`,
  );

  const entry: CorrectionEntry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    sessionKey: input.sessionKey,
    originalText: input.originalText.slice(0, 500),
    correctedText: input.correctedText.slice(0, 500),
    correctionSignal: input.correctionSignal.slice(0, 500),
    category,
    subcategory: input.subcategory,
    keywords,
    taskType: input.taskType,
    toolInvolved: input.toolInvolved,
    personaHint: input.personaHint,
  };

  const { result } = await updateCorrectionLog((log) => {
    log.entries.push(entry);

    // FIFO eviction
    if (log.entries.length > log.config.maxEntries) {
      log.entries = log.entries.slice(-log.config.maxEntries);
    }

    // Run pattern detection
    const { newPatterns, newProposals } = detectPatterns(log, entry);

    return { entry, newPatterns, newProposals };
  });

  return result;
}

// ── Pattern Detection ─────────────────────────────────────────────

/**
 * Compute Jaccard similarity between two keyword arrays.
 */
function keywordOverlap(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

/**
 * Cluster entries by keyword overlap using greedy single-linkage.
 */
function clusterByKeywords(
  entries: CorrectionEntry[],
  minOverlap: number,
): CorrectionEntry[][] {
  const clusters: CorrectionEntry[][] = [];
  const assigned = new Set<string>();

  for (const entry of entries) {
    if (assigned.has(entry.id)) continue;

    const cluster = [entry];
    assigned.add(entry.id);

    for (const other of entries) {
      if (assigned.has(other.id)) continue;
      if (keywordOverlap(entry.keywords, other.keywords) >= minOverlap) {
        cluster.push(other);
        assigned.add(other.id);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

function unionKeywords(entries: CorrectionEntry[]): string[] {
  const all = new Set<string>();
  for (const e of entries) {
    for (const k of e.keywords) all.add(k);
  }
  return [...all];
}

/**
 * Detect patterns in the correction log after a new entry is added.
 * Mutates the log in-place (assigns patternIds, adds patterns/proposals).
 */
export function detectPatterns(
  log: CorrectionLog,
  newEntry: CorrectionEntry,
): { newPatterns: DetectedPattern[]; newProposals: GuardrailProposal[] } {
  const threshold = log.config.patternThreshold;
  const windowMs = log.config.patternWindowDays * 86_400_000;
  const cutoff = new Date(Date.now() - windowMs).toISOString();

  // Filter to recent, un-patterned entries in the same category
  const recent = log.entries.filter(
    (e) =>
      e.timestamp >= cutoff &&
      !e.patternId &&
      e.category === newEntry.category,
  );

  if (recent.length < threshold) {
    return { newPatterns: [], newProposals: [] };
  }

  const newPatterns: DetectedPattern[] = [];
  const newProposals: GuardrailProposal[] = [];

  // Cluster by keyword overlap
  const clusters = clusterByKeywords(recent, 0.3);

  for (const cluster of clusters) {
    if (cluster.length < threshold) continue;

    // Check for existing pattern overlap
    const clusterKeywords = unionKeywords(cluster);
    const existing = log.patterns.find(
      (p) =>
        p.category === newEntry.category &&
        p.status !== "dismissed" &&
        keywordOverlap(p.keywords, clusterKeywords) > 0.3,
    );

    if (existing) {
      // Extend existing pattern
      const newIds = cluster
        .filter((e) => !existing.correctionIds.includes(e.id))
        .map((e) => e.id);
      existing.correctionIds.push(...newIds);
      existing.count = existing.correctionIds.length;
      existing.lastSeen = cluster[cluster.length - 1].timestamp;
      existing.keywords = [
        ...new Set([...existing.keywords, ...clusterKeywords]),
      ];

      for (const e of cluster) {
        e.patternId = existing.id;
      }
    } else {
      // New pattern detected
      const pattern: DetectedPattern = {
        id: randomUUID(),
        category: newEntry.category,
        keywords: clusterKeywords,
        correctionIds: cluster.map((e) => e.id),
        count: cluster.length,
        firstSeen: cluster[0].timestamp,
        lastSeen: cluster[cluster.length - 1].timestamp,
        status: "detected",
      };

      for (const e of cluster) {
        e.patternId = pattern.id;
      }

      // Generate proposal
      const proposal = generateProposal(pattern, cluster);
      pattern.status = "proposed";
      pattern.proposalId = proposal.id;

      newPatterns.push(pattern);
      newProposals.push(proposal);

      log.patterns.push(pattern);
      log.proposals.push(proposal);
    }
  }

  return { newPatterns, newProposals };
}

// ── Proposal Generation ──────────────────────────────────────────

function selectEnforcementLevel(
  pattern: DetectedPattern,
): "feedback-log" | "custom-guardrail" | "safety-gate" {
  if (pattern.category === "tool-use") return "custom-guardrail";
  if (pattern.category === "behavior" && pattern.count >= 5) return "safety-gate";
  if (["tone", "style", "format", "content"].includes(pattern.category))
    return "feedback-log";
  return "feedback-log";
}

function mapCategoryToSection(cat: CorrectionCategory): string {
  switch (cat) {
    case "tone":
      return "Tone Calibration";
    case "format":
      return "Writing / Output Format";
    case "style":
      return "Communication Style (All Agents)";
    case "accuracy":
      return "Specific Things That Have Gone Wrong (Never Again)";
    case "behavior":
      return "Memory & Actions";
    case "content":
      return "Standing Directives (Always Active)";
    case "scope":
      return "Communication Style (All Agents)";
    case "tool-use":
      return "Verification";
    default:
      return "Standing Directives (Always Active)";
  }
}

function daysBetween(a: string, b: string): number {
  const diff = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  return Math.round(diff / 86_400_000);
}

function mostCommonTool(entries: CorrectionEntry[]): string | undefined {
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (e.toolInvolved) {
      counts.set(e.toolInvolved, (counts.get(e.toolInvolved) ?? 0) + 1);
    }
  }
  let best: string | undefined;
  let bestCount = 0;
  for (const [tool, count] of counts) {
    if (count > bestCount) {
      best = tool;
      bestCount = count;
    }
  }
  return best;
}

function synthesizeMessage(entries: CorrectionEntry[]): string {
  const signals = entries
    .map((e) => e.correctionSignal)
    .filter(Boolean)
    .slice(-3);
  return signals.join(". ") || "Repeated correction detected.";
}

function generateProposal(
  pattern: DetectedPattern,
  entries: CorrectionEntry[],
): GuardrailProposal {
  const level = selectEnforcementLevel(pattern);
  const evidence = entries
    .slice(-3)
    .map((e) => e.correctionSignal)
    .join(" | ");

  const proposal: GuardrailProposal = {
    id: randomUUID(),
    patternId: pattern.id,
    status: "draft",
    enforcementLevel: level,
    reasoning:
      `Detected ${pattern.count} corrections in category "${pattern.category}" ` +
      `over ${daysBetween(pattern.firstSeen, pattern.lastSeen)} days. ` +
      `Keywords: ${pattern.keywords.join(", ")}`,
    evidenceSummary: `Recent corrections: ${evidence}`,
    createdAt: new Date().toISOString(),
  };

  if (level === "custom-guardrail") {
    const tool = mostCommonTool(entries);
    proposal.guardrail = {
      name: `Auto: ${pattern.category} - ${pattern.keywords.slice(0, 3).join("/")}`,
      description: `Auto-generated from ${pattern.count} corrections. ${proposal.reasoning}`,
      trigger: { tool: tool ?? "exec", patterns: pattern.keywords.slice(0, 5) },
      action: "block",
      message: synthesizeMessage(entries),
    };
  } else if (level === "feedback-log") {
    proposal.feedbackEntry = {
      section: mapCategoryToSection(pattern.category),
      content: synthesizeMessage(entries),
    };
  } else if (level === "safety-gate") {
    proposal.gateSpec = {
      hook: "message_sending",
      description: `Gate for: ${pattern.keywords.join(", ")}`,
      suggestedImplementation: `// Pattern: ${pattern.category}\n// Trigger on: ${pattern.keywords.join(", ")}`,
    };
  }

  return proposal;
}

// ── Proposal Resolution ──────────────────────────────────────────

export async function resolveProposal(
  proposalId: string,
  action: "accepted" | "dismissed" | "edited",
  editedContent?: Partial<GuardrailProposal>,
): Promise<GuardrailProposal | null> {
  const { result } = await updateCorrectionLog((log) => {
    const proposal = log.proposals.find((p) => p.id === proposalId);
    if (!proposal) return null;

    proposal.status = action;
    proposal.resolvedAt = new Date().toISOString();

    if (action === "edited" && editedContent) {
      if (editedContent.guardrail) proposal.guardrail = editedContent.guardrail;
      if (editedContent.feedbackEntry) proposal.feedbackEntry = editedContent.feedbackEntry;
    }

    // Update linked pattern status
    const pattern = log.patterns.find((p) => p.id === proposal.patternId);
    if (pattern) {
      pattern.status = action === "dismissed" ? "dismissed" : "accepted";
    }

    return proposal;
  });

  return result;
}

// ── List helpers for RPC ────────────────────────────────────────

export async function listProposals(
  statusFilter?: GuardrailProposal["status"],
): Promise<GuardrailProposal[]> {
  const log = await readCorrectionLog();
  if (statusFilter) {
    return log.proposals.filter((p) => p.status === statusFilter);
  }
  return log.proposals;
}

export async function listPatterns(
  statusFilter?: DetectedPattern["status"],
): Promise<DetectedPattern[]> {
  const log = await readCorrectionLog();
  if (statusFilter) {
    return log.patterns.filter((p) => p.status === statusFilter);
  }
  return log.patterns;
}
