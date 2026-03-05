---
name: Monthly Bill Review
trigger: cron
schedule: monthly 1st 9am
persona: finance-admin
taskType: analysis
priority: normal
---
Review the past month's expenses and financial activity.

1. Gather all available financial data for the previous month
2. Categorize expenses: subscriptions, utilities, one-time purchases, business, personal
3. Flag:
   - Any charges significantly higher than usual
   - New subscriptions or recurring charges that started this month
   - Duplicate or suspicious charges
   - Subscriptions the user may have forgotten about
4. Compare total spend against the previous month and 3-month average
5. Summarize in a clean table with categories, amounts, and month-over-month change
6. End with action items: things to cancel, dispute, or investigate
