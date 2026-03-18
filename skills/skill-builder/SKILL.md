# Skill Builder

## Description
Detect repeating multi-step patterns and extract them into reusable SKILL.md files automatically.

## Trigger
After a complex interaction involving 5+ tool calls, repeated multi-step workflows, or when the user says "save this as a skill", "I do this a lot", "automate this pattern".

## Process
1. **Detect the pattern** — Review the recent conversation for:
   - Sequences of 3+ tool calls that form a logical workflow
   - Steps the user directed manually that could be automated
   - Repeated patterns across sessions (check `secondBrain.search`)
2. **Extract the skeleton:**
   - What triggers this workflow?
   - What are the ordered steps?
   - What tools does each step use?
   - What inputs vary vs. what's constant?
3. **Draft the SKILL.md** — Follow the standard format:
   - Name, Description (1 line), Trigger, Process (numbered), Output, Examples, Failure Modes
   - Keep it 30-80 lines
   - Use specific tool names, not vague descriptions
4. **Validate with the user:**
   - Show the draft
   - Ask: "Does this capture what you want? Anything to add or change?"
   - Iterate once if needed
5. **Save and register:**
   - Write to `skills/{skill-name}/SKILL.md`
   - Log creation in memory via `secondBrain.search` (so future sessions know it exists)
   - Confirm: "Skill saved. It will activate when [trigger condition]."

## Output
- Pattern description (what was detected)
- Draft SKILL.md (shown to user for approval)
- Confirmation of save location
- Trigger conditions summary

## Examples
1. User manually runs web search, then X search, then writes a summary, then saves to vault — 3 sessions in a row. Skill Builder detects: "You keep doing research briefings manually. Want me to save this as a skill?" Extracts auto-research-like pattern with user's specific preferences.
2. User says "Every Monday I check tasks, review queue output, and update my brief" — Skill Builder creates a "Monday Review" skill with those 3 steps and the Monday trigger.

## Failure Modes
- **Too specific** — If the pattern only works for one exact scenario, it's not a skill. Skills should generalize. Ask: "Would this apply to other [X] or just this one?"
- **Too vague** — If the extracted steps are "do research" without specific tools/queries, push for specifics. A skill without concrete steps is just a wish.
- **Duplicate** — Check existing skills before creating. If a similar skill exists, suggest modifying it instead.
- **User declines** — If the user says "no, this was a one-off," drop it. Don't nag about skill creation.
