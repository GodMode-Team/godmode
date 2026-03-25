# Pre-OSS Blacklight Audit — 2026-03-24

## Status: IN PROGRESS (fixes being applied)

## CRITICAL — Rotate & Scrub Before Open Source

| # | Finding | Location | Action | Status |
|---|---------|----------|--------|--------|
| 1 | Telegram Bot Token (full token exposed) | skills/godmode-support/SKILL.md:52 | Revoke in BotFather, replace with env var | ☐ |
| 2 | Stripe Secret Key (`sk_test_518Z...azJ`) | site/.env.local:6 (tracked!) | Revoke in Stripe dashboard | ☐ |
| 3 | Redis Cloud Password in connection string | site/.env.local:4 | Reset in Redis Cloud console | ☐ |
| 4 | RSA Private Key (full JWT signing key) | site/.env.local:2-3 | Rotate keys | ☐ |
| 5 | Vercel OIDC Token (full JWT) | site/.env.local:7 | Revoke in Vercel | ☐ |
| 6 | Stripe Product/Price IDs | docs/PLAN-auth-subscription.md:11 | Remove file | ☐ |
| 7 | `site/.env.local` tracked in git | repo | git rm --cached, verify .gitignore | ☐ |

## HIGH — PII / Personal Data

| # | Finding | Location | Action | Status |
|---|---------|----------|--------|--------|
| 8 | Client proposal (Seth Bolt, pricing, legal entity) | site/proposal/ | git rm -r | ☐ |
| 9 | Personal "world" page (family names) | site/world/ | git rm -r | ☐ |
| 10 | Personal emails (caleb@patientautopilot.com etc.) | ENGINEER-HIRE.md, site HTML, BUILD-WORKSPACES.md | Replace with generic | ☐ |
| 11 | Stripe publishable key in docs | docs/plans/oss-readiness-plan.md:39 | Redact | ☐ |
| 12 | Smoke test fixtures with real names | tests/smoke-memory.mjs | Replace with generic | ☐ |
| 13 | Hardcoded email fallback | BUILD-WORKSPACES.md:254,270,295 | Replace with placeholder | ☐ |

## MEDIUM — Internal References / Identity Leaks

| # | Finding | Location | Action | Status |
|---|---------|----------|--------|--------|
| 14 | Hardcoded paths `/Users/calebhodges/...` | docs/plans/*.md, autoresearch/ | Replace with ~/ | ☐ |
| 15 | "Prosper" ally name in comments | src/tools/delegate-tool.ts:294, tests | Replace with "the ally" | ☐ |
| 16 | "caleb:agent" example | src/services/workspace-feed.ts:13 | Change to "user:agent" | ☐ |
| 17 | Client project names (Patient Autopilot, TRP) | Multiple docs, tool examples | Replace with generic | ☐ |
| 18 | ENGINEER-HIRE.md — comp details | ENGINEER-HIRE.md | Remove before OSS | ☐ |
| 19 | Vercel project metadata | site/.vercel/project.json | Add .vercel/ to .gitignore | ☐ |
| 20 | Internal planning docs | OVERNIGHT-*.md, V2-*.md, SLIM-V3-PROMPT.md | Review; remove internal-only | ☐ |
| 21 | File permissions — mode 600 on .md files | Root .md files | chmod 644 | ☐ |
| 22 | Support infra details | skills/godmode-support/SKILL.md | Scrub | ☐ |

## CLEAN (no issues)

- No API keys in source or history (sk-ant-*, AKIA*, AIza*, ghp_*, xox*)
- .env.example is placeholder-only
- .gitignore covers .env*, *.db, node_modules/, dist/
- .npmignore + package.json "files" properly scoped
- No .pem private keys (only public key)
- No database files tracked
- All runtime secrets use process.env

## Recommended: Fresh Repo for OSS Launch

Given secrets in history, client proposals, and PII — start fresh repo with cleaned HEAD.
Old repo stays as private archive. History can't be trusted after this audit.

## Prevention: Pre-commit Hook + .gitignore hardening

See scripts/hooks/secrets-guard.sh (to be created).
