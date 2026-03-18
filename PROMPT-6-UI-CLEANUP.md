Read V2-EXECUTION-SPEC.md for context. This runs AFTER backend deletions are done.

## YOUR TASK: Clean up UI views — remove dead views, resolve overlaps, verify navigation.

### STEP 1: Remove views for deleted features

These views reference backend code that no longer exists. Delete them:
- `mission-control.ts` — swarm/Paperclip UI (deleted)
- `parallel-sessions.ts` — removed feature
- `clawhub.ts` — replaced by skills browser in second-brain
- `proof-viewer.ts` — not using hosted Proof (markdown-sidebar.ts stays)
- `work.ts` — IF it's redundant with my-day.ts (check both, keep whichever is better, delete the other)

### STEP 2: Resolve view overlaps

Check these for redundancy:
- `overview.ts` (397 lines) vs `my-day.ts` (612 lines) vs `daily-brief.ts` (421 lines)
  - We need ONE "Today" view that shows: daily brief + tasks + inbox items
  - If my-day.ts does this, delete overview.ts and daily-brief.ts (or merge the best parts into my-day.ts)
  - If overview.ts is the main dashboard, keep that instead
  - Use your judgment — keep the better one, delete the rest

- `onboarding.ts` vs `onboarding-wizard.ts` vs `onboarding-setup.ts` vs `setup.ts`
  - We need ONE onboarding flow
  - Keep the simplest one that captures: name, timezone, what they're working on, comm style
  - Delete the rest

- `ally-chat.ts` (424 lines) vs `chat.ts` — what's the difference? If ally-chat is a skin/variant, delete it.

### STEP 3: Check navigation

After deletions, verify the main app navigation still works:
1. Find the main navigation/router file (likely in ui/src/ui/ or the main app element)
2. Remove routes/menu items for deleted views
3. Ensure remaining navigation items point to real views

### STEP 4: Check for orphaned imports

```bash
pnpm build:ui 2>&1 | grep -i error
```

Fix any broken imports from deleted views.

### COMMIT:
```bash
git commit -m "feat: v2 UI cleanup — remove dead views, resolve overlaps"
```

### WHEN DONE, report:
```bash
echo "Before: ~21000 lines in ui/views/"
wc -l ui/src/ui/views/*.ts | tail -1
find ui/src/ui/views -name "*.ts" | wc -l
```
