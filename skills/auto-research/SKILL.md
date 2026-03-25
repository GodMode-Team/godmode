# Auto-Research

## Description
Deep research on any topic using multiple sources, with citations and explicit gaps.

## Trigger
Questions about topics, companies, people, markets, trends, technologies, or any "what do we know about X" question.

## Process
1. **Scope the question** — What specifically does the user need? A quick answer, a briefing, or a deep dive? Default to briefing (5-10 key points).
2. **Check internal memory first:**
   - `secondBrain.search` for what we already know
   - Surface any prior research or decisions on this topic
3. **Web research:**
   - `web_search` for current facts, news, data
   - Run 2-3 queries with different angles (e.g., "[company] revenue", "[company] competitors", "[company] criticism")
4. **Social signal check:**
   - `x_read` for recent public sentiment, announcements, hot takes
   - Look for what practitioners say, not just press releases
5. **Synthesize with citations:**
   - Lead with the answer, not the process
   - Inline citations: "[Source: URL]" for every factual claim
   - Separate facts from analysis
6. **Identify gaps** — What couldn't be found? What's uncertain? What would require deeper digging?
7. **Store findings:**
   - `secondBrain.search` key facts for future retrieval
   - Offer to save a research brief to vault if the topic is important

## Output
- TL;DR (2-3 sentences)
- Key findings (5-10 bullets, cited)
- Gaps and uncertainties (2-3 bullets)
- Suggested follow-ups (1-2 questions to dig deeper)

## Examples
1. "What's happening with AI agents in healthcare?" — Memory check (prior interest in Project Beta), web search for market size + key players + regulation, X check for practitioner sentiment. Output: market briefing with 8 findings, 2 gaps (pricing data unclear, regulation still evolving).
2. "Tell me about this person before my meeting" — Memory check for past interactions, web search for LinkedIn/bio/company, X for recent posts. Output: 1-page briefing with role, company, recent activity, talking points.

## Failure Modes
- **Stale data** — Web results may be months old. Always note dates on findings. Flag if freshness matters.
- **Source quality** — Prefer primary sources (company blogs, SEC filings, official docs) over aggregator articles. Flag when sources are thin.
- **Scope creep** — User asks about "AI" broadly. Narrow it: "Which angle? Market size, technical trends, investment, or specific companies?"
- **API failures** — If `web_search` or `x_read` fails, say so explicitly. Don't hallucinate findings. Fall back to `secondBrain.search` and prior knowledge with clear caveats.
