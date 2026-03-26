# Team Development Workflow

## Branch Naming

- `feat/<name>` — new features
- `fix/<name>` — bug fixes
- `chore/<name>` — maintenance, docs, CI

Always branch from `main`. Never commit directly to `main`.

## Pull Request Process

1. Create a branch: `git checkout -b feat/my-feature`
2. Make changes, commit with clear messages
3. Push: `git push -u origin feat/my-feature`
4. Open a PR on GitHub targeting `main`
5. Fill out the PR template (What / Why / Test Plan)
6. Wait for CI checks to pass (typecheck, build, build-ui)
7. Get at least 1 approval
8. Merge via GitHub (squash or merge commit)

## CI Checks

Every PR runs these automatically:

| Check | What it verifies |
|-------|-----------------|
| **typecheck** | `pnpm typecheck` — no TypeScript errors |
| **build** | `pnpm build` — plugin compiles cleanly |
| **build-ui** | `pnpm build:ui` — UI compiles cleanly |
| **forbidden-imports** | No `../../../../src/` monorepo imports |

All checks must pass before merging.

## AI Agent Guidelines

If using Claude Code or similar AI agents:
- Agents must follow `CLAUDE.md` at repo root
- Agents should create feature branches, never work on `main`
- Review agent PRs the same way you'd review a teammate's

## Release Process

1. Bump version in both `package.json` and `openclaw.plugin.json`
2. Commit: `chore: bump to vX.Y.Z`
3. Tag: `git tag vX.Y.Z`
4. Push: `git push origin main --tags`
5. GitHub Actions auto-publishes to npm on tag push

## Branch Protection (Admin Setup)

Go to GitHub Settings > Branches > Add rule for `main`:

- Require pull request before merging (1 approval minimum)
- Require status checks to pass: `typecheck`, `build`, `build-ui`
- Require branches to be up to date before merging
- Do not allow bypassing these settings
