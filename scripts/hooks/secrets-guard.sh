#!/usr/bin/env bash
# Secrets Guard — scans staged files for secrets, PII, and private data before commit.
#
# Git pre-commit hook. Runs automatically on `git commit`.
# Exit 0 = allow, Exit 1 = block commit (findings printed to stderr).
#
# Install:
#   ln -sf ../../scripts/hooks/secrets-guard.sh .git/hooks/pre-commit
#   # Or add to existing pre-commit chain

set -euo pipefail

FOUND=0

# Get list of staged files (added/modified, not deleted)
STAGED=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true)

if [[ -z "$STAGED" ]]; then
  exit 0
fi

# ─── Pattern Definitions ───────────────────────────────────────────────

# CRITICAL: Real API keys and tokens
check_pattern() {
  local label="$1"
  local pattern="$2"
  local severity="$3"

  local matches
  matches=$(echo "$STAGED" | xargs grep -nEH "$pattern" 2>/dev/null | grep -v '.env.example' | grep -v 'secrets-guard.sh' | grep -v 'node_modules/' | grep -v 'docs/audits/' || true)

  if [[ -n "$matches" ]]; then
    echo "──────────────────────────────────────────" >&2
    echo "[$severity] $label" >&2
    echo "$matches" >&2
    echo "" >&2
    FOUND=1
  fi
}

echo "" >&2
echo "🔒 Secrets Guard — scanning staged files..." >&2
echo "" >&2

# ─── CRITICAL: API Keys & Tokens ──────────────────────────────────────

check_pattern "Anthropic API Key" \
  'sk-ant-[a-zA-Z0-9_-]{20,}' \
  "CRITICAL"

check_pattern "OpenAI API Key" \
  'sk-[a-zA-Z0-9]{40,}' \
  "CRITICAL"

check_pattern "GitHub Personal Access Token" \
  'ghp_[a-zA-Z0-9]{36}' \
  "CRITICAL"

check_pattern "GitHub OAuth Token" \
  'gho_[a-zA-Z0-9]{36}' \
  "CRITICAL"

check_pattern "Slack Token" \
  'xox[bp]-[a-zA-Z0-9-]{20,}' \
  "CRITICAL"

check_pattern "AWS Access Key" \
  'AKIA[A-Z0-9]{16}' \
  "CRITICAL"

check_pattern "Google API Key" \
  'AIza[a-zA-Z0-9_-]{35}' \
  "CRITICAL"

check_pattern "Stripe Secret Key" \
  'sk_(?:test|live)_[a-zA-Z0-9]{20,}' \
  "CRITICAL"

check_pattern "Telegram Bot Token" \
  '[0-9]{8,10}:[A-Za-z0-9_-]{35}' \
  "CRITICAL"

check_pattern "Private Key Block" \
  '-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----' \
  "CRITICAL"

check_pattern "JWT Token (long)" \
  'eyJ[a-zA-Z0-9_-]{50,}\.[a-zA-Z0-9_-]{50,}\.[a-zA-Z0-9_-]{50,}' \
  "CRITICAL"

# ─── HIGH: Passwords & Secrets in Code ────────────────────────────────

check_pattern "Hardcoded Password" \
  'password\s*[:=]\s*"[^"]{8,}"' \
  "HIGH"

check_pattern "Hardcoded Secret" \
  'secret\s*[:=]\s*"[^"]{8,}"' \
  "HIGH"

check_pattern "Bearer Token (hardcoded)" \
  'Bearer [a-zA-Z0-9_.-]{20,}' \
  "HIGH"

check_pattern "Connection String with Password" \
  '(mongodb|postgres|mysql|redis)://[^:]+:[^@]+@' \
  "HIGH"

# ─── MEDIUM: PII ──────────────────────────────────────────────────────

check_pattern "Personal Email (non-placeholder)" \
  '[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|icloud|outlook|patientautopilot|godmode)\.(com|ai)' \
  "MEDIUM"

check_pattern "Hardcoded User Path" \
  '/Users/[a-zA-Z][a-zA-Z0-9_-]+/(?!example)' \
  "MEDIUM"

# ─── Result ────────────────────────────────────────────────────────────

if [[ $FOUND -eq 1 ]]; then
  echo "══════════════════════════════════════════" >&2
  echo "❌ COMMIT BLOCKED — secrets or PII detected in staged files." >&2
  echo "" >&2
  echo "Fix the issues above, then retry your commit." >&2
  echo "To bypass (emergency only): git commit --no-verify" >&2
  echo "══════════════════════════════════════════" >&2
  exit 1
else
  echo "✅ No secrets or PII detected." >&2
  exit 0
fi
