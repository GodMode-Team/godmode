/**
 * Centralized constants for the GodMode plugin.
 *
 * All magic numbers, model names, API URLs, thresholds, and time intervals
 * should be defined here so they can be tuned in one place.
 * Environment variable overrides are noted where applicable.
 */

// ─── API Endpoints ───────────────────────────────────────────────────────────

/** Base Anthropic messages endpoint. */
export const ANTHROPIC_API_URL =
  process.env.ANTHROPIC_API_URL ?? "https://api.anthropic.com/v1/messages";

/** GodMode auth API root. */
export const AUTH_API_URL =
  process.env.AUTH_API_URL ?? "https://lifeongodmode.com/api/auth";

/** Screenpipe local REST endpoint. */
export const SCREENPIPE_API_URL =
  process.env.SCREENPIPE_API_URL ?? "http://localhost:3030";

/** Hermes iMessage forwarder endpoint. */
export const HERMES_API_URL =
  process.env.HERMES_API_URL ?? "http://127.0.0.1:8642";

/** Paperclip multi-agent orchestration server. */
export const PAPERCLIP_URL =
  process.env.PAPERCLIP_URL ?? "http://localhost:3100";

/** Venice AI OpenAI-compatible API endpoint. */
export const VENICE_API_URL =
  process.env.VENICE_API_URL ?? "https://api.venice.ai/api/v1";

// ─── Model Defaults ──────────────────────────────────────────────────────────

/** Fast / cheap model for extraction, classification, safety gates. */
export const MODEL_HAIKU =
  process.env.GODMODE_MODEL_HAIKU ?? "claude-haiku-4-5-20251001";

/** Mid-tier model for brief rendering, entity extraction, summaries. */
export const MODEL_SONNET =
  process.env.GODMODE_MODEL_SONNET ?? "claude-sonnet-4-6-20250514";

/** Short model ID variant used by some subsystems (no date suffix). */
export const MODEL_SONNET_SHORT =
  process.env.GODMODE_MODEL_SONNET_SHORT ?? "claude-sonnet-4-6";

/** Default model for OpenClaw / Hermes adapter fallback (prefixed). */
export const MODEL_ADAPTER_DEFAULT = "anthropic/claude-sonnet-4-6";

// ─── GitHub / Deploy ─────────────────────────────────────────────────────────

/** GitHub org/repo for auto-filed issues and deploy checks. */
export const GITHUB_REPO =
  process.env.GODMODE_GITHUB_REPO ?? "godmode-team/godmode";

/** Production website domain. */
export const DEPLOY_DOMAIN =
  process.env.GODMODE_DEPLOY_DOMAIN ?? "lifeongodmode.com";

/** Website repo for deploy-guard checks. */
export const DEPLOY_REPO =
  process.env.GODMODE_DEPLOY_REPO ?? "GodMode-Team/lifeongodmode";

// ─── Queue Processor ─────────────────────────────────────────────────────────

/** How often the queue polls for new items (ms). */
export const QUEUE_POLL_MS = 10 * 60 * 1000; // 10 minutes

/** Maximum time an agent can run before being killed (ms). */
export const AGENT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/** Consecutive failures before the circuit breaker trips. */
export const CIRCUIT_BREAKER_THRESHOLD = 3;

/** How long the circuit breaker stays open (ms). */
export const CIRCUIT_BREAKER_COOLDOWN_MS = 600_000; // 10 minutes

/** Base delay for exponential retry backoff (ms). */
export const RETRY_BASE_DELAY_MS = 30_000; // 30 seconds

/** Maximum delay cap for retry backoff (ms). */
export const RETRY_MAX_DELAY_MS = 300_000; // 5 minutes

/** Maximum number of retries for a queue item. */
export const QUEUE_MAX_RETRIES = 3;

// ─── Curation Agent ──────────────────────────────────────────────────────────

/** Default curation schedule interval (ms). */
export const CURATION_SCHEDULE_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Curation check interval (ms). */
export const CURATION_CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/** Max tokens for curation LLM call. */
export const CURATION_MAX_TOKENS = 4096;

// ─── Inbox ───────────────────────────────────────────────────────────────────

/** Maximum items stored in the inbox. */
export const MAX_INBOX_ITEMS = 200;

/** Days before an inbox item is considered stale. */
export const INBOX_STALE_DAYS = 7;

/** Minimum time between automatic sweeps (ms). */
export const INBOX_SWEEP_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

// ─── Vault Capture ───────────────────────────────────────────────────────────

/** Minimum age before inbox items are eligible for vault capture (ms). */
export const VAULT_INBOX_MIN_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Prune threshold for captured scout IDs set. */
export const VAULT_SCOUT_IDS_PRUNE = 500;

/** Prune threshold for captured session paths set. */
export const VAULT_SESSION_PATHS_PRUNE = 200;

/** Prune threshold for processed inbox files set. */
export const VAULT_INBOX_FILES_PRUNE = 500;

/** Max notes per progressive-summarization tick. */
export const VAULT_PROGRESSIVE_MAX_NOTES = 5;

/** Minimum content length for summarisation to be worthwhile (chars). */
export const VAULT_MIN_CONTENT_LENGTH = 500;

/** Progressive summarization layer ages (ms). */
export const VAULT_LAYER_1_AGE_MS = 7 * 24 * 60 * 60 * 1000;   // 7 days
export const VAULT_LAYER_2_AGE_MS = 30 * 24 * 60 * 60 * 1000;  // 30 days
export const VAULT_LAYER_3_AGE_MS = 60 * 24 * 60 * 60 * 1000;  // 60 days

// ─── Session Distiller ───────────────────────────────────────────────────────

/** How long a session must be idle to be considered finished (ms). */
export const SESSION_IDLE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

/** Max sessions distilled per heartbeat tick. */
export const SESSION_DISTILL_MAX_PER_TICK = 3;

/** Minimum messages in a session before distillation runs. */
export const SESSION_DISTILL_MIN_MESSAGES = 4;

/** Max transcript chars sent to the distillation LLM. */
export const SESSION_DISTILL_MAX_CHARS = 4000;

/** Max distiller state entries kept in memory. */
export const SESSION_DISTILL_MAX_STATE = 500;

// ─── Health Ledger ───────────────────────────────────────────────────────────

/** Ring-buffer size per operation for health signals. */
export const HEALTH_SIGNAL_BUFFER_SIZE = 50;

/** Maximum turn-level errors buffered. */
export const MAX_TURN_ERRORS = 10;

/** TTL for turn-level errors (ms). */
export const TURN_ERROR_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Session idle threshold for activity tracking (ms). */
export const HEALTH_SESSION_IDLE_MS = 5 * 60 * 1000; // 5 minutes

// ─── Context Budget ──────────────────────────────────────────────────────────

/** Max memory search result lines injected. */
export const MAX_MEMORY_LINES = 15;

/** Max schedule lines injected. */
export const MAX_SCHEDULE_LINES = 6;

/** Max chars for memory search block. */
export const MAX_MEMORY_CHARS = 2000;

/** Max chars for identity graph block. */
export const MAX_IDENTITY_CHARS = 500;

/** Max chars for relationship graph block. */
export const MAX_GRAPH_CHARS = 800;

// ─── Retrieval Log ───────────────────────────────────────────────────────────

/** In-memory buffer size before flushing to disk. */
export const RETRIEVAL_LOG_BUFFER_SIZE = 200;

// ─── Skill Cards ─────────────────────────────────────────────────────────────

/** Cache TTL for loaded skill cards (ms). */
export const SKILL_CARD_CACHE_TTL_MS = 60_000; // 1 minute

/** Max lines per skill card injected into context. */
export const MAX_SKILL_CARD_LINES = 40;

// ─── Agent Lessons ───────────────────────────────────────────────────────────

/** Max lessons stored per routing key. */
export const MAX_LESSONS_PER_KEY = 20;

// ─── Trust Refinement ────────────────────────────────────────────────────────

/** Max raw feedback items before consolidation. */
export const MAX_RAW_FEEDBACK_ITEMS = 5;

// ─── Action Items ────────────────────────────────────────────────────────────

/** Max extracted action items per session. */
export const MAX_ACTION_ITEMS_PER_SESSION = 15;

/** TTL for buffered action items (ms). */
export const ACTION_ITEM_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ─── Cache TTLs ──────────────────────────────────────────────────────────────

/** Auto-title pending entry TTL (ms). */
export const PENDING_TITLE_TTL_MS = 5 * 60_000; // 5 minutes

/** Awareness snapshot cache TTL (ms). */
export const AWARENESS_CACHE_TTL_MS = 60_000; // 1 minute

/** Agent roster cache TTL (ms). */
export const AGENT_ROSTER_CACHE_TTL_MS = 30_000; // 30 seconds

/** User config cache TTL (ms). */
export const USER_CONFIG_CACHE_TTL_MS = 5_000; // 5 seconds

/** Platform detection cache TTL (ms). */
export const PLATFORM_CACHE_TTL_MS = 60_000; // 1 minute

/** Ally identity cache TTL (ms). */
export const ALLY_IDENTITY_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/** Workspace listing cache TTL (ms). */
export const WORKSPACE_CACHE_TTL_MS = 30_000; // 30 seconds

// ─── Network ─────────────────────────────────────────────────────────────────

/** Agent toolkit server port range start. */
export const TOOLKIT_PORT_START =
  Number(process.env.TOOLKIT_PORT_START) || 5000;

/** Agent toolkit server port range end. */
export const TOOLKIT_PORT_END =
  Number(process.env.TOOLKIT_PORT_END) || 5009;

/** Hermes iMessage forwarder debounce (ms). */
export const HERMES_DEBOUNCE_MS = 10_000; // 10 seconds

// ─── Scheduled Intervals (gateway-start) ─────────────────────────────────────

/** Honcho memory sync interval (ms). */
export const HONCHO_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

/** Screenpipe hourly ingest interval (ms). */
export const SCREENPIPE_HOURLY_MS = 60 * 60_000; // 1 hour

/** Screenpipe cleanup interval (ms). */
export const SCREENPIPE_CLEANUP_MS = 12 * 60 * 60_000; // 12 hours

/** Calendar enrichment interval (ms). */
export const CALENDAR_ENRICHMENT_MS = 60 * 60_000; // 1 hour

// ─── Onboarding ──────────────────────────────────────────────────────────────

/** Max field length in onboarding wizard. */
export const ONBOARDING_MAX_FIELD_LENGTH = 500;

/** Max key people entries in onboarding wizard. */
export const ONBOARDING_MAX_KEY_PEOPLE = 20;

/** Max hard rules entries in AGENTS.md generation. */
export const ONBOARDING_MAX_HARD_RULES = 15;

// ─── Ally Identity ───────────────────────────────────────────────────────────

/** Default ally name when no SOUL.md is found. */
export const DEFAULT_ALLY_NAME = "Ally";
