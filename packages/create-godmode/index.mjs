#!/usr/bin/env node
// create-godmode — zero to GodMode in one command

import { checkNodeVersion, checkOpenClaw, checkGodMode, getPlatform } from "./lib/detect.mjs";
import { installOpenClaw, installGodMode, installGodModeStandalone } from "./lib/install.mjs";
import { ensureConfigDir, ensureGodModeDir, writeApiKeys, checkExistingKeys } from "./lib/configure.mjs";
import { startGateway, openBrowser, waitForReady, getGodModeUrl } from "./lib/launch.mjs";

// ── ANSI helpers ────────────────────────────────────────────────────────────

const isTTY = process.stdout.isTTY;
const c = {
  reset: isTTY ? "\x1b[0m" : "",
  bold: isTTY ? "\x1b[1m" : "",
  dim: isTTY ? "\x1b[2m" : "",
  green: isTTY ? "\x1b[32m" : "",
  red: isTTY ? "\x1b[31m" : "",
  yellow: isTTY ? "\x1b[33m" : "",
  cyan: isTTY ? "\x1b[36m" : "",
  magenta: isTTY ? "\x1b[35m" : "",
};

const CHECK = `${c.green}\u2713${c.reset}`;
const CROSS = `${c.red}\u2717${c.reset}`;
const SPIN = `${c.cyan}\u21BB${c.reset}`;
const ARROW = `${c.cyan}\u25B6${c.reset}`;

function log(msg = "") {
  process.stdout.write(`  ${msg}\n`);
}

function step(icon, msg) {
  log(`${icon} ${msg}`);
}

// ── CLI argument parsing ────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    anthropicKey: null,
    honchoKey: null,
    composioKey: null,
    noLaunch: false,
    standalone: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--anthropic-key":
        opts.anthropicKey = args[++i];
        break;
      case "--honcho-key":
        opts.honchoKey = args[++i];
        break;
      case "--composio-key":
        opts.composioKey = args[++i];
        break;
      case "--no-launch":
        opts.noLaunch = true;
        break;
      case "--standalone":
        opts.standalone = true;
        break;
      case "--help":
      case "-h":
        opts.help = true;
        break;
      case "--version":
      case "-v":
        opts.version = true;
        break;
      default:
        if (arg.startsWith("--")) {
          log(`${c.yellow}Unknown flag: ${arg}${c.reset}`);
        }
        break;
    }
  }

  return opts;
}

function printHelp() {
  console.log(`
  ${c.bold}create-godmode${c.reset} — Set up GodMode in one command

  ${c.bold}Usage:${c.reset}
    npx create-godmode [options]

  ${c.bold}Options:${c.reset}
    --anthropic-key <key>   Pre-set your Anthropic API key
    --honcho-key <key>      Pre-set your Honcho API key
    --composio-key <key>    Pre-set your Composio API key
    --no-launch             Install only, don't start the gateway
    --standalone            Use standalone mode (no OpenClaw dependency)
    --help, -h              Show this help
    --version, -v           Show version

  ${c.bold}Examples:${c.reset}
    npx create-godmode
    npx create-godmode --anthropic-key sk-ant-...
    npx create-godmode --standalone --no-launch

  ${c.dim}https://lifeongodmode.com${c.reset}
`);
}

function printVersion() {
  console.log("create-godmode 1.0.0");
}

// ── Banner ──────────────────────────────────────────────────────────────────

function printBanner() {
  log();
  log(`${c.bold}${c.magenta}\uD83D\uDE80 GodMode Installer${c.reset}`);
  log(`${c.dim}\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500${c.reset}`);
  log();
}

// ── Main flow ───────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv);

  if (opts.help) {
    printHelp();
    process.exit(0);
  }
  if (opts.version) {
    printVersion();
    process.exit(0);
  }

  printBanner();

  // Step 1: Check Node.js version
  const node = checkNodeVersion();
  if (!node.ok) {
    step(CROSS, `Node.js ${node.version} detected ${c.red}(v22+ required)${c.reset}`);
    log();
    log(node.message);
    log();
    process.exit(1);
  }
  step(CHECK, `Node.js ${node.version} detected`);

  // Determine if we should use standalone mode
  let useStandalone = opts.standalone;

  // Step 2: Check / install OpenClaw (unless standalone)
  if (!useStandalone) {
    const oc = checkOpenClaw();
    if (oc.installed) {
      step(CHECK, `OpenClaw CLI found${oc.version ? ` (v${oc.version})` : ""}`);
    } else {
      step(SPIN, "Installing OpenClaw CLI...");
      try {
        installOpenClaw();
        step(CHECK, "OpenClaw CLI installed");
      } catch (err) {
        step(CROSS, `OpenClaw CLI install failed`);
        log(`${c.dim}${err.message}${c.reset}`);
        log();
        step(ARROW, `Falling back to standalone mode...`);
        useStandalone = true;
      }
    }
  }

  // Step 3: Install GodMode plugin
  if (useStandalone) {
    step(SPIN, "Installing GodMode (standalone)...");
    try {
      installGodModeStandalone();
      step(CHECK, "GodMode installed (standalone)");
    } catch (err) {
      step(CROSS, "GodMode install failed");
      log();
      log(`${c.red}Error:${c.reset} ${err.message}`);
      log();
      log("Manual install:");
      log(`  ${c.cyan}npm install -g @godmode-team/godmode${c.reset}`);
      log();
      process.exit(1);
    }
  } else {
    const gm = checkGodMode();
    if (gm.installed) {
      step(CHECK, `GodMode plugin found${gm.version ? ` (v${gm.version})` : ""}`);
    } else {
      step(SPIN, "Installing @godmode-team/godmode plugin...");
      try {
        installGodMode();
        step(CHECK, "GodMode plugin installed");
      } catch (err) {
        step(CROSS, "GodMode plugin install failed");
        log();
        log(`${c.red}Error:${c.reset} ${err.message}`);
        log();
        log("Manual install:");
        log(`  ${c.cyan}openclaw plugins install @godmode-team/godmode${c.reset}`);
        log();
        process.exit(1);
      }
    }
  }

  // Step 4: Configure directories and API keys
  try {
    ensureConfigDir();
    ensureGodModeDir();

    const hasKeys = opts.anthropicKey || opts.honchoKey || opts.composioKey;
    if (hasKeys) {
      writeApiKeys({
        anthropicKey: opts.anthropicKey,
        honchoKey: opts.honchoKey,
        composioKey: opts.composioKey,
      });
      step(CHECK, "API keys saved");
    }

    step(CHECK, "Configuration ready");
  } catch (err) {
    step(CROSS, "Configuration failed");
    log(`${c.dim}${err.message}${c.reset}`);
    log();
    log("You can configure manually later in ~/.openclaw/.env");
    log();
    // Non-fatal — continue
  }

  // Step 5: Check if user needs to set up API keys
  const existing = checkExistingKeys();
  if (!existing.hasAnthropic && !opts.anthropicKey) {
    log();
    step(
      `${c.yellow}!${c.reset}`,
      `No Anthropic API key found. You'll be prompted during setup.`
    );
    log(`${c.dim}  Or re-run: npx create-godmode --anthropic-key sk-ant-...${c.reset}`);
  }

  log();

  // Step 6: Launch (unless --no-launch)
  if (opts.noLaunch) {
    log(`${c.bold}${c.green}\uD83C\uDF89 GodMode is installed!${c.reset}`);
    log();
    if (useStandalone) {
      log(`Start GodMode:  ${c.cyan}godmode serve${c.reset}`);
    } else {
      log(`Start GodMode:  ${c.cyan}openclaw gateway start${c.reset}`);
    }
    log(`Then open:      ${c.cyan}${getGodModeUrl()}${c.reset}`);
    log();
    process.exit(0);
  }

  log(`${c.bold}${c.green}\uD83C\uDF89 GodMode is ready!${c.reset}`);
  log();
  step(SPIN, "Starting gateway...");

  const child = startGateway({ standalone: useStandalone });

  // Handle gateway crash
  child.on("error", (err) => {
    log();
    step(CROSS, `Gateway failed to start: ${err.message}`);
    log();
    if (useStandalone) {
      log(`Try manually: ${c.cyan}godmode serve${c.reset}`);
    } else {
      log(`Try manually: ${c.cyan}openclaw gateway start${c.reset}`);
    }
    process.exit(1);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      log();
      step(CROSS, `Gateway exited with code ${code}`);
      process.exit(1);
    }
  });

  // Wait for the gateway to be ready
  const ready = await waitForReady();
  if (ready) {
    const url = getGodModeUrl();
    step(CHECK, `Gateway running at ${c.cyan}${url}${c.reset}`);
    log();
    openBrowser(url);
    log(`Your AI ally is waiting. Open the URL above to begin setup.`);
    log(`Press ${c.bold}Ctrl+C${c.reset} to stop the gateway.`);
    log();
  } else {
    step(
      `${c.yellow}!${c.reset}`,
      "Gateway started but didn't respond within 15 seconds."
    );
    log(`It may still be loading. Try opening: ${c.cyan}${getGodModeUrl()}${c.reset}`);
    log();
  }

  // Keep alive — forward Ctrl+C to the child
  process.on("SIGINT", () => {
    log();
    log(`${c.dim}Shutting down gateway...${c.reset}`);
    child.kill("SIGINT");
    // Give it a moment to clean up
    setTimeout(() => process.exit(0), 1000);
  });

  process.on("SIGTERM", () => {
    child.kill("SIGTERM");
    setTimeout(() => process.exit(0), 1000);
  });
}

main().catch((err) => {
  log();
  log(`${c.red}Unexpected error:${c.reset} ${err.message}`);
  log();
  log(`If this persists, please open an issue:`);
  log(`${c.cyan}https://github.com/GodMode-Team/godmode-plugin/issues${c.reset}`);
  log();
  process.exit(1);
});
