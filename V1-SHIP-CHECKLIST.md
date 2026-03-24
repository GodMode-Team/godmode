# V1 Ship Checklist — GodMode Plugin v1.8

**Created:** 2026-03-23  
**Rule:** Nothing gets added to this list. New ideas → V2-ROADMAP.md  
**Ship target:** First paying customer onboarded by Friday March 28

---

## 🔴 MERGE QUEUE (PRs ready — just merge & test)

These PRs fix real bugs. Merge them first thing tomorrow.

- [ ] PR #27 — Onboarding memory-seeded check (fixes #14)
- [ ] PR #28 — mem0ai version mismatch fix (fixes #22)
- [ ] PR #29 — Missing qmd binary warning (fixes #25)
- [ ] PR #30 — systemd service template for Linux (fixes #11)
- [ ] PR #31 — Slack status badge fix (fixes #12)
- [ ] PR #32 — GHL API key persistence (fixes #13)
- [ ] PR #39 — OpenClaw v2026.3.22 hardening ⚠️ HAS CONFLICTS — resolve first

---

## 🟡 COMMIT & STABILIZE (in-progress work on unified-onboarding branch)

Current uncommitted changes (26 files). Commit what's working, shelve what's not.

- [ ] Second Brain tab overhaul — commit current state, mark remaining polish as V2
- [ ] Onboarding flow updates — commit, test end-to-end
- [ ] MCP memory_search + memory_get — commit (already in mcp-entry.ts)
- [ ] ScreenPipe integration — commit config + funnel files as-is
- [ ] Workspace sync changes — commit current state

---

## 🟢 V1 FUNCTIONAL REQUIREMENTS (must work for first customer)

### Install & Onboarding
- [ ] `curl install.sh | bash` runs clean on fresh macOS
- [ ] Onboarding flow completes without user getting stuck
- [ ] Name, timezone, API keys collected smoothly
- [ ] Memory seeded correctly (sentinel file written)
- [ ] User lands in working chat within 10 minutes

### Core Chat Experience
- [ ] Agent responds intelligently with context
- [ ] Memory injection works (Honcho + QMD search)
- [ ] Daily brief fires and is useful (calendar events, tasks, priorities)
- [ ] Agent can search vault/second brain
- [ ] Agent can create/list/complete tasks

### Integrations (minimum set)
- [ ] Google Calendar — events show, can create
- [ ] Tasks — works end to end
- [ ] Web search — agent can search and fetch
- [ ] Email — at least read capability (Front or Gmail)

### Team / Workspaces (V1 — your call that this is critical)
- [ ] Team member can join a shared workspace
- [ ] Shared memory syncs via git (workspace-sync-service.ts)
- [ ] Team feed works (team-comms.ts)
- [ ] Each team member has their own agent + shared context

### Second Brain
- [ ] Tab loads without errors
- [ ] Search works (memory_search_shim fans out correctly)
- [ ] User can browse vault files
- [ ] MCP server exposes memory to external clients (Cursor, Claude Desktop)

### Resilience
- [ ] Self-heal service catches and recovers from common failures
- [ ] Health endpoint reports real status
- [ ] Gateway restart doesn't lose state (sessions restore)
- [ ] No silent failures — errors surface in UI or chat

### Trust Tracker
- [ ] Ratings can be recorded after tasks (trust-rate.ts)
- [ ] Feedback captured when score drops (trust-feedback.ts)
- [ ] Scores visible somewhere (even if just via chat query)

---

## 🧪 VALIDATION (before first customer)

- [ ] Fresh install test — Caleb or Titus runs installer on clean machine
- [ ] Team join test — second person joins workspace successfully  
- [ ] 30-minute "day in the life" test — morning brief, ask questions, create tasks, search memory
- [ ] Nothing crashes, no unhandled errors in logs

---

## 🚫 NOT IN V1 (see V2-ROADMAP.md)

- ScreenPipe hourly/daily/weekly summarization crons
- Click-click-click wizard onboarding (current guided flow is fine)
- Trust tracker dashboard UI
- ClickUp / Kanban board
- Notification system
- Advanced admin panel
- Public plugin marketplace

---

*This list is CLOSED. If you think of something, put it in V2-ROADMAP.md.*
