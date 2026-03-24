---
description: "[gstack] OpenAI Codex CLI second opinion -- code review, adversarial challenge, and consult modes"
---


# /codex -- Multi-AI Second Opinion

You are running the `/codex` skill. This wraps the OpenAI Codex CLI (external dependency: `codex`
must be installed separately via `npm install -g @openai/codex`) to get an independent, brutally
honest second opinion from a different AI system.

Codex is the "200 IQ autistic developer" -- direct, terse, technically precise, challenges
assumptions, catches things you might miss. Present its output faithfully, not summarized.

---

## Step 0: Detect base branch

Determine which branch this work targets. Use the result as "the base branch" in all subsequent steps.

Use `exec` to run:
1. `gh pr view --json baseRefName -q .baseRefName` -- if this succeeds, use that branch name.
2. If no PR exists, run: `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`
3. If both commands fail, fall back to `main`.

---

## Step 1: Check codex binary

Use `exec` to run:
```bash
CODEX_BIN=$(which codex 2>/dev/null || echo "")
[ -z "$CODEX_BIN" ] && echo "NOT_FOUND" || echo "FOUND: $CODEX_BIN"
```

If `NOT_FOUND`: stop and tell the user:
"Codex CLI not found. Install it: `npm install -g @openai/codex` or see https://github.com/openai/codex"

**Note:** Codex CLI is an external dependency. It is not bundled with GodMode/OpenClaw. The user
must install it separately and authenticate via `codex login`.

---

## Step 2: Detect mode

Parse the user's input to determine which mode to run:

1. `/codex review` or `/codex review <instructions>` -- **Review mode** (Step 3A)
2. `/codex challenge` or `/codex challenge <focus>` -- **Challenge mode** (Step 3B)
3. `/codex` with no arguments -- **Auto-detect:**
   - Check for a diff (with fallback if origin isn't available). Use `exec` to run:
     `git diff origin/<base> --stat 2>/dev/null | tail -1 || git diff <base> --stat 2>/dev/null | tail -1`
   - If a diff exists, prompt the user:
     ```
     Codex detected changes against the base branch. What should it do?
     A) Review the diff (code review with pass/fail gate)
     B) Challenge the diff (adversarial -- try to break it)
     C) Something else -- I'll provide a prompt
     ```
   - If no diff, check for plan files. Use `exec` to run:
     `ls -t .godmode/plans/*.md 2>/dev/null | head -1`
   - If a plan file exists, offer to review it
   - Otherwise, ask: "What would you like to ask Codex?"
4. `/codex <anything else>` -- **Consult mode** (Step 3C), where the remaining text is the prompt

---

## Step 3A: Review Mode

Run Codex code review against the current branch diff.

1. Create temp files for output capture. Use `exec` to run:
```bash
TMPERR=$(mktemp /tmp/codex-err-XXXXXX.txt)
```

2. Run the review (5-minute timeout). Use `exec` to run:
```bash
codex review --base <base> -c 'model_reasoning_effort="high"' --enable web_search_cached 2>"$TMPERR"
```

If the user provided custom instructions (e.g., `/codex review focus on security`), pass them
as the prompt argument:
```bash
codex review "focus on security" --base <base> -c 'model_reasoning_effort="high"' --enable web_search_cached 2>"$TMPERR"
```

3. Capture the output. Then parse cost from stderr. Use `exec` to run:
```bash
grep "tokens used" "$TMPERR" 2>/dev/null || echo "tokens: unknown"
```

4. Determine gate verdict by checking the review output for critical findings.
   If the output contains `[P1]` -- the gate is **FAIL**.
   If no `[P1]` markers are found (only `[P2]` or no findings) -- the gate is **PASS**.

5. Present the output:

```
CODEX SAYS (code review):
============================================================
<full codex output, verbatim -- do not truncate or summarize>
============================================================
GATE: PASS                    Tokens: 14,331 | Est. cost: ~$0.12
```

or

```
GATE: FAIL (N critical findings)
```

6. **Cross-model comparison:** If a GodMode/OpenClaw review was already run
   earlier in this conversation, compare the two sets of findings:

```
CROSS-MODEL ANALYSIS:
  Both found: [findings that overlap between GodMode and Codex]
  Only Codex found: [findings unique to Codex]
  Only GodMode found: [findings unique to GodMode's review]
  Agreement rate: X% (N/M total unique findings overlap)
```

7. Log the review result to the review log (GodMode state).

8. Clean up temp files. Use `exec` to run:
```bash
rm -f "$TMPERR"
```

---

## Step 3B: Challenge (Adversarial) Mode

Codex tries to break your code -- finding edge cases, race conditions, security holes,
and failure modes that a normal review would miss.

1. Construct the adversarial prompt. If the user provided a focus area
(e.g., `/codex challenge security`), include it:

Default prompt (no focus):
"Review the changes on this branch against the base branch. Run `git diff origin/<base>` to see the diff. Your job is to find ways this code will fail in production. Think like an attacker and a chaos engineer. Find edge cases, race conditions, security holes, resource leaks, failure modes, and silent data corruption paths. Be adversarial. Be thorough. No compliments -- just the problems."

With focus (e.g., "security"):
"Review the changes on this branch against the base branch. Run `git diff origin/<base>` to see the diff. Focus specifically on SECURITY. Your job is to find every way an attacker could exploit this code. Think about injection vectors, auth bypasses, privilege escalation, data exposure, and timing attacks. Be adversarial."

2. Run codex exec with **JSONL output** to capture reasoning traces and tool calls (5-minute timeout).
Use `exec` to run:
```bash
codex exec "<prompt>" -s read-only -c 'model_reasoning_effort="xhigh"' --enable web_search_cached --json 2>/dev/null | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line: continue
    try:
        obj = json.loads(line)
        t = obj.get('type','')
        if t == 'item.completed' and 'item' in obj:
            item = obj['item']
            itype = item.get('type','')
            text = item.get('text','')
            if itype == 'reasoning' and text:
                print(f'[codex thinking] {text}')
                print()
            elif itype == 'agent_message' and text:
                print(text)
            elif itype == 'command_execution':
                cmd = item.get('command','')
                if cmd: print(f'[codex ran] {cmd}')
        elif t == 'turn.completed':
            usage = obj.get('usage',{})
            tokens = usage.get('input_tokens',0) + usage.get('output_tokens',0)
            if tokens: print(f'
tokens used: {tokens}')
    except: pass
"
```

This parses codex's JSONL events to extract reasoning traces, tool calls, and the final
response. The `[codex thinking]` lines show what codex reasoned through before its answer.

3. Present the full streamed output:

```
CODEX SAYS (adversarial challenge):
============================================================
<full output from above, verbatim>
============================================================
Tokens: N | Est. cost: ~$X.XX
```

---

## Step 3C: Consult Mode

Ask Codex anything about the codebase. Supports session continuity for follow-ups.

1. **Check for existing session.** Use `exec` to run:
```bash
cat .context/codex-session-id 2>/dev/null || echo "NO_SESSION"
```

If a session file exists (not `NO_SESSION`), prompt the user:
```
You have an active Codex conversation from earlier. Continue it or start fresh?
A) Continue the conversation (Codex remembers the prior context)
B) Start a new conversation
```

2. Create temp files. Use `exec` to run:
```bash
TMPRESP=$(mktemp /tmp/codex-resp-XXXXXX.txt)
TMPERR=$(mktemp /tmp/codex-err-XXXXXX.txt)
```

3. **Plan review auto-detection:** If the user's prompt is about reviewing a plan,
or if plan files exist and the user said `/codex` with no arguments. Use `exec` to run:
```bash
ls -t .godmode/plans/*.md 2>/dev/null | head -1
```
Read the plan file and prepend the persona to the user's prompt:
"You are a brutally honest technical reviewer. Review this plan for: logical gaps and
unstated assumptions, missing error handling or edge cases, overcomplexity (is there a
simpler approach?), feasibility risks (what could go wrong?), and missing dependencies
or sequencing issues. Be direct. Be terse. No compliments. Just the problems.

THE PLAN:
<plan content>"

4. Run codex exec with **JSONL output** to capture reasoning traces (5-minute timeout).

For a **new session**, use `exec` to run:
```bash
codex exec "<prompt>" -s read-only -c 'model_reasoning_effort="high"' --enable web_search_cached --json 2>"$TMPERR" | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if not line: continue
    try:
        obj = json.loads(line)
        t = obj.get('type','')
        if t == 'thread.started':
            tid = obj.get('thread_id','')
            if tid: print(f'SESSION_ID:{tid}')
        elif t == 'item.completed' and 'item' in obj:
            item = obj['item']
            itype = item.get('type','')
            text = item.get('text','')
            if itype == 'reasoning' and text:
                print(f'[codex thinking] {text}')
                print()
            elif itype == 'agent_message' and text:
                print(text)
            elif itype == 'command_execution':
                cmd = item.get('command','')
                if cmd: print(f'[codex ran] {cmd}')
        elif t == 'turn.completed':
            usage = obj.get('usage',{})
            tokens = usage.get('input_tokens',0) + usage.get('output_tokens',0)
            if tokens: print(f'
tokens used: {tokens}')
    except: pass
"
```

For a **resumed session** (user chose "Continue"), use `exec` to run:
```bash
codex exec resume <session-id> "<prompt>" -s read-only -c 'model_reasoning_effort="high"' --enable web_search_cached --json 2>"$TMPERR" | python3 -c "
<same python streaming parser as above>
"
```

5. Capture session ID from the streamed output. The parser prints `SESSION_ID:<id>`
   from the `thread.started` event. Save it for follow-ups. Use `exec` to run:
```bash
mkdir -p .context
```
Save the session ID printed by the parser (the line starting with `SESSION_ID:`)
to `.context/codex-session-id`.

6. Present the full streamed output:

```
CODEX SAYS (consult):
============================================================
<full output, verbatim -- includes [codex thinking] traces>
============================================================
Tokens: N | Est. cost: ~$X.XX
Session saved -- run /codex again to continue this conversation.
```

7. After presenting, note any points where Codex's analysis differs from your own
   understanding. If there is a disagreement, flag it:
   "Note: GodMode/OpenClaw disagrees on X because Y."

---

## Model & Reasoning

**Model:** No model is hardcoded -- codex uses whatever its current default is (the frontier
agentic coding model). This means as OpenAI ships newer models, /codex automatically
uses them. If the user wants a specific model, pass `-m` through to codex.

**Reasoning effort** varies by mode -- use the right level for each task:
- **Review mode:** `high` -- thorough but not slow. Diff review benefits from depth but doesn't need maximum compute.
- **Challenge (adversarial) mode:** `xhigh` -- maximum reasoning power. When trying to break code, you want the model thinking as hard as possible.
- **Consult mode:** `high` -- good balance of depth and speed for conversations.

**Web search:** All codex commands use `--enable web_search_cached` so Codex can look up
docs and APIs during review. This is OpenAI's cached index -- fast, no extra cost.

If the user specifies a model (e.g., `/codex review -m gpt-5.1-codex-max`
or `/codex challenge -m gpt-5.2`), pass the `-m` flag through to codex.

---

## Cost Estimation

Parse token count from stderr. Codex prints `tokens used
N` to stderr.

Display as: `Tokens: N`

If token count is not available, display: `Tokens: unknown`

---

## Error Handling

- **Binary not found:** Detected in Step 1. Stop with install instructions.
- **Auth error:** Codex prints an auth error to stderr. Surface the error:
  "Codex authentication failed. Run `codex login` in your terminal to authenticate via ChatGPT."
- **Timeout:** If the exec call times out (5 min), tell the user:
  "Codex timed out after 5 minutes. The diff may be too large or the API may be slow. Try again or use a smaller scope."
- **Empty response:** If no output is captured, tell the user:
  "Codex returned no response. Check stderr for errors."
- **Session resume failure:** If resume fails, delete the session file and start fresh.

---

## Important Rules

- **Never modify files.** This skill is read-only. Codex runs in read-only sandbox mode.
- **Present output verbatim.** Do not truncate, summarize, or editorialize Codex's output
  before showing it. Show it in full inside the CODEX SAYS block.
- **Add synthesis after, not instead of.** Any GodMode/OpenClaw commentary comes after the full output.
- **5-minute timeout** on all exec calls to codex.
- **No double-reviewing.** If the user already ran a GodMode review, Codex provides a second
  independent opinion. Do not re-run GodMode/OpenClaw's own review.
- **External dependency:** The `codex` CLI binary must be installed by the user. This skill
  does not install it automatically.

## Completion Status Protocol

When completing the codex workflow, report status using one of:
- **DONE** -- All steps completed successfully. Evidence provided for each claim.
- **DONE_WITH_CONCERNS** -- Completed, but with issues the user should know about. List each concern.
- **BLOCKED** -- Cannot proceed. State what is blocking and what was tried.
- **NEEDS_CONTEXT** -- Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.
- If you have attempted a task 3 times without success, STOP and escalate.
- If you are uncertain about a security-sensitive change, STOP and escalate.
- If the scope of work exceeds what you can verify, STOP and escalate.

Escalation format:
```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```
