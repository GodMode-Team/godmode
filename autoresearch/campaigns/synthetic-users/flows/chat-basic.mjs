/**
 * Flow: chat-basic
 * Tests basic chat interactions: send message, receive response, check formatting,
 * and test simple requests for synthetic user testing campaign.
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

  // Step 1: Navigate to chat tab
  try {
    log({ step: 1, action: "navigate-to-chat", status: "start" });
    await stagehand.act("Click on the Chat tab or navigate to the chat interface");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("chat-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the chat interface state: is the chat input visible, are there any existing messages, is the send button present?",
      schema: {
        type: "object",
        properties: {
          chatInputVisible: { type: "boolean" },
          sendButtonVisible: { type: "boolean" },
          existingMessages: { type: "number" },
          placeholder: { type: "string" },
        },
      },
    });

    const score1 = await judge("Navigate to chat tab", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-chat", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-chat",
      error: err.message,
      severity: "P0",
      description: "Could not navigate to or find chat interface",
    });
    log({ step: 1, action: "navigate-to-chat", status: "error", error: err.message });
  }

  // Step 2: Send a simple question
  try {
    log({ step: 2, action: "send-simple-question", status: "start" });
    const question = archetype.domain
      ? `What are the top 3 trends in ${archetype.domain} right now?`
      : "What are the top 3 productivity tips for remote workers?";

    await stagehand.act(`Type the following message in the chat input: "${question}"`);
    await page.waitForTimeout(500);
    await stagehand.act("Click the send button or press Enter to send the message");
    await page.waitForTimeout(5000);

    const snap2 = await screenshot("chat-simple-question");
    const state2 = await stagehand.extract({
      instruction: "Extract the chat response: did a response appear? What is the response content? Is it formatted properly with paragraphs or lists? Is the response complete or still streaming?",
      schema: {
        type: "object",
        properties: {
          responseReceived: { type: "boolean" },
          responseLength: { type: "number" },
          hasFormatting: { type: "boolean" },
          isStreaming: { type: "boolean" },
          isComplete: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Send simple question and receive response", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "send-simple-question", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "send-simple-question",
      error: err.message,
      severity: "P0",
      description: "Failed to send message or receive response",
    });
    log({ step: 2, action: "send-simple-question", status: "error", error: err.message });
  }

  // Step 3: Send a content writing request
  try {
    log({ step: 3, action: "send-writing-request", status: "start" });
    await stagehand.act(
      'Type the following message in the chat input: "Write a short professional email declining a meeting invitation politely"'
    );
    await page.waitForTimeout(500);
    await stagehand.act("Send the message");
    await page.waitForTimeout(8000);

    const snap3 = await screenshot("chat-writing-response");
    const state3 = await stagehand.extract({
      instruction: "Extract the response quality: does it contain an email format with subject, greeting, body, and sign-off? Is the content appropriate and professional? How long is the response?",
      schema: {
        type: "object",
        properties: {
          hasEmailFormat: { type: "boolean" },
          hasProfessionalTone: { type: "boolean" },
          responseWordCount: { type: "number" },
          isComplete: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("Send content writing request", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "send-writing-request", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "send-writing-request",
      error: err.message,
      severity: "P1",
      description: "Content writing request failed",
    });
    log({ step: 3, action: "send-writing-request", status: "error", error: err.message });
  }

  // Step 4: Test brainstorming
  try {
    log({ step: 4, action: "brainstorming-request", status: "start" });
    await stagehand.act(
      'Type in the chat: "Brainstorm 5 creative names for a productivity app that helps teams stay focused"'
    );
    await page.waitForTimeout(500);
    await stagehand.act("Send the message");
    await page.waitForTimeout(6000);

    const snap4 = await screenshot("chat-brainstorm");
    const state4 = await stagehand.extract({
      instruction: "Extract the brainstorming response: does it contain a numbered or bulleted list? Are there at least 5 items? Does each item have an explanation?",
      schema: {
        type: "object",
        properties: {
          hasList: { type: "boolean" },
          itemCount: { type: "number" },
          hasExplanations: { type: "boolean" },
          isComplete: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Brainstorming request with list output", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "brainstorming-request", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "brainstorming-request",
      error: err.message,
      severity: "P2",
      description: "Brainstorming request failed",
    });
    log({ step: 4, action: "brainstorming-request", status: "error", error: err.message });
  }

  // Step 5: Verify message rendering and scroll
  try {
    log({ step: 5, action: "verify-rendering", status: "start" });
    await stagehand.act("Scroll up in the chat to see all previous messages");
    await page.waitForTimeout(1000);

    const snap5 = await screenshot("chat-scroll-check");
    const state5 = await stagehand.extract({
      instruction: "Extract chat rendering quality: are all messages visible when scrolling? Is there proper spacing between messages? Are user and AI messages visually distinct? Is markdown rendering correct?",
      schema: {
        type: "object",
        properties: {
          allMessagesVisible: { type: "boolean" },
          properSpacing: { type: "boolean" },
          messagesDistinct: { type: "boolean" },
          markdownRendered: { type: "boolean" },
          totalMessageCount: { type: "number" },
        },
      },
    });

    const score5 = await judge("Verify message rendering and scroll behavior", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "verify-rendering", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the basic chat experience ${state5.markdownRendered ? "renders content well" : "has rendering issues"}. Message count: ${state5.totalMessageCount || "unknown"}. Visual distinction between user and AI: ${state5.messagesDistinct ? "clear" : "unclear"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "verify-rendering",
      error: err.message,
      severity: "P2",
      description: "Chat rendering or scroll verification failed",
    });
    log({ step: 5, action: "verify-rendering", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "chat-basic",
  displayName: "Basic Chat",
  estimatedMinutes: 5,
  requiresAuth: true,
};
