/**
 * Flow: team
 * Tests team provisioning and shared workspace features
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

  // Step 1: Navigate to Team settings
  try {
    log({ step: 1, action: "navigate-to-team", status: "start" });
    await stagehand.act("Click on 'Team', 'Members', or navigate to the team management section");
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("team-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the team management layout: is a team member list visible? How many members are there? What roles are shown? Is there an 'Invite' or 'Add Member' button?",
      schema: {
        type: "object",
        properties: {
          teamPageVisible: { type: "boolean" },
          memberCount: { type: "number" },
          memberRoles: { type: "array", items: { type: "string" } },
          hasInviteButton: { type: "boolean" },
          hasPermissionsPanel: { type: "boolean" },
        },
      },
    });

    const score1 = await judge("Navigate to Team management", state1, snap1);
    results.scores.push(score1);
    log({ step: 1, action: "navigate-to-team", status: "done", state: state1 });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "navigate-to-team",
      error: err.message,
      severity: "P0",
      description: "Team management section not accessible",
    });
    log({ step: 1, action: "navigate-to-team", status: "error", error: err.message });
  }

  // Step 2: Attempt to add a team member
  try {
    log({ step: 2, action: "add-team-member", status: "start" });
    await stagehand.act("Click 'Invite', 'Add Member', or the invite button to add a new team member");
    await page.waitForTimeout(1500);
    await stagehand.act('Enter an email address like "testuser@example.com" in the invite form');
    await page.waitForTimeout(500);

    const snap2 = await screenshot("team-add-member");
    const state2 = await stagehand.extract({
      instruction: "Extract the invite form state: is the invite dialog open? Can a role be selected? What role options are available (admin, editor, viewer)? Is there a message field?",
      schema: {
        type: "object",
        properties: {
          inviteDialogOpen: { type: "boolean" },
          emailEntered: { type: "boolean" },
          roleOptions: { type: "array", items: { type: "string" } },
          hasMessageField: { type: "boolean" },
          canSendInvite: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Initiate team member invitation", state2, snap2);
    results.scores.push(score2);
    log({ step: 2, action: "add-team-member", status: "done", state: state2 });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "add-team-member",
      error: err.message,
      severity: "P1",
      description: "Team member invitation flow failed",
    });
    log({ step: 2, action: "add-team-member", status: "error", error: err.message });
  }

  // Step 3: Set permissions
  try {
    log({ step: 3, action: "set-permissions", status: "start" });
    await stagehand.act("Select a role for the team member, choosing 'Editor' or a mid-level permission role");
    await page.waitForTimeout(500);
    await stagehand.act("Send the invitation or save the team member");
    await page.waitForTimeout(2000);

    const snap3 = await screenshot("team-permissions-set");
    const state3 = await stagehand.extract({
      instruction: "Extract the permission setting result: was the invitation sent? What role was assigned? Is there a confirmation message? Is the pending invite visible in the member list?",
      schema: {
        type: "object",
        properties: {
          inviteSent: { type: "boolean" },
          assignedRole: { type: "string" },
          confirmationShown: { type: "boolean" },
          pendingInviteVisible: { type: "boolean" },
        },
      },
    });

    const score3 = await judge("Set permissions and send invitation", state3, snap3);
    results.scores.push(score3);
    log({ step: 3, action: "set-permissions", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "set-permissions",
      error: err.message,
      severity: "P1",
      description: "Permission setting or invite sending failed",
    });
    log({ step: 3, action: "set-permissions", status: "error", error: err.message });
  }

  // Step 4: Verify access controls
  try {
    log({ step: 4, action: "verify-access", status: "start" });
    await stagehand.act("Click on an existing team member to view or edit their permissions");
    await page.waitForTimeout(1500);

    const snap4 = await screenshot("team-access-controls");
    const state4 = await stagehand.extract({
      instruction: "Extract access control details: what permissions does this member have? Can permissions be modified? Are there workspace-specific access controls? Is there an option to remove the member?",
      schema: {
        type: "object",
        properties: {
          permissionsVisible: { type: "boolean" },
          currentPermissions: { type: "array", items: { type: "string" } },
          canModifyPermissions: { type: "boolean" },
          hasWorkspaceAccess: { type: "boolean" },
          canRemoveMember: { type: "boolean" },
        },
      },
    });

    const score4 = await judge("Verify access controls for team member", state4, snap4);
    results.scores.push(score4);
    log({ step: 4, action: "verify-access", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "verify-access",
      error: err.message,
      severity: "P2",
      description: "Access control verification failed",
    });
    log({ step: 4, action: "verify-access", status: "error", error: err.message });
  }

  // Step 5: Test shared workspace features
  try {
    log({ step: 5, action: "test-shared-workspace", status: "start" });
    await stagehand.act("Navigate to a shared workspace or look for collaboration features (shared documents, activity feed, comments)");
    await page.waitForTimeout(2000);

    const snap5 = await screenshot("team-shared-workspace");
    const state5 = await stagehand.extract({
      instruction: "Extract shared workspace features: is there a shared activity feed? Are there collaboration indicators (who's online, recent activity)? Can team members co-edit or comment?",
      schema: {
        type: "object",
        properties: {
          sharedFeaturesVisible: { type: "boolean" },
          hasActivityFeed: { type: "boolean" },
          hasPresenceIndicators: { type: "boolean" },
          hasComments: { type: "boolean" },
          hasCoEditing: { type: "boolean" },
          collaborationFeatures: { type: "array", items: { type: "string" } },
        },
      },
    });

    const score5 = await judge("Test shared workspace collaboration features", state5, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "test-shared-workspace", status: "done", state: state5 });

    results.feedback.push(
      `As ${archetype.name || "a user"}, team management ${results.bugs.some((b) => b.step === 2 || b.step === 3) ? "has invitation workflow issues" : "invitation flow works well"}. Permissions: ${results.bugs.some((b) => b.step === 4) ? "access controls need improvement" : "granular and functional"}. Collaboration: ${state5.sharedFeaturesVisible ? "shared features present" : "collaboration features limited"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "test-shared-workspace",
      error: err.message,
      severity: "P2",
      description: "Shared workspace features not accessible",
    });
    log({ step: 5, action: "test-shared-workspace", status: "error", error: err.message });
  }

  return results;
}

export const meta = {
  name: "team",
  displayName: "Team Management",
  estimatedMinutes: 5,
  requiresAuth: true,
};
