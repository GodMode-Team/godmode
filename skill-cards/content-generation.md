---
domain: content-generation
triggers: content, write posts, social media, tweets, blog post, newsletter, content ideas, what should I post, weekly content, twitter posts, x posts
tools: queue_add
name: godmode-content-generation
version: 1.0.0
description: "Generates social media posts, blog content, and newsletters"
keywords: ["content", "write posts", "social media", "tweets", "blog post"]
author: godmode-team
clawhub: true
---

# Content Generation — Weekly Content from Your Activity

When the user wants content created from their recent work and notes — route to the weekly-content skill.

## How to Use
1. Use `queue_add` with skill `weekly-content`, taskType `creative`, persona `content-writer`
2. The skill reviews past 7 days of vault notes, extracts topics and insights
3. Output: 5 social posts + 1 blog outline + 1 newsletter draft — all in the user's voice

## When to Trigger
- "Write me some posts"
- "What should I tweet about this week?"
- "Generate content from my notes"
- Runs automatically weekly Tuesday 9am via cron
