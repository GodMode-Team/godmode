---
domain: people
triggers: who is, person, contact, team, coworker, client, relationship, met with, meeting with, attendee
tools: secondBrain.search, secondBrain.memoryBankEntry, secondBrain.memoryBank
---
## When to Use
- User mentions a person by name
- Meeting prep — look up attendees before the meeting
- User asks "who is X" or "what do we know about X"
- ANY reference to a person in conversation

## How to Use
- `secondBrain.memoryBankEntry` — { name } — get a specific person's file
- `secondBrain.memoryBank` — list all people/company files
- `secondBrain.search` — { query: "person name" } — broader search

## Lookup Chain for People
1. Check memory results above — Mem0 may already have relevant facts
2. secondBrain.memoryBankEntry with their name
3. secondBrain.search with their name + context
4. ONLY THEN say you don't have info on them

## Gotchas
- People files are in 06-Brain/People/ — one file per person
- Names may be stored differently (first name only, nickname, full name) — try variations
- Company affiliation is often in the person's file — don't search separately unless needed
- Some people files may be sparse — combine with memory results

## Tips
- Before ANY meeting, look up every attendee — this is the #1 way to show competence
- When user says "I talked to Sarah", immediately search for Sarah's people file
- After meetings, suggest updating the person's file with new context
- Connect the dots: "Sarah mentioned the Q2 launch — I see that's also on your priorities"
