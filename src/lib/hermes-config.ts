/**
 * hermes-config.ts — Sync Hermes agent config with GodMode's provider settings.
 *
 * When Venice is the active provider, writes ~/.hermes/config.yaml so that
 * Hermes uses Venice's API for chat inference. This keeps the Hermes
 * orchestrator (tool execution, agent loop) while routing model calls
 * through Venice's OpenAI-compatible endpoint.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type { ProviderConfig } from "./provider-config.js";

const HERMES_DIR = join(homedir(), ".hermes");
const HERMES_CONFIG_PATH = join(HERMES_DIR, "config.yaml");

/**
 * Sync Hermes config to use the active provider.
 *
 * For Venice: writes a custom provider config pointing at Venice's API.
 * For Anthropic: writes the default anthropic provider config.
 *
 * Preserves any existing config keys outside the `model:` block.
 */
export async function syncHermesProviderConfig(config: ProviderConfig): Promise<void> {
  try {
    mkdirSync(HERMES_DIR, { recursive: true });

    // Read existing config to preserve non-model settings
    let existingContent = "";
    if (existsSync(HERMES_CONFIG_PATH)) {
      existingContent = readFileSync(HERMES_CONFIG_PATH, "utf-8");
    }

    // Strip existing model: block (we'll rewrite it)
    const lines = existingContent.split("\n");
    const nonModelLines: string[] = [];
    let inModelBlock = false;
    for (const line of lines) {
      if (/^model:\s*$/.test(line) || /^model:\s*\{/.test(line)) {
        inModelBlock = true;
        continue;
      }
      if (inModelBlock && /^\s+/.test(line)) {
        continue; // indented line inside model block
      }
      inModelBlock = false;
      nonModelLines.push(line);
    }

    // Build new model block
    let modelBlock: string;
    if (config.provider === "venice") {
      modelBlock = [
        "model:",
        `  default: ${config.models.primary}`,
        "  provider: custom",
        `  base_url: "${config.baseUrl}"`,
        `  api_key: "${config.apiKey}"`,
      ].join("\n");
    } else {
      modelBlock = [
        "model:",
        `  default: ${config.models.primary}`,
        "  provider: anthropic",
      ].join("\n");
    }

    // Combine preserved config with new model block
    const preserved = nonModelLines.filter((l) => l.trim()).join("\n");
    const output = preserved
      ? `${modelBlock}\n${preserved}\n`
      : `${modelBlock}\n`;

    writeFileSync(HERMES_CONFIG_PATH, output, "utf-8");
  } catch {
    // Non-fatal — Hermes may not be installed
  }
}
