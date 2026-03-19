# GodMode: Community Window + Experiments Cleanup + Support Pill

## Context
You are working on the GodMode plugin UI (`ui/src/ui/`) and backend (`src/`). 
GodMode is a personal AI ally plugin. The open-source plugin is free. The GodMode 
Community ($300/month) offers shared personas, live sessions, playbooks, and a 
network of entrepreneurs. The product needs to tastefully surface the community 
to free users without being naggy.

## Scope — 3 Tasks

### Task 1: Kill the Experiments UI Tab (Keep Backend Flags)

**Goal:** Remove the Experiments tab from the UI. Keep the backend feature flag 
system intact (31 files depend on it).

**Steps:**

1. **Delete the UI view file:**
   - `ui/src/ui/views/view-experiments.ts` (133 lines) — delete entirely

2. **Remove from navigation:**
   - In `ui/src/ui/navigation.ts`, remove the "experiments" entry from the 
     settings sub-navigation array
   - Remove any `experiments` case from view routing in `app.ts` or `app-render.ts`

3. **Remove the custom element registration** if `gm-experiments` or similar is 
   registered anywhere — check `ui/src/ui/app.ts` for imports

4. **DO NOT touch these backend files:**
   - `src/lib/experiments.ts` — keep as-is (internal feature flags)
   - `~/godmode/data/experiments.json` — keep as-is (runtime config)
   - Any file that calls `getExperiment()` — leave all 31 alone

5. **Hardcode these flags to `true` in `src/lib/experiments.ts` defaults** (they're 
   production-ready):
   ```
   enableSafetyGates: true
   enableContextPressure: true  
   enableTrustSystem: true
   enableSmartRouting: true
   enableBriefPersonalization: true
   enableDashboards: true
   enableTeamWorkspaces: true
   enableChannels: true
   enableCronJobs: true
   enableSessionDistillation: true
   enableDeepIdentity: true
   enableSoulDigest: true
   ```

6. **Hardcode these to `false`** (unfinished features):
   ```
   enableProactiveIntel: false
   enableFocusPulse: false
   enableOptimizationEval: false
   ```

**Verification:** `pnpm build` passes. No "experiments" visible in the UI anywhere. 
All 31 files that call `getExperiment()` still work.

---

### Task 2: Add Community Window to Sidebar + Community Section

**Goal:** Add a "Community" item under Resources in the left sidebar that shows 
a rotating window into the GodMode Community. This is a soft, tasteful conversion 
surface — not a nag. It should feel like a window into something exciting happening 
on the other side.

#### 2a. Create the Community Data Structure

Create `src/lib/community-feed.ts`:

```typescript
export interface CommunityFeedItem {
  type: 'testimonial' | 'persona-drop' | 'live-session' | 'tip' | 'milestone';
  content: string;       // Main text
  attribution?: string;  // "— Marcus, agency owner"
  date?: string;         // ISO date
  url?: string;          // Link to community
}

export interface CommunityFeed {
  memberCount: number;
  monthlyPrice: number;
  joinUrl: string;
  items: CommunityFeedItem[];
}

// Default feed — ships with the plugin, updated via remote fetch later
export function getDefaultCommunityFeed(): CommunityFeed {
  return {
    memberCount: 0,
    monthlyPrice: 300,
    joinUrl: 'https://godmode.team/community',
    items: [
      {
        type: 'testimonial',
        content: 'Replaced my VA with 3 GodMode personas. Saving $4K/month.',
        attribution: 'Marcus, agency owner'
      },
      {
        type: 'persona-drop',
        content: '12 new shared personas this week — including Content Machine v3 and Inbox Zero.'
      },
      {
        type: 'live-session',
        content: 'Live Thursday: Advanced Trust Calibration with Caleb',
        date: new Date(Date.now() + 3 * 86400000).toISOString()
      },
      {
        type: 'tip',
        content: 'Pro tip: Set up a "Weekly Review" persona that runs every Friday at 3pm. Community average: 4 hours saved/week.'
      },
      {
        type: 'testimonial',
        content: 'The soul interview changed how I think about AI. Prosper knows my business better than my COO.',
        attribution: 'Jamie, SaaS founder'
      },
      {
        type: 'milestone',
        content: 'Community milestone: 10,000 agent delegations completed this month.'
      },
      {
        type: 'testimonial',
        content: 'I was skeptical about $300/month. By week 2, it was the best ROI in my business.',
        attribution: 'Devon, e-commerce'
      },
      {
        type: 'persona-drop', 
        content: 'New persona: "Competitor Watch" — monitors your competitors and delivers weekly intel briefs.'
      }
    ]
  };
}

// RPC method to get community feed
export function getCommunityFeed(): CommunityFeed {
  // Future: fetch from remote API, fall back to default
  return getDefaultCommunityFeed();
}
```

Register as an RPC method in `src/methods/` — create `src/methods/community.ts`:

```typescript
import { getCommunityFeed } from '../lib/community-feed.js';

export function communityHandlers() {
  return {
    'community.getFeed': async () => {
      return getCommunityFeed();
    }
  };
}
```

Register in `src/adapter/register-all.ts` alongside other method handlers.

#### 2b. Create the Community Widget UI Component

Create `ui/src/ui/components/community-widget.ts` as a LitElement:

**Requirements:**
- Displays a compact card (~200px tall) that rotates through feed items every 8 seconds
- Subtle fade transition between items (CSS only, no animation library)
- Shows: current item content + attribution (if testimonial)
- Bottom bar: member count + price + "Join" link
- Styling: warm, inviting — use a subtle gradient or accent border (gold/amber tone, 
  NOT aggressive red or orange). Should feel premium and exclusive, not salesy.
- The widget should be self-contained — fetches its own data via RPC on connectedCallback

**Visual structure:**
```
┌──────────────────────────────────┐
│  🔥 GodMode Community            │
│                                   │
│  [rotating content area]          │
│  "Replaced my VA with 3 personas. │
│   Saving $4K/month."              │
│   — Marcus, agency owner          │
│                                   │
│  👥 847 members · $300/mo         │
│  [ Learn More ]                   │
└──────────────────────────────────┘
```

**Size:** Should fit comfortably in the left sidebar (240-280px wide). Compact but 
not cramped. The card should have rounded corners, subtle shadow, and feel like a 
little window — not a banner ad.

**Rotation:** Cycle through `items[]` every 8 seconds. Fade out old content (0.3s), 
fade in new content (0.3s). No jarring transitions.

**Icon per type:**
- testimonial: 💬
- persona-drop: 📦
- live-session: 🎥
- tip: 💡
- milestone: 🎯

#### 2c. Add to Sidebar Navigation

In the sidebar/navigation component (check `app-render.ts` or the navigation 
rendering code), add under the Resources section:

```
Resources
  📄 Docs
  🔥 Community    ← clicking expands/shows the community widget inline
```

When "Community" is clicked in the sidebar:
- If the community widget is NOT visible: show it inline below the "Community" 
  label in the sidebar (expanding the sidebar section)
- If it IS visible: collapse it
- The widget stays visible while user navigates other tabs — it's ambient, 
  not a destination

**Alternative (if sidebar space is too tight):** Community click opens a slide-over 
panel (240px wide) from the left edge, overlaying the main content slightly. The 
panel contains the community widget at full height with more items visible.

Use your judgment on which approach works better given the current sidebar layout. 
The goal is: visible, ambient, not disruptive.

---

### Task 3: Wire the Support Pill to Community

**Goal:** The support button/pill in the upper-right corner of the UI should route 
to the community for free users.

**Steps:**

1. **Find the support pill** — look in `app.ts`, `app-render.ts`, or a header 
   component for a "Support" button, help icon, or similar element in the top-right 
   area of the UI.

2. **If it exists:** Change its click handler to:
   - Open the community widget (if Task 2c uses inline expansion)
   - OR navigate to `https://godmode.team/community` in a new tab
   - OR open a modal/panel with the community content + a "Get Support" section

3. **If it doesn't exist:** Create a minimal support pill in the top-right header area:
   ```html
   <button class="support-pill" @click=${this.openCommunity}>
     Support
   </button>
   ```
   Style: small pill button, subtle (not attention-grabbing), matches the header 
   aesthetic. Think: Apple's "Get Support" link — present but not pushy.

4. **Future consideration (don't build now, just add a TODO comment):**
   - Community members: Support pill → direct support channel
   - Free users: Support pill → community landing with CTA
   - Detection: check for a `community.member` flag in user config

**Verification:** Support pill is visible in the top-right. Clicking it surfaces 
community content or opens the community URL.

---

## Guardrails

- **DO NOT** add any npm dependencies
- **DO NOT** touch `src/lib/experiments.ts` logic beyond changing default values
- **DO NOT** touch any file that calls `getExperiment()` 
- **DO NOT** create a separate "Community" main navigation tab — it lives under 
  Resources in the sidebar
- **DO NOT** make the community widget aggressive or naggy — premium and tasteful only
- **DO** run `pnpm build` after each task and fix any errors before proceeding
- **DO** keep the community widget under 200 lines (it's a simple rotating card)
- **DO** keep `community-feed.ts` under 100 lines
- **DO** use existing UI patterns from the codebase (check other views/components 
  for styling conventions)

## Build Verification

After ALL tasks are complete:
```bash
pnpm build
```

Expected: clean build, zero errors. 

The Experiments tab is gone from the UI. The Community widget renders in the sidebar 
under Resources. The Support pill routes to community content.
