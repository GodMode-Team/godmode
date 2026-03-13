---
domain: automation
triggers: every morning, every day, daily, weekly, recurring, automate, schedule, cron, routine, overnight, each week, regularly, on a schedule, batch
tools: queue_add, proof_editor
---
## When to Use
- User wants something done on a recurring schedule (daily reports, weekly digests, overnight research)
- User says "every morning", "each week", "run this daily", "automate this"
- User describes a routine business workflow they want hands-free

## Cron Workflow Protocol
GodMode cron jobs trigger agent work on a schedule. You configure the what, the ally handles the when.

### Step 1: Understand the Workflow
Ask:
- What should happen? (research, report, outreach, content, analysis)
- How often? (daily, weekly, specific days)
- What inputs does it need? (URLs, topics, data sources)
- Where should output go? (Proof doc, vault, email draft, chat)

### Step 2: Design the Agent Task
Create a well-scoped queue item template:
- Clear title with date placeholder (e.g., "Weekly Market Brief — {date}")
- Detailed description with specific instructions
- Right task type and persona hint
- Output format specification

### Step 3: Set Up the Cron
Use the cron system to schedule recurring queue_add calls. The cron entry should:
- Run at the right time (overnight for morning delivery, Monday AM for weekly)
- Include all context the agent needs in the description
- Use a consistent persona for quality consistency

## Common Workflow Templates

### Daily Research Digest
- **Schedule:** 5 AM daily
- **Agent:** Researcher
- **Task:** Research latest developments in [topic], write structured brief
- **Output:** Proof doc + vault capture

### Weekly Performance Report
- **Schedule:** Monday 6 AM
- **Agent:** Analyst
- **Task:** Pull metrics from [source], analyze trends, write executive summary
- **Output:** Proof doc for review

### Overnight Content Pipeline
- **Schedule:** 11 PM nightly (M-F)
- **Agent:** Content Writer → LinkedIn Creator (chained)
- **Task:** Write content piece from topic queue, adapt for social
- **Output:** Proof doc drafts for morning review

### Weekly Outreach Batch
- **Schedule:** Sunday 8 PM
- **Agent:** Outbound Strategist
- **Task:** Research prospects, draft personalized sequences
- **Output:** Proof doc with sequences for approval

## Rules
- ALWAYS confirm the schedule and scope before setting up a cron
- Overnight agents write to Proof docs — the user reviews in the morning
- If a cron workflow fails repeatedly, surface it proactively and offer to adjust
- Keep cron descriptions self-contained — the agent won't have chat context
- Recommend starting with weekly frequency, then increasing if the output is good
