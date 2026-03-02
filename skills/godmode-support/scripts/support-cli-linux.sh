#!/bin/bash
# godmode-support CLI (Linux/VPS version)
# This script is installed on team VPS machines to provide allowlisted
# support commands. Atlas can only run these commands during SSH sessions.
#
# Installation: Copy to /usr/local/bin/godmode-support and chmod +x
# Usage: godmode-support <command> [args]

set -euo pipefail

SCRIPT_VERSION="1.0.0"
OPENCLAW_DIR="${HOME}/.openclaw"
OPENCLAW_CONFIG="${OPENCLAW_DIR}/config.json"
OPENCLAW_TMP="/tmp/openclaw"
SYSTEMD_SERVICE="openclaw-gateway"
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

# Detect init system
detect_init_system() {
    if command -v systemctl &> /dev/null && systemctl --version &> /dev/null; then
        echo "systemd"
    elif command -v service &> /dev/null; then
        echo "sysvinit"
    else
        echo "unknown"
    fi
}

INIT_SYSTEM=$(detect_init_system)

# Command: health
# Check gateway health status
cmd_health() {
    echo "=== GodMode Gateway Health Check (Linux) ==="
    echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "Init System: ${INIT_SYSTEM}"
    echo ""

    # Check if gateway process is running
    echo "--- Process Status ---"
    if pgrep -f "openclaw-gateway" > /dev/null 2>&1; then
        print_status "Gateway process is running"
        pgrep -af "openclaw-gateway" | head -3
    else
        print_error "Gateway process NOT running"
    fi
    echo ""

    # Check HTTP endpoint
    echo "--- HTTP Endpoint ---"
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${GATEWAY_PORT}" 2>/dev/null | grep -q "200\|404"; then
        print_status "HTTP endpoint responding on port ${GATEWAY_PORT}"
    else
        print_error "HTTP endpoint NOT responding on port ${GATEWAY_PORT}"
    fi
    echo ""

    # Check service status
    echo "--- Service Status ---"
    case "${INIT_SYSTEM}" in
        systemd)
            if systemctl is-active --quiet "${SYSTEMD_SERVICE}" 2>/dev/null; then
                print_status "Systemd service is active"
            else
                print_warning "Systemd service may not be active"
            fi
            systemctl status "${SYSTEMD_SERVICE}" --no-pager 2>&1 | head -10 || echo "Could not get service status"
            ;;
        sysvinit)
            service "${SYSTEMD_SERVICE}" status 2>&1 | head -5 || echo "Could not get service status"
            ;;
        *)
            print_warning "Unknown init system - skipping service check"
            ;;
    esac
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
    free -h | head -2
    echo ""

    # Check load average
    echo "--- Load Average ---"
    uptime
    echo ""

    echo "=== Health Check Complete ==="
}

# Command: logs [n]
# Show last n lines of gateway logs (default 50)
cmd_logs() {
    local lines="${1:-50}"

    echo "=== GodMode Gateway Logs (last ${lines} lines) ==="

    # Try journalctl first (systemd)
    if [[ "${INIT_SYSTEM}" == "systemd" ]]; then
        echo "Source: journalctl"
        echo ""
        journalctl -u "${SYSTEMD_SERVICE}" -n "${lines}" --no-pager 2>/dev/null || {
            print_warning "journalctl failed, trying log files..."
        }
    fi

    # Try common log file locations
    for log_file in \
        "/tmp/openclaw/openclaw.err.log" \
        "/tmp/openclaw/openclaw.out.log" \
        "${HOME}/.openclaw/logs/gateway.log" \
        "/var/log/openclaw/gateway.log" \
        "/var/log/${SYSTEMD_SERVICE}.log"; do
        if [[ -f "${log_file}" ]]; then
            echo ""
            echo "Log file: ${log_file}"
            tail -n "${lines}" "${log_file}"
            return 0
        fi
    done

    print_warning "No log files found in standard locations"
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
# Show service status
cmd_status() {
    echo "=== GodMode Service Status ==="
    echo ""

    echo "--- Service ---"
    case "${INIT_SYSTEM}" in
        systemd)
            systemctl status "${SYSTEMD_SERVICE}" --no-pager 2>&1 || echo "Service not found"
            ;;
        sysvinit)
            service "${SYSTEMD_SERVICE}" status 2>&1 || echo "Service not found"
            ;;
        *)
            print_warning "Unknown init system"
            ps aux | grep -E "openclaw|godmode" | grep -v grep || echo "No processes found"
            ;;
    esac
    echo ""

    echo "--- Port Usage ---"
    ss -tlnp 2>/dev/null | grep ":${GATEWAY_PORT}" || \
        netstat -tlnp 2>/dev/null | grep ":${GATEWAY_PORT}" || \
        echo "Port ${GATEWAY_PORT} not in use (or no permission to check)"
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
    if nc -z localhost "${GATEWAY_PORT}" 2>/dev/null || \
       (echo > /dev/tcp/localhost/${GATEWAY_PORT}) 2>/dev/null; then
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
    if host api.anthropic.com > /dev/null 2>&1 || \
       nslookup api.anthropic.com > /dev/null 2>&1 || \
       dig api.anthropic.com +short > /dev/null 2>&1; then
        print_status "DNS working (api.anthropic.com resolves)"
        host api.anthropic.com 2>/dev/null | head -1 || \
            nslookup api.anthropic.com 2>/dev/null | grep -A1 "Name:" | head -2
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
# Restart gateway service
cmd_restart() {
    echo "=== Restarting GodMode Gateway ==="
    echo ""

    case "${INIT_SYSTEM}" in
        systemd)
            echo "Restarting via systemctl..."
            sudo systemctl restart "${SYSTEMD_SERVICE}" 2>&1 || {
                print_warning "systemctl restart failed, trying user service..."
                systemctl --user restart "${SYSTEMD_SERVICE}" 2>&1 || {
                    print_error "Could not restart service"
                    exit 1
                }
            }
            ;;
        sysvinit)
            echo "Restarting via service..."
            sudo service "${SYSTEMD_SERVICE}" restart 2>&1
            ;;
        *)
            print_warning "Unknown init system, trying to restart process directly..."
            pkill -f "openclaw-gateway" 2>/dev/null || true
            sleep 2
            # Try to find and run the gateway
            if command -v openclaw &>/dev/null; then
                nohup openclaw gateway start > /tmp/openclaw/gateway.log 2>&1 &
            else
                print_error "Could not find gateway to restart"
                exit 1
            fi
            ;;
    esac

    echo "Waiting for gateway to start..."
    sleep 3

    # Verify restart
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${GATEWAY_PORT}" 2>/dev/null | grep -q "200\|404"; then
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

    # Clear node_modules cache if exists and is large
    if [[ -d "${HOME}/.npm/_cacache" ]]; then
        local cache_size
        cache_size=$(du -sm "${HOME}/.npm/_cacache" 2>/dev/null | cut -f1 || echo 0)
        if [[ ${cache_size} -gt 500 ]]; then
            echo "npm cache is ${cache_size}MB (not clearing automatically, run 'npm cache clean --force' if needed)"
        fi
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

        # Check for uncommitted changes
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            print_warning "Uncommitted changes detected, stashing..."
            git stash
        fi

        git pull origin main

        echo ""
        echo "Rebuilding..."
        if command -v pnpm &> /dev/null; then
            pnpm install && pnpm build
        elif command -v npm &> /dev/null; then
            npm install && npm run build
        elif command -v yarn &> /dev/null; then
            yarn install && yarn build
        else
            print_error "No package manager found (pnpm/npm/yarn)"
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
    echo "godmode-support CLI v${SCRIPT_VERSION} (Linux)"
    echo "Init system: ${INIT_SYSTEM}"
}

# Command: help
# Show usage
cmd_help() {
    cat << EOF
godmode-support CLI v${SCRIPT_VERSION} (Linux)

Usage: godmode-support <command> [args]

Diagnostic Commands (read-only):
  health              Check gateway health status
  logs [n]            Show last n log lines (default: 50)
  config              Show configuration (secrets redacted)
  status              Show service status
  network             Network diagnostics

Fix Commands (controlled mutations):
  restart             Restart gateway service
  fix-permissions     Fix ~/.openclaw file permissions
  clear-cache         Clear temporary files
  update              Pull latest GodMode and rebuild

Other:
  version             Show CLI version
  help                Show this help message

Note: This CLI enforces an allowlist. Only these commands are permitted
during GodMode support sessions.

Detected init system: ${INIT_SYSTEM}
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
