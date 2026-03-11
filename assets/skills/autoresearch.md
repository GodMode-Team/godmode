---
name: Autoresearch — Optimize GodMode
trigger: manual
persona: researcher
taskType: analysis
priority: high
---

# Autoresearch: Karpathy-Style Overnight Optimization

Run the autoresearch optimization suite to improve GodMode across every tunable dimension.

## What It Does

Runs 8 optimization campaigns using the modify-measure-keep/revert loop pattern:

### Deterministic Campaigns (no API calls, fast)
1. **context-words** — Optimizes TIME_WORDS and OPS_WORDS arrays for relevance gating
2. **skill-triggers** — Tests and improves skill card keyword trigger matching
3. **memory-thresholds** — Tunes Mem0 score thresholds, search limits, memory line caps

### LLM-Judged Campaigns (Sonnet 4.6, moderate cost)
4. **soul-essence** — Evolves SOUL_ESSENCE and CAPABILITY_MAP prompts
5. **queue-prompts** — Optimizes the 9 PROMPT_TEMPLATES for queue task types
6. **ally-experience** — Simulates 5 customer personas, scores leverage/flow/awakening/purpose
7. **second-brain** — Vault search and organization optimization

### Full Product Audit (Sonnet 4.6, comprehensive)
8. **product-audit** — 5-phase audit: structural tests, safety gates, customer journeys, code review, service health

## How to Run

```bash
# Full overnight run (all campaigns)
nohup bash autoresearch/overnight.sh &> autoresearch/overnight.log &

# Individual campaigns
node autoresearch/campaigns/soul-essence.mjs --iterations 15
node autoresearch/campaigns/product-audit.mjs --iterations 10
node autoresearch/campaigns/ally-experience.mjs --iterations 15

# Run the eval suite (deterministic metrics only)
node autoresearch/eval-runner.mjs
```

## Key Files
- `autoresearch/overnight.sh` — Master runner with git safety snapshots
- `autoresearch/eval-runner.mjs` — Ground truth eval (7 dimensions)
- `autoresearch/test-suite.json` — Deterministic test cases
- `autoresearch/lib/resolve-anthropic.mjs` — Shared OAuth token resolver with auto-refresh
- `autoresearch/campaigns/*.mjs` — Individual campaign scripts

## Auth
Uses Claude Max OAuth token from `~/.claude/.credentials.json` with auto-refresh.
Falls back to `ANTHROPIC_API_KEY` env var if available.
NEVER uses lesser models — Sonnet 4.6 minimum for all LLM-judged campaigns.

## Results
- Logs: `autoresearch/logs/` (per-run timestamped)
- Campaign logs: `autoresearch/campaigns/*-log.tsv`
- Product audit report: `autoresearch/campaigns/product-audit-report.md`
- Cumulative scores: `autoresearch/logs/cumulative-*.log`
