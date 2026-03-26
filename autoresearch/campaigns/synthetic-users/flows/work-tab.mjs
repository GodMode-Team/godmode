/**
 * Flow: work-tab
 * Tests Work tab: sessions list, artifacts view, and task management
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

  // Step 1: Navigate to Work tab
  try {
    log({ step: 1, action: "navigate-to-work", status: "start" });
    await stagehand.act("Click on the 'Work' tab in the navigation");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("work-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the Work tab layout: are sessions listed? Is there an artifacts panel? Are there task management elements? What sections are visible?",
      schema: {
        type: "object",
        properties: {
          sessionsListVisible: { type: "boolean" },
          artifactsPanelVisible: { type: "boolean" },
          taskManagementVisible: { type: "boolean" },
          visibleSections: { type: "array", items: { type: "string" } },
          sessionCount: { type: "number" },
        },
      },
    });

    const score1 = await judge("Navigate to Work tab and verify layout", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-work", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-work",
      error: err.message,
      severity: "P0",
      description: "Work tab not accessible or failed to load",
    });
    log({ step: 1, action: "navigate-to-work", status: "error", error: err.message });
  }

  // Step 2: Browse sessions list
  try {
    log({ step: 2, action: "browse-sessions", status: "start" });
    await stagehand.act("Click on the first session in the sessions list, or browse the available sessions");
    await page.waitForTimeout(1500);

    const snap2 = await screenshot("work-sessions");
    const state2 = await stagehand.extract({
      instruction: "Extract session details: what session information is shown (title, date, status)? Can sessions be filtered or sorted? Is a session detail view open?",
      schema: {
        type: "object",
        properties: {
          sessionDetailOpen: { type: "boolean" },
          sessionTitle: { type: "string" },
          sessionDate: { type: "string" },
          hasFilterOptions: { type: "boolean" },
          hasSortOptions: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Browse sessions list", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "browse-sessions", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "browse-sessions",
      error: err.message,
      severity: "P2",
      description: "Sessions list browsing failed",
    });
    log({ step: 2, action: "browse-sessions", status: "error", error: err.message });
  }

  // Step 3: View artifacts
  try {
    log({ step: 3, action: "view-artifacts", status: "start" });
    await stagehand.act("Navigate to or click on the Artifacts section in the Work tab");
    await page.waitForTimeout(1500);

    const snap3 = await screenshot("work-artifacts");
    const state3 = await stagehand.extract({
      instruction: "Extract artifacts information: what types of artifacts are shown (documents, code, images)? Can artifacts be previewed? Are there download or share options?",
      schema: {
        type: "object",
        properties: {
          artifactsVisible: { type: "boolean" },
          artifactCount: { type: "number" },
          artifactTypes: { type: "array", items: { type: "string" } },
          hasPreview: { type: "boolean" },
          hasDownload: { type: "boolean" },
          hasShare: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("View artifacts in Work tab", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "view-artifacts", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "view-artifacts",
      error: err.message,
      severity: "P2",
      description: "Artifacts view failed or not accessible",
    });
    log({ step: 3, action: "view-artifacts", status: "error", error: err.message });
  }

  // Step 4: Create or edit a task
  try {
    log({ step: 4, action: "create-task", status: "start" });
    await stagehand.act(
      "Look for a 'New Task', 'Add Task', or '+' button in the Work tab and click it to create a new task"
    );
    await page.waitForTimeout(1500);
    await stagehand.act(
      `Type a task title like "Review ${archetype.domain || "project"} deliverables by end of week"`
    );
    await page.waitForTimeout(500);
    await stagehand.act("Save or submit the new task");
    await page.waitForTimeout(1500);

    const snap4 = await screenshot("work-task-created");
    const state4 = await stagehand.extract({
      instruction: "Extract the task creation result: was the task created successfully? Is it visible in the task list? Does it show the correct title? Are there options for priority, due date, or assignee?",
      schema: {
        type: "object",
        properties: {
          taskCreated: { type: "boolean" },
          taskVisible: { type: "boolean" },
          taskTitle: { type: "string" },
          hasPriorityOption: { type: "boolean" },
          hasDueDateOption: { type: "boolean" },
          hasAssigneeOption: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Create a new task in Work tab", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "create-task", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "create-task",
      error: err.message,
      severity: "P1",
      description: "Task creation failed",
    });
    log({ step: 4, action: "create-task", status: "error", error: err.message });
  }

  // Step 5: Edit an existing task
  try {
    log({ step: 5, action: "edit-task", status: "start" });
    await stagehand.act("Click on an existing task to open it for editing, or click an edit button on a task");
    await page.waitForTimeout(1000);
    await stagehand.act("Modify the task by changing its priority, adding a note, or updating the due date");
    await page.waitForTimeout(500);
    await stagehand.act("Save the task changes");
    await page.waitForTimeout(1500);

    const snap5 = await screenshot("work-task-edited");
    const state5 = await stagehand.extract({
      instruction: "Extract whether the task edit was successful: were changes saved? Is there a confirmation or visual update? Does the task reflect the new changes?",
      schema: {
        type: "object",
        properties: {
          editSuccessful: { type: "boolean" },
          changesReflected: { type: "boolean" },
          confirmationShown: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Edit existing task", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "edit-task", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the Work tab ${state5.editSuccessful ? "handles task management smoothly" : "has task editing issues"}. Sessions: ${results.bugs.some((b) => b.step === 2) ? "need improvement" : "accessible"}. Artifacts: ${results.bugs.some((b) => b.step === 3) ? "not fully functional" : "well-organized"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "edit-task",
      error: err.message,
      severity: "P2",
      description: "Task editing failed",
    });
    log({ step: 5, action: "edit-task", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "work-tab",
  displayName: "Work Tab",
  estimatedMinutes: 5,
  requiresAuth: true,
};
