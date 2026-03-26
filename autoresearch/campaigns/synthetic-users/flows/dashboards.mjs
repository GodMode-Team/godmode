/**
 * Flow: dashboards
 * Tests Dashboards: view existing dashboards, interact with widgets,
 * and attempt custom dashboard creation for synthetic user testing campaign.
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

  // Step 1: Navigate to Dashboards
  try {
    log({ step: 1, action: "navigate-to-dashboards", status: "start" });
    await stagehand.act("Click on the 'Dashboards' tab or navigate to the dashboards section");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("dashboards-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the dashboards layout: are there existing dashboards listed? What widgets or cards are visible? Is there an option to create a new dashboard?",
      schema: {
        type: "object",
        properties: {
          dashboardsVisible: { type: "boolean" },
          dashboardCount: { type: "number" },
          dashboardNames: { type: "array", items: { type: "string" } },
          hasCreateButton: { type: "boolean" },
          widgetCount: { type: "number" },
        },
      },
    });

    const score1 = await judge("Navigate to Dashboards section", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-dashboards", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-dashboards",
      error: err.message,
      severity: "P0",
      description: "Dashboards section not accessible",
    });
    log({ step: 1, action: "navigate-to-dashboards", status: "error", error: err.message });
  }

  // Step 2: Interact with existing widgets
  try {
    log({ step: 2, action: "interact-widgets", status: "start" });
    await stagehand.act("Click on the first widget or dashboard card to interact with it");
    await page.waitForTimeout(1500);

    const snap2 = await screenshot("dashboards-widget-interact");
    const state2 = await stagehand.extract({
      instruction: "Extract widget interaction details: did the widget respond to the click? Is there expanded data, a chart, or detailed view? Can the widget be configured or resized?",
      schema: {
        type: "object",
        properties: {
          widgetResponded: { type: "boolean" },
          hasExpandedView: { type: "boolean" },
          hasChart: { type: "boolean" },
          isConfigurable: { type: "boolean" },
          isResizable: { type: "boolean" },
          widgetType: { type: "string" },
        },
      },
    });

    const score2 = await judge("Interact with dashboard widgets", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "interact-widgets", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "interact-widgets",
      error: err.message,
      severity: "P2",
      description: "Widget interaction failed",
    });
    log({ step: 2, action: "interact-widgets", status: "error", error: err.message });
  }

  // Step 3: View an existing dashboard in detail
  try {
    log({ step: 3, action: "view-dashboard-detail", status: "start" });
    await stagehand.act("Open the first available dashboard to see its full view with all widgets");
    await page.waitForTimeout(2000);

    const snap3 = await screenshot("dashboards-detail-view");
    const state3 = await stagehand.extract({
      instruction: "Extract the full dashboard view: how many widgets are displayed? What types of data are shown (metrics, charts, lists, summaries)? Is the layout clean and organized?",
      schema: {
        type: "object",
        properties: {
          widgetCount: { type: "number" },
          widgetTypes: { type: "array", items: { type: "string" } },
          layoutOrganized: { type: "boolean" },
          hasRefreshButton: { type: "boolean" },
          dataLoaded: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("View dashboard in full detail", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "view-dashboard-detail", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "view-dashboard-detail",
      error: err.message,
      severity: "P2",
      description: "Dashboard detail view failed to load",
    });
    log({ step: 3, action: "view-dashboard-detail", status: "error", error: err.message });
  }

  // Step 4: Attempt to create a custom dashboard
  try {
    log({ step: 4, action: "create-custom-dashboard", status: "start" });
    await stagehand.act("Click the 'Create Dashboard', 'New Dashboard', or '+' button to start creating a custom dashboard");
    await page.waitForTimeout(1500);
    await stagehand.act(
      `Enter a dashboard name like "${archetype.domain || "My"} Overview Dashboard"`
    );
    await page.waitForTimeout(500);

    const snap4 = await screenshot("dashboards-create");
    const state4 = await stagehand.extract({
      instruction: "Extract the dashboard creation state: is a creation form or builder open? Can widgets be added? Are there template options? What configuration fields are available?",
      schema: {
        type: "object",
        properties: {
          creationFormOpen: { type: "boolean" },
          canAddWidgets: { type: "boolean" },
          hasTemplates: { type: "boolean" },
          configFields: { type: "array", items: { type: "string" } },
          nameFieldFilled: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Initiate custom dashboard creation", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "create-custom-dashboard", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "create-custom-dashboard",
      error: err.message,
      severity: "P2",
      description: "Custom dashboard creation not available or broken",
    });
    log({ step: 4, action: "create-custom-dashboard", status: "error", error: err.message });
  }

  // Step 5: Add widget and save dashboard
  try {
    log({ step: 5, action: "add-widget-and-save", status: "start" });
    await stagehand.act("Add a widget to the new dashboard by clicking 'Add Widget' or selecting from the widget picker");
    await page.waitForTimeout(1500);
    await stagehand.act("Save the dashboard by clicking 'Save', 'Create', or 'Done'");
    await page.waitForTimeout(2000);

    const snap5 = await screenshot("dashboards-saved");
    const state5 = await stagehand.extract({
      instruction: "Extract the save result: was the dashboard saved successfully? Is it now visible in the dashboards list? Is there a confirmation message?",
      schema: {
        type: "object",
        properties: {
          savedSuccessfully: { type: "boolean" },
          visibleInList: { type: "boolean" },
          confirmationShown: { type: "boolean" },
          dashboardName: { type: "string" },
        },
      },
    });

    const score5 = await judge("Add widget and save custom dashboard", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "add-widget-and-save", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the dashboard experience ${state5.savedSuccessfully ? "allows custom dashboard creation" : "has issues with creating custom dashboards"}. Widget interactions: ${results.bugs.some((b) => b.step === 2) ? "need improvement" : "responsive"}. Overall layout: ${results.bugs.some((b) => b.step === 3) ? "has loading issues" : "well-organized"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "add-widget-and-save",
      error: err.message,
      severity: "P2",
      description: "Failed to add widget or save dashboard",
    });
    log({ step: 5, action: "add-widget-and-save", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "dashboards",
  displayName: "Dashboards",
  estimatedMinutes: 5,
  requiresAuth: true,
};
