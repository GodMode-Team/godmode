---
domain: dashboards
triggers: dashboard, dashboards, chart, charts, visualization, visualize, report, analytics, data view, overview, metrics, stats, statistics, scorecard, leaderboard, tracker, tracking, breakdown, summary view, show me my, build me a
tools: dashboards.save, dashboards.widgetData, dashboards.list
name: godmode-dashboards
version: 1.0.0
description: "Creates data visualizations, charts, and metric dashboards"
keywords: ["dashboard", "dashboards", "chart", "charts", "visualization"]
author: godmode-team
clawhub: true
---
## When to Use
- User asks for ANY dashboard, chart, report, visualization, overview, or data view
- User says "show me my..." or "build me a..." with data/metrics context
- User is on the Dashboards tab and asks for something new
- User asks to update, refresh, or change an existing dashboard

## CRITICAL: Always Save
**ALWAYS call `dashboards.save` after generating dashboard HTML.** This is what makes the dashboard appear in the Dashboards tab. If you just output HTML in chat without saving, the user cannot find it later.

## How to Use
1. Call `dashboards.widgetData` with relevant widget IDs to get live data
2. Generate beautiful HTML with `<style>` blocks, SVG charts, gradients, animations
3. Call `dashboards.save` with: `{ title, html, scope: "global", description?, widgets? }`
4. Tell the user: "I've saved this to your Dashboards tab."

### Available Widgets
`tasks-summary`, `tasks-today`, `agent-activity`, `queue-status`, `trust-scores`, `brief-summary`, `streak-stats`, `workspace-stats`

## HTML Rules
- ✅ Use: `<style>`, SVG, inline styles, all HTML, animations, @keyframes, @media
- ❌ Never: `<script>`, `<iframe>`, `<link>`, `@import`, event handlers
- Use theme vars: `var(--text)`, `var(--muted)`, `var(--accent)`, `var(--card)`, `var(--bg-elevated)`, `var(--border)`, `var(--success)`, `var(--warning)`, `var(--danger)`

## Gotchas
- If updating an existing dashboard, pass its `id` to `dashboards.save` to overwrite (not create a duplicate)
- Call `dashboards.list` first to check if a similar dashboard already exists
- Dashboards should look stunning — use SVG charts, not plain tables
