/**
 * Flow: onboarding
 * Tests fresh install flow, onboarding wizard, and first-time setup
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

  // Step 1: Navigate to root and check for onboarding modal
  try {
    log({ step: 1, action: "navigate-to-root", status: "start" });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForSelector("body", { timeout: 10000 });

    const snap1 = await screenshot("onboarding-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract whether an onboarding modal, wizard, or welcome screen is visible. Note any setup prompts, welcome messages, or first-time user indicators.",
      schema: {
        type: "object",
        properties: {
          hasOnboardingModal: { type: "boolean" },
          welcomeText: { type: "string" },
          setupSteps: { type: "array", items: { type: "string" } },
          currentStep: { type: "number" },
          totalSteps: { type: "number" },
        },
      },
    });

    const score1 = await judge("Navigate to root and check onboarding presence", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-root", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-root",
      error: err.message,
      severity: "P1",
      description: "Failed to load root page or detect onboarding state",
    });
    log({ step: 1, action: "navigate-to-root", status: "error", error: err.message });
  }

  // Step 2: Follow setup wizard steps
  try {
    log({ step: 2, action: "follow-setup-steps", status: "start" });
    await stagehand.act("Click the first setup step or 'Get Started' button in the onboarding wizard");
    await page.waitForTimeout(1500);

    const snap2 = await screenshot("onboarding-step1");
    const state2 = await stagehand.extract({
      instruction: "Extract the current onboarding step content: what is being asked, what input fields or choices are available, and whether a 'Next' or 'Continue' button is present.",
      schema: {
        type: "object",
        properties: {
          stepTitle: { type: "string" },
          inputFields: { type: "array", items: { type: "string" } },
          hasNextButton: { type: "boolean" },
          hasBackButton: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Follow first onboarding setup step", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "follow-setup-steps", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "follow-setup-steps",
      error: err.message,
      severity: "P2",
      description: "Could not interact with onboarding wizard steps",
    });
    log({ step: 2, action: "follow-setup-steps", status: "error", error: err.message });
  }

  // Step 3: Fill in onboarding form fields
  try {
    log({ step: 3, action: "fill-onboarding-fields", status: "start" });
    await stagehand.act(
      `Fill in any onboarding form fields with realistic data for a user named "${archetype.name || "Test User"}". Enter a display name, select any preferences, and choose default options.`
    );
    await page.waitForTimeout(1000);

    const snap3 = await screenshot("onboarding-filled");
    const state3 = await stagehand.extract({
      instruction: "Extract the state of the onboarding form: which fields are filled, what values are selected, and whether the form is valid for submission.",
      schema: {
        type: "object",
        properties: {
          filledFields: { type: "array", items: { type: "string" } },
          formValid: { type: "boolean" },
          validationErrors: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score3 = await judge("Fill in onboarding form fields", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "fill-onboarding-fields", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "fill-onboarding-fields",
      error: err.message,
      severity: "P2",
      description: "Could not fill onboarding form fields",
    });
    log({ step: 3, action: "fill-onboarding-fields", status: "error", error: err.message });
  }

  // Step 4: Advance through remaining steps
  try {
    log({ step: 4, action: "advance-steps", status: "start" });
    await stagehand.act("Click 'Next', 'Continue', or the forward button to advance to the next onboarding step");
    await page.waitForTimeout(1500);
    await stagehand.act("Continue advancing through any remaining onboarding steps by clicking 'Next' or 'Continue'");
    await page.waitForTimeout(1000);

    const snap4 = await screenshot("onboarding-advanced");
    const state4 = await stagehand.extract({
      instruction: "Extract the current onboarding progress: which step we are on, total steps, and whether we have reached the final step or completion screen.",
      schema: {
        type: "object",
        properties: {
          currentStep: { type: "number" },
          totalSteps: { type: "number" },
          isComplete: { type: "boolean" },
          completionMessage: { type: "string" },
        },
      },
    });

    const score4 = await judge("Advance through onboarding wizard steps", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "advance-steps", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "advance-steps",
      error: err.message,
      severity: "P2",
      description: "Could not advance through onboarding steps",
    });
    log({ step: 4, action: "advance-steps", status: "error", error: err.message });
  }

  // Step 5: Test skip behavior
  try {
    log({ step: 5, action: "test-skip", status: "start" });
    if (depthLevel === "edge_cases" || depthLevel === "adversarial") {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      await stagehand.act("Look for and click a 'Skip' button, 'Skip for now' link, or 'X' close button on the onboarding wizard");
      await page.waitForTimeout(1000);
    }

    const snap5 = await screenshot("onboarding-skip");
    const state5 = await stagehand.extract({
      instruction: "Extract whether the onboarding was successfully skipped: is the main app visible? Are there any prompts to complete setup? Is the skip behavior clean?",
      schema: {
        type: "object",
        properties: {
          wasSkipped: { type: "boolean" },
          mainAppVisible: { type: "boolean" },
          pendingSetupPrompts: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score5 = await judge("Test skip onboarding behavior", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "test-skip", status: "done", state: state5 });
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "test-skip",
      error: err.message,
      severity: "P3",
      description: "Skip behavior failed or skip button not found",
    });
    log({ step: 5, action: "test-skip", status: "error", error: err.message });
  }

  // Step 6: Verify completion state
  try {
    log({ step: 6, action: "verify-completion", status: "start" });
    const snap6 = await screenshot("onboarding-complete");
    const state6 = await stagehand.extract({
      instruction: "Extract the post-onboarding state: is the user on the main dashboard? Are all core tabs visible? Is the app fully functional?",
      schema: {
        type: "object",
        properties: {
          onMainDashboard: { type: "boolean" },
          visibleTabs: { type: "array", items: { type: "string" } },
          appFunctional: { type: "boolean" },
          onboardingDismissed: { type: "boolean" },
        },
      },
    });

    const score6 = await judge("Verify onboarding completion state", state6, snap6);
    results.scores.push(score6);
    log({ step: 6, action: "verify-completion", status: "done", state: state6 });

    results.feedback.push(
      `As ${archetype.name || "a new user"}, the onboarding flow ${state6.appFunctional ? "successfully" : "did not"} guide me to a functional app state. Visible tabs: ${(state6.visibleTabs || []).join(", ")}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 6,
      action: "verify-completion",
      error: err.message,
      severity: "P1",
      description: "Could not verify onboarding completion state",
    });
    log({ step: 6, action: "verify-completion", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "onboarding",
  displayName: "Onboarding Flow",
  estimatedMinutes: 5,
  requiresAuth: false,
};
