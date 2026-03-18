Read V2-EXECUTION-SPEC.md for context, but your actual task is more aggressive than what it describes.

## YOUR TASK: Strip GodMode to its absolute minimum working core.

You are on branch feat/v2-slim. Delete everything that is not essential for:
1. Chat working
2. Onboarding capturing user identity  
3. Tasks CRUD
4. Daily brief generation
5. Dashboards (display only)
6. Settings/config
7. Basic memory (file-based, no embeddings required)

### DELETE these src/methods/ files:
- swarm-rpc.ts (Paperclip replaces)
- consciousness.ts (Honcho replaces later)  
- impact-ledger.ts (not core)
- fathom-webhook.ts (optional, not core)
- x-intel.ts (OC has x_read)
- team-curation.ts (not core)
- resources.ts (not core)

### DELETE these src/services/ files:
- consciousness-heartbeat.ts (Honcho replaces later)
- curation-agent.ts (not core)
- fathom-processor.ts (optional)
- x-browser.ts (OC has browser tool)  
- x-client.ts (OC has x_read)
- proof-server.ts (not using hosted Proof)
- code-repair.ts (OC has godmode_repair)
- vault-capture.ts (simplify to obsidian-sync only)
- agent-toolkit-server.ts (investigate first — delete if it's a Paperclip/swarm precursor, keep if it serves the GodMode UI)

### DELETE these src/tools/ files:
- delegate-tool.ts (Paperclip skill replaces)
- proof-tool.ts (not using Proof)

### DELETE these src/lib/ files:
- proof-bridge.ts (not using Proof)
- awareness-snapshot.ts (consciousness → Honcho later)
- interaction-ledger.ts (investigate — delete if not imported by anything you're keeping)

### DELETE these ui/src/ui/views/ files:
- mission-control.ts
- parallel-sessions.ts
- clawhub.ts  
- proof-viewer.ts (the existing markdown-sidebar.ts stays)
- onboarding-wizard.ts (keep setup.ts and onboarding.ts only — pick ONE primary onboarding)
- work.ts (if redundant with my-day.ts — check first)

### REMOVE from package.json dependencies:
- mem0ai
- clawhub
- better-sqlite3 (ONLY if nothing remaining uses it — grep for imports first)

### UPDATE index.ts:
- Remove all imports for deleted files
- Remove service starts for deleted services  
- Remove RPC registrations for deleted methods
- Remove tool registrations for deleted tools
- Remove feature flags for deleted features

### CRITICAL RULES:
1. After EVERY batch of deletions, run: pnpm typecheck
2. Fix any TypeScript errors from broken imports
3. If you're unsure whether a file is used, grep for its exports first
4. Do NOT delete files that are imported by files you're keeping
5. The plugin MUST build: pnpm build && pnpm build:ui
6. Commit with: git commit -m "feat: v2 great deletion — strip to essential core"

### WHEN DONE, run these commands and paste the output:
```bash
find src/ -name "*.ts" | wc -l
find ui/src/ui/views -name "*.ts" | wc -l  
pnpm typecheck 2>&1 | tail -5
pnpm build 2>&1 | tail -5
```
