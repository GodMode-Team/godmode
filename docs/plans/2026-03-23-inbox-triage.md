# Inbox Triage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce inbox noise from 460 firehose items to ~30-50 actionable ones by gating what enters the inbox and auto-archiving stale items.

**Architecture:** Add a `shouldInbox()` gate function in `src/services/inbox.ts` that checks persona trust score + queue item type before allowing an item into the inbox. Routine work from high-trust personas skips inbox (auto-completes). Creative/research/strategic work always lands. Stale pending items (>7 days) get swept on each `inbox.list` call. New `inbox.purgeStale` RPC lets the user flush old items.

**Tech Stack:** TypeScript ESM, Vitest, existing trust-tracker + queue-state modules.

---

### Task 1: Write `shouldInbox()` gate — tests

**Files:**
- Create: `tests/inbox.test.ts`

**Context:**
- Queue item types are defined in `src/lib/queue-state.ts:9-19`: `coding | research | analysis | creative | review | ops | task | url | idea | optimize`
- Trust scores come from `src/methods/trust-tracker.ts:639` via `getTrustScore(workflow)` — returns `number | null` (null = not enough data, needs 10+ ratings)
- The gate should be **conservative**: when in doubt, inbox it. Only skip items from high-trust personas doing routine work.

**Triage rules:**
- **Always inbox** (regardless of trust): `project-completion` type, `creative`, `research`, `analysis`, `idea`, `review` queue types, any persona with trust score < 7 or null (not enough data)
- **Skip inbox** (auto-complete): `ops`, `task`, `url`, `optimize` queue types FROM personas with trust score ≥ 8 AND score is not null
- **Edge case**: if no persona slug → always inbox (can't look up trust)

**Step 1: Write the failing tests**

```typescript
import { describe, it, expect, vi } from "vitest";

// We'll test shouldInbox as a pure function — it takes item metadata + trust score
// and returns boolean. This avoids needing to mock the trust tracker at test time.

// Import the function (will fail until we write it)
import { shouldInbox } from "../src/services/inbox.js";

describe("shouldInbox gate", () => {
  // --- Always inbox ---

  it("inboxes project-completion items regardless of trust", () => {
    expect(shouldInbox({
      type: "project-completion",
      queueItemType: undefined,
      personaSlug: "research-agent",
      trustScore: 9.5,
    })).toBe(true);
  });

  it("inboxes creative queue items even from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "creative",
      personaSlug: "content-writer",
      trustScore: 9.0,
    })).toBe(true);
  });

  it("inboxes research queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "research",
      personaSlug: "research-agent",
      trustScore: 8.5,
    })).toBe(true);
  });

  it("inboxes analysis queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "analysis",
      personaSlug: "analyst",
      trustScore: 9.0,
    })).toBe(true);
  });

  it("inboxes idea queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "idea",
      personaSlug: "explorer",
      trustScore: 8.0,
    })).toBe(true);
  });

  it("inboxes review queue items", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "review",
      personaSlug: "reviewer",
      trustScore: 9.0,
    })).toBe(true);
  });

  it("inboxes items with no persona (can't look up trust)", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: undefined,
      trustScore: null,
    })).toBe(true);
  });

  it("inboxes items from low-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: "new-agent",
      trustScore: 5.0,
    })).toBe(true);
  });

  it("inboxes items from personas with null trust (not enough ratings)", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "task",
      personaSlug: "new-agent",
      trustScore: null,
    })).toBe(true);
  });

  it("inboxes ops items from personas at exactly trust 7.9 (below threshold)", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: "ops-agent",
      trustScore: 7.9,
    })).toBe(true);
  });

  // --- Skip inbox (auto-complete) ---

  it("skips inbox for ops items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "ops",
      personaSlug: "ops-agent",
      trustScore: 8.5,
    })).toBe(false);
  });

  it("skips inbox for task items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "task",
      personaSlug: "task-agent",
      trustScore: 8.0,
    })).toBe(false);
  });

  it("skips inbox for url items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "url",
      personaSlug: "reader",
      trustScore: 9.0,
    })).toBe(false);
  });

  it("skips inbox for optimize items from high-trust personas", () => {
    expect(shouldInbox({
      type: "agent-execution",
      queueItemType: "optimize",
      personaSlug: "optimizer",
      trustScore: 8.2,
    })).toBe(false);
  });

  // --- Skill-run type ---

  it("always inboxes skill-run items", () => {
    expect(shouldInbox({
      type: "skill-run",
      queueItemType: undefined,
      personaSlug: undefined,
      trustScore: null,
    })).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run tests/inbox.test.ts`
Expected: FAIL — `shouldInbox` is not exported from `../src/services/inbox.js`

---

### Task 2: Implement `shouldInbox()` gate

**Files:**
- Modify: `src/services/inbox.ts` (add export + type)

**Step 1: Add the `ShouldInboxInput` type and `shouldInbox()` function**

Add this after the existing types section (after line 66) in `src/services/inbox.ts`:

```typescript
// ── Inbox triage gate ───────────────────────────────────────────

/** Queue item types that always need human review (subjective quality). */
const ALWAYS_INBOX_QUEUE_TYPES = new Set([
  "creative", "research", "analysis", "idea", "review", "coding",
]);

/** Queue item types that can skip inbox when persona is high-trust. */
const ROUTINE_QUEUE_TYPES = new Set(["ops", "task", "url", "optimize"]);

/** Minimum trust score to skip inbox for routine work. */
const TRUST_SKIP_THRESHOLD = 8;

export type ShouldInboxInput = {
  type: InboxItemType;
  queueItemType?: string;
  personaSlug?: string;
  trustScore: number | null;
};

/**
 * Decide whether a completed item should land in the inbox.
 * Conservative: when in doubt, inbox it. Only skips routine work
 * from high-trust personas.
 */
export function shouldInbox(input: ShouldInboxInput): boolean {
  // Project completions and skill runs always go to inbox
  if (input.type === "project-completion" || input.type === "skill-run") return true;

  // No persona → can't evaluate trust → inbox it
  if (!input.personaSlug) return true;

  // No trust score yet (< 10 ratings) → inbox it
  if (input.trustScore === null) return true;

  // Low trust → inbox it
  if (input.trustScore < TRUST_SKIP_THRESHOLD) return true;

  // High-trust persona — check if this is routine work
  if (input.queueItemType && ROUTINE_QUEUE_TYPES.has(input.queueItemType)) {
    return false; // Skip inbox — auto-complete
  }

  // Creative/research/analysis/idea/review/coding or unknown type → inbox
  return true;
}
```

**Step 2: Run tests to verify they pass**

Run: `pnpm vitest run tests/inbox.test.ts`
Expected: ALL PASS

**Step 3: Commit**

```bash
git add tests/inbox.test.ts src/services/inbox.ts
git commit -m "feat(inbox): add shouldInbox() triage gate with tests"
```

---

### Task 3: Wire gate into queue processor

**Files:**
- Modify: `src/services/queue-processor.ts:710-729`

**Context:**
- The queue processor calls `addInboxItem()` at line 712-727 for every completed item
- We need to call `shouldInbox()` before `addInboxItem()` and skip the add if it returns false
- Trust scores are available via `getTrustScore()` from `src/methods/trust-tracker.ts:639`
- The queue item type is available on `completedItem.type` (it's a `QueueItemType`)
- The persona slug is `personaSlug` (already in scope at line 704)

**Step 1: Write the failing test**

Add to `tests/inbox.test.ts`:

```typescript
describe("queue processor inbox gate integration", () => {
  it("documented: queue processor should check shouldInbox before addInboxItem", () => {
    // This is a documentation test — the actual wiring is in queue-processor.ts
    // Verify shouldInbox is exported and callable
    expect(typeof shouldInbox).toBe("function");
  });
});
```

(The real integration test is hard to unit test because QueueProcessor is a complex singleton. The gate is 5 lines of wiring — visual review is sufficient.)

**Step 2: Modify queue-processor.ts**

Replace the block at lines 710-729 in `src/services/queue-processor.ts`:

**Old code (lines 710-729):**
```typescript
    // Push to universal inbox — every completed item gets an entry
    const projectId = completedItem?.meta?.projectId ?? completedItem?.meta?.paperclipProjectId;
    try {
      const { addInboxItem } = await import("./inbox.js");
      await addInboxItem({
        ...
      });
    } catch (err) {
      this.logger.warn(`[GodMode][Queue] Inbox push failed for ${itemId}: ${String(err)}`);
    }
```

**New code:**
```typescript
    // Push to universal inbox — only if triage gate says it's worth reviewing
    const projectId = completedItem?.meta?.projectId ?? completedItem?.meta?.paperclipProjectId;
    try {
      const { addInboxItem, shouldInbox } = await import("./inbox.js");
      let trustScore: number | null = null;
      if (personaSlug) {
        try {
          const { getTrustScore } = await import("../methods/trust-tracker.js");
          trustScore = await getTrustScore(personaSlug);
        } catch { /* trust tracker unavailable — conservative: null → will inbox */ }
      }

      const shouldAdd = shouldInbox({
        type: "agent-execution",
        queueItemType: completedItem?.type,
        personaSlug,
        trustScore,
      });

      if (shouldAdd) {
        await addInboxItem({
          type: "agent-execution",
          title: completedItem?.title ?? itemId,
          summary: summary.slice(0, 300),
          source: {
            persona: personaSlug,
            queueItemId: itemId,
            taskId: completedItem?.sourceTaskId,
            projectId,
          },
          outputPath: outPath,
          sessionId: completedItem?.sessionId,
        });
      } else {
        this.logger.info(
          `[GodMode][Queue] Skipped inbox for ${itemId} (${personaSlug} trust=${trustScore}, type=${completedItem?.type})`,
        );
      }
    } catch (err) {
      this.logger.warn(`[GodMode][Queue] Inbox push failed for ${itemId}: ${String(err)}`);
    }
```

**Step 3: Run build to verify no type errors**

Run: `pnpm build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git add src/services/queue-processor.ts
git commit -m "feat(inbox): wire shouldInbox gate into queue processor"
```

---

### Task 4: Add stale item sweep — tests

**Files:**
- Modify: `tests/inbox.test.ts`

**Context:**
- `sweepStaleItems()` runs lazily during `listInboxItems()` — no heartbeat needed (was removed in v2 slim)
- Items pending for >7 days get auto-dismissed
- Returns count of swept items

**Step 1: Write the failing tests**

Add to `tests/inbox.test.ts`:

```typescript
import { sweepStaleItems } from "../src/services/inbox.js";

describe("sweepStaleItems", () => {
  it("is exported as a function", () => {
    expect(typeof sweepStaleItems).toBe("function");
  });

  // Note: Full integration tests require filesystem mocking.
  // The sweep logic is simple enough to verify via manual test:
  // 1. Create inbox items with old dates
  // 2. Call listInboxItems()
  // 3. Verify old items are dismissed
});
```

**Step 2: Run to verify fail**

Run: `pnpm vitest run tests/inbox.test.ts`
Expected: FAIL — `sweepStaleItems` not exported

---

### Task 5: Implement stale sweep + wire into `listInboxItems`

**Files:**
- Modify: `src/services/inbox.ts`

**Step 1: Add the sweep function**

Add before the `// ── RPC Handlers` section in `src/services/inbox.ts`:

```typescript
// ── Stale sweep ─────────────────────────────────────────────────

const STALE_DAYS = 7;
let _lastSweep = 0;
const SWEEP_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour — don't sweep on every list call

/**
 * Auto-dismiss pending items older than STALE_DAYS.
 * Runs lazily (called from listInboxItems), throttled to once per hour.
 */
export async function sweepStaleItems(): Promise<number> {
  const now = Date.now();
  if (now - _lastSweep < SWEEP_COOLDOWN_MS) return 0;
  _lastSweep = now;

  const state = await readInboxState();
  const cutoff = now - STALE_DAYS * 24 * 60 * 60 * 1000;
  let swept = 0;

  for (const item of state.items) {
    if (item.status === "pending" && new Date(item.createdAt).getTime() < cutoff) {
      item.status = "dismissed";
      swept++;
    }
  }

  if (swept > 0) {
    await writeInboxState(state);
    broadcast("inbox:update", { action: "sweep", swept, count: pendingCount(state) });
  }

  return swept;
}
```

**Step 2: Wire sweep into `listInboxItems`**

Modify the `listInboxItems` function to call sweep at the top:

```typescript
export async function listInboxItems(opts?: {
  status?: InboxItemStatus | "all";
  limit?: number;
}): Promise<{ items: InboxItem[]; total: number; pendingCount: number }> {
  // Lazy stale sweep — runs at most once per hour
  await sweepStaleItems();

  const state = await readInboxState();
  // ... rest unchanged
```

**Step 3: Run tests**

Run: `pnpm vitest run tests/inbox.test.ts`
Expected: ALL PASS

**Step 4: Run build**

Run: `pnpm build`
Expected: SUCCESS

**Step 5: Commit**

```bash
git add src/services/inbox.ts tests/inbox.test.ts
git commit -m "feat(inbox): add 7-day stale sweep on list, throttled to 1hr"
```

---

### Task 6: Add `inbox.purgeStale` RPC handler

**Files:**
- Modify: `src/services/inbox.ts` (add to `inboxHandlers`)
- Modify: `index.ts` (already registered via `...inboxHandlers`, no change needed)

**Step 1: Add purgeStale to the RPC handlers**

Add to the `inboxHandlers` object in `src/services/inbox.ts`:

```typescript
  "inbox.purgeStale": async ({ respond }: { params: Record<string, unknown>; respond: Function }) => {
    try {
      // Force sweep by resetting cooldown
      _lastSweep = 0;
      const swept = await sweepStaleItems();
      respond(true, { swept });
    } catch (err) {
      respond(false, null, { code: "INBOX_ERROR", message: String(err) });
    }
  },
```

**Step 2: Run build**

Run: `pnpm build`
Expected: SUCCESS

**Step 3: Commit**

```bash
git add src/services/inbox.ts
git commit -m "feat(inbox): add inbox.purgeStale RPC handler"
```

---

### Task 7: Build + typecheck final verification

**Step 1: Run full build**

Run: `pnpm build`
Expected: SUCCESS

**Step 2: Run full test suite**

Run: `pnpm vitest run`
Expected: ALL PASS (no regressions)

**Step 3: Final commit (if any lint/type fixes needed)**

```bash
git add -A
git commit -m "chore: fix any lint/type issues from inbox triage"
```

---

## Summary of changes

| File | Change |
|------|--------|
| `src/services/inbox.ts` | Add `shouldInbox()` gate, `sweepStaleItems()`, `inbox.purgeStale` RPC |
| `src/services/queue-processor.ts` | Wire `shouldInbox()` + `getTrustScore()` before `addInboxItem()` |
| `tests/inbox.test.ts` | New test file: 15+ tests for triage gate logic |

**What this does NOT change:**
- Ally behavior — Prosper still says "check your inbox" for items that pass the gate
- UI rendering — inbox UI is unchanged, just fewer items to show
- Existing items — the 460 items stay until the stale sweep dismisses items >7 days old, or user clicks "Mark All Complete"
- Scoring/feedback — unchanged

**Trust threshold rationale:**
- `≥ 8` trust + routine type = skip. This is conservative — 8/10 means "consistently good work."
- `< 8` or `null` = always inbox. New personas, mediocre performers, and creative work all get human review.
- Creative/research/analysis/idea/review/coding = always inbox regardless of trust. These have subjective quality.
