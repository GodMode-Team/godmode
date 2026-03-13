# GodMode Remote Support Skill

**Purpose:** Provide first-line customer support for GodMode users via Telegram DM, including remote diagnostics and SSH access (with approval) to customer Mac Minis.

**Invoke:** Customer messages {{ALLY_NAME}} directly via Telegram DM for GodMode help.

---

## Overview

This skill enables {{ALLY_NAME}} to:

1. Answer GodMode questions and provide guidance
2. Perform remote diagnostics via allowlisted commands
3. SSH into customer machines (with per-session approval) to fix problems
4. Log all interactions for audit and daily digest

**Security Model:** Tailscale SSH (no stored keys), per-session customer approval, command allowlist, full audit trail.

---

## Support Hours

- **Chat support:** 24/7 ({{ALLY_NAME}} always responds to messages)
- **SSH access:** 9 AM - 5 PM Central Time only
- **Escalation:** Issues outside SSH hours are logged for next business day

**SSH Hour Check:**

```bash
# Check if within SSH hours (adjust TZ to your support timezone)
current_hour=$(TZ=${SUPPORT_TIMEZONE:-UTC} date +%H)
if [[ $current_hour -ge 9 && $current_hour -lt 17 ]]; then
  echo "SSH allowed"
else
  echo "SSH not allowed - outside 9-5 CT"
fi
```

---

## Support Channel: Telegram DM

Each customer DMs {{ALLY_NAME}} directly via a dedicated support Telegram bot.

**Setup:**

1. Support bot: `@GodModeSupportBot` (separate from main {{ALLY_NAME}} bot)
2. Customer given bot username during onboarding
3. {{ALLY_NAME}} routes messages to this skill via Telegram user ID lookup

**Bot Token:** `8389581060:AAGvq-Rzd7CJmQafd55dlrHIek0igeIyRMo`
(See `references/telegram-bot-setup.md` for full bot configuration)

**Customer Identification:**

- Telegram user ID maps to customer ID in registry
- Registry location: `~/.godmode/customers.json`

---

## Capabilities

### 1. Answer GodMode Questions

Common topics:

- Feature usage and configuration
- Integration setup (Slack, Telegram, etc.)
- Troubleshooting guides (self-service)
- Best practices

**Example:**

```
Customer: "How do I change the morning brief time?"
{{ALLY_NAME}}: "You can update it in ~/.openclaw/config.json under the 'briefs' section.
        Set 'time' to your preferred time in 24-hour format (e.g., '07:00').
        Want me to walk you through it?"
```

### 2. Remote Diagnostics (No SSH)

Before requesting SSH, try these diagnostics that don't require connection:

- Ask customer to run commands and share output
- Check against known issues database
- Provide self-service fix instructions

### 3. SSH Diagnostics (Requires Approval)

When self-service fails, request SSH access.

**Flow:**

1. {{ALLY_NAME}} determines SSH is needed
2. Check if within SSH hours (9-5 CT)
3. Send message: "I need to connect to your Mac Mini to fix this. You'll get a Tailscale notification to approve."
4. Customer receives Tailscale push notification
5. Customer taps "Approve" (grants 15-minute access window)
6. {{ALLY_NAME}} connects via `godmode-support` CLI
7. Run only allowlisted commands
8. Log everything
9. Connection auto-expires

**SSH Not Allowed Response:**

```
"SSH access is available 9 AM - 5 PM Central Time. I've logged this issue
and will reach out first thing tomorrow. In the meantime, here's what you
can try yourself: [self-service steps]"
```

### 4. Escalation

**Auto-escalate to the admin when:**

- 2 failed fix attempts (restart didn't help, cache clear didn't help)
- Issue requires non-allowlisted commands
- Customer requests human support
- Data loss risk detected
- {{ALLY_NAME}} determines complexity exceeds capability

**Escalation message to customer:**

```
"This needs the team's attention. I've logged everything and someone will follow up
[today/tomorrow]. Is there anything else I can help with in the meantime?"
```

---

## Command Allowlist

{{ALLY_NAME}} can ONLY run these commands via `godmode-support` CLI:

```bash
# Diagnostics (read-only)
godmode-support health          # Check gateway health
godmode-support logs [n]        # View last n log lines (default: 50)
godmode-support config          # Show config (secrets redacted)
godmode-support status          # Service status (launchctl)
godmode-support network         # Network diagnostics (ping, DNS, ports)

# Fixes (controlled mutations)
godmode-support restart         # Restart gateway via launchctl
godmode-support fix-permissions # Fix ~/.openclaw file permissions
godmode-support clear-cache     # Clear /tmp/openclaw temp files
godmode-support update          # Pull latest GodMode version

# NOT allowed (require escalation)
# - Arbitrary shell commands
# - Direct file editing
# - Package installation
# - Network/firewall changes
# - Anything not in this list
```

---

## Customer Registry

**Location:** `~/.godmode/customers.json`

**Schema:**

```json
{
  "customers": [
    {
      "id": "acme-corp",
      "name": "Acme Corporation",
      "contact": "user@example.com",
      "tailscaleHostname": "acme-corp-godmode",
      "telegramUserId": "123456789",
      "sshConsent": true,
      "consentDate": "2026-02-01",
      "timezone": "America/New_York",
      "notes": "Example hardware note"
    }
  ]
}
```

**Required fields:** `id`, `name`, `tailscaleHostname`, `telegramUserId`
**Optional fields:** `contact`, `sshConsent`, `consentDate`, `timezone`, `notes`

---

## Tailscale SSH Configuration

**ACL Policy:** (Apply in Tailscale admin console)

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:godmode-support"],
      "dst": ["tag:godmode-customer:22"]
    }
  ],
  "tagOwners": {
    "tag:godmode-support": ["support@example.com"],
    "tag:godmode-customer": ["support@example.com"]
  },
  "ssh": [
    {
      "action": "check",
      "src": ["tag:godmode-support"],
      "dst": ["tag:godmode-customer"],
      "users": ["autogroup:nonroot"]
    }
  ]
}
```

**Key security features:**

- `action: "check"` requires per-session approval via Tailscale app
- No SSH keys stored (identity-based auth)
- 15-minute approval window, auto-expires
- Full audit in Tailscale admin console

---

## Audit & Logging

### Log Locations

```
~/godmode/support-logs/
├── conversations/
│   └── {customer-id}/
│       └── YYYY-MM-DD.md
├── ssh-sessions/
│   └── {customer-id}/
│       └── YYYY-MM-DD-HHMMSS.md
└── daily-digests/
    └── YYYY-MM-DD.md
```

### Conversation Log Format

```markdown
# Support Log: {customer-id}

## YYYY-MM-DD

### HH:MM - Chat

**Customer:** [message]
**{{ALLY_NAME}}:** [response]
**Resolution:** [outcome or "ongoing"]

### HH:MM - SSH Session

**Issue:** [description]
**Customer Approval:** Granted at HH:MM (15-min window)
**Commands Run:**

- `godmode-support health` → [output summary]
- `godmode-support restart` → success
  **Session End:** HH:MM (X min)
  **Resolution:** [what was fixed]
```

### Daily Digest

**Generated:** 6 PM Central daily
**Delivered to:** Admin via Slack DM

**Content:**

- Summary: total interactions, SSH sessions, escalations
- Per-customer breakdown
- Common issues (patterns)
- SSH session details
- Unresolved items
- Suggested action items

See `scripts/daily-digest.sh` for generator.

---

## Customer Onboarding Checklist

When setting up a new customer Mac Mini:

1. **Install Tailscale**

   ```bash
   brew install tailscale
   sudo tailscaled install-system-daemon
   ```

2. **Join GodMode Support Tailnet**

   ```bash
   tailscale up --auth-key=tskey-XXXXX --hostname={customer-name}-godmode
   ```

3. **Enable Tailscale SSH**

   ```bash
   tailscale set --ssh
   ```

4. **Install Support CLI**

   ```bash
   curl -fsSL https://lifeongodmode.com/install-support-cli.sh | bash
   # Or manually copy from skills/godmode-support/scripts/support-cli.sh
   ```

5. **Tag Machine** (Tailscale admin console)
   - Add tag: `godmode-customer`

6. **Add to Customer Registry**
   - Update `~/.godmode/customers.json` with customer details

7. **Onboard to Telegram**
   - Give customer `@GodModeSupportBot` username
   - Have them send initial message
   - Map their Telegram user ID to customer ID

8. **Verbal Consent** (during onboarding call)
   > "GodMode includes AI-powered support. If you have issues, you can message
   > our support AI directly on Telegram. For complex issues, the AI may request
   > remote access to diagnose. You'll get a notification and must approve each
   > time. You can see everything it does. This is optional - you can always
   > decline and we'll schedule a call with the team instead."

---

## Error Handling

### Customer Not Found

```
"I don't recognize your Telegram account. Please contact your GodMode admin
to get set up with GodMode support."
```

### SSH Consent Not Granted

```
"You haven't opted into remote support access. Would you like me to
walk you through what I'd check if you grant access? Or I can describe
the steps for you to run yourself."
```

### SSH Connection Failed

```
"I couldn't connect to your Mac Mini. Please check:
1. It's powered on and connected to internet
2. Tailscale is running (check menu bar icon)
3. Try 'tailscale status' in Terminal

If all looks good, let me know and I'll escalate to the team."
```

### Command Failed

```
"The [command] didn't work as expected. Output:
[sanitized output]

Let me try [alternative] or I can escalate this to the team."
```

---

## Scripts

- `scripts/support-cli.sh` - CLI wrapper for customer machines (enforces allowlist)
- `scripts/daily-digest.sh` - Generates daily digest from logs

---

## Success Criteria

A good support interaction should:

- Resolve issue without escalation (when possible)
- Minimize time to resolution
- Leave clear audit trail
- Not require SSH when self-service works
- Never run non-allowlisted commands
- Always get explicit approval for SSH

---

## Team Onboarding via Telegram or Slack

This workflow allows the admin to introduce new team members to {{ALLY_NAME}} via group chat, then onboard them.

**Supported channels:**

- **Telegram:** Group chat → DM handoff (requires @mention in groups)
- **Slack:** Group DM → Onboard in same thread (no @mention needed)

### The Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. INTRODUCTION (Group Chat)                                    │
│    Admin creates group: "Admin & [Name], GodModeSupportBot"    │
│    Admin: "@GodModeSupportBot hey, meet [Name]"                │
│    {{ALLY_NAME}} responds (admin is on allowlist, mentioned bot)        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. ALLOWLIST UPDATE ({{ALLY_NAME}} does this automatically)            │
│    - Extract new person's Telegram user ID from message        │
│    - Add to allowFrom + groupAllowFrom in config.json          │
│    - Gateway hot-reloads config                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. HANDOFF TO DM                                               │
│    {{ALLY_NAME}}: "Hey [Name]! Great to meet you. Tap my name and     │
│    send me a DM - I'll walk you through the full setup."      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. ONBOARDING IN DM                                            │
│    - User DMs @GodModeSupportBot (now on allowlist)           │
│    - {{ALLY_NAME}} runs godmode-onboarding skill                       │
│    - Full installation, config, 3-day journey setup           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. VISIBILITY FOR ADMIN                                        │
│    - All DM conversations logged                               │
│    - {{ALLY_NAME}} forwards summaries to admin (Slack/web UI)         │
│    - Daily digest includes onboarding progress                 │
└─────────────────────────────────────────────────────────────────┘
```

### Group Chat Requirements

- **The admin must @mention the bot** to trigger {{ALLY_NAME}} in groups (`requireMention: true`)
- Group members who aren't on the allowlist can see the conversation but {{ALLY_NAME}} won't respond to them directly
- After {{ALLY_NAME}} adds someone to the allowlist, they can trigger {{ALLY_NAME}} (with @mention in groups, no mention needed in DMs)

### Example Conversation

**In Group Chat:**

```
Admin: "@GodModeSupportBot hey, this is Alex. He's getting
       set up with GodMode on his new Mac Mini."

{{ALLY_NAME}}: "Hey Alex! Nice to meet you. I'm {{ALLY_NAME}}, your AI assistant
       for GodMode. I've added you to my contacts.

       To get started with your full setup, tap my name and send
       me a direct message. I'll walk you through everything -
       installation, configuration, and how to get the most out
       of GodMode.

       Looking forward to helping you out!"
```

**In DM (User → {{ALLY_NAME}}):**

```
Alex: "Hey, I was told you can help me set up GodMode?"

{{ALLY_NAME}}: "Absolutely! Welcome to GodMode, Alex. Let's get you set up.

       First question: Is your Mac Mini already powered on and
       connected to the internet?

       [continues with godmode-onboarding skill...]"
```

---

## Allowlist Management

{{ALLY_NAME}} manages the Telegram allowlist by editing the gateway config file.

### Config Location

```
~/.openclaw/config.json
```

### Relevant Config Section

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "...",
      "dmPolicy": "allowlist",
      "allowFrom": [
        "YOUR_TELEGRAM_ID" // admin
      ],
      "groupPolicy": "allowlist",
      "groupAllowFrom": [
        "YOUR_TELEGRAM_ID" // admin
      ],
      "groups": {
        "*": {
          "requireMention": true,
          "skills": ["godmode-onboarding"]
        }
      }
    }
  }
}
```

### Adding a New User

When the admin introduces someone in a group chat, {{ALLY_NAME}}:

1. **Extracts the user ID** from the Telegram message metadata
2. **Reads the config file**
3. **Adds the new ID** to both `allowFrom` and `groupAllowFrom` arrays
4. **Writes the updated config**
5. **Gateway auto-reloads** (watches config file for changes)

**Example edit command:**

```bash
# {{ALLY_NAME}} uses the Edit tool to add new user ID
# In allowFrom array:
"allowFrom": [
  "ADMIN_TELEGRAM_ID",
  "987654321"    // ← New user added
]

# In groupAllowFrom array:
"groupAllowFrom": [
  "ADMIN_TELEGRAM_ID",
  "987654321"    // ← New user added
]
```

### Security Notes

- Only the admin can trigger the allowlist addition (they're the only one on the list who can @mention in groups)
- New users can only DM or participate in groups - they cannot trigger allowlist additions themselves
- All allowlist changes are logged and visible in config file history

---

## Conversation Visibility

The admin wants to see all support/onboarding conversations for UX research and quality assurance.

### Real-Time Forwarding

After each support or onboarding conversation, {{ALLY_NAME}} sends a summary to the admin:

**Via Slack DM:**

```
📱 Support Conversation Summary

Who: [User Name]
Channel: Telegram DM
Duration: 15 minutes
Topic: Initial GodMode onboarding

Key Points:
- Walked through Tailscale installation
- Set up daily brief schedule
- Answered questions about voice commands

Questions Asked:
1. "How do I talk to you from my phone?"
2. "Can you control my smart home?"
3. "What if I want you to do something automatically?"

Next Steps:
- User will complete Day 1 of onboarding tomorrow
- Follow-up scheduled for Day 2 check-in

Overall: Smooth onboarding, user is excited about the daily brief feature.
```

### Log Files

All conversations are logged to:

```
~/godmode/support-logs/conversations/{person-id}/YYYY-MM-DD.md
```

The admin can read these directly or {{ALLY_NAME}} can summarize on request.

### Daily Digest Enhancement

The 6 PM daily digest includes an onboarding section:

```markdown
## Onboarding Activity

### [User] - Day 1

- Started: 3:45 PM CT
- Duration: 25 minutes
- Status: Day 1 complete
- Questions: 5 (all answered)
- Issues: None
- Sentiment: Positive ("this is really cool")

### Upcoming

- [User]: Day 2 check-in tomorrow
- [User2]: Intro scheduled for this weekend
```

---

## Scripts

- `scripts/support-cli.sh` - macOS CLI wrapper for customer machines (enforces allowlist)
- `scripts/support-cli-linux.sh` - Linux/VPS CLI wrapper (systemd-based)
- `scripts/daily-digest.sh` - Generates daily digest from logs

---

## Success Criteria

A good support interaction should:

- Resolve issue without escalation (when possible)
- Minimize time to resolution
- Leave clear audit trail
- Not require SSH when self-service works
- Never run non-allowlisted commands
- Always get explicit approval for SSH

A good onboarding interaction should:

- Feel welcoming and low-friction
- Guide user through setup step-by-step
- Answer questions patiently
- Log everything for admin visibility
- Set clear expectations about GodMode capabilities

---

## Feature Reference (for answering user questions)

When users ask about GodMode capabilities, reference this list:

| Feature | Tab | Description |
|---------|-----|-------------|
| Daily Brief | My Day | AI-generated daily brief with tasks, calendar, intel. Always editable (contenteditable). |
| Focus Pulse | My Day | Timed focus sessions with AI check-ins. Win the Day task curation. |
| Task Manager | Work | Full task CRUD with priorities, due dates, brief section linking. |
| Agent Queue | Work | Queue tasks for background AI agents. Auto-processes every 10 min. |
| Coding Orchestrator | Work | Spawn coding agents in isolated git worktrees. PR creation, validation gates. |
| Second Brain | Brain | Vault-first knowledge system. PARA structure in Obsidian vault. |
| Vault Capture | Brain | Auto-capture pipelines: scout findings, sessions, queue outputs to vault. |
| Dashboards | Dashboards | Custom data views built by AI. Per-dashboard chat sessions. |
| Trust Tracker | Settings | Rate AI task quality 1-10. Scores inform agent assignment. |
| Custom Guardrails | Settings (Lab) | User-defined rules for agent behavior. JSON config, not code. |
| Safety Gates | Always on | Loop breaker, exhaustive search, persistence, prompt/output shield. |
| Proactive Intel | Background | Auto-fetches news, X intel, market trends for daily brief. |
| Consciousness Sync | Background | Hourly auto-sync of CONSCIOUSNESS.md with tasks, calendar, brief. |
| Obsidian Sync | Background | Headless vault sync via `obsidian-headless` CLI (optional). |
| Agent Roster | Background | Persona files define agent specializations. Auto-routing for queued tasks. |

### Common Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Gateway Offline" in UI | `openclaw gateway restart` |
| LICENSE_REQUIRED errors | `openclaw godmode activate GM-DEV-TEAM-2026` |
| Chat not responding | Check gateway logs: `openclaw gateway logs` |
| Daily brief empty | Run: ask {{ALLY_NAME}} "generate my daily brief" |
| Focus Pulse not ticking | Check if enabled in Lab tab settings |
| Dashboard shows no data | Verify queue file exists: `~/godmode/data/queue.json` |
| Second Brain not syncing | Check vault path: `echo $OBSIDIAN_VAULT_PATH` |

---

## Plugin Architecture — Deep Troubleshooting Reference

**Use this section when simple fixes don't work. This covers the internals.**

### Current Version

- **npm package:** `@godmode-team/godmode@1.3.0`
- **Install:** `openclaw plugins install @godmode-team/godmode`
- **Team license key:** `GM-DEV-TEAM-2026`

### Quick Diagnostic Checklist

When a user reports a problem, walk them through this:

1. **Gateway running?** → `openclaw gateway status`
2. **Plugin loaded?** → Open `http://localhost:18789/godmode/health` — should return JSON with `status: "ok"`
3. **License valid?** → Health endpoint shows `license.status: "valid"`
4. **UI available?** → Health endpoint shows `ui.available: true`
5. **Correct version?** → `npm list @godmode-team/godmode` should show `1.2.0`

### Startup Sequence

When the gateway starts, the plugin initializes in two phases:

**Phase 1 — register() (synchronous, immediate):**
1. License validation starts in background (non-blocking)
2. ~120 RPC methods registered across all namespaces
3. All methods except `onboarding.*` wrapped with `withLicenseGate()`
4. UI assets resolved: tries `dist/godmode-ui/` → `ui/dist/` → `assets/godmode-ui/`
5. HTTP routes: `/godmode/health`, `/godmode/*` (UI), `/ops/*` (Mission Control)

**Phase 2 — gateway_start (async, ~15s after register):**
Services start in order. All failures are non-fatal (logged, continues):
1. Agent log writer → Workspace sync → Curation agent
2. Session auto-archive → Image cache cleanup
3. Claude Code session sync → IDE Activity Watcher
4. Post-update health check
5. Focus Pulse heartbeat (resumes if active)
6. **Consciousness heartbeat** (15-min interval)
7. Proactive Intelligence
8. Coding task recovery (orphaned task reattachment)
9. **Queue processor** (10-min polling)
10. **Obsidian Sync** (headless vault integration)

### License System Internals

**Dev keys bypass validation entirely:**
- Any key matching `GM-DEV-*` → immediate pass, tier = "developer"
- `GM-INTERNAL` → immediate pass
- Team key: `GM-DEV-TEAM-2026`

**Production keys:**
- Validated against `https://lifeongodmode.com/api/v1/license/validate`
- Cache: 24 hours — re-validates after expiry
- Grace period: If server unreachable but cached within 24h, allows through
- All concurrent RPC calls wait on the same validation promise

**License troubleshooting:**

| Error | Cause | Fix |
|---|---|---|
| `LICENSE_REQUIRED` | No key in config | Add `licenseKey` to `~/.openclaw/openclaw.json` under `plugins.entries.godmode.config` |
| `LICENSE_INVALID` | Bad key or validation server down | Check key format (must start with `GM-`), check network |
| License valid but features blocked | Stale cache | Restart gateway |

### File Paths & Data Locations

```
~/godmode/
├── data/
│   ├── godmode-options.json          ← feature toggles
│   ├── onboarding.json               ← 7-phase setup state
│   ├── guardrails.json               ← custom rules
│   ├── coding-tasks.json             ← active/completed coding tasks
│   ├── queue-items.json              ← background task queue
│   ├── tasks.json                    ← task list
│   ├── vault-capture-state.json      ← auto-capture pipeline state
│   └── snapshots/                    ← daily session snapshots
├── memory/
│   ├── CONSCIOUSNESS.md              ← heartbeat output (every 15min)
│   ├── WORKING.md                    ← current session state
│   ├── USER.md, SOUL.md, VISION.md   ← identity files
│   ├── agent-log/                    ← session records
│   └── agent-roster/                 ← persona files
└── scripts/
    └── consciousness-sync.sh         ← bash script (90s timeout)
```

**Vault paths (Obsidian):**
```
$OBSIDIAN_VAULT_PATH or ~/Documents/VAULT/
├── 00-Inbox/              ← quick capture
├── 01-Daily/YYYY-MM-DD.md ← daily briefs
├── 02-Projects/           ← active work
├── 06-Brain/              ← People, Companies, Knowledge
├── 07-Agent-Log/          ← Claude Code sessions (auto-synced)
├── 08-Identity/           ← USER.md, SOUL.md, VISION.md
└── 99-System/
    ├── agent-roster/      ← persona files
    ├── team-onboarding-guide.md
    └── godmode-plugin-internals.md  ← full internals reference
```

**Path resolution:** Vault first → `~/godmode/memory/` fallback.

### Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `GODMODE_ROOT` | `~/godmode` | Root data directory |
| `OBSIDIAN_VAULT_PATH` | `~/Documents/VAULT` | Obsidian vault location |
| `DAILY_BRIEF_FOLDER` | `01-Daily` | Vault subfolder for daily briefs |
| `OPENCLAW_STATE_DIR` | `~/.openclaw` | OpenClaw session state |
| `XAI_API_KEY` | (none) | X/Twitter intelligence via Grok |

### Deep Troubleshooting by System

#### Gateway Won't Start / Plugin Not Loading
```bash
# Is plugin installed?
openclaw plugin list
# Should show: @godmode-team/godmode@1.2.0

# Check logs for errors
openclaw gateway logs

# Is the port free?
lsof -i :3000
```

#### UI Shows Blank Page or 404
- Reinstall: `openclaw plugin install @godmode-team/godmode`
- Check `/godmode/health` — `ui.available` should be `true`
- If developing locally: `pnpm build` in plugin repo, then restart gateway
- Asset fallback: `assets/godmode-ui/` is a committed npm snapshot

#### Consciousness Sync Fails or Hangs
- **Timeout (90s):** consciousness-sync.sh is stalling
  - Test manually: `bash ~/godmode/scripts/consciousness-sync.sh`
  - Check it exists: `ls -la ~/godmode/scripts/consciousness-sync.sh`
- **NOT_FOUND:** Script missing — heartbeat falls back to reading existing CONSCIOUSNESS.md
- **UI feedback:** Consciousness button shows 4 states: idle (grey), loading (pulse), ok (green glow), error (red glow)

#### Daily Brief Not Saving or Loading
- Check vault path: `echo $OBSIDIAN_VAULT_PATH` or verify `~/Documents/VAULT` exists
- Check daily folder: `ls ~/Documents/VAULT/01-Daily/`
- Brief is vault-first — if vault missing, falls back to `~/godmode/memory/`
- Checkbox issues: NBSP bug (U+00A0) is auto-stripped in all markdown pipelines

#### Coding Task Stuck on "running"
- Check PID in `~/godmode/data/coding-tasks.json`
- **Auto-recovery on restart:** `recoverOrphanedTasks()` runs on gateway_start
  - Dead PID → reattach or mark failed
  - Output found → move to review
- Worktree issues: `git worktree list` in target repo

#### Queue Items Not Processing
- Queue processor polls every 10 minutes automatically
- Force immediate: Call `queue.process` RPC via chat
- Items need status `pending` or `ready` to be picked up
- **Recovery on restart:** `recoverOrphaned()` checks for stuck items
- If persona routing set but persona file missing → falls back to default agent

#### Safety Gates Blocking Legitimate Actions
- Loop breaker: warns at 40 calls/30min, blocks at 50
- Burst detection: 10+ same-tool calls in <2min
- Config: `~/godmode/data/guardrails.json`
- Check active rules: `guardrails.list` RPC

### Gateway Restart Behavior

**Persists (survives restart):**
- All `~/godmode/data/*.json` files
- All `~/godmode/memory/*.md` files
- Vault data
- License cache (24h TTL)

**Resets:**
- In-memory caches (options 5s TTL, guardrails 30s TTL)
- Active timers/polling loops
- Service connections
- PID tracking (recovery re-runs)

**Recovery sequence on restart:**
1. Coding tasks: Check PIDs, reattach or mark failed
2. Queue items: Check outputs, move to review or reset to pending
3. Services resume: Focus Pulse, Consciousness, Queue Processor, Obsidian Sync

### Build & Update Commands (for developers/Prosper)

```bash
pnpm build          # Full build: code + UI + bundle
pnpm build:code     # TypeScript only → dist/index.js
pnpm build:ui       # Vite UI only → ui/dist/
pnpm bundle:ui      # Copy ui/dist/ → dist/godmode-ui/
pnpm ui:sync        # Sync to assets/godmode-ui/ (commit fallback)
pnpm typecheck      # tsc --noEmit
pnpm clean          # Remove all build artifacts
```

### Full Internals Reference

For the complete deep dive (all RPC methods, all error codes, full config schemas), see:
`VAULT/99-System/godmode-plugin-internals.md`

---

_This skill is part of GodMode's beta support system. Configuration may change._
