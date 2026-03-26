# First Principles Analysis

## Description
Break complex problems down to fundamental truths, then rebuild solutions from the ground up.

## Trigger
User asks for a decision, strategy advice, "how should I approach", "what's the best way to", or any complex problem with multiple variables.

## Process
1. **Identify constraints** — Ask: What's fixed? Budget, timeline, team size, tech stack, regulations. List them explicitly.
2. **Find root cause** — Strip away assumptions. Ask "why" until you hit bedrock. Most problems are symptoms of deeper issues.
3. **Generate 3 solutions from different angles:**
   - The fast/cheap path (minimize resources)
   - The thorough/expensive path (maximize quality)
   - The lateral path (reframe the problem entirely)
4. **Attack each solution** — For every option, name the top 2 risks and the conditions under which it fails.
5. **Check memory for precedent:**
   - `secondBrain.search` for similar past decisions
   - Surface what worked/failed before
6. **Recommend one path** — State the recommendation, the key assumption it depends on, and the trigger to reconsider.

## Output
- Constraints list (3-5 bullets)
- Root cause (1 sentence)
- 3 options table (option / upside / risk / timeline)
- Recommendation with confidence level (high/medium/low)
- Revisit trigger: "Reconsider if X changes"

## Examples
1. "Should I hire a contractor or build in-house?" — Constraints: budget $5k/mo, need it in 2 weeks, core product feature. Root cause: speed vs. ownership tradeoff. Recommend contractor with handoff plan.
2. "How do I fix my funnel conversion?" — Constraints: 2% conversion, $50 CAC, landing page + email sequence. Root cause: messaging mismatch (traffic intent vs. page promise). Three angles: copy rewrite, audience retargeting, offer restructure.

## Failure Modes
- **Too abstract** — If the user gives a vague problem, ask for specifics before running the framework. Don't first-principles a grocery list.
- **Analysis paralysis** — Cap at 3 options. More than that means the framing is wrong.
- **Missing context** — Always check `secondBrain.search` first. The user may have already decided this and forgotten.
- **Overconfidence** — If constraints are uncertain, say so. "Medium confidence — this depends on X being true."
