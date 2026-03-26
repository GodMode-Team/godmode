---
description: "[gstack] Safety guardrails for destructive commands — warns before rm -rf, DROP TABLE, force-push, etc."
---


# /careful — Destructive Command Guardrails

Safety mode is now **active**. Every shell command will be checked for destructive
patterns before running. If a destructive command is detected, you'll be warned
and can choose to proceed or cancel.

## GodMode Guardrail

This skill operates as a **guardrail** in GodMode/OpenClaw. Before every `exec` call
that runs a shell command, the guardrail logic must inspect the command string for
destructive patterns. If a match is found, the guardrail should:

1. **Warn the user** with a clear message about what destructive pattern was detected
2. **Ask the user** whether to proceed or cancel
3. Only execute the command if the user explicitly confirms

The guardrail applies to all `exec` tool invocations that run shell commands.

## What's protected

| Pattern | Example | Risk |
|---------|---------|------|
| `rm -rf` / `rm -r` / `rm --recursive` | `rm -rf /var/data` | Recursive delete |
| `DROP TABLE` / `DROP DATABASE` | `DROP TABLE users;` | Data loss |
| `TRUNCATE` | `TRUNCATE orders;` | Data loss |
| `git push --force` / `-f` | `git push -f origin main` | History rewrite |
| `git reset --hard` | `git reset --hard HEAD~3` | Uncommitted work loss |
| `git checkout .` / `git restore .` | `git checkout .` | Uncommitted work loss |
| `kubectl delete` | `kubectl delete pod` | Production impact |
| `docker rm -f` / `docker system prune` | `docker system prune -a` | Container/image loss |

## Safe exceptions

These patterns are allowed without warning:
- `rm -rf node_modules` / `.next` / `dist` / `__pycache__` / `.cache` / `build` / `.turbo` / `coverage`

## How it works

The guardrail reads the command from the tool input, checks it against the
patterns above, and presents a warning message if a match is found. You can
always override the warning and proceed.

To deactivate, end the conversation or start a new one. Guardrails are session-scoped.
