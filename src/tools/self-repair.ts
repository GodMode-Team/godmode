/**
 * self-repair.ts — Tool the ally calls to diagnose and fix system issues.
 *
 * When the ally detects something is wrong (via health warnings in context,
 * or user reports an issue), it calls this tool to:
 *   1. Run health diagnostics
 *   2. Attempt auto-repair
 *   3. Verify the repair worked
 *   4. Report what happened
 *
 * This replaces the user → screenshot → Claude Code → fix cycle.
 */

import { type AnyAgentTool } from "openclaw/plugin-sdk";
import { jsonResult } from "../lib/sdk-helpers.js";
import { health, turnErrors, repairLog, type RepairEntry } from "../lib/health-ledger.js";

export function createSelfRepairTool(): AnyAgentTool {
  return {
    label: "System",
    name: "godmode_repair",
    description:
      "Diagnose and repair GodMode system issues. Use this when you detect errors, " +
      "when health warnings appear in your context, or when the user reports something " +
      "isn't working (memory, queue, calendar, etc.). " +
      "Actions: 'diagnose' (check all systems), 'repair' (fix what's broken), " +
      "'history' (see recent repairs), 'status' (quick health summary).",
    parameters: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          enum: ["diagnose", "repair", "history", "status"],
          description: "What to do. 'diagnose' runs full checks, 'repair' attempts runtime fixes, 'history' shows past repairs, 'status' shows current health.",
        },
        subsystem: {
          type: "string",
          description: "Optional: focus on a specific subsystem (memory, queue, identity-graph, oauth-token, api-keys).",
        },
        issue_description: {
          type: "string",
          description: "Optional: describe the issue you're seeing for more targeted diagnosis.",
        },
      },
      required: ["action"],
    },
    execute: async (_toolCallId: string, params: Record<string, unknown>) => {
      const action = String(params.action || "diagnose");
      const subsystem = params.subsystem ? String(params.subsystem) : undefined;

      try {
        switch (action) {
          case "status": {
            const { getHealthReport } = await import("../services/self-heal.js");
            const report = getHealthReport();
            const recentErrors = turnErrors.peek();

            const lines = [
              `## System Health: ${report.overall.toUpperCase()}`,
              "",
            ];

            for (const sub of report.subsystems) {
              const icon = sub.state === "healthy" || sub.state === "repaired" ? "✓" : sub.state === "degraded" ? "⚠" : "✗";
              lines.push(`${icon} **${sub.id}**: ${sub.state} — ${sub.message}`);
              if (sub.repairCount > 0) {
                lines.push(`  └ Repaired ${sub.repairCount} time(s), last: ${sub.lastRepair ? new Date(sub.lastRepair).toLocaleTimeString() : "unknown"}`);
              }
            }

            if (report.ledger?.alerts && report.ledger.alerts.length > 0) {
              lines.push("", "### Operation Alerts");
              for (const alert of report.ledger.alerts) {
                lines.push(`- ${alert}`);
              }
            }

            if (recentErrors.length > 0) {
              lines.push("", "### Recent Errors (this session)");
              for (const err of recentErrors) {
                lines.push(`- ${err.operation}: ${err.error}`);
              }
            }

            // Show operation stats if available
            if (report.ledger?.operations && report.ledger.operations.length > 0) {
              lines.push("", "### Operation Stats");
              for (const op of report.ledger.operations.slice(0, 8)) {
                const rate = (op.successRate * 100).toFixed(0);
                const latency = op.avgElapsedMs ? `${op.avgElapsedMs}ms avg` : "";
                lines.push(`- ${op.operation}: ${rate}% success (${op.totalCalls} calls) ${latency}`);
              }
            }

            return jsonResult({ status: report.overall, detail: lines.join("\n"), subsystems: report.subsystems });
          }

          case "diagnose": {
            const { getHealthReport } = await import("../services/self-heal.js");
            const report = getHealthReport();
            const ledger = health.snapshot();

            const issues: string[] = [];
            const healthy: string[] = [];

            for (const sub of report.subsystems) {
              if (sub.state === "healthy" || sub.state === "repaired") {
                healthy.push(sub.id);
              } else {
                issues.push(`${sub.id}: ${sub.state} — ${sub.message}`);
              }
            }

            for (const alert of ledger.alerts) {
              if (!issues.some((i) => i.includes(alert.split(":")[0]))) {
                issues.push(alert);
              }
            }

            const detail = issues.length === 0
              ? `All systems healthy: ${healthy.join(", ")}`
              : `${issues.length} issue(s) found:\n${issues.map((i) => `- ${i}`).join("\n")}\n\nHealthy: ${healthy.join(", ")}`;

            return jsonResult({
              issues: issues.length,
              detail,
              recommendation: issues.length > 0 ? "Run with action='repair' to attempt auto-fix." : "No action needed.",
            });
          }

          case "repair": {
            const { runSelfHeal } = await import("../services/self-heal.js");
            const startTime = Date.now();

            const result = await runSelfHeal(
              {
                info: (msg: string) => console.log(msg),
                warn: (msg: string) => console.warn(msg),
                error: (msg: string) => console.error(msg),
              },
              // No broadcast — the ally is already in the conversation
            );

            const elapsed = Date.now() - startTime;

            // Record each repair in the log
            if (result.repaired > 0) {
              // Get the health report to see what was actually repaired
              const { getHealthReport } = await import("../services/self-heal.js");
              const report = getHealthReport();
              for (const sub of report.subsystems) {
                if (sub.state === "repaired" && sub.lastRepair && sub.lastRepair > startTime) {
                  repairLog.record({
                    ts: Date.now(),
                    subsystem: sub.id,
                    failure: sub.message,
                    repairAction: `auto-repair via godmode_repair tool`,
                    verified: true,
                    elapsed,
                  });
                }
              }
            }

            const lines = [
              `## Repair Results`,
              `- Checked: ${result.checked} subsystems`,
              `- Repaired: ${result.repaired}`,
              `- Persistent failures: ${result.failures.length}`,
              `- Elapsed: ${elapsed}ms`,
            ];

            if (result.failures.length > 0) {
              lines.push("", "### Still broken (needs manual attention):");
              for (const f of result.failures) {
                lines.push(`- ${f}`);
              }
            }

            return jsonResult({
              repaired: result.repaired,
              failures: result.failures,
              detail: lines.join("\n"),
            });
          }

          case "history": {
            const recent = subsystem
              ? repairLog.forSubsystem(subsystem)
              : repairLog.recent();

            if (recent.length === 0) {
              return jsonResult({ detail: "No repairs recorded yet." });
            }

            const lines = ["## Repair History", ""];
            for (const entry of recent) {
              const time = new Date(entry.ts).toLocaleString();
              const status = entry.verified ? "✓ verified" : "? unverified";
              lines.push(`- **${entry.subsystem}** (${time}): ${entry.failure} → ${entry.repairAction} [${status}, ${entry.elapsed}ms]`);
            }

            return jsonResult({ count: recent.length, detail: lines.join("\n") });
          }

          default:
            return jsonResult({ error: `Unknown action: ${action}. Use: diagnose, repair, history, status.` });
        }
      } catch (err) {
        return jsonResult({ error: `Repair tool error: ${String(err)}` });
      }
    },
  };
}
