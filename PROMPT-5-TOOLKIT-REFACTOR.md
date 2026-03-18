Read V2-EXECUTION-SPEC.md for context. This runs AFTER the Great Deletion and lib audit.

## YOUR TASK: Refactor agent-toolkit-server.ts to survive the v2 deletions.

### CONTEXT
agent-toolkit-server.ts (740 lines) is an HTTP server that gives spawned Paperclip agents access to GodMode's knowledge systems. It's essential — without it, delegated agents work blind.

But several of its endpoints wrap systems that were deleted in earlier sessions:
- `/memory` wraps Mem0 searchMemories() — Mem0 is deleted
- `/awareness` reads awareness-snapshot.md — awareness-snapshot.ts may be deleted

### YOUR JOB:

1. **Read the file** and understand all endpoints
2. **For each endpoint**, check if its underlying implementation still exists after the deletion sessions
3. **Fix broken endpoints:**
   - `/memory` — rewire to use file-based memory search (grep/keyword over ~/godmode/memory/) instead of Mem0
   - `/awareness` — if awareness-snapshot.ts was deleted, either remove this endpoint or rewire to read WORKING.md + today's daily note as a lightweight awareness context
   - Any other endpoint pointing at deleted code → fix or remove
4. **Keep working endpoints as-is:**
   - `/search` (secondBrain.search) — if this still works
   - `/skills`, `/skills/match` — these should still work
   - `/identity` (USER.md + SOUL.md) — definitely works
   - `/docs/:name` — definitely works
   - `/guardrails` — should work
   - `/workspace` — should work
5. **Simplify if possible** — if any endpoints are redundant with each other, merge them

### VALIDATION:
```bash
pnpm typecheck && pnpm build
```

The server should start without errors even if Mem0/Honcho/embeddings are not configured.

### COMMIT:
```bash
git commit -m "feat: refactor agent-toolkit-server for v2 — rewire deleted dependencies"
```
