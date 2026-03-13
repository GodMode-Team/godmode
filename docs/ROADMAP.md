# GodMode Roadmap

**Last updated:** 2026-03-12

---

## Vision

GodMode Personal is the AI-native way individuals work. Deeply personal context, deeply personal skills, an army of agents, persistent workflows. Plug into any company, client, or team and merge context seamlessly. The personal AI system that gets better every day.

**GodMode Personal + Gallic (Business OS):** GodMode Personal is what every team member has. Gallic is the business operating system that ingests all business data and manages the company layer. GodMode Personal plugs into Gallic — the individual's ally, agents, and accumulated context compose with the business's data, tools, and workflows. Match made in heaven.

---

## Current Sprint: Proof + Inbox Self-Evolution (2026-03-12)

See `docs/OVERNIGHT-PLAN-PAPERCLIP-PROOF.md` for full spec.

- [ ] Universal inbox (agent executions + skill runs, high signal only)
- [ ] Self-evolution feedback loop (low scores → corrections in persona/skill files)
- [ ] Proof integration (collaborative doc editor with provenance)
- [ ] Single-agent → Proof pipeline (agents write to Proof, user watches + co-edits)
- [ ] Real-time steering (Prosper steers agents via chat, human edits Proof directly)
- [ ] Cron workflow skill card (recurring business functions as cron jobs)
- [ ] Prosper chief-of-staff awareness (context injection + skill cards)

---

## Sprint 2: Paperclip Swarm Orchestration

- [ ] Paperclip adapter (heartbeat protocol → GodMode queue mapping)
- [ ] Multi-doc Proof workspace (one workspace per project, multiple agent outputs)
- [ ] Org chart auto-generation from roster categories
- [ ] Budget + trust integration (token tracking per project, trust score updates from swarm tasks)
- [ ] Cross-document references (agents reference each other's Proof docs)

---

## Sprint 3: Onboarding Overhaul

**This is the most important process. Must be done very carefully.**

- [ ] Import ChatGPT conversations (parse export, extract facts, seed Mem0)
- [ ] Import conversations from other AI tools (Claude, Gemini, etc.)
- [ ] Connect all memory sources wizard (Obsidian vault, Google Drive, Notion, etc.)
- [ ] Build-your-context flow (guided interview that populates second brain)
- [ ] Build-your-trust-system flow (set autonomy levels, review first few agent outputs)
- [ ] Build-your-tools flow (connect Google Calendar, email, Slack, GitHub, etc.)
- [ ] Build-your-feedback-loop flow (explain scoring, show how corrections improve agents)
- [ ] First-run skill recommendations (suggest skills based on user's role and goals)
- [ ] First-run agent roster recommendations (suggest agents based on user's industry)
- [ ] Onboarding should be so easy that a non-technical founder can go from zero to productive in 30 minutes
- [ ] Direct, clear instructions for every import/connect step
- [ ] Progress tracker showing what's set up vs what's still needed

---

## Sprint 4: Team Workspace Sharing

- [ ] Workspaces can be synced and shared across team members
- [ ] Shared skills, shared agents, shared tasks between team allies
- [ ] Each team member gets their own ally instance with shared context
- [ ] Agents can cross-talk between workspaces via back-channel sync
- [ ] Conflict resolution for shared resources

---

## Sprint 5: Ally-in-Slack

- [ ] Prosper lives in Slack for human co-working at communication level
- [ ] Slack messages can trigger agent delegation
- [ ] Agent results surface in Slack channels
- [ ] Bots have their back channel for coordination
- [ ] Thread-aware context (ally knows which Slack thread maps to which GodMode session)

---

## Sprint 6: Multi-Ally Coordination

- [ ] CEO's chief of staff manages other teams' allies
- [ ] Deduplication engine: prevent duplicate skills, agents, cron jobs, and work across teams
- [ ] Cross-team alignment: CEO ally ensures all team allies are working toward same goals
- [ ] Shared memory graph across the organization
- [ ] Role-based access control for shared context

---

## Sprint 7: Gallic Integration

- [ ] GodMode Personal ↔ Gallic Business OS bridge
- [ ] Individual context merges with business context through a clean API layer
- [ ] Business data (CRM, analytics, financials) available to personal ally via Gallic
- [ ] Team allies coordinate through Gallic's business graph
- [ ] Privacy boundary: personal context stays personal unless explicitly shared

---

## Sprint 8: Multi-Platform Agent Compatibility

GodMode works with ALL major agent platforms — not locked to one provider.

- [ ] **Hermes Agent adapter** — Nous Research's agent framework, already has Paperclip adapter (PR by @dotta). Claude provider support + Slack integrations + context compression. Natural fit.
- [ ] **OpenClaw agents** — Already native (GodMode is an OpenClaw plugin)
- [ ] **Claude Code / Codex agents** — Already used for builder agent workflows
- [ ] **Custom agent adapters** — Standardized adapter interface so any agent framework can plug in
- [ ] **Agent provider abstraction** — GodMode roster personas can be executed by any agent runtime (Hermes, OpenClaw, Claude Code, custom). The persona file defines WHAT the agent does; the adapter defines HOW it runs.
- [ ] **Sovereign personal agent** — All data stays local. Self-evolving via trust tracker. Works with any provider. Plug into anything.

**Key insight:** The ecosystem is converging. Orchestrators (Paperclip) + specialized agents (Hermes, GodMode roster) + adapters between them. GodMode is the interface + workflow + context layer that sits above all of it. Non-technical users get the full power without going deep.

---

## Sprint 9: Marketplace

- [ ] Community-contributed agents, skills, and workflow templates
- [ ] Install with one click, customize via persona files
- [ ] Trust scores aggregate across the community
- [ ] Revenue sharing for top contributors
- [ ] The engine + slots + community model fully realized

---

## The Meta-Pattern

This works for ALL founders and entrepreneurs because it's modular:
- **Skills** = markdown files (no code needed)
- **Agents** = markdown persona files (no code needed)
- **Tools** = API connections (configured, not coded)
- **Workflows** = cron jobs using agents + tools
- **Context** = second brain + memory + identity graph
- **Trust** = feedback loop that makes everything better every day

Top employees will bring their own GodMode — their own ally, agents, skills, accumulated context, and trust scores. That's the BYOA (Bring Your Own Agents) future. The outputs they're renowned for come from their personal AI system, and they plug it into wherever they work.

**GodMode Personal + Gallic (Business OS):** GodMode Personal is what every team member has — their sovereign personal agent. Gallic is the business operating system that ingests all business data. GodMode Personal plugs into Gallic seamlessly. Individual context composes with business data. Privacy boundary: personal stays personal unless shared. The full stack: GodMode Personal (individual) → Gallic (business) → external tools (via adapters).

**Platform-agnostic by design:** GodMode works with any agent provider (Hermes, OpenClaw, Claude, Codex, custom). The persona files define what agents do. The adapters define how they run. Swap providers without losing context, trust scores, or accumulated corrections. True sovereignty.
