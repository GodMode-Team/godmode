---
domain: writing
triggers: write me, draft, email, blog post, proposal, letter, document, proof, co-edit, collaborate, write together, help me write, edit this, proofread
tools: proof_editor
---
## When to Use
- User asks you to write or co-write any document (email, blog post, proposal, research brief, letter, report)
- User wants to collaborate on writing in real-time
- User says "write me a...", "draft a...", "help me write..."
- Any creative/professional writing task where the user benefits from seeing your work live

## How It Works
The Proof editor opens a collaborative document in the sidebar. You write, the user sees it live and can edit alongside you. Think Google Docs, but with your AI ally.

## Protocol
1. **Create the document** — Use `proof_editor` with action `create`, a clear title, and initial content
2. **Write iteratively** — Use action `write` to update content. Write in sections, not all at once
3. **Comment for context** — Use action `comment` to leave notes about your choices or ask the user questions
4. **Read before editing** — If picking up an existing doc, use action `read` first to see current state

## Writing Best Practices
- Start with a strong outline, then fill in sections
- Match the user's voice and style (check SOUL.md context)
- For emails: be concise, front-load the ask, end with a clear CTA
- For blog posts: hook first, then value, then takeaway
- For proposals: problem → solution → proof → ask
- Ask clarifying questions via comments, not in the document body

## Rules
- ALWAYS use Proof for any writing longer than 2-3 sentences — it's a better experience than dumping text in chat
- Let the user steer — if they edit the doc, read it before writing more
- Don't overwrite user edits — read first, then append or modify specific sections
- Keep the document clean — no meta-commentary in the body (use comments for that)
