#!/usr/bin/env bash
# Setup Dynamic GodMode cron jobs
# Run this script to add evening-processing, evening-review, weekly-coaching, and meeting-prep cron jobs.
# Safe to re-run — checks for existing jobs by name before adding.

set -euo pipefail

OPENCLAW="$(dirname "$0")/../dist/cli.js"

if [ ! -f "$OPENCLAW" ]; then
  echo "Error: dist/cli.js not found. Run 'pnpm build' first."
  exit 1
fi

# Detect user timezone (macOS)
TZ=$(readlink /etc/localtime 2>/dev/null | sed 's|.*/zoneinfo/||' || echo "UTC")
echo "Using timezone: $TZ"

# Check if a job already exists by name
job_exists() {
  node "$OPENCLAW" cron list 2>/dev/null | grep -q "$1" && return 0 || return 1
}

# 1. Evening Processing — 8 PM daily
if job_exists "evening-processing"; then
  echo "✓ evening-processing already exists, skipping"
else
  echo "Adding evening-processing (8 PM daily)..."
  node "$OPENCLAW" cron add \
    --name "evening-processing" \
    --description "End-of-day review: tag sessions by project, save snapshot, generate impact summary" \
    --cron "0 20 * * *" \
    --tz "$TZ" \
    --message "Run the evening-processing skill. Review today's sessions, tag them by project, save a daily snapshot to ~/godmode/data/snapshots/, and generate an impact summary." \
    --announce \
    --channel "last" \
    --best-effort-deliver
  echo "✓ evening-processing added"
fi

# 2. Evening Review — 9 PM daily (user-facing check-in via iMessage)
#    MUST use sessionTarget=main + kind=systemEvent so the user's reply
#    stays in the main ally session (isolated sessions swallow replies).
if job_exists "evening-review"; then
  echo "✓ evening-review already exists, skipping"
else
  echo "Adding evening-review (9 PM daily)..."
  node "$OPENCLAW" cron add \
    --name "evening-review" \
    --description "9 PM evening review: warm contextual check-in via iMessage to close the day" \
    --cron "0 21 * * *" \
    --tz "$TZ" \
    --message "EVENING REVIEW (9 PM): Time for the evening check-in. Run the evening-review skill — gather today's context (daily brief, agent log, sessions, tomorrow's calendar), compose a warm personal iMessage check-in (under 800 chars), and send it via the message tool. After sending, stay present for the user's reply. When they respond, handle it naturally: capture their reflection to the daily brief, extract any tasks they mention and create them, queue any work they want done overnight, and if you're not sure what to prioritize, ask."
  echo "✓ evening-review added"

  # Patch to main+systemEvent (CLI defaults to isolated+agentTurn)
  echo "  Patching evening-review to main session + systemEvent..."
  node -e "
    const fs = require('fs');
    const path = require('path').join(require('os').homedir(), '.openclaw', 'cron', 'jobs.json');
    if (!fs.existsSync(path)) process.exit(0);
    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const job = data.jobs.find(j => j.name === 'evening-review' || j.name === 'Evening Review - 9PM');
    if (job) {
      job.sessionTarget = 'main';
      job.wakeMode = 'now';
      if (job.payload.message) { job.payload.text = job.payload.message; delete job.payload.message; }
      job.payload.kind = 'systemEvent';
      job.delivery = { mode: 'none' };
      job.updatedAtMs = Date.now();
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      console.log('  ✓ Patched to sessionTarget=main, kind=systemEvent');
    }
  "
fi

# 3. Weekly Coaching — Sunday 8 PM
if job_exists "weekly-coaching"; then
  echo "✓ weekly-coaching already exists, skipping"
else
  echo "Adding weekly-coaching (Sunday 8 PM)..."
  node "$OPENCLAW" cron add \
    --name "weekly-coaching" \
    --description "Sunday coaching: analyze goals, find patterns, generate Monday priorities" \
    --cron "0 20 * * 0" \
    --tz "$TZ" \
    --message "Run the weekly-coaching skill. Load my goals from ~/godmode/data/goals.json and wheel-of-life from ~/godmode/data/wheel-of-life.json. Review this week's daily snapshots. Analyze progress against goals, identify patterns, and generate a Monday coaching brief with top 3 priorities." \
    --model "anthropic/claude-opus-4-6" \
    --thinking "high" \
    --announce \
    --channel "last" \
    --best-effort-deliver
  echo "✓ weekly-coaching added"
fi

# 4. Meeting Prep — every 15 minutes (checks calendar, only fires when meeting is upcoming)
if job_exists "meeting-prep"; then
  echo "✓ meeting-prep already exists, skipping"
else
  echo "Adding meeting-prep (every 15 min calendar check)..."
  node "$OPENCLAW" cron add \
    --name "meeting-prep" \
    --description "Pre-meeting briefing: checks calendar every 15 min, preps when meeting is 30 min away" \
    --cron "*/15 * * * *" \
    --tz "$TZ" \
    --message "Check my calendar for meetings starting in the next 30-45 minutes using calendar.events.range. If there is a qualifying meeting with external attendees, run the meeting-prep skill: look up attendees in ~/godmode/data/people/, pull relevant project context, and send me a concise briefing. If no upcoming meetings, respond with just 'No upcoming meetings' and exit." \
    --announce \
    --channel "last" \
    --best-effort-deliver
  echo "✓ meeting-prep added"
fi

echo ""
echo "Done! All Dynamic GodMode cron jobs are configured."
echo "Run 'node $OPENCLAW cron list' to verify."
