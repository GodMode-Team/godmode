/**
 * GodMode License Validation API
 *
 * Serverless function compatible with Vercel, Netlify, and similar platforms.
 * Deployed at: POST /api/v1/license/validate
 *
 * Request:  { "key": "GM-..." }
 * Response: { "valid": true/false, "tier": "developer"|"beta"|"team"|"pro" }
 *
 * The GodMode plugin (index.ts) calls this endpoint with:
 *   - POST method
 *   - Content-Type: application/json
 *   - Body: { "key": "<license-key>" }
 *   - 5-second timeout (AbortSignal.timeout)
 *   - Expects: { "valid": boolean, "tier"?: string }
 */

// ── CORS configuration ──────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

// ── Rate limiting (in-memory, per-instance) ─────────────────────────
// For production, replace with Redis/KV store shared across instances.

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // per IP per window

function getRateLimitInfo(ip) {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry = { windowStart: now, count: 0 };
    rateLimitMap.set(ip, entry);
  }

  entry.count++;

  return {
    limited: entry.count > RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count),
    resetAt: entry.windowStart + RATE_LIMIT_WINDOW_MS,
  };
}

function rateLimitHeaders(info) {
  return {
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
    "X-RateLimit-Remaining": String(info.remaining),
    "X-RateLimit-Reset": String(Math.ceil(info.resetAt / 1000)),
  };
}

// ── Key validation logic ────────────────────────────────────────────

/**
 * Validate a license key and return its tier.
 *
 * Key format prefixes:
 *   GM-DEV-*      -> developer tier (dev/internal use)
 *   GM-INTERNAL   -> developer tier (exact match)
 *   GM-BETA-*     -> beta tier (early access users)
 *   GM-TEAM-*     -> team tier (team licenses)
 *   GM-PRO-*      -> pro tier (paid individual licenses)
 *
 * @param {string} key - The license key to validate
 * @returns {{ valid: boolean, tier?: string, reason?: string }}
 */
function validateKey(key) {
  if (!key || typeof key !== "string") {
    return { valid: false, reason: "Missing or invalid key" };
  }

  const trimmed = key.trim().toUpperCase();

  // Developer / internal keys
  if (trimmed.startsWith("GM-DEV-") || trimmed === "GM-INTERNAL") {
    return { valid: true, tier: "developer" };
  }

  // Beta early-access keys
  if (trimmed.startsWith("GM-BETA-")) {
    return { valid: true, tier: "beta" };
  }

  // Team keys
  if (trimmed.startsWith("GM-TEAM-")) {
    return { valid: true, tier: "team" };
  }

  // Pro keys — TODO: validate against database/Stripe
  // For now, accept any GM-PRO-* key with a minimum length.
  // In production, this block should:
  //   1. Look up the key in a database (e.g., Stripe metadata, KV store)
  //   2. Check expiration, usage limits, revocation status
  //   3. Return the specific plan details
  if (trimmed.startsWith("GM-PRO-")) {
    if (trimmed.length >= 12) {
      return { valid: true, tier: "pro" };
    }
    return { valid: false, reason: "Invalid pro key format" };
  }

  return { valid: false, reason: "Unrecognized key prefix" };
}

// ── Logging ─────────────────────────────────────────────────────────

function logAttempt(ip, key, result) {
  // Mask the key for privacy: show prefix + last 4 chars
  const masked =
    key.length > 8
      ? key.slice(0, key.indexOf("-", 3) + 1) + "***" + key.slice(-4)
      : "***";

  const entry = {
    timestamp: new Date().toISOString(),
    ip: ip || "unknown",
    key: masked,
    valid: result.valid,
    tier: result.tier || null,
  };

  // In serverless environments, console.log goes to the platform's log drain
  console.log("[license-validate]", JSON.stringify(entry));
}

// ── Shared validation logic ─────────────────────────────────────────

function processValidation(key, ip) {
  const rateInfo = getRateLimitInfo(ip);
  const rlHeaders = rateLimitHeaders(rateInfo);

  if (rateInfo.limited) {
    return {
      status: 429,
      headers: {
        ...rlHeaders,
        "Retry-After": String(
          Math.ceil((rateInfo.resetAt - Date.now()) / 1000),
        ),
      },
      body: { error: "Too many requests" },
    };
  }

  const result = validateKey(key);
  logAttempt(ip, key || "", result);

  const responseBody = { valid: result.valid };
  if (result.valid && result.tier) {
    responseBody.tier = result.tier;
  }

  return {
    status: 200,
    headers: rlHeaders,
    body: responseBody,
  };
}

// ── Vercel handler (default export) ─────────────────────────────────
// Vercel serverless functions use the Node.js (req, res) signature.

/**
 * @param {import('http').IncomingMessage & { body?: any }} req
 * @param {import('http').ServerResponse} res
 */
export default async function vercelHandler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // Only accept POST
  if (req.method !== "POST") {
    res.writeHead(405, {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  // Extract client IP
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown";

  // Parse body — Vercel may pre-parse it
  let body;
  try {
    if (typeof req.body === "object" && req.body !== null) {
      body = req.body;
    } else if (typeof req.body === "string") {
      body = JSON.parse(req.body);
    } else {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
    }
  } catch {
    res.writeHead(400, {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: "Invalid JSON body" }));
    return;
  }

  const outcome = processValidation(body.key, ip);

  res.writeHead(outcome.status, {
    ...CORS_HEADERS,
    ...outcome.headers,
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(outcome.body));
}

// ── Netlify Functions handler (named export) ────────────────────────
// Netlify Functions use an (event, context) signature and return an object.

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const ip =
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    event.headers["x-real-ip"] ||
    "unknown";

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const outcome = processValidation(body.key, ip);

  return {
    statusCode: outcome.status,
    headers: {
      ...CORS_HEADERS,
      ...outcome.headers,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(outcome.body),
  };
}
