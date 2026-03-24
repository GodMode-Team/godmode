/**
 * gateway-start.ts — Gateway startup initialization sequence.
 *
 * Initializes all GodMode services in order: env loading, auth refresh,
 * zombie cleanup, host compat, content seeding, and service startup.
 */

import { existsSync, readFileSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { DATA_DIR, GODMODE_ROOT, MEMORY_DIR } from "../data-paths.js";
import { detectHostContext, safeBroadcast } from "../lib/host-context.js";
import { notifySession } from "../lib/session-notifier.js";
import { killZombieGateways } from "../lib/zombie-guard.js";
import { refreshLicenseOnStart } from "../lib/license.js";
import { health, turnErrors, sessions } from "../lib/health-ledger.js";
import { writeSentinel, consumeSentinel } from "../lib/restart-sentinel.js";

import type { Logger } from "../types/plugin-api.js";
type CleanupEntry = { name: string; fn: () => void | Promise<void> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepts both OpenClawPluginApi and Hermes adapter shim
export async function runGatewayStart(
  api: any,
  pluginVersion: string,
  pluginRoot: string,
  serviceCleanup: CleanupEntry[],
  methodCount = 0,
): Promise<void> {
  const logger: Logger = api.logger;

  // ── Part A: Duplicate Plugin Guard ────────────────────────────────
  // If another copy of GodMode is already loaded in this process, refuse
  // to double-register. This prevents the catastrophic silent-death bug
  // where duplicate plugins cause re-registration on every message.
  const g = globalThis as Record<string, unknown>;
  if (g.__godmodeInstanceId) {
    logger.error(
      `[GodMode] FATAL: Duplicate plugin detected! Instance already loaded from "${g.__godmodeInstanceId}". ` +
      `This instance (from ${pluginRoot}) will NOT initialize. ` +
      `Remove the duplicate: rm -rf ~/.openclaw/extensions/godmode/ and remove plugins.installs.godmode from openclaw.json.`,
    );
    health.signal("gateway.duplicate-blocked", false, {
      existingId: g.__godmodeInstanceId,
      thisRoot: pluginRoot,
    });
    turnErrors.capture(
      "duplicate-plugin",
      `Duplicate GodMode plugin blocked. Active: ${g.__godmodeInstanceId}, blocked: ${pluginRoot}. Remove the duplicate to fix.`,
    );
    return; // Do NOT initialize anything
  }
  g.__godmodeInstanceId = pluginRoot;

  // ── Global Crash Handlers — write diagnostics before process death ──
  if (!g.__godmodeCrashHandlersRegistered) {
    const { writeCrashSentinel } = await import("../lib/restart-sentinel.js");

    process.on("uncaughtException", (err) => {
      logger.error(`[GodMode] CRASH: Uncaught exception: ${err.message}`);
      const activeKeys = sessions.activeKeys();
      writeCrashSentinel(
        err.message,
        err.stack ?? "no stack",
        "uncaughtException",
        activeKeys,
      );
      const serviceNames = serviceCleanup.map((s) => s.name);
      writeSentinel(activeKeys, serviceNames, "unknown");
    });

    process.on("unhandledRejection", (reason) => {
      const msg = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? (reason.stack ?? "no stack") : "no stack";
      logger.error(`[GodMode] CRASH: Unhandled rejection: ${msg}`);
      const activeKeys = sessions.activeKeys();
      writeCrashSentinel(msg, stack, "unhandledRejection", activeKeys);
      const serviceNames = serviceCleanup.map((s) => s.name);
      writeSentinel(activeKeys, serviceNames, "unknown");
    });

    g.__godmodeCrashHandlersRegistered = true;
  }

  // ── Part C: Config Shield — detect stale npm duplicate ────────────
  // Even if only one copy loaded, warn if the extensions dir still exists
  // (it could cause a duplicate on the next restart/update).
  try {
    const home = homedir();
    const extensionsGodmode = join(
      process.env.OPENCLAW_STATE_DIR || join(home, ".openclaw"),
      "extensions", "godmode",
    );
    if (existsSync(extensionsGodmode) && !pluginRoot.includes("extensions/godmode")) {
      logger.warn(
        `[GodMode] CONFIG WARNING: Stale npm duplicate exists at ${extensionsGodmode}. ` +
        `Dev copy is active from ${pluginRoot}. Remove it: rm -rf ${extensionsGodmode} ` +
        `and remove plugins.installs.godmode from openclaw.json to prevent duplicate loading.`,
      );
      health.signal("gateway.config-shield", false, {
        warning: "stale-npm-duplicate",
        npmPath: extensionsGodmode,
        devPath: pluginRoot,
      });
      turnErrors.capture(
        "config-shield",
        `Stale GodMode npm copy at ${extensionsGodmode} may cause duplicates. Remove it.`,
      );
    }
  } catch { /* non-fatal */ }

  // ── Part B: Restart Sentinel — recover from previous shutdown ─────
  try {
    const restartInfo = consumeSentinel();
    if (restartInfo) {
      const downtimeSec = Math.round(restartInfo.downtimeMs / 1000);
      logger.info(
        `[GodMode] Recovered from restart (downtime: ${downtimeSec}s, ` +
        `${restartInfo.previousSessions.length} session(s) were active, reason: ${restartInfo.reason})`,
      );
      health.signal("gateway.restart-recovery", true, {
        downtimeMs: restartInfo.downtimeMs,
        previousSessionCount: restartInfo.previousSessions.length,
        reason: restartInfo.reason,
      });
    }
  } catch { /* non-fatal */ }

  // ── Crash Sentinel — detect if previous shutdown was a crash ─────
  try {
    const { consumeCrashSentinel } = await import("../lib/restart-sentinel.js");
    const crashInfo = consumeCrashSentinel();
    if (crashInfo) {
      const downtimeSec = Math.round(crashInfo.downtimeMs / 1000);
      logger.warn(
        `[GodMode] Recovered from CRASH (downtime: ${downtimeSec}s, ` +
        `type: ${crashInfo.type}, error: ${crashInfo.error})`,
      );
      health.signal("gateway.crash-recovery", true, {
        downtimeMs: crashInfo.downtimeMs,
        type: crashInfo.type,
        error: crashInfo.error,
        previousSessionCount: crashInfo.previousSessions.length,
      });
      turnErrors.capture(
        "gateway-crash",
        `GodMode crashed ${downtimeSec}s ago (${crashInfo.type}: ${crashInfo.error}). Now recovered.`,
      );
    }
  } catch { /* non-fatal */ }

  health.signal("gateway.start", true, { pluginRoot, pid: process.pid });

  // Warm the allowed-paths cache so files.read works for workspace files
  try {
    const { initAllowedPaths } = await import("../lib/vault-paths.js");
    initAllowedPaths();
  } catch { /* non-fatal */ }

  // Load workspace .env into process.env
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE || "";
    const envPaths = [
      join(GODMODE_ROOT, ".env"),
      join(process.env.OPENCLAW_STATE_DIR || join(homeDir, ".openclaw"), ".env"),
    ];
    let loaded = 0;
    for (const envPath of envPaths) {
      if (!existsSync(envPath)) continue;
      const raw = readFileSync(envPath, "utf-8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const cleaned = trimmed.replace(/^export\s+/, "");
        const eqIdx = cleaned.indexOf("=");
        if (eqIdx < 1) continue;
        const key = cleaned.slice(0, eqIdx).trim();
        let val = cleaned.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
          loaded++;
        }
      }
    }
    if (loaded > 0) {
      logger.info(`[GodMode] Loaded ${loaded} env var(s) from workspace .env`);
    }
  } catch (err) {
    logger.warn(`[GodMode] Failed to load workspace .env: ${String(err)}`);
  }

  // ── Auto-generate security secrets if not set ─────────────────────
  // On first run (or fresh install), generate secrets and append to ~/godmode/.env
  try {
    const { randomBytes } = await import("node:crypto");
    const { appendFile } = await import("node:fs/promises");
    const godmodeEnvPath = join(GODMODE_ROOT, ".env");
    const secrets: { key: string; label: string }[] = [
      { key: "GODMODE_WEBHOOK_SECRET", label: "Webhook HMAC signing secret" },
      { key: "GOG_KEYRING_PASSWORD", label: "gog CLI keyring password" },
    ];
    for (const { key, label } of secrets) {
      if (!process.env[key]) {
        const generated = randomBytes(32).toString("hex");
        process.env[key] = generated;
        await appendFile(godmodeEnvPath, `\n# ${label} (auto-generated)\n${key}=${generated}\n`);
        logger.info(`[GodMode] Auto-generated ${key} and saved to .env`);
      }
    }
  } catch (err) {
    logger.warn(`[GodMode] Failed to auto-generate secrets: ${String(err)}`);
  }

  // Drain stale cleanup from a previous gateway cycle
  if (serviceCleanup.length > 0) {
    logger.warn(`[GodMode] Draining ${serviceCleanup.length} stale service cleanup(s) from previous cycle`);
    for (const entry of serviceCleanup) {
      try { await entry.fn(); } catch { /* swallow — previous cycle */ }
    }
    serviceCleanup.length = 0;
  }

  // JWT token refresh
  await refreshLicenseOnStart(logger);

  // Kill zombie gateway processes
  const zombies = killZombieGateways(logger);
  if (zombies.length > 0) {
    logger.warn(`[GodMode] Cleaned up ${zombies.length} zombie gateway process(es)`);
  }

  // Check for pending builder deploys — clear the flag on restart
  try {
    const { readFile, unlink } = await import("node:fs/promises");
    const pendingPath = join(DATA_DIR, "pending-deploy.json");
    const raw = await readFile(pendingPath, "utf-8").catch(() => "");
    if (raw) {
      const deploy = JSON.parse(raw);
      logger.info(
        `[GodMode] Builder deploy activated: ${deploy.summary ?? "unknown fix"} (branch: ${deploy.branch ?? "?"})`,
      );
      // Clear the flag — this deploy is now live
      await unlink(pendingPath).catch(() => {});
    }
  } catch { /* no pending deploy — normal */ }

  // Seed deploy project registry (only if empty — don't overwrite user data)
  try {
    const { loadRegistry, registerProject } = await import("../lib/project-registry.js");
    const existing = await loadRegistry();
    if (existing.length === 0) {
      await registerProject({
        domain: "lifeongodmode.com",
        repo: "GodMode-Team/lifeongodmode",
        localDir: "~/godmode/private/sites/lifeongodmode",
        platform: "vercel",
        projectName: "lifeongodmode",
        branch: "main",
        updatedAt: new Date().toISOString(),
      });
      logger.info("[GodMode] Seeded deploy project registry with lifeongodmode.com");
    }
  } catch (err) {
    logger.warn(`[GodMode] Deploy registry seed failed (non-fatal): ${String(err)}`);
  }

  // Host compatibility scan
  try {
    const { changes } = await detectHostContext(api, pluginVersion);
    if (changes.length > 0) {
      logger.warn(`[GodMode] Host environment changed (${changes.length} change(s)) — self-healing active`);
    }
  } catch (err) {
    logger.warn(`[GodMode] Host compat scan failed: ${String(err)}`);
  }

  // Bootstrap core directories so Second Brain file-walk works out of the box
  try {
    const coreDirs = [
      DATA_DIR,
      MEMORY_DIR,
      join(MEMORY_DIR, "research"),
      join(MEMORY_DIR, "bank", "people"),
      join(MEMORY_DIR, "bank", "companies"),
      join(MEMORY_DIR, "projects"),
      join(MEMORY_DIR, "identity"),
      join(MEMORY_DIR, "inbox"),
    ];
    for (const dir of coreDirs) {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    }
    // Seed starter MEMORY.md if missing — gives file-walk something to find
    const memoryMdPath = join(MEMORY_DIR, "MEMORY.md");
    if (!existsSync(memoryMdPath)) {
      const { writeFileSync } = await import("node:fs");
      writeFileSync(memoryMdPath, [
        "# GodMode Memory",
        "",
        "This is your personal knowledge base. GodMode stores memories,",
        "research, and notes here. Search works automatically.",
        "",
        "## Getting Started",
        "- Ask your ally to remember things — they'll be stored here",
        "- Drop markdown files into subdirectories for instant search",
        "- Connect Obsidian for a richer Second Brain experience",
        "",
      ].join("\n"), "utf-8");
      logger.info("[GodMode] Bootstrapped ~/godmode/memory/ for Second Brain");
    }
  } catch (err) {
    logger.warn(`[GodMode] Directory bootstrap failed: ${String(err)}`);
  }

  // Seed starter personas + skills
  try {
    const seedModuleDir = dirname(fileURLToPath(import.meta.url));
    const seedPluginRoot = basename(seedModuleDir) === "dist" ? dirname(seedModuleDir) : seedModuleDir;
    const rosterTarget = join(MEMORY_DIR, "agent-roster");
    const rosterSource = join(seedPluginRoot, "assets", "agent-roster");
    if (existsSync(rosterSource)) {
      const hasExisting = existsSync(rosterTarget) && readdirSync(rosterTarget).filter(f => f.endsWith(".md")).length > 0;
      if (!hasExisting) {
        mkdirSync(rosterTarget, { recursive: true });
        const sourceFiles = readdirSync(rosterSource).filter(f => f.endsWith(".md"));
        for (const f of sourceFiles) {
          copyFileSync(join(rosterSource, f), join(rosterTarget, f));
        }
        logger.info(`[GodMode] Seeded ${sourceFiles.length} starter personas`);
      }
    }
    const skillsTarget = join(dirname(MEMORY_DIR), "skills");
    const skillsSource = join(seedPluginRoot, "assets", "skills");
    if (existsSync(skillsSource)) {
      const hasExistingSkills = existsSync(skillsTarget) && readdirSync(skillsTarget).filter(f => f.endsWith(".md")).length > 0;
      if (!hasExistingSkills) {
        mkdirSync(skillsTarget, { recursive: true });
        const sourceSkills = readdirSync(skillsSource).filter(f => f.endsWith(".md"));
        for (const f of sourceSkills) {
          copyFileSync(join(skillsSource, f), join(skillsTarget, f));
        }
        logger.info(`[GodMode] Seeded ${sourceSkills.length} starter skills`);
      }
    }
    // Sync skill cards — copy any new cards from repo, don't overwrite user edits
    const cardsTarget = join(MEMORY_DIR, "skill-cards");
    const cardsSource = join(seedPluginRoot, "skill-cards");
    if (existsSync(cardsSource)) {
      mkdirSync(cardsTarget, { recursive: true });
      const sourceCards = readdirSync(cardsSource).filter(f => f.endsWith(".md"));
      let synced = 0;
      for (const f of sourceCards) {
        const dest = join(cardsTarget, f);
        if (!existsSync(dest)) {
          copyFileSync(join(cardsSource, f), dest);
          synced++;
        }
      }
      if (synced > 0) logger.info(`[GodMode] Synced ${synced} new skill card(s)`);
    }
  } catch (err) {
    logger.warn(`[GodMode] Starter content seeding failed: ${String(err)}`);
  }

  // ── Service initialization ──────────────────────────────────────────

  // Agent log writer
  try {
    const { initAgentLogWriter } = await import("../services/agent-log-writer.js");
    const started = await initAgentLogWriter();
    if (started) {
      logger.info("[GodMode] agent-log writer initialized");
    } else {
      logger.warn("[GodMode] agent-log writer unavailable in this runtime");
    }
  } catch (err) {
    logger.warn(`[GodMode] agent-log writer failed to initialize: ${String(err)}`);
  }

  // Workspace sync service
  try {
    const { startWorkspaceSyncService, getWorkspaceSyncService } = await import("../lib/workspace-sync-service.js");
    await startWorkspaceSyncService(logger);
    serviceCleanup.push({ name: "workspace-sync", fn: () => getWorkspaceSyncService().stop() });
    logger.info("[GodMode] workspace sync service initialized");
  } catch (err) {
    logger.warn(`[GodMode] workspace sync service failed to start: ${String(err)}`);
  }

  // REMOVED (v2 slim): curation-agent service

  // Skill cards
  try {
    const { ensureSkillCards } = await import("../lib/skill-cards.js");
    ensureSkillCards(pluginRoot);
  } catch { /* non-fatal */ }

  // Memory provider (Honcho or none)
  try {
    const { initMemory, getMemoryProvider } = await import("../lib/memory.js");
    const memoryOk = await initMemory();
    if (memoryOk) {
      logger.info(`[GodMode] Memory initialized (provider: ${getMemoryProvider()})`);

      // Periodic vault sync every 6 hours (gateway runs indefinitely)
      const HONCHO_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;
      const honchoSyncTimer = setInterval(async () => {
        try {
          const { syncHonchoToVault } = await import("../services/honcho-sync.js");
          await syncHonchoToVault();
          logger.info("[GodMode] Periodic Honcho vault sync complete");
        } catch (err) {
          logger.warn(`[GodMode] Periodic Honcho vault sync failed: ${String(err)}`);
        }
      }, HONCHO_SYNC_INTERVAL_MS);
      serviceCleanup.push({ name: "honcho-vault-sync", fn: () => clearInterval(honchoSyncTimer) });
    } else {
      logger.warn("[GodMode] Memory not available (missing provider key or init failed)");
    }
  } catch (err) {
    logger.warn(`[GodMode] Memory init failed (non-fatal): ${String(err)}`);
  }

  // Session search (FTS5 local index)
  try {
    const { initSessionSearch, isSessionSearchReady, pruneOldMessages, closeSessionSearch } = await import("../lib/session-search.js");
    initSessionSearch();
    if (isSessionSearchReady()) {
      logger.info("[GodMode] Session search (FTS5) initialized");
      // Prune old messages on startup
      const pruned = pruneOldMessages();
      if (pruned > 0) logger.info(`[GodMode] Session search: pruned ${pruned} messages older than 90 days`);
      serviceCleanup.push({ name: "session-search", fn: () => closeSessionSearch() });
    }
  } catch (err) {
    logger.warn(`[GodMode] Session search init failed (non-fatal): ${String(err)}`);
  }

  // Identity graph
  try {
    const { initIdentityGraph, isGraphReady, seedFromVault: seedGraphFromVault } = await import("../lib/identity-graph.js");
    initIdentityGraph();
    if (isGraphReady()) {
      logger.info("[GodMode] Identity graph initialized");
      void seedGraphFromVault().catch((err) =>
        logger.warn(`[GodMode] Identity graph seeding failed (non-fatal): ${String(err)}`),
      );
    }
  } catch (err) {
    logger.warn(`[GodMode] Identity graph init failed (non-fatal): ${String(err)}`);
  }

  // QMD binary check (#25) — warn if missing so users know search is degraded
  try {
    const { execFileSync } = await import("node:child_process");
    execFileSync("qmd", ["--version"], { timeout: 3000, stdio: "pipe" });
    logger.info("[GodMode] qmd binary found — full-text vault search available");
  } catch {
    logger.warn(
      "[GodMode] qmd binary not found — Second Brain search will use file-walk fallback. " +
      "Install qmd for faster hybrid search: https://github.com/quadratic-ai/qmd",
    );
    health.signal("qmd.binary", false, { warning: "qmd not installed — using file-walk fallback" });
  }

  // Image cache cleanup
  try {
    const { cleanupCache } = await import("../services/image-cache.js");
    const cacheResult = await cleanupCache();
    if (cacheResult.removed > 0) {
      logger.info(`[GodMode] image cache cleanup: removed ${cacheResult.removed} entries`);
    }
  } catch (err) {
    logger.warn(`[GodMode] image cache cleanup failed: ${String(err)}`);
  }

  // Post-update health audit
  try {
    const { execSync } = await import("node:child_process");
    const { runPostUpdateHealthAudit } = await import("../methods/system-update.js");
    let currentOcVersion = "unknown";
    try {
      currentOcVersion = execSync("openclaw --version 2>/dev/null", { timeout: 5000 }).toString().trim();
    } catch { /* openclaw not on PATH */ }
    runPostUpdateHealthAudit(
      currentOcVersion,
      methodCount,
      pluginVersion,
      logger,
      (event, data) => safeBroadcast(api, event, data),
    );
  } catch (err) {
    logger.warn(`[GodMode] Post-update audit error: ${String(err)}`);
  }

  // Queue processor
  try {
    const { initQueueProcessor, getQueueProcessor } = await import("../services/queue-processor.js");
    const queueProcessor = initQueueProcessor(logger);
    queueProcessor.setBroadcast((event: string, data: unknown) => safeBroadcast(api, event, data));
    queueProcessor.setApi(api);
    await queueProcessor.recoverOrphaned();
    queueProcessor.startPolling();
    serviceCleanup.push({ name: "queue-processor", fn: () => getQueueProcessor()?.stop() });
    logger.info("[GodMode] Queue processor initialized (10-min polling)");
  } catch (err) {
    logger.warn(`[GodMode] Queue processor failed to init: ${String(err)}`);
  }

  // Universal inbox broadcast hook
  try {
    const { setInboxBroadcast } = await import("../services/inbox.js");
    setInboxBroadcast((event: string, data: unknown) => safeBroadcast(api, event, data));
    logger.info("[GodMode] Universal inbox initialized");
  } catch (err) {
    logger.warn(`[GodMode] Inbox broadcast setup failed: ${String(err)}`);
  }

  // REMOVED (v2 slim): proof-server — not using Proof

  // Agent Toolkit Server (runtime knowledge API for spawned agents)
  try {
    const { startToolkitServer, stopToolkitServer } = await import("../services/agent-toolkit-server.js");
    const toolkitOk = await startToolkitServer(logger);
    if (toolkitOk) {
      serviceCleanup.push({ name: "toolkit-server", fn: () => stopToolkitServer() });
      logger.info("[GodMode] Agent Toolkit Server started");
    } else {
      logger.warn("[GodMode] Agent Toolkit Server unavailable (ports 5000-5009 busy)");
    }
  } catch (err) {
    logger.warn(`[GodMode] Toolkit server failed to start: ${String(err)}`);
  }

  // Paperclip agent orchestration (optional — falls back to local queue)
  try {
    const { initPaperclip, startCompletionPoller, stopCompletionPoller } = await import("../services/paperclip-client.js");
    const ok = await initPaperclip();
    if (ok) {
      logger.info("[GodMode] Paperclip agent orchestration connected");

      // Wire Paperclip webhook broadcast (for inbound webhooks)
      try {
        const { setPaperclipWebhookBroadcast } = await import("../methods/paperclip-webhook.js");
        setPaperclipWebhookBroadcast((event: string, data: unknown) => safeBroadcast(api, event, data));
      } catch { /* non-fatal */ }

      // Start polling for completed Paperclip tasks and route results to inbox
      try {
        startCompletionPoller(async (issue) => {
          try {
            // 1. Fetch actual agent output from run log
            const { getLatestRun, readRunLog } = await import("../services/paperclip-client.js");
            let agentOutput = "";
            if (issue.assigneeAgentId) {
              const run = await getLatestRun(issue.assigneeAgentId as string);
              if (run?.logRef) {
                agentOutput = readRunLog(run.logRef as string);
              }
            }
            const output = agentOutput
              || (issue as Record<string, unknown>).resultSummary as string
              || (issue as Record<string, unknown>).output as string
              || issue.description;

            // 2. Write deliverable MD to inbox directory
            const { handlePaperclipWebhookHttp } = await import("../methods/paperclip-webhook.js");
            const payload = JSON.stringify({
              issue: {
                id: issue.id,
                title: issue.title,
                description: issue.description,
                status: issue.status,
                output,
              },
            });
            await handlePaperclipWebhookHttp(payload);

            // 3. Look up originating session from projects-state
            const { listProjects } = await import("../lib/projects-state.js");
            const projects = await listProjects();
            let sessionKey: string | undefined;
            for (const project of projects) {
              // Match by Paperclip issue ID stored as queueItemId
              const match = project.issues.find(
                (pi) => pi.queueItemId === issue.id,
              );
              if (match) {
                sessionKey = project.sessionKey;
                break;
              }
            }

            // 4. Build output path for the MD file
            const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
            const slug = slugify(issue.title) || `paperclip-${issue.id}`;
            const outputPath = join(MEMORY_DIR, "inbox", `${slug}.md`);

            // 5. Notify ally — targeted to originating session if known
            safeBroadcast(api, "ally:notification", {
              type: "paperclip-completion",
              title: issue.title,
              issueId: issue.id,
              sessionKey,
              outputPath,
              outputPreview: output.slice(0, 1000),
              message: `Agent completed: "${issue.title}". The deliverable is ready for your review.`,
            });

            // 6. Push system event into originating session for proactive agent response
            notifySession(
              api,
              sessionKey,
              `[Agent completed] "${issue.title}" is ready for review. Output: ${outputPath}`,
            );

            logger.info(
              `[GodMode] Paperclip task completed: "${issue.title}" (${issue.id})` +
              (sessionKey ? ` → session ${sessionKey}` : ""),
            );
          } catch (err) {
            logger.warn(`[GodMode] Paperclip completion handler failed: ${String(err)}`);
          }
        }, 30_000); // poll every 30 seconds
        serviceCleanup.push({ name: "paperclip-poller", fn: () => stopCompletionPoller() });
        logger.info("[GodMode] Paperclip completion poller started (30s interval)");
      } catch (err) {
        logger.warn(`[GodMode] Paperclip completion poller failed to start: ${String(err)}`);
      }
    }
    // If not configured, initPaperclip already logs "using local queue"
  } catch (err) {
    logger.warn(`[GodMode] Paperclip init failed (non-fatal): ${String(err)}`);
  }

  // Obsidian Sync
  try {
    const { initObsidianSync, stopObsidianSync } = await import("../services/obsidian-sync.js");
    const obsSync = initObsidianSync(logger);
    obsSync.setBroadcast((event: string, data: unknown) => safeBroadcast(api, event, data));
    await obsSync.init();
    serviceCleanup.push({ name: "obsidian-sync", fn: () => stopObsidianSync() });
    logger.info("[GodMode] Obsidian Sync service initialized");
  } catch (err) {
    logger.warn(`[GodMode] Obsidian Sync failed to init: ${String(err)}`);
  }

  // Meeting webhook broadcast wiring
  try {
    const { setMeetingWebhookBroadcast } = await import("../methods/meeting-webhook.js");
    setMeetingWebhookBroadcast((event: string, data: unknown) => safeBroadcast(api, event, data));
    logger.info("[GodMode] Meeting webhook broadcast wired");
  } catch (err) {
    logger.warn(`[GodMode] Meeting webhook broadcast wiring failed: ${String(err)}`);
  }

  // ── Ingestion pipelines (Screenpipe funnel + structured sources) ──
  try {
    // Screenpipe hourly summary — every 60 minutes
    const screenpipeHourlyTimer = setInterval(async () => {
      try {
        const { loadConfig } = await import("../services/ingestion/screenpipe-config.js");
        const cfg = await loadConfig();
        if (!cfg.enabled) return;
        const { runHourlySummary } = await import("../services/ingestion/screenpipe-funnel.js");
        const result = await runHourlySummary();
        if (result.filtered > 0) {
          logger.info(`[GodMode] Screenpipe hourly: captured=${result.captured}, summarized=${result.filtered}, promoted=${result.promoted}`);
        }
      } catch (err) {
        logger.warn(`[GodMode] Screenpipe hourly failed: ${String(err)}`);
      }
    }, 60 * 60_000); // 60 min
    serviceCleanup.push({ name: "screenpipe-hourly", fn: () => clearInterval(screenpipeHourlyTimer) });

    // Screenpipe daily digest — every 24 hours (runs at next interval from startup)
    const screenpipeDailyTimer = setInterval(async () => {
      try {
        const { loadConfig } = await import("../services/ingestion/screenpipe-config.js");
        const cfg = await loadConfig();
        if (!cfg.enabled) return;
        const { runDailyDigest } = await import("../services/ingestion/screenpipe-funnel.js");
        const result = await runDailyDigest();
        if (result.hourlyFilesProcessed > 0) {
          logger.info(`[GodMode] Screenpipe daily digest: processed ${result.hourlyFilesProcessed} hourly files`);
        }
      } catch (err) {
        logger.warn(`[GodMode] Screenpipe daily digest failed: ${String(err)}`);
      }
    }, 24 * 60 * 60_000); // 24 hours
    serviceCleanup.push({ name: "screenpipe-daily", fn: () => clearInterval(screenpipeDailyTimer) });

    // Screenpipe retention cleanup — every 12 hours
    const screenpipeCleanupTimer = setInterval(async () => {
      try {
        const { runRetentionCleanup } = await import("../services/ingestion/screenpipe-funnel.js");
        const result = await runRetentionCleanup();
        if (result.deleted > 0) {
          logger.info(`[GodMode] Screenpipe cleanup: deleted ${result.deleted} expired files`);
        }
      } catch (err) {
        logger.warn(`[GodMode] Screenpipe cleanup failed: ${String(err)}`);
      }
    }, 12 * 60 * 60_000); // 12 hours
    serviceCleanup.push({ name: "screenpipe-cleanup", fn: () => clearInterval(screenpipeCleanupTimer) });

    // Calendar enrichment — every 60 minutes
    const calendarTimer = setInterval(async () => {
      try {
        if (!process.env.GOG_CALENDAR_ACCOUNT) return;
        const { runCalendarEnrichment } = await import("../services/ingestion/calendar-enrichment.js");
        const result = await runCalendarEnrichment();
        if (result.eventsProcessed > 0) {
          logger.info(`[GodMode] Calendar enrichment: ${result.eventsProcessed} events, ${result.peopleUpdated} people updated`);
        }
      } catch (err) {
        logger.warn(`[GodMode] Calendar enrichment failed: ${String(err)}`);
      }
    }, 60 * 60_000); // 60 min
    serviceCleanup.push({ name: "calendar-enrichment", fn: () => clearInterval(calendarTimer) });

    logger.info("[GodMode] Ingestion pipelines registered (screenpipe hourly/daily/cleanup, calendar)");
  } catch (err) {
    logger.warn(`[GodMode] Ingestion pipeline registration failed: ${String(err)}`);
  }

  logger.info(`[GodMode] Gateway startup complete — ${serviceCleanup.length} service(s) registered for cleanup`);
}

export async function runGatewayStop(
  serviceCleanup: CleanupEntry[],
  logger: Logger,
): Promise<void> {
  // Write restart sentinel BEFORE cleanup so it captures live state
  try {
    const activeSessionKeys = sessions.activeKeys();
    const serviceNames = serviceCleanup.map((s) => s.name);
    writeSentinel(activeSessionKeys, serviceNames, "graceful");
  } catch { /* non-fatal */ }

  // Honcho vault sync (best effort)
  try {
    const { syncHonchoToVault } = await import("../services/honcho-sync.js");
    await syncHonchoToVault();
    logger.info("[GodMode] Honcho vault sync complete");
  } catch (err) {
    logger.warn(`[GodMode] Honcho vault sync failed (non-fatal): ${String(err)}`);
  }

  // Clear duplicate guard so a fresh instance can claim the slot
  delete (globalThis as Record<string, unknown>).__godmodeInstanceId;

  logger.info(`[GodMode] Gateway stopping — cleaning up ${serviceCleanup.length} service(s)`);
  let cleaned = 0;
  for (const entry of serviceCleanup) {
    try {
      await entry.fn();
      cleaned++;
      logger.info(`[GodMode] Stopped service: ${entry.name}`);
    } catch (err) {
      logger.warn(`[GodMode] Cleanup error for ${entry.name}: ${String(err)}`);
    }
  }
  serviceCleanup.length = 0;
  logger.info(`[GodMode] Gateway stopped — ${cleaned} service(s) cleaned up`);
}
