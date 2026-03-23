# GodMode Open Source Readiness Plan

**Date:** 2026-03-23
**Goal:** Make the GodMode plugin clean, secure, and ready for public open source release (AGPL-3.0).
**Baseline:** 6.9/10 architecture score, 147/147 tests passing, build clean.
**Branch:** Create `feat/oss-readiness` from `main`.

---

## Phase 1: Security Fixes (CRITICAL — do first, block everything else)

### 1.1 Shell injection in integrations.ts
- **File:** `src/methods/integrations.ts:299-301`
- **Bug:** `GOG_KEYRING_PASSWORD` from `process.env` is interpolated directly into a shell command string via `runShell()`. No escaping.
- **Fix:** Use `execFile` with an array of arguments instead of string interpolation, OR shell-escape the password value. Example:
  ```typescript
  // Instead of string interpolation:
  const { code, stdout, stderr } = await runShell(
    `GOG_KEYRING_PASSWORD=${shellEscape(gogPass)} gog auth add ${email} --services calendar --client ${client} 2>&1`,
    30_000,
  );
  ```
  Better: pass env vars via the `env` option to `child_process.exec` instead of prefixing the command string.

### 1.2 Root .gitignore missing .env patterns
- **File:** `.gitignore`
- **Bug:** No `.env*` pattern at root level. Only `site/.gitignore` protects env files.
- **Fix:** Add to root `.gitignore`:
  ```
  .env
  .env.*
  .env.local
  .env.*.local
  !.env.example
  ```

### 1.3 Stripe keys in git history
- **File:** `docs/OVERNIGHT-AUTH-BUILD.md` (tracked in git)
- **Bug:** Contains Stripe test publishable key (`pk_test_sfDZJH...`), account ID, product/price IDs.
- **Fix:** Remove the file from the repo. Then **rotate the Stripe test keys** in the Stripe dashboard — they're baked into git history and cannot be scrubbed without `git filter-repo`. Rotating is simpler and safer.
- **Action:** `git rm docs/OVERNIGHT-AUTH-BUILD.md` + rotate keys in Stripe dashboard.

### 1.4 curl | sh update mechanism
- **File:** `src/methods/system-update.ts:531`
- **Bug:** `bash -c "curl -fsSL https://lifeongodmode.com/install.sh | sh"` — no integrity check.
- **Fix:** At minimum, download to a temp file, verify a checksum, then execute. Or use `npm install -g @godmode-team/godmode` as the update path instead. For OSS, the npm path is more trustworthy.

### 1.5 Self-heal reads Claude Code OAuth credentials
- **File:** `src/lib/anthropic-auth.ts:26-31`
- **Bug:** Reads `~/.claude/.credentials.json` and extracts OAuth access tokens. This is a credential-sharing pattern that should be documented, not hidden.
- **Fix:** Add a clear comment explaining this is intentional (GodMode piggybacks on Claude Code's Max subscription). For OSS users, document that they need `ANTHROPIC_API_KEY` env var set directly. Consider adding a startup log line: `"Using Claude Code OAuth credentials"` when this path is taken.

### 1.6 Remove personal content from site/ai-audit/
- **Directory:** `site/ai-audit/` (9 files)
- **Bug:** Contains Caleb's headshot, client prospect pages (john-gulick.html, rich-hodge.html, thomas-goubau.html), email campaign templates with personal details.
- **Fix:** `git rm -r site/ai-audit/`
- **Consider:** Whether the entire `site/` directory belongs in this repo or should be a separate `godmode-website` repo (it already has one at `MrCalebH/godmode-website`).

---

## Phase 2: Identity Scrub (same branch, same session)

### 2.1 Replace hardcoded "Caleb"
- `src/services/hermes-imessage-forwarder.ts:72` — `"replying to an iMessage from Caleb"`
  - **Fix:** Import `getOwnerName()` from `src/lib/ally-identity.ts` and use it dynamically.

### 2.2 Replace hardcoded "Prosper" with dynamic assistant name
- `ui/src/ui/context/app-context.ts:78` — `assistantName: "Prosper"` default
  - **Fix:** Use `"Assistant"` as default, let config override.
- `assets/godmode-ui/index.html:21` — `window.__OPENCLAW_ASSISTANT_NAME__ = "Prosper"`
  - **Fix:** Change to `"Assistant"` or remove (let runtime set it).
- `src/hooks/lifecycle-hooks.ts:895` — `"Prosper paused — AI service is overloaded"`
  - **Fix:** Use `"Assistant paused"` or inject name dynamically.
- `src/hooks/safety-gates.ts:881` — comment only
  - **Fix:** Reword comment to not reference "Prosper".
- `src/tools/delegate-tool.ts:2` — JSDoc comment
  - **Fix:** Change "Prosper delegates" to "The ally delegates".
- `src/services/hermes-imessage-forwarder.ts:7` — JSDoc comment
  - **Fix:** Change "Prosper (OC)" to "the ally (OC)".

### 2.3 Remove private project references
- `src/tools/honcho-query.ts:30` — `"What has the user said about Patient Autopilot?"` in tool description
  - **Fix:** Use a generic example like `"What has the user said about Project X?"`.
- `src/methods/team-workspace.ts:499` — `"trp, patient-autopilot"` in JSDoc
  - **Fix:** Use generic examples like `"project-a, project-b"`.

### 2.4 Scrub hardcoded user paths from docs
- Search `docs/` for `/Users/calebhodges` and replace with `~/` or `$HOME/`.
- Files: `docs/SESSION-MERGE-ALL-PRs.md`, `docs/PAPERCLIP-HERMES-INTEGRATION-PLAN.md`, others.
- Also check `tests/safety-gates.test.ts:168,202` for `/Users/caleb/godmode/`.

### 2.5 Scrub internal docs
- Remove or redact these files:
  - `docs/OVERNIGHT-AUTH-BUILD.md` (already removed in 1.3)
  - `docs/INTEL-2026-03-05.md` — internal intelligence doc
  - `docs/SESSION-*.md` (5 files) — internal session logs
  - `docs/JOBS-PLAN.md` — internal org doc
- Keep: `GODMODE-META-ARCHITECTURE.md`, `ROADMAP.md`, `SECURITY.md`, `DEPLOYMENT-GUIDE.md`, `SECOND-BRAIN-SYSTEM.md`.

---

## Phase 3: OSS Packaging (new commit)

### 3.1 Create CONTRIBUTING.md
- Local dev setup instructions (prerequisites, pnpm install, pnpm build, pnpm typecheck)
- Architecture overview (entry point → hooks → methods → tools → services → lib)
- "How to add a new tool" walkthrough
- "How to add a new RPC method" walkthrough
- Branch discipline (from CLAUDE.md)
- PR process

### 3.2 Create CODE_OF_CONDUCT.md
- Use Contributor Covenant v2.1 (standard for OSS)

### 3.3 Delete 7 dead service files
- `src/services/coding-notification.ts`
- `src/services/ide-activity-watcher.ts`
- `src/services/claude-code-sync.ts`
- `src/services/proactive-intel.ts`
- `src/services/scout.ts`
- `src/services/observer.ts`
- `src/services/advisor.ts`
- **Verify:** Check `vault-capture.ts` imports `scout.js` — update if needed.

### 3.4 Clean up remote branches
- Delete 17 merged remote branches (list in retro report)
- Delete 3 superseded compat branches (2026.3.2, 2026.3.12, 2026.3.13)
- Triage 6 abandoned task branches
- Keep: fix/issue-{11,12,13,14,22,25}, feat/restore-resource-strip

### 3.5 Add .env to root .gitignore (done in 1.2)

---

## Phase 4: Code Quality (separate commits, can be iterative)

### 4.1 Consolidate Logger type (HIGH — 19+ definitions)
- Define once in `src/types/plugin-api.ts`:
  ```typescript
  export interface Logger {
    info(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
  }
  ```
- Find/replace all local `type Logger = { info..., warn..., error... }` definitions.
- Also unify `PluginLogger` (plugin-api.ts) and `AdapterLogger` (adapter/types.ts).

### 4.2 Fix ReDoS vector in tool-grounding-gate
- **File:** `src/hooks/tool-grounding-gate.ts:119`
- **Bug:** `new RegExp(\`\\b${name}\\b\`, "i")` — `name` from DB not regex-escaped.
- **Fix:** Add `escapeRegex(name)` before interpolation:
  ```typescript
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  ...KNOWN_NAMES.map((name) => new RegExp(`\\b${escapeRegex(name)}\\b`, "i")),
  ```

### 4.3 Platform-gate macOS paths
- `src/services/queue-processor.ts:156-158` — wrap `/opt/homebrew/bin` in `process.platform === "darwin"` check
- `src/services/x-browser.ts:114` — same
- `src/services/hermes-imessage-forwarder.ts:17` — already has env var fallback, just needs a comment

### 4.4 Unify index.ts / register-all.ts (HIGH — ~400 lines duplicated)
- Make `register-all.ts` the single source of handler registration.
- Refactor `index.ts` to:
  1. Set up OC-specific lifecycle hooks
  2. Call `registerAll(adapter)` for shared handler registration
  3. Add OC-only extras (HTTP routes, plugin config)
- Target: `index.ts` under 200 lines.

### 4.5 Address bare catch blocks (top 50)
- Priority files: `queue-processor.ts` (34), `awareness-snapshot.ts` (24), `vault-capture.ts` (20)
- At minimum, add `catch (err) { logger.debug?.("operation failed", err); }` so errors are visible when debugging.
- Do NOT change error-swallowing behavior — just make it observable.

### 4.6 Extract duplicated SSE finalization in chat-proxy
- **File:** `src/adapter/hermes/chat-proxy.ts:247,309,336`
- **Fix:** Extract `finalizeSession(session, fullResponse, lastUsage, callbacks)` helper.

### 4.7 Extract resolveAnthropicKeyForAgents()
- Duplicated in `src/services/queue-processor.ts:103-151` and `src/methods/brief-generator.ts`
- **Fix:** Create `src/lib/resolve-anthropic-key.ts`, import from both.

### 4.8 Fix onboarding split duplication
- `MAX_HARD_RULES`, `today()`, `nowTimestamp()` duplicated between `onboarding.ts` and `onboarding-templates.ts`
- **Fix:** Export from one, import in the other.

### 4.9 Unify RespondFn type
- `src/types/plugin-api.ts:172` vs `src/adapter/types.ts:22` — incompatible signatures.
- **Fix:** Keep the richer one in plugin-api.ts, re-export from adapter/types.ts.

### 4.10 Convert 11 dynamic safety-gates imports to static
- **File:** `src/hooks/lifecycle-hooks.ts:211,247,299,371,381,391,401,411,423,433,509`
- **Fix:** Add the missing functions to the static import at top of file.

### 4.11 Remove dead session tracking code
- **File:** `src/hooks/lifecycle-hooks.ts:49-54,196-206,312-321`
- `_sessionTracker` Map, `SESSION_TRACKER_MAX`, `SESSION_MIN_MESSAGES` — all dead after v2 slim removal.

### 4.12 Add timeout to OAuth refresh fetch
- **File:** `src/services/self-heal.ts:337` (or `anthropic-auth.ts`)
- **Fix:** Add `AbortSignal.timeout(10_000)` to the fetch call.

---

## Phase 5: Test Coverage (ongoing, separate branch if needed)

### 5.1 Priority test targets (untested critical paths)
1. **Tools** (0/17 tested) — start with `queue-add`, `tasks-tool`, `delegate-tool`
2. **Context pipeline** — `context-budget.ts` has tests, but `before-prompt-build.ts` and `gather-context-inputs.ts` do not
3. **Self-heal pipeline** — `self-heal.ts`, `health-ledger.ts`
4. **Identity graph** — `identity-graph.ts` (SQL + LLM extraction)
5. **Session search** — `session-search.ts` (FTS5 queries)

### 5.2 Target metrics
- Module coverage: 8% → 25% (add 20+ test files)
- Test count: 147 → 300+
- All tools should have at least smoke tests

---

## Verification Checklist (run after all phases)

```bash
# 1. No secrets in tracked files
rg "sk_test_|sk_live_|pk_test_|pk_live_" --type ts --type md --type html
rg "ANTHROPIC_API_KEY.*=.*sk-" --type ts

# 2. No hardcoded personal names in source
rg "\\bCaleb\\b" src/ ui/src/ --type ts
rg "\\bProsper\\b" src/ ui/src/ assets/ --type ts --type html | grep -v node_modules

# 3. No hardcoded user paths
rg "/Users/calebhodges" src/ docs/ tests/

# 4. Build + typecheck + tests
pnpm build && pnpm typecheck && npx vitest run

# 5. No dead imports
rg "coding-notification|ide-activity-watcher|claude-code-sync|proactive-intel" src/ index.ts

# 6. .env protection
grep "\.env" .gitignore

# 7. License present
cat LICENSE | head -1

# 8. Contributing + CoC exist
ls CONTRIBUTING.md CODE_OF_CONDUCT.md
```

---

## Execution Notes

- **Branch:** `feat/oss-readiness` from `main`
- **Phases 1-3** should be one session, one branch, atomic commits per phase.
- **Phase 4** can be done incrementally across sessions. Each item is an independent commit.
- **Phase 5** is ongoing and can happen on a separate branch.
- **Do NOT restart the gateway** until Phase 1-3 are committed and pushed.
- After all phases, run the verification checklist, then tag as `v1.9.0-oss` and push.
