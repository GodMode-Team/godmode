# Screenpipe Summarization Funnel — Build Plan

**Purpose:** Integrate Screenpipe's screen capture into GodMode's memory stack with aggressive data degradation. Recent context is rich and detailed; old context is compressed to essentials; noise is deleted.

**Principle:** Memory should work like human memory — vivid today, summarized this week, highlights this month, forgotten (or archived) beyond that.

---

## Architecture: The Degradation Pyramid

```
         ┌──────────────┐
         │   Permanent   │  People files, decisions, key facts
         │   (~1KB/day)  │  Extracted and promoted — never deleted
         ├──────────────┤
         │   Monthly     │  One-paragraph month summary
         │   (~5KB/mo)   │  Kept in vault indefinitely
         ├──────────────┤
         │   Weekly      │  ~1 page per week (bullet points)
         │   (~10KB/wk)  │  Kept 90 days, then deleted
         ├──────────────┤
         │   Daily       │  ~1-2 page daily digest
         │   (~20KB/day) │  Kept 30 days, then deleted
         ├──────────────┤
         │   Hourly      │  Paragraph-level summaries
         │   (~5KB/hr)   │  Kept 48 hours, then deleted
         ├──────────────┤
         │   Raw         │  Screenpipe's own SQLite DB
         │   (~100MB/day)│  Kept 24 hours, then PURGED
         └──────────────┘
```

**Total storage with degradation: ~2-3GB/year** (vs ~40GB/year without it)

---

## Data Flow

```
Screenpipe (captures screen text + audio continuously)
    │
    ├── Raw data lives in Screenpipe's own DB (~100MB/day)
    │   └── AUTO-PURGE after 24 hours
    │
    ▼
[Hourly Cron — every 60 min]
    │
    ├── Query Screenpipe API: GET /search?limit=500&start={lastHour}
    ├── Filter out noise (see Noise Filters below)
    ├── LLM summarize → 1 paragraph per hour (~200-400 words)
    ├── Extract entities: people mentioned, companies, projects, decisions
    ├── Write to: memory/screenpipe/hourly/YYYY-MM-DD-HH.md
    ├── Promote entities → people files, daily note
    └── AUTO-DELETE hourly files after 48 hours
    │
    ▼
[Daily Cron — 11pm local time]
    │
    ├── Read all hourly files from today
    ├── LLM summarize → daily digest (~1-2 pages)
    │   Format:
    │     ## What You Worked On
    │     - Project/app focus blocks with time estimates
    │     ## Key Conversations
    │     - Meeting/call summaries (dedupe with Fathom)
    │     ## Decisions Made
    │     - Anything that looks like a decision or commitment
    │     ## People Encountered
    │     - New contacts, notable interactions
    │     ## Notable Reads
    │     - Articles, docs, threads you spent time on
    ├── Append to: memory/daily/YYYY-MM-DD.md (existing daily note)
    ├── Forward digest to Honcho (forwardToHoncho)
    ├── QMD auto-indexes the daily note
    └── AUTO-DELETE daily screenpipe digests after 30 days
        (But the daily NOTE persists — it contains more than just screenpipe)
    │
    ▼
[Weekly Cron — Sunday 11pm]
    │
    ├── Read daily digests from past 7 days
    ├── LLM compress → weekly summary (~1 page of bullets)
    │   Focus on: patterns, time allocation, relationship activity
    ├── Write to: memory/screenpipe/weekly/YYYY-WXX.md
    ├── Update people files with interaction frequency
    └── AUTO-DELETE weekly files after 90 days
    │
    ▼
[Monthly Cron — 1st of month, 6am]
    │
    ├── Read weekly summaries from past month
    ├── LLM compress → monthly summary (one paragraph)
    ├── Write to: memory/screenpipe/monthly/YYYY-MM.md
    ├── Promote any durable facts to curated.md or people files
    └── Monthly files kept INDEFINITELY (they're tiny)
```

---

## Noise Filters (Applied at Hourly Summarization)

These patterns are stripped BEFORE the LLM sees the raw data:

### App Blocklist (never capture)
```typescript
const BLOCKED_APPS = [
  "1Password", "Keychain Access", "LastPass", "Bitwarden",  // password managers
  "System Preferences", "System Settings",                     // OS settings
  "Installer", "Software Update",                              // system maintenance
  "FaceTime",                                                  // personal calls (Fathom handles work calls)
  "Messages",                                                  // iMessage (separate ingestion pipeline)
  "Photos",                                                    // personal photos
  "Music", "Spotify", "Apple Music",                          // music players
  "TV", "Netflix", "YouTube",                                 // entertainment (unless research)
];
```

### Content Blocklist (regex patterns to strip)
```typescript
const NOISE_PATTERNS = [
  /password|credential|secret|api.?key|token/i,   // security sensitive
  /cookie.?consent|accept.?cookies|gdpr/i,         // cookie banners
  /subscribe.?to|newsletter.?signup/i,              // marketing noise
  /loading\.\.\.|please wait|buffering/i,           // UI states
  /\b(ad|advertisement|sponsored)\b/i,              // ads
];
```

### Deduplication
- If the same app + window title appears for >10 consecutive captures, collapse to one entry: "Spent ~X minutes in [app] — [window title]"
- If screen text is >90% identical to previous capture, skip it

### Minimum Signal Threshold
- Discard any capture with <20 words of meaningful text
- Discard any capture where the active app was idle/screensaver

---

## File Structure

```
memory/
├── screenpipe/
│   ├── hourly/          # YYYY-MM-DD-HH.md — auto-deleted after 48h
│   ├── weekly/          # YYYY-WXX.md — auto-deleted after 90 days
│   ├── monthly/         # YYYY-MM.md — kept indefinitely
│   └── config.json      # blocklists, retention settings, last-run timestamps
├── daily/
│   └── YYYY-MM-DD.md    # Daily notes (screenpipe digest APPENDED here)
└── people/
    └── *.md             # Auto-updated with interaction data from screenpipe
```

---

## Entity Extraction & Promotion

The hourly summarizer doesn't just compress — it extracts high-value facts and promotes them to permanent storage:

### Auto-Promote Rules
```
IF person name detected + new context about them
  → Append to memory/people/{name}.md

IF decision language detected ("decided to", "going with", "locked in")
  → Append to daily note under ## Decisions

IF URL spent >5 minutes reading
  → Capture title + summary to daily note under ## Notable Reads

IF new company/product encountered in work context
  → Create stub in memory/bank/companies/{name}.md

IF commitment language detected ("I'll", "we should", "action item", "need to")
  → Append to daily note under ## Action Items
  → Optionally create GodMode task (configurable)
```

### What Gets Forwarded to Honcho
Only the **daily digest** goes to Honcho, not hourly or raw data. This means Honcho gets ~1-2 pages/day of curated context. The Deriver can extract meaningful observations from that without burning credits on noise.

---

## Implementation

### File 1: `src/services/ingestion/screenpipe-funnel.ts`

```typescript
/**
 * screenpipe-funnel.ts — Summarization funnel for Screenpipe data.
 *
 * Queries Screenpipe's local API, filters noise, summarizes via LLM,
 * writes to tiered memory files with automatic degradation.
 *
 * Screenpipe API: http://localhost:3030 (default)
 * Docs: https://docs.screenpi.pe/api
 */

import { existsSync, mkdirSync, readdirSync, unlinkSync, readFileSync, appendFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { MEMORY_DIR } from "../../data-paths.js";

// ── Config ───────────────────────────────────────────────────────

const SCREENPIPE_API = process.env.SCREENPIPE_API || "http://localhost:3030";

const RETENTION = {
  hourly: 48 * 60 * 60 * 1000,     // 48 hours
  daily: 30 * 24 * 60 * 60 * 1000,  // 30 days
  weekly: 90 * 24 * 60 * 60 * 1000, // 90 days
  monthly: Infinity,                  // forever
};

const SCREENPIPE_DIR = join(MEMORY_DIR, "screenpipe");
const HOURLY_DIR = join(SCREENPIPE_DIR, "hourly");
const WEEKLY_DIR = join(SCREENPIPE_DIR, "weekly");
const MONTHLY_DIR = join(SCREENPIPE_DIR, "monthly");

// ── Hourly Summarization ─────────────────────────────────────────

export async function runHourlySummary(): Promise<{ captured: number; filtered: number; promoted: number }> {
  // 1. Query Screenpipe API for last hour of captures
  const since = new Date(Date.now() - 3600_000).toISOString();
  const res = await fetch(`${SCREENPIPE_API}/search?content_type=ocr&start_time=${since}&limit=500`);
  if (!res.ok) return { captured: 0, filtered: 0, promoted: 0 };

  const data = await res.json();
  const frames = data.data || [];

  // 2. Apply noise filters
  const filtered = frames.filter((f: any) => {
    const app = f.content?.app_name || "";
    const text = f.content?.text || "";
    if (BLOCKED_APPS.some(b => app.toLowerCase().includes(b.toLowerCase()))) return false;
    if (NOISE_PATTERNS.some(p => p.test(text))) return false;
    if (text.split(/\s+/).length < 20) return false;
    return true;
  });

  // 3. Deduplicate consecutive identical captures
  const deduped = deduplicateFrames(filtered);

  // 4. If nothing meaningful, skip
  if (deduped.length === 0) return { captured: frames.length, filtered: 0, promoted: 0 };

  // 5. Prepare text for LLM summarization
  const rawText = deduped.map((f: any) => {
    const app = f.content?.app_name || "Unknown";
    const window = f.content?.window_name || "";
    const text = (f.content?.text || "").slice(0, 500); // cap per frame
    return `[${app} — ${window}]\n${text}`;
  }).join("\n---\n");

  // 6. LLM summarize (use cheap model — haiku/flash)
  const summary = await summarizeWithLLM(rawText, "hourly");

  // 7. Extract entities
  const entities = await extractEntities(summary);

  // 8. Write hourly file
  const now = new Date();
  const hour = now.toISOString().slice(0, 13).replace("T", "-"); // YYYY-MM-DD-HH
  ensureDir(HOURLY_DIR);
  writeFileSync(join(HOURLY_DIR, `${hour}.md`), [
    `# Screen Context — ${hour}`,
    ``,
    summary,
    ``,
    entities.people.length ? `**People:** ${entities.people.join(", ")}` : "",
    entities.decisions.length ? `**Decisions:** ${entities.decisions.join("; ")}` : "",
  ].filter(Boolean).join("\n"));

  // 9. Promote entities to people files
  let promoted = 0;
  for (const person of entities.people) {
    await promotePersonMention(person, summary, now);
    promoted++;
  }

  return { captured: frames.length, filtered: deduped.length, promoted };
}

// ── Daily Digest ─────────────────────────────────────────────────

export async function runDailyDigest(): Promise<{ hourlyFilesProcessed: number }> {
  const today = todayString();
  const hourlyFiles = readdirSync(HOURLY_DIR)
    .filter(f => f.startsWith(today))
    .sort();

  if (hourlyFiles.length === 0) return { hourlyFilesProcessed: 0 };

  const hourlyContent = hourlyFiles.map(f =>
    readFileSync(join(HOURLY_DIR, f), "utf8")
  ).join("\n\n---\n\n");

  // LLM compress all hourly summaries into structured daily digest
  const digest = await summarizeWithLLM(hourlyContent, "daily");

  // Append to existing daily note
  const dailyPath = join(MEMORY_DIR, "daily", `${today}.md`);
  ensureDir(join(MEMORY_DIR, "daily"));

  const section = [
    ``,
    `## Screen Activity (auto-captured)`,
    ``,
    digest,
    ``,
  ].join("\n");

  appendFileSync(dailyPath, section);

  // Forward digest to Honcho for reasoning
  try {
    const { forwardToHoncho } = await import("../honcho-client.js");
    await forwardToHoncho(
      `[Daily screen activity digest]\n${digest}`,
      "system:screenpipe-daily"
    );
  } catch { /* non-fatal */ }

  return { hourlyFilesProcessed: hourlyFiles.length };
}

// ── Weekly Compression ───────────────────────────────────────────

export async function runWeeklyCompression(): Promise<void> {
  // Read last 7 daily notes, extract screen activity sections
  // LLM compress to weekly summary
  // Write to weekly dir
  // Update people files with interaction frequency
}

// ── Monthly Compression ──────────────────────────────────────────

export async function runMonthlyCompression(): Promise<void> {
  // Read weekly summaries from past month
  // LLM compress to one paragraph
  // Promote durable facts to curated.md
  // Write to monthly dir
}

// ── Garbage Collection ───────────────────────────────────────────

export async function runRetentionCleanup(): Promise<{ deleted: number }> {
  let deleted = 0;
  const now = Date.now();

  // Purge hourly files older than 48 hours
  deleted += purgeOldFiles(HOURLY_DIR, RETENTION.hourly, now);

  // Purge weekly files older than 90 days
  deleted += purgeOldFiles(WEEKLY_DIR, RETENTION.weekly, now);

  // Tell Screenpipe to purge its own raw data older than 24h
  try {
    // Screenpipe API: DELETE /search?before={timestamp}
    const cutoff = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    await fetch(`${SCREENPIPE_API}/search?end_time=${cutoff}`, { method: "DELETE" });
  } catch { /* Screenpipe may not support DELETE — fall back to its own retention settings */ }

  return { deleted };
}

// ── LLM Summarization ────────────────────────────────────────────

const PROMPTS = {
  hourly: `Summarize this screen activity into a concise paragraph. Focus on: what the user was working on, key content they engaged with, any decisions or commitments observed. Ignore UI chrome, ads, and repetitive content. Be specific about project names, people, and topics.`,

  daily: `Compress these hourly screen summaries into a structured daily digest. Use these sections:
## What You Worked On
(Project/app focus blocks with rough time estimates)
## Key Interactions
(People engaged with, meetings, messages — deduplicate with any Fathom call data)
## Decisions & Commitments
(Anything that looks like a decision, agreement, or action item)
## Notable Content
(Articles, docs, threads they spent significant time on — include URLs if available)
Keep it to 1-2 pages max. Be specific, not generic.`,

  weekly: `Compress these daily digests into a weekly summary. Focus on patterns: where did time actually go? Who were the most frequent contacts? What projects got the most attention vs. which were neglected? Any recurring themes or shifts in focus? One page of bullets max.`,

  monthly: `Compress these weekly summaries into one paragraph. What defined this month? Key accomplishments, relationships that deepened, projects that progressed or stalled, any strategic shifts.`,
};

async function summarizeWithLLM(text: string, level: keyof typeof PROMPTS): Promise<string> {
  // Use cheap model (Haiku/Flash) for hourly/daily
  // Use smarter model (Sonnet) for weekly/monthly
  const model = (level === "hourly" || level === "daily")
    ? "anthropic/claude-haiku-3"  // fast + cheap
    : "anthropic/claude-sonnet-4-6"; // smart for compression

  // Route through OpenClaw's model router or direct Anthropic API
  // Implementation depends on whether this runs inside OC or standalone
  // ...

  return ""; // placeholder
}

// ── Entity Extraction ────────────────────────────────────────────

interface ExtractedEntities {
  people: string[];
  companies: string[];
  decisions: string[];
  actionItems: string[];
  urls: string[];
}

async function extractEntities(summary: string): Promise<ExtractedEntities> {
  // Can be done via LLM (structured output) or regex for common patterns
  // LLM is better but costs more — use regex for hourly, LLM for daily
  return { people: [], companies: [], decisions: [], actionItems: [], urls: [] };
}

// ── Helpers ───────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function todayString(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: process.env.TZ || "America/Chicago",
  });
}

function deduplicateFrames(frames: any[]): any[] {
  // Collapse consecutive frames with >90% text similarity
  // Collapse same app+window for >10 consecutive captures into time summary
  return frames; // placeholder
}

function purgeOldFiles(dir: string, maxAge: number, now: number): number {
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const file of readdirSync(dir)) {
    const path = join(dir, file);
    try {
      const mtime = require("node:fs").statSync(path).mtimeMs;
      if (now - mtime > maxAge) {
        unlinkSync(path);
        count++;
      }
    } catch { /* skip */ }
  }
  return count;
}

function promotePersonMention(name: string, context: string, date: Date): Promise<void> {
  // Check if person file exists → append interaction
  // If new person → create stub
  // Same pattern as calendar-enrichment.ts
  return Promise.resolve();
}

// ── Blocked Apps & Noise Patterns ────────────────────────────────

const BLOCKED_APPS = [
  "1Password", "Keychain Access", "LastPass", "Bitwarden",
  "System Preferences", "System Settings",
  "Installer", "Software Update",
  "FaceTime", "Photos", "Music", "Spotify", "Apple Music",
  "TV", "Netflix",
  "Preview",  // usually viewing images/PDFs, low signal
];

const NOISE_PATTERNS = [
  /password|credential|secret|api.?key|token/i,
  /cookie.?consent|accept.?cookies|gdpr/i,
  /subscribe.?to.?newsletter|email.?signup/i,
  /loading\.\.\.|please wait|buffering/i,
  /\b(advertisement|sponsored.?content)\b/i,
  /captcha|verify.?you.?are.?human/i,
];
```

### File 2: `src/services/ingestion/screenpipe-config.ts`

```typescript
/**
 * screenpipe-config.ts — User-configurable settings for the Screenpipe funnel.
 *
 * Stored at memory/screenpipe/config.json
 * Editable via Second Brain Settings UI
 */

export interface ScreenpipeConfig {
  enabled: boolean;
  apiUrl: string;                    // default: http://localhost:3030
  blockedApps: string[];             // apps to never capture
  blockedPatterns: string[];         // regex patterns to strip (stored as strings)
  retention: {
    raw: number;                     // hours to keep Screenpipe raw data (default: 24)
    hourly: number;                  // hours to keep hourly summaries (default: 48)
    daily: number;                   // days to keep daily digests (default: 30)
    weekly: number;                  // days to keep weekly summaries (default: 90)
    monthly: "forever";              // always keep monthly
  };
  summarization: {
    hourlyModel: string;             // default: "anthropic/claude-haiku-3"
    dailyModel: string;              // default: "anthropic/claude-haiku-3"
    weeklyModel: string;             // default: "anthropic/claude-sonnet-4-6"
    monthlyModel: string;            // default: "anthropic/claude-sonnet-4-6"
  };
  promotion: {
    autoCreatePeople: boolean;       // auto-create people files from mentions (default: true)
    autoCreateTasks: boolean;        // auto-create tasks from commitments (default: false)
    autoCreateCompanies: boolean;    // auto-create company files (default: true)
  };
  privacy: {
    neverCaptureUrls: string[];      // URL patterns to always exclude
    neverCaptureDomains: string[];   // domains to always exclude (e.g., bank.com)
    stripEmails: boolean;            // remove email addresses from captures (default: false)
    stripPhoneNumbers: boolean;      // remove phone numbers (default: false)
  };
}

export const DEFAULT_CONFIG: ScreenpipeConfig = {
  enabled: false,                    // opt-in, not opt-out
  apiUrl: "http://localhost:3030",
  blockedApps: [
    "1Password", "Keychain Access", "LastPass", "Bitwarden",
    "System Preferences", "System Settings",
    "FaceTime", "Photos", "Music", "Spotify",
  ],
  blockedPatterns: [
    "password|credential|secret|api.?key",
    "cookie.?consent|accept.?cookies",
  ],
  retention: {
    raw: 24,
    hourly: 48,
    daily: 30,
    weekly: 90,
    monthly: "forever",
  },
  summarization: {
    hourlyModel: "anthropic/claude-haiku-3",
    dailyModel: "anthropic/claude-haiku-3",
    weeklyModel: "anthropic/claude-sonnet-4-6",
    monthlyModel: "anthropic/claude-sonnet-4-6",
  },
  promotion: {
    autoCreatePeople: true,
    autoCreateTasks: false,
    autoCreateCompanies: true,
  },
  privacy: {
    neverCaptureUrls: [],
    neverCaptureDomains: ["*.bank.com", "*.fidelity.com"],
    stripEmails: false,
    stripPhoneNumbers: false,
  },
};
```

---

## Cron Schedule

| Cron | Frequency | What It Does |
|------|-----------|--------------|
| `screenpipe.hourly` | Every 60 min | Query Screenpipe → filter → summarize → write hourly file → promote entities |
| `screenpipe.daily` | 11:00 PM local | Compress hourly → daily digest → append to daily note → forward to Honcho |
| `screenpipe.weekly` | Sunday 11:00 PM | Compress dailies → weekly summary → update people interaction frequency |
| `screenpipe.monthly` | 1st of month 6:00 AM | Compress weeklies → monthly paragraph → promote durable facts |
| `screenpipe.cleanup` | Daily 3:00 AM | Purge expired files per retention config → tell Screenpipe to purge raw |

Register these in the OC cron system or as method handlers callable from cron.

---

## Storage Budget (With Degradation)

| Tier | Per Unit | Retention | Annual Storage |
|------|----------|-----------|----------------|
| Raw (Screenpipe's DB) | ~100MB/day | 24 hours | ~100MB max (rolling) |
| Hourly summaries | ~5KB/hr × 12 active hrs | 48 hours | ~120KB max (rolling) |
| Daily digests | ~20KB/day | 30 days | ~600KB max (rolling) |
| Weekly summaries | ~10KB/week | 90 days | ~130KB max (rolling) |
| Monthly summaries | ~5KB/month | Forever | ~60KB/year |
| Promoted entities | ~1KB/day | Forever | ~365KB/year |
| **Total GodMode storage** | | | **~1.3MB/year** |
| **Total including Screenpipe raw** | | | **~100MB rolling max** |

Compare to the ~40GB/year without degradation. **This is 99.99% less storage.**

---

## LLM Cost Estimate

| Operation | Model | Calls/Day | Input Tokens | Cost/Day |
|-----------|-------|-----------|-------------|----------|
| Hourly summary (12/day) | Haiku | 12 | ~2K each | ~$0.006 |
| Entity extraction (12/day) | Regex | 12 | 0 (local) | $0 |
| Daily digest (1/day) | Haiku | 1 | ~10K | ~$0.003 |
| Daily → Honcho (1/day) | (Honcho's Deriver) | 1 | ~2K | Included in Honcho |
| Weekly (1/week) | Sonnet | 0.14/day | ~15K | ~$0.006/day |
| Monthly (1/month) | Sonnet | 0.03/day | ~5K | ~$0.001/day |
| **Total** | | | | **~$0.50/month** |

Negligible. Even at scale with 1,000 managed users, this is ~$500/month in LLM costs for the funnel.

---

## Screenpipe Setup Requirements

### For Self-Hosted Users
1. Install Screenpipe: `brew install screenpipe` (or download .dmg)
2. Grant accessibility permissions
3. Configure app blocklist in Screenpipe settings
4. Set Screenpipe API to run on `localhost:3030`
5. Enable Screenpipe integration in GodMode: `memory/screenpipe/config.json`
6. Crons auto-register on next gateway start

### For Managed Users
1. GodMode installer bundles Screenpipe
2. Setup wizard handles permissions + blocklist
3. Pre-configured with sensible defaults
4. One toggle: "Enable Screen Memory" in Settings

---

## Integration Points

### With QMD
- Daily digests written to `memory/daily/` → QMD auto-indexes within 5 min
- Weekly/monthly written to `memory/screenpipe/` → QMD indexes these too
- Hourly files are too ephemeral to index (48h retention, not worth embedding)

### With Honcho
- Only the daily digest is forwarded to Honcho
- Honcho's Deriver extracts observations from the digest
- Honcho's Dialectic can answer "what was I working on yesterday?" using these observations
- Honcho's Dreamer consolidates screen patterns over time

### With FTS5 (Session Search)
- FTS5 indexes conversations, not screen data
- No change needed — FTS5 stays focused on sessions

### With MCP Server
- External AI clients can call `memory_search` which searches QMD (includes daily digests)
- Could add a `screenpipe_recent` MCP tool that queries Screenpipe directly for last-hour context
- Useful for Cursor/Claude Desktop: "what was I just looking at?"

### With Second Brain UI
- Memory Map shows Screenpipe status (running/not running, last capture time)
- Timeline view shows screen activity alongside calendar + email
- Settings view has Screenpipe config (blocklist, retention, models)

---

## Privacy Safeguards

1. **App blocklist** — password managers, banking, personal apps excluded by default
2. **Content filtering** — passwords, API keys, credit card patterns stripped before summarization
3. **URL domain blocklist** — user can exclude entire domains
4. **LLM processing uses cheap models** — less data sent to expensive frontier models
5. **Raw data purged in 24h** — only summaries persist, and those degrade too
6. **Screenpipe runs locally** — raw captures never leave the machine
7. **Team workspace isolation** — screen data is NEVER shared to team workspaces
8. **Opt-in only** — `enabled: false` by default, user must explicitly turn on
9. **HIPAA note** — for PA/healthcare work, Front app should be in the blocklist to prevent PHI capture

---

## Build Order

1. **`screenpipe-config.ts`** — config schema + defaults (~1 hour)
2. **`screenpipe-funnel.ts` — hourly summary** — core capture loop (~3 hours)
3. **`screenpipe-funnel.ts` — daily digest** — compression + Honcho forward (~2 hours)
4. **Cron registration** — wire hourly + daily + cleanup into OC cron (~1 hour)
5. **Weekly + monthly compression** — lower priority, can ship later (~2 hours)
6. **Entity promotion** — people file updates from screen mentions (~2 hours)
7. **MCP `screenpipe_recent` tool** — last-hour context for external clients (~1 hour)
8. **Settings UI** — Screenpipe config panel in Second Brain tab (~2 hours)

**Total: ~14 hours. Ship hourly + daily in first pass (~7 hours), rest in second pass.**

---

## Key Design Decisions

1. **Screenpipe manages its own raw storage.** We don't duplicate raw data — we query the API and write summaries. Screenpipe's own retention handles raw purge.

2. **Haiku for hourly/daily, Sonnet for weekly/monthly.** Hourly summarization is high-volume low-stakes — cheap model is fine. Weekly/monthly are low-volume high-stakes — use the smart model for better compression.

3. **Daily digest is the Honcho interface.** Honcho gets one curated page per day, not a firehose. This keeps Deriver costs low and observation quality high.

4. **Opt-in, not opt-out.** Screen capture is sensitive. Users must explicitly enable it. This is both a privacy and a trust decision.

5. **Entity promotion is the real value.** The summaries themselves decay and delete. But the facts extracted from them — people you met, decisions you made, companies you researched — those get promoted to permanent files. The funnel is a fact extraction machine, not a storage system.
