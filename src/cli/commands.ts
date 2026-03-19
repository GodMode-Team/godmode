/**
 * commands.ts — CLI command registration for `openclaw godmode`.
 *
 * Provides: status, activate, doctor, workspace (create/join/sync/list),
 * comms (send/feed), curation (run/candidates).
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import type { LicenseState } from "../lib/license.js";
import { validateLicense, getLicenseState } from "../lib/license.js";

export interface CliDeps {
  pluginVersion: string;
  licenseKey: string | undefined;
  godmodeUiRoot: string | undefined;
  methodCount: number;
  api: { logger: { info: (msg: string) => void; warn: (msg: string) => void }; pluginConfig?: Record<string, unknown> };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Commander-style program API has deeply chained return types
export function registerCliCommands(deps: CliDeps) {
  return ({ program }: { program: any }) => {
    const godmode = program.command("godmode").description("GodMode commands");

    godmode
      .command("status")
      .description("Show GodMode plugin status")
      .option("--json", "Output as JSON")
      .action((opts: { json?: boolean }) => {
        const licenseState = getLicenseState();
        const status = {
          plugin: "godmode",
          version: deps.pluginVersion,
          license: {
            status: licenseState.status,
            tier: licenseState.tier ?? "none",
            configured: !!deps.licenseKey,
          },
          methods: deps.methodCount,
          ui: deps.godmodeUiRoot ? "available" : "not built",
        };

        if (opts.json) {
          console.log(JSON.stringify(status, null, 2));
          return;
        }

        console.log("GodMode Plugin Status");
        console.log("\u2500".repeat(40));
        console.log(`  Version:  ${status.version}`);
        console.log(`  License:  ${status.license.status} (${status.license.tier})`);
        console.log(`  Methods:  ${status.methods}`);
        console.log(`  UI:       ${status.ui}`);
      });

    godmode
      .command("activate <key>")
      .description("Activate GodMode with your license key")
      .action(async (key: string) => {
        if (!key || (!key.startsWith("GM-") && key !== "GM-INTERNAL")) {
          console.error(
            "\x1b[31mInvalid license key.\x1b[0m Keys start with GM-PROD-, GM-DEV-, or GM-INTERNAL.",
          );
          process.exit(1);
        }

        const homeDir = process.env.HOME || process.env.USERPROFILE || "";
        const stateDir = process.env.OPENCLAW_STATE_DIR || join(homeDir, ".openclaw");
        const configPath = process.env.OPENCLAW_CONFIG_PATH || join(stateDir, "openclaw.json");

        let config: Record<string, unknown> = {};
        try {
          if (existsSync(configPath)) {
            config = JSON.parse(readFileSync(configPath, "utf8"));
          }
        } catch {
          console.warn(`Could not parse ${configPath} — will create a fresh config.`);
        }

        const plugins = (config.plugins ?? {}) as Record<string, unknown>;
        const entries = (plugins.entries ?? {}) as Record<string, unknown>;
        const godmodeEntry = (entries.godmode ?? {}) as Record<string, unknown>;
        const godmodeConfig = (godmodeEntry.config ?? {}) as Record<string, unknown>;

        godmodeConfig.licenseKey = key;
        godmodeEntry.enabled = true;
        godmodeEntry.config = godmodeConfig;
        entries.godmode = godmodeEntry;
        plugins.entries = entries;
        config.plugins = plugins;

        const { writeFileSync, mkdirSync } = await import("node:fs");
        mkdirSync(dirname(configPath), { recursive: true });
        writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

        console.log(`\n\x1b[32m\u2713\x1b[0m License key saved to ${configPath}`);
        console.log(`\x1b[32m\u2713\x1b[0m GodMode plugin enabled\n`);
        console.log("Next steps:");
        console.log("  1. Start the gateway:  \x1b[36mopenclaw gateway run\x1b[0m");
        console.log("  2. Open GodMode:       \x1b[36mhttp://localhost:18789/godmode\x1b[0m");
        console.log("  3. Check health:       \x1b[36mopenclaw godmode doctor\x1b[0m\n");
      });

    godmode
      .command("doctor")
      .description("Diagnose GodMode plugin health")
      .action(async () => {
        const licenseState = getLicenseState();
        const checks: { name: string; ok: boolean; detail: string }[] = [];

        checks.push({
          name: "License key configured",
          ok: !!deps.licenseKey,
          detail: deps.licenseKey
            ? `Key: ${deps.licenseKey.slice(0, 6)}...`
            : "Missing — add licenseKey to plugin config in openclaw.json",
        });

        if (deps.licenseKey) {
          if (licenseState.status === "pending" || licenseState.status === "validating") {
            const valid = await validateLicense(deps.licenseKey, deps.api.logger);
            checks.push({
              name: "License valid",
              ok: valid,
              detail: valid
                ? `Tier: ${getLicenseState().tier}`
                : (getLicenseState().error ?? "Validation failed"),
            });
          } else {
            checks.push({
              name: "License valid",
              ok: licenseState.status === "valid",
              detail:
                licenseState.status === "valid"
                  ? `Tier: ${licenseState.tier}`
                  : (licenseState.error ?? `Status: ${licenseState.status}`),
            });
          }
        }

        checks.push({
          name: "GodMode UI built",
          ok: !!deps.godmodeUiRoot,
          detail: deps.godmodeUiRoot ?? "Not found — run: pnpm build (plugin repo)",
        });

        const workspaceRoot =
          (deps.api.pluginConfig as { workspaceRoot?: string } | undefined)?.workspaceRoot ??
          "~/godmode";
        const expandedRoot = workspaceRoot.replace(/^~/, process.env.HOME ?? "");
        checks.push({
          name: "Workspace directory exists",
          ok: existsSync(expandedRoot),
          detail: existsSync(expandedRoot) ? expandedRoot : `Missing: ${expandedRoot}`,
        });

        const dataDir = join(expandedRoot, "data");
        checks.push({
          name: "Data directory exists",
          ok: existsSync(dataDir),
          detail: existsSync(dataDir) ? dataDir : `Missing: ${dataDir}`,
        });

        checks.push({
          name: "Health endpoint registered",
          ok: true,
          detail: "GET /godmode/health",
        });

        checks.push({
          name: "Gateway methods registered",
          ok: deps.methodCount > 0,
          detail: `${deps.methodCount} methods`,
        });

        console.log("\nGodMode Doctor");
        console.log("\u2550".repeat(50));
        let failures = 0;
        for (const check of checks) {
          const icon = check.ok ? "\u2713" : "\u2717";
          const color = check.ok ? "\x1b[32m" : "\x1b[31m";
          console.log(`  ${color}${icon}\x1b[0m ${check.name}`);
          if (!check.ok) {
            console.log(`    \u2192 ${check.detail}`);
            failures++;
          }
        }
        console.log("\u2550".repeat(50));
        if (failures === 0) {
          console.log("  \x1b[32mAll checks passed.\x1b[0m\n");
        } else {
          console.log(`  \x1b[31m${failures} issue(s) found.\x1b[0m\n`);
        }
      });

    // ── Team workspace commands ─────────────────────────────────
    const workspace = godmode.command("workspace").description("Team workspace management");

    workspace
      .command("create")
      .description("Create a new team workspace")
      .requiredOption("--name <name>", "Workspace name")
      .option("--github <org/repo>", "GitHub repository (org/repo or full URL)")
      .option("--branch <branch>", "Git branch", "main")
      .action(async (opts: { name: string; github?: string; branch: string }) => {
        const { createWorkspaceId, readWorkspaceConfig, resolveGodModeRoot, writeWorkspaceConfig, ensureWorkspaceFolders } = await import("../lib/workspaces-config.js");
        const { scaffoldTeamWorkspace, resolveGitMemberId } = await import("../lib/team-workspace-scaffold.js");

        const config = await readWorkspaceConfig();
        const existingIds = new Set(config.workspaces.map((w) => w.id));
        const id = createWorkspaceId(opts.name, existingIds);
        const workspacePath = join(resolveGodModeRoot(), "clients", id);

        const memberId = await resolveGitMemberId(workspacePath).catch(() => "local");
        await ensureWorkspaceFolders(workspacePath, "team");
        await scaffoldTeamWorkspace({
          workspacePath,
          name: opts.name,
          id,
          github: opts.github,
          creatorName: memberId,
          creatorId: memberId,
        });

        config.workspaces.push({
          id,
          name: opts.name,
          emoji: "\ud83d\udc65",
          type: "team",
          path: workspacePath,
          keywords: [id, opts.name.toLowerCase()],
          pinned: [],
          pinnedSessions: [],
          artifactDirs: ["outputs", "artifacts"],
          sync: {
            type: "git",
            remote: opts.github ? "origin" : undefined,
            branch: opts.branch,
            autoPull: { enabled: true, interval: "30s" },
            autoPush: { enabled: true, debounceMs: 5000 },
          },
          team: { github: opts.github, role: "admin", memberId },
          curation: { enabled: true },
        });
        await writeWorkspaceConfig(config);

        console.log(`\x1b[32m\u2713\x1b[0m Created team workspace: ${opts.name} (${id})`);
        console.log(`  Path: ${workspacePath}`);
        if (opts.github) {
          console.log(`  GitHub: ${opts.github}`);
        }
      });

    workspace
      .command("join <url>")
      .description("Join an existing team workspace via GitHub URL")
      .option("--branch <branch>", "Git branch", "main")
      .action(async (url: string, opts: { branch: string }) => {
        console.log(`Joining team workspace from: ${url}`);
        console.log(`Use the gateway RPC method 'workspace.joinTeam' for full clone + setup.`);
        console.log(`  openclaw rpc workspace.joinTeam '{"github":"${url}","branch":"${opts.branch}"}'`);
      });

    workspace
      .command("sync [id]")
      .description("Trigger immediate sync for a workspace")
      .action(async (id?: string) => {
        if (!id) {
          console.error("Usage: openclaw godmode workspace sync <workspace-id>");
          return;
        }
        console.log(`Triggering sync for workspace: ${id}`);
        console.log(`Use gateway RPC: openclaw rpc workspace.syncNow '{"workspaceId":"${id}"}'`);
      });

    workspace
      .command("list")
      .description("List all team workspaces")
      .action(async () => {
        const { readWorkspaceConfig, toDisplayPath } = await import("../lib/workspaces-config.js");
        const config = await readWorkspaceConfig({ initializeIfMissing: false });
        const teams = config.workspaces.filter((w) => w.type === "team");
        if (teams.length === 0) {
          console.log("No team workspaces configured.");
          return;
        }
        console.log(`\nTeam Workspaces (${teams.length}):`);
        console.log("\u2500".repeat(50));
        for (const w of teams) {
          const sync = w.sync ? "git-synced" : "local";
          const github = w.team?.github ? ` (${w.team.github})` : "";
          console.log(`  ${w.emoji} ${w.name} [${w.id}] \u2014 ${sync}${github}`);
          console.log(`    ${toDisplayPath(w.path)}`);
        }
      });

    // ── Comms commands ───────────────────────────────────────────
    const comms = godmode.command("comms").description("Team communication");

    comms
      .command("send")
      .description("Send a message to the team feed")
      .requiredOption("--workspace <id>", "Workspace ID")
      .requiredOption("--type <type>", "Message type (handoff/question/alert/blocked/fyi)")
      .requiredOption("--msg <message>", "Message body")
      .option("--to <recipient>", "Optional recipient")
      .action(async (opts: { workspace: string; type: string; msg: string; to?: string }) => {
        const { createFeedMessage, appendFeedMessage, resolveFeedPath } = await import("../lib/team-feed.js");
        const { findWorkspaceById, readWorkspaceConfig } = await import("../lib/workspaces-config.js");
        const { resolveGitMemberId } = await import("../lib/team-workspace-scaffold.js");

        const config = await readWorkspaceConfig({ initializeIfMissing: false });
        const workspace = findWorkspaceById(config, opts.workspace);
        if (!workspace) {
          console.error(`Workspace not found: ${opts.workspace}`);
          process.exit(1);
        }

        const memberId = workspace.team?.memberId || await resolveGitMemberId(workspace.path);
        const feedPath = resolveFeedPath(workspace.path);
        const message = createFeedMessage({
          from: memberId,
          type: opts.type as "fyi",
          msg: opts.msg,
          to: opts.to,
        });

        await appendFeedMessage(feedPath, message);
        console.log(`\x1b[32m\u2713\x1b[0m Message sent (${message.id}): [${opts.type}] ${opts.msg}`);
      });

    comms
      .command("feed")
      .description("Read recent messages from the team feed")
      .requiredOption("--workspace <id>", "Workspace ID")
      .option("--since <date>", "Show messages since ISO date")
      .option("--limit <n>", "Max messages to show", "20")
      .action(async (opts: { workspace: string; since?: string; limit: string }) => {
        const { readFeed, resolveFeedPath } = await import("../lib/team-feed.js");
        const { findWorkspaceById, readWorkspaceConfig } = await import("../lib/workspaces-config.js");

        const config = await readWorkspaceConfig({ initializeIfMissing: false });
        const workspace = findWorkspaceById(config, opts.workspace);
        if (!workspace) {
          console.error(`Workspace not found: ${opts.workspace}`);
          process.exit(1);
        }

        const feedPath = resolveFeedPath(workspace.path);
        const messages = await readFeed(feedPath, {
          since: opts.since,
          limit: Number(opts.limit) || 20,
        });

        if (messages.length === 0) {
          console.log("No messages.");
          return;
        }

        console.log(`\nFeed (${messages.length} messages):`);
        console.log("\u2500".repeat(60));
        for (const m of messages) {
          const to = m.to ? ` \u2192 ${m.to}` : "";
          console.log(`  [${m.type}] ${m.from}${to}: ${m.msg}`);
          console.log(`    ${m.ts} (${m.id})`);
        }
      });

    // ── Curation commands ────────────────────────────────────────
    const curation = godmode.command("curation").description("Workspace memory curation");

    curation
      .command("run")
      .description("Manually trigger curation for a workspace")
      .requiredOption("--workspace <id>", "Workspace ID")
      .action(async (_opts: { workspace: string }) => {
        // REMOVED (v2 slim): curation-agent service
        console.log("Curation agent removed in v2 slim.");
      });

    curation
      .command("candidates")
      .description("Show SOP candidates for a workspace")
      .requiredOption("--workspace <id>", "Workspace ID")
      .action(async (opts: { workspace: string }) => {
        const { findWorkspaceById, readWorkspaceConfig } = await import("../lib/workspaces-config.js");
        const fsp = await import("node:fs/promises");
        const pathMod = await import("node:path");

        const config = await readWorkspaceConfig({ initializeIfMissing: false });
        const workspace = findWorkspaceById(config, opts.workspace);
        if (!workspace) {
          console.error(`Workspace not found: ${opts.workspace}`);
          process.exit(1);
        }

        try {
          const content = await fsp.readFile(
            pathMod.join(workspace.path, "memory", "sop-candidates.md"),
            "utf-8",
          );
          console.log(content);
        } catch {
          console.log("No SOP candidates yet.");
        }
      });
  };
}
