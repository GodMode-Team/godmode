/**
 * Smoke test for the Proof integration.
 * Tests the full lifecycle: create → read → rewrite → append → comment → list.
 *
 * Usage: node tests/smoke-proof.mjs
 */

const PROOF_API = process.env.PROOF_API_URL || "https://www.proofeditor.ai";
let passed = 0;
let failed = 0;

function check(label, condition, detail) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

async function main() {
  console.log(`\n🧪 Proof Integration Smoke Test`);
  console.log(`   API: ${PROOF_API}\n`);

  // 1. Health check
  console.log("1. Health check");
  try {
    const healthRes = await fetch(`${PROOF_API}/health`, { signal: AbortSignal.timeout(5000) });
    check("API reachable", healthRes.ok, `status ${healthRes.status}`);
  } catch (err) {
    check("API reachable", false, String(err));
    console.log("\n⛔ Cannot reach Proof API. Aborting.");
    process.exit(1);
  }

  // 2. Create document
  console.log("\n2. Create document");
  let slug, token;
  try {
    const createRes = await fetch(`${PROOF_API}/share/markdown`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: "# Smoke Test\n\nCreated by GodMode smoke test." }),
    });
    const doc = await createRes.json();
    slug = doc.slug;
    token = doc.accessToken;
    check("Document created", !!slug && !!token, `slug=${slug}`);
  } catch (err) {
    check("Document created", false, String(err));
    process.exit(1);
  }

  // 3. Read state
  console.log("\n3. Read state");
  let revision;
  try {
    const stateRes = await fetch(`${PROOF_API}/api/agent/${slug}/state`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const state = await stateRes.json();
    revision = state.revision;
    check("State readable", stateRes.ok && !!state.content);
    check("Has revision", typeof revision === "number", `revision=${revision}`);
    check("Content matches", state.content?.includes("Smoke Test"));
  } catch (err) {
    check("State readable", false, String(err));
  }

  // 4. Rewrite (replace) with baseRevision
  console.log("\n4. Rewrite document");
  try {
    const writeRes = await fetch(`${PROOF_API}/api/agent/${slug}/ops`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Agent-Id": "godmode-smoketest",
      },
      body: JSON.stringify({
        type: "rewrite.apply",
        by: "ai:godmode-smoketest",
        content: "# Rewritten\n\nThis document was rewritten by the smoke test.",
        baseRevision: revision,
      }),
    });
    const result = await writeRes.json();
    check("Rewrite succeeded", result.success === true, result.error);
  } catch (err) {
    check("Rewrite succeeded", false, String(err));
  }

  // 5. Append via edit endpoint
  console.log("\n5. Append content");
  try {
    // Need fresh revision after rewrite
    const stateRes = await fetch(`${PROOF_API}/api/agent/${slug}/state`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const state = await stateRes.json();

    const editRes = await fetch(`${PROOF_API}/api/agent/${slug}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Agent-Id": "godmode-smoketest",
      },
      body: JSON.stringify({
        by: "ai:godmode-smoketest",
        baseRevision: state.revision,
        operations: [{ op: "append", section: "", content: "\n\nAppended paragraph." }],
      }),
    });
    const result = await editRes.json();
    check("Append succeeded", result.success === true, result.error);
  } catch (err) {
    check("Append succeeded", false, String(err));
  }

  // 6. Add comment
  console.log("\n6. Add comment");
  try {
    const commentRes = await fetch(`${PROOF_API}/api/agent/${slug}/ops`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Agent-Id": "godmode-smoketest",
      },
      body: JSON.stringify({
        type: "comment.add",
        by: "ai:godmode-smoketest",
        text: "Smoke test comment from GodMode",
      }),
    });
    const result = await commentRes.json();
    check("Comment added", result.success === true, result.error);
  } catch (err) {
    check("Comment added", false, String(err));
  }

  // 7. Final verification
  console.log("\n7. Final verification");
  try {
    const finalRes = await fetch(`${PROOF_API}/api/agent/${slug}/state`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const final = await finalRes.json();
    check("Content has rewrite", final.content?.includes("rewritten by the smoke test"));
    check("Content has append", final.content?.includes("Appended paragraph"));
    check("Revision incremented", final.revision > revision, `${revision} → ${final.revision}`);
  } catch (err) {
    check("Final read", false, String(err));
  }

  // 8. View URL
  console.log("\n8. View URL");
  const viewUrl = `${PROOF_API}/d/${slug}?token=${token}`;
  console.log(`   ${viewUrl}`);
  check("URL format valid", viewUrl.includes("/d/") && viewUrl.includes("token="));

  // Summary
  console.log(`\n${"─".repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log("⚠️  Some tests failed — check output above.");
    process.exit(1);
  } else {
    console.log("✅ All tests passed!");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
