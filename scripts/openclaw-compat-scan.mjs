#!/usr/bin/env node
/**
 * openclaw-compat-scan.mjs — Analyze OpenClaw version upgrade for breaking changes.
 *
 * Reads typecheck + build logs, scans for known breakage patterns, and produces
 * a structured report. Used by the openclaw-compat CI workflow.
 *
 * Usage:
 *   node scripts/openclaw-compat-scan.mjs \
 *     --old-version 2026.2.23 \
 *     --new-version 2026.3.1 \
 *     --typecheck-log /tmp/typecheck.log \
 *     --build-log /tmp/build.log \
 *     --typecheck-passed true \
 *     --build-passed true
 */

import { readFileSync } from "node:fs";

// ── Parse args ──────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}

const oldVersion = getArg("old-version") || "unknown";
const newVersion = getArg("new-version") || "unknown";
const typecheckLog = getArg("typecheck-log");
const buildLog = getArg("build-log");
const typecheckPassed = getArg("typecheck-passed") === "true";
const buildPassed = getArg("build-passed") === "true";

// ── Read logs ───────────────────────────────────────────────────────

function readLog(path) {
  if (!path) return "";
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

const tcLog = readLog(typecheckLog);
const bLog = readLog(buildLog);
const allLogs = tcLog + "\n" + bLog;

// ── Known breakage patterns ─────────────────────────────────────────

const PATTERNS = [
  {
    name: "Field rename: displayName → label",
    regex: /displayName.*(?:not|unknown|unexpected)|label.*(?:required|missing)/gi,
    category: "field-rename",
    severity: "breaking",
    fix: "Update field references. safe-request.ts FIELD_ALIASES handles this at runtime.",
  },
  {
    name: "Field rename: sessionKey → conversationId",
    regex: /sessionKey.*(?:not|unknown|unexpected)|conversationId.*(?:required|missing)/gi,
    category: "field-rename",
    severity: "breaking",
    fix: "Update field references. host-context.ts extractSessionKey() handles this at runtime.",
  },
  {
    name: "Method removed",
    regex: /(?:unknown method|method not found|no such method).*(?:sessions\.|chat\.|config\.)/gi,
    category: "method-removed",
    severity: "breaking",
    fix: "Add METHOD_FALLBACKS entry in safe-request.ts for the removed method.",
  },
  {
    name: "Type mismatch in plugin-sdk",
    regex: /(?:Property|Type).*(?:does not exist|is not assignable).*(?:OpenClawPluginApi|PluginContext)/gi,
    category: "type-change",
    severity: "breaking",
    fix: "Update type usage or add type assertion. Check openclaw/plugin-sdk changelog.",
  },
  {
    name: "Import path change",
    regex: /Cannot find module ['"]openclaw\/[^'"]+['"]/gi,
    category: "import-change",
    severity: "breaking",
    fix: "Update import paths to match new openclaw module structure.",
  },
  {
    name: "Hook signature change",
    regex: /(?:gateway_start|message_received|tool_use|prompt_submit).*(?:argument|parameter|signature)/gi,
    category: "hook-change",
    severity: "breaking",
    fix: "Update hook handlers to match new signatures.",
  },
  {
    name: "Port/URL change",
    regex: /(?:ECONNREFUSED|connection refused).*(?:18789|18790|localhost)/gi,
    category: "config-change",
    severity: "warning",
    fix: "Update default port/URL in openclaw-client.ts and connection configs.",
  },
  {
    name: "Deprecated API usage",
    regex: /deprecated.*(?:since|in|from)\s+\d/gi,
    category: "deprecation",
    severity: "warning",
    fix: "Update to the replacement API before it's removed in a future version.",
  },
];

// ── Scan ────────────────────────────────────────────────────────────

const findings = [];

for (const pattern of PATTERNS) {
  const matches = allLogs.match(pattern.regex);
  if (matches && matches.length > 0) {
    findings.push({
      ...pattern,
      matchCount: matches.length,
      samples: [...new Set(matches)].slice(0, 3),
    });
  }
}

// Also scan for generic TypeScript errors
const tsErrors = tcLog.match(/error TS\d+:/g);
const tsErrorCount = tsErrors ? tsErrors.length : 0;

// And generic build failures
const buildErrors = bLog.match(/(?:Error|ERROR|FAIL):/g);
const buildErrorCount = buildErrors ? buildErrors.length : 0;

// ── Report ──────────────────────────────────────────────────────────

console.log("═══════════════════════════════════════════════════════════════");
console.log(`  OpenClaw Compatibility Scan: ${oldVersion} → ${newVersion}`);
console.log("═══════════════════════════════════════════════════════════════");
console.log();
console.log(`  Typecheck: ${typecheckPassed ? "PASSED ✓" : "FAILED ✗"}`);
console.log(`  Build:     ${buildPassed ? "PASSED ✓" : "FAILED ✗"}`);
console.log(`  TS errors: ${tsErrorCount}`);
console.log(`  Build errors: ${buildErrorCount}`);
console.log();

if (findings.length === 0 && typecheckPassed && buildPassed) {
  console.log("  STATUS: CLEAN — No breaking changes detected.");
  console.log("  GodMode can safely update to OpenClaw " + newVersion);
  console.log();
  process.exit(0);
}

const breaking = findings.filter((f) => f.severity === "breaking");
const warnings = findings.filter((f) => f.severity === "warning");

if (breaking.length > 0) {
  console.log(`  BREAKING CHANGES: ${breaking.length} found`);
  console.log("  ─────────────────────────────────────────────────────────");
  for (const finding of breaking) {
    console.log();
    console.log(`  BREAKING: ${finding.name}`);
    console.log(`    Category: ${finding.category}`);
    console.log(`    Matches: ${finding.matchCount}`);
    console.log(`    Fix: ${finding.fix}`);
    for (const sample of finding.samples) {
      console.log(`    Sample: ${sample.slice(0, 120)}`);
    }
  }
}

if (warnings.length > 0) {
  console.log();
  console.log(`  WARNINGS: ${warnings.length}`);
  console.log("  ─────────────────────────────────────────────────────────");
  for (const finding of warnings) {
    console.log();
    console.log(`  WARNING: ${finding.name}`);
    console.log(`    Fix: ${finding.fix}`);
  }
}

if (!typecheckPassed && tsErrorCount > 0) {
  console.log();
  console.log("  TYPECHECK FAILURES:");
  console.log("  ─────────────────────────────────────────────────────────");
  // Extract unique TS error codes
  const errorCodes = [...new Set(tcLog.match(/error TS\d+/g) || [])];
  for (const code of errorCodes.slice(0, 10)) {
    console.log(`    ${code}`);
  }
  if (errorCodes.length > 10) {
    console.log(`    ... and ${errorCodes.length - 10} more`);
  }
}

console.log();
console.log("═══════════════════════════════════════════════════════════════");

// Exit code: 0 if clean, 1 if breaking (but we don't fail the step — CI handles that)
process.exit(0);
