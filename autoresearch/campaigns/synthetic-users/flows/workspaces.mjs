/**
 * Flow: workspaces
 * Tests workspace creation, switching, and Git sync
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

  // Step 1: Navigate to Workspaces
  try {
    log({ step: 1, action: "navigate-to-workspaces", status: "start" });
    await stagehand.act("Click on 'Workspaces' in the navigation or open the workspace switcher");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("workspaces-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract workspaces layout: how many workspaces exist? What are their names? Is there a 'Create Workspace' button? Is the current workspace indicated?",
      schema: {
        type: "object",
        properties: {
          workspacesVisible: { type: "boolean" },
          workspaceCount: { type: "number" },
          workspaceNames: { type: "array", items: { type: "string" } },
          hasCreateButton: { type: "boolean" },
          currentWorkspace: { type: "string" },
        },
      },
    });

    const score1 = await judge("Navigate to Workspaces", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-workspaces", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-workspaces",
      error: err.message,
      severity: "P0",
      description: "Workspaces section not accessible",
    });
    log({ step: 1, action: "navigate-to-workspaces", status: "error", error: err.message });
  }

  // Step 2: Create a new workspace
  try {
    log({ step: 2, action: "create-workspace", status: "start" });
    await stagehand.act("Click 'Create Workspace', 'New Workspace', or the '+' button");
    await page.waitForTimeout(1500);

    const workspaceName = archetype.domain
      ? `${archetype.domain} Project`
      : "Test Project";

    await stagehand.act(`Enter the workspace name: "${workspaceName}"`);
    await page.waitForTimeout(500);
    await stagehand.act("Save or create the workspace");
    await page.waitForTimeout(2000);

    const snap2 = await screenshot("workspaces-created");
    const state2 = await stagehand.extract({
      instruction: "Extract workspace creation result: was it created successfully? Is the new workspace now active? Are there default sections or content? Can context be added?",
      schema: {
        type: "object",
        properties: {
          created: { type: "boolean" },
          isActive: { type: "boolean" },
          workspaceName: { type: "string" },
          hasDefaultContent: { type: "boolean" },
          canAddContext: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Create new workspace", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "create-workspace", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "create-workspace",
      error: err.message,
      severity: "P1",
      description: "Workspace creation failed",
    });
    log({ step: 2, action: "create-workspace", status: "error", error: err.message });
  }

  // Step 3: Add context to workspace
  try {
    log({ step: 3, action: "add-context", status: "start" });
    await stagehand.act("Look for an option to add context, files, or information to the workspace and click it");
    await page.waitForTimeout(1000);
    await stagehand.act(
      `Add some context like "This workspace is for tracking ${archetype.domain || "project"} deliverables and team coordination"`
    );
    await page.waitForTimeout(500);
    await stagehand.act("Save or confirm the context addition");
    await page.waitForTimeout(1500);

    const snap3 = await screenshot("workspaces-context-added");
    const state3 = await stagehand.extract({
      instruction: "Extract the context addition result: was the context saved? Is it visible in the workspace? Are there options for different context types (text, files, links)?",
      schema: {
        type: "object",
        properties: {
          contextSaved: { type: "boolean" },
          contextVisible: { type: "boolean" },
          contextTypes: { type: "array", items: { type: "string" } },
          contextCount: { type: "number" },
        },
      },
    });

    const score3 = await judge("Add context to workspace", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "add-context", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "add-context",
      error: err.message,
      severity: "P2",
      description: "Context addition to workspace failed",
    });
    log({ step: 3, action: "add-context", status: "error", error: err.message });
  }

  // Step 4: Switch between workspaces
  try {
    log({ step: 4, action: "switch-workspace", status: "start" });
    await stagehand.act("Open the workspace switcher and switch to a different workspace");
    await page.waitForTimeout(2000);

    const snap4a = await screenshot("workspaces-switched");
    const state4a = await stagehand.extract({
      instruction: "Extract the workspace switch result: did the workspace change? Is the new workspace's content loaded? Is the workspace name updated in the UI?",
      schema: {
        type: "object",
        properties: {
          switchSuccessful: { type: "boolean" },
          newWorkspaceName: { type: "string" },
          contentLoaded: { type: "boolean" },
          previousWorkspaceAccessible: { type: "boolean" },
        },
      },
    });

    // Switch back
    await stagehand.act("Switch back to the previously created workspace");
    await page.waitForTimeout(1500);

    const snap4b = await screenshot("workspaces-switched-back");
    const state4b = await stagehand.extract({
      instruction: "Extract whether the context we added earlier is still present after switching back.",
      schema: {
        type: "object",
        properties: {
          contextPreserved: { type: "boolean" },
          workspaceName: { type: "string" },
        },
      },
    });

    const score4 = await judge("Switch between workspaces", { initial: state4a, switchBack: state4b }, snap4b);
    results.scores.push(score4);
    log({ step: 4, action: "switch-workspace", status: "done", state: { initial: state4a, switchBack: state4b } });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "switch-workspace",
      error: err.message,
      severity: "P1",
      description: "Workspace switching failed or context lost",
    });
    log({ step: 4, action: "switch-workspace", status: "error", error: err.message });
  }

  // Step 5: Test Git sync (if available)
  try {
    log({ step: 5, action: "test-git-sync", status: "start" });
    await stagehand.act("Look for a Git sync, version control, or sync option in the workspace settings and click it");
    await page.waitForTimeout(1500);

    const snap5 = await screenshot("workspaces-git-sync");
    const state5 = await stagehand.extract({
      instruction: "Extract Git sync options: is there a Git integration option? Can a repository be connected? Is there a sync status? What sync options are available (push, pull, auto-sync)?",
      schema: {
        type: "object",
        properties: {
          gitSyncAvailable: { type: "boolean" },
          canConnectRepo: { type: "boolean" },
          syncStatus: { type: "string" },
          syncOptions: { type: "array", items: { type: "string" } },
          isConnected: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Test Git sync functionality", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "test-git-sync", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, workspaces ${results.bugs.some((b) => b.step === 4) ? "have switching issues" : "switch smoothly"}. Context persistence: ${results.bugs.some((b) => b.step === 3) ? "unreliable" : "works well"}. Git sync: ${state5.gitSyncAvailable ? "available" : "not found or not accessible"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "test-git-sync",
      error: err.message,
      severity: "P3",
      description: "Git sync option not found or not functional",
    });
    log({ step: 5, action: "test-git-sync", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "workspaces",
  displayName: "Workspaces",
  estimatedMinutes: 6,
  requiresAuth: true,
};
