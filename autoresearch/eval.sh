#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# GodMode Autoresearch Evaluation Harness
# Equivalent to Karpathy's prepare.py — DO NOT MODIFY.
#
# Measures:
#   1. Skill trigger precision (deterministic, regex-based)
#   2. Context relevance accuracy (keyword gate checks)
#   3. Combined score
#
# Usage: ./autoresearch/eval.sh
# Output: SCORE: lines for each metric + combined
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEST_SUITE="$SCRIPT_DIR/test-suite.json"

# ── Check dependencies ──────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "ERROR: node not found" >&2
  exit 1
fi

if [ ! -f "$TEST_SUITE" ]; then
  echo "ERROR: test-suite.json not found at $TEST_SUITE" >&2
  exit 1
fi

# ── Run the evaluation via Node ─────────────────────────────────
# We inline a TypeScript-compatible evaluator that imports the actual
# skill-cards matching logic from the built plugin.

node --experimental-specifier-resolution=node --no-warnings "$SCRIPT_DIR/eval-runner.mjs"
