/**
 * provider-config.ts — AI provider configuration resolution.
 *
 * Determines which AI provider (Anthropic or Venice) is active and
 * resolves the model for each tier (fast, standard, primary).
 *
 * Resolution order:
 *   1. Persisted config at ~/godmode/data/provider-config.json
 *   2. VENICE_API_KEY env var → Venice provider
 *   3. ANTHROPIC_API_KEY / Claude Code OAuth → Anthropic provider
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { resolveAnthropicKey } from "./anthropic-auth.js";
import { VENICE_API_URL, ANTHROPIC_API_URL, MODEL_HAIKU, MODEL_SONNET, MODEL_SONNET_SHORT } from "./constants.js";

// ── Types ───────────────────────────────────────────────────────────

export type ProviderType = "anthropic" | "venice";
export type ModelTier = "fast" | "standard" | "primary";

export interface ProviderConfig {
  provider: ProviderType;
  apiKey: string;
  baseUrl: string;
  models: Record<ModelTier, string>;
}

// ── Venice Defaults ─────────────────────────────────────────────────
// All defaults are privacy: "private" — inference on Venice's own GPUs.

const VENICE_DEFAULTS: Record<ModelTier, string> = {
  fast: "qwen3-5-9b",
  standard: "llama-3.3-70b",
  primary: "deepseek-v3.2",
};

// ── Anthropic Defaults ──────────────────────────────────────────────

const ANTHROPIC_DEFAULTS: Record<ModelTier, string> = {
  fast: MODEL_HAIKU,
  standard: MODEL_SONNET,
  primary: MODEL_SONNET_SHORT,
};

// ── Persisted Config ────────────────────────────────────────────────

const CONFIG_PATH = join(DATA_DIR, "provider-config.json");

interface PersistedConfig {
  provider?: ProviderType;
  models?: Partial<Record<ModelTier, string>>;
}

function loadPersistedConfig(): PersistedConfig | null {
  try {
    if (existsSync(CONFIG_PATH)) {
      return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    }
  } catch { /* corrupt or missing */ }
  return null;
}

export function saveProviderConfig(config: {
  provider: ProviderType;
  models?: Partial<Record<ModelTier, string>>;
}): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
    // Bust cache
    _configCache = null;
  } catch { /* non-fatal */ }
}

// ── Cache ───────────────────────────────────────────────────────────

let _configCache: ProviderConfig | null = null;

/** Bust the cached provider config (e.g. after env change). */
export function bustProviderCache(): void {
  _configCache = null;
}

// ── Resolution ──────────────────────────────────────────────────────

/**
 * Resolve the active AI provider configuration.
 *
 * Checks (in order):
 *   1. Persisted config file (~/godmode/data/provider-config.json)
 *   2. VENICE_API_KEY env var
 *   3. ANTHROPIC_API_KEY / Claude Code OAuth
 *
 * Returns Anthropic as fallback if no keys are found (callLLM will fail
 * gracefully with null responses, matching existing callHaiku behavior).
 */
export function resolveProviderConfig(): ProviderConfig {
  if (_configCache) return _configCache;

  const persisted = loadPersistedConfig();
  const veniceKey = process.env.VENICE_API_KEY?.trim();
  const anthropicKey = resolveAnthropicKey();

  // 1. Persisted config with explicit provider choice
  if (persisted?.provider) {
    const isVenice = persisted.provider === "venice";
    const key = isVenice ? (veniceKey ?? "") : (anthropicKey ?? "");
    const defaults = isVenice ? VENICE_DEFAULTS : ANTHROPIC_DEFAULTS;
    const baseUrl = isVenice ? VENICE_API_URL : ANTHROPIC_API_URL;

    _configCache = {
      provider: persisted.provider,
      apiKey: key,
      baseUrl,
      models: {
        fast: persisted.models?.fast ?? defaults.fast,
        standard: persisted.models?.standard ?? defaults.standard,
        primary: persisted.models?.primary ?? defaults.primary,
      },
    };
    return _configCache;
  }

  // 2. Auto-detect from env vars: Venice takes priority if key is set
  if (veniceKey) {
    _configCache = {
      provider: "venice",
      apiKey: veniceKey,
      baseUrl: VENICE_API_URL,
      models: { ...VENICE_DEFAULTS },
    };
    return _configCache;
  }

  // 3. Fallback to Anthropic
  _configCache = {
    provider: "anthropic",
    apiKey: anthropicKey ?? "",
    baseUrl: ANTHROPIC_API_URL,
    models: { ...ANTHROPIC_DEFAULTS },
  };
  return _configCache;
}

/** Get the model ID for a specific tier. */
export function getModelForTier(tier: ModelTier): string {
  return resolveProviderConfig().models[tier];
}

/** Check if Venice is the active provider. */
export function isVeniceProvider(): boolean {
  return resolveProviderConfig().provider === "venice";
}
