# Custom Tabs Extensibility — Design Document

**Date:** 2026-03-24
**Status:** Design (no code yet)
**Task:** Massive Bug Dump Plan — Task 10

---

## Problem

The current tab system (`ui/src/ui/navigation.ts`) is entirely static. Every tab is hardcoded in `TAB_GROUPS`, `Tab` type, `iconForTab`, `titleForTab`, etc. Users cannot add views without modifying source code. The Dashboards tab subtitle already promises "Custom data views built by your AI ally — remix anything" but there is no mechanism to deliver on that promise.

## Design Constraints

1. **Non-technical users** tell the ally "I want a tab that shows X" — the ally creates it.
2. **Sandboxed** — custom tabs can never break core GodMode.
3. **Upgrade-safe** — GodMode updates never destroy custom tabs.
4. **Community sharing** — tab configs are portable files.
5. **Declarative config, not code** — JSON manifests, not TypeScript.
6. **Advanced escape hatch** — iframe sandbox with postMessage API.

## Alignment with Meta-Architecture

- **P2 (Files are the API):** Manifests are JSON files in a user directory. Readable, editable, shareable.
- **P5 (Ally is the interface):** Users talk to the ally; the ally writes manifest files.
- **P8 (Code as little as possible):** One renderer component handles all custom tabs. No per-tab code.
- **P9 (Conduct, don't rebuild):** Custom tabs pull data from existing tools via MCP/RPC. They never rebuild those tools' UIs.

---

## 1. Manifest Format

Location: `~/godmode/custom-tabs/{slug}.json`

### Schema (v1)

```jsonc
{
  "version": 1,
  "slug": "weekly-revenue",
  "title": "Weekly Revenue",
  "icon": "dollarSign",       // IconName from ui/src/ui/icons.ts
  "subtitle": "Stripe MRR and weekly sales",
  "group": "main",            // "main" | "settings" — where it appears in nav
  "refresh": 300,             // seconds between auto-refresh (0 = manual only)
  "layout": {
    "type": "stat-grid",      // cards | table | list | stat-grid | markdown | iframe
    "columns": 3,             // optional, layout-specific
    "items": "{{stripe.charges}}"  // data binding expression
  },
  "dataSources": {
    "stripe": {
      "type": "mcp",
      "endpoint": "stripe-mcp",
      "method": "charges.list",
      "params": { "limit": 50, "created_gte": "{{now - 7d}}" }
    }
  }
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `version` | yes | Schema version. Currently `1`. |
| `slug` | yes | URL-safe identifier. Must not collide with built-in tabs. |
| `title` | yes | Display name in sidebar. |
| `icon` | no | `IconName` string. Falls back to `"folder"`. |
| `subtitle` | no | Description shown in tab header. |
| `group` | no | `"main"` (default) or `"settings"`. |
| `refresh` | no | Auto-refresh interval in seconds. Default `0` (manual). |
| `layout` | yes | Layout config object (see section 2). |
| `dataSources` | no | Named data source configs (see section 3). |

### Example: Weekly Revenue (MCP data source)

```json
{
  "version": 1,
  "slug": "weekly-revenue",
  "title": "Weekly Revenue",
  "icon": "dollarSign",
  "subtitle": "Stripe charges this week",
  "refresh": 600,
  "layout": {
    "type": "stat-grid",
    "items": [
      { "label": "Total Revenue", "value": "{{stripe.total}}", "format": "currency" },
      { "label": "Transactions", "value": "{{stripe.count}}", "format": "number" },
      { "label": "Avg Transaction", "value": "{{stripe.average}}", "format": "currency" }
    ]
  },
  "dataSources": {
    "stripe": {
      "type": "mcp",
      "endpoint": "stripe-mcp",
      "method": "get_weekly_summary"
    }
  }
}
```

### Example: Team Standup Notes (vault folder)

```json
{
  "version": 1,
  "slug": "standup-notes",
  "title": "Standup Notes",
  "icon": "users",
  "subtitle": "Latest standup notes from vault",
  "refresh": 0,
  "layout": {
    "type": "list",
    "items": "{{vault.files}}",
    "itemTemplate": {
      "title": "{{item.name}}",
      "subtitle": "{{item.modified}}",
      "action": { "type": "open-file", "path": "{{item.path}}" }
    }
  },
  "dataSources": {
    "vault": {
      "type": "rpc",
      "method": "godmode.vault.list",
      "params": { "folder": "03-Resources/standups", "limit": 20, "sort": "modified-desc" }
    }
  }
}
```

### Example: Project Status (static data)

```json
{
  "version": 1,
  "slug": "project-status",
  "title": "Project Status",
  "icon": "folder",
  "subtitle": "Current project statuses",
  "refresh": 0,
  "layout": {
    "type": "cards",
    "items": "{{projects.items}}",
    "itemTemplate": {
      "title": "{{item.name}}",
      "subtitle": "{{item.status}}",
      "badge": "{{item.priority}}"
    }
  },
  "dataSources": {
    "projects": {
      "type": "static",
      "data": {
        "items": [
          { "name": "GodMode v1", "status": "Shipping", "priority": "P0" },
          { "name": "Project Beta", "status": "In Progress", "priority": "P1" },
          { "name": "Project Alpha VSL", "status": "Blocked", "priority": "P1" }
        ]
      }
    }
  }
}
```

---

## 2. Renderer Architecture

### File: `ui/src/ui/views/custom-tab-renderer.ts`

A single Lit component that:
1. Receives a parsed manifest object as a property.
2. Fetches data from each `dataSource` via a data-fetching service.
3. Resolves `{{...}}` template bindings against fetched data.
4. Delegates to a layout sub-renderer based on `layout.type`.

### Built-in Layout Types

| Type | Renders As |
|------|-----------|
| `cards` | Grid of card elements with title, subtitle, badge, optional action. |
| `table` | HTML table with sortable column headers. Schema: `columns[]` + `rows` binding. |
| `list` | Vertical list with title/subtitle per item, optional click action. |
| `stat-grid` | Grid of large-number stat cards (label + value + optional format). |
| `markdown` | Rendered markdown block (data source returns markdown string). |
| `iframe` | Sandboxed iframe (see section 4). URL from data source or static `src`. |

### Template Binding

Syntax: `{{dataSourceName.field.path}}` — dot-path traversal into fetched data.

Special variables:
- `{{item.*}}` — current item inside `itemTemplate` (list/cards iteration).
- `{{now}}` — current ISO timestamp.
- `{{now - 7d}}` — relative date math (days, hours, minutes).

No arbitrary expressions. No function calls. No ternary operators. The template engine is a simple key-path resolver with date math — nothing more.

### Unknown Layout Handling

If `layout.type` is not in the built-in set, the renderer shows:

> "Unsupported layout type: {type}. This tab may require a newer version of GodMode."

This ensures forward compatibility when new layout types are added in future versions.

---

## 3. Data Source Abstraction

Each entry in `dataSources` is fetched independently. Results are merged into a single namespace for template binding.

### Source Types

| Type | How It Works |
|------|-------------|
| `mcp` | Calls an MCP endpoint the user has already approved in Connections. `endpoint` = MCP server name, `method` = tool/resource name, `params` = arguments. |
| `rpc` | Calls a GodMode gateway RPC method. Goes through the allowlist (see section 4). |
| `rest` | HTTP GET/POST to a URL. Response must be JSON. Headers can include `{{env.VARIABLE}}` for API keys stored in user env. |
| `static` | Inline data in the manifest. No fetch needed. |

### Fetch Flow

```
manifest.dataSources
    → for each source:
        → validate against security policy (section 4)
        → fetch data (MCP call / RPC call / HTTP request / inline)
        → store result under source name
    → merge all results into binding context
    → pass to layout renderer
```

### Error Handling

If a data source fails:
- Show the tab with a warning banner: "Failed to load {sourceName}: {error}".
- Other data sources still render.
- No retry loop — user clicks "Refresh" to retry.

---

## 4. Security Model

### Principles

Custom tabs are **display-only surfaces**. They read data and render it. They never write data, modify state, or execute actions beyond navigation.

### Sandbox Rules

1. **No `eval()`.** Template binding is key-path resolution only.
2. **No dynamic imports.** The renderer is a single compiled component.
3. **No DOM access** outside the tab's own container element.
4. **No access to core app state** — custom tab components receive data via properties, never import app stores.

### Data Source Security

**MCP endpoints:** Must be a server the user has already approved in Connections. The renderer checks the active connections list before calling. Unknown MCP servers are rejected.

**RPC allowlist:** Only read-only GodMode methods are callable:

```
godmode.vault.list
godmode.vault.read
godmode.tasks.list
godmode.sessions.list
godmode.queue.status
godmode.health
godmode.workspaces.list
```

Write methods (`queue.add`, `tasks.create`, etc.) are never exposed to custom tabs.

**REST endpoints:** Allowed, but:
- Only GET requests by default. POST requires explicit `"method": "POST"` in the source config.
- Response bodies over 1 MB are truncated.
- No `file://` or `localhost` URLs unless the user explicitly enables "local data sources" in settings.

**iframe mode:** For community-shared or advanced tabs:
- `sandbox="allow-scripts allow-same-origin"` — no `allow-top-navigation`, no `allow-popups`.
- Communication via `postMessage` only. The host listens for a restricted set of message types: `{ type: "resize", height }`, `{ type: "request-data", source }`, `{ type: "navigate", tab }`.
- No direct access to GodMode DOM, state, or APIs.

---

## 5. Upgrade Safety

### Storage Location

Custom tabs live in `~/godmode/custom-tabs/`. This is a user data directory under `GODMODE_ROOT`, never overwritten by plugin updates. Same pattern as `~/godmode/memory/` and `~/godmode/data/`.

### Version Migration

The `version` field in each manifest enables forward compatibility:
- **v1 manifests** will always be supported.
- If a future v2 adds new fields, the renderer ignores unknown fields from v1 manifests.
- If a v2 manifest is loaded by a v1 renderer, unknown layout types show the "unsupported" fallback message.

### Dynamic Registration

Custom tabs are discovered at runtime, not compiled into the app:
1. On gateway start, scan `~/godmode/custom-tabs/*.json` for valid manifests.
2. Register each as a dynamic tab via an RPC method (`godmode.customTabs.list`).
3. The UI calls this RPC on load and adds custom tabs to the sidebar.
4. The `DYNAMIC_TABS` array in `navigation.ts` remains for built-in dynamic tabs; custom tabs use a separate registry.
5. Adding/removing a `.json` file takes effect on next UI refresh — no restart needed.

### Slug Collision Protection

If a custom tab slug matches a built-in tab name (`chat`, `today`, `team`, etc.), it is rejected with a warning in the console. The built-in tab always wins.

---

## 6. Community Sharing

### Export

The ally can export a custom tab as a `.godmode-tab.json` file:
- Same content as the manifest, but with `static` data sources only (MCP/RPC configs are stripped since they reference local connections).
- The ally can inline a snapshot of the data for preview purposes.

### Import

The ally can import a `.godmode-tab.json` file:
1. Validate schema version.
2. Check for slug collision.
3. Copy to `~/godmode/custom-tabs/{slug}.json`.
4. If data sources reference MCP endpoints the user does not have, show a notice: "This tab uses Stripe MCP — connect it in Settings to see live data."

### Safety

- No code execution in shared tabs. Manifests are declarative JSON only.
- `iframe` sources in shared tabs are loaded with the strictest sandbox policy.
- The import flow shows the user a preview of what the tab will look like before confirming.

### Future: GodMode Hub

A community marketplace for tab manifests. Out of scope for v1 — noted here for roadmap alignment. The file-based format makes this trivial to add later.

---

## 7. Ally Integration

### Creating a Custom Tab

User: "I want a tab that shows my Stripe revenue this week."

Ally flow:
1. Ally checks if user has a Stripe MCP connection active.
2. Ally generates a manifest JSON matching the schema.
3. Ally writes it to `~/godmode/custom-tabs/weekly-revenue.json` using file tools.
4. Ally calls `godmode.customTabs.register` RPC to make it appear immediately.
5. Ally: "Done — check your sidebar for 'Weekly Revenue'."

### Modifying a Custom Tab

User: "Change the revenue tab to show monthly instead of weekly."

Ally reads the existing manifest, updates the data source params, writes the file back. The UI picks up changes on next refresh (or the ally triggers a refresh).

### Proactive Suggestions

The ally can suggest custom tabs based on context:
- "I see you have Stripe connected — want a revenue dashboard tab?"
- "You check standup notes every morning — want a dedicated tab for those?"
- "Your weekly review always pulls the same 3 metrics — I can make a tab for that."

These suggestions are driven by awareness snapshot signals (connected integrations, repeated search patterns) — no new engine code needed. The ally just writes a manifest file.

### Ally Commands

The ally uses standard file tools to manage custom tabs. No special tooling required:
- **Create:** Write JSON to `~/godmode/custom-tabs/{slug}.json`
- **Update:** Read, modify, write back
- **Delete:** Remove the file
- **List:** Read directory listing

---

## Implementation Sequence (when this moves to code)

1. **Manifest loader** — scan `~/godmode/custom-tabs/`, validate, expose via `godmode.customTabs.list` RPC.
2. **UI renderer** — `custom-tab-renderer.ts` Lit component with layout sub-renderers.
3. **Dynamic sidebar** — UI calls `customTabs.list` on load, appends to nav.
4. **Data fetch service** — MCP/RPC/REST/static fetcher with security checks.
5. **Template engine** — key-path resolver with date math.
6. **iframe layout** — sandboxed iframe with postMessage bridge.
7. **Ally skill card** — `skill-cards/custom-tabs.md` so the ally knows how to create tabs.

Estimated effort: ~3 days for a senior engineer. Layout types can be added incrementally.

---

*This is a design document. No code changes are included. Implementation should follow the standard pipeline: plan review, test-driven development, QA, ship.*
