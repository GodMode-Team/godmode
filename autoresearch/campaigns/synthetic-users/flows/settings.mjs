/**
 * Flow: settings
 * Tests Settings: config toggles, integrations, guardrails, skills, agents,
 * and trust levels for synthetic user testing campaign.
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

  // Step 1: Navigate to Settings
  try {
    log({ step: 1, action: "navigate-to-settings", status: "start" });
    await stagehand.act("Click on the 'Settings' tab, gear icon, or navigate to the settings page");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("settings-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the settings layout: what sub-tabs or sections are available (General, Integrations, Guardrails, Skills, Agents, Trust, etc.)? Is a sidebar menu visible?",
      schema: {
        type: "object",
        properties: {
          settingsVisible: { type: "boolean" },
          subTabs: { type: "array", items: { type: "string" } },
          hasSidebar: { type: "boolean" },
          currentSection: { type: "string" },
        },
      },
    });

    const score1 = await judge("Navigate to Settings", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-settings", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-settings",
      error: err.message,
      severity: "P0",
      description: "Settings page not accessible",
    });
    log({ step: 1, action: "navigate-to-settings", status: "error", error: err.message });
  }

  // Step 2: Toggle configuration settings
  try {
    log({ step: 2, action: "toggle-config", status: "start" });
    await stagehand.act("Find a toggle switch or checkbox in the settings and click it to change its state");
    await page.waitForTimeout(1000);

    const snap2a = await screenshot("settings-toggle-changed");
    const state2a = await stagehand.extract({
      instruction: "Extract the toggle state: which setting was toggled? What is its new value (on/off)? Was there a confirmation or immediate save?",
      schema: {
        type: "object",
        properties: {
          settingName: { type: "string" },
          newValue: { type: "boolean" },
          autoSaved: { type: "boolean" },
          confirmationShown: { type: "boolean" },
        },
      },
    });

    // Verify persistence by navigating away and back
    await stagehand.act("Navigate to a different tab and then return to Settings");
    await page.waitForTimeout(2000);

    const snap2b = await screenshot("settings-persistence-check");
    const state2b = await stagehand.extract({
      instruction: "Extract whether the previously toggled setting retained its changed value after navigating away and back.",
      schema: {
        type: "object",
        properties: {
          settingPersisted: { type: "boolean" },
          currentValue: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Toggle config and verify persistence", { toggle: state2a, persistence: state2b }, snap2b);
    results.scores.push(score2);
    log({ step: 2, action: "toggle-config", status: "done", state: { toggle: state2a, persistence: state2b } });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "toggle-config",
      error: err.message,
      severity: "P1",
      description: "Config toggle or persistence failed",
    });
    log({ step: 2, action: "toggle-config", status: "error", error: err.message });
  }

  // Step 3: Check integrations section
  try {
    log({ step: 3, action: "check-integrations", status: "start" });
    await stagehand.act("Click on the 'Integrations' sub-tab or section in Settings");
    await page.waitForTimeout(1500);

    const snap3 = await screenshot("settings-integrations");
    const state3 = await stagehand.extract({
      instruction: "Extract the integrations section: what integrations are listed? Which are connected/active? Are there 'Connect' buttons for new integrations?",
      schema: {
        type: "object",
        properties: {
          integrationsList: { type: "array", items: { type: "string" } },
          connectedCount: { type: "number" },
          availableCount: { type: "number" },
          hasConnectButtons: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("Check integrations settings", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "check-integrations", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "check-integrations",
      error: err.message,
      severity: "P2",
      description: "Integrations section not accessible",
    });
    log({ step: 3, action: "check-integrations", status: "error", error: err.message });
  }

  // Step 4: Check guardrails settings
  try {
    log({ step: 4, action: "check-guardrails", status: "start" });
    await stagehand.act("Click on the 'Guardrails' or 'Safety' sub-tab in Settings");
    await page.waitForTimeout(1500);

    const snap4 = await screenshot("settings-guardrails");
    const state4 = await stagehand.extract({
      instruction: "Extract guardrails settings: what safety or guardrail options are available? Are there content filtering levels, approval requirements, or action limits?",
      schema: {
        type: "object",
        properties: {
          guardrailsVisible: { type: "boolean" },
          options: { type: "array", items: { type: "string" } },
          hasContentFiltering: { type: "boolean" },
          hasApprovalRequirements: { type: "boolean" },
          hasActionLimits: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Check guardrails settings", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "check-guardrails", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "check-guardrails",
      error: err.message,
      severity: "P2",
      description: "Guardrails settings not found",
    });
    log({ step: 4, action: "check-guardrails", status: "error", error: err.message });
  }

  // Step 5: Check skills and agents
  try {
    log({ step: 5, action: "check-skills-agents", status: "start" });
    await stagehand.act("Click on the 'Skills' or 'Agents' sub-tab in Settings");
    await page.waitForTimeout(1500);

    const snap5 = await screenshot("settings-skills-agents");
    const state5 = await stagehand.extract({
      instruction: "Extract skills and agents settings: what skills or agents are configured? Can they be enabled/disabled? Are there descriptions for each? Is there an option to add custom skills?",
      schema: {
        type: "object",
        properties: {
          skillsList: { type: "array", items: { type: "string" } },
          agentsList: { type: "array", items: { type: "string" } },
          canToggleSkills: { type: "boolean" },
          hasDescriptions: { type: "boolean" },
          canAddCustom: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Check skills and agents settings", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "check-skills-agents", status: "done", state: state5 });
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "check-skills-agents",
      error: err.message,
      severity: "P2",
      description: "Skills/Agents settings not accessible",
    });
    log({ step: 5, action: "check-skills-agents", status: "error", error: err.message });
  }

  // Step 6: Check trust levels
  try {
    log({ step: 6, action: "check-trust-levels", status: "start" });
    await stagehand.act("Click on the 'Trust' or 'Trust Levels' sub-tab in Settings");
    await page.waitForTimeout(1500);

    const snap6 = await screenshot("settings-trust-levels");
    const state6 = await stagehand.extract({
      instruction: "Extract trust level settings: what trust levels are available? What is the current level? What permissions does each level grant? Can the user change the trust level?",
      schema: {
        type: "object",
        properties: {
          trustLevelsVisible: { type: "boolean" },
          currentLevel: { type: "string" },
          availableLevels: { type: "array", items: { type: "string" } },
          levelDescriptions: { type: "boolean" },
          canChangeLevel: { type: "boolean" },
        },
      },
    });

    const score6 = await judge("Check trust levels settings", state6, snap6);
    results.scores.push(score6);
    log({ step: 6, action: "check-trust-levels", status: "done", state: state6 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, Settings is ${state6.trustLevelsVisible ? "comprehensive" : "missing trust level controls"}. Integrations: ${results.bugs.some((b) => b.step === 3) ? "not fully accessible" : "well-organized"}. Config persistence: ${results.bugs.some((b) => b.step === 2) ? "has issues" : "works correctly"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 6,
      action: "check-trust-levels",
      error: err.message,
      severity: "P2",
      description: "Trust levels section not found",
    });
    log({ step: 6, action: "check-trust-levels", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "settings",
  displayName: "Settings",
  estimatedMinutes: 7,
  requiresAuth: true,
};
