/**
 * Delegate Tool — The ally delegates complex work to the agent team.
 *
 * Backed by native projects-state (JSON) + queue-processor (CLI spawn).
 * No external orchestration framework — just project grouping + execution.
 *
 * Actions:
 *   delegate — Scope + confirm a new project (two-call pattern)
 *   status   — Check project progress
 *   steer    — (not supported for CLI processes)
 *   cancel   — Stop a project
 *   projects — List all delegated projects
 *   team     — Show the agent team roster
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import { isPaperclipReady, createTask as paperclipCreateTask, findOrCreateProject as paperclipFindOrCreateProject, resolveAgentId as paperclipResolveAgent, wakeupAgent as paperclipWakeup } from "../services/paperclip-client.js";
import {
  type ProjectBrief,
  updateProjects,
  listProjects,
  getProject,
  clearProjects,
  newProjectId,
  newIssueId,
  inferTaskType,
  pickQAPersona,
} from "../lib/projects-state.js";
import {
  updateQueueState,
  readQueueState,
  newQueueItemId,
} from "../lib/queue-state.js";
import { isPersonaDormant, loadRoster, resolvePersona } from "../lib/agent-roster.js";

export function createDelegateTool(ctx?: { sessionKey?: string }): AnyAgentTool {
  return {
    label: "Delegate",
    name: "delegate",
    description:
      "Delegate complex work to the agent team. " +
      "Use this when a task needs multiple specialists (research, content, design, engineering, etc.) " +
      "or would take too long to handle inline. " +
      "SCOPING RULE: Always decompose complex requests into MULTIPLE issues, one per specialist. " +
      "Example: 'Build Sunny's audit page + Austin's pre-install page' = at LEAST 2 issues " +
      "(one per page, each assigned to a content-writer or researcher). " +
      "If a single page needs research + writing, create 2 issues: one 'research' issue and one 'content' issue. " +
      "Each issue gets ONE persona — never assign multiple specialists to one issue. " +
      "More issues = more parallel agents = faster results. " +
      "DELEGATION FLOW: Step 1 — call with action='delegate', confirmed=false to get a preview. " +
      "Step 2 — present the brief to the user. " +
      "Step 3 — when user approves (says 'go', 'yes', 'do it', etc.), call AGAIN with action='delegate', confirmed=true and THE SAME title/description/issues. " +
      "CRITICAL: 'go' means EXECUTE (confirmed=true), NOT check status. " +
      "Actions: delegate (create project), status (check progress), cancel, projects (list all), team (show roster).",
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
          description: "Issues to create. Each becomes a task assigned to an agent.",
        },
        projectId: {
          type: "string",
          description: "Project ID (for status/cancel)",
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
              qaNote: issues.length >= 2
                ? "A QA review stage will be automatically added after all tasks complete to verify deliverable quality."
                : undefined,
              instruction:
                "Present this project brief to the user. Mention the automatic QA review if qaNote is present. " +
                "Once they approve, call delegate again with confirmed=true and the same parameters.",
            });
          }

          // ── Paperclip path: delegate to external orchestration if available ──
          if (isPaperclipReady()) {
            try {
              const projectId = newProjectId();

              // Find existing project or create a new one (prevents duplicates)
              const pcProject = await paperclipFindOrCreateProject(title, description);

              const paperclipIssues: Array<{
                issueId: string;
                title: string;
                assignee: string;
              }> = [];

              for (const task of issues) {
                // Resolve GodMode persona to Paperclip agent
                const persona = resolvePersona(inferTaskType(task.title), task.personaHint);
                const agentId = await paperclipResolveAgent(
                  persona?.name ?? task.personaHint ?? task.title,
                );

                const pcIssue = await paperclipCreateTask({
                  title: task.title,
                  description: task.description,
                  priority: task.priority,
                  assigneeAgentId: agentId,
                  projectId: pcProject.id,
                  status: "todo",
                });
                paperclipIssues.push({
                  issueId: pcIssue.id,
                  title: task.title,
                  assignee: persona?.slug ?? task.personaHint ?? "auto-assign",
                });

                // Trigger execution — Paperclip's heartbeat service picks up
                // the assigned issue and runs it via the agent's adapter
                if (agentId) {
                  try {
                    await paperclipWakeup(agentId, {
                      issueId: pcIssue.id,
                      reason: `delegate: ${task.title}`,
                    });
                  } catch (err) {
                    console.warn(`[GodMode] Paperclip wakeup failed for ${agentId}: ${String(err)}`);
                  }
                }
              }

              // Save project to projects-state for local tracking
              await updateProjects((state) => {
                state.projects.push({
                  projectId,
                  title,
                  description,
                  issues: paperclipIssues.map((pi) => ({
                    issueId: newIssueId(),
                    title: pi.title,
                    personaSlug: pi.assignee,
                    queueItemId: pi.issueId, // Paperclip issue ID as reference
                  })),
                  createdAt: Date.now(),
                  status: "active",
                  sessionKey: ctx?.sessionKey,
                });
              });

              return jsonResult({
                success: true,
                backend: "paperclip",
                message: `Project "${title}" delegated via Paperclip (${issues.length} issue(s)).`,
                projectId,
                issues: paperclipIssues,
              });
            } catch (err) {
              // Paperclip failed — fall through to local queue
              console.warn(`[GodMode] Paperclip delegation failed, falling back to local queue: ${String(err)}`);
            }
          }

          // ── Execute delegation (local queue) ──
          const projectId = newProjectId();
          const workspace = `project-${projectId.slice(0, 8)}`;

          // Build toolkit context for issue descriptions
          let toolkitContext = "";
          try {
            const { isToolkitRunning, getToolkitBaseUrl } = await import("../services/agent-toolkit-server.js");
            if (isToolkitRunning()) {
              toolkitContext = [
                "\n\n---\n## GodMode Toolkit API",
                `Base URL: ${getToolkitBaseUrl()}`,
                "Use /search, /memory, /skills, /awareness, /identity endpoints to access knowledge.",
                "Use /agents/active to check what other agents are working on before starting.",
                "Search before building. Check existing artifacts. Never overwrite without backup.",
              ].join("\n");
            }
          } catch { /* toolkit not available */ }

          // Build issue records + resolve personas
          const issueRecords: Array<{
            issueId: string;
            title: string;
            personaSlug: string;
          }> = [];

          for (const task of issues) {
            const persona = task.personaHint
              ? resolvePersona(inferTaskType(task.personaHint || task.title), task.personaHint)
              : resolvePersona(inferTaskType(task.title));
            issueRecords.push({
              issueId: newIssueId(),
              title: task.title,
              personaSlug: persona?.slug ?? task.personaHint ?? "unassigned",
            });
          }

          // Auto-inject QA review stage for multi-agent projects
          if (issues.length >= 2) {
            const qaPersonaSlug = pickQAPersona(issues);
            issueRecords.push({
              issueId: newIssueId(),
              title: `QA Review: ${title}`,
              personaSlug: qaPersonaSlug,
            });
          }

          // Queue all issues for execution, tracking which were actually queued
          const queuedIssueMap = new Map<string, string>(); // issueId → queueItemId
          const skippedItems: { title: string; persona: string; reason: string }[] = [];

          for (let i = 0; i < issueRecords.length; i++) {
            const record = issueRecords[i];
            const isQAStage = i >= issues.length;
            const task = isQAStage
              ? {
                  title: record.title,
                  description: [
                    `Review all deliverables from this project for quality, completeness, and accuracy.`,
                    ``,
                    `Tasks to review:`,
                    ...issues.map((t) => `- ${t.title} (${t.personaHint || "auto"})`),
                    ``,
                    `Apply your full review checklist. Flag any issues with specific corrections.`,
                  ].join("\n"),
                  personaHint: record.personaSlug,
                }
              : issues[i];

            const taskType = isQAStage ? "review" as const : inferTaskType(record.personaSlug || task.title);

            // Trust gating: warn but DON'T silently skip — demote to "approval" instead.
            // The ally MUST tell the user when agents are gated. Silent skipping caused
            // the ally to claim "5 agents working" when only 2 were actually queued.
            if (record.personaSlug && record.personaSlug !== "unassigned") {
              let gateWarning: string | null = null;

              try {
                const { getAutonomyLevel, getTrustScore } = await import("../methods/trust-tracker.js");
                const autonomy = await getAutonomyLevel(record.personaSlug);
                if (autonomy === "disabled") {
                  const score = await getTrustScore(record.personaSlug);
                  gateWarning = `${record.personaSlug} has low trust score (${score ?? "unknown"}). Running with approval-required.`;
                }
              } catch { /* trust tracker unavailable */ }

              if (!gateWarning && isPersonaDormant(record.personaSlug)) {
                gateWarning = `${record.personaSlug} is dormant per roster config. Running anyway with approval-required.`;
              }

              if (gateWarning) {
                skippedItems.push({ title: task.title, persona: record.personaSlug, reason: gateWarning });
                // Don't skip — queue it anyway so work actually happens.
                // The queue processor will hold it for human review via "approval" autonomy.
              }
            }

            const queueItemId = newQueueItemId(task.title);
            queuedIssueMap.set(record.issueId, queueItemId);

            await updateQueueState((state) => {
              state.items.push({
                id: queueItemId,
                type: taskType,
                title: task.title,
                description:
                  `Project: ${title}\n\n${task.description}\n\n` +
                  `**Success Criteria:** Complete your section of the project. Write all output to the designated file.` +
                  toolkitContext,
                priority: (!isQAStage && (task.priority === "critical" || task.priority === "high") ? "high" : "normal") as "high" | "normal" | "low",
                status: "pending" as const,
                source: "chat" as const,
                createdAt: Date.now(),
                personaHint: record.personaSlug,
                workspaceId: workspace,
                sessionId: ctx?.sessionKey,
                meta: {
                  issueId: record.issueId,
                  projectId,
                  ...(isQAStage ? { isQAStage: true } : {}),
                },
              });
            });
          }

          // Save project to projects-state — only include issues that were actually queued
          await updateProjects((state) => {
            state.projects.push({
              projectId,
              title,
              description,
              issues: issueRecords
                .filter((r) => queuedIssueMap.has(r.issueId))
                .map((r) => ({
                  issueId: r.issueId,
                  title: r.title,
                  personaSlug: r.personaSlug,
                  queueItemId: queuedIssueMap.get(r.issueId)!,
                })),
              createdAt: Date.now(),
              status: "active",
              sessionKey: ctx?.sessionKey,
            });
          });

          // Kick off execution
          try {
            const { getQueueProcessor } = await import("../services/queue-processor.js");
            const qp = getQueueProcessor();
            if (qp) void qp.processAllPending();
          } catch { /* queue processor not ready */ }

          const warnings = skippedItems.length > 0
            ? `\n\n⚠️ TRUST WARNINGS — Tell the user:\n${skippedItems.map(s => `- "${s.title}" (${s.persona}): ${s.reason}`).join("\n")}\nThese items are queued but flagged for human approval. The user should know some agents have low trust scores.`
            : "";

          return jsonResult({
            success: true,
            message: `Project "${title}" delegated to the team (${issueRecords.length} issue(s) queued).${warnings}`,
            projectId,
            issues: issueRecords.map(r => ({
              issueId: r.issueId,
              title: r.title,
              assignee: r.personaSlug,
              queued: queuedIssueMap.has(r.issueId),
            })),
            ...(skippedItems.length > 0 ? { trustWarnings: skippedItems } : {}),
          });
        }

        case "status": {
          let projectId = params.projectId as string | undefined;
          const projects = await listProjects();

          if (!projectId) {
            const active = projects.filter(p => p.status === "active");
            if (active.length === 0) return jsonResult({ error: "No active projects." });
            if (active.length === 1) {
              projectId = active[0].projectId;
            } else {
              return jsonResult({
                error: "Multiple projects active. Specify projectId.",
                projects: active.map(p => ({ projectId: p.projectId, title: p.title })),
              });
            }
          }

          const project = projects.find(p => p.projectId === projectId);
          if (!project) return jsonResult({ error: `Project not found: ${projectId}` });

          // Cross-reference queue state + Paperclip for live statuses
          const qs = await readQueueState();
          const issueStatuses: Array<{
            issueId: string;
            title: string;
            status: string;
            assignee: string;
            backend?: string;
          }> = [];

          for (const issue of project.issues) {
            // Check local queue first
            const qi = qs.items.find(i => i.meta?.issueId === issue.issueId || i.meta?.paperclipIssueId === issue.issueId);
            if (qi) {
              issueStatuses.push({
                issueId: issue.issueId,
                title: issue.title,
                status: qi.status,
                assignee: issue.personaSlug,
                backend: "local",
              });
              continue;
            }

            // Check Paperclip if connected (queueItemId may hold Paperclip issue ID)
            if (isPaperclipReady() && issue.queueItemId) {
              try {
                const { getTaskStatus } = await import("../services/paperclip-client.js");
                const pcIssue = await getTaskStatus(issue.queueItemId);
                issueStatuses.push({
                  issueId: issue.issueId,
                  title: issue.title,
                  status: pcIssue.status,
                  assignee: issue.personaSlug,
                  backend: "paperclip",
                });
                continue;
              } catch { /* fall through */ }
            }

            issueStatuses.push({
              issueId: issue.issueId,
              title: issue.title,
              status: "pending",
              assignee: issue.personaSlug,
            });
          }

          return jsonResult({
            projectId: project.projectId,
            title: project.title,
            status: project.status,
            issues: issueStatuses,
          });
        }

        case "steer":
          return jsonResult({
            error: "Steering is not supported for running CLI processes. Wait for completion and provide feedback in the review.",
          });

        case "cancel": {
          const projectId = params.projectId as string | undefined;
          if (!projectId) return jsonResult({ error: "Missing projectId." });

          const project = await getProject(projectId);
          if (!project) return jsonResult({ error: `Project not found: ${projectId}` });

          // Mark project as failed
          await updateProjects((state) => {
            const p = state.projects.find(p => p.projectId === projectId);
            if (p) {
              p.status = "failed";
              p.completedAt = Date.now();
            }
          });

          // Cancel pending queue items
          await updateQueueState((state) => {
            for (const item of state.items) {
              if (item.meta?.projectId === projectId && item.status === "pending") {
                item.status = "failed";
                item.error = "Project cancelled";
                item.completedAt = Date.now();
              }
            }
          });

          return jsonResult({ success: true, message: "Project cancelled." });
        }

        case "projects": {
          const projects = await listProjects();
          return jsonResult({
            projects: projects.map(p => ({
              projectId: p.projectId,
              title: p.title,
              status: p.status,
              issueCount: p.issues.length,
              createdAt: p.createdAt,
            })),
            count: projects.length,
          });
        }

        case "team": {
          const roster = loadRoster();
          if (roster.length === 0) {
            return jsonResult({ team: "No team members registered." });
          }
          const lines = ["## Agent Team", ""];
          for (const persona of roster) {
            if (!isPersonaDormant(persona.slug)) {
              lines.push(`- **${persona.name}** (${persona.slug}): ${persona.mission || persona.taskTypes?.join(", ") || "general"}`);
            }
          }
          return jsonResult({ team: lines.join("\n") });
        }

        default:
          return jsonResult({ error: `Unknown action: ${action}` });
      }
    },
  };
}
