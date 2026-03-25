# Codex Second Sweep — Post-Blacklight Verification

## Context

A comprehensive secrets/PII audit ("blacklight sweep") was performed on 2026-03-24 and fixes were applied. This is a **verification pass** to catch anything that was missed. The repo is preparing for AGPL-3.0 open-source release.

## What Was Already Done

1. Removed `site/.env.local` from tracking (confirmed gitignored)
2. Scrubbed Telegram bot token from `skills/godmode-support/SKILL.md`
3. Deleted `docs/PLAN-auth-subscription.md` (contained Stripe product/price IDs)
4. Deleted `site/proposal/` (client names, pricing, legal entity)
5. Deleted `site/world/` (family names, personal dashboard)
6. Deleted `ENGINEER-HIRE.md` (compensation details)
7. Deleted 7 internal planning docs (SLIM-V3-PROMPT, V2-EXECUTION-SPEC, V2-MASTER-PROMPTS, PROMPT-0-REVIEW, PROMPT-8-THREE-ITEMS, COMMUNITY-AND-CLEANUP-PROMPT, competitive_analysis)
8. Replaced `caleb@patientautopilot.com` → `user@example.com` across SECOND-BRAIN-PLAN.md, BUILD-WORKSPACES.md, HONCHO-INTEGRATION-SPEC.md
9. Replaced `caleb@lifeongodmode.com` → `team@lifeongodmode.com` in site HTML
10. Replaced "Patient Autopilot" → "Project Beta", "TRP" → "Project Alpha" across docs and test fixtures
11. Replaced `/Users/calebhodges/Projects/godmode-plugin` → `.` in plan docs
12. Scrubbed "Prosper" references from source code comments
13. Replaced `caleb:agent` → `user:agent` in workspace-feed.ts
14. Anonymized test fixture names (Jake→Alex, real names→generic)
15. Replaced license keys with `YOUR_LICENSE_KEY` / `GM-XXXX-XXXX`
16. Added `.vercel/` and `*.sqlite*` to `.gitignore`
17. Fixed file permissions (600 → 644) on markdown files
18. Installed `scripts/hooks/secrets-guard.sh` pre-commit hook
19. Removed `outputs/reports/openclaw-docs-analysis.html` and `openclaw-intelligence.html`

## Your Task: Deep Verification Sweep

### Pass 1: Grep Every File for Residual Secrets

Scan EVERY tracked file (`git ls-files`) for these patterns. Report any matches NOT in the audit report itself or .env.example:

```bash
# API Keys
git ls-files | xargs grep -nE 'sk-ant-[a-zA-Z0-9_-]{20,}' 2>/dev/null
git ls-files | xargs grep -nE 'sk_(?:test|live)_[a-zA-Z0-9]{20,}' 2>/dev/null
git ls-files | xargs grep -nE 'pk_(?:test|live)_[a-zA-Z0-9]{20,}' 2>/dev/null
git ls-files | xargs grep -nE 'ghp_[a-zA-Z0-9]{36}' 2>/dev/null
git ls-files | xargs grep -nE 'AKIA[A-Z0-9]{16}' 2>/dev/null
git ls-files | xargs grep -nE 'AIza[a-zA-Z0-9_-]{35}' 2>/dev/null
git ls-files | xargs grep -nE 'xox[bp]-[a-zA-Z0-9-]{20,}' 2>/dev/null
git ls-files | xargs grep -nE '[0-9]{8,10}:[A-Za-z0-9_-]{35}' 2>/dev/null  # Telegram tokens

# Secrets in code
git ls-files | xargs grep -nE 'password\s*[:=]\s*"[^"]{8,}"' 2>/dev/null
git ls-files | xargs grep -nE 'secret\s*[:=]\s*"[^"]{8,}"' 2>/dev/null
git ls-files | xargs grep -nE '-----BEGIN .* PRIVATE KEY-----' 2>/dev/null
git ls-files | xargs grep -nE '(mongodb|postgres|mysql|redis)://[^:]+:[^@]+@' 2>/dev/null

# PII
git ls-files | xargs grep -nEi 'caleb@' 2>/dev/null
git ls-files | xargs grep -nE 'patientautopilot' 2>/dev/null
git ls-files | xargs grep -nE '/Users/calebhodges' 2>/dev/null
git ls-files | xargs grep -nEi 'seth bolt|keagan|titus hodge|rich hodge|john gulick|thomas goubau' 2>/dev/null

# Internal infra
git ls-files | xargs grep -nE 'prod_[A-Za-z0-9]{10,}' 2>/dev/null  # Stripe product IDs
git ls-files | xargs grep -nE 'price_[A-Za-z0-9]{10,}' 2>/dev/null  # Stripe price IDs
git ls-files | xargs grep -nE 'GM-DEV-TEAM-2026' 2>/dev/null  # Real license key
```

### Pass 2: Check Git History

Even though we plan to start a fresh repo for OSS, verify the current HEAD is clean:

```bash
# Verify deleted files are gone
git ls-files | grep -E 'ENGINEER-HIRE|PLAN-auth-subscription|proposal/|world/index'
# Should return nothing

# Check no .env files are tracked
git ls-files | grep -E '\.env(?!\.)'
# Should only show .env.example

# Check no database files tracked
git ls-files | grep -E '\.(db|sqlite|sqlite3)$'
# Should return nothing
```

### Pass 3: Check npm Package Contents

```bash
npm pack --dry-run 2>&1
```

Verify the dry-run output does NOT include:
- Any `.env` files
- Any `site/` files (shouldn't be in npm)
- Any `docs/` internal plans
- Any test fixtures with PII
- Any `.md` files with personal data in root

### Pass 4: Semantic Review

Read these files and flag anything that feels too personal/internal for an OSS repo:

1. `CLAUDE.md` — Does it reference internal team names, personal preferences, or private projects?
2. `CHANGELOG.md` — Does it reference client projects or personal data?
3. `docs/GODMODE-META-ARCHITECTURE.md` — Clean for public?
4. `docs/DEPLOYMENT-GUIDE.md` — Any internal URLs or personal references?
5. `docs/ROADMAP.md` — Any client-specific features or internal business strategy?
6. `skills/godmode-support/SKILL.md` — All tokens replaced? No internal customer IDs?
7. `assets/agent-roster/*.md` — Any persona files with personal data?
8. `skill-cards/*.md` — Any skill cards referencing private projects?
9. `site/index.html` — Founder name "Caleb Hodges" is OK (public), but check for client names, patient data, internal URLs
10. All files in `autoresearch/` — Test data anonymized? No real emails or names?

### Pass 5: .gitignore Completeness

Verify `.gitignore` covers all of these. If any are missing, add them:
- `.env`, `.env.*`, `.env.local`, `.env.*.local`
- `*.pem` (except the committed public key — verify it's actually public)
- `*.key`, `*.p12`, `*.pfx`
- `*.db`, `*.sqlite`, `*.sqlite3`
- `node_modules/`, `dist/`, `coverage/`
- `.vercel/`
- `*.log`
- `.DS_Store`

### Pass 6: Pre-commit Hook Verification

Test the pre-commit hook works:
```bash
# Create a test file with a fake secret
echo 'const key = "sk-ant-fake-test-key-1234567890abcdef"' > /tmp/test-secret.ts
cp /tmp/test-secret.ts src/lib/test-secret.ts
git add src/lib/test-secret.ts
git commit -m "test: verify secrets guard blocks this"
# Should be BLOCKED by the hook
git checkout -- src/lib/test-secret.ts
rm src/lib/test-secret.ts
```

## Output Format

For every finding:
- **File:** path + line number
- **Content:** the problematic text (redact secrets)
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Status:** NEW (missed by first sweep) or KNOWN (already documented)
- **Fix:** specific action needed

## Final Verdict

After all passes, provide:
1. **Clean/Not Clean** — Is the HEAD safe to publish?
2. **Remaining items** — Numbered list of anything that still needs fixing
3. **Recommendation** — Fresh repo vs. filter-repo vs. publish as-is
