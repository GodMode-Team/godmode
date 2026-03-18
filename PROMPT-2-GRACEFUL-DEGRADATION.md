Read V2-EXECUTION-SPEC.md for context.

## YOUR TASK: Make GodMode work with ONLY a model API key. Zero other dependencies required.

The plugin currently crashes or blocks onboarding if various env vars are missing. Fix this so that a brand new install with just ANTHROPIC_API_KEY (or any model key) works immediately.

### RULE: Every optional integration must gracefully degrade.

1. **Calendar (GOG_CALENDAR_ACCOUNT etc):** 
   - If not configured, calendar methods return empty arrays, not errors
   - UI shows "Connect your calendar" prompt instead of empty state
   - No crash, no error log spam

2. **Obsidian Vault (OBSIDIAN_VAULT_PATH):**
   - If not configured, Second Brain falls back to ~/godmode/memory/
   - UI works with file-based memory, just without vault features
   - No crash

3. **Embeddings (OPENAI_API_KEY for QMD):**
   - If QMD/embeddings unavailable, memory search falls back to simple grep/keyword matching
   - The memory_search tool should work (degraded) without embeddings
   - No crash, no "embedding provider timeout" errors blocking the UI

4. **Proof (PROOF_API_URL):**
   - If not configured, proof-related features are hidden/disabled
   - No crash

5. **Fathom (if kept):**
   - If not configured, fathom webhook/processor simply don't start
   - No crash

6. **Any other env var:**
   - Grep for process.env across all remaining src/ files
   - For each env var found, ensure missing = graceful degradation, not crash
   - Document which are required vs optional in a comment block at top of index.ts

### ONBOARDING SIMPLIFICATION:
- The onboarding flow should ask for: name, what you're working on, communication style
- That's it for required. Everything else is progressive enhancement.
- After initial chat, Prosper suggests: "Want to connect your calendar? /setup calendar"

### FILES TO MODIFY:
- index.ts — wrap all service starts in try/catch, check env before starting optional services
- src/methods/calendar.ts — graceful empty returns
- src/methods/second-brain.ts — fallback to file-based  
- src/lib/memory.ts — make QMD optional with keyword fallback
- src/services/onboarding.ts — simplify required steps
- Any other file that reads process.env and can throw

### VALIDATION:
1. Unset ALL env vars except ANTHROPIC_API_KEY
2. Start OpenClaw with GodMode plugin
3. Open /godmode in browser
4. Complete onboarding
5. Chat with Prosper
6. Create a task
7. Check Today tab
8. NONE of these should error

Commit with: git commit -m "feat: graceful degradation — only model key required"

### WHEN DONE, run and paste:
```bash
grep -r "process\.env\." src/ --include="*.ts" -h | grep -o 'process\.env\.[A-Z_a-z0-9]*' | sort -u
```
Every remaining env var should be documented as required or optional.
