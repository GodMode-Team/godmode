/**
 * llm-provider.ts — Provider-agnostic LLM call layer.
 *
 * Replaces callHaiku() with a unified callLLM() that routes to either
 * Anthropic (Messages API) or Venice (OpenAI-compatible chat/completions)
 * based on the active provider config.
 *
 * All background LLM tasks (auto-title, safety gates, session distillation,
 * brief generation, etc.) use this instead of calling Anthropic directly.
 */

import { resolveProviderConfig, type ModelTier } from "./provider-config.js";
import { fetchWithTimeout } from "./anthropic-auth.js";

// ── Types ───────────────────────────────────────────────────────────

export interface CallLLMOptions {
  /** Message array (role + content). */
  messages: Array<{ role: string; content: string }>;
  /** Which model tier to use. Determines model from provider config. */
  tier: ModelTier;
  /** Override the tier's default model. */
  model?: string;
  /** Max tokens for the response. Default: 1024. */
  maxTokens?: number;
  /** System prompt (prepended as a system message). */
  system?: string;
  /** Request timeout in ms. Default: 15000. */
  timeoutMs?: number;
}

// ── Main Entry Point ────────────────────────────────────────────────

/**
 * Call the active AI provider and return the first text response.
 * Returns null on failure (caller should degrade gracefully).
 */
export async function callLLM(opts: CallLLMOptions): Promise<string | null> {
  const config = resolveProviderConfig();

  if (!config.apiKey) return null;

  const model = opts.model ?? config.models[opts.tier];
  const maxTokens = opts.maxTokens ?? 1024;
  const timeoutMs = opts.timeoutMs ?? 15_000;

  if (config.provider === "venice") {
    return callOpenAICompatible(config.baseUrl, config.apiKey, model, opts, maxTokens, timeoutMs);
  }

  return callAnthropic(config.baseUrl, config.apiKey, model, opts, maxTokens, timeoutMs);
}

// ── Anthropic Messages API ──────────────────────────────────────────

async function callAnthropic(
  baseUrl: string,
  apiKey: string,
  model: string,
  opts: CallLLMOptions,
  maxTokens: number,
  timeoutMs: number,
): Promise<string | null> {
  const body: Record<string, unknown> = {
    model,
    max_tokens: maxTokens,
    messages: opts.messages,
  };
  if (opts.system) body.system = opts.system;

  try {
    const response = await fetchWithTimeout(
      baseUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      },
      timeoutMs,
    );

    if (!response.ok) return null;
    const json = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    return json?.content?.[0]?.type === "text"
      ? (json.content[0].text ?? null)
      : null;
  } catch {
    return null;
  }
}

// ── OpenAI-Compatible API (Venice, etc.) ────────────────────────────

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  opts: CallLLMOptions,
  maxTokens: number,
  timeoutMs: number,
): Promise<string | null> {
  // Build messages array with optional system message prepended
  const messages: Array<{ role: string; content: string }> = [];
  if (opts.system) {
    messages.push({ role: "system", content: opts.system });
  }
  messages.push(...opts.messages);

  try {
    const response = await fetchWithTimeout(
      `${baseUrl.replace(/\/$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
        }),
      },
      timeoutMs,
    );

    if (!response.ok) return null;
    const json = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
          reasoning_content?: string;
        };
      }>;
    };
    // Some models (e.g. DeepSeek) put their response in content and reasoning
    // in reasoning_content. Fall back to reasoning_content if content is empty.
    const msg = json?.choices?.[0]?.message;
    return msg?.content || msg?.reasoning_content || null;
  } catch {
    return null;
  }
}
