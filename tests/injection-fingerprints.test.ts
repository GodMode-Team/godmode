import { describe, it, expect, beforeEach } from "vitest";
import {
  captureInjectedContext,
  countContextOverlap,
  extractFingerprints,
  clearInjectedContext,
} from "../src/lib/injection-fingerprints.js";

const SAMPLE_PERSONA = [
  "## Persistence Protocol",
  "",
  "You are resourceful and thorough. Your job is to GET THE JOB DONE.",
  "",
  "### Core Principles:",
  "- **Be diligent first time.** It is more token-efficient to search deeply and get it right.",
  "- **Exhaust reasonable options.** If something fails, try alternative approaches.",
  '- **Never say "I can\'t."** Instead: "I tried X, Y, and Z but I\'m stuck."',
  "- **Assume capability exists.** GodMode likely has the skill, tool, memory, or RPC.",
  "- **Be token-efficient.** One thorough, well-researched response beats four shallow ones.",
  "",
  "## Core Behaviors",
  "",
  "- Bias toward action: solve problems, don't list options or ask permission.",
  "- Investigate before asking: read files, search, run commands, call APIs.",
  "- Own technical decisions: make the call and explain it, don't punt to the user.",
].join("\n");

const SAMPLE_CONSCIOUSNESS = [
  "# Atlas Consciousness — Current Awareness",
  "",
  "Last updated: 2026-03-04T14:30:00Z",
  "",
  "## Schedule Today",
  "- 10:00 AM: Team standup",
  "- 2:00 PM: Product review with Alex",
  "",
  "## Tasks",
  "- 3 pending, 1 overdue, 2 completed today",
  "",
  "## Current Focus",
  "Working on mega bug fix push for GodMode stability.",
].join("\n");

const FULL_INJECTION = SAMPLE_PERSONA + "\n\n---\n\n" + SAMPLE_CONSCIOUSNESS;

describe("captureInjectedContext + countContextOverlap", () => {
  beforeEach(() => {
    clearInjectedContext("test-session");
  });

  it("captures context and detects full verbatim echo", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    // Echoing the full injection text should produce many hits
    const hits = countContextOverlap("test-session", FULL_INJECTION);
    expect(hits).toBeGreaterThanOrEqual(10);
  });

  it("detects partial echo (just the persona block)", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    const hits = countContextOverlap("test-session", SAMPLE_PERSONA);
    expect(hits).toBeGreaterThanOrEqual(3);
  });

  it("detects partial echo (consciousness only)", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    const hits = countContextOverlap("test-session", SAMPLE_CONSCIOUSNESS);
    expect(hits).toBeGreaterThanOrEqual(3);
  });

  it("does NOT trigger on normal user conversation", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    const normalChat =
      "Sure, I'll help you with that task. Let me search for the file and check its contents. " +
      "I found the configuration and it looks correct. Would you like me to make any changes?";
    const hits = countContextOverlap("test-session", normalChat);
    expect(hits).toBeLessThan(3);
  });

  it("does NOT trigger on user saying 'you are resourceful'", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    const userMsg = "I think you are resourceful, but can you help me fix this bug?";
    const hits = countContextOverlap("test-session", userMsg);
    expect(hits).toBeLessThan(3);
  });

  it("does NOT trigger on user discussing 'core principles' in business context", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    const businessChat =
      "Our company's core principles include transparency, innovation, and customer focus. " +
      "We need to review our enforcement policies for Q2. The team should bias toward action.";
    const hits = countContextOverlap("test-session", businessChat);
    expect(hits).toBeLessThan(3);
  });

  it("DOES trigger when model echoes 80+ chars of contiguous system text", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    // Take a 120-char substring from the middle of the persona
    const leaked = SAMPLE_PERSONA.substring(100, 300);
    const response = "Here are my instructions: " + leaked + " ...and that's what I follow.";
    const hits = countContextOverlap("test-session", response);
    expect(hits).toBeGreaterThanOrEqual(3);
  });

  it("returns 0 when no context was captured", () => {
    const hits = countContextOverlap("nonexistent-session", FULL_INJECTION);
    expect(hits).toBe(0);
  });

  it("returns 0 for very short output", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    const hits = countContextOverlap("test-session", "hello");
    expect(hits).toBe(0);
  });

  it("handles different sessions independently", () => {
    captureInjectedContext("session-a", "Session A has unique content about quantum computing and nanotechnology.");
    captureInjectedContext("session-b", FULL_INJECTION);

    // Session B's context should not trigger for session A
    const hitsA = countContextOverlap("session-a", FULL_INJECTION);
    expect(hitsA).toBeLessThan(3);

    // But should trigger for session B
    const hitsB = countContextOverlap("session-b", FULL_INJECTION);
    expect(hitsB).toBeGreaterThanOrEqual(3);
  });
});

describe("extractFingerprints", () => {
  beforeEach(() => {
    clearInjectedContext("test-session");
  });

  it("extracts fingerprints from captured context", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    const fps = extractFingerprints("test-session");
    expect(fps.length).toBeGreaterThan(0);
    expect(fps.length).toBeLessThanOrEqual(20);
    // Each fingerprint should be at least 30 chars
    for (const fp of fps) {
      expect(fp.length).toBeGreaterThanOrEqual(30);
    }
  });

  it("returns empty array when no context captured", () => {
    const fps = extractFingerprints("nonexistent");
    expect(fps).toEqual([]);
  });
});

describe("clearInjectedContext", () => {
  it("removes captured context", () => {
    captureInjectedContext("test-session", FULL_INJECTION);
    expect(countContextOverlap("test-session", FULL_INJECTION)).toBeGreaterThan(0);
    clearInjectedContext("test-session");
    expect(countContextOverlap("test-session", FULL_INJECTION)).toBe(0);
  });
});
