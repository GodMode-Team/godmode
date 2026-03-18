# GodMode v2 — Claude Code Execution Order

**Branch:** `feat/v2-slim`
**Date:** March 18, 2026

Run these prompts IN ORDER in VS Code Claude Code. Each builds on the previous.
Wait for each to complete and verify the build passes before starting the next.

## The Prompts

| # | File | What It Does | Est. Time |
|---|------|-------------|-----------|
| 1 | `PROMPT-1-DELETION.md` | Delete all non-essential methods, services, tools, views | 10-15 min |
| 2 | `PROMPT-2-GRACEFUL-DEGRADATION.md` | Make everything work with only a model API key | 10-15 min |
| 3 | `PROMPT-3-LIB-AUDIT.md` | Find and remove orphaned lib/ files after deletions | 5-10 min |
| 4 | `PROMPT-4-FATHOM-TO-SKILL.md` | Replace 1,470 lines of Fathom code with 30-line skill | 5 min |
| 5 | `PROMPT-5-TOOLKIT-REFACTOR.md` | Rewire agent-toolkit-server for surviving dependencies | 10 min |
| 6 | `PROMPT-6-UI-CLEANUP.md` | Remove dead views, resolve overlaps, fix navigation | 10-15 min |
| 7 | `PROMPT-7-META-SKILLS.md` | Write 7 core SKILL.md files | 10 min |

**Total estimated: ~60-85 minutes of Claude Code execution time**

## Before Starting

```bash
cd ~/Projects/godmode-plugin
git checkout feat/v2-slim
git status  # should be clean
```

## After All Sessions

```bash
pnpm typecheck && pnpm build && pnpm build:ui
find src/ -name "*.ts" | wc -l        # target: <60
find ui/src/ui/views -name "*.ts" | wc -l  # target: <35
```

Then test manually:
1. Start OpenClaw with ONLY ANTHROPIC_API_KEY set
2. Open /godmode
3. Complete onboarding
4. Chat, create task, check Today tab
5. Nothing should crash

## What's NOT In These Prompts (Phase 2)

- Honcho integration
- Paperclip integration (beyond the skill)
- Composio integration
- Hermes adapter
- Real-time collaborative editing (Proof SDK)
- Workspace team sync hardening
- Open source workspace extraction
