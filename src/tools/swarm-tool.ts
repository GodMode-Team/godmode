/**
 * Delegate Tool — Prosper delegates complex work to the agent team via Paperclip.
 *
 * This is a thin wrapper over Paperclip's native project/issue system.
 * The only thing GodMode adds: Proof docs per issue + confirmation flow.
 *
 * Actions:
 *   delegate — Scope + confirm a new project (two-call pattern)
 *   status   — Check project progress
 *   steer    — Send feedback/instructions to a specific issue
 *   cancel   — Stop a project
 *   projects — List all delegated projects
 *   team     — Show the agent team roster
 */

import { type AnyAgentTool, jsonResult } from "openclaw/plugin-sdk";
import { getPaperclipAdapter, isPaperclipRunning } from "../services/paperclip-adapter.js";
import type { ProjectBrief } from "../services/paperclip-adapter.js";

export function createDelegateTool(): AnyAgentTool {
  return {
    label: "Delegate",
    name: "delegate",
    description:
      "Delegate complex work to the agent team. " +
      "Use this when a task needs multiple specialists (research, content, design, engineering, etc.) " +
      "or would take too long to handle inline. " +
      "DELEGATION FLOW: Step 1 — call with action='delegate', confirmed=false to get a preview. " +
      "Step 2 — present the brief to the user. " +
      "Step 3 — when user approves (says 'go', 'yes', 'do it', etc.), call AGAIN with action='delegate', confirmed=true and THE SAME title/description/issues. " +
      "CRITICAL: 'go' means EXECUTE (confirmed=true), NOT check status. " +
      "All agents write output to files. If Proof is available, a shared doc is created for live collaboration. " +
      "Actions: delegate (create project), status (check progress), steer (send feedback), cancel, projects (list all), team (show roster).",
    parameters: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          enum: ["delegate", "status", "steer", "cancel", "projects", "team"],
          description: "Action to perform",
        },
        title: {
          type: "string",
          description: "Project title (for delegate)",
        },
        description: {
          type: "string",
          description: "Project goal / scope description (for delegate)",
        },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Issue title" },
              description: { type: "string", description: "Issue details and success criteria" },
              personaHint: { type: "string", description: "Agent to assign (e.g. 'content-writer', 'engineer')" },
              priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
            },
            required: ["title", "description"],
          },
          description: "Issues to create. Each becomes a task assigned to an agent. Agents write output to files (and optionally to a shared Proof doc).",
        },
        projectId: {
          type: "string",
          description: "Project ID (for status/steer/cancel)",
        },
        issueTitle: {
          type: "string",
          description: "Issue title to steer (for steer action)",
        },
        instructions: {
          type: "string",
          description: "Feedback or steering instructions (for steer action)",
        },
        confirmed: {
          type: "boolean",
          description: "Set to true only after user approves the scoped brief",
        },
      },
      required: ["action"],
    },
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      const action = params.action as string;

      if (!isPaperclipRunning() && action !== "team") {
        return jsonResult({
          error: "Agent team (Paperclip) is not running. It may still be starting up.",
        });
      }

      const adapter = getPaperclipAdapter();
      if (!adapter && action !== "team") {
        return jsonResult({ error: "Agent team not available." });
      }

      switch (action) {
        case "delegate": {
          const title = params.title as string | undefined;
          const description = params.description as string | undefined;
          const issues = params.issues as ProjectBrief["issues"] | undefined;
          const confirmed = params.confirmed === true;

          if (!title || !description || !issues || issues.length === 0) {
            return jsonResult({
              error: "Missing required fields: title, description, and issues (non-empty array).",
            });
          }

          if (!confirmed) {
            return jsonResult({
              _preview: true,
              title,
              description,
              issueCount: issues.length,
              issues: issues.map(t => ({
                title: t.title,
                assignee: t.personaHint || "auto-assign",
                priority: t.priority || "medium",
              })),
              instruction:
                "Present this project brief to the user. " +
                "Once they approve, call delegate again with confirmed=true and the same parameters.",
            });
          }

          const status = await adapter!.delegate({ title, description, issues });
          return jsonResult({
            success: true,
            message: `Project "${title}" delegated to the team (${issues.length} issue(s)).`,
            projectId: status.projectId,
            proofWorkspace: status.proofWorkspace,
            issues: status.issues,
          });
        }

        case "status": {
          let projectId = params.projectId as string | undefined;
          if (!projectId) {
            // Auto-select most recent project if only one exists or none specified
            const projects = adapter!.listProjects();
            if (projects.length === 0) return jsonResult({ error: "No active projects." });
            if (projects.length === 1) {
              projectId = projects[0].projectId;
            } else {
              return jsonResult({
                error: "Multiple projects active. Specify projectId.",
                projects: projects.map(p => ({ projectId: p.projectId, title: p.title })),
              });
            }
          }
          const status = await adapter!.getStatus(projectId);
          if (!status) return jsonResult({ error: `Project not found: ${projectId}` });
          return jsonResult(status);
        }

        case "steer": {
          const projectId = params.projectId as string | undefined;
          const issueTitle = params.issueTitle as string | undefined;
          const instructions = params.instructions as string | undefined;
          if (!projectId || !issueTitle || !instructions) {
            return jsonResult({ error: "Missing projectId, issueTitle, or instructions." });
          }
          const ok = await adapter!.steer(projectId, issueTitle, instructions);
          return jsonResult(ok
            ? { success: true, message: `Feedback sent for "${issueTitle}".` }
            : { error: "Failed to steer. Check projectId and issueTitle." });
        }

        case "cancel": {
          const projectId = params.projectId as string | undefined;
          if (!projectId) return jsonResult({ error: "Missing projectId." });
          const ok = await adapter!.cancel(projectId);
          return jsonResult(ok
            ? { success: true, message: "Project cancelled." }
            : { error: `Failed to cancel project: ${projectId}` });
        }

        case "projects": {
          const projects = adapter!.listProjects();
          return jsonResult({ projects, count: projects.length });
        }

        case "team":
          return jsonResult({
            team: getPaperclipAdapter()?.getTeamRoster() ?? "Agent team not running.",
          });

        default:
          return jsonResult({ error: `Unknown action: ${action}` });
      }
    },
  };
}
