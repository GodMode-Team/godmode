Read V2-EXECUTION-SPEC.md for context. This session runs AFTER the Great Deletion (PROMPT-1).

## YOUR TASK: Audit and prune src/lib/ — 13,571 lines across 40+ files.

The Great Deletion removed methods, services, tools, and views, but did NOT touch src/lib/. Many lib files are now orphaned or only imported by deleted files. Your job: find and remove dead code, then thin the survivors.

### STEP 1: Find orphaned files

For EVERY file in src/lib/, check if it's imported by any remaining file:

```bash
for f in src/lib/*.ts; do
  base=$(basename "$f" .ts)
  count=$(grep -rl "$base" src/ ui/ index.ts 2>/dev/null | grep -v "$f" | wc -l)
  echo "$count imports: $f"
done | sort -n
```

Any file with 0 imports (self-references don't count) → DELETE.

### STEP 2: Files likely orphaned after Session 1 deletions

These were imported by files that Session 1 deleted:
- `awareness-snapshot.ts` (654 lines) — imported by consciousness.ts, consciousness-heartbeat.ts (both deleted)
- `interaction-ledger.ts` (953 lines) — imported by consciousness-heartbeat.ts, vault-capture.ts (both deleted)
- `correction-log.ts` (645 lines) — imported only by interaction-ledger.ts (deleted above)
- `config-snapshots.ts` (285 lines) — imported only by consciousness-heartbeat.ts (deleted)

Check if anything REMAINING still imports these. If not → DELETE.

### STEP 3: Review large files that survive

For any lib file over 300 lines that survives the orphan check:
1. Read the file header comment
2. Check if its functionality is still needed in the slim v2
3. If it's doing something that an external tool now handles (Honcho, Composio, Paperclip), mark for future deletion but leave a TODO comment
4. If it's genuinely needed, leave it

### STEP 4: Type check and build

```bash
pnpm typecheck
pnpm build
```

Fix any import errors from deleted lib files.

### COMMIT:
```bash
git commit -m "feat: v2 lib audit — remove orphaned and dead lib files"
```

### WHEN DONE, report:
```bash
echo "Before: 13571 lines in lib/"
wc -l src/lib/*.ts | tail -1
```
