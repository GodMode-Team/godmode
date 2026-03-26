# GodMode — OpenClaw Configuration Guide

Recommended `openclaw.json` settings for new GodMode users.
Copy the sections you need into `~/.openclaw/openclaw.json`.

---

## 1. Gateway (required)

```jsonc
{
  "gateway": {
    "mode": "local",           // REQUIRED — gates startup
    "port": 18789,
    "bind": "loopback",        // local-only; use "lan" if accessing from another device
    "controlUi": { "enabled": true }
  }
}
```

**Why:** GodMode runs through the local gateway. Without `mode: "local"` the gateway refuses to start.

### Tailscale Remote Access (VPS / headless)

If you access GodMode through Tailscale Serve, use this config instead:

```jsonc
{
  "gateway": {
    "mode": "local",
    "bind": "loopback",                         // Tailscale Serve proxies from localhost
    "trustedProxies": ["127.0.0.1/32"],          // Trust headers from Tailscale Serve
    "tailscale": { "mode": "serve" },
    "auth": {
      "mode": "trusted-proxy",                   // Tailscale identity = auth
      "allowTailscale": true,
      "trustedProxy": {
        "userHeader": "tailscale-user-login",
        "requiredHeaders": ["tailscale-user-login"]
      }
    },
    "controlUi": {
      "enabled": true,
      "allowedOrigins": ["https://YOUR-HOST.tailnet.ts.net"],
      "dangerouslyDisableDeviceAuth": true       // Tailscale IS the device auth
    }
  }
}
```

Then activate Tailscale Serve and enable linger so the gateway survives SSH disconnect:

```bash
tailscale serve --bg 18789
sudo loginctl enable-linger $(whoami)
openclaw gateway install --force
openclaw gateway start
```

The install script (`scripts/install.sh`) detects Tailscale automatically and configures all of this.

---

## 2. Model Selection

```jsonc
{
  "agents": {
    "defaults": {
      "model": "claude-opus-4-6",
      "thinkingDefault": "low",    // off | minimal | low | medium | high | xhigh
      "contextTokens": 200000
    }
  }
}
```

If you use a custom model provider (self-hosted, Bedrock, etc.):

```jsonc
{
  "models": {
    "providers": {
      "anthropic": {
        "baseUrl": "https://api.anthropic.com",   // NO trailing /v1
        "models": [
          { "id": "claude-opus-4-6", "contextWindow": 200000, "maxTokens": 128000 }
        ]
      }
    }
  }
}
```

> **Critical:** `baseUrl` must NOT include `/v1` for Anthropic — the runner appends it.

---

## 3. Memory & Learning

```jsonc
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "sources": ["memory", "sessions"],
        "provider": "openai",       // or "gemini", "local", "voyage"
        "experimental": {
          "sessionMemory": true,    // index past conversations
          "dedup": true,            // deduplicate similar memories
          "sourceLinks": true       // attach provenance to recalls
        },
        "graph": { "enabled": true } // entity-relationship tracking
      }
    }
  }
}
```

**Why:** Memory is GodMode's compounding advantage. Session memory means every conversation makes the agent smarter. Graph extraction tracks people, projects, and preferences.

---

## 4. Context Management

```jsonc
{
  "agents": {
    "defaults": {
      "compaction": {
        "mode": "safeguard",
        "reserveTokens": 20000,
        "keepRecentTokens": 20000,
        "reserveTokensFloor": 20000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 150000
        }
      }
    }
  }
}
```

**Why:** With ~150K of system prompt, you get ~50K of conversation space. Pre-compaction memory flush writes insights to permanent storage before context is compressed. `safeguard` mode is safer for complex reasoning.

---

## 5. Heartbeat (Morning Brief)

```jsonc
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "enabled": true,
        "every": "30m",
        "activeHours": { "start": "08:00", "end": "22:00" }
      }
    }
  }
}
```

**Why:** The heartbeat powers the daily brief — reading HEARTBEAT.md, checking tasks, and delivering the morning set. Active hours prevent late-night pings.

---

## 6. Timezone

```jsonc
{
  "agents": {
    "defaults": {
      "userTimezone": "America/Chicago",  // your IANA timezone
      "timeFormat": "12"                  // 12 or 24
    }
  }
}
```

**Why:** Correct timezone is essential for morning brief timing, session resets, and daily note file naming.

---

## 7. Tools & Capabilities

```jsonc
{
  "tools": {
    "profile": "full",
    "web": {
      "search": { "provider": "brave" },
      "fetch": { "enabled": true }
    },
    "media": { "enabled": true },
    "exec": {
      "security": "allowlist",
      "ask": "on-miss",
      "safeBins": ["git", "npm", "node", "pnpm", "bun"]
    },
    "loopDetection": { "enabled": true }
  }
}
```

**Why:** `full` profile unlocks all tools. `allowlist` + `ask: "on-miss"` lets the agent run common dev tools but asks before anything unfamiliar. Loop detection prevents stuck tool-call loops.

---

## 8. Session Management

```jsonc
{
  "session": {
    "scope": "per-sender",
    "reset": { "mode": "idle", "idleMinutes": 120 },
    "maintenance": {
      "pruneAfter": "30d",
      "maxDiskBytes": 104857600
    }
  }
}
```

**Why:** Idle reset clears context after 2 hours of inactivity (fresh start). Maintenance prevents session logs from growing unbounded (100 MB cap).

---

## 9. Plugins

```jsonc
{
  "plugins": {
    "enabled": true,
    "entries": {
      "godmode": {
        "enabled": true,
        "config": {
          // GodMode-specific settings live here
        }
      }
    }
  }
}
```

**Why:** The GodMode plugin must be enabled. Per-plugin config lives under `plugins.entries.godmode.config`.

---

## 10. Cron (optional — advanced)

```jsonc
{
  "cron": {
    "enabled": true,
    "maxConcurrentRuns": 2,
    "sessionRetention": "7d"
  }
}
```

**Why:** Enables scheduled tasks — evening journal capture, weekly reviews, automated backups. Keep retention short to avoid log bloat.

---

## 11. Streaming & UX (optional)

```jsonc
{
  "agents": {
    "defaults": {
      "blockStreamingDefault": "on",
      "humanDelay": { "mode": "natural" },
      "typingMode": "thinking"
    }
  }
}
```

**Why:** Block streaming delivers messages in readable chunks instead of all-at-once walls. Natural delay simulates typing for a more human feel.

---

## Quick-Start Template

Minimal config to get GodMode running:

```jsonc
{
  "gateway": {
    "mode": "local",
    "bind": "loopback",
    "controlUi": { "enabled": true }
  },
  "agents": {
    "defaults": {
      "model": "claude-opus-4-6",
      "thinkingDefault": "low",
      "userTimezone": "America/Chicago",
      "memorySearch": { "enabled": true, "sources": ["memory", "sessions"] },
      "compaction": {
        "mode": "safeguard",
        "reserveTokens": 20000,
        "keepRecentTokens": 20000,
        "memoryFlush": { "enabled": true }
      },
      "heartbeat": {
        "enabled": true,
        "every": "30m",
        "activeHours": { "start": "08:00", "end": "22:00" }
      }
    }
  },
  "tools": {
    "profile": "full",
    "web": { "search": { "provider": "brave" } },
    "exec": { "security": "allowlist", "ask": "on-miss" },
    "loopDetection": { "enabled": true }
  },
  "plugins": {
    "enabled": true,
    "entries": { "godmode": { "enabled": true } }
  }
}
```

---

## What NOT to Change

| Setting | Leave as default | Why |
|---------|-----------------|-----|
| `gateway.mode` | `"local"` | Startup gate — anything else blocks the gateway |
| `session.scope` | `"per-sender"` | Multi-user isolation |
| `tools.exec.security` | `"allowlist"` | Full exec is dangerous on personal machines |
| `compaction.reserveTokensFloor` | `20000` | Lower values risk losing context mid-thought |

---

## Troubleshooting

- **Gateway won't start:** Verify `gateway.mode` is `"local"` in `~/.openclaw/openclaw.json`.
- **Agent doesn't remember:** Check `memorySearch.enabled` is `true` and a provider is configured.
- **Morning brief doesn't fire:** Verify `heartbeat.enabled`, `activeHours`, and `userTimezone`.
- **Context feels short:** Increase `compaction.reserveTokens` or enable `memoryFlush`.
- **Unknown model error:** Check `models.providers` — `baseUrl` must NOT include `/v1`.
- **"Unrecognized key" error:** Zod schemas are strict — double-check key names match exactly.
- **Run `openclaw doctor`** for a comprehensive health check.
