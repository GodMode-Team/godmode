# GodMode Development Workspace

## Architecture
Read `docs/GODMODE-META-ARCHITECTURE.md` — the definitive product blueprint.

## Golden Rules
1. Code as little as possible — can this be a file? If yes, don't write TypeScript.
2. Conduct, don't rebuild — GodMode connects to existing tools, never replaces them.
3. Meta-agent pattern — ally crafts prompts for sub-agents. Quality scales through prompt quality.

## Conventions
- TypeScript ESM only
- `pnpm build && pnpm typecheck` before committing
- Feature branches, never commit to main
- Update RECENT-CHANGES.md after every session

## Team Workflow
1. Pick an issue or task from the board
2. Create a feature branch
3. Have your ally scope the work
4. Implement with your ally's help
5. Build + typecheck pass
6. Create PR for review
7. Another team member's ally reviews the PR
