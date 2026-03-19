# Plan: Second Brain Tab Overhaul

**Goal:** Collapse 8 bloated subtabs into 3 focused ones. Kill dead features. Cut ~60% of code. Align with meta-architecture ("Obsidian IS the note-taking app" / "Conduct, don't rebuild").

**Branch:** `refactor/second-brain-overhaul`

**Principle:** The Second Brain tab answers ONE question: *"What does my ally know about me, and is it accurate?"* — NOT "let me browse all my files from inside GodMode."

---

## New Tab Structure

**Before (8 subtabs):**
```
Identity | Memory Bank | AI Packet | Sources | Research | Resources | Files | Insights
```

**After (3 subtabs):**
```
Identity | Knowledge | Context
```

### Mapping

| Old Subtab | Fate | Rationale |
|---|---|---|
| **Identity** | ✅ **KEEP** → `identity` | Unique to GodMode. USER.md, SOUL.md, VISION.md, opinions, THESIS — this is the ally's soul. |
| **Memory Bank** | 🔀 **MERGE** → `knowledge` | Becomes the unified knowledge browser. Keep the sectioned view (People, Companies, Projects) and vault search. |
| **Research** | 🔀 **MERGE** → `knowledge` | Research entries become a section in Knowledge, alongside People/Companies/Projects. Kill the "Quick Add" form — if users want to add research, they tell the ally or use Obsidian. |
| **Files** | 🔀 **MERGE** → `knowledge` | The file tree becomes a "Browse All" section at the bottom of Knowledge. One unified search bar searches everything. |
| **AI Packet** | 🔀 **MERGE** → `context` | The ally's awareness snapshot — what it currently knows. This is the hero of the Context subtab. |
| **Sources** | 🔀 **MERGE** → `context` | Connected data sources and vault health. Shows at the bottom of Context as "Where context comes from." |
| **Resources** | ❌ **KILL** | Community bookmarks that no agent actually reads. Dead feature. Delete the JSON file, the CRUD handlers, and all UI. |
| **Insights** | ❌ **KILL** | Fake health bar with hardcoded 20% increments. Vault health folds into Context subtab as a small status row. |

---

## Phase 1: Backend Cleanup (second-brain.ts)

**File:** `src/methods/second-brain.ts` (1,706 lines → target ~900)

### 1.1 Delete dead RPC methods
Remove these handlers and all supporting functions:

| Handler | Why |
|---|---|
| `secondBrain.communityResources` | Resources subtab killed |
| `secondBrain.communityResourcesAdd` | Resources subtab killed |
| `secondBrain.communityResourcesRemove` | Resources subtab killed |
| `secondBrain.consolidateResearch` | Never called from UI, dead code |
| `secondBrain.addResearch` | Kill Quick Add form — users use Obsidian or tell the ally |
| `secondBrain.researchCategories` | Only needed for the Quick Add form |

**Keep** these (still needed for Knowledge/Context):
- `secondBrain.identity`
- `secondBrain.memoryBank`
- `secondBrain.memoryBankEntry`
- `secondBrain.aiPacket`
- `secondBrain.sync`
- `secondBrain.sources`
- `secondBrain.research` (read-only listing, folded into Knowledge)
- `secondBrain.fileTree`
- `secondBrain.search`
- `secondBrain.vaultHealth`
- `secondBrain.inboxItems`
- `secondBrain.migrateToVault`
- `secondBrain.obsidianSyncStatus`
- `secondBrain.obsidianSyncTrigger`
- `secondBrain.obsidianSyncSetMode`
- `secondBrain.captureStatus`
- `secondBrain.captureRunNow`

### 1.2 Clean up legacy fields
In the `aiPacket` handler: remove all references to `consciousness` and `working` fields. They were killed in the lean audit. The handler should return only the awareness snapshot.

### 1.3 Remove Identity OS dashboard hardcoded path
```typescript
// DELETE this pattern:
const identityOsDashboardFile = join(MEMORY_DIR, "projects", "identity-os", "final", "dashboard", "index.html");
```
Replace with: if there's an HTML artifact, detect it generically or remove entirely.

### 1.4 Remove community-resources.json seeding
Delete the `seedCommunityResources()` function and the default "Awesome OpenClaw" seed data.

### 1.5 Update handler export map
```typescript
export const secondBrainHandlers: GatewayRequestHandlers = {
  "secondBrain.identity": identity,
  "secondBrain.memoryBank": memoryBank,
  "secondBrain.memoryBankEntry": memoryBankEntry,
  "secondBrain.aiPacket": aiPacket,
  "secondBrain.sync": sync,
  "secondBrain.sources": sources,
  "secondBrain.research": research,
  "secondBrain.fileTree": fileTree,
  "secondBrain.search": brainSearch,
  "secondBrain.vaultHealth": vaultHealth,
  "secondBrain.inboxItems": inboxItems,
  "secondBrain.migrateToVault": migrateToVaultRpc,
  "secondBrain.obsidianSyncStatus": obsidianSyncStatus,
  "secondBrain.obsidianSyncTrigger": obsidianSyncTrigger,
  "secondBrain.obsidianSyncSetMode": obsidianSyncSetMode,
  "secondBrain.captureStatus": vaultCaptureStatus,
  "secondBrain.captureRunNow": vaultCaptureRunNow,
};
```

---

## Phase 2: UI Type Cleanup

**File:** `ui/src/ui/views/second-brain.ts` (types section, top ~250 lines)

### 2.1 Update subtab type
```typescript
// BEFORE:
export type SecondBrainSubtab = "identity" | "memory-bank" | "ai-packet" | "sources" | "research" | "intel" | "resources" | "files";

// AFTER:
export type SecondBrainSubtab = "identity" | "knowledge" | "context";
```

### 2.2 Slim down SecondBrainProps
Remove these props entirely:
- `researchAddFormOpen`, `researchAddForm`, `researchCategories` (Quick Add killed)
- `onResearchAddFormToggle`, `onResearchAddFormChange`, `onResearchAddSubmit` (Quick Add killed)
- `communityResources`, `communityResourceAddFormOpen`, `communityResourceAddForm` (Resources killed)
- `onCommunityResourceAdd`, `onCommunityResourceRemove`, `onCommunityResourceAddFormToggle`, `onCommunityResourceAddFormChange` (Resources killed)

Keep and consolidate:
- `identity`, `memoryBank`, `researchData`, `fileTree`, `fileSearchResults` → all used by Knowledge
- `aiPacket`, `sourcesData`, `vaultHealth` → all used by Context
- `onSelectEntry`, `onBrowseFolder`, `onSearch`, `onFileSearch`, `onFileSelect` → unified in Knowledge
- `onSync`, `onRefresh`, `onOpenSidebar`, `onSaveViaChat`, `onAddSource` → still needed

### 2.3 Remove legacy types
Delete `SecondBrainInsightsData` type and any `consciousness`/`working` types still lingering.

---

## Phase 3: View Rewrite

**File:** `ui/src/ui/views/second-brain.ts` (1,297 lines → target ~700)

### 3.1 Replace 8-tab bar with 3-tab bar
```html
<div class="second-brain-tabs">
  <button class="second-brain-tab ${subtab === 'identity' ? 'active' : ''}"
    @click=${() => onSubtabChange('identity')}>Identity</button>
  <button class="second-brain-tab ${subtab === 'knowledge' ? 'active' : ''}"
    @click=${() => onSubtabChange('knowledge')}>Knowledge</button>
  <button class="second-brain-tab ${subtab === 'context' ? 'active' : ''}"
    @click=${() => onSubtabChange('context')}>Context</button>
</div>
```

### 3.2 Identity subtab — keep as-is
The Identity subtab is well-built. Keep USER.md, SOUL.md, VISION.md, opinions, THESIS rendering. Remove Identity OS dashboard hardcoded section.

### 3.3 Knowledge subtab — unified browser
Merge the old Memory Bank + Research + Files views into one:

```
┌─────────────────────────────────────┐
│ 🔍 [Search your second brain...]    │
├─────────────────────────────────────┤
│ ── People ──────────────────────    │
│   Alice Chen  ·  Bob Smith  · ...   │
│ ── Companies ───────────────────    │
│   TRP  ·  Patient Autopilot  · ... │
│ ── Projects ────────────────────    │
│   GodMode  ·  100xHuman  · ...     │
│ ── Research ────────────────────    │  ← NEW: research entries appear here
│   Market Analysis  ·  AI Trends    │
│ ── Browse All ──────────────────    │  ← file tree at the bottom
│   📁 Brain/                         │
│   📁 Projects/                      │
│   📁 Research/                      │
└─────────────────────────────────────┘
```

- One search bar at top. Uses `secondBrain.search` which already does BM25 + file-walk.
- Sections from Memory Bank (People, Companies, Projects) render first.
- Research items render as a section (read-only, no Quick Add).
- File tree renders at the bottom as "Browse All" for power users.
- Clicking any item opens it in the sidebar (existing `onOpenSidebar` behavior).

### 3.4 Context subtab — what the ally knows
Merge AI Packet + Sources + vault health:

```
┌─────────────────────────────────────┐
│ ── Awareness Snapshot ──────────    │
│   (awareness-snapshot.ts output)    │
│   Current focus: ...                │
│   Active workspace: ...             │
│   Recent patterns: ...              │
│   [Sync Now]                        │
├─────────────────────────────────────┤
│ ── Connected Sources ───────────    │
│   ✅ Obsidian Vault (247 notes)     │
│   ✅ Calendar (Google)              │
│   ✅ Email (Gmail)                  │
│   🟡 Contacts (not connected)      │
│   [+ Add Source]                    │
├─────────────────────────────────────┤
│ ── Vault Health ────────────────    │
│   Last capture: 12 min ago          │
│   Notes: 247  ·  Inbox: 3 items    │
│   Sync: Obsidian Git (auto)         │
└─────────────────────────────────────┘
```

- Awareness snapshot is the hero section — big, prominent, shows what the AI actually knows.
- Connected sources below (compact cards from old Sources subtab).
- Vault health as a small status row (replaces fake Insights score).

### 3.5 Delete render functions for killed subtabs
Remove entirely:
- `renderInsights()` (or `renderIntel()`)
- `renderResources()` (community bookmarks)
- `renderResearch()` (replaced by section in Knowledge)
- `renderFiles()` (replaced by section in Knowledge)
- `renderSources()` (replaced by section in Context)
- `renderAiPacket()` (replaced by section in Context)
- `renderMemoryBank()` (replaced by Knowledge)

Create new:
- `renderKnowledge(props)` — unified view
- `renderContext(props)` — unified view

Keep:
- `renderIdentity(props)` — untouched

---

## Phase 4: Controller Update

**File:** `ui/src/ui/controllers/second-brain.ts` (267 lines → target ~180)

### 4.1 Update subtab loading logic
The controller currently dispatches different RPC calls per subtab. Simplify:

```typescript
// "identity" → call secondBrain.identity (unchanged)
// "knowledge" → call secondBrain.memoryBank + secondBrain.research + secondBrain.fileTree (parallel)
// "context" → call secondBrain.aiPacket + secondBrain.sources + secondBrain.vaultHealth (parallel)
```

### 4.2 Remove dead controller methods
- `loadCommunityResources()`, `addCommunityResource()`, `removeCommunityResource()` → delete
- `toggleResearchAddForm()`, `submitResearchAdd()`, `loadResearchCategories()` → delete
- Any `consolidateResearch` call → delete

### 4.3 Update app.ts and app-render.ts references
- `app.ts` L710: Change default subtab from `"identity"` to `"identity"` (same, just verify)
- `app.ts` L1796 `handleSecondBrainSubtabChange`: Update to handle new subtab values
- `app-render.ts` L2110: Update props passed to SecondBrain view — remove killed props
- `app-view-state.ts` L395, L654: Update type references

---

## Phase 5: CSS Cleanup

**File:** `ui/src/styles/second-brain.css` (1,057 lines → target ~500)

### 5.1 Delete styles for killed subtabs
Remove all CSS blocks for:
- `.insights-*`, `.intel-*` selectors
- `.resources-*`, `.community-resource-*` selectors  
- `.research-add-form*` selectors
- Any inline-style-dependent layouts (Insights had `style=""` everywhere — those HTML blocks are gone now)

### 5.2 Add styles for new unified sections
- `.knowledge-section` — section header + entry grid (reuse Memory Bank styles)
- `.knowledge-search` — full-width search bar at top
- `.context-awareness` — hero block for awareness snapshot
- `.context-sources` — compact card grid (reuse Sources card styles)
- `.context-health` — small status row

### 5.3 Consolidate duplicated patterns
Memory Bank and Research had near-identical card/list styles. Unify into `.brain-entry-card` / `.brain-entry-list`.

---

## Phase 6: Cleanup & Verify

### 6.1 Delete dead data files
- `~/godmode/data/community-resources.json` — no longer read or written

### 6.2 Search for stale references
```bash
rg "community-resource|communityResource|research-add|researchAdd|consolidateResearch|renderInsights|renderIntel|renderResources|renderFiles|renderSources|renderAiPacket|renderMemoryBank|renderResearch" --type ts -l
```
Fix any remaining references.

### 6.3 Build & verify
```bash
pnpm build
pnpm typecheck
```

### 6.4 Verify no forbidden imports
```bash
rg "\.\./\.\./\.\./\.\./src/" -n
```

---

## Success Criteria

- [ ] Only 3 subtabs render: Identity, Knowledge, Context
- [ ] `pnpm build` passes clean
- [ ] `pnpm typecheck` passes clean
- [ ] No references to killed subtabs (resources, intel/insights, standalone research/files/sources/ai-packet)
- [ ] Community Resources CRUD fully removed (handler + UI + types + CSS)
- [ ] Research Quick Add form fully removed
- [ ] Legacy consciousness/working fields removed from aiPacket
- [ ] Identity OS hardcoded path removed
- [ ] Context Health fake score removed
- [ ] Knowledge subtab shows unified search + sectioned entries + file tree
- [ ] Context subtab shows awareness snapshot + sources + vault health
- [ ] second-brain.ts under 1,000 lines
- [ ] second-brain view under 800 lines
- [ ] second-brain.css under 600 lines

---

## Line Count Targets

| File | Before | After | Cut |
|---|---|---|---|
| `src/methods/second-brain.ts` | 1,706 | ~900 | -47% |
| `ui/src/ui/views/second-brain.ts` | 1,297 | ~700 | -46% |
| `ui/src/ui/controllers/second-brain.ts` | 267 | ~180 | -33% |
| `ui/src/styles/second-brain.css` | 1,057 | ~500 | -53% |
| **Total** | **4,327** | **~2,280** | **-47%** |

---

## Execution Order

```
Phase 1 (Backend)  →  Phase 2 (Types)  →  Phase 3 (View)  →  Phase 4 (Controller)  →  Phase 5 (CSS)  →  Phase 6 (Verify)
```

Each phase should compile before moving to the next. Phase 1+2 can be tested with `pnpm build` (backend-only). Phase 3+4+5 are the UI rewrite. Phase 6 is the final sweep.

**Do NOT skip Phase 6.** Stale references are the #1 source of post-refactor bugs.
