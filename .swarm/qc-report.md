# QC Report: Custom Guardrails System

**Reviewer:** QC Agent
**Date:** 2026-02-28
**Branch:** `task/build-a-custom-guardrails-system-for-god-93d003`
**Build:** PASS

---

## Summary

Clean implementation. 3 files changed (215 lines added), matches the design brief closely. Two small type/correctness fixes applied.

## Fixes Applied

### 1. `addCustomGuardrail` type signature (src/services/guardrails.ts:284)

**Bug:** `Omit<CustomGuardrail, "createdAt"> & { id?: string }` does NOT make `id` optional. TypeScript intersections keep the stricter constraint — `id: string` from the Omit side wins. Callers would get a type error if they omitted `id`.

**Fix:** `Omit<CustomGuardrail, "createdAt" | "id"> & { id?: string }` — now `id` is properly optional with UUID fallback.

### 2. RPC handler id passthrough (src/methods/guardrails.ts:110)

**Issue:** `id: input.id ?? ""` passed empty string when id was absent, relying on `||` falsy coercion in the service to fall through to UUID. Works by accident but fragile.

**Fix:** `id: input.id || undefined` — explicitly passes undefined for missing ids, matching the now-optional type.

## Verification

- `pnpm build` — PASS
- Forbidden import check (`rg "../../../../src/"`) — clean
- No console.log/debug artifacts
- No AI copy patterns detected

## Design Brief Compliance

| Requirement | Status |
|---|---|
| CustomGuardrail type | PASS |
| GuardrailsState.custom optional field | PASS |
| checkCustomGuardrails(tool, params) | PASS |
| addCustomGuardrail / removeCustomGuardrail CRUD | PASS |
| Hook enforcement in before_tool_call | PASS |
| Placement after loop breaker, before grep blocker | PASS |
| Activity logging with `custom:<id>` pattern | PASS |
| logGateActivity signature widened (no `as any`) | PASS |
| CUSTOM_DEFAULTS with X guardrail | PASS |
| Seed on undefined, respect explicit empty array | PASS |
| RPC handlers with validation | PASS |
| guardrails.list returns custom array | PASS |
| Broadcast guardrails:update on CRUD | PASS |

## No Architectural Issues Found
