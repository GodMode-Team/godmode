/**
 * Smoke test for Paperclip swarm adapter.
 * Run: node tests/smoke-paperclip.mjs
 *
 * Tests:
 * 1. Paperclip server starts (embedded Postgres)
 * 2. Company creation via REST
 * 3. Agent registration
 * 4. Project + issue creation
 * 5. Clean shutdown
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Find @paperclipai/server in pnpm's .pnpm store (strict hoisting blocks normal resolution)
const pnpmDir = join(process.cwd(), "node_modules", ".pnpm");
const serverPkgDir = readdirSync(pnpmDir)
  .filter(d => d.startsWith("@paperclipai+server@"))
  .sort()
  .pop();
if (!serverPkgDir) throw new Error("@paperclipai/server not found in .pnpm store");
const serverEntry = join(pnpmDir, serverPkgDir, "node_modules", "@paperclipai", "server", "dist", "index.js");
const { startServer } = await import(pathToFileURL(serverEntry).href);

let server;

try {
  console.log("1. Starting Paperclip server...");
  server = await startServer();
  console.log(`   ✓ Server at ${server.apiUrl}`);

  const api = async (method, path, body) => {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${server.apiUrl}${path}`, opts);
    if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
    const ct = res.headers.get("content-type") || "";
    return ct.includes("json") ? res.json() : {};
  };

  console.log("2. Creating company...");
  const company = await api("POST", "/api/companies", {
    name: "Smoke Test Co",
    description: "Paperclip smoke test",
  });
  console.log(`   ✓ Company: ${company.id?.slice(0, 8)} "${company.name}"`);

  console.log("3. Creating agents...");
  const ceo = await api("POST", `/api/companies/${company.id}/agents`, {
    name: "Prosper",
    role: "ceo",
    adapterType: "openclaw_gateway",
    adapterConfig: {},
    capabilities: "Chief of staff",
  });
  console.log(`   ✓ CEO: ${ceo.id?.slice(0, 8)} "${ceo.name}" (${ceo.role})`);

  const eng = await api("POST", `/api/companies/${company.id}/agents`, {
    name: "Builder",
    role: "engineer",
    adapterType: "openclaw_gateway",
    adapterConfig: {},
    capabilities: "Software engineering",
    reportsTo: ceo.id,
  });
  console.log(`   ✓ Engineer: ${eng.id?.slice(0, 8)} "${eng.name}" reports to CEO`);

  console.log("4. Creating project + issues...");
  const project = await api("POST", `/api/companies/${company.id}/projects`, {
    name: "Landing Page",
    description: "Build a landing page for GodMode",
    status: "in_progress",
    leadAgentId: ceo.id,
  });
  console.log(`   ✓ Project: ${project.id?.slice(0, 8)} "${project.name}"`);

  const issue = await api("POST", `/api/companies/${company.id}/issues`, {
    projectId: project.id,
    title: "Write page copy",
    description: "Create compelling copy for the landing page",
    status: "todo",
    priority: "high",
    assigneeAgentId: eng.id,
  });
  console.log(`   ✓ Issue: ${issue.id?.slice(0, 8)} "${issue.title}" → ${eng.name}`);

  // Verify we can read it back
  const readProject = await api("GET", `/api/projects/${project.id}`);
  console.log(`   ✓ Read back: "${readProject.name}" status=${readProject.status}`);

  console.log("5. Shutting down...");
  server.server.close();
  console.log("   ✓ Server stopped\n");
  console.log("🟢 ALL SMOKE TESTS PASSED");
  process.exit(0);
} catch (err) {
  console.error(`\n🔴 FAIL: ${err?.message ?? err}`);
  console.error("Stack:", err?.stack);
  if (server?.server) server.server.close();
  process.exit(1);
}
