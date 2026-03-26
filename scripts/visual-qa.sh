#!/usr/bin/env bash
# visual-qa.sh — Automated visual QA for GodMode UI
# Builds the project, starts the dev server, screenshots every tab,
# captures accessibility snapshots, and generates a QA report.
#
# Usage:
#   ./scripts/visual-qa.sh [--skip-build] [--tabs chat,today,workspaces]
#
# Requires: agent-browser (npm i -g agent-browser)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPORT_DIR="$REPO_ROOT/.qa-reports/$(date +%Y%m%d-%H%M%S)"
DEV_PORT=5175
BASE_URL="http://localhost:$DEV_PORT"
DEV_PID=""
SKIP_BUILD=false
SESSION_NAME="visual-qa-$$"

# Primary tabs (the 6-tab baseline) + settings group
ALL_TABS="chat today team workspaces second-brain dashboards config connections skills agents trust guardrails"
TABS="$ALL_TABS"

cleanup() {
  if [[ -n "$DEV_PID" ]]; then
    echo "[qa] Killing dev server (pid $DEV_PID)..."
    kill "$DEV_PID" 2>/dev/null || true
    wait "$DEV_PID" 2>/dev/null || true
  fi
  # Close browser session
  agent-browser close --session "$SESSION_NAME" 2>/dev/null || true
}
trap cleanup EXIT

# ---------- Parse args ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-build) SKIP_BUILD=true; shift ;;
    --tabs) TABS="${2//,/ }"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

# ---------- Preflight ----------
if ! command -v agent-browser &>/dev/null; then
  echo "[qa] ERROR: agent-browser not found. Install: npm i -g agent-browser"
  exit 1
fi

mkdir -p "$REPORT_DIR/screenshots" "$REPORT_DIR/snapshots"

# ---------- Step 1: Build ----------
if [[ "$SKIP_BUILD" == false ]]; then
  echo "[qa] Building plugin..."
  (cd "$REPO_ROOT" && pnpm build 2>&1) | tail -5
  echo "[qa] Building UI..."
  (cd "$REPO_ROOT" && pnpm build:ui 2>&1) | tail -5
  echo "[qa] Build complete."
else
  echo "[qa] Skipping build (--skip-build)."
fi

# ---------- Step 2: Start dev server ----------
echo "[qa] Starting dev server..."
DEV_LOG=$(mktemp)
(cd "$REPO_ROOT" && pnpm dev:ui 2>&1) > "$DEV_LOG" &
DEV_PID=$!

# Wait for server to be ready and detect actual port (Vite auto-increments if busy)
echo "[qa] Waiting for dev server..."
ACTUAL_PORT=""
for i in $(seq 1 30); do
  # Parse the actual port from Vite's output
  if [[ -z "$ACTUAL_PORT" ]]; then
    ACTUAL_PORT=$(grep -o 'localhost:[0-9]*' "$DEV_LOG" 2>/dev/null | tail -1 | sed 's/localhost://' || true)
  fi
  PORT_TO_CHECK="${ACTUAL_PORT:-$DEV_PORT}"
  if curl -s "http://localhost:$PORT_TO_CHECK" >/dev/null 2>&1; then
    DEV_PORT="$PORT_TO_CHECK"
    BASE_URL="http://localhost:$DEV_PORT"
    echo "[qa] Dev server ready on port $DEV_PORT."
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "[qa] ERROR: Dev server failed to start after 30s"
    cat "$DEV_LOG"
    exit 1
  fi
  sleep 1
done
rm -f "$DEV_LOG"

# ---------- Step 3: Open browser ----------
echo "[qa] Opening browser..."
agent-browser open "$BASE_URL/chat" --session "$SESSION_NAME" >/dev/null 2>&1
sleep 2  # Let the SPA hydrate

# ---------- Step 4: Screenshot each tab ----------
PASS_COUNT=0
FAIL_COUNT=0
TAB_RESULTS=""

for tab in $TABS; do
  echo "[qa] Navigating to /$tab..."
  agent-browser open "$BASE_URL/$tab" --session "$SESSION_NAME" >/dev/null 2>&1
  sleep 1.5  # Let the tab render

  # Screenshot (annotated — shows interactive element labels)
  SCREENSHOT_PATH="$REPORT_DIR/screenshots/${tab}.png"
  agent-browser screenshot "$SCREENSHOT_PATH" --annotate --session "$SESSION_NAME" 2>/dev/null || true

  # Accessibility snapshot (interactive elements only)
  SNAPSHOT_PATH="$REPORT_DIR/snapshots/${tab}.txt"
  agent-browser snapshot -i --session "$SESSION_NAME" > "$SNAPSHOT_PATH" 2>/dev/null || true

  # Basic health checks
  ISSUES=""

  # Check if page rendered (count interactive elements from snapshot as proxy —
  # Lit shadow DOM means body.textContent is nearly empty even on healthy pages)
  INTERACTIVE_COUNT=$(wc -l < "$SNAPSHOT_PATH" 2>/dev/null || echo "0")
  INTERACTIVE_COUNT=$(echo "$INTERACTIVE_COUNT" | tr -d ' ')

  if [[ "$INTERACTIVE_COUNT" -lt 3 ]]; then
    ISSUES="${ISSUES}  - WARNING: Page has very few interactive elements ($INTERACTIVE_COUNT found)\n"
  fi

  # Check for error indicators in the DOM (search shadow roots too)
  ERROR_TEXT=$(agent-browser eval "
    const walk = (root) => {
      const el = root.querySelector('.error, [class*=\"error\"], [class*=\"Error\"]');
      if (el) return el.textContent?.slice(0,200);
      for (const child of root.querySelectorAll('*')) {
        if (child.shadowRoot) { const r = walk(child.shadowRoot); if (r) return r; }
      }
      return '';
    };
    walk(document) || ''
  " --session "$SESSION_NAME" 2>/dev/null || echo "")
  # Filter out empty strings, quotes, and whitespace-only results
  ERROR_TEXT_CLEAN=$(echo "$ERROR_TEXT" | sed "s/^['\"]//;s/['\"]$//;s/^[[:space:]]*$//")
  if [[ -n "$ERROR_TEXT_CLEAN" ]]; then
    ISSUES="${ISSUES}  - ERROR element found: ${ERROR_TEXT_CLEAN}\n"
  fi

  if [[ -n "$ISSUES" ]]; then
    FAIL_COUNT=$((FAIL_COUNT + 1))
    STATUS="WARN"
  else
    PASS_COUNT=$((PASS_COUNT + 1))
    STATUS="OK"
  fi

  TAB_RESULTS="${TAB_RESULTS}### /$tab — $STATUS\n"
  if [[ -n "$ISSUES" ]]; then
    TAB_RESULTS="${TAB_RESULTS}${ISSUES}\n"
  fi
  TAB_RESULTS="${TAB_RESULTS}- Screenshot: [${tab}.png](screenshots/${tab}.png)\n"
  TAB_RESULTS="${TAB_RESULTS}- Snapshot: [${tab}.txt](snapshots/${tab}.txt)\n\n"

  echo "[qa]   /$tab — $STATUS"
done

# ---------- Step 5: Generate report ----------
TOTAL=$((PASS_COUNT + FAIL_COUNT))
REPORT_PATH="$REPORT_DIR/REPORT.md"

cat > "$REPORT_PATH" <<REPORT
# Visual QA Report

**Date:** $(date "+%Y-%m-%d %H:%M:%S")
**Branch:** $(cd "$REPO_ROOT" && git branch --show-current 2>/dev/null || echo "unknown")
**Commit:** $(cd "$REPO_ROOT" && git log --oneline -1 2>/dev/null || echo "unknown")

## Summary

- **Tabs checked:** $TOTAL
- **OK:** $PASS_COUNT
- **Warnings:** $FAIL_COUNT

## Tab Results

$(echo -e "$TAB_RESULTS")

## How to Review

1. Open the screenshots in \`$REPORT_DIR/screenshots/\`
2. Compare against expected appearance for each tab
3. Check accessibility snapshots for missing interactive elements
4. Any tab marked WARN needs manual inspection

## Files

\`\`\`
$REPORT_DIR/
  REPORT.md          ← this file
  screenshots/       ← annotated screenshots per tab
  snapshots/         ← accessibility trees per tab
\`\`\`
REPORT

echo ""
echo "========================================="
echo "[qa] Visual QA complete!"
echo "[qa] $PASS_COUNT OK / $FAIL_COUNT warnings out of $TOTAL tabs"
echo "[qa] Report: $REPORT_PATH"
echo "[qa] Screenshots: $REPORT_DIR/screenshots/"
echo "========================================="
