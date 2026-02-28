# Support Log Directory Structure

This document describes the log directory structure for GodMode remote support.

## Base Path

```
~/godmode/support-logs/
```

## Directory Layout

```
~/godmode/support-logs/
├── conversations/           # Chat logs by customer
│   └── {customer-id}/
│       ├── 2026-02-01.md
│       ├── 2026-02-02.md
│       └── 2026-02-03.md
├── ssh-sessions/            # SSH session logs by customer
│   └── {customer-id}/
│       ├── 2026-02-01-093015.md   # YYYY-MM-DD-HHMMSS
│       └── 2026-02-03-141522.md
└── daily-digests/           # Daily summary digests
    ├── 2026-02-01.md
    ├── 2026-02-02.md
    └── 2026-02-03.md
```

## File Formats

### Conversation Log (`conversations/{customer-id}/YYYY-MM-DD.md`)

```markdown
# Support Log: {customer-id}

## YYYY-MM-DD

### HH:MM - Chat

**Customer:** [verbatim message]
**Atlas:** [verbatim response]
**Resolution:** [outcome: resolved | ongoing | escalated]

### HH:MM - Chat

**Customer:** [message]
**Atlas:** [response]
**Resolution:** [outcome]
```

### SSH Session Log (`ssh-sessions/{customer-id}/YYYY-MM-DD-HHMMSS.md`)

```markdown
# SSH Session: {customer-id}

## YYYY-MM-DD HH:MM:SS

**Issue:** [description of problem]
**Trigger:** [what led to SSH request]

### Approval

- **Requested:** HH:MM:SS
- **Granted:** HH:MM:SS
- **Window:** 15 minutes
- **Expires:** HH:MM:SS

### Commands Executed

| Time     | Command                   | Output Summary             | Status |
| -------- | ------------------------- | -------------------------- | ------ |
| HH:MM:SS | `godmode-support health`  | Gateway running, port open | OK     |
| HH:MM:SS | `godmode-support logs 50` | OOM detected at 14:32      | INFO   |
| HH:MM:SS | `godmode-support restart` | Gateway restarted          | OK     |

### Session End

- **Disconnected:** HH:MM:SS
- **Duration:** X minutes
- **Commands Run:** N

### Resolution

[What was fixed and how]

### Follow-up

[Any recommendations for customer or notes for the support lead]
```

### Daily Digest (`daily-digests/YYYY-MM-DD.md`)

```markdown
# GodMode Support Digest

## YYYY-MM-DD

### Summary

| Metric             | Value |
| ------------------ | ----- |
| Total Interactions | N     |
| Unique Customers   | N     |
| SSH Sessions       | N     |
| Escalations        | N     |
| Avg Response Time  | X min |

### By Customer

| Customer  | Chats | SSH | Resolved | Escalated |
| --------- | ----- | --- | -------- | --------- |
| acme-corp | 2     | 1   | 3        | 0         |
| beta-llc  | 1     | 0   | 1        | 0         |

### Common Issues

1. **[Issue Category]** (N occurrences)
   - Customers affected: [list]
   - Typical fix: [description]
   - Suggested action: [if pattern indicates systemic issue]

### SSH Session Details

#### acme-corp (14:15 - 14:18, 3 min)

- Issue: Gateway not responding
- Commands: health, logs, restart
- Resolution: Restarted after OOM kill

### Escalations

[None or list of escalated issues]

### Unresolved Issues

[None or list of ongoing issues]

### Suggested Action Items

- [ ] [Action based on patterns observed]
- [ ] [Action based on patterns observed]

---

_Generated: YYYY-MM-DD HH:MM:SS CT_
_Next digest: YYYY-MM-DD 18:00 CT_
```

## Initialization

Create the directory structure:

```bash
mkdir -p ~/godmode/support-logs/{conversations,ssh-sessions,daily-digests}
```

## Retention Policy

- **Conversations:** Keep indefinitely (low volume, useful for history)
- **SSH Sessions:** Keep for 1 year
- **Daily Digests:** Keep for 1 year

## Security Notes

- Logs may contain customer information (not secrets, those are redacted)
- Do not commit logs to git
- Logs are stored on the support host machine only
- SSH session logs do NOT include full command output, only summaries
