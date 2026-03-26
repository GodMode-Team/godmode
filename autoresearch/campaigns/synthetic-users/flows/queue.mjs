/**
 * Flow: queue
 * Tests queue: add tasks, approve/reject, and review output
 * for synthetic user testing campaign.
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

  // Step 1: Navigate to Queue
  try {
    log({ step: 1, action: "navigate-to-queue", status: "start" });
    await stagehand.act("Click on the 'Queue' tab or navigate to the task queue section");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("queue-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the queue layout: is a task queue visible? How many items are in the queue? Are there status categories (pending, in-progress, completed)? Is there an 'Add' button?",
      schema: {
        type: "object",
        properties: {
          queueVisible: { type: "boolean" },
          itemCount: { type: "number" },
          statusCategories: { type: "array", items: { type: "string" } },
          hasAddButton: { type: "boolean" },
          pendingCount: { type: "number" },
        },
      },
    });

    const score1 = await judge("Navigate to Queue", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-queue", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-queue",
      error: err.message,
      severity: "P0",
      description: "Queue section not accessible",
    });
    log({ step: 1, action: "navigate-to-queue", status: "error", error: err.message });
  }

  // Step 2: Add an item to the queue
  try {
    log({ step: 2, action: "add-queue-item", status: "start" });
    await stagehand.act("Click the 'Add' button or create a new queue item");
    await page.waitForTimeout(1000);

    const taskDescription = archetype.domain
      ? `Research and summarize latest ${archetype.domain} best practices`
      : "Research and summarize latest industry trends for Q2";

    await stagehand.act(`Enter the task description: "${taskDescription}"`);
    await page.waitForTimeout(500);
    await stagehand.act("Submit or save the new queue item");
    await page.waitForTimeout(2000);

    const snap2 = await screenshot("queue-item-added");
    const state2 = await stagehand.extract({
      instruction: "Extract the result of adding the queue item: is it visible in the queue? What status was it assigned? Is it in the correct position?",
      schema: {
        type: "object",
        properties: {
          itemAdded: { type: "boolean" },
          itemStatus: { type: "string" },
          itemPosition: { type: "number" },
          itemDescription: { type: "string" },
        },
      },
    });

    const score2 = await judge("Add item to queue", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "add-queue-item", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "add-queue-item",
      error: err.message,
      severity: "P1",
      description: "Failed to add item to queue",
    });
    log({ step: 2, action: "add-queue-item", status: "error", error: err.message });
  }

  // Step 3: Check queue item status
  try {
    log({ step: 3, action: "check-status", status: "start" });
    await stagehand.act("Click on a queue item to view its details and current status");
    await page.waitForTimeout(1500);

    const snap3 = await screenshot("queue-item-status");
    const state3 = await stagehand.extract({
      instruction: "Extract queue item details: what is the current status? Is there progress information? Are there timestamps (created, updated)? Is output or result visible?",
      schema: {
        type: "object",
        properties: {
          status: { type: "string" },
          hasProgress: { type: "boolean" },
          progressPercent: { type: "number" },
          hasTimestamps: { type: "boolean" },
          hasOutput: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("Check queue item status", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "check-status", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "check-status",
      error: err.message,
      severity: "P2",
      description: "Queue item status check failed",
    });
    log({ step: 3, action: "check-status", status: "error", error: err.message });
  }

  // Step 4: Approve or reject a queue item
  try {
    log({ step: 4, action: "approve-reject", status: "start" });
    await stagehand.act("Look for 'Approve', 'Accept', 'Reject', or 'Dismiss' buttons on a queue item and click the approve/accept button");
    await page.waitForTimeout(1500);

    const snap4 = await screenshot("queue-approve-reject");
    const state4 = await stagehand.extract({
      instruction: "Extract the approval/rejection result: was the action processed? Did the item status change? Is there a confirmation? What happened to the item in the queue?",
      schema: {
        type: "object",
        properties: {
          actionProcessed: { type: "boolean" },
          newStatus: { type: "string" },
          confirmationShown: { type: "boolean" },
          itemRemovedFromPending: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Approve/reject queue item", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "approve-reject", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "approve-reject",
      error: err.message,
      severity: "P1",
      description: "Approve/reject action failed or buttons not found",
    });
    log({ step: 4, action: "approve-reject", status: "error", error: err.message });
  }

  // Step 5: Review completed items
  try {
    log({ step: 5, action: "review-completed", status: "start" });
    await stagehand.act("Navigate to the completed or finished section of the queue to review completed items");
    await page.waitForTimeout(1500);

    const snap5 = await screenshot("queue-completed");
    const state5 = await stagehand.extract({
      instruction: "Extract the completed items view: how many completed items are shown? Do they have output/results? Can the output be viewed, copied, or downloaded? Are there quality indicators?",
      schema: {
        type: "object",
        properties: {
          completedItemsVisible: { type: "boolean" },
          completedCount: { type: "number" },
          hasOutput: { type: "boolean" },
          canViewOutput: { type: "boolean" },
          canCopyOutput: { type: "boolean" },
          hasQualityIndicators: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Review completed queue items", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "review-completed", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the queue system ${state5.completedItemsVisible ? "provides clear output review" : "makes it hard to review completed work"}. Add/approve flow: ${results.bugs.some((b) => b.step === 2 || b.step === 4) ? "has friction points" : "smooth"}. Status tracking: ${state5.hasOutput ? "informative" : "could be more detailed"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "review-completed",
      error: err.message,
      severity: "P2",
      description: "Completed items review failed",
    });
    log({ step: 5, action: "review-completed", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "queue",
  displayName: "Queue",
  estimatedMinutes: 5,
  requiresAuth: true,
};
