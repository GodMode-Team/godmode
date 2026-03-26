---
name: dynamic-onboarding
description: "Conversational onboarding that builds the user's personal workspace through natural dialogue"
---

# Dynamic Onboarding

## Overview

A conversational skill that sets up the user's entire GodMode workspace through chat. Instead of forms or wizards, the AI asks questions and generates all data files from the conversation.

## When to Trigger

- First time a user opens GodMode (no `~/godmode/data/projects.json` exists)
- User says "set up my workspace" or "onboard me"
- User says "start over" or "reset my workspace"

## Conversation Flow

### Phase 1: Introduction (1-2 turns)

Greet the user. Explain what GodMode does in 2-3 sentences. Ask: "What are the main projects or areas you're working on right now?"

### Phase 2: Projects (2-4 turns)

For each project mentioned:

- Ask for a short name and emoji
- Ask who's involved (team members, clients, collaborators)
- Ask what tools/integrations they use for this project
- Ask about current priorities or active tasks

Write results to `~/godmode/data/projects.json`:

```json
{
  "projects": [
    {
      "id": "slug-from-name",
      "name": "Project Name",
      "emoji": "📊",
      "tasks": [],
      "outputs": [],
      "people": ["person-id-1", "person-id-2"],
      "skills": ["relevant-skill"],
      "status": "active"
    }
  ]
}
```

### Phase 3: People (2-3 turns)

For each person mentioned across projects:

- Confirm their name and role
- Ask for any additional context (company, email, relationship)
- Ask about communication preferences

Write individual files to `~/godmode/data/people/{id}.json`:

```json
{
  "id": "person-slug",
  "name": "Full Name",
  "role": "Their role",
  "company": "Company Name",
  "email": "email@example.com",
  "tags": ["client", "team"],
  "notes": "Context from onboarding conversation",
  "projects": ["project-id"],
  "lastContact": null
}
```

### Phase 4: Goals & Life Priorities (2-3 turns)

Ask: "What are your top goals right now — both professional and personal?"

For each goal:

- Categorize: professional, personal, health, relationship, financial, creative
- Ask for a target or milestone
- Ask for timeline

Write to `~/godmode/data/goals.json`:

```json
{
  "goals": [
    {
      "id": "goal-slug",
      "text": "Goal description",
      "category": "professional",
      "target": "Specific milestone",
      "deadline": "2026-Q2",
      "status": "active"
    }
  ]
}
```

Ask about life priorities. Populate `~/godmode/data/wheel-of-life.json` with their chosen areas and initial self-assessments.

### Phase 5: Data Sources & Integrations (1-2 turns)

Ask: "What tools and services do you use daily?" (Calendar, email, task manager, etc.)

Match answers to available skills. Update `~/godmode/data/data-sources.json`:

```json
{
  "sources": [
    {
      "id": "source-slug",
      "name": "Service Name",
      "type": "category",
      "status": "connected",
      "skill": "skill-key"
    }
  ]
}
```

For unconnected services, note them as `"status": "pending"` and tell the user how to connect them later.

### Phase 6: Cron Setup (1 turn)

Explain the automation options:

- Morning brief (already exists at 5 AM)
- Evening processing (8 PM daily review)
- Weekly coaching (Sunday evening)
- Meeting prep (auto before meetings)

Ask which ones to enable. Run `scripts/setup-dynamic-crons.sh` or create jobs via gateway `cron.add` method.

### Phase 7: Confirmation (1 turn)

Summarize what was set up:

- N projects configured
- N people added
- N goals tracked
- N data sources connected
- N cron jobs enabled

Invite user to explore: "Check the Work tab to see your projects, People tab for your contacts, and Life tab for your goals. Everything is chat-customizable — just tell me to reorganize anything."

## File Outputs

After onboarding, these files should exist:

- `~/godmode/data/projects.json` — All projects with tasks/people/skills
- `~/godmode/data/people/*.json` — One file per person
- `~/godmode/data/goals.json` — User goals with categories and timelines
- `~/godmode/data/wheel-of-life.json` — Life areas with initial scores
- `~/godmode/data/data-sources.json` — Connected integrations

## Important Notes

- Keep the conversation natural and concise — don't ask too many questions at once
- Group related questions (e.g., ask about project + people + tools together per project)
- If the user gives short answers, infer reasonable defaults and confirm
- If `~/godmode/data/` files already exist, ask before overwriting
- Total onboarding should take 5-10 minutes of conversation
- After each phase, write the files immediately (don't wait until the end)
