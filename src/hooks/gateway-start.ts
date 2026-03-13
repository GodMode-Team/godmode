/**
 * gateway-start.ts — Gateway startup initialization sequence.
 *
 * Initializes all GodMode services in order: env loading, auth refresh,
 * zombie cleanup, host compat, content seeding, and service startup.
 */

import { existsSync, readFileSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DATA_DIR, MEMORY_DIR } from "../data-paths.js";
import { detectHostContext, safeBroadcast } from "../lib/host-context.js";
import { killZombieGateways } from "../lib/zombie-guard.js";
import { refreshLicenseOnStart } from "../lib/license.js";

type Logger = { warn: (msg: string) => void; info: (msg: string) => void; error: (msg: string) => void };
type CleanupEntry = { name: string; fn: () => void | Promise<void> };

export async function runGatewayStart(
  api: any,
  pluginVersion: string,
  pluginRoot: string,
  serviceCleanup: CleanupEntry[],
  methodCount = 0,
): Promise<void> {
  const logger: Logger = api.logger;

  // Warm the allowed-paths cache so files.read works for workspace files
  try {
    const { initAllowedPaths } = await import("../lib/vault-paths.js");
    initAllowedPaths();
  } catch { /* non-fatal */ }

  // Load workspace .env into process.env
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE || "";
    const envPaths = [
      join(process.env.GODMODE_ROOT || join(homeDir, "godmode"), ".env"),
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

  // Host compatibility scan
  try {
    const { changes } = await detectHostContext(api, pluginVersion);
    if (changes.length > 0) {
      logger.warn(`[GodMode] Host environment changed (${changes.length} change(s)) — self-healing active`);
    }
  } catch (err) {
    logger.warn(`[GodMode] Host compat scan failed: ${String(err)}`);
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

  // Curation agent service
  try {
    const clientsDir = join(dirname(DATA_DIR), "clients");
    if (existsSync(clientsDir)) {
      const { getCurationAgentService } = await import("../services/curation-agent.js");
      const curation = getCurationAgentService(logger);
      await curation.start();
      serviceCleanup.push({ name: "curation-agent", fn: () => curation.stop() });
    } else {
      logger.info("[GodMode] Curation agent skipped — no team workspaces configured");
    }
  } catch (err) {
    logger.warn(`[GodMode] curation service failed to start: ${String(err)}`);
  }

  // Skill cards
  try {
    const { ensureSkillCards } = await import("../lib/skill-cards.js");
    ensureSkillCards(pluginRoot);
  } catch { /* non-fatal */ }

  // Mem0 memory
  try {
    const { initMemory, isMemoryReady, seedFromVault } = await import("../lib/memory.js");
    await initMemory();
    if (isMemoryReady()) {
      logger.info("[GodMode] Mem0 memory initialized");
      void (async () => {
        try {
          await seedFromVault("caleb");
          logger.info("[GodMode] Mem0 vault seeding complete");
        } catch (seedErr) {
          logger.warn(`[GodMode] Mem0 seeding failed (non-fatal): ${String(seedErr)}`);
        }
      })();
    } else {
      logger.warn("[GodMode] Mem0 memory not available (missing API keys or init failed)");
    }
  } catch (err) {
    logger.warn(`[GodMode] Mem0 memory init failed (non-fatal): ${String(err)}`);
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

  // Consciousness heartbeat
  try {
    const {
      initConsciousnessHeartbeat,
      startConsciousnessHeartbeat,
      stopConsciousnessHeartbeat,
      setConsciousnessHeartbeatApiRequest,
    } = await import("../services/consciousness-heartbeat.js");
    initConsciousnessHeartbeat(logger);
    // Wire api.request for the session distiller pipeline (Pipeline 3)
    if (typeof api.request === "function") {
      setConsciousnessHeartbeatApiRequest(
        (method: string, params: Record<string, unknown>) => api.request(method, params),
      );
    }
    startConsciousnessHeartbeat();
    serviceCleanup.push({ name: "consciousness-heartbeat", fn: () => stopConsciousnessHeartbeat() });
    logger.info("[GodMode] Consciousness heartbeat service started");
  } catch (err) {
    logger.warn(`[GodMode] Consciousness heartbeat failed to start: ${String(err)}`);
  }

  // Queue processor
  try {
    const { initQueueProcessor, getQueueProcessor } = await import("../services/queue-processor.js");
    const queueProcessor = initQueueProcessor(logger);
    queueProcessor.setBroadcast((event: string, data: unknown) => safeBroadcast(api, event, data));
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

  // Proof service (API client — no local server)
  try {
    const { initProofService } = await import("../services/proof-server.js");
    const ok = await initProofService(logger);
    if (ok) {
      logger.info("[GodMode] Proof service initialized");
    } else {
      logger.warn("[GodMode] Proof service unavailable");
    }
  } catch (err) {
    logger.warn(`[GodMode] Proof service failed to init: ${String(err)}`);
  }

  // Paperclip agent team (sidecar)
  try {
    const { PaperclipAdapter } = await import("../services/paperclip-adapter.js");
    const paperclip = new PaperclipAdapter(logger);
    const started = await paperclip.init();
    if (started) {
      serviceCleanup.push({ name: "paperclip", fn: () => paperclip.stop() });
      logger.info("[GodMode] Paperclip agent team started");
    } else {
      logger.warn("[GodMode] Paperclip agent team unavailable");
    }
  } catch (err) {
    logger.warn(`[GodMode] Paperclip failed to start: ${String(err)}`);
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

  // Fathom post-meeting processor
  try {
    const { initFathomProcessor, startFathomProcessor, stopFathomProcessor, setBroadcast: setFathomBroadcast } = await import("../services/fathom-processor.js");
    initFathomProcessor(logger);
    setFathomBroadcast((event: string, data: unknown) => safeBroadcast(api, event, data));
    startFathomProcessor();
    serviceCleanup.push({ name: "fathom-processor", fn: () => { stopFathomProcessor(); } });
    logger.info("[GodMode] Fathom post-meeting processor started");
  } catch (err) {
    logger.warn(`[GodMode] Fathom processor failed to start: ${String(err)}`);
  }

  // X/Twitter client
  try {
    const { initXClient } = await import("../services/x-client.js");
    await initXClient(logger);
  } catch (err) {
    logger.warn(`[GodMode] X client init failed: ${String(err)}`);
  }

  logger.info(`[GodMode] Gateway startup complete — ${serviceCleanup.length} service(s) registered for cleanup`);
}

export async function runGatewayStop(
  serviceCleanup: CleanupEntry[],
  logger: Logger,
): Promise<void> {
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
