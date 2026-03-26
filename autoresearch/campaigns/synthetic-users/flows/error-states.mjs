/**
 * Flow: error-states
 * Tests error handling across surfaces: trigger common errors
 * and verify error messages are clear and recoverable
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

  // Step 1: Test invalid navigation (404-like error)
  try {
    log({ step: 1, action: "test-invalid-navigation", status: "start" });
    await page.goto("/this-page-definitely-does-not-exist-12345", { waitUntil: "networkidle", timeout: 10000 });
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("error-invalid-nav");
    const state1 = await stagehand.extract({
      instruction: "Extract the error page state: is there a 404 or 'page not found' message? Is the error message user-friendly? Is there a 'Go Home' or 'Back' button? Does the app remain functional?",
      schema: {
        type: "object",
        properties: {
          errorPageShown: { type: "boolean" },
          errorMessage: { type: "string" },
          isUserFriendly: { type: "boolean" },
          hasNavigationBack: { type: "boolean" },
          appStillFunctional: { type: "boolean" },
        },
      },
    });

    const score1 = await judge("Navigate to invalid page", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "test-invalid-navigation", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "test-invalid-navigation",
      error: err.message,
      severity: "P2",
      description: "Invalid navigation did not show proper error page",
    });
    log({ step: 1, action: "test-invalid-navigation", status: "error", error: err.message });
  }

  // Step 2: Test invalid input in chat
  try {
    log({ step: 2, action: "test-invalid-chat-input", status: "start" });
    await page.goto("/", { waitUntil: "networkidle" });
    await stagehand.act("Navigate to the Chat tab");
    await page.waitForTimeout(1500);

    // Send extremely long input
    const longInput = "A".repeat(50000);
    await page.evaluate((text) => {
      const input = document.querySelector('textarea, input[type="text"], [contenteditable="true"]');
      if (input) {
        if (input.tagName === "TEXTAREA" || input.tagName === "INPUT") {
          input.value = text;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          input.textContent = text;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    }, longInput);
    await page.waitForTimeout(1000);
    await stagehand.act("Click the send button to send the very long message");
    await page.waitForTimeout(3000);

    const snap2 = await screenshot("error-long-input");
    const state2 = await stagehand.extract({
      instruction: "Extract the response to extremely long input: did the app handle it gracefully? Is there a character limit message? Did it crash or freeze? Is the UI still responsive?",
      schema: {
        type: "object",
        properties: {
          handledGracefully: { type: "boolean" },
          hasCharacterLimit: { type: "boolean" },
          appCrashed: { type: "boolean" },
          uiResponsive: { type: "boolean" },
          errorMessage: { type: "string" },
        },
      },
    });

    const score2 = await judge("Send extremely long input to chat", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "test-invalid-chat-input", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "test-invalid-chat-input",
      error: err.message,
      severity: "P1",
      description: "Long input caused crash or unhandled error",
    });
    log({ step: 2, action: "test-invalid-chat-input", status: "error", error: err.message });
  }

  // Step 3: Test special characters and injection
  try {
    log({ step: 3, action: "test-special-characters", status: "start" });
    const specialInput = '<script>alert("xss")</script> && DROP TABLE users; -- ${`dangerous`} {{template}}';
    await stagehand.act(`Type in the chat: "${specialInput}"`);
    await page.waitForTimeout(500);
    await stagehand.act("Send the message");
    await page.waitForTimeout(3000);

    const snap3 = await screenshot("error-special-chars");
    const state3 = await stagehand.extract({
      instruction: "Extract the special character handling: was the input sanitized? Is the text displayed literally (not executed)? Are there any XSS or injection indicators? Is the app stable?",
      schema: {
        type: "object",
        properties: {
          inputSanitized: { type: "boolean" },
          displayedLiterally: { type: "boolean" },
          noXSSExecution: { type: "boolean" },
          appStable: { type: "boolean" },
          responseReceived: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("Test special characters and injection attempts", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "test-special-characters", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "test-special-characters",
      error: err.message,
      severity: "P0",
      description: "Special character/injection handling failed",
    });
    log({ step: 3, action: "test-special-characters", status: "error", error: err.message });
  }

  // Step 4: Test network error simulation
  try {
    log({ step: 4, action: "test-network-error", status: "start" });

    // Simulate offline mode
    await page.context().setOffline(true);
    await page.waitForTimeout(500);
    await stagehand.act("Try to send a message or interact with any feature while offline");
    await page.waitForTimeout(3000);

    const snap4 = await screenshot("error-network-offline");
    const state4 = await stagehand.extract({
      instruction: "Extract the offline behavior: is there an offline indicator? Is there an error message about network connectivity? Does the app show a retry option? Is cached content still visible?",
      schema: {
        type: "object",
        properties: {
          offlineIndicatorShown: { type: "boolean" },
          networkErrorMessage: { type: "boolean" },
          hasRetryOption: { type: "boolean" },
          cachedContentVisible: { type: "boolean" },
          appDegradeGracefully: { type: "boolean" },
        },
      },
    });

    // Restore online
    await page.context().setOffline(false);
    await page.waitForTimeout(2000);

    const snap4b = await screenshot("error-network-restored");
    const state4b = await stagehand.extract({
      instruction: "Extract the recovery behavior after going back online: did the app automatically reconnect? Is it fully functional again? Was there a reconnection message?",
      schema: {
        type: "object",
        properties: {
          autoReconnected: { type: "boolean" },
          fullyFunctional: { type: "boolean" },
          reconnectionMessage: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Test network error and recovery", { offline: state4, recovery: state4b }, snap4b);
    results.scores.push(score4);
    log({ step: 4, action: "test-network-error", status: "done", state: { offline: state4, recovery: state4b } });
  } catch (err) {
    // Make sure we restore online state
    try { await page.context().setOffline(false); } catch (_) { /* ignore */ }
    results.bugs.push({
      step: 4,
      action: "test-network-error",
      error: err.message,
      severity: "P1",
      description: "Network error handling or recovery failed",
    });
    log({ step: 4, action: "test-network-error", status: "error", error: err.message });
  }

  // Step 5: Test missing data / empty states
  try {
    log({ step: 5, action: "test-empty-states", status: "start" });
    await stagehand.act("Navigate to a section that might be empty (like a new workspace with no content, or search with no results)");
    await page.waitForTimeout(2000);
    await stagehand.act("Search for something that will return no results, like 'zzzzxyznonexistent999'");
    await page.waitForTimeout(2000);

    const snap5 = await screenshot("error-empty-state");
    const state5 = await stagehand.extract({
      instruction: "Extract the empty state handling: is there a friendly empty state message? Is there an illustration or icon? Are there suggested actions (e.g., 'Create your first...')? Is the layout clean?",
      schema: {
        type: "object",
        properties: {
          emptyStateShown: { type: "boolean" },
          hasFriendlyMessage: { type: "boolean" },
          hasIllustration: { type: "boolean" },
          hasSuggestedActions: { type: "boolean" },
          layoutClean: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Test empty state and missing data handling", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "test-empty-states", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, error handling is ${results.bugs.some((b) => b.severity === "P0") ? "concerning - critical issues found" : "acceptable"}. 404 handling: ${results.bugs.some((b) => b.step === 1) ? "poor" : "handled well"}. Input validation: ${results.bugs.some((b) => b.step === 2 || b.step === 3) ? "needs improvement" : "robust"}. Offline behavior: ${results.bugs.some((b) => b.step === 4) ? "no graceful degradation" : "degrades gracefully"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "test-empty-states",
      error: err.message,
      severity: "P3",
      description: "Empty state testing failed",
    });
    log({ step: 5, action: "test-empty-states", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "error-states",
  displayName: "Error States",
  estimatedMinutes: 5,
  requiresAuth: true,
};
