/**
 * Flow: second-brain
 * Tests Second Brain: search functionality, vault health, and knowledge retrieval
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

  // Step 1: Navigate to Second Brain
  try {
    log({ step: 1, action: "navigate-to-second-brain", status: "start" });
    await stagehand.act("Click on the 'Second Brain' tab or navigate to the knowledge base section");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("second-brain-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the Second Brain layout: is there a search bar? Is a vault or knowledge repository visible? What categories or collections are shown? Is there a health indicator?",
      schema: {
        type: "object",
        properties: {
          searchBarVisible: { type: "boolean" },
          vaultVisible: { type: "boolean" },
          categories: { type: "array", items: { type: "string" } },
          itemCount: { type: "number" },
          hasHealthIndicator: { type: "boolean" },
        },
      },
    });

    const score1 = await judge("Navigate to Second Brain", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-second-brain", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-second-brain",
      error: err.message,
      severity: "P0",
      description: "Second Brain section not accessible",
    });
    log({ step: 1, action: "navigate-to-second-brain", status: "error", error: err.message });
  }

  // Step 2: Search for a term
  try {
    log({ step: 2, action: "search-term", status: "start" });
    const searchTerm = archetype.domain || "project management";
    await stagehand.act(`Click on the search bar and type "${searchTerm}"`);
    await page.waitForTimeout(500);
    await stagehand.act("Press Enter or click the search button to execute the search");
    await page.waitForTimeout(3000);

    const snap2 = await screenshot("second-brain-search-results");
    const state2 = await stagehand.extract({
      instruction: "Extract search results: how many results were found? Are results relevant to the search term? Do results show titles, snippets, and sources? Is there a filter or sort option?",
      schema: {
        type: "object",
        properties: {
          resultCount: { type: "number" },
          resultsRelevant: { type: "boolean" },
          showsTitles: { type: "boolean" },
          showsSnippets: { type: "boolean" },
          showsSources: { type: "boolean" },
          hasFilters: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Search for term in Second Brain", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "search-term", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "search-term",
      error: err.message,
      severity: "P1",
      description: "Search functionality broken or unresponsive",
    });
    log({ step: 2, action: "search-term", status: "error", error: err.message });
  }

  // Step 3: Open a search result
  try {
    log({ step: 3, action: "open-result", status: "start" });
    await stagehand.act("Click on the first search result to view its full content");
    await page.waitForTimeout(2000);

    const snap3 = await screenshot("second-brain-result-detail");
    const state3 = await stagehand.extract({
      instruction: "Extract the detail view: is the full content displayed? Are there metadata fields (date, source, tags)? Can the content be edited? Are there related items shown?",
      schema: {
        type: "object",
        properties: {
          contentDisplayed: { type: "boolean" },
          hasMetadata: { type: "boolean" },
          isEditable: { type: "boolean" },
          hasRelatedItems: { type: "boolean" },
          contentLength: { type: "number" },
        },
      },
    });

    const score3 = await judge("Open search result detail view", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "open-result", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "open-result",
      error: err.message,
      severity: "P2",
      description: "Could not open search result detail",
    });
    log({ step: 3, action: "open-result", status: "error", error: err.message });
  }

  // Step 4: Check vault health / status
  try {
    log({ step: 4, action: "check-vault-health", status: "start" });
    await stagehand.act("Navigate back to the Second Brain main view and look for a vault health indicator, status panel, or storage metrics");
    await page.waitForTimeout(1500);

    const snap4 = await screenshot("second-brain-vault-health");
    const state4 = await stagehand.extract({
      instruction: "Extract vault health information: is there a health score or status? What is the storage usage? Are there any warnings or issues? How many total items are in the vault?",
      schema: {
        type: "object",
        properties: {
          healthScoreVisible: { type: "boolean" },
          healthScore: { type: "string" },
          storageUsage: { type: "string" },
          warnings: { type: "array", items: { type: "string" } },
          totalItems: { type: "number" },
        },
      },
    });

    const score4 = await judge("Check vault health status", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "check-vault-health", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "check-vault-health",
      error: err.message,
      severity: "P3",
      description: "Vault health indicator not found or inaccessible",
    });
    log({ step: 4, action: "check-vault-health", status: "error", error: err.message });
  }

  // Step 5: Test knowledge retrieval with semantic query
  try {
    log({ step: 5, action: "semantic-retrieval", status: "start" });
    const semanticQuery = archetype.domain
      ? `What do I know about best practices for ${archetype.domain}?`
      : "What are my notes about productivity techniques?";

    await stagehand.act(`Search for: "${semanticQuery}"`);
    await page.waitForTimeout(3000);

    const snap5 = await screenshot("second-brain-semantic");
    const state5 = await stagehand.extract({
      instruction: "Extract the semantic search results: did it return relevant knowledge? Are results ranked by relevance? Is there a confidence or similarity score? Does it pull from multiple sources?",
      schema: {
        type: "object",
        properties: {
          resultsReturned: { type: "boolean" },
          resultCount: { type: "number" },
          hasRelevanceRanking: { type: "boolean" },
          hasConfidenceScore: { type: "boolean" },
          multipleSourceTypes: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Semantic knowledge retrieval", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "semantic-retrieval", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the Second Brain ${state5.resultsReturned ? "retrieves knowledge effectively" : "returned no results for semantic queries"}. Search quality: ${state5.hasRelevanceRanking ? "well-ranked" : "unranked"}. Vault contains ${state5.resultCount || 0} relevant items.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "semantic-retrieval",
      error: err.message,
      severity: "P1",
      description: "Semantic knowledge retrieval failed",
    });
    log({ step: 5, action: "semantic-retrieval", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "second-brain",
  displayName: "Second Brain",
  estimatedMinutes: 5,
  requiresAuth: true,
};
