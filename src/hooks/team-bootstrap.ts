import fs from "node:fs/promises";
import path from "node:path";
import {
  loadCombinedSessionStoreForGateway,
  loadConfig,
} from "../lib/workspace-session-store.js";
import { findWorkspaceById, readWorkspaceConfig } from "../lib/workspaces-config.js";

/** Max total chars for injected team context (~15KB, roughly 4K tokens). */
const CONTEXT_BUDGET = 15_000;
const MAX_SINGLE_FILE = 8_000;

async function safeReadText(filePath: string, maxSize: number): Promise<string | null> {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile() || stat.size > maxSize) {
      return null;
    }
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

async function loadGlobFiles(dir: string, pattern: string): Promise<{ name: string; content: string }[]> {
  const results: { name: string; content: string }[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (pattern === "*.md" && ext !== ".md") continue;
      if (pattern === "*.yaml" && ext !== ".yaml" && ext !== ".yml") continue;
      const content = await safeReadText(path.join(dir, entry.name), MAX_SINGLE_FILE);
      if (content) {
        results.push({ name: entry.name, content });
      }
    }
  } catch {
    // Directory may not exist
  }
  return results;
}

type PrioritizedSection = {
  label: string;
  content: string;
  priority: number; // lower = more important
};

/**
 * Fits sections into the budget by priority order, truncating the last
 * section if needed to stay within budget.
 */
function fitToBudget(sections: PrioritizedSection[], budget: number): string[] {
  const sorted = [...sections].sort((a, b) => a.priority - b.priority);
  const result: string[] = [];
  let remaining = budget;

  for (const section of sorted) {
    if (remaining <= 0) break;
    if (section.content.length <= remaining) {
      result.push(section.content);
      remaining -= section.content.length;
    } else {
      // Truncate the last section that fits partially
      const truncated = section.content.slice(0, remaining - 30) + "\n\n_(truncated)_";
      result.push(truncated);
      remaining = 0;
    }
  }

  return result;
}

/**
 * Resolves team workspace files for the current session and returns them
 * as a prepend context string for the system prompt.
 *
 * Budget-capped at ~15KB to avoid context explosion. Priority order:
 * 1. AGENTS.md (SOPs) — highest priority
 * 2. MEMORY.md (team knowledge)
 * 3. Skills (*.md)
 * 4. Tools (*.yaml) — lowest priority
 *
 * Called from the `before_prompt_build` plugin hook.
 */
export async function handleTeamBootstrap(
  _event: { prompt: string; messages: unknown[] },
  ctx: { sessionKey?: string },
): Promise<{ prependContext?: string } | void> {
  const sessionKey = ctx.sessionKey;
  if (!sessionKey) return;

  // Resolve workspace for this session
  const cfg = await loadConfig();
  const { store } = await loadCombinedSessionStoreForGateway(cfg);
  const sessionEntry = store[sessionKey];
  const workspaceId = sessionEntry?.workspaceId;
  if (!workspaceId) return;

  const config = await readWorkspaceConfig({ initializeIfMissing: false });
  const workspace = findWorkspaceById(config, workspaceId);
  if (!workspace || workspace.type !== "team") return;

  const sections: PrioritizedSection[] = [];

  // Priority 0: AGENTS.md (SOPs) — most important
  const agentsMd = await safeReadText(path.join(workspace.path, "AGENTS.md"), MAX_SINGLE_FILE);
  if (agentsMd) {
    sections.push({
      label: "SOPs",
      content: `## Team SOPs (${workspace.name})\n\n${agentsMd}`,
      priority: 0,
    });
  }

  // Priority 1: MEMORY.md (team knowledge)
  const memoryMd = await safeReadText(path.join(workspace.path, "memory", "MEMORY.md"), MAX_SINGLE_FILE);
  if (memoryMd) {
    sections.push({
      label: "Memory",
      content: `## Team Memory (${workspace.name})\n\n${memoryMd}`,
      priority: 1,
    });
  }

  // Priority 2: Skills
  const skills = await loadGlobFiles(path.join(workspace.path, "skills"), "*.md");
  for (const skill of skills) {
    sections.push({
      label: `Skill: ${skill.name}`,
      content: `## Team Skill: ${skill.name} (${workspace.name})\n\n${skill.content}`,
      priority: 2,
    });
  }

  // Priority 3: Tools
  const tools = await loadGlobFiles(path.join(workspace.path, "tools"), "*.yaml");
  for (const tool of tools) {
    sections.push({
      label: `Tool: ${tool.name}`,
      content: `## Team Tool: ${tool.name} (${workspace.name})\n\n\`\`\`yaml\n${tool.content}\n\`\`\``,
      priority: 3,
    });
  }

  if (sections.length === 0) return;

  const header = `# Team Workspace: ${workspace.name}\n\nYou are working in the "${workspace.name}" team workspace. The following shared context has been loaded from the team repository.\n\n`;
  const fitted = fitToBudget(sections, CONTEXT_BUDGET - header.length);

  if (fitted.length === 0) return;

  return {
    prependContext: header + fitted.join("\n\n---\n\n"),
  };
}
