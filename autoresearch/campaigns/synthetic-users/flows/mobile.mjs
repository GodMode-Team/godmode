/**
 * Flow: mobile
 * Tests responsive layouts at 375x812 (iPhone) viewport: navigate all tabs,
 * verify touch-friendly layout, and check no overflow
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

  // Step 1: Set mobile viewport
  try {
    log({ step: 1, action: "set-mobile-viewport", status: "start" });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const snap1 = await screenshot("mobile-landing");
    const state1 = await stagehand.extract({
      instruction: "Extract the mobile layout state: does the page render correctly at 375x812? Is there a hamburger menu or mobile navigation? Are elements properly sized for touch? Is there any horizontal overflow or scrollbar?",
      schema: {
        type: "object",
        properties: {
          rendersCorrectly: { type: "boolean" },
          hasMobileNav: { type: "boolean" },
          hasHamburgerMenu: { type: "boolean" },
          touchFriendlySizing: { type: "boolean" },
          hasHorizontalOverflow: { type: "boolean" },
          viewportWidth: { type: "number" },
        },
      },
    });

    // Check for horizontal overflow programmatically
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    const score1 = await judge("Set mobile viewport and verify initial layout", { ...state1, programmaticOverflowCheck: hasOverflow }, snap1);
    results.scores.push(score1);

    if (hasOverflow) {
      results.bugs.push({
        step: 1,
        action: "set-mobile-viewport",
        error: "Horizontal overflow detected at 375px width",
        severity: "P1",
        description: `Page scrollWidth exceeds clientWidth at mobile viewport`,
      });
    }

    log({ step: 1, action: "set-mobile-viewport", status: "done", state: { ...state1, hasOverflow } });
  } catch (err) {
    results.bugs.push({
      step: 1,
      action: "set-mobile-viewport",
      error: err.message,
      severity: "P1",
      description: "Failed to render at mobile viewport",
    });
    log({ step: 1, action: "set-mobile-viewport", status: "error", error: err.message });
  }

  // Step 2: Navigate through main tabs on mobile
  try {
    log({ step: 2, action: "navigate-mobile-tabs", status: "start" });

    // Open mobile nav if hamburger exists
    await stagehand.act("If there is a hamburger menu or mobile navigation toggle, click it to open the navigation");
    await page.waitForTimeout(1000);

    const snap2a = await screenshot("mobile-nav-open");
    const state2a = await stagehand.extract({
      instruction: "Extract the mobile navigation: what tabs/links are visible? Is the navigation fullscreen or a sidebar? Are all main sections accessible?",
      schema: {
        type: "object",
        properties: {
          navOpen: { type: "boolean" },
          visibleTabs: { type: "array", items: { type: "string" } },
          navStyle: { type: "string" },
          allSectionsAccessible: { type: "boolean" },
        },
      },
    });

    // Navigate to a few tabs
    await stagehand.act("Click on the 'Today' or first available tab in the mobile navigation");
    await page.waitForTimeout(1500);
    const snap2b = await screenshot("mobile-today-tab");

    await stagehand.act("Open the navigation again and click on 'Chat' or the chat tab");
    await page.waitForTimeout(1500);
    const snap2c = await screenshot("mobile-chat-tab");

    const state2b = await stagehand.extract({
      instruction: "Extract the mobile chat layout: is the chat input visible and usable? Is the send button large enough to tap? Is the message area taking full width?",
      schema: {
        type: "object",
        properties: {
          chatInputVisible: { type: "boolean" },
          sendButtonTappable: { type: "boolean" },
          fullWidthMessages: { type: "boolean" },
          layoutCorrect: { type: "boolean" },
        },
      },
    });

    const score2 = await judge("Navigate main tabs on mobile", { nav: state2a, chat: state2b }, snap2c);
    results.scores.push(score2);
    log({ step: 2, action: "navigate-mobile-tabs", status: "done", state: { nav: state2a, chat: state2b } });
  } catch (err) {
    results.bugs.push({
      step: 2,
      action: "navigate-mobile-tabs",
      error: err.message,
      severity: "P1",
      description: "Mobile tab navigation failed",
    });
    log({ step: 2, action: "navigate-mobile-tabs", status: "error", error: err.message });
  }

  // Step 3: Test touch target sizes
  try {
    log({ step: 3, action: "test-touch-targets", status: "start" });

    const touchTargets = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, a, input, [role="button"], [onclick]');
      const smallTargets = [];
      interactiveElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
          smallTargets.push({
            tag: el.tagName,
            text: el.textContent?.slice(0, 30),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      });
      return { totalInteractive: interactiveElements.length, smallTargets: smallTargets.slice(0, 10) };
    });

    const snap3 = await screenshot("mobile-touch-targets");
    const state3 = {
      totalInteractiveElements: touchTargets.totalInteractive,
      smallTargetCount: touchTargets.smallTargets.length,
      smallTargets: touchTargets.smallTargets,
      meetsAAGuidelines: touchTargets.smallTargets.length === 0,
    };

    const score3 = await judge("Test touch target sizes (44x44px minimum)", state3, snap3);
    results.scores.push(score3);

    if (touchTargets.smallTargets.length > 0) {
      results.bugs.push({
        step: 3,
        action: "test-touch-targets",
        error: `${touchTargets.smallTargets.length} interactive elements below 44x44px minimum`,
        severity: "P2",
        description: `Small touch targets found: ${touchTargets.smallTargets.map((t) => `${t.tag}(${t.width}x${t.height})`).join(", ")}`,
      });
    }

    log({ step: 3, action: "test-touch-targets", status: "done", state: state3 });
  } catch (err) {
    results.bugs.push({
      step: 3,
      action: "test-touch-targets",
      error: err.message,
      severity: "P2",
      description: "Touch target size testing failed",
    });
    log({ step: 3, action: "test-touch-targets", status: "error", error: err.message });
  }

  // Step 4: Test text readability and font sizes
  try {
    log({ step: 4, action: "test-readability", status: "start" });

    const fontSizes = await page.evaluate(() => {
      const textElements = document.querySelectorAll("p, span, div, li, h1, h2, h3, h4, label");
      const smallText = [];
      textElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize > 0 && fontSize < 12 && el.textContent?.trim().length > 0) {
          smallText.push({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 30),
            fontSize: fontSize,
          });
        }
      });
      return { smallTextCount: smallText.length, samples: smallText.slice(0, 5) };
    });

    const snap4 = await screenshot("mobile-readability");
    const state4 = {
      smallTextCount: fontSizes.smallTextCount,
      smallTextSamples: fontSizes.samples,
      textReadable: fontSizes.smallTextCount < 3,
    };

    const score4 = await judge("Test text readability on mobile", state4, snap4);
    results.scores.push(score4);

    if (fontSizes.smallTextCount >= 3) {
      results.bugs.push({
        step: 4,
        action: "test-readability",
        error: `${fontSizes.smallTextCount} text elements below 12px`,
        severity: "P2",
        description: "Multiple text elements too small for comfortable mobile reading",
      });
    }

    log({ step: 4, action: "test-readability", status: "done", state: state4 });
  } catch (err) {
    results.bugs.push({
      step: 4,
      action: "test-readability",
      error: err.message,
      severity: "P3",
      description: "Readability testing failed",
    });
    log({ step: 4, action: "test-readability", status: "error", error: err.message });
  }

  // Step 5: Test scrolling and content visibility
  try {
    log({ step: 5, action: "test-scrolling", status: "start" });
    await stagehand.act("Scroll down the page slowly to check for layout issues");
    await page.waitForTimeout(1000);
    await stagehand.act("Scroll back to the top");
    await page.waitForTimeout(1000);

    const snap5 = await screenshot("mobile-scroll-test");
    const state5 = await stagehand.extract({
      instruction: "Extract scrolling behavior: does vertical scrolling work smoothly? Are there any fixed elements blocking content? Is the bottom navigation or footer visible? Are there any overlapping elements?",
      schema: {
        type: "object",
        properties: {
          verticalScrollSmooth: { type: "boolean" },
          fixedElementsBlocking: { type: "boolean" },
          bottomNavVisible: { type: "boolean" },
          overlappingElements: { type: "boolean" },
          contentFullyVisible: { type: "boolean" },
        },
      },
    });

    // Check overflow on multiple pages
    const overflowChecks = await page.evaluate(() => {
      return {
        bodyOverflowX: document.body.scrollWidth > window.innerWidth,
        htmlOverflowX: document.documentElement.scrollWidth > window.innerWidth,
        bodyWidth: document.body.scrollWidth,
        windowWidth: window.innerWidth,
      };
    });

    const score5 = await judge("Test mobile scrolling and content visibility", { ...state5, ...overflowChecks }, snap5);
    results.scores.push(score5);
    log({ step: 5, action: "test-scrolling", status: "done", state: { ...state5, ...overflowChecks } });

    results.feedback.push(
      `As ${archetype.name || "a user"} on mobile (375x812), the responsive layout ${state5.contentFullyVisible ? "works well" : "has visibility issues"}. Navigation: ${results.bugs.some((b) => b.step === 2) ? "hard to use on mobile" : "accessible"}. Touch targets: ${results.bugs.some((b) => b.step === 3) ? "some elements too small" : "properly sized"}. Overflow: ${overflowChecks.bodyOverflowX ? "horizontal scroll detected" : "no overflow"}.`
    );
  } catch (err) {
    results.bugs.push({
      step: 5,
      action: "test-scrolling",
      error: err.message,
      severity: "P2",
      description: "Mobile scrolling test failed",
    });
    log({ step: 5, action: "test-scrolling", status: "error", error: err.message });
  }

  // Restore desktop viewport
  try {
    await page.setViewportSize({ width: 1280, height: 720 });
  } catch (_) {
    /* best effort restore */
  }

  return results;
}

export const meta = {
  name: "mobile",
  displayName: "Mobile Responsive",
  estimatedMinutes: 5,
  requiresAuth: true,
};
