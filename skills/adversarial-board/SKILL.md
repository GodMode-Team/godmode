# Adversarial Board

## Description
Simulate a 5-person board of advisors who stress-test ideas from different angles before you commit.

## Trigger
"Debate this", "what am I missing", "challenge this", "poke holes in", any major decision (hiring, pricing, launches, pivots), or when the user sounds too certain too fast.

## Process
1. **Understand the proposal** — Restate the user's idea in one sentence to confirm alignment.
2. **Run 5 personas sequentially:**
   - **The Skeptic** — What evidence is missing? What's the base rate of this working? Where's the survivorship bias?
   - **The Optimist** — What's the best-case scenario? What tailwinds exist that the user isn't leveraging?
   - **The Operator** — Can this actually be executed? What breaks at scale? What's the hidden operational cost?
   - **The Customer** — Would anyone pay for this? What does the user's actual audience want vs. what's being built?
   - **The Competitor** — If a rival saw this plan, what would they do? What's the moat? How fast can this be copied?
3. **Check context:**
   - `memory_search` for related past decisions or market data
   - `web_search` if the topic needs current market context
4. **Synthesize** — Identify the 2-3 critiques that actually change the calculus (ignore noise).
5. **Recommend** — Proceed / modify / kill, with the specific modifications if applicable.

## Output
- Proposal restated (1 line)
- 5 persona critiques (2-3 sentences each, labeled)
- Synthesis: "The real risks are..." (2-3 bullets)
- Verdict: proceed / modify / kill
- If modify: specific changes recommended

## Examples
1. "I want to launch a $297/mo SaaS next month" — Skeptic questions market validation, Optimist notes the pricing confidence, Operator flags support load, Customer asks about willingness-to-pay research, Competitor identifies 3 alternatives. Verdict: modify — run 10 customer interviews first.
2. "Should I quit my job to go full-time on this?" — Each persona weighs in on runway, traction, opportunity cost, market timing, competitive landscape. Verdict: modify — get to $5k MRR first.

## Failure Modes
- **Personas agree too much** — If all 5 say the same thing, the idea is either obviously good or the framing is too narrow. Push the Skeptic harder.
- **User gets defensive** — This skill is adversarial by design. Remind: "This is stress-testing, not criticism."
- **Low-stakes decisions** — Don't run a 5-persona board for "should I use Tailwind or vanilla CSS." Reserve for decisions with real consequences.
- **Missing market data** — If the Competitor persona can't find real alternatives via `web_search`, flag that the market may not exist yet (which is itself a risk).
