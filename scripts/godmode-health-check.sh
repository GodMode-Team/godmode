#!/bin/bash
# GodMode Health Check
# Verifies all GodMode features are present and working
# Usage: ./scripts/godmode-health-check.sh [--production]

set -e
cd "$(dirname "$0")/.."

PRODUCTION=${1:-""}
ERRORS=0

echo "🏥 GodMode Health Check"
echo "======================="
echo ""

# Check 1: Gateway running
echo -n "1. Gateway running... "
if curl -s http://localhost:18789/ > /dev/null 2>&1; then
    echo "✅"
else
    echo "❌ FAILED"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: GodMode branding
echo -n "2. GodMode branding... "
if curl -s http://localhost:18789/ | grep -q "GodMode"; then
    echo "✅"
else
    echo "❌ FAILED - Not showing GodMode branding"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: Source files exist
echo -n "3. File explorer source... "
if [[ -f "godmode-ui/src/ui/views/file-explorer.ts" ]]; then
    echo "✅"
else
    echo "❌ MISSING"
    ERRORS=$((ERRORS + 1))
fi

echo -n "4. Server file methods... "
if [[ -f "src/gateway/server-methods/files.ts" ]]; then
    echo "✅"
else
    echo "❌ MISSING"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Payload limit configured (generous for local use)
echo -n "5. Payload limits configured... "
if grep -q "MAX_PAYLOAD_BYTES" src/gateway/server-constants.ts 2>/dev/null; then
    echo "✅"
else
    echo "❌ FAILED - Payload constants missing"
    ERRORS=$((ERRORS + 1))
fi

# Check 5: +New button in source
echo -n "6. +New session support... "
if grep -q "createNewSession" godmode-ui/src/ui/app-render.helpers.ts 2>/dev/null; then
    echo "✅"
else
    echo "❌ MISSING"
    ERRORS=$((ERRORS + 1))
fi

# Check 6: Working sessions tracking
echo -n "7. Working sessions tracking... "
if grep -q "workingSessions" godmode-ui/src/ui/app-gateway.ts 2>/dev/null; then
    echo "✅"
else
    echo "❌ MISSING"
    ERRORS=$((ERRORS + 1))
fi

# Check 8: Sync lock staleness
echo -n "8. Sync lock freshness... "
SYNC_LOCK="$(git rev-parse --show-toplevel 2>/dev/null || pwd)/.sync-lock"
if [[ -f "$SYNC_LOCK" ]]; then
    LOCK_AGE=$(($(date +%s) - $(stat -f %m "$SYNC_LOCK" 2>/dev/null || echo "$(date +%s)")))
    if [[ $LOCK_AGE -gt 7200 ]]; then
        echo "WARNING - Stale .sync-lock ($(( LOCK_AGE / 3600 ))h old). Remove: rm $SYNC_LOCK"
        ERRORS=$((ERRORS + 1))
    else
        echo "OK ($(( LOCK_AGE / 60 ))m old)"
    fi
else
    echo "OK (no lock)"
fi

echo ""
echo "======================="
if [[ $ERRORS -eq 0 ]]; then
    echo "✅ All checks passed!"
    exit 0
else
    echo "❌ $ERRORS checks failed"
    exit 1
fi
