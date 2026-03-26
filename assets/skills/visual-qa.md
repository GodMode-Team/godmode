---
name: Visual QA — Screenshot Every Tab
trigger: manual
persona: godmode-builder
taskType: review
priority: high
---

# Visual QA — Automated UI Inspection

Run a full visual QA pass on the GodMode UI. This skill builds the project, opens every tab in a real browser, takes annotated screenshots, captures accessibility snapshots, and generates a report with pass/fail per tab.

**When to run:** After any session that modifies UI code (`ui/src/`), after merging branches with UI changes, or before any release.

## Prerequisites

- `agent-browser` installed globally (`npm i -g agent-browser`)
- `pnpm` available
- No other process on port 5175

## Quick Run

```bash
./scripts/visual-qa.sh
```

Options:
- `--skip-build` — skip `pnpm build` + `pnpm build:ui` (if you just built)
- `--tabs chat,today,workspaces` — only check specific tabs

## Full Manual Process (if script isn't available)

### Step 1: Build

```bash
cd ~/Projects/godmode-plugin
pnpm build
pnpm build:ui
```

If build fails, stop here. Report the build error. Do not proceed to visual QA with a broken build.

### Step 2: Start Dev Server

```bash
pnpm dev:ui &
```

Wait for `http://localhost:5175` to respond.

### Step 3: Screenshot Every Tab

Navigate to each tab and capture an annotated screenshot + accessibility snapshot.

Primary tabs (the 6-tab baseline):
1. `/chat` — Chat
2. `/today` — Today
3. `/team` — Team
4. `/workspaces` — Workspaces (formerly Work)
5. `/second-brain` — Second Brain
6. `/dashboards` — Dashboards

Settings group:
7. `/config` — Settings
8. `/connections` — Connections
9. `/skills` — Skills
10. `/agents` — Agents
11. `/trust` — Trust
12. `/guardrails` — Safety

For each tab:

```bash
agent-browser open "http://localhost:5175/$TAB"
sleep 1.5
agent-browser screenshot ".qa-reports/screenshots/$TAB.png" --annotate
agent-browser snapshot -i > ".qa-reports/snapshots/$TAB.txt"
```

### Step 4: Evaluate Each Screenshot

For each tab, check:

1. **Does it render?** Not blank, no white screen, no "undefined" text
2. **Layout intact?** Sidebar visible, content area populated, no overlapping elements
3. **Interactive elements present?** Buttons, inputs, links visible in the accessibility snapshot
4. **No error states?** No red error banners, no "failed to load" messages
5. **Content reasonable?** Tab shows the right kind of content (chat shows messages, today shows calendar, etc.)

### Step 5: Interaction Smoke Tests

For critical tabs, test the happy path:

- **Chat:** Can you click the input area? Is the send button present?
- **Today:** Does the schedule section render? Are task counts visible?
- **Workspaces:** Are workspace cards visible? Can you click one?
- **Settings:** Are config sections visible? Do toggles exist?

```bash
# Example: check chat input exists
agent-browser snapshot -i -s ".chat-input, [class*=chat-input], textarea"
```

### Step 6: Generate Report

Create a markdown report with:
- Branch and commit info
- Pass/fail per tab with reasoning
- Screenshots attached
- Any issues found with severity (cosmetic / functional / blocker)

Report goes to `.qa-reports/YYYY-MM-DD-HHMMSS/REPORT.md`.

## What Fails QA

- **Blocker:** Any tab that white-screens, crashes, or shows a JS error
- **Functional:** Interactive elements missing (can't type in chat, can't click buttons)
- **Cosmetic:** Layout shifts, text overflow, misaligned elements

## Deliverable

Return the report path and a summary:
```
QA REPORT: .qa-reports/20260323-220000/REPORT.md
12 tabs checked: 11 OK, 1 WARN
WARN: /dashboards — page appears empty (no dashboard data)
Screenshots: .qa-reports/20260323-220000/screenshots/
```
