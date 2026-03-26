# GodMode License Validation API

Self-contained license validation endpoint for the GodMode plugin.

## Endpoint

```
POST https://lifeongodmode.com/api/v1/license/validate
```

The URL is hardcoded in `index.ts` at `LICENSE_API_URL`. The plugin calls this on the first RPC invocation and caches the result for 24 hours.

## Request

```http
POST /api/v1/license/validate HTTP/1.1
Content-Type: application/json

{ "key": "GM-PRO-ABCD1234" }
```

| Field | Type   | Required | Description         |
|-------|--------|----------|---------------------|
| `key` | string | yes      | The license key     |

## Response

```json
{ "valid": true, "tier": "pro" }
```

| Field   | Type    | Description                                       |
|---------|---------|---------------------------------------------------|
| `valid` | boolean | Whether the key is accepted                       |
| `tier`  | string  | License tier (only present when `valid` is true)  |

The plugin reads `valid` and `tier` from the response. On failure (non-200, network error), the plugin falls back to a cached validation if one exists.

## Key Prefixes

| Prefix         | Tier        | Validation                              |
|----------------|-------------|-----------------------------------------|
| `GM-DEV-*`     | `developer` | Accepted unconditionally                |
| `GM-INTERNAL`  | `developer` | Exact match, accepted unconditionally   |
| `GM-BETA-*`    | `beta`      | Accepted unconditionally (early access) |
| `GM-TEAM-*`    | `team`      | Accepted unconditionally                |
| `GM-PRO-*`     | `pro`       | Accepted if length >= 12 (placeholder)  |

**Note:** `GM-DEV-*` and `GM-INTERNAL` keys are also short-circuited client-side in the plugin's `isDevKey()` function and never hit the API. The server-side handling exists as a safety net.

## Client Behavior

From `index.ts`:

- **Timeout:** 5 seconds (`AbortSignal.timeout(5000)`)
- **Cache TTL:** 24 hours — the plugin will not call the API again within this window
- **Grace period:** If the server is unreachable but a previous validation exists, the plugin allows continued use
- **Dev key bypass:** `GM-DEV-*` and `GM-INTERNAL` keys skip the API call entirely

## Error Responses

| Status | Body                                      | Meaning                 |
|--------|-------------------------------------------|-------------------------|
| 400    | `{ "error": "Invalid JSON body" }`        | Malformed request       |
| 405    | `{ "error": "Method not allowed" }`       | Not a POST request      |
| 429    | `{ "error": "Too many requests" }`        | Rate limited            |

## Rate Limiting

The API returns standard rate limit headers:

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 29
X-RateLimit-Reset: 1709510460
```

Current defaults: 30 requests per IP per 60-second window. When exceeded, the API returns 429 with a `Retry-After` header.

**In-memory vs. durable:** The included implementation uses in-memory rate limiting, which resets when the function cold-starts. For production:

- **Vercel:** Use Vercel KV or Upstash Redis
- **Cloudflare Workers:** Use the built-in Rate Limiting rules in the dashboard, or bind a KV namespace
- **Self-hosted:** Use Redis or an in-process store with a process manager that maintains uptime

## Adding Production Key Validation

The current implementation accepts any key matching the prefix patterns. To add real validation:

### 1. Database Lookup (Recommended)

Replace the `GM-PRO-*` branch in `validateKey()` with a database check:

```js
// Cloudflare Workers with KV
if (k.startsWith("GM-PRO-")) {
  const record = await env.LICENSE_KEYS.get(k, { type: "json" });
  if (!record) return { valid: false, reason: "Unknown key" };
  if (record.revoked) return { valid: false, reason: "Key revoked" };
  if (record.expiresAt && Date.now() > record.expiresAt) {
    return { valid: false, reason: "Key expired" };
  }
  return { valid: true, tier: record.tier || "pro" };
}
```

### 2. Stripe Integration

After a Stripe checkout, create a license key and store it:

```js
// In your Stripe webhook handler
const key = `GM-PRO-${crypto.randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`;
await db.put(key, JSON.stringify({
  tier: "pro",
  stripeCustomerId: event.data.object.customer,
  createdAt: Date.now(),
  expiresAt: null,   // or subscription end date
  revoked: false,
}));
```

### 3. Key Record Schema

```ts
interface LicenseRecord {
  tier: "pro" | "team" | "beta";
  createdAt: number;
  expiresAt: number | null;     // null = lifetime
  revoked: boolean;
  stripeCustomerId?: string;    // for Stripe-issued keys
  stripeSubscriptionId?: string;
  email?: string;
  note?: string;                // "Beta tester", "Founding member", etc.
}
```

## CORS

All responses include:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

The API handles OPTIONS preflight requests with a 204 response.

## Deployment

### Vercel

The `validate.js` file exports a default handler compatible with Vercel's serverless functions:

```
site/
  api/
    v1/
      license/
        validate.js    <-- deployed as /api/v1/license/validate
```

Deploy the `site/` directory:

```bash
cd site && vercel --prod
```

Or set the root directory to `site/` in Vercel project settings.

### Cloudflare Workers

Use `validate-worker.js` with Wrangler:

```bash
wrangler deploy site/api/v1/license/validate-worker.js \
  --name godmode-license-api \
  --compatibility-date 2024-01-01
```

Then add a route in the Cloudflare dashboard:

```
lifeongodmode.com/api/v1/license/*  ->  godmode-license-api
```

### Netlify

The `validate.js` file also exports a `handler` function for Netlify Functions. Set `functions.directory` in `netlify.toml`:

```toml
[build]
  functions = "site/api/v1/license"

[[redirects]]
  from = "/api/v1/license/validate"
  to = "/.netlify/functions/validate"
  status = 200
```

### Self-Hosted (Node.js)

Wrap the handler in a minimal HTTP server:

```js
import http from "node:http";
import handler from "./site/api/v1/license/validate.js";

const server = http.createServer(handler);
server.listen(3001, () => {
  console.log("License API running on :3001");
});
```

Or use Express/Fastify and mount `handler` at the route path.

## Logging

Every validation attempt is logged to stdout as JSON:

```json
{
  "timestamp": "2026-03-03T12:00:00.000Z",
  "ip": "203.0.113.42",
  "key": "GM-PRO-***1234",
  "valid": true,
  "tier": "pro"
}
```

Keys are masked in logs: only the prefix and last 4 characters are shown. Platform log drains (Vercel Logs, Cloudflare Logpush, etc.) will capture these automatically.
