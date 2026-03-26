#!/usr/bin/env node
/**
 * Smoke test for the Agent Toolkit Server.
 *
 * Tests: server start, auth (valid/invalid/missing), rate limiting,
 * /health, /search, /agents/active, checkpoint, and server stop.
 *
 * Usage: npx tsx tests/smoke-toolkit.mjs
 */

import http from "node:http";
import { register } from "node:module";

// Register tsx loader so TS source imports work via dynamic import
try { register("tsx/esm", import.meta.url); } catch { /* tsx not available as loader */ }

const PORT_RANGE = [5000, 5009];
let baseUrl = "";
let testToken = "";
let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${msg}`);
  } else {
    failed++;
    console.log(`  ❌ ${msg}`);
  }
}

async function get(path, token) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, { headers });
  const body = await res.json();
  return { status: res.status, body };
}

async function post(path, data, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  const body = await res.json();
  return { status: res.status, body };
}

async function main() {
  console.log("\n🔧 Agent Toolkit Server — Smoke Test\n");

  // ── 1. Start server ─────────────────────────────────────────
  console.log("1. Starting server...");

  const mod = await import("../src/services/agent-toolkit-server.ts");
  const logger = {
    info: (m) => {},
    warn: (m) => console.log(`  ⚠️  ${m}`),
    error: (m) => console.log(`  🔴 ${m}`),
  };

  const started = await mod.startToolkitServer(logger);
  assert(started, "Server started successfully");
  assert(mod.isToolkitRunning(), "isToolkitRunning() returns true");

  const port = mod.getToolkitPort();
  assert(port >= PORT_RANGE[0] && port <= PORT_RANGE[1], `Port ${port} in range ${PORT_RANGE[0]}-${PORT_RANGE[1]}`);
  baseUrl = `http://127.0.0.1:${port}`;

  // ── 2. Register a test token ────────────────────────────────
  console.log("\n2. Token management...");

  const tokenResult = mod.createAgentToken({
    agentId: "smoke-test-agent",
    workspaceId: "test-workspace",
  });
  assert(tokenResult !== null, "createAgentToken() returns token + baseUrl");
  testToken = tokenResult.token;
  assert(typeof testToken === "string" && testToken.length > 0, "Token is a non-empty string");

  // ── 3. Health (no auth) ─────────────────────────────────────
  console.log("\n3. Health endpoint (no auth)...");

  const health = await get("/health");
  assert(health.status === 200, "GET /health returns 200");
  assert(health.body.status === "ok", "Health status is 'ok'");

  // ── 4. Auth tests ───────────────────────────────────────────
  console.log("\n4. Authentication...");

  const noAuth = await get("/search?query=test");
  assert(noAuth.status === 401, "No token → 401");

  const badAuth = await get("/search?query=test", "invalid-token-abc");
  assert(badAuth.status === 401, "Invalid token → 401");

  const goodAuth = await get("/search?query=test", testToken);
  assert(goodAuth.status === 200 || goodAuth.status === 400, "Valid token → 200 or 400 (not 401)");

  // ── 5. Search endpoint ──────────────────────────────────────
  console.log("\n5. Search endpoint...");

  const searchNoQuery = await get("/search", testToken);
  assert(searchNoQuery.status === 400, "Search without query → 400");

  const search = await get("/search?query=godmode&limit=5", testToken);
  assert(search.status === 200, "Search with query → 200");
  assert(Array.isArray(search.body.results), "Search returns results array");

  // ── 6. Other endpoints ──────────────────────────────────────
  console.log("\n6. Other endpoints...");

  const mem = await get("/memory?query=test", testToken);
  assert(mem.status === 200, "GET /memory → 200 (may be offline)");

  const skills = await get("/skills", testToken);
  assert(skills.status === 200, "GET /skills → 200");

  const awareness = await get("/awareness", testToken);
  assert(awareness.status === 200, "GET /awareness → 200");

  const identity = await get("/identity", testToken);
  assert(identity.status === 200, "GET /identity → 200");

  const guardrails = await get("/guardrails", testToken);
  assert(guardrails.status === 200, "GET /guardrails → 200");

  const agents = await get("/agents/active", testToken);
  assert(agents.status === 200, "GET /agents/active → 200");
  assert(Array.isArray(agents.body.agents), "Active agents returns array");

  const history = await get("/agents/history?limit=5", testToken);
  assert(history.status === 200, "GET /agents/history → 200");

  const workspace = await get("/workspace", testToken);
  assert(workspace.status === 200, "GET /workspace → 200");

  const guidelines = await get("/workspace/guidelines", testToken);
  assert(guidelines.status === 200, "GET /workspace/guidelines → 200");

  const artifacts = await get("/workspace/artifacts", testToken);
  assert(artifacts.status === 200, "GET /workspace/artifacts → 200");

  // ── 7. Checkpoint ───────────────────────────────────────────
  console.log("\n7. Checkpoint...");

  const cp = await post("/checkpoint", {
    action: "push-code",
    description: "Smoke test checkpoint",
    affects: "test-repo",
    rollbackPlan: "git revert",
  }, testToken);
  assert(cp.status === 200, "POST /checkpoint → 200");
  assert(cp.body.saved === true, "Checkpoint saved");

  // ── 8. Docs endpoint ────────────────────────────────────────
  console.log("\n8. Docs endpoint...");

  const doc = await get("/docs/GODMODE-META-ARCHITECTURE", testToken);
  assert(doc.status === 200, "GET /docs/GODMODE-META-ARCHITECTURE → 200");

  const badDoc = await get("/docs/SECRETS", testToken);
  assert(badDoc.status === 404, "GET /docs/SECRETS → 404 (not allowlisted)");

  // ── 9. Rate limiting ────────────────────────────────────────
  console.log("\n9. Rate limiting (61 requests)...");

  // We've already used some requests above, so register a fresh token
  const rlToken = mod.createAgentToken({ agentId: "rate-limit-test" });
  let rateLimited = false;
  for (let i = 0; i < 62; i++) {
    const r = await get("/health"); // health doesn't need auth, but let's use the rl token
    // Actually rate limit checks are per-authed-token, health bypasses auth
    // So let's hit an authed endpoint
    const r2 = await get("/agents/active", rlToken.token);
    if (r2.status === 429) {
      rateLimited = true;
      break;
    }
  }
  assert(rateLimited, "Rate limit triggered after 60 requests");

  // ── 10. Token revocation ────────────────────────────────────
  console.log("\n10. Token revocation...");

  mod.revokeAgentToken(testToken);
  const afterRevoke = await get("/agents/active", testToken);
  assert(afterRevoke.status === 401, "Revoked token → 401");

  // ── 11. Stop server ─────────────────────────────────────────
  console.log("\n11. Stopping server...");

  mod.stopToolkitServer();
  assert(!mod.isToolkitRunning(), "isToolkitRunning() returns false after stop");

  // ── Results ─────────────────────────────────────────────────
  console.log(`\n${"─".repeat(40)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`${"─".repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
