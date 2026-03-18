Read V2-EXECUTION-SPEC.md for context — specifically the SESSION 3 section which has full specs for each skill.

## YOUR TASK: Write 7 SKILL.md files in the skills/ directory.

These are the core intellectual property of GodMode — reusable thinking frameworks that make Prosper smarter than a vanilla LLM. Each skill is a markdown file that gets loaded into the agent's context when triggered.

### Skills to create:

1. **`skills/first-principles/SKILL.md`** — First Principles Problem Solver
   - Trigger: user asks for a decision, strategy, or solution to a complex problem
   - Process: identify constraints → find root cause → generate 3 solutions from different first principles → adversarially attack each → recommend strongest

2. **`skills/adversarial-board/SKILL.md`** — Adversarial Advisory Board
   - Trigger: user says "debate this", "what am I missing", "challenge this", or any major decision
   - Process: create 5 personas (Skeptic, Optimist, Operator, Customer, Competitor) → each critiques → synthesize → recommend

3. **`skills/auto-research/SKILL.md`** — Auto-Research
   - Trigger: user asks about any topic, company, person, market, or trend
   - Process: web_search → x_read → memory_search → synthesize with citations → identify gaps → suggest follow-ups

4. **`skills/auto-context/SKILL.md`** — Auto-Context (Pre-Meeting/Pre-Task)
   - Trigger: before any meeting, task, or project discussion
   - Process: check calendar → look up ALL attendees → pull project context → check task history → surface everything proactively

5. **`skills/skill-builder/SKILL.md`** — Self-Improving Skill Builder
   - Trigger: after completing a complex multi-step task (5+ tool calls)
   - Process: analyze what was done → extract reusable pattern → write new SKILL.md → save to skills/ → log creation

6. **`skills/paperclip-ceo/SKILL.md`** — Paperclip CEO (Agent Delegation)
   - Trigger: user says "delegate", "assign", "have the team do", or work that should go to agents
   - Process: parse into discrete tasks → identify agent roles → create tasks with full context → set budget/priority → monitor → create inbox items for review

7. **`skills/post-meeting/SKILL.md`** — Post-Meeting Processor
   - Trigger: after any calendar meeting ends, or user provides transcript
   - Sources: Fathom, Granola, Otter, manual paste, any transcription tool
   - Process: get transcript → extract decisions/action items/follow-ups/people → update people files → create tasks → write meeting summary to daily note

### FORMAT for each SKILL.md:

```markdown
# {Skill Name}

## Description
One-line description of what this skill does.

## Trigger
When this skill activates (be specific about trigger phrases/conditions).

## Process
Numbered steps the agent follows. Include which tools to use at each step.

## Output
What the user sees when this skill completes.

## Examples
1-2 example inputs and what the output looks like.
```

### RULES:
- Each skill should be 30-80 lines — not longer
- Be specific about which tools to call (web_search, x_read, memory_search, tasks_create, etc.)
- Include failure modes: what to do when a step returns nothing
- These need to work on both OpenClaw and Hermes (no platform-specific tool calls — use generic names, the adapter handles mapping)
- Write them in a direct, practical voice — not academic

### COMMIT:
```bash
git commit -m "feat: v2 meta skills — 7 core SKILL.md files"
```

### WHEN DONE:
```bash
ls -la skills/*/SKILL.md
wc -l skills/*/SKILL.md
```
