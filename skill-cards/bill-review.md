---
domain: bill-review
triggers: bills, expenses, spending, subscriptions, charges, financial review, bill review, monthly expenses, recurring charges, budget, money
tools: queue_add
name: godmode-bill-review
version: 1.0.0
description: "Reviews bills, subscriptions, and recurring charges for savings opportunities"
keywords: ["bills", "expenses", "spending", "subscriptions", "charges"]
author: godmode-team
clawhub: true
---

# Bill Review — Monthly Expense Analysis

When the user asks about expenses, subscriptions, or spending — route to the monthly-bill-review skill.

## How to Use
1. Use `queue_add` with skill `monthly-bill-review`, taskType `analysis`, persona `finance-admin`
2. The skill reviews past month: categorizes expenses, flags anomalies, compares trends
3. Output: categorized table + month-over-month comparison + action items (cancel, dispute, investigate)

## When to Trigger
- "Review my bills"
- "Any weird charges this month?"
- "What am I spending on subscriptions?"
- Runs automatically on the 1st of each month via cron
