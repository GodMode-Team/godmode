#!/bin/bash
#
# overnight.sh — Master autoresearch runner
# Runs all optimization campaigns sequentially, logging everything.
# Usage: nohup bash autoresearch/overnight.sh &> autoresearch/overnight.log &
#
# Each campaign modifies → measures → keeps or reverts.
# Safe to leave running — all mutations are atomic with rollback.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CAMPAIGNS_DIR="$SCRIPT_DIR/campaigns"
LOG_DIR="$SCRIPT_DIR/logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# ── Setup ────────────────────────────────────────────────────────────

mkdir -p "$LOG_DIR"

# Load API keys
if [ -f "$HOME/.openclaw/.env" ]; then
  set -a
  source "$HOME/.openclaw/.env"
  set +a
  echo "[overnight] Loaded API keys from ~/.openclaw/.env"
fi

if [ -f "$HOME/godmode/.env" ]; then
  set -a
  source "$HOME/godmode/.env"
  set +a
  echo "[overnight] Loaded API keys from ~/godmode/.env"
fi

# Verify minimum requirements
if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "[overnight] WARNING: No OPENAI_API_KEY — LLM-as-judge campaigns will skip"
fi

cd "$REPO_DIR"

# ── Git safety — snapshot current state ──────────────────────────────

BRANCH=$(git branch --show-current)
echo "[overnight] Starting on branch: $BRANCH"
echo "[overnight] Timestamp: $TIMESTAMP"
echo "[overnight] Creating safety snapshot..."

# Commit any uncommitted changes so we have a clean rollback point
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "autoresearch: pre-overnight snapshot ($TIMESTAMP)" --no-verify 2>/dev/null || true
fi

SNAPSHOT_COMMIT=$(git rev-parse HEAD)
echo "[overnight] Safety snapshot: $SNAPSHOT_COMMIT"
echo ""

# ── Campaign runner ──────────────────────────────────────────────────

run_campaign() {
  local name="$1"
  local script="$2"
  local iterations="${3:-20}"
  local log_file="$LOG_DIR/${name}-${TIMESTAMP}.log"

  echo "═══════════════════════════════════════════════════════════════"
  echo "  CAMPAIGN: $name"
  echo "  Iterations: $iterations"
  echo "  Log: $log_file"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""

  if [ ! -f "$script" ]; then
    echo "[overnight] SKIP: $script not found"
    echo ""
    return 0
  fi

  local start_time=$(date +%s)

  # Run the campaign, capturing output
  if node "$script" --iterations "$iterations" 2>&1 | tee "$log_file"; then
    local end_time=$(date +%s)
    local duration=$(( end_time - start_time ))
    echo ""
    echo "[overnight] ✓ $name completed in ${duration}s"
  else
    local end_time=$(date +%s)
    local duration=$(( end_time - start_time ))
    echo ""
    echo "[overnight] ✗ $name FAILED after ${duration}s (changes reverted)"
    # Revert any partial changes from this campaign
    git checkout -- . 2>/dev/null || true
  fi

  echo ""

  # Run the master eval after each campaign to track cumulative progress
  echo "[overnight] Running master eval after $name..."
  node "$SCRIPT_DIR/eval-runner.mjs" 2>&1 | grep "^SCORE:" | tee -a "$LOG_DIR/cumulative-${TIMESTAMP}.log"
  echo "--- after: $name ---" >> "$LOG_DIR/cumulative-${TIMESTAMP}.log"
  echo ""
}

# ── Run all campaigns ────────────────────────────────────────────────

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           GODMODE OVERNIGHT AUTORESEARCH                     ║"
echo "║           $(date)                            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Phase 0: One-time seeding (gated by sentinel, runs once then skips)
if [ -f "$CAMPAIGNS_DIR/seed-apple-notes.mjs" ]; then
  echo "── Apple Notes Seeding (sentinel-gated) ──"
  node "$CAMPAIGNS_DIR/seed-apple-notes.mjs" 2>&1 || true
  echo ""
fi

# Phase 1: Deterministic campaigns (no API calls, fast)
run_campaign "context-words"   "$CAMPAIGNS_DIR/context-words.mjs"   30
run_campaign "skill-triggers"  "$CAMPAIGNS_DIR/skill-triggers.mjs"  20

# Phase 2: Memory threshold tuning (may use API, moderate cost)
run_campaign "memory-thresholds" "$CAMPAIGNS_DIR/memory-thresholds.mjs" 25

# Phase 3: LLM-as-judge campaigns (Anthropic Sonnet 4 preferred, XAI/OpenAI fallback)
# These campaigns auto-detect the best available API key
run_campaign "soul-essence"    "$CAMPAIGNS_DIR/soul-essence.mjs"    15
run_campaign "queue-prompts"   "$CAMPAIGNS_DIR/queue-prompts.mjs"   15
run_campaign "ally-experience" "$CAMPAIGNS_DIR/ally-experience.mjs" 15

# Phase 3.5: Onboarding hardening (LLM-as-judge, Sonnet 4.6 required, OAuth re-auth)
# Simulates 5 user personas across 10 onboarding scenarios, optimizes phase prompts
run_campaign "onboarding-hardening" "$CAMPAIGNS_DIR/onboarding-hardening.mjs" 12

# Phase 4: Vault optimization (LLM-as-judge + structural fixes)
run_campaign "second-brain"   "$CAMPAIGNS_DIR/second-brain.mjs"   10

# Phase 5: Full product audit (structural + LLM-as-judge, Sonnet 4.6)
# Simulates customer personas, audits safety gates, hunts bugs
run_campaign "product-audit"  "$CAMPAIGNS_DIR/product-audit.mjs"  10

# ── Final eval ───────────────────────────────────────────────────────

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    FINAL EVALUATION                          ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

node "$SCRIPT_DIR/eval-runner.mjs" 2>&1 | tee "$LOG_DIR/final-${TIMESTAMP}.log"

# ── Summary ──────────────────────────────────────────────────────────

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    OVERNIGHT COMPLETE                        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Started:    $TIMESTAMP"
echo "Finished:   $(date +%Y%m%d-%H%M%S)"
echo "Branch:     $BRANCH"
echo "Snapshot:   $SNAPSHOT_COMMIT"
echo ""
echo "Logs:       $LOG_DIR/"
echo "Cumulative: $LOG_DIR/cumulative-${TIMESTAMP}.log"
echo "Final eval: $LOG_DIR/final-${TIMESTAMP}.log"
echo ""

# Show diff summary
echo "Changes made:"
git diff --stat "$SNAPSHOT_COMMIT" HEAD 2>/dev/null || git diff --stat
echo ""

# Count kept experiments from campaign logs
for log in "$CAMPAIGNS_DIR"/*-log.tsv; do
  if [ -f "$log" ]; then
    local_name=$(basename "$log" -log.tsv)
    kept=$(grep -c "keep" "$log" 2>/dev/null || echo "0")
    discarded=$(grep -c "discard" "$log" 2>/dev/null || echo "0")
    echo "  $local_name: $kept kept, $discarded discarded"
  fi
done

echo ""
echo "[overnight] Done. Review changes with: git diff $SNAPSHOT_COMMIT"
echo "[overnight] Revert everything with: git reset --hard $SNAPSHOT_COMMIT"
