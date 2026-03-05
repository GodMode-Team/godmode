# Lean Audit Archive — 2026-03-04

All code listed below was removed during the lean audit. Every file is preserved at:
```
git checkout v1.1.0-pre-lean-audit -- <filepath>
```

## Services Killed (12)
| File | What it did |
|---|---|
| `src/services/focus-pulse-heartbeat.ts` | 30-min timer checking focus alignment scores |
| `src/services/rescuetime-fetcher.ts` | Fetched RescueTime productivity data every 6h |
| `src/services/ide-activity-watcher.ts` | Watched Claude Code JSONL + git repos via chokidar |
| `src/services/coding-orchestrator.ts` | Multi-stage design/build/QC coding swarms |
| `src/services/swarm-pipeline.ts` | Built stage-specific prompts for coding swarms |
| `src/services/coding-notification.ts` | Sent iMessage/SMS when coding task completed |
| `src/services/session-coordinator.ts` | Multi-Claude-Code session conflict tracking |
| `src/services/claude-code-sync.ts` | Scanned ~/.claude/ JSONL for session history |
| `src/services/session-archiver.ts` | Auto-archived idle sessions after 7 days |
| `src/services/org-sweep.ts` | Checked for orphaned files and duplicates every 15min |
| `src/services/cron-guard.ts` | Patched cron jobs to prevent reply capture |
| `src/services/scout.ts` + `observer.ts` + `advisor.ts` | 3 services consolidated into proactive-intel |

## Methods Killed (12)
| File | What it did |
|---|---|
| `src/methods/coding-tasks.ts` | Developer coding swarm RPCs |
| `src/methods/session-coordination.ts` | 9 RPCs for multi-session coordination |
| `src/methods/session-archive.ts` | Session archival RPCs |
| `src/methods/session-search.ts` | Full-text chat history search |
| `src/methods/rescuetime.ts` | RescueTime data pull RPCs |
| `src/methods/life-dashboards.ts` | Wheel of Life + Vision Board RPCs |
| `src/methods/lifetracks.ts` | Life tracking metrics RPCs |
| `src/methods/clawhub.ts` | Internal knowledge base RPCs |
| `src/methods/security-audit.ts` | Security audit runner |
| `src/methods/subagent-runs.ts` | Subagent swarm visibility RPCs |
| `src/methods/focus-pulse.ts` | Focus pulse tracking RPCs |
| `src/methods/focus-pulse-scorer.ts` | Focus pulse scoring functions |

## Libs Killed (3)
| File | What it did |
|---|---|
| `src/lib/session-registry.ts` | Tracked active Claude Code sessions in JSON registry |
| `src/lib/coding-task-state.ts` | Coding swarm workflow state management |
| `src/lib/injection-fingerprints.ts` | Dynamic leak detection via n-gram matching |

## Tools Killed (1)
| File | What it did |
|---|---|
| `src/tools/coding-task.ts` | CLI tool for launching coding swarm tasks |

## Safety Gates Killed (6)
grepBlocker, sessionHygiene, exhaustiveSearch, selfServiceGate, persistenceGate, searchRetryGate

## Vault-Capture Pipelines Killed (3)
Scout->Vault, Inbox->PARA auto-categorization, Progressive Summarization

## UI Views Killed (5+)
wheel-of-life, vision-board, lifetracks, proactive-intel (standalone), people, side-chat/ally-follows-around

## Context Injection Changes
- CONSCIOUSNESS.md raw dump (300 lines) -> 50-line awareness snapshot
- WORKING.md raw dump (150 lines) -> folded into awareness snapshot
- Persistence Protocol (66 lines) -> 30-line lean ally identity
- 6 safety gate nudges removed, 3 remain
