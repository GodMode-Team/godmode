---
name: Build Verification
trigger: manual
persona: ops-runner
taskType: ops
priority: high
---

Run full build verification on the current branch.

1. Run `pnpm build` — capture output
2. Run `pnpm typecheck` — capture output
3. Run `pnpm build:ui && pnpm ui:sync` — capture output
4. Search for forbidden imports: `rg "\.\./\.\./\.\./\.\./src/" -n`
5. Check for any uncommitted changes that should be staged
6. Report: PASS or FAIL with specific errors
