#!/bin/bash
# godmode-support CLI
# This script is installed on customer Mac Minis to provide allowlisted
# support commands. {{ALLY_NAME}} can only run these commands during SSH sessions.
#
# Installation: Copy to /usr/local/bin/godmode-support and chmod +x
# Usage: godmode-support <command> [args]

set -euo pipefail

SCRIPT_VERSION="1.0.0"
OPENCLAW_DIR="${HOME}/.openclaw"
OPENCLAW_CONFIG="${OPENCLAW_DIR}/config.json"
OPENCLAW_TMP="/tmp/openclaw"
LAUNCHCTL_LABEL="com.openclaw.gateway"
GATEWAY_PORT=18789

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Command: health
# Check gateway health status
cmd_health() {
    echo "=== GodMode Gateway Health Check ==="
    echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo ""

    # Check if gateway process is running
    echo "--- Process Status ---"
    if pgrep -f "openclaw-gateway" > /dev/null 2>&1; then
        print_status "Gateway process is running"
        pgrep -f "openclaw-gateway" | head -3
    else
        print_error "Gateway process NOT running"
    fi
    echo ""

    # Check HTTP endpoint
    echo "--- HTTP Endpoint ---"
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${GATEWAY_PORT}" | grep -q "200\|404"; then
        print_status "HTTP endpoint responding on port ${GATEWAY_PORT}"
    else
        print_error "HTTP endpoint NOT responding on port ${GATEWAY_PORT}"
    fi
    echo ""

    # Check launchctl status
    echo "--- LaunchAgent Status ---"
    if launchctl print "gui/$(id -u)/${LAUNCHCTL_LABEL}" 2>/dev/null | grep -q "state = running"; then
        print_status "LaunchAgent is running"
    else
        print_warning "LaunchAgent may not be running"
        launchctl print "gui/$(id -u)/${LAUNCHCTL_LABEL}" 2>&1 | head -5 || echo "Could not get launchctl status"
    fi
    echo ""

    # Check config exists
    echo "--- Configuration ---"
    if [[ -f "${OPENCLAW_CONFIG}" ]]; then
        print_status "Config file exists: ${OPENCLAW_CONFIG}"
    else
        print_error "Config file NOT found: ${OPENCLAW_CONFIG}"
    fi
    echo ""

    # Check disk space
    echo "--- Disk Space ---"
    df -h "${HOME}" | tail -1
    echo ""

    # Check memory
    echo "--- Memory ---"
    vm_stat | grep -E "(Pages free|Pages active|Pages inactive|Pages wired)" | head -4
    echo ""

    echo "=== Health Check Complete ==="
}

# Command: logs [n]
# Show last n lines of gateway logs (default 50)
cmd_logs() {
    local lines="${1:-50}"
    local log_file="/tmp/openclaw/openclaw.err.log"

    echo "=== GodMode Gateway Logs (last ${lines} lines) ==="
    echo "Log file: ${log_file}"
    echo ""

    if [[ -f "${log_file}" ]]; then
        tail -n "${lines}" "${log_file}"
    else
        print_warning "Log file not found: ${log_file}"
        echo "Checking for alternative log locations..."

        # Try alternative locations
        for alt_log in "/tmp/openclaw/openclaw.out.log" "${HOME}/.openclaw/logs/gateway.log"; do
            if [[ -f "${alt_log}" ]]; then
                echo "Found: ${alt_log}"
                tail -n "${lines}" "${alt_log}"
                return 0
            fi
        done

        print_error "No log files found"
    fi
}

# Command: config
# Show configuration (with secrets redacted)
cmd_config() {
    echo "=== GodMode Configuration (secrets redacted) ==="
    echo "Config file: ${OPENCLAW_CONFIG}"
    echo ""

    if [[ -f "${OPENCLAW_CONFIG}" ]]; then
        # Redact sensitive fields
        cat "${OPENCLAW_CONFIG}" | \
            sed -E 's/("(api_key|apiKey|token|secret|password|key)"[[:space:]]*:[[:space:]]*")[^"]+"/\1[REDACTED]"/gi' | \
            sed -E 's/(sk-ant-[a-zA-Z0-9-]+)/[REDACTED]/g' | \
            sed -E 's/(sk-proj-[a-zA-Z0-9-]+)/[REDACTED]/g' | \
            sed -E 's/(xoxb-[a-zA-Z0-9-]+)/[REDACTED]/g' | \
            sed -E 's/(tskey-[a-zA-Z0-9-]+)/[REDACTED]/g'
    else
        print_error "Config file not found"
    fi
}

# Command: status
# Show service status via launchctl
cmd_status() {
    echo "=== GodMode Service Status ==="
    echo ""

    echo "--- LaunchAgent ---"
    launchctl print "gui/$(id -u)/${LAUNCHCTL_LABEL}" 2>&1 || echo "LaunchAgent not found"
    echo ""

    echo "--- Port Usage ---"
    lsof -i ":${GATEWAY_PORT}" 2>/dev/null || echo "Port ${GATEWAY_PORT} not in use"
    echo ""

    echo "--- Tailscale Status ---"
    if command -v tailscale &> /dev/null; then
        tailscale status 2>&1 | head -10
    else
        print_warning "Tailscale not installed"
    fi
}

# Command: network
# Network diagnostics
cmd_network() {
    echo "=== GodMode Network Diagnostics ==="
    echo ""

    echo "--- Local Gateway ---"
    if nc -z localhost "${GATEWAY_PORT}" 2>/dev/null; then
        print_status "Port ${GATEWAY_PORT} is open"
    else
        print_error "Port ${GATEWAY_PORT} is NOT open"
    fi
    echo ""

    echo "--- Internet Connectivity ---"
    if ping -c 1 -W 5 8.8.8.8 > /dev/null 2>&1; then
        print_status "Internet reachable (ping 8.8.8.8)"
    else
        print_error "Internet NOT reachable"
    fi
    echo ""

    echo "--- DNS Resolution ---"
    if host api.anthropic.com > /dev/null 2>&1; then
        print_status "DNS working (api.anthropic.com resolves)"
        host api.anthropic.com | head -1
    else
        print_error "DNS NOT working"
    fi
    echo ""

    echo "--- Tailscale Network ---"
    if command -v tailscale &> /dev/null; then
        tailscale netcheck 2>&1 | head -20
    else
        print_warning "Tailscale not installed"
    fi
}

# Command: restart
# Restart gateway via launchctl
cmd_restart() {
    echo "=== Restarting GodMode Gateway ==="
    echo ""

    echo "Stopping gateway..."
    launchctl kickstart -k "gui/$(id -u)/${LAUNCHCTL_LABEL}" 2>&1 || {
        print_warning "kickstart failed, trying bootout/bootstrap..."
        launchctl bootout "gui/$(id -u)/${LAUNCHCTL_LABEL}" 2>/dev/null || true
        sleep 2
        launchctl bootstrap "gui/$(id -u)" "${HOME}/Library/LaunchAgents/${LAUNCHCTL_LABEL}.plist" 2>&1
    }

    echo "Waiting for gateway to start..."
    sleep 3

    # Verify restart
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${GATEWAY_PORT}" | grep -q "200\|404"; then
        print_status "Gateway restarted successfully"
    else
        print_error "Gateway may not have restarted properly"
        echo "Run 'godmode-support health' for more details"
    fi
}

# Command: fix-permissions
# Fix file permissions on ~/.openclaw
cmd_fix_permissions() {
    echo "=== Fixing GodMode Permissions ==="
    echo ""

    if [[ -d "${OPENCLAW_DIR}" ]]; then
        echo "Fixing permissions on ${OPENCLAW_DIR}..."
        chmod -R u+rw "${OPENCLAW_DIR}"
        chmod 600 "${OPENCLAW_CONFIG}" 2>/dev/null || true
        print_status "Permissions fixed"

        echo ""
        echo "Current permissions:"
        ls -la "${OPENCLAW_DIR}" | head -10
    else
        print_error "Directory not found: ${OPENCLAW_DIR}"
    fi
}

# Command: clear-cache
# Clear temporary files
cmd_clear_cache() {
    echo "=== Clearing GodMode Cache ==="
    echo ""

    local cleared=0

    if [[ -d "${OPENCLAW_TMP}" ]]; then
        echo "Clearing ${OPENCLAW_TMP}..."
        rm -rf "${OPENCLAW_TMP:?}"/* 2>/dev/null || true
        print_status "Temp directory cleared"
        ((cleared++))
    fi

    # Clear any node_modules cache if exists
    if [[ -d "${HOME}/.npm/_cacache" ]]; then
        echo "npm cache exists (not clearing automatically)"
    fi

    if [[ ${cleared} -eq 0 ]]; then
        echo "No cache directories found to clear"
    fi

    echo ""
    print_status "Cache clear complete"
}

# Command: update
# Pull latest GodMode version
cmd_update() {
    echo "=== Updating GodMode ==="
    echo ""

    local godmode_dir="${HOME}/Projects/godmode-plugin"

    if [[ -d "${godmode_dir}" ]]; then
        echo "Pulling latest changes..."
        cd "${godmode_dir}"

        # Check for uncommitted changes — commit to WIP branch (never stash)
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            local current_branch
            current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
            if [ "$current_branch" = "main" ]; then
                local wip_branch="wip/pre-update-$(date +%Y%m%d-%H%M%S)"
                print_warning "Uncommitted changes on main — saving to ${wip_branch}..."
                git checkout -b "$wip_branch" && git add -A && git commit -m "WIP: auto-saved before GodMode update"
                git checkout main
            else
                print_warning "Uncommitted changes on ${current_branch} — committing as WIP..."
                git add -A && git commit -m "WIP: auto-saved before GodMode update on ${current_branch}"
            fi
        fi

        git pull origin main

        echo ""
        echo "Rebuilding..."
        if command -v pnpm &> /dev/null; then
            pnpm install && pnpm build
        elif command -v npm &> /dev/null; then
            npm install && npm run build
        else
            print_error "No package manager found (pnpm/npm)"
            exit 1
        fi

        echo ""
        echo "Restarting gateway..."
        cmd_restart

        print_status "Update complete"
    else
        print_error "GodMode directory not found: ${godmode_dir}"
        echo "Expected installation at: ${godmode_dir}"
    fi
}

# Command: version
# Show CLI version
cmd_version() {
    echo "godmode-support CLI v${SCRIPT_VERSION}"
}

# Command: help
# Show usage
cmd_help() {
    cat << EOF
godmode-support CLI v${SCRIPT_VERSION}

Usage: godmode-support <command> [args]

Diagnostic Commands (read-only):
  health              Check gateway health status
  logs [n]            Show last n log lines (default: 50)
  config              Show configuration (secrets redacted)
  status              Show service status
  network             Network diagnostics

Fix Commands (controlled mutations):
  restart             Restart gateway via launchctl
  fix-permissions     Fix ~/.openclaw file permissions
  clear-cache         Clear temporary files
  update              Pull latest GodMode and rebuild

Other:
  version             Show CLI version
  help                Show this help message

Note: This CLI enforces an allowlist. Only these commands are permitted
during GodMode support sessions.
EOF
}

# Main dispatcher
main() {
    local cmd="${1:-help}"
    shift || true

    case "${cmd}" in
        health)
            cmd_health "$@"
            ;;
        logs)
            cmd_logs "$@"
            ;;
        config)
            cmd_config "$@"
            ;;
        status)
            cmd_status "$@"
            ;;
        network)
            cmd_network "$@"
            ;;
        restart)
            cmd_restart "$@"
            ;;
        fix-permissions)
            cmd_fix_permissions "$@"
            ;;
        clear-cache)
            cmd_clear_cache "$@"
            ;;
        update)
            cmd_update "$@"
            ;;
        version|--version|-v)
            cmd_version
            ;;
        help|--help|-h)
            cmd_help
            ;;
        *)
            print_error "Unknown command: ${cmd}"
            echo ""
            cmd_help
            exit 1
            ;;
    esac
}

main "$@"
