# OSS Data Hygiene — Preventing Private Data in the Repo

## The Problem

Before OSS prep, this repo had: personal emails, client project names, Telegram tokens, Stripe IDs, Vercel project IDs, team member names, hardcoded file paths, and internal infrastructure references — all committed in plain text across docs, test fixtures, skill cards, and source comments.

**Git history is permanent.** Even if you delete a file, every version ever committed travels with the repo. A single `git clone` gives attackers the full history.

## Defense in Depth (4 Layers)

### Layer 1: Pre-commit Hook (automatic, blocks bad commits)

`scripts/hooks/secrets-guard.sh` runs on every `git commit` and scans staged files for:
- API keys (sk-*, ghp_*, AKIA*, xox*, Telegram tokens)
- Stripe IDs (prod_*, price_*, sk_test_*, sk_live_*)
- Personal emails (@gmail, @icloud, @hotmail, etc.)
- Hardcoded user paths (platform-specific home directories)
- Passwords/secrets in code (password = "...", secret: "...")
- Private keys (-----BEGIN ... PRIVATE KEY-----)
- Database connection strings with credentials

**Setup:** Already installed via `.git/hooks/pre-commit`. For new clones:
```bash
pnpm install  # postinstall script links the hook
```

### Layer 2: .gitignore (automatic, prevents tracking)

Already covers:
- `.env`, `.env.*`, `.env.local`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- `*.db`, `*.sqlite`, `*.sqlite3`
- `.vercel/`
- `node_modules/`, `dist/`, `coverage/`

### Layer 3: Convention (team discipline)

1. **Never put real data in docs/examples.** Use:
   - `user@example.com` for emails
   - `Project Alpha`, `Project Beta` for project names
   - `TestUser`, `TestAlly` for names in tests
   - `YOUR_API_KEY`, `sk-your-key-here` for API keys
   - `team/repo-name` for GitHub references

2. **Never hardcode paths.** Use:
   - `getOwnerName()`, `getOwnerUserId()` from ally-identity.ts
   - `GODMODE_ROOT` env var for file paths
   - Relative paths in docs and scripts

3. **Keep internal docs out of the repo.** Internal plans, customer data, hiring docs, pricing strategy — these go in Notion/Obsidian/Google Docs, not in git.

4. **Test fixtures use fake data.** Names: Alex, Jordan, Dana. Companies: TestCorp, Acme. Pricing: $49/month.

### Layer 4: Periodic Audits (manual, catches drift)

Run the blacklight sweep quarterly or before any release:
```bash
# Quick check — are we clean?
git ls-files | xargs grep -nEi 'sk-ant-|sk_test_|sk_live_|ghp_|AKIA|password\s*=\s*"' 2>/dev/null
git ls-files | xargs grep -nE '/Users/[a-zA-Z][a-zA-Z0-9_-]+/' 2>/dev/null | grep -v secrets-guard
```

Full audit prompt: `docs/audits/CODEX-SECOND-SWEEP-PROMPT.md`

## For Open-Source Launch

**Recommended: Fresh repo from clean HEAD.**

```bash
# In a temp directory
mkdir godmode-fresh && cd godmode-fresh
git init
cp -r /path/to/godmode-plugin/* .
cp /path/to/godmode-plugin/.gitignore .
git add -A
git commit -m "Initial commit: GodMode v1.8.1 (FSL-1.1-MIT)"
git remote add origin git@github.com:GodMode-Team/godmode.git
git push -u origin main
```

This guarantees zero secrets in history. You lose contributor history but gain certainty.

**After launch, rotate these credentials** (they exist in the old repo's git history):
- Telegram bot tokens
- Stripe API keys (test and live)
- Redis password
- JWT signing keypair
- Vercel deployment tokens
- Any OAuth refresh tokens

## Quick Reference

| Data Type | Where It Goes | NOT in Git |
|---|---|---|
| API keys | `.env.local` or secrets manager | Source code, docs |
| Client names | Notion, CRM | Docs, tests, skill cards |
| Team emails | Team directory (private) | Source code, configs |
| Internal URLs | `.env.local` or team wiki | Docs, comments |
| File paths | Env vars (`GODMODE_ROOT`) | Hardcoded in source |
| Pricing/revenue | Financial docs (private) | Anywhere in repo |
