/**
 * Flow: paperclip
 * Tests Paperclip multi-agent swarm: initiate tasks, monitor progress,
 * and review specialist outputs for synthetic user testing campaign.
 */

/**
 * @param {object} ctx
 * @param {import("@browserbasehq/stagehand").Stagehand} ctx.stagehand - Stagehand instance
 * @param {import("@browserbasehq/stagehand").Page} ctx.page - Playwright page
 * @param {object} ctx.archetype - The archetype definition
 * @param {string} ctx.depthLevel - "happy_path" | "edge_cases" | "power_user" | "adversarial"
 * @param {number} ctx.loop - Current loop number
 * @param {Function} ctx.judge - async (action, pageState, screenshot) => scores
 * @param {Function} ctx.screenshot - async (name) => filepath
 * @param {Function} ctx.log - (entry) => void
 * @returns {Promise<{scores: object[], bugs: object[], feedback: string[]}>}
 */
export default async function flow(ctx) {
  const { stagehand, page, archetype, depthLevel, loop, judge, screenshot, log } = ctx;
  const results = { scores: [], bugs: [], feedback: [] };

  // Step 1: Navigate to Paperclip / Swarm interface
  try {
    log({ step: 1, action: "navigate-to-paperclip", status: "start" });
    await stagehand.act("Click on 'Paperclip', 'Swarm', or the multi-agent section in the navigation");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("paperclip-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the Paperclip/Swarm interface: is the multi-agent panel visible? What options are available (new swarm, history, templates)? Are there active swarms listed?",
      schema: {
        type: "object",
        properties: {
          swarmInterfaceVisible: { type: "boolean" },
          hasNewSwarmButton: { type: "boolean" },
          hasHistory: { type: "boolean" },
          hasTemplates: { type: "boolean" },
          activeSwarms: { type: "number" },
        },
      },
    });

    const score1 = await judge("Navigate to Paperclip swarm interface", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-paperclip", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-paperclip",
      error: err.message,
      severity: "P0",
      description: "Paperclip/Swarm interface not accessible",
    });
    log({ step: 1, action: "navigate-to-paperclip", status: "error", error: err.message });
  }

  // Step 2: Initiate a swarm task
  try {
    log({ step: 2, action: "initiate-swarm", status: "start" });
    await stagehand.act("Click 'New Swarm', 'Start', or the button to initiate a new multi-agent task");
    await page.waitForTimeout(1500);

    const swarmTask = archetype.domain
      ? `Create a comprehensive competitive analysis report for the ${archetype.domain} industry, including market trends, key players, and strategic recommendations`
      : "Create a comprehensive competitive analysis report for our product, including market trends, key players, and strategic recommendations";

    await stagehand.act(`Enter the swarm task description: "${swarmTask}"`);
    await page.waitForTimeout(500);
    await stagehand.act("Launch or start the swarm task");
    await page.waitForTimeout(3000);

    const snap2 = await screenshot("paperclip-swarm-initiated");
    const state2 = await stagehand.extract({
      instruction: "Extract the swarm initiation state: was the swarm started? How many agents/specialists were spawned? What are their roles? Is there a progress overview?",
      schema: {
        type: "object",
        properties: {
          swarmStarted: { type: "boolean" },
          agentCount: { type: "number" },
          agentRoles: { type: "array", items: { type: "string" } },
          hasProgressOverview: { type: "boolean" },
          taskDescription: { type: "string" },
        },
      },
    });

    const score2 = await judge("Initiate multi-agent swarm task", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "initiate-swarm", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "initiate-swarm",
      error: err.message,
      severity: "P1",
      description: "Swarm task initiation failed",
    });
    log({ step: 2, action: "initiate-swarm", status: "error", error: err.message });
  }

  // Step 3: Monitor swarm progress
  try {
    log({ step: 3, action: "monitor-progress", status: "start" });
    await page.waitForTimeout(5000);

    const snap3a = await screenshot("paperclip-progress-early");
    await page.waitForTimeout(10000);

    const snap3b = await screenshot("paperclip-progress-mid");
    const state3 = await stagehand.extract({
      instruction: "Extract swarm progress: what percentage is complete? Which agents are active/completed? Are there real-time updates or logs? Is there a visual progress indicator (timeline, graph)?",
      schema: {
        type: "object",
        properties: {
          overallProgress: { type: "number" },
          activeAgents: { type: "number" },
          completedAgents: { type: "number" },
          hasRealTimeUpdates: { type: "boolean" },
          hasVisualIndicator: { type: "boolean" },
          agentStatuses: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score3 = await judge("Monitor swarm progress", state3, snap3b);
    results.scores.push(score3);
    log({ step: 3, action: "monitor-progress", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "monitor-progress",
      error: err.message,
      severity: "P2",
      description: "Swarm progress monitoring failed",
    });
    log({ step: 3, action: "monitor-progress", status: "error", error: err.message });
  }

  // Step 4: View individual specialist output
  try {
    log({ step: 4, action: "view-specialist-output", status: "start" });
    await stagehand.act("Click on an individual agent or specialist to view their specific output and contribution");
    await page.waitForTimeout(2000);

    const snap4 = await screenshot("paperclip-specialist-output");
    const state4 = await stagehand.extract({
      instruction: "Extract the specialist output: what did this agent produce? Is the output formatted (text, data, analysis)? Can the output be copied or exported? Is quality visible?",
      schema: {
        type: "object",
        properties: {
          outputVisible: { type: "boolean" },
          agentRole: { type: "string" },
          outputType: { type: "string" },
          outputLength: { type: "number" },
          canCopy: { type: "boolean" },
          canExport: { type: "boolean" },
          qualityIndicator: { type: "string" },
        },
      },
    });

    const score4 = await judge("View individual specialist output", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "view-specialist-output", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "view-specialist-output",
      error: err.message,
      severity: "P2",
      description: "Could not view specialist output",
    });
    log({ step: 4, action: "view-specialist-output", status: "error", error: err.message });
  }

  // Step 5: Review consolidated swarm output
  try {
    log({ step: 5, action: "review-consolidated-output", status: "start" });
    await stagehand.act("Navigate to or click on the consolidated output, final report, or summary of the swarm task");
    await page.waitForTimeout(2000);

    const snap5 = await screenshot("paperclip-consolidated");
    const state5 = await stagehand.extract({
      instruction: "Extract the consolidated output: is there a final merged report? Does it incorporate all specialist contributions? Can it be exported, shared, or saved? Is there a quality score?",
      schema: {
        type: "object",
        properties: {
          consolidatedOutputVisible: { type: "boolean" },
          incorporatesAllAgents: { type: "boolean" },
          canExport: { type: "boolean" },
          canShare: { type: "boolean" },
          canSave: { type: "boolean" },
          qualityScore: { type: "string" },
          outputWordCount: { type: "number" },
        },
      },
    });

    const score5 = await judge("Review consolidated swarm output", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "review-consolidated-output", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the Paperclip multi-agent swarm ${state5.consolidatedOutputVisible ? "produces comprehensive results" : "output consolidation needs improvement"}. Agent coordination: ${results.bugs.some((b) => b.step === 3) ? "progress tracking unclear" : "well-tracked"}. Output quality: ${state5.qualityScore || "no score visible"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "review-consolidated-output",
      error: err.message,
      severity: "P1",
      description: "Consolidated swarm output not accessible",
    });
    log({ step: 5, action: "review-consolidated-output", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "paperclip",
  displayName: "Paperclip Multi-Agent Swarm",
  estimatedMinutes: 8,
  requiresAuth: true,
};
