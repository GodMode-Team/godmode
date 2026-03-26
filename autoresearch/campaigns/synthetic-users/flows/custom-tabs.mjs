/**
 * Flow: custom-tabs
 * Tests custom tab creation and data source configuration
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

  // Step 1: Trigger custom tab creation
  try {
    log({ step: 1, action: "trigger-tab-creation", status: "start" });
    await stagehand.act("Look for a '+' button, 'New Tab', 'Add Tab', or 'Custom Tab' option in the navigation and click it");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("custom-tabs-trigger");
    const state1 = await stagehand.extract({
      instruction: "Extract the custom tab creation interface: is a creation dialog or form open? What options are available (tab name, type, data source)? Are there template options?",
      schema: {
        type: "object",
        properties: {
          creationDialogOpen: { type: "boolean" },
          hasNameField: { type: "boolean" },
          hasTypeSelector: { type: "boolean" },
          hasDataSourceOption: { type: "boolean" },
          templateOptions: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score1 = await judge("Trigger custom tab creation", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "trigger-tab-creation", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "trigger-tab-creation",
      error: err.message,
      severity: "P1",
      description: "Custom tab creation trigger not found or failed",
    });
    log({ step: 1, action: "trigger-tab-creation", status: "error", error: err.message });
  }

  // Step 2: Configure tab name and type
  try {
    log({ step: 2, action: "configure-tab-name", status: "start" });
    const tabName = archetype.domain
      ? `${archetype.domain} Tracker`
      : "Custom Tracker";

    await stagehand.act(`Enter the tab name: "${tabName}"`);
    await page.waitForTimeout(500);
    await stagehand.act("Select a tab type or template if available, choosing the most relevant option");
    await page.waitForTimeout(1000);

    const snap2 = await screenshot("custom-tabs-config-name");
    const state2 = await stagehand.extract({
      instruction: "Extract the current configuration state: is the name filled in? What type was selected? Are there additional configuration options now visible?",
      schema: {
        type: "object",
        properties: {
          nameFilled: { type: "boolean" },
          selectedType: { type: "string" },
          additionalOptions: { type: "array", items: { type: "string" } },
          canProceed: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Configure custom tab name and type", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "configure-tab-name", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "configure-tab-name",
      error: err.message,
      severity: "P2",
      description: "Tab name/type configuration failed",
    });
    log({ step: 2, action: "configure-tab-name", status: "error", error: err.message });
  }

  // Step 3: Configure data source
  try {
    log({ step: 3, action: "configure-data-source", status: "start" });
    await stagehand.act("Look for data source configuration options and select or configure a data source for the custom tab");
    await page.waitForTimeout(1500);

    const snap3 = await screenshot("custom-tabs-data-source");
    const state3 = await stagehand.extract({
      instruction: "Extract data source options: what data sources are available (API, integration, manual, AI-generated)? Is a data source selected? Are there connection or authentication steps?",
      schema: {
        type: "object",
        properties: {
          dataSourceOptions: { type: "array", items: { type: "string" } },
          dataSourceSelected: { type: "boolean" },
          selectedSource: { type: "string" },
          requiresAuth: { type: "boolean" },
          connectionStatus: { type: "string" },
        },
      },
    });

    const score3 = await judge("Configure data source for custom tab", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "configure-data-source", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "configure-data-source",
      error: err.message,
      severity: "P2",
      description: "Data source configuration not available or failed",
    });
    log({ step: 3, action: "configure-data-source", status: "error", error: err.message });
  }

  // Step 4: Save and create the tab
  try {
    log({ step: 4, action: "save-custom-tab", status: "start" });
    await stagehand.act("Click 'Create', 'Save', or 'Done' to finalize the custom tab creation");
    await page.waitForTimeout(2000);

    const snap4 = await screenshot("custom-tabs-created");
    const state4 = await stagehand.extract({
      instruction: "Extract the creation result: was the tab created successfully? Is it visible in the navigation? Does it show the correct name? Is content loading?",
      schema: {
        type: "object",
        properties: {
          tabCreated: { type: "boolean" },
          visibleInNav: { type: "boolean" },
          correctName: { type: "boolean" },
          contentLoading: { type: "boolean" },
          errorMessages: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score4 = await judge("Save and create custom tab", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "save-custom-tab", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "save-custom-tab",
      error: err.message,
      severity: "P1",
      description: "Custom tab creation save failed",
    });
    log({ step: 4, action: "save-custom-tab", status: "error", error: err.message });
  }

  // Step 5: Verify custom tab rendering
  try {
    log({ step: 5, action: "verify-tab-rendering", status: "start" });
    await stagehand.act("Click on the newly created custom tab to open it");
    await page.waitForTimeout(2000);

    const snap5 = await screenshot("custom-tabs-rendered");
    const state5 = await stagehand.extract({
      instruction: "Extract the custom tab rendering: is the content displayed correctly? Does the data source populate with data? Are there any layout issues or error states?",
      schema: {
        type: "object",
        properties: {
          contentRendered: { type: "boolean" },
          dataPopulated: { type: "boolean" },
          layoutCorrect: { type: "boolean" },
          hasErrors: { type: "boolean" },
          interactiveElements: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score5 = await judge("Verify custom tab rendering", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "verify-tab-rendering", status: "done", state: state5 });
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "verify-tab-rendering",
      error: err.message,
      severity: "P1",
      description: "Custom tab rendering verification failed",
    });
    log({ step: 5, action: "verify-tab-rendering", status: "error", error: err.message });
  }

  // Step 6: Test tab deletion / cleanup (edge cases only)
  try {
    log({ step: 6, action: "test-tab-management", status: "start" });
    if (depthLevel === "edge_cases" || depthLevel === "power_user") {
      await stagehand.act("Right-click on the custom tab or look for an edit/delete option for the tab");
      await page.waitForTimeout(1000);

      const snap6 = await screenshot("custom-tabs-management");
      const state6 = await stagehand.extract({
        instruction: "Extract tab management options: can the tab be renamed, reordered, or deleted? Is there a context menu? What management actions are available?",
        schema: {
          type: "object",
          properties: {
            canRename: { type: "boolean" },
            canDelete: { type: "boolean" },
            canReorder: { type: "boolean" },
            managementOptions: { type: "array", items: { type: "string" } },
          },
        },
      });

      const score6 = await judge("Test tab management options", state6, snap6);
      results.scores.push(score6);
      log({ step: 6, action: "test-tab-management", status: "done", state: state6 });
    } else {
      log({ step: 6, action: "test-tab-management", status: "skipped", reason: "not edge_cases depth" });
    }

    results.feedback.push(
      `As ${archetype.name || "a user"}, custom tab creation ${results.bugs.some((b) => b.step === 4) ? "encountered issues" : "works smoothly"}. Data source configuration: ${results.bugs.some((b) => b.step === 3) ? "needs improvement" : "intuitive"}. Tab rendering: ${results.bugs.some((b) => b.step === 5) ? "has display problems" : "correct"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 6,
      action: "test-tab-management",
      error: err.message,
      severity: "P3",
      description: "Tab management options not accessible",
    });
    log({ step: 6, action: "test-tab-management", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "custom-tabs",
  displayName: "Custom Tabs",
  estimatedMinutes: 6,
  requiresAuth: true,
};
