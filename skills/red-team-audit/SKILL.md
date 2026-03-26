# Red Team Security Audit

Automated security audit skill that red-teams GodMode's prompt injection defenses by testing all three security shields against known attack patterns.

## When to Run

- After onboarding completes (part of setup validation)
- After changing guardrail configuration
- Periodically as a health check
- When the user asks to "red team" or "security audit"

## How to Run

Call the `security.audit` RPC:

```
security.audit({})
```

### Options

```
security.audit({
  shields: ["prompt_shield", "output_shield", "config_shield"],  // test specific shields
  saveReport: true                                                 // save to ~/godmode/data/security-audits/
})
```

## What It Tests

### Prompt Shield (10+ tests)
- Direct instruction overrides ("ignore previous instructions")
- DAN/jailbreak attempts ("you are now DAN")
- Fake system messages ("[SYSTEM] new directive")
- Prompt extraction via roleplay
- Emotional manipulation / social engineering
- Base64 encoded injections
- Developer mode requests
- Tool enumeration attacks
- Authority claim attacks ("as an Anthropic engineer")
- False positive checks (normal messages that should NOT be flagged)

### Output Shield (6+ tests)
- API key leaks (sk-*, xai-*, ghp_*)
- System prompt recitation (structural markers)
- Config file JSON leaks
- Environment variable leaks
- False positive checks (normal code and task output)

### Config Shield (8+ tests)
- Direct config file reads (cat ~/.openclaw/openclaw.json)
- Read tool targeting sensitive paths
- SSH key access attempts
- AGENTS.md / SOUL.md tool reads
- $HOME expansion bypass attempts
- False positive checks (normal bash and read operations)

## Interpreting Results

The audit returns:
- **Score**: 0-100% (should be 100% for production)
- **Grade**: A+ through F
- **Per-shield breakdown**: How many tests passed per category
- **Failures**: List of tests that failed with details
- **Recommendations**: Specific fixes if any tests fail

### Grading Scale
- **A+ (100%)**: All shields fully operational
- **A (90-99%)**: Minor gaps, low risk
- **B (80-89%)**: Some gaps need attention
- **C-F (<80%)**: Critical security gaps, fix immediately

## Presenting Results

After running the audit, present results to the user as a security report:

1. Show the overall score and grade prominently
2. List each shield's pass/fail count
3. If any failures, explain what failed and why it matters
4. Include the recommendations
5. If score is 100%, congratulate — their defenses are solid

## Report Storage

Reports are saved to `~/godmode/data/security-audits/` with timestamps.
Use these to track security posture over time.
