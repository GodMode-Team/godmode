/**
 * clickup-sync.ts — Every 2h cron: sync ClickUp task updates.
 *
 * Fetches recently updated tasks from ClickUp and writes activity to the daily note.
 */

import { health } from "../../lib/health-ledger.js";
import { appendToDaily, todayString } from "./helpers.js";
import { forwardMessage, isHonchoReady } from "../honcho-client.js";

const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

interface ClickUpTask {
  id?: string;
  name?: string;
  status?: { status?: string };
  assignees?: Array<{ username?: string; email?: string }>;
  date_updated?: string;
  list?: { name?: string };
  priority?: { priority?: string };
  url?: string;
}

interface ClickUpResponse {
  tasks?: ClickUpTask[];
}

export async function runClickUpSync(): Promise<{ tasksProcessed: number }> {
  const result = { tasksProcessed: 0 };
  const token = process.env.CLICKUP_API_TOKEN;
  const teamId = process.env.CLICKUP_TEAM_ID;

  if (!token || !teamId) {
    health.signal("ingestion.clickup", true, {
      ...result,
      note: "CLICKUP_API_TOKEN or CLICKUP_TEAM_ID not set",
    });
    return result;
  }

  try {
    // Look back 2h
    const since = Date.now() - 2 * 60 * 60 * 1000;
    const url = `${CLICKUP_API_BASE}/team/${teamId}/task?order_by=updated&date_updated_gt=${since}&include_closed=true&subtasks=true`;

    const res = await fetch(url, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`ClickUp API returned ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as ClickUpResponse;
    const tasks = data.tasks || [];

    const today = todayString();

    for (const task of tasks) {
      const name = task.name || "Untitled task";
      const status = task.status?.status || "unknown";
      const listName = task.list?.name || "";
      const priority = task.priority?.priority || "";
      const assignees = (task.assignees || [])
        .map((a) => a.username || a.email || "?")
        .join(", ");

      const parts = [`- **${name}**`, `[${status}]`];
      if (listName) parts.push(`in ${listName}`);
      if (priority) parts.push(`(${priority})`);
      if (assignees) parts.push(`— ${assignees}`);

      await appendToDaily("ClickUp Activity", parts.join(" "));
      result.tasksProcessed++;
    }

    // Forward summary to Honcho
    if (isHonchoReady() && result.tasksProcessed > 0) {
      const summaryText = `ClickUp sync for ${today}: ${result.tasksProcessed} tasks updated.`;
      await forwardMessage("user", summaryText, "system:clickup-sync");
    }

    health.signal("ingestion.clickup", true, result);
  } catch (err) {
    health.signal("ingestion.clickup", false, {
      error: String(err),
      ...result,
    });
  }

  return result;
}
