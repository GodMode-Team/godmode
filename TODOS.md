# TODOs

## Diagnose Paperclip sessionKey lookup failure root cause

After diagnostic logging ships (Task 3 of massive-bug-dump plan), monitor gateway logs to find WHY `listProjects()` fails to match Paperclip `issueId` to a stored project. The reverse lookup at `paperclip-webhook.ts:141` searches `p.issues.queueItemId === issueId`. Possible causes: projects-state gets cleared between delegation and completion, issueId format differs between Paperclip API and local storage, or the project was never saved during delegation.

**Depends on:** Tasks 3+4 from `docs/plans/2026-03-24-massive-bug-dump-plan.md` shipping first.

## Add workspace data health check

Backend diagnostic that verifies workspace directories exist and feed/connections files are readable before serving RPC responses. The RPC timeout prevents the UI hang, but the root cause is likely missing or corrupted workspace data directories. A health check in `workspace-feed.ts` and `workspace-connections.ts` handlers would surface "workspace path doesn't exist" instead of a silent timeout.

**Depends on:** Nothing — can be done independently.
