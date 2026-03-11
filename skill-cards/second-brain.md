---
domain: second-brain
triggers: vault, note, notes, obsidian, search, find, look up, brain, knowledge, what do we know, remember
tools: secondBrain.search, secondBrain.identity, secondBrain.memoryBank, secondBrain.memoryBankEntry
---
## When to Use
- User asks about a person, company, project, or any stored knowledge
- You need context about something and memory results above are insufficient
- Looking up past research, meeting notes, or project details
- ANY time you're about to ask the user for info — search here first

## How to Use
- `secondBrain.search` — { query } — semantic search across the entire vault
- `secondBrain.identity` — read USER.md and SOUL.md identity files
- `secondBrain.memoryBank` — list all people/company files
- `secondBrain.memoryBankEntry` — { name } — get a specific person/company file

## Vault Structure (PARA)
- 00-Inbox/ — unsorted captures, queue outputs land here
- 01-Daily/ — daily briefs (YYYY-MM-DD.md)
- 02-Projects/ — active project notes
- 03-Areas/ — ongoing areas of responsibility
- 04-Resources/ — research, references
- 06-Brain/ — People/, Companies/, Knowledge/ files
- 08-Identity/ — USER.md, SOUL.md
- 99-System/ — system files, agent-roster, skill-cards

## Gotchas
- Search is semantic, not exact — use natural language queries, not keywords
- People files are in 06-Brain/People/ — search by name
- If search returns nothing, try broader terms or different phrasing
- Vault is the source of truth for long-term knowledge — Mem0 is for conversational context

## Tips
- When user mentions a person, immediately search for their people file
- Cross-reference meeting attendees with people files before meeting prep
- For "what do we know about X" — search vault, then summarize findings
- Don't quote raw vault content — synthesize it naturally into conversation
