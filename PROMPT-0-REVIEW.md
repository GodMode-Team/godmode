Read these files in order:
1. V2-EXECUTION-SPEC.md — the architectural spec
2. V2-MASTER-PROMPTS.md — the 7 execution prompts you'll run sequentially

Then read index.ts to understand the plugin's registration pattern.

## YOUR TASK: Review the 7 prompts for correctness and completeness.

For each prompt, check:
1. Are the files listed for deletion actually real? (ls/find to verify)
2. Are there files that SHOULD be deleted but aren't listed?
3. Are there files listed for deletion that are actually imported by files we're keeping? (grep to verify)
4. Are there any dependency chains that would break? (A imports B which imports C — deleting B breaks A)
5. Are the commit messages accurate?

Also check:
- Is the order correct? Does any prompt depend on output from a later prompt?
- Are there contradictions between prompts? (e.g., Prompt 1 deletes X but Prompt 5 references X)
- Are there missing prompts? Is there cleanup work needed that no prompt covers?

## OUTPUT:
Write a brief report with:
- ✅ Prompt N: looks good (or)
- ⚠️ Prompt N: issue — {description}
- 🔴 Prompt N: blocker — {description}

Then list any files you'd add to or remove from the deletion lists.

If you find issues, edit V2-MASTER-PROMPTS.md directly to fix them.

Do NOT execute any of the prompts. Review only.
