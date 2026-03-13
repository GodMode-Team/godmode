# Morning Test Plan: Proof + Inbox Integration

**Date:** 2026-03-13
**Branches to review:** `feat/paperclip-proof-claude` and `feat/paperclip-proof-codex`

---

## Step 0: Compare Branches (15 min)

```bash
# See what each branch produced
git log feat/interaction-ledger-l6..feat/paperclip-proof-claude --oneline
git log feat/interaction-ledger-l6..feat/paperclip-proof-codex --oneline

# Compare lines of code added
git diff feat/interaction-ledger-l6..feat/paperclip-proof-claude --stat
git diff feat/interaction-ledger-l6..feat/paperclip-proof-codex --stat

# Check build health on each
git checkout feat/paperclip-proof-claude && pnpm build && pnpm typecheck
git checkout feat/paperclip-proof-codex && pnpm build && pnpm typecheck
```

Pick the better branch (or cherry-pick best parts). Merge winner into a clean branch.

---

## Step 1: Smoke Test Inbox (10 min)

1. Start gateway, open GodMode UI
2. Check Today tab — is there an Inbox section?
3. Queue a test agent task (any simple research task)
4. Wait for completion — does it appear in inbox?
5. Try all 4 actions: View Output, Open Chat, Complete, Dismiss
6. Score something 3/10 — does "What went wrong?" appear?
7. Type feedback, submit — check the persona file for `## Corrections`
8. Score something 10/10 — does "What was great?" appear?
9. Verify: resources do NOT appear in inbox

---

## Step 2: Smoke Test Proof (10 min)

1. In chat, ask Prosper to create a Proof doc ("write me a draft in Proof")
2. Does the Proof editor open in the sidebar?
3. Can you type in it directly?
4. Does Prosper write to it via the `proof_editor` tool?
5. Try Share button — does it copy a link?
6. Try Export to Drive button

---

## Step 3: Live Work Test — VSLs for TRP (30 min)

This is the real test. Use GodMode to actually do your work.

**Task:** Create VSL scripts for TRP

1. Open a new chat session with Prosper
2. Tell Prosper: "I need to create VSL scripts for TRP. Let's scope this out."
3. Let Prosper do discovery — answer his questions about audience, offer, tone, goals
4. When Prosper suggests delegating to the content-writer agent, approve it
5. **Watch for:**
   - Does Prosper open a Proof doc for the output?
   - Can you see the agent writing in real-time?
   - Can you jump in and edit the Proof doc while it's being written?
   - Can you steer Prosper mid-task? ("Make the hook more urgent")
6. When the agent finishes, does it land in your inbox?
7. Score it — does feedback flow work?
8. If you need revisions, tell Prosper — does he re-queue with your feedback?

**What you're testing:** The full loop — discovery → delegation → Proof co-editing → inbox → scoring → feedback

---

## Step 4: Live Work Test — Marketing Plan Brief (30 min)

**Task:** Create a marketing plan brief for GodMode

1. New session: "I need a marketing plan brief for GodMode. Let's use the project pipeline."
2. This should trigger the `project-pipeline` skill card (chief of staff pattern)
3. Prosper should do discovery first — don't let him skip it
4. Watch for the pipeline: researcher → content-writer → seo-specialist
5. Each agent should output to a Proof doc
6. **Watch for:**
   - Does Prosper chain the agents correctly?
   - Does handoff context pass between agents?
   - Can you review each deliverable in Proof before the next agent starts?
   - Does the final output feel like a real marketing plan?
7. Score each agent output in the inbox
8. Give harsh feedback on anything weak — verify it writes to the persona file

**What you're testing:** Multi-agent pipeline with Proof + inbox scoring + feedback loop

---

## Step 5: Live Work Test — GodMode Website (30 min)

**Task:** Kick off the GodMode website build

1. New session: "Let's build the GodMode website. lifeongodmode.com needs a complete redesign."
2. This is the big pipeline test — should trigger project-pipeline skill
3. Prosper discovery phase: audience (founders/entrepreneurs), goal (conversions to beta), brand (sovereign AI, personal power), existing site (Vercel)
4. Pipeline should go: brand-guardian → content-writer → ux-researcher → frontend-developer → seo-specialist
5. **Watch for:**
   - Does Prosper scope it properly before delegating?
   - Does each agent produce a Proof doc?
   - Can you steer mid-pipeline? ("The brand voice should be more direct, less corporate")
   - Does the frontend-developer agent reference the brand guide and copy?
6. This will take a while — perfect test for the overnight cron workflow pattern
7. Score everything, give real feedback

**What you're testing:** Full swarm pipeline with real stakes

---

## Step 6: Cron Workflow Test (10 min)

1. Tell Prosper: "Set up a weekly SEO audit for lifeongodmode.com every Monday at 6am"
2. Should trigger `cron-workflows` skill card
3. Verify cron is created with the right agent (seo-specialist) and prompt
4. Manually trigger the cron to test the pipeline
5. Verify output lands in inbox

---

## Scoring Rubric

After testing, evaluate each branch on:

| Area | Score (1-10) | Notes |
|------|-------------|-------|
| Build health (compiles + typechecks) | | |
| Inbox renders and works | | |
| Feedback writes to persona files | | |
| Proof editor opens in sidebar | | |
| Human can edit in Proof | | |
| Agent writes to Proof progressively | | |
| Steering works (chat + direct edit) | | |
| Context injection is lean | | |
| UI feels native to GodMode | | |
| Code quality + minimal bloat | | |

---

## If Things Are Broken

- **Proof server won't start:** Check if proof-sdk installed correctly. May need to clone EveryInc/proof-sdk directly.
- **Inbox not showing:** Check `~/godmode/data/inbox.json` exists. Check RPC handler registration in `index.ts`.
- **Feedback not writing to files:** Check `src/lib/feedback-writer.ts` — verify persona path resolution.
- **Agent not writing to Proof:** Check agent prompt injection in `queue-processor.ts` — does it include the Proof API endpoint?
- **Build fails:** Run `pnpm typecheck` to find type errors. Fix and rebuild.

---

## Priority Order

If time is short, test in this order:
1. Inbox + scoring + feedback loop (this is the self-evolution engine — most important)
2. Proof editor in sidebar (foundation for everything else)
3. Single agent → Proof pipeline (the co-working experience)
4. Multi-agent pipeline (project-pipeline skill)
5. Cron workflows (nice to have)
