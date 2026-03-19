# 🍎 The GodMode Perfection Plan

**"Details aren't details. They make the design." — Charles Eames (Jobs' favorite quote)**

This plan takes GodMode from a brilliant builder's prototype to a product that makes Steve Jobs weep with joy. Four phases, six weeks, zero compromises.

**Ground rule:** Every phase ends with a green build, passing tests, and a demo-able product. No phase starts until the previous one ships clean.

---

## Phase 1: MAKE IT CORRECT (Days 1–3)

*"If you can't build it clean, you can't build it at all."*

Everything in Phase 1 is a **precondition for shipping anything**. The 17 typecheck errors and 6 failing tests are open wounds — they accumulate infection (new code built on broken assumptions). This phase is 100% delete-and-fix, zero features.

---

### 1.1 — Kill the Phantom Dependencies (30 min)

**Problem:** `optimization-eval.ts` and `optimization-orchestrator.ts` import `@anthropic-ai/sdk` which isn't in dependencies. Neither file is imported by anything else in the codebase.

**Fix:**
```bash
# Delete both files — they're dead code with zero importers
rm src/lib/optimization-eval.ts
rm src/services/optimization-orchestrator.ts
```

**Errors resolved:** 5 of 17
- `src/lib/optimization-eval.ts(70,35): TS2307`
- `src/lib/optimization-eval.ts(181,35): TS2307`
- `src/services/optimization-orchestrator.ts(32,13): TS2339` (resolveWorkflowFile import mismatch)
- `src/services/optimization-orchestrator.ts(47,35): TS2307`
- `src/services/optimization-orchestrator.ts(73,35): TS2307`
- `src/services/optimization-orchestrator.ts(280,5): TS2345` (boolean[][] vs boolean[])

**Verification:** `pnpm typecheck 2>&1 | grep optimization` returns nothing.

---

### 1.2 — Fix the WebSocket Type Errors (15 min)

**Problem:** `ws-server.ts` has 4 type errors because `@types/ws` isn't installed.

**Fix:**
```bash
pnpm add -D @types/ws
```

**Errors resolved:** 4 of 17
- `src/adapter/hermes/ws-server.ts(14,49): TS7016`
- `src/adapter/hermes/ws-server.ts(64,32): TS7006`
- `src/adapter/hermes/ws-server.ts(68,25): TS7006`
- `src/adapter/hermes/ws-server.ts(77,23): TS7006`

---

### 1.3 — Fix register-all.ts Dead References (30 min)

**Problem:** Two dead API references after refactoring:
1. `honcho-client.ingestTurn` doesn't exist (line 252)
2. `calendar.getCalendarHandlers` doesn't exist (line 289)

**Fix for ingestTurn (line 252):**
Check what honcho-client actually exports and use the correct function name. The dynamic import already wraps in try/catch so worst case: update the import to match the actual export, or remove the block if the ingest API was intentionally removed.

```typescript
// If honcho-client no longer exports ingestTurn, remove the block:
// Lines 249-254: delete the entire onAfterChat Honcho block
// OR update to match the actual export name
```

**Fix for getCalendarHandlers (line 289):**
The calendar method was refactored. The function tries to use gog CLI directly 2 lines later anyway. Remove the dead import and the unreachable code path.

```typescript
// Delete line 289's import attempt — the fallback gog CLI exec on line 291+ already handles this
```

**Fix for trust-rate tool type mismatch (line 197):**
The `createTrustRateTool` returns `AnyAgentTool` but the adapter expects `StandaloneAgentTool`. Add a type assertion or update the tool's return type signature.

```typescript
// Option A: Update createTrustRateTool to return StandaloneAgentTool
// Option B: Type assertion at the registration point (pragmatic for now)
```

**Errors resolved:** 3 of 17
- `src/adapter/register-all.ts(197,28): TS2345`
- `src/adapter/register-all.ts(252,17): TS2339`
- `src/adapter/register-all.ts(289,13): TS2339`

---

### 1.4 — Fix Remaining Type Errors (45 min)

**chat-proxy.ts line 366 — content type mismatch:**
`session.messages` contains items where `content` can be `string | ContentBlock[]` but the return type expects `string`. Fix: stringify ContentBlock arrays.

```typescript
// In getHistory():
return session.messages.map((m) => ({
  role: m.role,
  content: typeof m.content === 'string' ? m.content : m.content.map(b => b.text ?? '').join(''),
}));
```

**prompt-sanitizer.ts line 78 — AuditEvent union doesn't include "prompt.sanitized":**
Add `"prompt.sanitized"` to the `AuditEvent` type union, or use the correct event name from the union.

**queue-processor.ts line 123 — QueueItemType vs TaskType:**
`"optimize"` exists in `QueueItemType` but not `TaskType`. Either add `"optimize"` to `TaskType` or filter it out before passing to `checkEvidenceShared`.

**queue-processor.ts line 309 — `assignedTo` doesn't exist on `QueueItem`:**
The `QueueItem` type needs an `assignedTo?: string` field, or use the correct field name (likely `persona`).

**Errors resolved:** 5 of 17

---

### 1.5 — Fix the 6 Failing Tests (1 hour)

**Problem:** All 6 failures are in `tests/context-budget.test.ts`. The tests expect specific strings in the context output that changed during the lean audit.

**Fix:** Read the current output of the context-budget function and update test assertions to match. The tests are testing the right behavior (context stays under budget, priority sections appear first) — just with stale string expectations.

**Verification:** `npx vitest run` → 0 failed, 56 passed.

---

### 1.6 — Add CI Guardrails (1 hour)

**Add to `package.json` scripts:**
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "tsc --noEmit && vitest run",
    "precommit": "pnpm typecheck && pnpm test"
  }
}
```

**Add pre-commit hook** (extend existing `scripts/hooks/branch-guard.sh`):
```bash
# After branch guard check:
echo "Running typecheck..."
pnpm typecheck || { echo "❌ Typecheck failed. Fix errors before committing."; exit 1; }
echo "Running tests..."
pnpm test || { echo "❌ Tests failed. Fix failures before committing."; exit 1; }
```

**Phase 1 Exit Criteria:**
- [ ] `pnpm typecheck` → 0 errors
- [ ] `npx vitest run` → 0 failures
- [ ] `pnpm build` → clean
- [ ] Pre-commit hook enforces both
- [ ] Commit: `fix: green build — resolve all 17 type errors and 6 test failures`

---

## Phase 2: MAKE IT BEAUTIFUL (Days 4–14)

*"Design is not just what it looks like and feels like. Design is how it works."*

Phase 2 is the biggest investment and the highest-leverage work. The God Component decomposition and design system together transform GodMode from a power-user prototype into something that *feels* premium at $300/month.

---

### 2.1 — Design Token Foundation (Day 4, 4 hours)

**Create `ui/src/ui/design-system/tokens.ts`:**

```typescript
import { css } from "lit";

/**
 * GodMode Design Tokens
 * 
 * Every visual value flows from here. Components use tokens,
 * never hardcoded values. This is the source of visual truth.
 */
export const tokens = css`
  :host {
    /* ── Spacing (4px base grid) ──────────────────────── */
    --gm-space-1: 4px;    /* tight */
    --gm-space-2: 8px;    /* compact */
    --gm-space-3: 12px;   /* default inner */
    --gm-space-4: 16px;   /* default outer */
    --gm-space-5: 24px;   /* section gap */
    --gm-space-6: 32px;   /* major section */
    --gm-space-8: 48px;   /* page margin */

    /* ── Typography ───────────────────────────────────── */
    --gm-font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
    --gm-font-mono: "SF Mono", "Cascadia Code", "JetBrains Mono", monospace;
    
    --gm-text-xs: 11px;   /* labels, metadata */
    --gm-text-sm: 13px;   /* secondary content */
    --gm-text-md: 15px;   /* body text */
    --gm-text-lg: 18px;   /* section headers */
    --gm-text-xl: 24px;   /* page headers */
    --gm-text-2xl: 32px;  /* hero text */
    
    --gm-weight-normal: 400;
    --gm-weight-medium: 500;
    --gm-weight-semibold: 600;
    --gm-weight-bold: 700;
    
    --gm-leading-tight: 1.25;
    --gm-leading-normal: 1.5;
    --gm-leading-relaxed: 1.7;

    /* ── Radii ────────────────────────────────────────── */
    --gm-radius-sm: 4px;   /* buttons, badges */
    --gm-radius-md: 8px;   /* cards, inputs */
    --gm-radius-lg: 12px;  /* panels, modals */
    --gm-radius-xl: 16px;  /* major containers */
    --gm-radius-full: 9999px; /* pills, avatars */

    /* ── Shadows ───────────────────────────────────────── */
    --gm-shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
    --gm-shadow-md: 0 2px 8px rgba(0,0,0,0.1);
    --gm-shadow-lg: 0 4px 16px rgba(0,0,0,0.12);
    --gm-shadow-xl: 0 8px 32px rgba(0,0,0,0.16);

    /* ── Transitions ──────────────────────────────────── */
    --gm-transition-fast: 120ms ease;
    --gm-transition-normal: 200ms ease;
    --gm-transition-slow: 400ms ease;

    /* ── Layout ────────────────────────────────────────── */
    --gm-sidebar-width: 260px;
    --gm-header-height: 48px;
    --gm-input-height: 36px;
    --gm-max-content-width: 800px;
  }
`;
```

**Create `ui/src/ui/design-system/themes.ts`:**

```typescript
import { css } from "lit";

export const darkTheme = css`
  :host, .theme-dark {
    /* ── Surfaces ──────────────────────────────────── */
    --gm-bg: #0d0d0d;
    --gm-bg-subtle: #141414;
    --gm-surface: #1a1a1a;
    --gm-surface-hover: #222222;
    --gm-surface-active: #2a2a2a;
    --gm-surface-raised: #1e1e1e;
    --gm-surface-overlay: rgba(0,0,0,0.6);

    /* ── Text ──────────────────────────────────────── */
    --gm-text: #e8e8e8;
    --gm-text-secondary: #999999;
    --gm-text-tertiary: #666666;
    --gm-text-inverse: #0d0d0d;
    --gm-text-link: #6ea8fe;

    /* ── Borders ───────────────────────────────────── */
    --gm-border: #2a2a2a;
    --gm-border-subtle: #1f1f1f;
    --gm-border-strong: #3a3a3a;

    /* ── Accent ────────────────────────────────────── */
    --gm-accent: #6ea8fe;
    --gm-accent-hover: #8bb9ff;
    --gm-accent-muted: rgba(110,168,254,0.15);
    --gm-accent-text: #ffffff;

    /* ── Status ────────────────────────────────────── */
    --gm-success: #4ade80;
    --gm-success-muted: rgba(74,222,128,0.15);
    --gm-warning: #fbbf24;
    --gm-warning-muted: rgba(251,191,36,0.15);
    --gm-error: #f87171;
    --gm-error-muted: rgba(248,113,113,0.15);
    --gm-info: #60a5fa;
    --gm-info-muted: rgba(96,165,250,0.15);

    /* ── Chat-specific ─────────────────────────────── */
    --gm-user-bubble: #1e3a5f;
    --gm-assistant-bubble: #1a1a1a;
    --gm-tool-bg: #111827;
    --gm-code-bg: #161b22;

    /* ── Scrollbar ─────────────────────────────────── */
    --gm-scrollbar-thumb: #333;
    --gm-scrollbar-track: transparent;
  }
`;

export const lightTheme = css`
  :host, .theme-light {
    --gm-bg: #ffffff;
    --gm-bg-subtle: #f8f8f8;
    --gm-surface: #f0f0f0;
    --gm-surface-hover: #e8e8e8;
    --gm-surface-active: #e0e0e0;
    --gm-surface-raised: #ffffff;
    --gm-surface-overlay: rgba(255,255,255,0.8);

    --gm-text: #1a1a1a;
    --gm-text-secondary: #666666;
    --gm-text-tertiary: #999999;
    --gm-text-inverse: #ffffff;
    --gm-text-link: #2563eb;

    --gm-border: #e0e0e0;
    --gm-border-subtle: #eeeeee;
    --gm-border-strong: #cccccc;

    --gm-accent: #2563eb;
    --gm-accent-hover: #1d4ed8;
    --gm-accent-muted: rgba(37,99,235,0.1);
    --gm-accent-text: #ffffff;

    --gm-success: #16a34a;
    --gm-success-muted: rgba(22,163,74,0.1);
    --gm-warning: #d97706;
    --gm-warning-muted: rgba(217,119,6,0.1);
    --gm-error: #dc2626;
    --gm-error-muted: rgba(220,38,38,0.1);
    --gm-info: #2563eb;
    --gm-info-muted: rgba(37,99,235,0.1);

    --gm-user-bubble: #e8f0fe;
    --gm-assistant-bubble: #f0f0f0;
    --gm-tool-bg: #f3f4f6;
    --gm-code-bg: #f6f8fa;

    --gm-scrollbar-thumb: #ccc;
    --gm-scrollbar-track: transparent;
  }
`;
```

**Create `ui/src/ui/design-system/index.ts`:** Re-export everything.

**Why this matters:** Every hardcoded value (241 `px` values, 37 hex colors) gets a semantic name. Theming becomes a variable swap. Consistency becomes automatic.

---

### 2.2 — The God Component Decomposition (Days 5–10)

This is the single highest-leverage change in the entire plan. **310 @state() properties in one class** is not a web component — it's a monolith wearing a trench coat.

#### The Decomposition Strategy

**Principle:** The app shell is a **router + layout + shared bus**. Each tab is a **self-contained LitElement** that manages its own state, fetches its own data, and renders independently.

#### Step 1: Create the Shared Context (Day 5, 4 hours)

**Create `ui/src/ui/context/app-context.ts`:**

Shared state that multiple views need (connection status, session key, settings, user/assistant identity) lives in a Lit `@lit/context` provider. Views consume only what they need.

```typescript
import { createContext } from "@lit/context";

export interface AppContext {
  // Connection
  connected: boolean;
  reconnecting: boolean;
  sessionKey: string;
  
  // Identity
  assistantName: string;
  assistantAvatar: string;
  userName: string;
  userAvatar: string;
  
  // Settings
  theme: ThemeMode;
  settings: UiSettings;
  
  // Navigation
  setTab: (tab: Tab) => void;
  
  // WebSocket
  send: (method: string, params?: unknown) => Promise<unknown>;
  subscribe: (event: string, handler: (data: unknown) => void) => () => void;
}

export const appContext = createContext<AppContext>("gm-app-context");
```

#### Step 2: Create Tab View Components (Days 5–9)

Each tab becomes its own LitElement with local state, consuming only `appContext` from the parent:

| Component | File | Owns State For | Current Source |
|-----------|------|----------------|----------------|
| `<gm-chat>` | `views/chat-view.ts` | messages, stream, attachments, drafts, tool stream, sidebar | app.ts chat*, sidebar*, tool* states (~80 @state) |
| `<gm-today>` | `views/today-view.ts` | daily brief, calendar, tasks, schedule | app.ts my-day/today states (~30 @state) |
| `<gm-work>` | `views/work-view.ts` | queue, agents, sessions, skills, inbox, cron | app.ts work-related states (~50 @state) |
| `<gm-second-brain>` | `views/second-brain-view.ts` | vault search, notes, research | app.ts second-brain states (~15 @state) |
| `<gm-dashboards>` | `views/dashboards-view.ts` | dynamic slots, dashboard HTML | app.ts dashboard states (~10 @state) |
| `<gm-settings>` | `views/settings-view.ts` | config forms, nodes, channels, guardrails, debug | app.ts config/node states (~60 @state) |

**State Migration Pattern:**
```typescript
// BEFORE (in app.ts — 310 @state properties, one mega-class):
@state() chatMessages: unknown[] = [];
@state() chatStream: string | null = null;
@state() chatSending = false;
// ... 307 more

// AFTER (in chat-view.ts — each view owns its state):
@customElement("gm-chat")
export class GmChat extends LitElement {
  @consume({ context: appContext }) ctx!: AppContext;
  
  @state() messages: unknown[] = [];
  @state() stream: string | null = null;
  @state() sending = false;
  // ... only the ~80 states that chat actually needs
}
```

#### Step 3: The Thin App Shell (Day 9, 4 hours)

**Target: `app.ts` goes from 4,171 lines → ~300 lines.**

The shell does exactly 5 things:
1. Establishes WebSocket connection
2. Provides `appContext` to children
3. Renders the navigation bar
4. Routes to the active tab view (lazy-loaded)
5. Handles global keyboard shortcuts and notifications

```typescript
@customElement("godmode-app")
export class GodModeApp extends LitElement {
  static styles = [tokens, darkTheme, lightTheme, shellStyles];

  @provide({ context: appContext })
  @state() ctx: AppContext = { ... };

  @state() tab: Tab = "chat";

  render() {
    return html`
      <div class="shell theme-${this.ctx.settings.theme}">
        <gm-nav .tab=${this.tab} @tab-change=${this._onTab}></gm-nav>
        <main class="content">
          ${this._renderActiveTab()}
        </main>
      </div>
    `;
  }

  private _renderActiveTab() {
    switch (this.tab) {
      case "chat": return html`<gm-chat></gm-chat>`;
      case "today": return html`<gm-today></gm-today>`;
      case "work": return html`<gm-work></gm-work>`;
      case "second-brain": return html`<gm-second-brain></gm-second-brain>`;
      case "dashboards": return html`<gm-dashboards></gm-dashboards>`;
      case "settings": return html`<gm-settings></gm-settings>`;
    }
  }
}
```

#### Step 4: Lazy Loading (Day 10, 2 hours)

Each tab view is dynamically imported on first visit:

```typescript
private async _renderActiveTab() {
  switch (this.tab) {
    case "chat":
      await import("./views/chat-view.js");
      return html`<gm-chat></gm-chat>`;
    case "today":
      await import("./views/today-view.js");
      return html`<gm-today></gm-today>`;
    // ...
  }
}
```

**Bundle target:** Main chunk under 200KB. Each view chunk 20–80KB loaded on demand.

#### Step 5: Delete app-render.ts (Day 10, 1 hour)

Once all rendering has moved into tab views, `app-render.ts` (2,348 lines) gets deleted entirely. The rendering helpers that are shared across views move to `ui/src/ui/shared/render-helpers.ts`.

---

### 2.3 — Enforce 6-Tab Navigation (Day 10, 2 hours)

**Current state:** 27 views in the navigation. The architecture mandates 6 tabs.

**The rule:**
- **Primary tabs (always visible):** Chat, Today, Work, Second Brain, Dashboards, Settings
- **Sub-views (inside Settings):** Nodes, Channels, Guardrails, Debug, Logs, Agents, Trust Tracker, Cron, Sessions, Exec Approval
- **Contextual panels (overlays, not tabs):** File Explorer, Markdown Sidebar, Onboarding Wizard, Daily Brief modal, Gateway restart/confirm

**Implementation:**
```typescript
// navigation.ts — the ONLY navigation definition
export const PRIMARY_TABS = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "today", label: "Today", icon: "☀️" },
  { id: "work", label: "Work", icon: "⚡" },
  { id: "second-brain", label: "Second Brain", icon: "🧠" },
  { id: "dashboards", label: "Dashboards", icon: "📊" },
  { id: "settings", label: "Settings", icon: "⚙️" },
] as const;

// Settings has its own sub-navigation rendered inside <gm-settings>
export const SETTINGS_SECTIONS = [
  "general", "nodes", "channels", "agents", "guardrails", 
  "trust", "cron", "sessions", "debug", "logs"
] as const;
```

The navigation bar renders exactly 6 items. Settings contains everything else. This is the *only* change that makes the product feel intentional vs. accidental.

---

### 2.4 — Migrate Inline Styles to Tokens (Days 11–13)

**Scope:** 241 hardcoded `px` values, 37 hardcoded hex colors, 53 existing `var(--` usages.

**Process:** Systematic file-by-file migration. For each UI `.ts` file:
1. Replace hardcoded colors → `var(--gm-*)` tokens
2. Replace hardcoded spacing → `var(--gm-space-*)` tokens
3. Replace hardcoded font sizes → `var(--gm-text-*)` tokens
4. Replace hardcoded radii → `var(--gm-radius-*)` tokens

**Target:** 0 hardcoded hex colors, <20 hardcoded `px` values (where truly unique), 300+ `var(--gm-*)` usages.

**Priority order:**
1. Chat view (the primary interface — users see this 80% of the time)
2. Today view (the morning experience)
3. Navigation (always visible)
4. Work view
5. Settings (least visible)

---

### 2.5 — Accessibility Pass (Day 14)

**Current state:** 62 ARIA attributes across the entire UI. Target: 200+.

**Minimum requirements for a $300/month product:**
- All interactive elements have `role` and `aria-label`
- Tab navigation works with keyboard (arrow keys within tab bar, Tab to content)
- Chat input has `aria-describedby` for context
- Modal/sidebar traps focus correctly
- All status changes announce via `aria-live` regions
- Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)

**Phase 2 Exit Criteria:**
- [ ] `app.ts` < 400 lines
- [ ] `app-render.ts` deleted
- [ ] 6 tab views, each independently rendered
- [ ] Design token system with 50+ tokens
- [ ] 0 hardcoded hex colors in component styles
- [ ] Main bundle < 200KB
- [ ] Keyboard navigation works for all primary flows
- [ ] `pnpm typecheck && pnpm test` still green

---

## Phase 3: MAKE IT FEEL ALIVE (Days 15–28)

*"People don't know what they want until you show it to them."*

Phase 3 is where GodMode stops being a tool and starts being a *relationship*. This is the emotional layer — the thing that makes someone pay $300/month when ChatGPT is free.

---

### 3.1 — Complete the Soul Interview (Days 15–18)

**Current state:** `SoulProfile` interface exists (7 blocks, 20 fields). `SOUL.md` exists at `~/godmode/SOUL.md` with beautiful philosophical grounding. The onboarding service has soul profile handling (`src/services/onboarding.ts` lines 23–68, 200–247, 378+). But the **conversational flow that generates the user's soul profile** is incomplete.

**What needs to happen:**

The soul interview is the **first date** with GodMode. It should be the best 10 minutes of AI interaction anyone has ever had. Not a form. Not a wizard. A conversation.

**Architecture:**
```
src/services/onboarding.ts     → SoulProfile type + SOUL.md generator (exists)
src/hooks/onboarding-context.ts → Injects interview prompts (exists, needs completion)
src/tools/onboard.ts            → Onboard tool that accepts soulProfile data (exists)
NEW: src/lib/soul-interview.ts  → Conversational interview engine
```

**The Soul Interview Flow:**

Phase A — **Quick Win** (2 min): Name, what they do, one thing they want help with TODAY. Deploy an agent to do that thing immediately. They see value in 120 seconds.

Phase B — **The Soul Questions** (opt-in, 5–10 min, conversational):
1. "What's one thing you want more of in your life?" → `ground` field
2. "When you're at your best, what does that look like?" → `atMyBest` field  
3. "What's a pattern you keep falling into that you'd like to change?" → `blindSpots` field
4. "What does a perfect Tuesday look like for you?" → `rhythm` field
5. "What matters more to you than money?" → `anchor` field
6. "If I could handle one type of task so you never had to think about it again, what would it be?" → `delegationComfort` field

Phase C — **Soul Profile Generation**: Take the conversation and generate:
- `~/godmode/SOUL.md` — the deep identity document (append user-specific sections to the existing philosophical foundation)
- `~/godmode/data/soul-profile.json` — structured data for context injection
- Update awareness snapshot to include soul insights

**The interview should feel like talking to a wise friend who asks exactly the right questions.** Not a form. Not a checklist. A conversation with natural follow-ups and genuine curiosity.

---

### 3.2 — Surface Degradation as Onboarding (Days 19–21)

**Current state:** 782 catch blocks in `src/`, at least 15 completely empty. When a service fails (no calendar, no vault, no Honcho), the user gets… nothing. Empty spaces where data should be.

**The fix: Structured Degradation → Onboarding Nudges**

**Create `src/lib/service-health.ts`:**

```typescript
export interface ServiceStatus {
  service: string;
  status: "connected" | "degraded" | "unavailable";
  message?: string;         // User-facing message
  setupAction?: string;     // What to do about it
  lastChecked: number;
}

// Global health registry
const health: Map<string, ServiceStatus> = new Map();

export function reportDegraded(service: string, message: string, setupAction?: string) {
  health.set(service, {
    service,
    status: "degraded",
    message,
    setupAction,
    lastChecked: Date.now(),
  });
}

export function reportConnected(service: string) {
  health.set(service, {
    service,
    status: "connected",
    lastChecked: Date.now(),
  });
}

export function getHealthSummary(): ServiceStatus[] {
  return [...health.values()];
}
```

**Migrate critical empty catches:**

```typescript
// BEFORE (silent failure):
try {
  const events = await getCalendarEvents();
} catch { /* not found */ }

// AFTER (degradation nudge):
try {
  const events = await getCalendarEvents();
  reportConnected("calendar");
} catch {
  reportDegraded(
    "calendar",
    "Calendar not connected — your morning brief will be richer with it",
    "Connect Google Calendar in Settings → Integrations"
  );
}
```

**Surface in Today View:**
The Today tab shows a soft onboarding card when services are degraded:

```
┌──────────────────────────────────────────┐
│ 🔌 Make GodMode smarter                  │
│                                          │
│ ☀️ Connect Calendar → richer daily briefs │
│ 📓 Set Obsidian vault → Second Brain     │
│ 🧠 Complete soul interview → deeper ally │
│                                          │
│ 3 of 7 integrations connected            │
│ ████████░░░░░░░░░░░ 43%                  │
└──────────────────────────────────────────┘
```

**This turns "nothing works" into "look how much better it can get."** Churn prevention through progressive onboarding.

---

### 3.3 — Kill Dead Code & Stubs (Days 22–23)

**Delete list (confirmed zero importers):**
- `src/lib/optimization-eval.ts` *(done in Phase 1)*
- `src/services/optimization-orchestrator.ts` *(done in Phase 1)*
- Any remaining dead imports in `register-all.ts`

**Audit stubs returning `[]` — triage each one:**
- `identity-graph.ts` returns `[]` on short/empty input → **correct** (guard clause)
- `interaction-ledger.ts` returns `[]` in 10 places → audit: if no API key is set, **report degraded** instead of silent `[]`
- `agent-log.ts` line 281 → check if this is a real stub or a legitimate empty case

**Audit the "proactive intel" references:**
The audit found references in safety-gates (proactiveLookupGate), hooks, and queue-state. These aren't stubs — they're legitimate features. The "proactive intel stubs returning []" from the original gap list may be resolved. Verify by searching for functions that explicitly return empty arrays as placeholders vs. guard clauses.

---

### 3.4 — Trust Progression Dashboard (Days 24–26)

**Current state:** `trust-rate` tool is built and registered in `register-all.ts` line 181. Trust tracker methods exist at `src/methods/trust-tracker.ts` (1,100+ lines). The UI view exists at `ui/src/ui/views/trust-tracker.ts` (785 lines). The infrastructure is there — it needs the **emotional arc** made visible.

**What to build:**

The trust tracker should feel like a **relationship health dashboard**, not a metrics page.

```
┌──────────────────────────────────────────┐
│ 🤝 Trust Journey                          │
│                                          │
│ Content Writing  ████████████░░░ 8.2/10  │
│   21 tasks · avg improving ↑             │
│                                          │
│ Meeting Prep     ██████████░░░░░ 7.1/10  │
│   8 tasks · consistent                   │
│                                          │
│ Code Reviews     ████████░░░░░░░ 5.6/10  │
│   4 tasks · needs attention ⚠️            │
│   → "Missed edge cases in auth module"   │
│                                          │
│ Inbox Triage     ░░░░░░░░░░░░░░░ new     │
│   Try it? Your inbox has 12 unread       │
│                                          │
│ ─────────────────────────────────────── │
│ Overall: Supervised → Semi-autonomous    │
│ You've rated 33 tasks across 3 workflows │
│ 67% delegation rate this week (↑ from 45%)│
└──────────────────────────────────────────┘
```

**Key elements:**
1. **Per-workflow trust bars** with running averages
2. **Trend arrows** (improving, stable, declining)
3. **Latest feedback** shown inline for low-score workflows
4. **Suggested new workflows** based on what the user does but hasn't delegated
5. **Overall autonomy level** — the emotional progress bar from "new" → "supervised" → "semi-autonomous" → "full autonomy"

---

### 3.5 — Morning Brief ↔ Evening Reflection Loop (Days 26–28)

**Current state:** Daily brief generator exists at 2,086 lines (`brief-generator.ts`). It pulls calendar, tasks, health data. What's missing: the **evening reflection** that closes the loop.

**The Loop:**
```
Morning Brief (exists)
  → surfaces today's priorities, schedule, yesterday's unfinished work
  → user works through the day
  → ally observes patterns, completed tasks, delegated work

Evening Reflection (new)
  → ally offers: "Want to do a quick reflection on today?"
  → 3 questions: What moved the needle? What was busywork? What's being avoided?
  → answers get captured to vault (existing vault-capture pipeline)
  → next morning's brief references yesterday's reflection

The system gets smarter every day without adding code.
```

**Implementation:**
- Add `reflection` section to `brief-generator.ts` that reads yesterday's reflection from vault
- Add a cron/trigger for evening reflection (6pm local time)
- Reflection captured as `~/godmode/memory/reflections/YYYY-MM-DD.md`
- Morning brief reads most recent reflection file and includes top insights

---

### 3.6 — Ship 5 Starter Personas (Day 28)

**Zero code. Pure markdown files.** These showcase the meta-agent pattern and give new users immediate value.

Create `~/godmode/personas/`:

1. **`content-writer.md`** — Writes blog posts, social threads, newsletters in the user's voice. Reads SOUL.md for tone.
2. **`inbox-manager.md`** — Triages email, drafts responses, flags urgent items. Trust starts at "draft only."
3. **`meeting-prep.md`** — Before any calendar event, researches attendees, pulls relevant context from vault, prepares talking points.
4. **`competitor-watch.md`** — Weekly scan of competitor activity, product launches, pricing changes. Writes to vault inbox.
5. **`weekly-review.md`** — Every Friday, synthesizes the week: tasks completed, trust scores, patterns, recommendations for next week.

Each persona follows the existing frontmatter schema from `agent-roster.ts`:

```yaml
---
name: Content Writer
slug: content-writer
engine: claude
trust: supervised
skills: [writing, research, voice-matching]
triggers: ["write a post", "draft", "blog", "thread", "newsletter"]
---
```

**Phase 3 Exit Criteria:**
- [ ] Soul interview produces a user-specific SOUL.md section
- [ ] Service health system replaces 15+ silent catches
- [ ] Today tab shows integration progress bar
- [ ] Trust tracker has emotional arc visualization
- [ ] Evening reflection → morning brief loop works end-to-end
- [ ] 5 starter personas ship as markdown files
- [ ] All dead code deleted, all stubs resolved or documented
- [ ] `pnpm typecheck && pnpm test` still green

---

## Phase 4: MAKE IT COMPOUND (Days 29–42)

*"The people who are crazy enough to think they can change the world are the ones who do."*

Phase 4 is polish, compounding, and preparing for community. The foundation from Phases 1–3 means every new capability is a file, not code.

---

### 4.1 — Type Safety Cleanup (Days 29–31)

**Target:** 57 `any` types → <10.

**Priority order (impact × frequency):**
1. `before-prompt-build.ts` — `event: any, ctx: any, api: any` → define proper interfaces (this is the MOST important function)
2. `register-all.ts` — adapter types
3. `queue-processor.ts` — QueueItem and engine types
4. `chat-proxy.ts` — session and message types
5. Tool files — parameter and result types

**Approach:** Create `src/types/plugin-api.ts` with the core interfaces:
```typescript
export interface PromptBuildEvent {
  messages: Message[];
  sessionKey: string;
  isFirstTurn: boolean;
  // ... document every field
}

export interface PluginContext {
  config: GodModeConfig;
  logger: Logger;
  dataRoot: string;
  // ...
}

export interface PluginAPI {
  injectContext: (section: string, content: string, priority: number) => void;
  getSessionData: (key: string) => unknown;
  // ...
}
```

---

### 4.2 — Test Coverage Expansion (Days 32–35)

**Current state:** 3 test files for `src/`, ~56 tests total. ~11% coverage.

**Target:** 40% coverage on critical paths. Not 100% — just the paths where bugs cause real damage.

**Critical path tests needed:**

| Module | What to Test | Why |
|--------|-------------|-----|
| `before-prompt-build.ts` | Context assembly under budget, priority ordering, conditional injection | This is the product's brain |
| `safety-gates.ts` | Loop detection, prompt sanitization, spending limits | Security = trust |
| `queue-state.ts` | CRUD operations, state transitions, concurrent access | Data integrity |
| `trust-refinement.ts` | Score calculation, feedback persistence, persona file updates | The compounding moat |
| `awareness-snapshot.ts` | Snapshot generation, 15-min refresh, budget limits | Context quality |
| `onboarding.ts` | Soul profile generation, SOUL.md writing, state transitions | First impressions |
| `agent-roster.ts` | Persona loading, frontmatter parsing, engine resolution | Agent delegation |

**Test infrastructure:**
```bash
# Add to package.json scripts
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

---

### 4.3 — Bundle Optimization (Days 36–37)

**Current state:**
- Backend: `dist/index.js` = 1.14MB, `dist/standalone.js` = 430KB
- UI: `dist/assets/index-*.js` = 766KB

**Targets:**
- UI main bundle: < 200KB (with lazy tab loading from Phase 2)
- Backend: < 800KB (tree-shake dead code)

**UI optimization (post Phase 2 decomposition):**
- Each tab view in its own chunk (Vite automatic code splitting from dynamic imports)
- `marked` (markdown renderer) only loaded with Chat and Second Brain views
- Heavy components (code editor, file explorer) loaded on demand

**Backend optimization:**
- Remove dead `optimization-eval.ts` and `optimization-orchestrator.ts` (Phase 1)
- Audit `tsup` config for tree-shaking effectiveness
- Consider splitting standalone adapter from full plugin bundle

---

### 4.4 — Documentation (Days 38–40)

**For the $300/month community:**
- `docs/GETTING-STARTED.md` — 5-minute setup to first value
- `docs/SOUL-INTERVIEW.md` — What the soul interview is and why it matters
- `docs/CREATING-PERSONAS.md` — How to create and share agent personas
- `docs/TRUST-SYSTEM.md` — How trust works, how to rate, how it compounds
- `docs/ARCHITECTURE.md` — Technical overview for contributors (derived from meta-architecture)

**For contributors:**
- Update `AGENTS.md` with Phase 1–4 changes
- Add `CONTRIBUTING.md` with the coding guardrails
- Document the design system tokens and component patterns

---

### 4.5 — Community Scaffolding (Days 41–42)

**Prepare the file-sharing ecosystem:**
- `~/godmode/community/personas/` — shared persona directory
- `~/godmode/community/skills/` — shared skill directory
- `~/godmode/community/recipes/` — shared workflow bundles
- Each with a `README.md` explaining the format and how to contribute

**The community is where the moat becomes a network effect.** When users trade personas and skills, every member's GodMode gets better. The file-as-API architecture makes this trivial — it's just sharing markdown files.

**Phase 4 Exit Criteria:**
- [ ] `any` types < 10 in src/
- [ ] 40%+ test coverage on critical paths
- [ ] UI main bundle < 200KB
- [ ] 5 user-facing docs written
- [ ] Community directories scaffolded with READMEs
- [ ] `pnpm typecheck && pnpm test` green with 100+ tests

---

## Summary: The Scorecard

| Metric | Before | After Phase 1 | After Phase 2 | After Phase 3 | After Phase 4 |
|--------|--------|---------------|---------------|---------------|---------------|
| Typecheck errors | 17 | **0** | 0 | 0 | 0 |
| Test failures | 6/56 | **0/56** | 0/56 | 0/70+ | 0/100+ |
| `app.ts` lines | 4,171 | 4,171 | **~300** | ~300 | ~300 |
| `app-render.ts` | 2,348 | 2,348 | **deleted** | deleted | deleted |
| `@state()` in app.ts | 310 | 310 | **~15** | ~15 | ~15 |
| UI bundle (main) | 766KB | 766KB | **<200KB** | <200KB | <200KB |
| Design tokens | ~20 | ~20 | **50+** | 50+ | 50+ |
| Hardcoded hex colors | 37 | 37 | **0** | 0 | 0 |
| Navigation views | 27 | 27 | **6** | 6 | 6 |
| `any` types | 57 | 57 | 57 | 57 | **<10** |
| Silent empty catches | 15+ | 15+ | 15+ | **0** | 0 |
| SOUL.md + interview | ❌ | ❌ | ❌ | **✅** | ✅ |
| Starter personas | 0 | 0 | 0 | **5** | 5 |
| Service health system | ❌ | ❌ | ❌ | **✅** | ✅ |
| Test coverage | ~11% | ~11% | ~15% | ~25% | **40%+** |
| Docs for users | 0 | 0 | 0 | 0 | **5** |

---

## Execution Model

**Who does what:**

| Phase | Best Executed By | Why |
|-------|-----------------|-----|
| Phase 1 (Correct) | Single agent session | Mechanical fixes, needs codebase familiarity |
| Phase 2.1 (Design tokens) | Single agent + Caleb review | Design decisions need user input |
| Phase 2.2 (God Component) | 2–3 parallel agents | Each tab view is independent work |
| Phase 2.3–2.5 (Nav, styles, a11y) | Single agent | Sequential, depends on 2.1–2.2 |
| Phase 3.1 (Soul interview) | Caleb + agent pair | Deeply personal — needs Caleb's voice |
| Phase 3.2–3.3 (Health, cleanup) | Single agent | Mechanical with judgment |
| Phase 3.4–3.5 (Trust, reflection) | Agent | Backend + UI work |
| Phase 3.6 (Personas) | Caleb writes, agent formats | These need Caleb's domain expertise |
| Phase 4 (Polish) | Agent team in parallel | Types, tests, docs, bundles — independent |

**Total estimate:** 6 weeks at 4–6 hours/day. Can compress to 4 weeks with parallel agent execution in Phases 2 and 4.

---

## The One Thing That Matters Most

If you can only do ONE thing from this entire plan, do **Phase 2.2 — the God Component decomposition.**

It's the single change that:
- Makes the UI maintainable (new contributors can find things)
- Makes the UI fast (each view renders independently)
- Makes the UI testable (isolated components with clear inputs)
- Makes the UI beautiful (design tokens only work when components are small enough to style consistently)
- Makes everything else in this plan 10x easier

**310 @state() properties in one class is the root cause of every UI problem.** Fix that, and the rest follows.

---

*"Stay hungry. Stay foolish."* — now go ship it. 🚀
