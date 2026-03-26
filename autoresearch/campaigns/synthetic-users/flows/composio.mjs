/**
 * Flow: composio
 * Tests Composio integration setup: navigate to integrations, connect API,
 * and verify data flow for synthetic user testing campaign.
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

  // Step 1: Navigate to integrations
  try {
    log({ step: 1, action: "navigate-to-integrations", status: "start" });
    await stagehand.act("Navigate to Settings, then click on the 'Integrations' section, or look for a Composio integration option");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("composio-integrations-page");
    const state1 = await stagehand.extract({
      instruction: "Extract the integrations page: is Composio listed as an integration? What other integrations are available? Is there a search or filter for integrations?",
      schema: {
        type: "object",
        properties: {
          integrationsPageVisible: { type: "boolean" },
          composioListed: { type: "boolean" },
          integrationsList: { type: "array", items: { type: "string" } },
          hasSearch: { type: "boolean" },
          hasFilter: { type: "boolean" },
        },
      },
    });

    const score1 = await judge("Navigate to integrations page", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-integrations", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-integrations",
      error: err.message,
      severity: "P0",
      description: "Integrations page not accessible",
    });
    log({ step: 1, action: "navigate-to-integrations", status: "error", error: err.message });
  }

  // Step 2: Open Composio integration
  try {
    log({ step: 2, action: "open-composio", status: "start" });
    await stagehand.act("Click on the Composio integration card or button to open its setup page");
    await page.waitForTimeout(1500);

    const snap2 = await screenshot("composio-setup-page");
    const state2 = await stagehand.extract({
      instruction: "Extract the Composio setup page: what configuration options are available? Is there an API key field? Are there OAuth or connection buttons? What services can be connected through Composio?",
      schema: {
        type: "object",
        properties: {
          setupPageVisible: { type: "boolean" },
          hasApiKeyField: { type: "boolean" },
          hasOAuthButton: { type: "boolean" },
          availableServices: { type: "array", items: { type: "string" } },
          connectionStatus: { type: "string" },
          configOptions: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score2 = await judge("Open Composio integration setup", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "open-composio", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "open-composio",
      error: err.message,
      severity: "P1",
      description: "Composio integration setup not accessible",
    });
    log({ step: 2, action: "open-composio", status: "error", error: err.message });
  }

  // Step 3: Attempt API connection
  try {
    log({ step: 3, action: "attempt-api-connection", status: "start" });
    await stagehand.act("Click the 'Connect' button, OAuth sign-in, or enter API credentials to initiate a Composio connection");
    await page.waitForTimeout(3000);

    const snap3 = await screenshot("composio-connection-attempt");
    const state3 = await stagehand.extract({
      instruction: "Extract the connection attempt result: did an OAuth window or form appear? Is there a loading state? Was the connection successful or did it show an error? What feedback is given?",
      schema: {
        type: "object",
        properties: {
          connectionAttempted: { type: "boolean" },
          oauthWindowAppeared: { type: "boolean" },
          loadingState: { type: "boolean" },
          connectionResult: { type: "string" },
          errorMessage: { type: "string" },
          feedbackGiven: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("Attempt Composio API connection", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "attempt-api-connection", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "attempt-api-connection",
      error: err.message,
      severity: "P1",
      description: "API connection attempt failed or no feedback given",
    });
    log({ step: 3, action: "attempt-api-connection", status: "error", error: err.message });
  }

  // Step 4: Verify connected services
  try {
    log({ step: 4, action: "verify-services", status: "start" });
    await stagehand.act("Check the Composio integration status page for any connected services or available actions");
    await page.waitForTimeout(1500);

    const snap4 = await screenshot("composio-connected-services");
    const state4 = await stagehand.extract({
      instruction: "Extract the connected services state: what services are connected (if any)? What actions are available through the integration? Is there a test or health check option?",
      schema: {
        type: "object",
        properties: {
          connectedServices: { type: "array", items: { type: "string" } },
          availableActions: { type: "array", items: { type: "string" } },
          hasTestButton: { type: "boolean" },
          hasHealthCheck: { type: "boolean" },
          integrationHealthy: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Verify Composio connected services", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "verify-services", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "verify-services",
      error: err.message,
      severity: "P2",
      description: "Connected services verification failed",
    });
    log({ step: 4, action: "verify-services", status: "error", error: err.message });
  }

  // Step 5: Test data flow
  try {
    log({ step: 5, action: "test-data-flow", status: "start" });
    await stagehand.act("If a test button is available, click it. Otherwise, go to chat and ask the AI to use a Composio-connected service");
    await page.waitForTimeout(3000);

    const snap5 = await screenshot("composio-data-flow");
    const state5 = await stagehand.extract({
      instruction: "Extract the data flow test result: did data flow through the integration? Was there a successful API call? Is the response data visible? Were there any errors or timeouts?",
      schema: {
        type: "object",
        properties: {
          dataFlowSuccessful: { type: "boolean" },
          apiCallMade: { type: "boolean" },
          responseDataVisible: { type: "boolean" },
          errors: { type: "array", items: { type: "string" } },
          latency: { type: "string" },
        },
      },
    });

    const score5 = await judge("Test Composio data flow", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "test-data-flow", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, Composio integration ${state5.dataFlowSuccessful ? "works end-to-end" : "data flow has issues"}. Setup flow: ${results.bugs.some((b) => b.step === 2) ? "confusing" : "clear"}. API connection: ${results.bugs.some((b) => b.step === 3) ? "failed to connect" : "connection process smooth"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "test-data-flow",
      error: err.message,
      severity: "P1",
      description: "Data flow test failed",
    });
    log({ step: 5, action: "test-data-flow", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "composio",
  displayName: "Composio Integration",
  estimatedMinutes: 5,
  requiresAuth: true,
};
