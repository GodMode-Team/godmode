# GodMode Security Architecture

This document describes the security model, threat mitigations, and user-facing guidance for the GodMode plugin.

## Threat Model

GodMode runs as a local-first plugin inside the OpenClaw gateway. The primary attack surface is:

| Vector | Risk | Mitigation |
|--------|------|------------|
| **Prompt injection** | Malicious content in vault files, agent outputs, or user messages could hijack ally behavior | 5-category prompt shield (regex detection in `safety-gates.ts`) |
| **Credential leakage** | API keys, tokens, or passwords exposed in agent output or file reads | Output shield scans all responses; config shield blocks tool access to sensitive paths |
| **Path traversal** | Manipulated file paths escape allowed directories | `isAllowedPath()` validation + symlink resolution on all file I/O |
| **XSS via rendered content** | Dashboard HTML or markdown could inject scripts | DOMPurify allowlist sanitization; CSS scoping with dangerous construct removal |
| **Unauthorized file access** | Agent tools reading sensitive system files (`.ssh/`, `.gnupg/`, `.env`) | Config shield pattern matching on file-read tool calls |
| **Session privacy** | Sensitive conversations captured in vault, awareness snapshot, or daily brief | Private session mode blocks all persistence |

## Security Layers

### 1. Safety Gates (`src/hooks/safety-gates.ts`)

Four active gates run on every turn:

- **Prompt Shield** (`before_prompt_build`): Detects injection patterns across 5 categories — role override, instruction override, context manipulation, data exfiltration, and hidden instructions. Strips or warns on match.

- **Output Shield** (`after_response`): Scans assistant output for leaked credentials — API keys (Anthropic, OpenAI, XAI, AWS), JWTs, bearer tokens, private keys, and env file contents. Blocks output and warns if detected.

- **Config Shield** (`before_tool_call`): Blocks file-read tool calls targeting sensitive paths — `.ssh/`, `.gnupg/`, `.openclaw/`, `godmode/.env`, auth tokens, Docker configs. Intercepts commands that could read these via `cat`, `grep`, `python`, `curl`, etc.

- **Context Pressure** (`before_prompt_build`): Monitors context window usage and warns when approaching limits.

### 2. File I/O Security (`src/lib/secure-fs.ts`)

All GodMode data files use secure defaults:

- **Files**: `0o600` (owner read/write only)
- **Directories**: `0o700` (owner read/write/execute only)
- **Atomic writes**: `.env` modifications use temp-file + rename to prevent corruption
- **Path validation**: `isAllowedPath()` in `vault-paths.ts` validates all paths before I/O
- **Symlink resolution**: `fs.realpath()` prevents symlink-based escapes
- **Null byte rejection**: File paths containing `\0` are rejected

### 3. HTML/CSS Sanitization (`ui/src/ui/markdown.ts`)

All rendered content passes through DOMPurify with strict allowlists:

- **Tags**: Allowlist of safe HTML elements (no `<script>`, `<iframe>`, `<object>`, `<base>`)
- **Attributes**: Allowlist of safe attributes (no event handlers)
- **URIs**: Protocol allowlist (`https:`, `http:`, `mailto:`, `file:`)
- **Inputs**: Only `<input type="checkbox">` permitted (prevents fake form fields)
- **CSS**: Dashboard styles are scoped to `.dashboard-render` with dangerous constructs stripped:
  - `expression()` (IE script execution)
  - `behavior:` (IE HTC)
  - `-moz-binding:` (Firefox XBL)
  - `@import` (external resource loading)

### 4. Private Session Mode

Private sessions prevent all persistence:

- **Backend** (`src/lib/private-session.ts`): Server-side tracking with 24h auto-expiry
- **Frontend** (`ui/src/ui/app.ts`): Client-side session management with localStorage persistence
- **Blocked operations**: Vault capture, awareness snapshot inclusion, auto-titling, daily brief inclusion
- **Auto-cleanup**: Heartbeat tick cleans expired sessions; UI timer destroys after 24h

### 5. Authentication & Webhook Security

- **Gateway auth**: JWT RS256 with offline validation (`src/lib/auth-client.ts`)
- **Fathom webhook**: HMAC-SHA256 signature verification required; timing-safe comparison; unauthenticated payloads rejected
- **Env files**: Stored with `0o600` permissions in `~/.openclaw/.env`

## Data Storage

| Data | Location | Permissions |
|------|----------|-------------|
| API keys | `~/.openclaw/.env` | `0o600` |
| Auth tokens | `~/.openclaw/godmode-auth.json` | `0o600` |
| Plugin state | `~/godmode/data/*.json` | `0o600` |
| Memory files | `~/godmode/memory/` | `0o600` |
| Vault (Obsidian) | `~/Documents/VAULT/` or `OBSIDIAN_VAULT_PATH` | User-controlled |
| Support logs | `~/godmode/support-logs/` | `0o600` |

### Encryption at Rest

GodMode relies on OS-level full-disk encryption (FileVault on macOS, LUKS on Linux). No application-level encryption is implemented — this is by design to keep the architecture simple and avoid a false sense of security from rolling custom crypto.

## User Security Guide

### API Key Safety

- Store API keys in `~/.openclaw/.env`, never in vault files or chat
- The output shield automatically blocks accidental key exposure in responses
- If you see a "Credential leak blocked" warning, rotate the exposed key immediately

### Private Sessions

- Toggle the lock icon in the chat compose area to start a private session
- Private sessions auto-destruct after 24 hours or when manually ended
- Nothing from a private session is captured to your vault, daily brief, or awareness snapshot

### Vault Security

- Your Obsidian vault is never sent to external services (local-first)
- Vault-capture pipelines only copy data from GodMode's local state into your vault
- The config shield prevents agent tools from reading sensitive files

### Agent Delegation Safety

- **Known risk:** Agent sub-processes run with `--dangerously-skip-permissions` (Claude CLI) / `--dangerously-bypass-approvals-and-sandbox` (Codex). This is inherent to detached CLI agent execution — they cannot answer interactive permission prompts. Mitigation:
  - Queue items require user approval before execution
  - Safety gates (`before_tool_call`) block dangerous exec patterns
  - ClawdStrike egress policy limits network access
  - Agents run with minimal env vars (no API keys forwarded)
  - Trust scores track agent quality; low scores trigger review
- Review queue items before approval — the ally scopes tasks, you approve execution
- **Toolkit tokens:** Agents receive short-lived Bearer tokens (45-min TTL) for the toolkit API. Tokens are workspace-scoped, rate-limited (60 req/min), and automatically revoked on agent completion.

### Queue Prompt Sanitization

- User-provided queue item fields (title, description, URL, handoff) are sanitized before interpolation into agent prompts
- Strips: XML injection tags (`<system>`, `<instructions>`), fake authority headers (`## System`, `## Admin`), classic override phrases (`ignore previous instructions`, `you are now`)
- Sanitization happens at prompt-build time — stored queue data retains the original text
- Sanitization events are logged to the audit trail

### Webhook Security

- Webhook endpoints (`/godmode/webhooks/*`) require HMAC-SHA256 signature verification
- Set `GODMODE_WEBHOOK_SECRET` env var — auto-generated on first boot if not set
- Required headers:
  - `X-Webhook-Signature: sha256=<hmac hex of timestamp.body>`
  - `X-Webhook-Timestamp: <unix seconds>`
- HMAC is computed over `timestamp + "." + body` (binds timestamp to signature)
- Requests older than 5 minutes are rejected (replay protection)
- Duplicate signatures are rejected (nonce tracking)
- Signatures use timing-safe comparison to prevent timing attacks

### Rate Limiting

- All HTTP endpoints are rate-limited to 60 requests per minute per IP
- Toolkit server has per-token rate limiting (60 req/min per agent)

### Audit Trail

- Security events logged to `~/godmode/data/audit-log.jsonl` (append-only JSONL)
- Events tracked: agent spawns/completions/failures, webhook accepts/rejects, rate limit hits, prompt sanitization
- Designed for post-incident review — never blocks operations

### Auto-Generated Secrets

- `GODMODE_WEBHOOK_SECRET` and `GOG_KEYRING_PASSWORD` are auto-generated on first gateway boot
- Saved to `~/godmode/.env` automatically
- No hardcoded fallbacks — missing secrets cause graceful failures, not insecure defaults

### Updating

- Run `godmode.update.check` to check for updates
- Pre-update checkpoints are saved automatically
- Post-update health checks verify the installation
