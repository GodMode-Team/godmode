/**
 * Tests for comms-tier.ts — tiered permission classifier for outbound actions.
 * Validates intent parsing, action classification, and tier explanations.
 */

import { describe, it, expect } from "vitest";
import { parseIntent, classifyAction, tierExplanation } from "../src/lib/comms-tier.js";

describe("parseIntent", () => {
  it("returns draft when messages contain draft signals", () => {
    expect(parseIntent(["draft a reply to him"])).toBe("draft");
    expect(parseIntent(["prepare the email"])).toBe("draft");
    // "don't send it yet" matches both draft ("don't send") and send ("send it") → ambiguous
    expect(parseIntent(["don't send it yet"])).toBe("ambiguous");
    expect(parseIntent(["compose a response"])).toBe("draft");
  });

  it("returns send when messages contain send signals", () => {
    expect(parseIntent(["send it"])).toBe("send");
    expect(parseIntent(["fire away"])).toBe("send");
    expect(parseIntent(["ship it"])).toBe("send");
  });

  it("returns ambiguous when no signals detected", () => {
    expect(parseIntent(["what time is the meeting"])).toBe("ambiguous");
    expect(parseIntent([])).toBe("ambiguous");
  });

  it("resolves mixed signals by count", () => {
    // More send signals than draft
    expect(parseIntent(["send it now, go ahead"])).toBe("send");
    // More draft signals than send
    expect(parseIntent(["draft the reply, compose it, don't send"])).toBe("draft");
  });

  it("only looks at last 3 messages", () => {
    const msgs = ["old context", "send it", "actually draft it", "prepare it"];
    expect(parseIntent(msgs)).toBe("draft");
  });
});

describe("classifyAction", () => {
  it("returns free for GET requests", () => {
    expect(classifyAction("https://api.example.com/data", "GET")).toBe("free");
    expect(classifyAction("https://api.example.com/data", "HEAD")).toBe("free");
    expect(classifyAction("https://api.example.com/data", "OPTIONS")).toBe("free");
  });

  it("returns free for empty method (read-only tool)", () => {
    expect(classifyAction("some-tool", "")).toBe("free");
  });

  it("returns draft for Front API POST with no send intent", () => {
    expect(classifyAction("https://api2.frontapp.com/conversations/123/drafts", "POST")).toBe("draft");
  });

  it("returns approval for Front API POST when user says send", () => {
    expect(classifyAction("https://api2.frontapp.com/conversations/123/messages", "POST", ["send it"])).toBe("approval");
  });

  it("returns draft for Gmail POST by default", () => {
    expect(classifyAction("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", "POST")).toBe("draft");
  });

  it("returns approval for Slack POST (no draft support)", () => {
    expect(classifyAction("https://slack.com/api/chat.postMessage", "POST")).toBe("approval");
  });

  it("returns approval for Twitter/X POST", () => {
    expect(classifyAction("https://api.twitter.com/2/tweets", "POST")).toBe("approval");
    expect(classifyAction("https://api.x.com/2/tweets", "POST")).toBe("approval");
  });

  it("returns approval for unknown external service POST", () => {
    expect(classifyAction("https://api.unknown-service.com/send", "POST")).toBe("approval");
  });
});

describe("tierExplanation", () => {
  it("returns human-readable explanation for each tier", () => {
    expect(tierExplanation("free", "api.example.com")).toContain("Read-only");
    expect(tierExplanation("draft", "api2.frontapp.com")).toContain("draft");
    expect(tierExplanation("approval", "slack.com")).toContain("approval");
  });
});
