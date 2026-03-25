# OpenClaw v2026.3.22 Release Bug Catalog

**Source:** X/Twitter community complaints, March 22-23 2026
**Cataloged by:** Hermes for GodMode team
**Date:** 2026-03-23

---

## Critical Bugs (Widespread, High Impact)

### 1. Control UI Assets Missing After npm Install
- **Symptom:** Web UI shows "Control UI assets not found. Build them with `pnpm ui:build`". The `pnpm ui:build` command fails outside the source repo (no package.json in npm package).
- **Upstream Issue:** openclaw/openclaw#52808
- **Workaround:** Clone repo, `npm install`, `pnpm ui:build`, copy `dist/control-ui` to global node_modules.
- **GodMode Impact:** HIGH — GodMode bundles its own UI via `assets/godmode-ui/` fallback, but if the host OpenClaw Control UI is broken, users can't even reach GodMode. Our `pnpm ui:sync` pipeline already pre-commits UI assets, so GodMode-specific UI should survive this, but we need to verify the host serves our fallback correctly when its own UI is missing.
- **GodMode Action:** Add a self-heal check that detects missing host UI and surfaces a helpful error pointing users to the fix. Consider adding `openclaw doctor --fix` recommendation to onboarding scanner.

### 2. WhatsApp Plugin Missing from dist/extensions/
- **Symptom:** Gateway reports "plugin not found" for WhatsApp despite valid config. Extension missing from npm package `dist/extensions/`.
- **Upstream Issues:** openclaw/openclaw#52857, #52881
- **Workaround:** Update to beta channel: `openclaw update --channel beta`
- **GodMode Impact:** MEDIUM — GodMode has WhatsApp channel integration in the UI (channels.whatsapp.ts). If the host WhatsApp plugin is broken, GodMode's WhatsApp onboarding will show setup steps that silently fail. 
- **GodMode Action:** Add WhatsApp plugin presence check to onboarding scanner. If plugin missing, show clear warning instead of letting user configure a dead channel.

### 3. ACP/acpx Plugin Errors
- **Symptom:** "ACP runtime backend not configured" or plugin not found. acpx is now built into core but old configs still reference it as a plugin.
- **Workaround:** Remove acpx from plugins config, set `acp.backend: 'core'` in `~/.openclaw/openclaw.json`.
- **GodMode Impact:** LOW-MEDIUM — GodMode doesn't directly depend on acpx, but if the host gateway is crashing from bad acpx config, GodMode goes down with it.
- **GodMode Action:** Add acpx config migration check to self-heal pipeline. Detect old acpx plugin config and recommend removal.

---

## High Impact Bugs

### 4. Gateway Crashes / Unresponsive Agent
- **Symptom:** Gateway failures, agent stops executing commands, hangs, ignores messages.
- **Workaround:** `openclaw doctor --fix` then restart.
- **GodMode Impact:** HIGH — GodMode is a plugin; gateway crashes = total GodMode outage.
- **GodMode Action:** Already have heartbeat monitoring. Ensure self-heal surfaces gateway instability to the user quickly. Consider adding "openclaw doctor" recommendation as first step in godmode_repair tool.

### 5. OAuth Token Refresh Errors
- **Symptom:** OAuth tokens fail to refresh after update, causing auth failures for connected services.
- **Workaround:** Re-authenticate or `openclaw doctor --fix`.
- **GodMode Impact:** HIGH — GodMode's auth-client.ts and anthropic-auth.ts handle OAuth flows. Queue processor auth was already a known issue (fixed in fix/queue-processor-auth branch). But if the host OAuth layer is broken, our fixes are moot.
- **GodMode Action:** Already tracked in self-heal as `oauth-token` subsystem. Verify our auth-client handles token refresh failures gracefully and retries.

### 6. Config Drift After Update
- **Symptom:** Update changes or resets configuration, plugins get disabled unexpectedly (QQ, WeChat, Yuanbao plugins disabled).
- **GodMode Impact:** MEDIUM — GodMode's own config in `openclaw.plugin.json` could be affected. If our plugin gets disabled by a config drift, users lose GodMode silently.
- **GodMode Action:** Add plugin-presence self-check. If GodMode plugin is loaded but config seems reset, surface a warning.

---

## Lower Impact / Informational

### 7. Installation/Setup Failures
- **Symptom:** Fresh installs broken with terminal errors, dep conflicts.
- **GodMode Impact:** LOW for existing users, HIGH for new onboarding.
- **GodMode Action:** Ensure create-godmode installer handles this gracefully.

### 8. Compaction Death Loops
- **Symptom:** Memory compaction enters infinite loop, consuming resources.
- **GodMode Impact:** MEDIUM — if host compaction loops, it degrades all plugin performance.
- **GodMode Action:** Monitor via heartbeat. If memory subsystem shows degraded state, recommend `openclaw doctor`.

---

## Community Recommended Fixes

1. **Rollback:** `openclaw update --channel stable` or pin to v2026.3.13
2. **Beta hotfixes:** `openclaw update --channel beta` (fixes WhatsApp, plugin loading)
3. **Pre-update:** Always run `openclaw doctor --fix` first
4. **Self-fix via agent:** Message your OpenClaw: "Latest update error: Control UI assets not found. Fix it using https://github.com/openclaw/openclaw/issues/52808"
5. **Paid setup:** Services like whateverClaw ($99 install) — validates our 100xHuman white-glove thesis

---

## GodMode Action Items (Priority Order)

| # | Action | File(s) | Priority |
|---|--------|---------|----------|
| 1 | Add `openclaw doctor` recommendation to self-repair tool | `src/tools/self-repair.ts` | HIGH |
| 2 | Add host UI health check to onboarding scanner | `src/methods/onboarding-scanner.ts` | HIGH |
| 3 | Add WhatsApp plugin presence check before channel setup | `src/methods/onboarding-scanner.ts`, UI channels | MEDIUM |
| 4 | Add acpx config migration detection to self-heal | `src/services/self-heal.ts` | MEDIUM |
| 5 | Verify auth-client handles OAuth refresh failures gracefully | `src/lib/auth-client.ts` | MEDIUM |
| 6 | Add plugin-presence self-check (is GodMode still enabled?) | `src/services/self-heal.ts` | MEDIUM |
| 7 | Surface gateway instability faster in heartbeat | `src/services/self-heal.ts` | LOW |
