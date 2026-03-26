/**
 * Flow: today-tab
 * Tests Today tab: daily brief, schedule view, task list, and notifications
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

  // Step 1: Navigate to Today tab
  try {
    log({ step: 1, action: "navigate-to-today", status: "start" });
    await stagehand.act("Click on the 'Today' tab in the navigation");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("today-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the Today tab layout: is a daily brief or summary visible? Is today's date shown? Are there sections for schedule, tasks, or notifications?",
      schema: {
        type: "object",
        properties: {
          dailyBriefVisible: { type: "boolean" },
          dateDisplayed: { type: "string" },
          hasScheduleSection: { type: "boolean" },
          hasTaskSection: { type: "boolean" },
          hasNotifications: { type: "boolean" },
          sections: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score1 = await judge("Navigate to Today tab and verify layout", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-today", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-today",
      error: err.message,
      severity: "P0",
      description: "Today tab not accessible or failed to load",
    });
    log({ step: 1, action: "navigate-to-today", status: "error", error: err.message });
  }

  // Step 2: Check daily brief content
  try {
    log({ step: 2, action: "check-daily-brief", status: "start" });
    const snap2 = await screenshot("today-daily-brief");
    const state2 = await stagehand.extract({
      instruction: "Extract the daily brief content: what information is summarized? Are there weather, news, calendar, or task highlights? Is the content personalized?",
      schema: {
        type: "object",
        properties: {
          briefContent: { type: "string" },
          hasWeather: { type: "boolean" },
          hasCalendarSummary: { type: "boolean" },
          hasTaskHighlights: { type: "boolean" },
          isPersonalized: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Verify daily brief content quality", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "check-daily-brief", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "check-daily-brief",
      error: err.message,
      severity: "P2",
      description: "Daily brief content missing or not loading",
    });
    log({ step: 2, action: "check-daily-brief", status: "error", error: err.message });
  }

  // Step 3: Check schedule view
  try {
    log({ step: 3, action: "check-schedule", status: "start" });
    await stagehand.act("Look at or click on the schedule or calendar section in the Today view");
    await page.waitForTimeout(1500);

    const snap3 = await screenshot("today-schedule");
    const state3 = await stagehand.extract({
      instruction: "Extract the schedule view: are there calendar events listed? Do events show time, title, and location/link? Is the timeline or list format clear?",
      schema: {
        type: "object",
        properties: {
          eventsVisible: { type: "boolean" },
          eventCount: { type: "number" },
          showsTimes: { type: "boolean" },
          showsTitles: { type: "boolean" },
          formatType: { type: "string" },
        },
      },
    });

    const score3 = await judge("Verify schedule view in Today tab", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "check-schedule", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "check-schedule",
      error: err.message,
      severity: "P2",
      description: "Schedule section not functional",
    });
    log({ step: 3, action: "check-schedule", status: "error", error: err.message });
  }

  // Step 4: Interact with task list
  try {
    log({ step: 4, action: "interact-with-tasks", status: "start" });
    await stagehand.act("Find and click on a task item in the Today view, or interact with the task list");
    await page.waitForTimeout(1500);

    const snap4 = await screenshot("today-tasks");
    const state4 = await stagehand.extract({
      instruction: "Extract the task list state: how many tasks are shown? Can tasks be checked off? Are there priority indicators? Can tasks be expanded for details?",
      schema: {
        type: "object",
        properties: {
          taskCount: { type: "number" },
          hasCheckboxes: { type: "boolean" },
          hasPriorityIndicators: { type: "boolean" },
          tasksExpandable: { type: "boolean" },
          taskTitles: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score4 = await judge("Interact with Today task list", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "interact-with-tasks", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "interact-with-tasks",
      error: err.message,
      severity: "P2",
      description: "Task list interaction failed",
    });
    log({ step: 4, action: "interact-with-tasks", status: "error", error: err.message });
  }

  // Step 5: Check notifications
  try {
    log({ step: 5, action: "check-notifications", status: "start" });
    await stagehand.act("Look for and interact with any notification badges, alerts, or notification panel in the Today tab");
    await page.waitForTimeout(1000);

    const snap5 = await screenshot("today-notifications");
    const state5 = await stagehand.extract({
      instruction: "Extract the notification state: are there any notification badges? Is there a notification panel or feed? What types of notifications are shown (mentions, reminders, updates)?",
      schema: {
        type: "object",
        properties: {
          hasNotificationBadge: { type: "boolean" },
          notificationCount: { type: "number" },
          notificationTypes: { type: "array", items: { type: "string" } },
          panelAccessible: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Check notification system in Today tab", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "check-notifications", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the Today tab ${state5.panelAccessible ? "provides useful daily overview" : "could improve notification visibility"}. Tasks: ${state5.notificationCount || 0} notifications present. Schedule integration ${results.bugs.some((b) => b.step === 3) ? "needs work" : "functions well"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "check-notifications",
      error: err.message,
      severity: "P3",
      description: "Notification check failed",
    });
    log({ step: 5, action: "check-notifications", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "today-tab",
  displayName: "Today Tab",
  estimatedMinutes: 4,
  requiresAuth: true,
};
