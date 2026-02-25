#!/bin/bash
# daily-digest.sh
# Generates daily support digest from conversation and SSH session logs
#
# Usage: ./daily-digest.sh [date]
#   date: Optional, defaults to today (YYYY-MM-DD format)
#
# Run via cron at 6 PM CT daily:
#   0 18 * * * /path/to/daily-digest.sh >> /tmp/digest-cron.log 2>&1

set -euo pipefail

# Configuration
SUPPORT_LOGS="${HOME}/godmode/support-logs"
CONVERSATIONS_DIR="${SUPPORT_LOGS}/conversations"
SSH_SESSIONS_DIR="${SUPPORT_LOGS}/ssh-sessions"
DIGESTS_DIR="${SUPPORT_LOGS}/daily-digests"
CUSTOMER_REGISTRY="${HOME}/.godmode/customers.json"

# Date to generate digest for (default: today)
DIGEST_DATE="${1:-$(date +%Y-%m-%d)}"
OUTPUT_FILE="${DIGESTS_DIR}/${DIGEST_DATE}.md"

# Ensure directories exist
mkdir -p "${DIGESTS_DIR}"

# Initialize counters
total_chats=0
total_ssh=0
total_escalations=0
declare -A customer_chats
declare -A customer_ssh
declare -A customer_resolved
declare -A customer_escalated
declare -a issues_list
declare -a ssh_details
declare -a escalations
declare -a unresolved

# Process conversation logs
process_conversations() {
    if [[ ! -d "${CONVERSATIONS_DIR}" ]]; then
        return
    fi

    for customer_dir in "${CONVERSATIONS_DIR}"/*/; do
        if [[ ! -d "${customer_dir}" ]]; then
            continue
        fi

        customer_id=$(basename "${customer_dir}")
        log_file="${customer_dir}${DIGEST_DATE}.md"

        if [[ -f "${log_file}" ]]; then
            # Count chat interactions
            chats=$(grep -c "^### [0-9]" "${log_file}" 2>/dev/null || echo 0)
            total_chats=$((total_chats + chats))
            customer_chats["${customer_id}"]=${chats}

            # Count resolutions
            resolved=$(grep -c "Resolution:.*resolved" "${log_file}" 2>/dev/null || echo 0)
            customer_resolved["${customer_id}"]=${resolved}

            # Count escalations
            escalated=$(grep -c "Resolution:.*escalated" "${log_file}" 2>/dev/null || echo 0)
            total_escalations=$((total_escalations + escalated))
            customer_escalated["${customer_id}"]=${escalated}

            # Extract issues for pattern analysis
            while IFS= read -r line; do
                issues_list+=("${line}")
            done < <(grep "^\*\*Customer:\*\*" "${log_file}" 2>/dev/null | head -20)
        fi
    done
}

# Process SSH session logs
process_ssh_sessions() {
    if [[ ! -d "${SSH_SESSIONS_DIR}" ]]; then
        return
    fi

    for customer_dir in "${SSH_SESSIONS_DIR}"/*/; do
        if [[ ! -d "${customer_dir}" ]]; then
            continue
        fi

        customer_id=$(basename "${customer_dir}")

        # Find sessions for this date
        for session_file in "${customer_dir}${DIGEST_DATE}"-*.md; do
            if [[ -f "${session_file}" ]]; then
                total_ssh=$((total_ssh + 1))
                customer_ssh["${customer_id}"]=$((${customer_ssh["${customer_id}"]:-0} + 1))

                # Extract session details
                session_time=$(basename "${session_file}" .md | sed 's/.*-//')
                issue=$(grep "^\*\*Issue:\*\*" "${session_file}" 2>/dev/null | sed 's/\*\*Issue:\*\* //' || echo "Unknown")
                duration=$(grep "^\*\*Duration:\*\*" "${session_file}" 2>/dev/null | sed 's/\*\*Duration:\*\* //' || echo "Unknown")
                resolution=$(grep -A1 "^### Resolution" "${session_file}" 2>/dev/null | tail -1 || echo "See log")

                ssh_details+=("#### ${customer_id} (${session_time}, ${duration})")
                ssh_details+=("- Issue: ${issue}")
                ssh_details+=("- Resolution: ${resolution}")
                ssh_details+=("")
            fi
        done
    done
}

# Generate the digest
generate_digest() {
    local unique_customers=${#customer_chats[@]}

    cat > "${OUTPUT_FILE}" << EOF
# GodMode Support Digest
## ${DIGEST_DATE}

### Summary
| Metric | Value |
|--------|-------|
| Total Interactions | ${total_chats} |
| Unique Customers | ${unique_customers} |
| SSH Sessions | ${total_ssh} |
| Escalations | ${total_escalations} |

### By Customer
| Customer | Chats | SSH | Resolved | Escalated |
|----------|-------|-----|----------|-----------|
EOF

    # Add customer rows
    for customer_id in "${!customer_chats[@]}"; do
        chats=${customer_chats["${customer_id}"]:-0}
        ssh=${customer_ssh["${customer_id}"]:-0}
        resolved=${customer_resolved["${customer_id}"]:-0}
        escalated=${customer_escalated["${customer_id}"]:-0}
        echo "| ${customer_id} | ${chats} | ${ssh} | ${resolved} | ${escalated} |" >> "${OUTPUT_FILE}"
    done

    # Add customers with only SSH (no chats)
    for customer_id in "${!customer_ssh[@]}"; do
        if [[ -z "${customer_chats["${customer_id}"]:-}" ]]; then
            ssh=${customer_ssh["${customer_id}"]:-0}
            echo "| ${customer_id} | 0 | ${ssh} | 0 | 0 |" >> "${OUTPUT_FILE}"
        fi
    done

    cat >> "${OUTPUT_FILE}" << EOF

### SSH Session Details
EOF

    if [[ ${#ssh_details[@]} -gt 0 ]]; then
        for line in "${ssh_details[@]}"; do
            echo "${line}" >> "${OUTPUT_FILE}"
        done
    else
        echo "*No SSH sessions today*" >> "${OUTPUT_FILE}"
    fi

    cat >> "${OUTPUT_FILE}" << EOF

### Escalations
EOF

    if [[ ${total_escalations} -gt 0 ]]; then
        echo "*${total_escalations} escalation(s) - see individual logs for details*" >> "${OUTPUT_FILE}"
    else
        echo "*None*" >> "${OUTPUT_FILE}"
    fi

    cat >> "${OUTPUT_FILE}" << EOF

### Suggested Action Items
- [ ] Review any escalated issues
- [ ] Check for recurring patterns
- [ ] Update documentation if common issues found

---
*Generated: $(date '+%Y-%m-%d %H:%M:%S %Z')*
EOF

    echo "Digest generated: ${OUTPUT_FILE}"
}

# Main
main() {
    echo "Generating digest for ${DIGEST_DATE}..."

    # Ensure base directories exist
    mkdir -p "${CONVERSATIONS_DIR}" "${SSH_SESSIONS_DIR}" "${DIGESTS_DIR}"

    process_conversations
    process_ssh_sessions
    generate_digest

    # Output summary
    echo ""
    echo "Summary:"
    echo "  Chats: ${total_chats}"
    echo "  SSH Sessions: ${total_ssh}"
    echo "  Escalations: ${total_escalations}"
    echo ""
    echo "Output: ${OUTPUT_FILE}"
}

main "$@"
