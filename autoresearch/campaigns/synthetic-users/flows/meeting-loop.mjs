/**
 * Flow: meeting-loop
 * Tests meeting prep to follow-up pipeline: trigger meeting prep,
 * verify calendar pull, and check follow-up generation
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

  // Step 1: Trigger meeting prep
  try {
    log({ step: 1, action: "trigger-meeting-prep", status: "start" });
    await stagehand.act("Navigate to the Today tab or chat and ask to prepare for the next upcoming meeting");
    await page.waitForTimeout(1500);
    await stagehand.act(
      'Type in the chat or search: "Prepare me for my next meeting. Pull agenda, attendees, and any relevant context."'
    );
    await page.waitForTimeout(500);
    await stagehand.act("Send the message or trigger the meeting prep action");
    await page.waitForTimeout(6000);

    const snap1 = await screenshot("meeting-prep-triggered");
    const state1 = await stagehand.extract({
      instruction: "Extract the meeting prep response: did it identify a meeting? Does it show meeting details (title, time, attendees)? Is there an agenda? Are there prep notes or context?",
      schema: {
        type: "object",
        properties: {
          meetingIdentified: { type: "boolean" },
          meetingTitle: { type: "string" },
          meetingTime: { type: "string" },
          attendees: { type: "array", items: { type: "string" } },
          hasAgenda: { type: "boolean" },
          hasPrepNotes: { type: "boolean" },
          hasContext: { type: "boolean" },
        },
      },
    });

    const score1 = await judge("Trigger meeting preparation", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "trigger-meeting-prep", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "trigger-meeting-prep",
      error: err.message,
      severity: "P1",
      description: "Meeting prep trigger failed",
    });
    log({ step: 1, action: "trigger-meeting-prep", status: "error", error: err.message });
  }

  // Step 2: Verify calendar integration pull
  try {
    log({ step: 2, action: "verify-calendar-pull", status: "start" });
    const snap2 = await screenshot("meeting-calendar-data");
    const state2 = await stagehand.extract({
      instruction: "Extract whether calendar data was actually pulled: are meeting details from a calendar source? Is there evidence of a calendar integration (calendar icon, source label)? Are real calendar events shown?",
      schema: {
        type: "object",
        properties: {
          calendarDataPulled: { type: "boolean" },
          hasCalendarSource: { type: "boolean" },
          eventsFromCalendar: { type: "boolean" },
          calendarIntegrationWorking: { type: "boolean" },
          sourceLabel: { type: "string" },
        },
      },
    });

    const score2 = await judge("Verify calendar data pull", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "verify-calendar-pull", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "verify-calendar-pull",
      error: err.message,
      severity: "P1",
      description: "Calendar data pull verification failed",
    });
    log({ step: 2, action: "verify-calendar-pull", status: "error", error: err.message });
  }

  // Step 3: Review prep quality
  try {
    log({ step: 3, action: "review-prep-quality", status: "start" });
    await stagehand.act("Scroll through the meeting prep content to review its completeness");
    await page.waitForTimeout(1500);

    const snap3 = await screenshot("meeting-prep-quality");
    const state3 = await stagehand.extract({
      instruction: "Extract the prep content quality: does it include attendee backgrounds? Are there talking points? Is prior meeting context included? Are there action items from previous meetings?",
      schema: {
        type: "object",
        properties: {
          hasAttendeeInfo: { type: "boolean" },
          hasTalkingPoints: { type: "boolean" },
          hasPriorContext: { type: "boolean" },
          hasPreviousActionItems: { type: "boolean" },
          prepCompleteness: { type: "string" },
        },
      },
    });

    const score3 = await judge("Review meeting prep quality", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "review-prep-quality", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "review-prep-quality",
      error: err.message,
      severity: "P2",
      description: "Prep quality review failed",
    });
    log({ step: 3, action: "review-prep-quality", status: "error", error: err.message });
  }

  // Step 4: Trigger follow-up generation
  try {
    log({ step: 4, action: "trigger-follow-up", status: "start" });
    await stagehand.act(
      'Type in the chat: "Generate a follow-up summary for this meeting. Include action items, decisions made, and next steps."'
    );
    await page.waitForTimeout(500);
    await stagehand.act("Send the message");
    await page.waitForTimeout(6000);

    const snap4 = await screenshot("meeting-follow-up");
    const state4 = await stagehand.extract({
      instruction: "Extract the follow-up generation: was a follow-up summary created? Does it include action items, decisions, and next steps? Is it formatted as a shareable document?",
      schema: {
        type: "object",
        properties: {
          followUpGenerated: { type: "boolean" },
          hasActionItems: { type: "boolean" },
          hasDecisions: { type: "boolean" },
          hasNextSteps: { type: "boolean" },
          isShareable: { type: "boolean" },
          canExport: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Generate meeting follow-up", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "trigger-follow-up", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "trigger-follow-up",
      error: err.message,
      severity: "P1",
      description: "Follow-up generation failed",
    });
    log({ step: 4, action: "trigger-follow-up", status: "error", error: err.message });
  }

  // Step 5: Verify pipeline completeness
  try {
    log({ step: 5, action: "verify-pipeline", status: "start" });
    const snap5 = await screenshot("meeting-pipeline-complete");
    const state5 = await stagehand.extract({
      instruction: "Extract the overall meeting pipeline state: does the prep-to-follow-up pipeline feel complete? Are there gaps? Can the follow-up be sent to attendees? Are action items tracked?",
      schema: {
        type: "object",
        properties: {
          pipelineComplete: { type: "boolean" },
          gapIdentified: { type: "array", items: { type: "string" } },
          canSendToAttendees: { type: "boolean" },
          actionItemsTracked: { type: "boolean" },
          overallQuality: { type: "string" },
        },
      },
    });

    const score5 = await judge("Verify meeting pipeline completeness", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "verify-pipeline", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, the meeting loop pipeline ${state5.pipelineComplete ? "provides end-to-end meeting support" : "has gaps in the prep-to-follow-up flow"}. Calendar integration: ${results.bugs.some((b) => b.step === 2) ? "not pulling data" : "working"}. Follow-up quality: ${state5.overallQuality || "not assessed"}. Gaps: ${(state5.gapIdentified || []).join(", ") || "none identified"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "verify-pipeline",
      error: err.message,
      severity: "P2",
      description: "Pipeline completeness verification failed",
    });
    log({ step: 5, action: "verify-pipeline", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "meeting-loop",
  displayName: "Meeting Prep & Follow-Up",
  estimatedMinutes: 5,
  requiresAuth: true,
};
