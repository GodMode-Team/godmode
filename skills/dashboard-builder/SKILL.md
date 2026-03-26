---
name: dashboard-builder
description: Build and update custom dashboards for the GodMode Dashboards tab
metadata:
  godmode:
    emoji: "\U0001F4CA"
    priority: medium
    auto: true
---

# Dashboard Builder

You build **visually rich, data-driven HTML dashboards** for the user's Dashboards tab in GodMode. Dashboards should look stunning — use SVG charts, gradients, glowing accents, animations, and thoughtful visual hierarchy. Never produce plain data tables when a visual representation is possible.

## How to Create/Update a Dashboard

Call the `dashboards.save` RPC:
```json
{
  "title": "Morning Overview",
  "description": "Daily snapshot — tasks, focus, calendar",
  "html": "<style>...</style><div class='grid-2'>...</div>",
  "scope": "global",
  "widgets": ["tasks-summary", "focus-pulse"]
}
```

- `title` (required): display name
- `html` (required): the dashboard HTML content (including `<style>` blocks)
- `id` (optional): slug — auto-generated from title if omitted; provide to update existing
- `scope`: `"global"` (cross-workspace) or a workspace ID
- `description`: short subtitle
- `widgets`: widget IDs used (for data refresh tracking)

## Fetching Live Data

Call `dashboards.widgetData` with a list of widget IDs to get fresh data:
```json
{ "widgets": ["tasks-summary", "focus-pulse", "goals-progress"] }
```

### Available Widget Types

| Widget ID | Returns |
|-----------|---------|
| `tasks-summary` | total, pending, completed, overdue, highPriority counts |
| `tasks-today` | pending tasks list, completed tasks list for today |
| `focus-pulse` | active, score (0-100), streak, currentFocus, itemCount, completedCount |
| `goals-progress` | goals list with title/area/progress/status, total, avgProgress |
| `agent-activity` | completed/errors/queue/needsReview counts, recentCompleted list |
| `queue-status` | pending/processing/review/done/failed counts |
| `coding-status` | running/queued/done/failed counts, activeTasks list |
| `trust-scores` | per-workflow averages, totalRatings, recentDailyRatings |
| `wheel-of-life` | spoke scores with current/target/trend |
| `intel-highlights` | top 5 active insights with title/category |
| `recent-files` | 10 most recently modified files (name, path, modified) |
| `brief-summary` | exists, totalCheckboxes, completedCheckboxes, lineCount |
| `streak-stats` | focusStreak, dailyRatingStreak |
| `workspace-stats` | total workspaces, byType counts, workspace list |
| `weather` | null (fetch via wttr.in in HTML or inject at render time) |
| `calendar-today` | null (fetch via calendar.events.today RPC separately) |

## HTML + CSS Rules

Dashboard HTML is rendered inside `.dashboards-content`. Your `<style>` selectors are **auto-scoped** to this container — no CSS leaks.

### What's Allowed
- `<style>` blocks with full CSS (gradients, animations, @keyframes, @media queries)
- SVG elements (`<svg>`, `<path>`, `<circle>`, `<rect>`, `<line>`, `<text>`, `<defs>`, `<linearGradient>`, `<radialGradient>`, `<stop>`, `<g>`, `<animate>`, `<animateTransform>`, etc.)
- Inline `style` attributes
- All standard HTML elements

### What's Stripped (security)
- `<script>` tags
- `<iframe>` tags
- `<link>` tags
- `@import` rules in CSS
- `onclick`, `onload`, and all event handler attributes

### Theme Variables (always use these, never hardcode colors)
- `var(--text)` — primary text
- `var(--muted)` — secondary text
- `var(--accent)` — brand accent color
- `var(--card)` — card background
- `var(--bg-elevated)` — elevated surface
- `var(--border)` — border color
- `var(--bg-hover)` — hover state
- `var(--success)` — green/positive
- `var(--warning)` — yellow/caution
- `var(--danger)` — red/negative

### Built-in CSS Classes
- `.widget` — card with gradient background, shadow, border-radius, hover lift
- `.widget-title` — uppercase section label
- `.stat` — large number (2rem, bold, glowing accent)
- `.stat-label` — muted subtitle
- `.grid-2`, `.grid-3`, `.grid-4` — responsive grid layouts
- `.progress-bar` + `.progress-fill` — animated gradient progress bar
- `.badge`, `.badge--success`, `.badge--warning`, `.badge--danger` — glowing status badges
- `.metric-row` — horizontal label + value
- `.glow` — text glow effect
- `.gradient-text` — gradient-filled text
- `.card-accent`, `.card-accent--success`, `.card-accent--warning`, `.card-accent--danger` — left accent border
- `.status-dot`, `.status-dot--warning`, `.status-dot--danger` — pulsing status indicator
- `.chart-container` — centered flex container for SVG charts
- `.bar-chart` > `.bar-row` > `.bar-label` + `.bar-track` > `.bar-fill` + `.bar-value` — horizontal bar chart

## Visual Design Principles

**Every dashboard should feel like a premium control panel.** Follow these principles:

1. **Visual hierarchy** — Large glowing stats for key numbers, muted labels below. Most important info at top.
2. **Chart everything** — Use SVG donut charts for completion rates, sparklines for trends, gauge meters for scores. Never just show a number when a chart tells the story better.
3. **Depth and dimension** — Cards with subtle gradients and shadows. Elevated surfaces. Backdrop blur.
4. **Color with purpose** — `var(--success)` for positive, `var(--warning)` for needs-attention, `var(--danger)` for critical. Use `color-mix()` for transparency.
5. **Motion** — Animate progress fills, pulse status dots, fade in sections. Use `@keyframes` and `transition`.
6. **Information density** — Grid layouts pack data. Use `.grid-3` or `.grid-4` for stat cards, `.grid-2` for wider charts.

## SVG Chart Patterns

### Donut Chart
```html
<svg viewBox="0 0 120 120" style="width: 100px; height: 100px;">
  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="10"/>
  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" stroke-width="10"
    stroke-dasharray="314" stroke-dashoffset="94" stroke-linecap="round"
    transform="rotate(-90 60 60)"/>
  <text x="60" y="60" text-anchor="middle" dominant-baseline="central"
    font-size="24" font-weight="700" fill="var(--accent)">70%</text>
</svg>
```
Formula: `stroke-dashoffset = circumference × (1 - percentage/100)` where circumference = 2 × π × r ≈ 314 for r=50.

### Gauge Meter
```html
<svg viewBox="0 0 200 120" style="width: 180px; height: 110px;">
  <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="var(--border)" stroke-width="12" stroke-linecap="round"/>
  <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="var(--success)" stroke-width="12"
    stroke-dasharray="251" stroke-dashoffset="63" stroke-linecap="round"/>
  <text x="100" y="90" text-anchor="middle" font-size="28" font-weight="700" fill="var(--text)">75</text>
  <text x="100" y="110" text-anchor="middle" font-size="11" fill="var(--muted)">Focus Score</text>
</svg>
```
Arc length ≈ 251 (half circle with r=80). `stroke-dashoffset = 251 × (1 - score/100)`.

### Sparkline
```html
<svg viewBox="0 0 120 40" style="width: 120px; height: 40px;">
  <polyline points="0,35 20,28 40,30 60,15 80,20 100,8 120,12"
    fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="0,35 20,28 40,30 60,15 80,20 100,8 120,12 120,40 0,40"
    fill="color-mix(in srgb, var(--accent) 15%, transparent)" stroke="none"/>
</svg>
```

### Horizontal Bar Chart (CSS)
```html
<div class="bar-chart">
  <div class="bar-row">
    <span class="bar-label">Tasks</span>
    <div class="bar-track"><div class="bar-fill" style="width: 75%; background: var(--success);"></div></div>
    <span class="bar-value">75%</span>
  </div>
  <div class="bar-row">
    <span class="bar-label">Goals</span>
    <div class="bar-track"><div class="bar-fill" style="width: 45%; background: var(--warning);"></div></div>
    <span class="bar-value">45%</span>
  </div>
</div>
```

## Regeneration Pattern

When the user asks to "refresh" or "update" a dashboard:
1. Call `dashboards.widgetData` with the dashboard's widget IDs
2. Build fresh HTML using the returned data
3. Call `dashboards.save` with the same `id` to update

## Example: Command Center Dashboard

```html
<style>
  .cmd-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
  .cmd-header h2 { margin: 0; font-size: 1.5rem; font-weight: 700; }
  .cmd-time { color: var(--muted); font-size: 0.875rem; }
  .donut-wrap { display: flex; align-items: center; gap: 16px; }
  .donut-legend { display: flex; flex-direction: column; gap: 4px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.8125rem; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
  .stat-card { text-align: center; padding: 12px; }
  .stat-card .stat { font-size: 1.75rem; }
  .activity-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); }
  .activity-item:last-child { border-bottom: none; }
  @keyframes fill-in { from { stroke-dashoffset: 314; } }
</style>

<div class="cmd-header">
  <h2 style="color: var(--text);">Command Center</h2>
  <span class="cmd-time">Updated just now</span>
  <span class="status-dot" style="margin-left: auto;"></span>
</div>

<div class="stat-grid">
  <div class="widget stat-card">
    <div class="widget-title">Tasks</div>
    <div class="stat" style="color: var(--success);">12</div>
    <div class="stat-label">7 pending</div>
  </div>
  <div class="widget stat-card">
    <div class="widget-title">Focus</div>
    <div class="stat glow">85</div>
    <div class="stat-label">3-day streak</div>
  </div>
  <div class="widget stat-card">
    <div class="widget-title">Queue</div>
    <div class="stat">3</div>
    <div class="stat-label">1 in review</div>
  </div>
  <div class="widget stat-card">
    <div class="widget-title">Coding</div>
    <div class="stat" style="color: var(--warning);">2</div>
    <div class="stat-label">running</div>
  </div>
</div>

<div class="grid-2">
  <div class="widget">
    <div class="widget-title">Task Completion</div>
    <div class="chart-container">
      <div class="donut-wrap">
        <svg viewBox="0 0 120 120" style="width: 100px; height: 100px;">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="10"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--success)" stroke-width="10"
            stroke-dasharray="314" stroke-dashoffset="157" stroke-linecap="round"
            transform="rotate(-90 60 60)" style="animation: fill-in 1s ease-out;"/>
          <text x="60" y="56" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">50%</text>
          <text x="60" y="72" text-anchor="middle" font-size="10" fill="var(--muted)">complete</text>
        </svg>
        <div class="donut-legend">
          <div class="legend-item"><span class="legend-dot" style="background: var(--success);"></span> Done (5)</div>
          <div class="legend-item"><span class="legend-dot" style="background: var(--warning);"></span> In progress (3)</div>
          <div class="legend-item"><span class="legend-dot" style="background: var(--border);"></span> Pending (4)</div>
        </div>
      </div>
    </div>
  </div>

  <div class="widget">
    <div class="widget-title">Goals Progress</div>
    <div class="bar-chart">
      <div class="bar-row">
        <span class="bar-label">Launch MVP</span>
        <div class="bar-track"><div class="bar-fill" style="width: 75%; background: var(--success);"></div></div>
        <span class="bar-value">75%</span>
      </div>
      <div class="bar-row">
        <span class="bar-label">Hire team</span>
        <div class="bar-track"><div class="bar-fill" style="width: 30%; background: var(--warning);"></div></div>
        <span class="bar-value">30%</span>
      </div>
      <div class="bar-row">
        <span class="bar-label">Revenue</span>
        <div class="bar-track"><div class="bar-fill" style="width: 15%; background: var(--danger);"></div></div>
        <span class="bar-value">15%</span>
      </div>
    </div>
  </div>
</div>

<div class="widget" style="margin-top: 12px;">
  <div class="widget-title">Focus Trend (7 days)</div>
  <div class="chart-container">
    <svg viewBox="0 0 300 60" style="width: 100%; height: 60px;">
      <polyline points="0,50 50,40 100,35 150,25 200,30 250,15 300,10"
        fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="0,50 50,40 100,35 150,25 200,30 250,15 300,10 300,60 0,60"
        fill="color-mix(in srgb, var(--accent) 10%, transparent)" stroke="none"/>
    </svg>
  </div>
</div>
```

## Tips
- **Always use `<style>` blocks** for custom CSS — they are fully supported. Put them at the top of your HTML.
- **Always use theme variables** for colors — never hardcode hex values. This ensures dashboards work in both light and dark themes.
- **Chart everything possible** — donut charts for ratios, sparklines for trends, gauges for scores, horizontal bars for comparisons.
- **Use animations sparingly but effectively** — animate chart fills on load, pulse status indicators, smooth transitions on progress bars.
- Dashboards can be workspace-specific (`scope: "workspace-id"`) or global (`scope: "global"`).
- Users can have multiple dashboards — ask what data they want to see before building.
- When the user says "update my dashboard" or "refresh my dashboard", fetch fresh widgetData and regenerate.
