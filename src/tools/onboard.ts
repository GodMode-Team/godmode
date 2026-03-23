/**
 * onboard.ts — Agent-callable tool: godmode_onboard
 *
 * Lets the agent set up a GodMode workspace for a new user by calling the
 * onboarding service. Triggered by natural language ("set up GodMode",
 * "onboard me", "initialize my workspace").
 *
 * Uses sanitizeAnswers from the onboarding service so the tool never has
 * to duplicate validation logic -- all defaults and limits are applied in
 * one place.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "openclaw/plugin-sdk/agent-runtime";
import { GODMODE_ROOT } from "../data-paths.js";
import {
  generateWorkspaceFiles,
  patchOCConfig,
  checkOnboardingStatus,
  sanitizeAnswers,
  type SoulProfile,
} from "../services/onboarding.js";

type ToolContext = {
  sessionKey?: string;
  agentId?: string;
};

export function createOnboardTool(_ctx: ToolContext): AnyAgentTool {
  return {
    name: "godmode_onboard",
    label: "GodMode Onboard",
    description:
      "Set up a GodMode workspace with memory files for a new user. " +
      "Generates AGENTS.md, USER.md, SOUL.md, HEARTBEAT.md, and the full " +
      "memory directory structure (WORKING.md, MISTAKES.md, tacit.md, curated.md, " +
      "daily notes, people stubs, project stubs). Also patches the OC config " +
      "with optimal memory search and compaction settings. " +
      "Call this when the user says things like 'set up GodMode', 'onboard me', " +
      "'initialize my workspace', or 'set up my memory system'. " +
      "Provide user answers from the onboarding conversation. " +
      "If soul profile data was collected during the deep onboarding conversation, " +
      "pass it via the soulProfile parameter for a deeply personalized SOUL.md. " +
      "If the workspace already exists, skipped files are reported (use force=true to overwrite).",
    parameters: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "User's name",
        },
        timezone: {
          type: "string",
          description: "User's timezone (e.g. 'America/Chicago', 'Europe/London')",
        },
        focus: {
          type: "string",
          description: "What the user is building or focused on",
        },
        projects: {
          type: "array",
          items: { type: "string" },
          description: "Top 1-3 projects or companies the user works on",
        },
        commStyle: {
          type: "string",
          description:
            "User's communication preferences (e.g. 'Direct and concise', 'Detailed explanations')",
        },
        hardRules: {
          type: "array",
          items: { type: "string" },
          description: "Immutable rules the AI must always follow",
        },
        keyPeople: {
          type: "array",
          items: { type: "string" },
          description: "Important people in the user's life/work",
        },
        defaultModel: {
          type: "string",
          description: "Preferred AI model (e.g. 'sonnet', 'opus', 'haiku')",
        },
        soulProfile: {
          type: "object",
          description:
            "Deep identity data from the soul interview. Fields: ground, anchor, atMyBest, " +
            "flowState, depletedState, shadowState, recurringPattern, disguisedDistraction, " +
            "blindSpot, challengeLevel, offLimits, correctionStyle, nonNegotiables (string[]), " +
            "importantPeople ({name, context}[]), goodDay, annoyingAiBehavior, " +
            "trustBreakingPhrases (string[]), justGetItDone",
        },
        force: {
          type: "boolean",
          description: "Overwrite existing files if true. Default: false",
        },
        patchConfig: {
          type: "boolean",
          description: "Patch OC config with optimal settings. Default: true",
        },
        statusOnly: {
          type: "boolean",
          description: "Only check status, don't generate anything. Default: false",
        },
      },
      required: ["name"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      try {
        const statusOnly = Boolean(params.statusOnly);

        // ── Status check mode ──────────────────────────────────
        if (statusOnly) {
          const status = await checkOnboardingStatus(GODMODE_ROOT);
          return jsonResult({
            mode: "status",
            ...status,
            workspacePath: GODMODE_ROOT,
          });
        }

        // ── Generate mode ──────────────────────────────────────
        // Sanitize answers (applies defaults and enforces limits)
        const answers = sanitizeAnswers({
          name: typeof params.name === "string" ? params.name : undefined,
          timezone: typeof params.timezone === "string" ? params.timezone : undefined,
          focus: typeof params.focus === "string" ? params.focus : undefined,
          projects: Array.isArray(params.projects) ? (params.projects as string[]) : undefined,
          commStyle: typeof params.commStyle === "string" ? params.commStyle : undefined,
          hardRules: Array.isArray(params.hardRules) ? (params.hardRules as string[]) : undefined,
          keyPeople: Array.isArray(params.keyPeople) ? (params.keyPeople as string[]) : undefined,
          defaultModel:
            typeof params.defaultModel === "string" ? params.defaultModel : undefined,
          soulProfile:
            params.soulProfile && typeof params.soulProfile === "object"
              ? (params.soulProfile as SoulProfile)
              : undefined,
        });

        const force = Boolean(params.force);
        const shouldPatchConfig = params.patchConfig !== false;

        // Generate workspace files
        const fileResults = await generateWorkspaceFiles(answers, GODMODE_ROOT, { force });

        const created = fileResults.filter((f) => f.created).length;
        const skipped = fileResults.filter((f) => f.skipped).length;
        const errors = fileResults.filter((f) => f.reason?.startsWith("write error")).length;

        // Patch OC config if requested
        let configResult: { patched: boolean; error?: string } = { patched: false };
        if (shouldPatchConfig) {
          configResult = await patchOCConfig(answers);
        }

        // Build summary message
        const parts: string[] = [];
        parts.push(`Created ${created} files (${skipped} skipped${errors > 0 ? `, ${errors} errors` : ""}).`);
        if (configResult.patched) {
          parts.push("OC config patched with memory/agent defaults.");
        } else if (configResult.error) {
          parts.push(`Config patch failed: ${configResult.error}`);
        }
        parts.push(`Workspace: ${GODMODE_ROOT}`);
        parts.push("Memory system is ready. Start a new session to use it.");

        return jsonResult({
          mode: "generate",
          success: errors === 0,
          filesCreated: created,
          filesSkipped: skipped,
          filesErrored: errors,
          files: fileResults.map((f) => ({
            path: f.path,
            created: f.created,
            skipped: f.skipped,
            ...(f.reason ? { reason: f.reason } : {}),
          })),
          configPatched: configResult.patched,
          configError: configResult.error,
          workspacePath: GODMODE_ROOT,
          message: parts.join(" "),
        });
      } catch (err) {
        // Top-level safety net: never let the tool crash the agent loop
        const message = err instanceof Error ? err.message : String(err);
        return jsonResult({
          mode: "error",
          success: false,
          error: message,
          message: `Onboarding failed: ${message}. You can retry or run with statusOnly=true to check the workspace.`,
        });
      }
    },
  } as AnyAgentTool;
}
