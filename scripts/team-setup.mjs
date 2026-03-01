#!/usr/bin/env node

/**
 * GodMode Team Setup Script
 *
 * Usage: node scripts/team-setup.mjs GM-DEV-teamname
 *
 * Cross-platform (Windows, Mac, Linux). Only prerequisite: Node.js 22+.
 * Idempotent — safe to run multiple times.
 */

import { randomBytes } from "node:crypto";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform as osPlatform, arch as osArch, release as osRelease } from "node:os";

// ── ANSI helpers (works on modern terminals including Windows Terminal) ──────

const SUPPORTS_COLOR =
  process.stdout.isTTY &&
  !process.env.NO_COLOR &&
  process.env.TERM !== "dumb";

const c = SUPPORTS_COLOR
  ? {
      reset: "\x1b[0m",
      bold: "\x1b[1m",
      dim: "\x1b[2m",
      green: "\x1b[32m",
      red: "\x1b[31m",
      yellow: "\x1b[33m",
      cyan: "\x1b[36m",
      magenta: "\x1b[35m",
      white: "\x1b[37m",
      bgGreen: "\x1b[42m",
      bgRed: "\x1b[41m",
    }
  : {
      reset: "", bold: "", dim: "", green: "", red: "", yellow: "",
      cyan: "", magenta: "", white: "", bgGreen: "", bgRed: "",
    };

function stepHeader(num, total, label) {
  console.log(
    `\n${c.cyan}${c.bold}[${num}/${total}]${c.reset} ${c.white}${c.bold}${label}${c.reset}`
  );
}

function ok(msg) {
  console.log(`  ${c.green}\u2714${c.reset}  ${msg}`);
}

function warn(msg) {
  console.log(`  ${c.yellow}\u26A0${c.reset}  ${c.yellow}${msg}${c.reset}`);
}

function fail(msg) {
  console.log(`  ${c.red}\u2716${c.reset}  ${c.red}${msg}${c.reset}`);
}

function info(msg) {
  console.log(`  ${c.dim}${msg}${c.reset}`);
}

function recovery(lines) {
  console.log(`\n  ${c.yellow}${c.bold}Manual recovery:${c.reset}`);
  for (const line of lines) {
    console.log(`  ${c.yellow}  -> ${line}${c.reset}`);
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const IS_WINDOWS = osPlatform() === "win32";

function exec(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: "utf-8",
    stdio: opts.stdio ?? "pipe",
    timeout: opts.timeout ?? 120_000,
    shell: IS_WINDOWS ? "cmd.exe" : "/bin/sh",
    ...opts,
  }).trim();
}

function commandExists(name) {
  try {
    if (IS_WINDOWS) {
      exec(`where ${name}`);
    } else {
      exec(`which ${name}`);
    }
    return true;
  } catch {
    return false;
  }
}

function platformLabel() {
  const p = osPlatform();
  const labels = {
    win32: "Windows",
    darwin: "macOS",
    linux: "Linux",
    freebsd: "FreeBSD",
    sunos: "SunOS",
  };
  return labels[p] ?? p;
}

// ── Validate arguments ─────────────────────────────────────────────────────

const licenseKey = process.argv[2];

if (!licenseKey) {
  console.log(`
${c.cyan}${c.bold}GodMode Team Setup${c.reset}

${c.white}Usage:${c.reset}
  ${c.green}node scripts/team-setup.mjs ${c.yellow}<LICENSE-KEY>${c.reset}

${c.white}Example:${c.reset}
  ${c.dim}node scripts/team-setup.mjs GM-DEV-teamname${c.reset}

The license key is provided by your team admin or at ${c.cyan}https://lifeongodmode.com${c.reset}.
`);
  process.exit(1);
}

// ── Constants ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 7;
const GODMODE_URL = "http://127.0.0.1:18789/godmode/";

console.log(`\n${c.magenta}${c.bold}=== GodMode Team Setup ===${c.reset}\n`);

// ── Step 1: Detect platform ────────────────────────────────────────────────

stepHeader(1, TOTAL_STEPS, "Detecting platform");

try {
  const plat = platformLabel();
  const architecture = osArch();
  const release = osRelease();
  ok(`Platform: ${c.bold}${plat}${c.reset} (${architecture})`);
  info(`OS release: ${release}`);
} catch (err) {
  fail("Could not detect platform");
  info(err.message);
  recovery(["This is informational only — continuing anyway."]);
}

// ── Step 2: Check Node.js version ──────────────────────────────────────────

stepHeader(2, TOTAL_STEPS, "Checking Node.js version");

try {
  const rawVersion = process.versions.node;
  const major = parseInt(rawVersion.split(".")[0], 10);

  if (major < 22) {
    fail(`Node.js ${rawVersion} detected — version 22+ is required`);

    const upgradeInstructions = {
      darwin: [
        "Download the latest LTS from https://nodejs.org/en/download",
        "Or use a version manager: fnm install 22 && fnm use 22",
      ],
      linux: [
        "Download the latest LTS from https://nodejs.org/en/download",
        "Or use a version manager: fnm install 22 && fnm use 22",
        "Or via NodeSource: https://github.com/nodesource/distributions",
      ],
      win32: [
        "Download the latest LTS from https://nodejs.org/en/download",
        "Or use a version manager: fnm install 22 && fnm use 22",
      ],
    };

    recovery(upgradeInstructions[osPlatform()] ?? upgradeInstructions.linux);
    process.exit(1);
  }

  ok(`Node.js ${c.bold}v${rawVersion}${c.reset}`);
} catch (err) {
  fail("Could not determine Node.js version");
  info(err.message);
  recovery([
    "Ensure Node.js 22+ is installed: https://nodejs.org/en/download",
  ]);
  process.exit(1);
}

// ── Step 3: Check / install OpenClaw CLI ────────────────────────────────────

stepHeader(3, TOTAL_STEPS, "Checking OpenClaw CLI");

try {
  if (commandExists("openclaw")) {
    let version = "";
    try {
      version = exec("openclaw --version");
    } catch {
      version = "(version unknown)";
    }
    ok(`OpenClaw CLI already installed — ${version}`);
  } else {
    warn("OpenClaw CLI not found — installing globally via npm...");
    try {
      exec("npm install -g openclaw", { stdio: "inherit", timeout: 300_000 });
      ok("OpenClaw CLI installed successfully");
    } catch (installErr) {
      fail("Failed to install OpenClaw CLI");
      info(installErr.message);
      recovery([
        "npm install -g openclaw",
        "If permission denied, try: npm install -g openclaw --prefix ~/.local",
        "Then add ~/.local/bin to your PATH",
      ]);
      process.exit(1);
    }
  }
} catch (err) {
  fail("Unexpected error checking for OpenClaw CLI");
  info(err.message);
  recovery(["npm install -g openclaw"]);
  process.exit(1);
}

// ── Step 4: Check / install GodMode plugin ──────────────────────────────────

stepHeader(4, TOTAL_STEPS, "Checking GodMode plugin");

try {
  let pluginInstalled = false;

  try {
    const pluginList = exec("openclaw plugins list");
    // Check for the plugin name in the output (case-insensitive, partial match)
    pluginInstalled =
      pluginList.toLowerCase().includes("godmode") ||
      pluginList.includes("@godmode-team/godmode");
  } catch {
    // plugins list failed — assume not installed
    pluginInstalled = false;
  }

  if (pluginInstalled) {
    ok("GodMode plugin already installed");
  } else {
    warn("GodMode plugin not found — installing...");
    try {
      exec("openclaw plugins install @godmode-team/godmode", {
        stdio: "inherit",
        timeout: 300_000,
      });
      ok("GodMode plugin installed successfully");
    } catch (installErr) {
      fail("Failed to install GodMode plugin");
      info(installErr.message);
      recovery([
        "openclaw plugins install @godmode-team/godmode",
        "Check your npm registry access and try again",
      ]);
      process.exit(1);
    }
  }
} catch (err) {
  fail("Unexpected error checking GodMode plugin");
  info(err.message);
  recovery(["openclaw plugins install @godmode-team/godmode"]);
  process.exit(1);
}

// ── Step 5: Activate license ────────────────────────────────────────────────

stepHeader(5, TOTAL_STEPS, "Activating license");

try {
  exec(`openclaw godmode activate ${licenseKey}`, { stdio: "inherit" });
  ok(`License activated: ${c.bold}${licenseKey}${c.reset}`);
} catch (err) {
  fail("License activation failed");
  info(err.message);
  recovery([
    `openclaw godmode activate ${licenseKey}`,
    "Verify your license key is correct",
    "Contact your team admin or visit https://lifeongodmode.com for support",
  ]);
  process.exit(1);
}

// ── Step 6: Configure gateway ───────────────────────────────────────────────

stepHeader(6, TOTAL_STEPS, "Configuring gateway");

const configEntries = [
  ["gateway.mode", "local"],
  ["gateway.controlUi.enabled", "true"],
  ["plugins.enabled", "true"],
];

let configSuccess = true;

for (const [key, value] of configEntries) {
  try {
    exec(`openclaw config set ${key} ${value}`);
    ok(`${key} = ${c.bold}${value}${c.reset}`);
  } catch (err) {
    fail(`Failed to set ${key}`);
    info(err.message);
    configSuccess = false;
  }
}

if (!configSuccess) {
  warn("Some configuration entries failed");
  recovery(
    configEntries.map(([k, v]) => `openclaw config set ${k} ${v}`)
  );
}

// ── Step 7: Generate gateway security token ──────────────────────────────────

stepHeader(7, TOTAL_STEPS, "Securing gateway");

try {
  const stateDir = process.env.OPENCLAW_STATE_DIR || join(homedir(), ".openclaw");
  const configPath = join(stateDir, "openclaw.json");

  let config = {};
  try {
    config = JSON.parse(readFileSync(configPath, "utf-8"));
  } catch {
    // Config may not exist yet
  }

  if (!config.gateway || typeof config.gateway !== "object") {
    config.gateway = {};
  }

  // Check both gateway.token (legacy) and gateway.auth.token (standard)
  const existingAuth = config.gateway.auth || {};
  const hasToken = Boolean(config.gateway.token) || Boolean(existingAuth.token);

  if (hasToken) {
    ok("Gateway auth token already configured");
  } else {
    if (!config.gateway.auth || typeof config.gateway.auth !== "object") {
      config.gateway.auth = {};
    }
    config.gateway.auth.mode = "token";
    config.gateway.auth.token = randomBytes(32).toString("hex");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
    ok("Gateway security token generated and saved");
    info("Token authenticates WebSocket connections to prevent unauthorized access");
  }
} catch (err) {
  warn("Could not generate gateway token");
  info(err.message);
  recovery([
    'openclaw config set gateway.token "$(openssl rand -hex 32)"',
    "This prevents unauthorized processes from sending agent commands",
  ]);
}

// ── Done ────────────────────────────────────────────────────────────────────

console.log(`
${c.green}${c.bold}${"=".repeat(48)}${c.reset}
${c.green}${c.bold}  Setup complete!${c.reset}
${c.green}${c.bold}${"=".repeat(48)}${c.reset}

  ${c.white}${c.bold}Start the gateway:${c.reset}
    ${c.cyan}openclaw gateway start${c.reset}

  ${c.white}${c.bold}Open GodMode:${c.reset}
    ${c.cyan}${GODMODE_URL}${c.reset}

  ${c.dim}Run this script again at any time — it is safe to re-run.${c.reset}
`);
