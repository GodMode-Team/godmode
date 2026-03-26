/**
 * onboarding-types.ts — Full type definitions for the deep onboarding system.
 *
 * 7 phases:
 *   Phase 0: Assessment (health score, config audit)
 *   Phase 1: Interview (name, role, mission, workflows, pain points)
 *   Phase 2: Second Brain (memory setup, Obsidian, daily brief)
 *   Phase 3: Workflow Audit (capability mapping, skill recommendations)
 *   Phase 4: Configuration (apply optimal settings)
 *   Phase 5: First Win (demo daily brief)
 *   Phase 6: Grand Reveal (summary, before/after)
 */

export type OnboardingPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ── Phase 0: Assessment ──────────────────────────────────────────

export type FeatureCheck = {
  key: string;
  label: string;
  enabled: boolean;
};

export type AssessmentResult = {
  healthScore: number; // 0-100
  configExists: boolean;
  authMethod: "api-key" | "claude-max" | "oauth" | "unknown" | "none";
  memoryStatus: {
    dirExists: boolean;
    hasMemoryMd: boolean;
    fileCount: number;
    totalSizeKb: number;
  };
  qmdStatus?: {
    available: boolean;
    backend: string;
    backendConfigured: boolean;
    path: string | null;
    version: string | null;
    warning: string | null;
    installCommand: string;
  };
  channelsConnected: string[];
  skillsInstalled: string[];
  features: FeatureCheck[];
  workspaceConfigured: boolean;
  /** GitHub CLI installed and authenticated (needed for coding tasks + team workspaces) */
  githubReady: boolean;
  /** Obsidian vault path resolved (needed for daily brief) */
  obsidianVaultConfigured: boolean;
  /** Gateway WebSocket token configured (prevents unauthorized local access) */
  gatewayTokenSet: boolean;
  /** Integration status from the integration registry */
  integrationsStatus?: Record<string, { configured: boolean; working: boolean }>;
  /** SOUL.md already exists in ~/godmode/memory/ */
  soulMdExists: boolean;
  /** Number of agent persona .md files found in roster dirs */
  agentRosterCount: number;
  /** Hermes state dir (~/.hermes/) detected */
  hermesDetected: boolean;
  /** Queue items with status "done" or "review" — indicates prior delegation */
  queueCompletedCount: number;
  timestamp: string;
};

// ── Phase 1: Interview ───────────────────────────────────────────

/** Soul profile data collected during deep conversational onboarding. */
export type SoulProfileData = {
  // Block 1: The Ground
  ground?: string;
  anchor?: string;
  atMyBest?: string;
  // Block 2: Their Modes
  flowState?: string;
  depletedState?: string;
  shadowState?: string;
  // Block 3: Pattern Tendencies
  recurringPattern?: string;
  disguisedDistraction?: string;
  blindSpot?: string;
  // Block 4: Truth + Love Calibration
  challengeLevel?: string;
  offLimits?: string;
  correctionStyle?: string;
  // Block 5: What's Sacred
  nonNegotiables?: string[];
  importantPeople?: Array<{ name: string; context: string }>;
  goodDay?: string;
  // Block 6: What Annoys Them
  annoyingAiBehavior?: string;
  trustBreakingPhrases?: string[];
  justGetItDone?: string;
  // Block 7: What Should Be Running
  desiredWorkflows?: string[];       // 3-5 things they want automated
  confirmBeforeActions?: string[];   // Actions that always need confirmation
};

export type InterviewData = {
  name: string;
  role?: string;
  mission?: string;
  emoji?: string;
  dailyRoutine?: string;
  tools?: string[];
  painPoints?: string[];
  teamOrSolo?: "team" | "solo" | "both";
  workflows?: string[];
  soulProfile?: SoulProfileData;
  completed: boolean;
};

// ── Phase 2: Second Brain ────────────────────────────────────────

export type SecondBrainSetup = {
  obsidianPath?: string;
  memorySeeded: boolean;
  dailyBriefConfigured: boolean;
  completed: boolean;
};

// ── Phase 3: Workflow Audit ──────────────────────────────────────

export type WorkflowMapping = {
  workflow: string;
  capabilities: string[];
  recommendedSkills: string[];
  automations: string[];
};

export type AuditResult = {
  mappings: WorkflowMapping[];
  recommendedTrustWorkflows: string[];
  completed: boolean;
};

// ── Phase 4: Configuration ───────────────────────────────────────

export type ConfigChange = {
  key: string;
  label: string;
  from: unknown;
  to: unknown;
  applied: boolean;
};

export type ConfigurationApplied = {
  changes: ConfigChange[];
  completed: boolean;
};

// ── Phase 5: First Win ───────────────────────────────────────────

export type FirstWinResult = {
  demoType: "daily-brief" | "morning-routine" | "other";
  outcome?: string;
  firstFiveCommands?: string[];
  completed: boolean;
};

// ── Phase 6: Grand Reveal ────────────────────────────────────────

export type GrandRevealSummary = {
  healthBefore: number;
  healthAfter: number;
  changesApplied: number;
  workflowsMapped: number;
  memoriesSeeded: number;
};

// ── Root State ───────────────────────────────────────────────────

export type OnboardingState = {
  phase: OnboardingPhase;
  startedAt: string;
  completedPhases: number[];
  /** User-chosen name for their AI ally (persisted, read by getAllyName()) */
  allyName?: string;

  // Phase data
  assessment: AssessmentResult | null;
  interview: InterviewData | null;
  secondBrain: SecondBrainSetup | null;
  audit: AuditResult | null;
  configuration: ConfigurationApplied | null;
  firstWin: FirstWinResult | null;
  grandReveal: GrandRevealSummary | null;

  // Integration status (which integrations the user has set up)
  integrations: Record<string, { status: "connected" | "skipped" | "pending"; configuredAt?: string }> | null;

  // Legacy fields (backward compat with old onboarding state)
  identity: { name: string; mission: string; emoji: string } | null;
  tools: { id: string; name: string; status: string; icon?: string }[];
  summary: {
    projects: number;
    people: number;
    goals: number;
    toolsConnected: number;
    automations: number;
  } | null;

  completedAt: string | null;
};

// ── Setup Flow (5-step simplified onboarding) ──────────────────

export type SetupStep = 'welcome' | 'api-key' | 'memory' | 'integrations' | 'screenpipe' | 'second-brain';

export interface SetupProgress {
  currentStep: SetupStep;
  completedSteps: SetupStep[];
  name?: string;
  timezone?: string;
  allyName?: string;
  apiKeyConfigured: boolean;
  honchoConfigured: boolean;
  composioConfigured: boolean;
  composioIntegrations: Record<string, { id: string; name: string; connected: boolean; icon?: string }>;
  obsidianConfigured: boolean;
  obsidianPath?: string;
  startedAt?: string;
  completedAt?: string;
  dismissed?: boolean;
}

export const SETUP_STEPS: { step: SetupStep; title: string; description: string; required: boolean }[] = [
  { step: 'welcome', title: 'Welcome', description: 'Tell me your name', required: true },
  { step: 'api-key', title: 'AI Connection', description: 'Connect your Anthropic API key', required: true },
  { step: 'memory', title: 'Memory', description: 'Enable persistent memory with Honcho', required: false },
  { step: 'integrations', title: 'Integrations', description: 'Connect your tools via Composio', required: false },
  { step: 'screenpipe', title: 'Ambient Memory', description: 'Enable screen & audio recall (auto-installed)', required: false },
  { step: 'second-brain', title: 'Memory Vault', description: 'Link your Obsidian vault', required: false },
];

export function emptyOnboardingState(): OnboardingState {
  return {
    phase: 0,
    startedAt: new Date().toISOString(),
    completedPhases: [],
    assessment: null,
    interview: null,
    secondBrain: null,
    audit: null,
    configuration: null,
    firstWin: null,
    grandReveal: null,
    integrations: null,
    identity: null,
    tools: [],
    summary: null,
    completedAt: null,
  };
}
