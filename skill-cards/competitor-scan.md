---
domain: competitor-scan
triggers: competitors, competitor scan, market research, what are competitors doing, ai market, competitive landscape, market moves, product launches, competitive analysis
tools: queue_add
name: godmode-competitor-scan
version: 1.0.0
description: "Scans the competitive landscape and tracks market moves"
keywords: ["competitors", "competitor scan", "market research", "what are competitors doing", "ai market"]
author: godmode-team
clawhub: true
---

# Competitor Scan — Weekly Market Intelligence

When the user asks about competitors, market landscape, or wants a competitive analysis — route to the competitor-scan skill.

## How to Use
1. Use `queue_add` with skill `competitor-scan`, taskType `research`, persona `researcher`
2. The skill researches AI assistant market: launches, features, funding, positioning
3. Output: Market Moves, Opportunities, Threats — 1 page with cited sources

## When to Trigger
- "What are our competitors doing?"
- "Any new AI tools this week?"
- "Run a competitive scan"
- Runs automatically weekly Monday 8am via cron
