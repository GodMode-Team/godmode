#!/usr/bin/env node
/**
 * reconfigure-paperclip-agents.mjs
 *
 * Switches Paperclip agents from their current adapter to a target adapter.
 * Supports hermes_local (for Hermes runtime) and openclaw_gateway (for OpenClaw).
 *
 * Usage:
 *   node scripts/reconfigure-paperclip-agents.mjs [hermes_local|openclaw_gateway|claude_local] [--dry-run]
 *
 * Environment:
 *   PAPERCLIP_URL        — Paperclip server URL (default: http://localhost:3100)
 *   PAPERCLIP_API_KEY    — API key
 *   PAPERCLIP_COMPANY_ID — Company ID
 */

const ADAPTER = process.argv[2] || "hermes_local";
const DRY_RUN = process.argv.includes("--dry-run");

const PAPERCLIP_URL = (process.env.PAPERCLIP_URL || "http://localhost:3100").replace(/\/+$/, "");
const API_KEY = process.env.PAPERCLIP_API_KEY || "";
const COMPANY_ID = process.env.PAPERCLIP_COMPANY_ID || "";

if (!["hermes_local", "openclaw_gateway", "claude_local"].includes(ADAPTER)) {
  console.error(`Unknown adapter: ${ADAPTER}. Use hermes_local, openclaw_gateway, or claude_local.`);
  process.exit(1);
}

// Adapter-specific default configs
const ADAPTER_CONFIGS = {
  hermes_local: {
    command: "hermes",
    args: ["chat", "-q"],
    cwd: process.env.HOME,
    timeoutSec: 1800,
    graceSec: 30,
    env: {},
  },
  claude_local: {
    command: "claude",
    model: "claude-sonnet-4-20250514",
    cwd: process.env.HOME,
    maxTurnsPerRun: 50,
    timeoutSec: 1800,
    dangerouslySkipPermissions: true,
    env: {},
  },
  openclaw_gateway: {
    wsUrl: "ws://127.0.0.1:18789/ws",
    timeoutSec: 1800,
  },
};

async function apiFetch(path, opts = {}) {
  const url = `${PAPERCLIP_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
  };
  const init = { method: opts.method || "GET", headers };
  if (opts.body) init.body = JSON.stringify(opts.body);
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log(`\n🔧 Reconfiguring Paperclip agents → ${ADAPTER}${DRY_RUN ? " (DRY RUN)" : ""}\n`);

  // Fetch all agents
  const result = await apiFetch(`/api/companies/${COMPANY_ID}/agents`);
  const agents = Array.isArray(result) ? result : result.agents ?? [];

  if (agents.length === 0) {
    console.log("No agents found.");
    return;
  }

  const defaultConfig = ADAPTER_CONFIGS[ADAPTER];
  let updated = 0;
  let skipped = 0;

  for (const agent of agents) {
    const current = agent.adapterType || "(none)";

    // Skip agents already on the target adapter
    if (current === ADAPTER) {
      console.log(`  ✓ ${agent.name} — already on ${ADAPTER}`);
      skipped++;
      continue;
    }

    // Build per-agent config — merge defaults with any prompt template
    const config = { ...defaultConfig };

    // For hermes_local, inject agent name into the prompt args
    if (ADAPTER === "hermes_local") {
      config.args = ["chat", "-q"];
    }

    // For claude_local, build a prompt template with agent identity
    if (ADAPTER === "claude_local") {
      config.promptTemplate =
        `You are ${agent.name}. ${agent.role || ""}\n\n` +
        `Your task:\n\n{{context.issueDescription}}\n\n{{context.issueTitle}}`;
    }

    if (DRY_RUN) {
      console.log(`  → ${agent.name}: ${current} → ${ADAPTER} (would update)`);
    } else {
      try {
        await apiFetch(`/api/agents/${agent.id}`, {
          method: "PATCH",
          body: {
            adapterType: ADAPTER,
            adapterConfig: config,
          },
        });
        console.log(`  ✓ ${agent.name}: ${current} → ${ADAPTER}`);
        updated++;
      } catch (err) {
        console.error(`  ✗ ${agent.name}: failed — ${err.message}`);
      }
    }
  }

  console.log(`\nDone. ${updated} updated, ${skipped} already configured.`);
  if (DRY_RUN) console.log("(Dry run — no changes made. Remove --dry-run to apply.)\n");
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
