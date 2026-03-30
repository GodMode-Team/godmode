/**
 * provider-models.ts — Available model listings for each AI provider.
 *
 * Venice: fetches from their models API, cached for 5 minutes.
 * Anthropic: returns a static list of known models.
 */

import { fetchWithTimeout } from "./anthropic-auth.js";
import type { ProviderType } from "./provider-config.js";

// ── Types ───────────────────────────────────────────────────────────

export interface AvailableModel {
  id: string;
  name: string;
  privacy: "private" | "anonymized";
  reasoning: boolean;
  contextWindow: number;
  functionCalling: boolean;
  optimizedForCode: boolean;
}

// ── Venice Models (API-fetched, cached) ─────────────────────────────

let _veniceCache: { ts: number; models: AvailableModel[] } | null = null;
const VENICE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchVeniceModels(): Promise<AvailableModel[]> {
  // Return cache if fresh
  if (_veniceCache && Date.now() - _veniceCache.ts < VENICE_CACHE_TTL_MS) {
    return _veniceCache.models;
  }

  const apiKey = process.env.VENICE_API_KEY?.trim();
  if (!apiKey) return [];

  try {
    const response = await fetchWithTimeout(
      "https://api.venice.ai/api/v1/models",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      },
      10_000,
    );

    if (!response.ok) return _veniceCache?.models ?? [];

    const json = (await response.json()) as {
      data?: Array<{
        id: string;
        type?: string;
        model_spec?: {
          privacy?: "private" | "anonymized";
          availableContextTokens?: number;
          capabilities?: {
            supportsReasoning?: boolean;
            supportsFunctionCalling?: boolean;
            optimizedForCode?: boolean;
          };
        };
      }>;
    };

    const models: AvailableModel[] = (json.data ?? [])
      .filter((m) => m.type === "text")
      .map((m) => ({
        id: m.id,
        name: m.id,
        privacy: m.model_spec?.privacy ?? "anonymized",
        reasoning: m.model_spec?.capabilities?.supportsReasoning ?? false,
        contextWindow: m.model_spec?.availableContextTokens ?? 0,
        functionCalling: m.model_spec?.capabilities?.supportsFunctionCalling ?? false,
        optimizedForCode: m.model_spec?.capabilities?.optimizedForCode ?? false,
      }));

    _veniceCache = { ts: Date.now(), models };
    return models;
  } catch {
    return _veniceCache?.models ?? [];
  }
}

// ── Anthropic Models (static) ───────────────────────────────────────

const ANTHROPIC_MODELS: AvailableModel[] = [
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku 4.5",
    privacy: "private",
    reasoning: false,
    contextWindow: 200000,
    functionCalling: true,
    optimizedForCode: false,
  },
  {
    id: "claude-sonnet-4-6-20250514",
    name: "Claude Sonnet 4.6",
    privacy: "private",
    reasoning: false,
    contextWindow: 200000,
    functionCalling: true,
    optimizedForCode: true,
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6 (latest)",
    privacy: "private",
    reasoning: false,
    contextWindow: 200000,
    functionCalling: true,
    optimizedForCode: true,
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    privacy: "private",
    reasoning: true,
    contextWindow: 200000,
    functionCalling: true,
    optimizedForCode: true,
  },
];

// ── Public API ──────────────────────────────────────────────────────

export async function getAvailableModels(provider: ProviderType): Promise<AvailableModel[]> {
  if (provider === "venice") {
    return fetchVeniceModels();
  }
  return ANTHROPIC_MODELS;
}
