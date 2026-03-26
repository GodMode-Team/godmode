/**
 * Flow: memory
 * Tests memory persistence and cross-session recall
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

  const uniqueFact = `My favorite project codename is Neptune-${loop}-${Date.now() % 10000}`;

  // Step 1: Navigate to chat and tell AI a unique fact
  try {
    log({ step: 1, action: "tell-unique-fact", status: "start" });
    await stagehand.act("Click on the Chat tab or navigate to the chat interface");
    await page.waitForTimeout(1500);
    await stagehand.act(
      `Type in the chat: "Remember this important fact about me: ${uniqueFact}. Please confirm you've stored this in your memory."`
    );
    await page.waitForTimeout(500);
    await stagehand.act("Send the message");
    await page.waitForTimeout(5000);

    const snap1 = await screenshot("memory-tell-fact");
    const state1 = await stagehand.extract({
      instruction: "Extract the AI response: did it acknowledge storing the memory? Does it repeat the fact back? Is there any indication that memory was saved (e.g., a memory indicator, save confirmation)?",
      schema: {
        type: "object",
        properties: {
          acknowledged: { type: "boolean" },
          repeatedFact: { type: "boolean" },
          memorySaveIndicator: { type: "boolean" },
          responseContent: { type: "string" },
        },
      },
    });

    const score1 = await judge("Tell AI a unique fact for memory storage", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "tell-unique-fact", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "tell-unique-fact",
      error: err.message,
      severity: "P1",
      description: "Failed to communicate fact for memory storage",
    });
    log({ step: 1, action: "tell-unique-fact", status: "error", error: err.message });
  }

  // Step 2: Verify immediate recall
  try {
    log({ step: 2, action: "verify-immediate-recall", status: "start" });
    await stagehand.act(
      'Type in the chat: "What is my favorite project codename that I just told you about?"'
    );
    await page.waitForTimeout(500);
    await stagehand.act("Send the message");
    await page.waitForTimeout(5000);

    const snap2 = await screenshot("memory-immediate-recall");
    const state2 = await stagehand.extract({
      instruction: `Extract whether the AI correctly recalls the fact. The correct answer should include "Neptune". Does the response contain the correct project codename? Is the recall accurate?`,
      schema: {
        type: "object",
        properties: {
          recalledCorrectly: { type: "boolean" },
          responseContainsFact: { type: "boolean" },
          responseContent: { type: "string" },
          confidence: { type: "string" },
        },
      },
    });

    const score2 = await judge("Verify immediate memory recall", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "verify-immediate-recall", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "verify-immediate-recall",
      error: err.message,
      severity: "P1",
      description: "Immediate memory recall failed",
    });
    log({ step: 2, action: "verify-immediate-recall", status: "error", error: err.message });
  }

  // Step 3: Start a new conversation
  try {
    log({ step: 3, action: "start-new-conversation", status: "start" });
    await stagehand.act("Start a new chat conversation by clicking 'New Chat', 'New Conversation', or the '+' button");
    await page.waitForTimeout(2000);

    const snap3 = await screenshot("memory-new-conversation");
    const state3 = await stagehand.extract({
      instruction: "Extract whether a new conversation was started: is the chat empty? Is the previous conversation cleared? Is the conversation ID or title different?",
      schema: {
        type: "object",
        properties: {
          newConversationStarted: { type: "boolean" },
          chatEmpty: { type: "boolean" },
          previousCleared: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("Start new conversation for cross-session test", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "start-new-conversation", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "start-new-conversation",
      error: err.message,
      severity: "P2",
      description: "Could not start new conversation",
    });
    log({ step: 3, action: "start-new-conversation", status: "error", error: err.message });
  }

  // Step 4: Test cross-conversation memory
  try {
    log({ step: 4, action: "test-cross-conversation-memory", status: "start" });
    await stagehand.act(
      'Type in the chat: "Do you remember my favorite project codename? What is it?"'
    );
    await page.waitForTimeout(500);
    await stagehand.act("Send the message");
    await page.waitForTimeout(5000);

    const snap4 = await screenshot("memory-cross-conversation");
    const state4 = await stagehand.extract({
      instruction: `Extract whether the AI recalls the fact from the previous conversation. The correct codename starts with "Neptune". Does it remember? Is the recall accurate? Does it mention memory or previous conversations?`,
      schema: {
        type: "object",
        properties: {
          recalledFromPreviousConversation: { type: "boolean" },
          responseContainsFact: { type: "boolean" },
          mentionsMemory: { type: "boolean" },
          responseContent: { type: "string" },
        },
      },
    });

    const score4 = await judge("Test cross-conversation memory recall", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "test-cross-conversation-memory", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "test-cross-conversation-memory",
      error: err.message,
      severity: "P1",
      description: "Cross-conversation memory recall failed",
    });
    log({ step: 4, action: "test-cross-conversation-memory", status: "error", error: err.message });
  }

  // Step 5: Check memory management UI
  try {
    log({ step: 5, action: "check-memory-ui", status: "start" });
    await stagehand.act("Navigate to a memory management page, memory settings, or look for a 'Memory' section that shows stored memories");
    await page.waitForTimeout(2000);

    const snap5 = await screenshot("memory-management-ui");
    const state5 = await stagehand.extract({
      instruction: "Extract the memory management UI: is there a list of stored memories? Can memories be viewed, edited, or deleted? Is the fact we stored visible in the memory list? How many total memories are stored?",
      schema: {
        type: "object",
        properties: {
          memoryUIVisible: { type: "boolean" },
          storedMemoryCount: { type: "number" },
          canViewMemories: { type: "boolean" },
          canEditMemories: { type: "boolean" },
          canDeleteMemories: { type: "boolean" },
          ourFactVisible: { type: "boolean" },
        },
      },
    });

    const score5 = await judge("Check memory management UI", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "check-memory-ui", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, memory persistence ${state5.ourFactVisible ? "correctly stores facts" : "stored fact not visible in memory UI"}. Cross-conversation recall: ${results.bugs.some((b) => b.step === 4) ? "does not persist across conversations" : "works across conversations"}. Memory management: ${state5.memoryUIVisible ? "has dedicated UI" : "no memory management interface found"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "check-memory-ui",
      error: err.message,
      severity: "P2",
      description: "Memory management UI not found or inaccessible",
    });
    log({ step: 5, action: "check-memory-ui", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "memory",
  displayName: "Memory Persistence",
  estimatedMinutes: 5,
  requiresAuth: true,
};
