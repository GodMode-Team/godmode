/**
 * Agent Log gateway handlers.
 *
 * Self-contained plugin implementation (no core server-method imports).
 */

import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  readDailyLog,
  appendEntry,
  getActiveRuns,
  resolveReviewItem,
  resolveQueueItem,
  type AppendCategory,
} from "../lib/agent-log.js";
import { localDateString } from "../data-paths.js";
import { syncClaudeCodeSessions } from "../services/claude-code-sync.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const AGENT_DAY_CANDIDATES = [
  path.join(os.homedir(), "godmode", "memory", "AGENT-DAY.md"),
  path.join(os.homedir(), "godmode", "AGENT-DAY.md"),
];

const VALID_CATEGORIES = new Set<AppendCategory>([
  "review",
  "completed",
  "queue",
  "note",
  "activity",
]);

function todayDate(): string {
  return localDateString();
}

async function readLegacyAgentDay(): Promise<{
  content: string;
  updatedAt: string;
  sourcePath: string;
} | null> {
  for (const candidate of AGENT_DAY_CANDIDATES) {
    try {
      const stat = await fsp.stat(candidate);
      const content = await fsp.readFile(candidate, "utf-8");
      if (!content.trim()) {
        continue;
      }

      const home = os.homedir();
      const displayPath = candidate.startsWith(home) ? "~" + candidate.slice(home.length) : candidate;
      return {
        content,
        updatedAt: new Date(stat.mtimeMs).toISOString(),
        sourcePath: displayPath,
      };
    } catch {
      continue;
    }
  }
  return null;
}

export const agentLogHandlers: GatewayRequestHandlers = {
  "agentLog.get": async ({ params, respond }) => {
    const p = params as { date?: string };
    const date = typeof p.date === "string" && p.date.trim() ? p.date.trim() : todayDate();

    if (date === todayDate()) {
      const curated = await readLegacyAgentDay();
      if (curated) {
        const updatedDate = curated.updatedAt.split("T")[0];
        if (updatedDate === date) {
          respond(
            true,
            {
              date,
              content: curated.content,
              updatedAt: curated.updatedAt,
              sourcePath: curated.sourcePath,
              activeRuns: getActiveRuns(),
            },
            undefined,
          );
          return;
        }
      }
    }

    const daily = await readDailyLog(date);
    if (daily) {
      respond(
        true,
        {
          date,
          content: daily.content,
          updatedAt: daily.updatedAt,
          sourcePath: daily.sourcePath,
          activeRuns: date === todayDate() ? getActiveRuns() : undefined,
        },
        undefined,
      );
      return;
    }

    respond(true, { date, content: null, updatedAt: null, sourcePath: null }, undefined);
  },

  "agentLog.append": async ({ params, respond, context }) => {
    const p = params as {
      category?: string;
      item?: string;
      text?: string;
      link?: string;
      output?: string;
      priority?: string;
      notes?: string;
      assignedTo?: string;
      blockedBy?: string;
    };

    const item = (p.item || p.text || "").trim();
    if (!item) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "item (or text) is required" });
      return;
    }

    const category = (
      p.category && VALID_CATEGORIES.has(p.category as AppendCategory) ? p.category : "activity"
    ) as AppendCategory;

    await appendEntry({
      category,
      item,
      link: p.link,
      output: p.output,
      priority: p.priority,
      notes: p.notes,
      assignedTo: p.assignedTo,
      blockedBy: p.blockedBy,
    });

    const date = todayDate();
    context.broadcast("agent-log:update", { date }, { dropIfSlow: true });
    respond(true, { ok: true, date, category }, undefined);
  },

  "agentLog.resolve": async ({ params, respond, context }) => {
    const p = params as { section?: string; item?: string };
    const item = (p.item || "").trim();
    const section = (p.section || "").trim();

    if (!item) {
      respond(false, undefined, { code: "INVALID_REQUEST", message: "item is required" });
      return;
    }
    if (section !== "review" && section !== "queue") {
      respond(false, undefined, {
        code: "INVALID_REQUEST",
        message: 'section must be "review" or "queue"',
      });
      return;
    }

    const resolved =
      section === "review" ? await resolveReviewItem(item) : await resolveQueueItem(item);

    if (resolved) {
      const date = todayDate();
      context.broadcast("agent-log:update", { date }, { dropIfSlow: true });
      respond(true, { ok: true, resolved: true }, undefined);
      return;
    }

    respond(true, { ok: true, resolved: false, reason: "item not found" }, undefined);
  },

  "agentLog.syncClaudeCode": async ({ respond, context }) => {
    try {
      const result = await syncClaudeCodeSessions();
      if (result.synced > 0) {
        const date = todayDate();
        context.broadcast("agent-log:update", { date }, { dropIfSlow: true });
      }
      respond(true, { ok: true, ...result }, undefined);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      respond(false, undefined, { code: "SYNC_FAILED", message: msg });
    }
  },
};
