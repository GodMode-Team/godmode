/**
 * GodMode License Validation API — Cloudflare Workers Version
 *
 * Deploy with Wrangler:
 *   wrangler deploy --name godmode-license-api site/api/v1/license/validate-worker.js
 *
 * Or via the Cloudflare dashboard: paste this file as a Worker script.
 *
 * Request:  POST /api/v1/license/validate  { "key": "GM-..." }
 * Response: { "valid": true/false, "tier": "developer"|"beta"|"team"|"pro" }
 *
 * For production rate limiting, bind a Cloudflare KV namespace or use
 * the Rate Limiting API in the Cloudflare dashboard.
 */

// ── CORS ────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function corsResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

// ── Rate limiting (in-memory, per-isolate) ──────────────────────────
// Cloudflare Workers isolates are ephemeral, so this is best-effort.
// For durable rate limiting, use Cloudflare's built-in Rate Limiting
// rules or bind a KV/Durable Object for shared state.

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry = { windowStart: now, count: 0 };
    rateLimitMap.set(ip, entry);
  }

  entry.count++;

  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  const resetAt = Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS) / 1000);

  return {
    limited: entry.count > RATE_LIMIT_MAX,
    headers: {
      "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(resetAt),
    },
  };
}

// ── Key validation ──────────────────────────────────────────────────

/**
 * Validate a license key and determine its tier.
 *
 * Prefix rules:
 *   GM-DEV-*      -> developer (dev/internal)
 *   GM-INTERNAL   -> developer (exact match)
 *   GM-BETA-*     -> beta (early access)
 *   GM-TEAM-*     -> team (team licenses)
 *   GM-PRO-*      -> pro (paid individual — TODO: database lookup)
 *
 * @param {string} key
 * @returns {{ valid: boolean, tier?: string, reason?: string }}
 */
function validateKey(key) {
  if (!key || typeof key !== "string") {
    return { valid: false, reason: "Missing or invalid key" };
  }

  const k = key.trim().toUpperCase();

  if (k.startsWith("GM-DEV-") || k === "GM-INTERNAL") {
    return { valid: true, tier: "developer" };
  }

  if (k.startsWith("GM-BETA-")) {
    return { valid: true, tier: "beta" };
  }

  if (k.startsWith("GM-TEAM-")) {
    return { valid: true, tier: "team" };
  }

  // Pro keys — TODO: look up in KV or D1 database
  // Production enhancement: bind a KV namespace (e.g., LICENSE_KEYS) and do:
  //   const record = await env.LICENSE_KEYS.get(k, { type: "json" });
  //   if (!record) return { valid: false, reason: "Unknown pro key" };
  //   if (record.revoked) return { valid: false, reason: "Key revoked" };
  //   if (record.expiresAt && Date.now() > record.expiresAt) return { valid: false, reason: "Key expired" };
  //   return { valid: true, tier: "pro" };
  if (k.startsWith("GM-PRO-")) {
    if (k.length >= 12) {
      return { valid: true, tier: "pro" };
    }
    return { valid: false, reason: "Invalid pro key format" };
  }

  return { valid: false, reason: "Unrecognized key prefix" };
}

// ── Logging ─────────────────────────────────────────────────────────

function logAttempt(ip, key, result) {
  const masked =
    key && key.length > 8
      ? key.slice(0, key.indexOf("-", 3) + 1) + "***" + key.slice(-4)
      : "***";

  console.log(
    JSON.stringify({
      event: "license-validate",
      timestamp: new Date().toISOString(),
      ip,
      key: masked,
      valid: result.valid,
      tier: result.tier || null,
    }),
  );
}

// ── Worker fetch handler ────────────────────────────────────────────

export default {
  /**
   * @param {Request} request
   * @param {Record<string, any>} env - Bindings (KV, secrets, etc.)
   * @param {ExecutionContext} ctx
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only POST
    if (request.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, 405);
    }

    // Client IP
    const ip = request.headers.get("cf-connecting-ip") || "unknown";

    // Rate limit
    const rateLimit = checkRateLimit(ip);
    if (rateLimit.limited) {
      return corsResponse({ error: "Too many requests" }, 429, {
        ...rateLimit.headers,
        "Retry-After": String(
          Math.max(1, Number(rateLimit.headers["X-RateLimit-Reset"]) - Math.floor(Date.now() / 1000)),
        ),
      });
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse({ error: "Invalid JSON body" }, 400, rateLimit.headers);
    }

    // Validate
    const result = validateKey(body.key);
    logAttempt(ip, body.key || "", result);

    // Build response matching plugin expectations: { valid, tier }
    const responseBody = { valid: result.valid };
    if (result.valid && result.tier) {
      responseBody.tier = result.tier;
    }

    return corsResponse(responseBody, 200, rateLimit.headers);
  },
};
