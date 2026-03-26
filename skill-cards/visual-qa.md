---
domain: visual-qa
triggers: qa, visual qa, screenshot, ui check, does it look right, check the ui, visual test, ui test, screenshot tabs, visual review
tools: queue_add
---

# Visual QA — Screenshot-Based UI Testing

Automated visual inspection of every GodMode tab using `agent-browser`.

## When to Use
- After any agent session that modified files in `ui/src/`
- Before merging a branch with UI changes
- When the user asks "does it look right" or "check the UI"
- After overnight builder agent sessions that touched the frontend
- Before any release

## How to Use

Route to `godmode-builder` persona with the `visual-qa` skill:

```
queue_add({
  title: "Visual QA — post-merge UI check",
  description: "Run visual-qa skill. Screenshot all tabs, check for regressions.",
  skill: "visual-qa",
  priority: "high"
})
```

The builder agent runs `./scripts/visual-qa.sh`, which:
1. Builds the project (`pnpm build && pnpm build:ui`)
2. Starts the Vite dev server on port 5175
3. Opens each tab in a real browser via `agent-browser`
4. Takes annotated screenshots + accessibility snapshots
5. Runs basic health checks (blank pages, error elements)
6. Generates a report at `.qa-reports/<timestamp>/REPORT.md`
7. Kills the dev server

## What It Catches
- White-screen tabs (build broke something)
- Missing interactive elements (buttons, inputs disappeared)
- Error banners visible in the DOM
- Empty tabs that should have content
- Layout regressions visible in screenshots

## What It Doesn't Catch
- Subtle styling regressions (needs baseline comparison — future)
- Backend-dependent content (needs running gateway)
- Mobile responsiveness (runs at default viewport)

## Tips
- Use `--skip-build` if you just built: `./scripts/visual-qa.sh --skip-build`
- Use `--tabs chat,today` to check only specific tabs
- Screenshots are annotated with element labels — match them to the accessibility snapshot
- Reports accumulate in `.qa-reports/` — add to `.gitignore`
