---
domain: autoresearch
triggers: autoresearch, optimize, overnight, campaign, eval, benchmark, tune, evolve prompts, improve godmode
tools: queue_add
---

# Autoresearch — Overnight Optimization System

The autoresearch system uses the Karpathy pattern (modify → measure → keep/revert → loop) to optimize GodMode overnight.

## How to Run
- Full suite: `nohup bash autoresearch/overnight.sh &> autoresearch/overnight.log &`
- Single campaign: `node autoresearch/campaigns/<name>.mjs --iterations N`
- Eval only: `node autoresearch/eval-runner.mjs`

## Available Campaigns
| Campaign | Type | What It Optimizes |
|----------|------|-------------------|
| context-words | Deterministic | TIME_WORDS, OPS_WORDS relevance gates |
| skill-triggers | Deterministic | Skill card keyword matching |
| memory-thresholds | Deterministic | Mem0 score thresholds, limits |
| soul-essence | LLM Judge | SOUL_ESSENCE, CAPABILITY_MAP prompts |
| queue-prompts | LLM Judge | Queue PROMPT_TEMPLATES |
| ally-experience | LLM Judge | Customer persona simulation (leverage/flow/awakening/purpose) |
| second-brain | LLM Judge | Vault optimization |
| product-audit | LLM + Structural | Full 5-phase product audit |

## Tips
- All LLM campaigns use Sonnet 4.6 (never lesser models)
- Auth resolves from Claude Code OAuth with auto-refresh
- The overnight runner creates a git safety snapshot before any mutations
- Logs go to `autoresearch/logs/` and `autoresearch/campaigns/*-log.tsv`
- Product audit generates a markdown report at `autoresearch/campaigns/product-audit-report.md`
