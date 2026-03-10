---
domain: x-twitter
triggers: twitter, tweet, tweets, tweeted, x.com, timeline, trending, what's happening, social, post, thread, bookmark, bookmarks, saying, discussions, draft a post, draft a tweet
tools: x_read, x.search, x.readTweet, x.readThread, x.userTimeline, x.bookmarks
---
## When to Use
- User asks about tweets, threads, Twitter/X content
- Searching for what people are saying about a topic
- Reading a specific tweet or thread URL
- Checking bookmarks or someone's timeline

## How to Use
- `x_read` tool — versatile: read tweets, threads, articles, search, bookmarks
  - Actions: search, readTweet, readThread, userTimeline, readArticle, bookmarks
- `x.search` method — { query, maxResults? } — search X for topics
- `x.readTweet` — { tweetId } — read a single tweet
- `x.readThread` — { tweetId } — read a full thread
- `x.userTimeline` — { username, maxResults? } — recent posts from a user
- `x.bookmarks` — user's saved tweets

## Gotchas
- Requires XAI_API_KEY in ~/.openclaw/.env — if missing, check integrations.status
- Uses Grok API (grok-4-1-fast-non-reasoning) under the hood
- Rate limits apply — don't make rapid sequential calls
- Tweet IDs are strings, not numbers
- Some tweets may be protected/unavailable

## Tips
- When user shares an x.com URL, extract the tweet ID and read it automatically
- For research tasks, combine X search with vault search for full context
- Summarize threads concisely — don't dump raw tweet text
