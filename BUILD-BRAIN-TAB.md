# BUILD PLAN: Brain Tab (Personal Memory System)

**Repo:** `~/Projects/godmode-plugin/`
**UI framework:** Lit (web components)
**Backend methods:** `src/methods/` (RPC via `GatewayRequestHandler`)
**Frontend tabs:** `ui/src/ui/tabs/`
**Existing tab to upgrade:** `second-brain-tab.ts` → rename to `brain-tab.ts`
**Existing backend:** `src/methods/second-brain.ts` → extend (don't break existing RPCs)

---

## CONTEXT: What Already Exists

### Backend (`src/methods/second-brain.ts`)
Already implemented RPCs:
- `secondBrain.identity` — reads USER.md, SOUL.md, IDENTITY.md, etc.
- `secondBrain.memoryBank` — lists people/company files by section
- `secondBrain.memoryBankEntry` — reads a specific person/company file
- `secondBrain.memoryPulse` — returns status of memory systems (Honcho, QMD, FTS5, etc.)
- `secondBrain.activity` — returns recent activity events
- `secondBrain.search` — searches across vault
- `secondBrain.fileTree` — returns PARA tree structure
- `secondBrain.write` — writes to vault files
- `secondBrain.readFile` — reads vault files

### Frontend (`ui/src/ui/tabs/second-brain-tab.ts`)
Already implemented Lit component (`<gm-second-brain>`):
- Memory Pulse section (system status dots)
- Search bar with debounced search
- Activity feed
- Identity files viewer
- Memory bank (People/Companies) browser
- File tree / folder browsing
- Screenpipe status display
- Ingestion pipeline status

### Ingestion (`src/methods/ingestion.ts`)
Already implemented RPCs:
- `ingestion.status` — returns pipeline health
- `ingestion.run` — triggers all pipelines
- `ingestion.screenpipeStatus` — Screenpipe config + availability

### Memory Search Shim (`src/tools/memory-search-shim.ts`)
Already fans out to Honcho + QMD + FTS5 concurrently and merges results.

### MCP Server (`mcp-entry.ts`)
Already exposes 18+ tools. `memory-get-mcp.ts` and `capture-thought.ts` already exist as tool files.

### Navigation (`ui/src/ui/navigation.ts`)
Tab system uses `Tab` type union. Current tab: `"second-brain"`. Path: `/second-brain`.
Tab groups defined in `TAB_GROUPS` array.

---

## WHAT TO BUILD

### Goal
Transform the current Second Brain tab into the "Brain" tab — the flagship feature of GodMode. When a user clicks this tab, they see proof that GodMode knows them. The Identity Card (Honcho's understanding of them) is front and center. Memory systems are visible and configurable. Everything is dummy-proof.

### Naming
- Tab label: **"Brain"** (not "Second Brain")
- Internal tab ID: `"brain"` (add legacy redirect from `"second-brain"` → `"brain"`)
- Page header: **"Your Brain"**
- Engine section: **"Engine"**

---

## Phase 1: Rename + Identity Card (4 hours)

### 1.1 Tab Rename

**File: `ui/src/ui/navigation.ts`**
- Add `"brain"` to the `Tab` type union
- Add `brain: "/brain"` to `TAB_PATHS`
- Add legacy redirect: `PATH_TO_TAB.set("/second-brain", "brain")`
- Update `TAB_GROUPS`: replace `"second-brain"` with `"brain"` in the first group

**File: `ui/src/ui/tabs/index.ts`**
- Add: `export { GmBrain } from "./brain-tab.js";`
- Keep old export for backward compat: `export { GmSecondBrain } from "./second-brain-tab.js";`

**File: `ui/src/ui/tabs/brain-tab.ts`** (NEW — copy from `second-brain-tab.ts`)
- Rename class to `GmBrain`
- Rename custom element to `<gm-brain>`
- Update all internal references

**File: `ui/src/ui/app-render.ts`**
- Add rendering case for `"brain"` tab → `<gm-brain>`
- Keep `"second-brain"` case rendering the same component for backward compat

### 1.2 Identity Card — Backend

**File: `src/methods/second-brain.ts`** — add new RPC:

```typescript
/**
 * secondBrain.identityCard
 * 
 * Returns Honcho's peer representation (what the AI has LEARNED about the user)
 * plus key metadata. This is the "proof" card at the top of the Brain tab.
 */
const identityCard: GatewayRequestHandler = async ({ respond }) => {
  try {
    // 1. Get Honcho's peer representation
    let peerRep: string | null = null;
    let peerCard: Record<string, unknown> | null = null;
    try {
      const { getHonchoClient } = await import("../services/honcho-client.js");
      const client = getHonchoClient();
      if (client) {
        // Use Honcho's getPeerRepresentation or queryPeer for self-description
        const rep = await client.getPeerRepresentation();
        peerRep = rep?.representation ?? null;
        peerCard = rep?.card ?? null;
      }
    } catch { /* Honcho not available — continue without */ }

    // 2. Get basic identity from files (fallback / supplement)
    const userMd = safeReadFile(join(GODMODE_ROOT, "USER.md"));
    const identityMd = safeReadFile(join(GODMODE_ROOT, "IDENTITY.md"));
    
    // 3. Get memory stats
    const vaultHealth = getVaultHealth();
    const peopleCount = countFilesInDir(resolvePeoplePath().path);
    const dailyCount = countFilesInDir(join(MEMORY_DIR, "daily"));
    
    // 4. Get current focus from Honcho or daily note
    let currentFocus: string | null = null;
    try {
      const { getHonchoClient } = await import("../services/honcho-client.js");
      const client = getHonchoClient();
      if (client) {
        const focusResult = await client.queryPeer(
          "What is the user currently focused on? List their top 2-3 priorities in one sentence."
        );
        currentFocus = focusResult?.answer ?? null;
      }
    } catch { /* non-fatal */ }

    // 5. Get last updated time for the representation
    let lastUpdated: string | null = null;
    // Honcho updates representations during Dreamer consolidation
    // Use the most recent activity event as proxy
    
    respond(true, {
      // What the AI has LEARNED (Honcho's output)
      peerRepresentation: peerRep,
      peerCard,
      currentFocus,
      
      // Supplementary identity data (from files)
      name: extractNameFromUserMd(userMd),
      tagline: extractTaglineFromUserMd(userMd),
      
      // Stats (proof of depth)
      stats: {
        peopleTracked: peopleCount,
        dailyNotes: dailyCount,
        totalNotes: vaultHealth?.stats?.totalNotes ?? 0,
        memoryLayersActive: 0, // filled by pulse data on frontend
      },
      
      lastUpdated,
    });
  } catch (err) {
    respond(false, undefined, { code: "IDENTITY_CARD_ERROR", message: String(err) });
  }
};

function extractNameFromUserMd(content: string | null): string {
  if (!content) return "User";
  const match = content.match(/\*\*Name:\*\*\s*(.+)/);
  return match?.[1]?.trim() ?? "User";
}

function extractTaglineFromUserMd(content: string | null): string {
  if (!content) return "";
  const match = content.match(/\*\*Vision:\*\*\s*(.+)/);
  return match?.[1]?.trim() ?? "";
}

function countFilesInDir(dirPath: string): number {
  try {
    return readdirSync(dirPath).filter(f => !f.startsWith(".") && !f.startsWith("_")).length;
  } catch { return 0; }
}
```

Register in the exports: `"secondBrain.identityCard": identityCard`

### 1.3 Identity Card — Frontend

**In `brain-tab.ts`**, add the Identity Card as the first rendered section (above pulse):

```typescript
@state() identityCard: {
  peerRepresentation: string | null;
  currentFocus: string | null;
  name: string;
  tagline: string;
  stats: { peopleTracked: number; dailyNotes: number; totalNotes: number };
  lastUpdated: string | null;
} | null = null;

// In _loadAll():
const card = await gw.request("secondBrain.identityCard", {});
this.identityCard = card;

// Render method:
private _renderIdentityCard() {
  const card = this.identityCard;
  if (!card) return nothing;
  
  return html`
    <section class="brain-identity-card">
      <div class="brain-id-header">
        <h1 class="brain-id-name">${card.name}</h1>
        ${card.tagline ? html`<p class="brain-id-tagline">${card.tagline}</p>` : nothing}
      </div>
      
      ${card.peerRepresentation ? html`
        <div class="brain-id-representation">
          ${renderMd(card.peerRepresentation)}
        </div>
      ` : html`
        <div class="brain-id-representation brain-id-rep--empty">
          <p>Your AI is still learning about you. Keep chatting — this card fills in automatically.</p>
        </div>
      `}
      
      ${card.currentFocus ? html`
        <div class="brain-id-focus">
          <span class="brain-id-focus-label">Currently focused on:</span>
          <span class="brain-id-focus-text">${card.currentFocus}</span>
        </div>
      ` : nothing}
      
      <div class="brain-id-stats">
        <div class="brain-id-stat">
          <span class="brain-id-stat-value">${card.stats.peopleTracked}</span>
          <span class="brain-id-stat-label">People</span>
        </div>
        <div class="brain-id-stat">
          <span class="brain-id-stat-value">${card.stats.dailyNotes}</span>
          <span class="brain-id-stat-label">Daily Notes</span>
        </div>
        <div class="brain-id-stat">
          <span class="brain-id-stat-value">${card.stats.totalNotes}</span>
          <span class="brain-id-stat-label">Total Files</span>
        </div>
      </div>
      
      <div class="brain-id-footer">
        <button class="brain-id-correct-btn" @click=${() => this._chatNavigate(
          "I want to correct something in my identity card. Here's what needs updating:"
        )}>✏️ Correct something</button>
        ${card.lastUpdated ? html`
          <span class="brain-id-updated">Updated ${fmtAgo(card.lastUpdated)}</span>
        ` : nothing}
      </div>
    </section>
  `;
}
```

**Design requirements:**
- Identity Card is a visually distinct card with subtle gradient background
- Use CSS vars: `var(--card)`, `var(--accent)`, `var(--text)`, `var(--muted)`
- Peer representation renders as markdown (Honcho may return formatted text)
- "Correct something" button navigates to chat tab with pre-filled message
- Stats row uses the same compact style as the existing pulse dots
- Empty state is encouraging, not alarming — "Your AI is still learning"
- The card should feel alive — not a static profile, but a living understanding

---

## Phase 2: Three-Panel Layout (6 hours)

Restructure the dashboard into the three-panel layout below the Identity Card.

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 Your Brain                                    ⚙️ Engine │
├─────────────────────────────────────────────────────────────┤
│  [Identity Card — full width]                               │
├────────────────┬──────────────────┬─────────────────────────┤
│  PULSE         │  PEOPLE          │  KNOWLEDGE              │
│  Activity feed │  Recent contacts │  Stats + Recent files   │
│  System events │  Click → detail  │  PARA tree browser      │
│  Scrollable    │  Search people   │  Search all             │
└────────────────┴──────────────────┴─────────────────────────┘
│  [ENGINE — collapsible section]                             │
│  Memory Layers table + Ingestion Pipelines + Privacy        │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Pulse Panel (left)

Reuse existing `secondBrain.activity` RPC. Render as a scrollable timeline:
- Each event shows: icon + source label + title + relative time
- Sources: vault-capture, identity-update, calendar-enrichment, thought-captured, search, file-modified
- Scope badges: 🔒 personal (default, don't show) or ↗️ shared (show workspace name)
- "See all" link at bottom → opens activity in sidebar

### 2.2 People Panel (center)

Reuse existing `secondBrain.memoryBank` RPC (people section). Enhance:
- Add a people-specific search input at top
- Show recent 5-8 people sorted by last interaction
- Each entry: name, role/company (from excerpt), last interaction time
- Click → opens person file in sidebar (`_openFile`)
- Stats at bottom: "147 people tracked"
- "See all →" link opens full people browser

**New backend RPC: `secondBrain.recentPeople`**

```typescript
/**
 * Returns people files sorted by most recently modified, with richer metadata.
 */
const recentPeople: GatewayRequestHandler = async ({ params, respond }) => {
  const limit = Number((params as any).limit) || 8;
  const peoplePath = resolvePeoplePath().path;
  const entries = listEntries(peoplePath)
    .filter(e => !e.isDirectory)
    .sort((a, b) => {
      if (!a.updatedAt || !b.updatedAt) return 0;
      return b.updatedAt.localeCompare(a.updatedAt);
    })
    .slice(0, limit)
    .map(e => ({
      ...e,
      // Try to extract role/company from first few lines
      role: extractRole(e.excerpt),
    }));
  
  const total = listEntries(peoplePath).filter(e => !e.isDirectory).length;
  respond(true, { people: entries, total });
};

function extractRole(excerpt: string): string {
  // Look for patterns like "CEO of X", "works at Y", "Role: Z"
  const roleMatch = excerpt.match(/(?:role|title|position)[:\s]*([^\n|]+)/i)
    || excerpt.match(/(?:CEO|CTO|VP|Director|Manager|Founder|Partner)\s+(?:of|at)\s+([^\n|]+)/i);
  return roleMatch?.[1]?.trim().slice(0, 60) ?? "";
}
```

Register: `"secondBrain.recentPeople": recentPeople`

### 2.3 Knowledge Panel (right)

Reuse existing `secondBrain.fileTree` RPC. Show:
- Stats block: total notes, projects, areas, daily notes, total size
- Recent additions: last 5 files modified across the vault
- PARA tree browser (clickable folders → expand inline)
- "Browse vault →" link to open full tree

### 2.4 Engine Section (collapsible)

**Collapsed by default.** Toggle button in the Brain header ("⚙️ Engine").

Two tables:

**Memory Layers table:**
| Layer | Status | Last Run | Config |
|-------|--------|----------|--------|

Reuse existing `secondBrain.memoryPulse` data. Add a ⚙️ button per layer that opens config in sidebar.

**Ingestion Pipelines table:**
| Source | Status | Last Sync | Action |
|--------|--------|-----------|--------|

Reuse existing `ingestion.status` data. "Connect →" buttons for unconfigured pipelines navigate to Connections tab.

**MCP Status row:**
- Show MCP server status (port, connected clients count)
- "Copy MCP URL" button
- Link to docs for setup instructions

**New backend RPC: `secondBrain.mcpStatus`**

```typescript
const mcpStatus: GatewayRequestHandler = async ({ respond }) => {
  // Check if MCP server is running by checking the port
  // Read MCP config from gateway config
  try {
    const config = await import("../lib/mcp-config.js");
    const status = config.getMcpServerStatus();
    respond(true, {
      enabled: status.enabled,
      port: status.port ?? null,
      transport: status.transport ?? "stdio",
      connectedClients: status.clientCount ?? 0,
      url: status.url ?? null,
    });
  } catch {
    respond(true, { enabled: false, port: null, transport: null, connectedClients: 0, url: null });
  }
};
```

Register: `"secondBrain.mcpStatus": mcpStatus`

### 2.5 Responsive Layout

- Desktop (>1024px): Three-column layout below identity card
- Tablet (768-1024px): Two columns (Pulse + People), Knowledge below
- Mobile (<768px): Single column, all sections stacked

Use CSS grid:
```css
.brain-panels {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .brain-panels {
    grid-template-columns: 1fr 1fr;
  }
  .brain-panel--knowledge {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .brain-panels {
    grid-template-columns: 1fr;
  }
}
```

---

## Phase 3: MCP + Screenpipe Integration (4 hours)

### 3.1 Wire MCP Tools

**File: `mcp-entry.ts`**

Add to the `toolImports` array (if not already present):
```typescript
() => import("./src/tools/memory-search-shim.js").then(m => m.createMemorySearchShimTool),
() => import("./src/tools/memory-get-mcp.js").then(m => m.createMemoryGetMcpTool),
() => import("./src/tools/capture-thought.js").then(m => m.createCaptureThoughtTool),
```

These tool factory files already exist. This is just importing them into the MCP server's tool list.

### 3.2 Screenpipe Toggle

In the Engine section, the Screenpipe row should have an Enable/Disable toggle:

**Frontend:** Toggle button calls `ingestion.screenpipeToggle` RPC.

**New backend RPC: `ingestion.screenpipeToggle`**

```typescript
const screenpipeToggle: GatewayRequestHandler = async ({ params, respond }) => {
  const { enabled } = params as { enabled?: boolean };
  if (typeof enabled !== "boolean") {
    respond(false, undefined, errorShape("INVALID_REQUEST", "enabled must be boolean"));
    return;
  }
  try {
    const { loadConfig, saveConfig } = await import("../services/ingestion/screenpipe-config.js");
    const config = await loadConfig();
    config.enabled = enabled;
    await saveConfig(config);
    respond(true, { enabled: config.enabled });
  } catch (err) {
    respond(false, undefined, { code: "SCREENPIPE_ERROR", message: String(err) });
  }
};
```

Register: `"ingestion.screenpipeToggle": screenpipeToggle`

### 3.3 Ingestion Pipeline Triggers

Each pipeline row in the Engine section can have a "Run now" button:

**New backend RPC: `ingestion.runPipeline`**

```typescript
const runPipeline: GatewayRequestHandler = async ({ params, respond }) => {
  const { pipeline } = params as { pipeline?: string };
  if (!pipeline) {
    respond(false, undefined, errorShape("INVALID_REQUEST", "pipeline name required"));
    return;
  }
  try {
    const { runSinglePipeline } = await import("../services/ingestion/runner.js");
    const result = await runSinglePipeline(pipeline);
    respond(true, result);
  } catch (err) {
    respond(false, undefined, { code: "INGESTION_ERROR", message: String(err) });
  }
};
```

Register: `"ingestion.runPipeline": runPipeline`

---

## Phase 4: Polish + Empty States (3 hours)

### 4.1 First-Run Experience

When the Brain tab loads and:
- **Honcho has no peer representation yet** → Identity Card shows: "Your AI is still learning about you. Start a conversation and I'll build your profile automatically." with a "Start chatting →" button.
- **No people files exist** → People panel shows: "People you interact with will appear here. Connect your calendar to start." with "Connect Calendar →" button.
- **No daily notes exist** → Knowledge panel shows count of 0 with: "Your knowledge base grows automatically. Start working and I'll capture the important stuff."
- **All memory systems offline** → Pulse shows red banner: "No memory systems active. Visit Engine to configure." with scroll-to-engine button.

### 4.2 Refresh Behavior

- Auto-refresh activity feed every 60 seconds (poll `secondBrain.activity`)
- Identity card refreshes on tab focus (not on interval — Honcho updates are infrequent)
- Pulse system status refreshes on tab focus
- Search is on-demand only (debounced input)

### 4.3 Loading States

- Skeleton loaders for identity card and each panel during initial load
- Individual panel loading spinners for refresh operations
- Search shows inline spinner during debounce

### 4.4 Accessibility

- All sections have proper heading hierarchy (h2 for panels, h3 for subsections)
- Interactive elements are keyboard-navigable
- Status dots have aria-labels: "Honcho: ready", "QMD: degraded"
- Screen reader announces: "Your Brain — 5 memory systems active, 147 people tracked"

---

## CSS Architecture

All styles should be in `<style>` blocks inside the Lit component (no external stylesheets). Use the existing theme CSS variables from the app:

```css
/* Key variables available: */
var(--bg)           /* page background */
var(--bg-elevated)  /* card/panel background */
var(--card)         /* card background (may differ from elevated) */
var(--text)         /* primary text */
var(--muted)        /* secondary text */
var(--accent)       /* brand accent color */
var(--border)       /* border color */
var(--success)      /* green status */
var(--warning)      /* yellow status */
var(--danger)       /* red status */
```

The existing `second-brain-tab.ts` uses class prefixes `sb-*` for all styles. The new `brain-tab.ts` should use `brain-*` prefix.

---

## File Summary

| Action | File | What |
|--------|------|------|
| NEW | `ui/src/ui/tabs/brain-tab.ts` | New Brain tab component (evolved from second-brain-tab) |
| EDIT | `ui/src/ui/tabs/index.ts` | Add `GmBrain` export |
| EDIT | `ui/src/ui/navigation.ts` | Add `"brain"` tab, legacy redirect |
| EDIT | `ui/src/ui/app-render.ts` | Add `"brain"` rendering case |
| EDIT | `ui/src/ui/app-settings.ts` | Handle `"brain"` tab in setTab |
| EDIT | `src/methods/second-brain.ts` | Add `identityCard`, `recentPeople`, `mcpStatus` RPCs |
| EDIT | `src/methods/ingestion.ts` | Add `screenpipeToggle`, `runPipeline` RPCs |
| EDIT | `mcp-entry.ts` | Wire memory_search, memory_get, capture_thought tools |
| KEEP | `ui/src/ui/tabs/second-brain-tab.ts` | Keep for backward compat (renders same as brain-tab) |

---

## Build Order (Recommended)

1. **Tab rename + routing** (1 hr) — get "Brain" showing in nav, old URL redirects
2. **Identity Card backend** (1.5 hrs) — `identityCard` RPC with Honcho integration
3. **Identity Card frontend** (1.5 hrs) — render card at top of Brain tab
4. **Three-panel layout** (3 hrs) — restructure existing sections into Pulse/People/Knowledge
5. **Recent People RPC** (1 hr) — sorted, enriched people list for center panel
6. **Engine collapsible section** (2 hrs) — memory layers + ingestion + MCP status
7. **MCP wiring** (1 hr) — import existing tools into mcp-entry.ts
8. **Empty states + first-run** (1.5 hrs) — encouraging UX when brain is new
9. **Polish** (1.5 hrs) — responsive layout, loading states, accessibility

**Total: ~15 hours**

---

## Success Criteria

1. User clicks "Brain" tab → sees their Identity Card with Honcho's learned understanding
2. Three panels load: Pulse (activity), People (recent contacts), Knowledge (vault stats)
3. Engine section expands to show all memory layer statuses and ingestion pipelines
4. Search bar searches across entire brain (Honcho + QMD + FTS5)
5. Empty state for new users is encouraging, not empty/broken
6. MCP server exposes memory_search + memory_get + capture_thought
7. Screenpipe can be toggled on/off from Engine section
8. Old `/second-brain` URL redirects to `/brain`
9. Mobile layout works (single column, stacked)
10. Dad-proof: nothing breaks if you click randomly. No dead ends. Every state has a clear next action.

---

## DO NOT

- Do NOT create a file explorer. Brain is not a filesystem browser. It shows memory, not files.
- Do NOT build a markdown editor. Files open in the sidebar viewer (`ctx.openSidebar`).
- Do NOT add permissions/ACLs. Brain is 100% personal. No sharing controls here.
- Do NOT delete the old `second-brain-tab.ts`. Keep it as a backward-compat alias.
- Do NOT modify `SOUL.md`, `USER.md`, `AGENTS.md`, `MEMORY.md`, or any identity files.
- Do NOT add new npm dependencies. Use what's already in the project (Lit, lit/decorators, @lit/context).
- Do NOT create external CSS files. All styles go in `<style>` inside the Lit component.
