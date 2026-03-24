/**
 * deploy-guard.ts — Pre-deploy safety checks.
 *
 * Prevents duplicate Vercel/Netlify projects and deploying from the
 * wrong repo. Reads from project-registry.ts and returns a clear
 * allow/block verdict with human-readable reasons.
 */

import { loadRegistry, type ProjectEntry } from "./project-registry.js";

// ── Types ────────────────────────────────────────────────────────────

export interface DeployCheckResult {
  allowed: boolean;
  reason: string;
  existingProject?: ProjectEntry;
  suggestion?: string;
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Check whether a deploy operation is safe.
 *
 * - Domain registered + repo matches → allowed
 * - Domain registered + repo mismatch → blocked
 * - Domain registered + projectName mismatch → blocked
 * - Domain not registered → allowed with suggestion to register
 */
export async function checkDeploy(
  domain: string,
  repo?: string,
  projectName?: string,
): Promise<DeployCheckResult> {
  const entries = await loadRegistry();
  const normalized = domain.toLowerCase().trim();
  const existing = entries.find((e) => e.domain.toLowerCase() === normalized);

  if (!existing) {
    return {
      allowed: true,
      reason: "Domain is not in the project registry.",
      suggestion: "Register this domain with godmode.projects.register to prevent future duplicates.",
    };
  }

  // Repo mismatch check
  if (repo && repo.toLowerCase() !== existing.repo.toLowerCase()) {
    return {
      allowed: false,
      reason: `This domain is already managed by ${existing.repo}. Use that repo instead.`,
      existingProject: existing,
    };
  }

  // Project name mismatch check
  if (projectName && projectName.toLowerCase() !== existing.projectName.toLowerCase()) {
    return {
      allowed: false,
      reason: `A deploy target already exists: ${existing.projectName}. Don't create a new one.`,
      existingProject: existing,
      suggestion: `Use the existing project "${existing.projectName}" on ${existing.platform}.`,
    };
  }

  return {
    allowed: true,
    reason: `Domain is registered to ${existing.repo} (project: ${existing.projectName}). Deploy is safe.`,
    existingProject: existing,
  };
}

/**
 * Check whether creating a new deploy project (Vercel/Netlify/etc.) is safe.
 *
 * - Domain already has a project → hard block
 * - Domain not registered → allowed
 */
export async function checkProjectCreation(
  domain: string,
  platform: string,
): Promise<DeployCheckResult> {
  const entries = await loadRegistry();
  const normalized = domain.toLowerCase().trim();
  const existing = entries.find((e) => e.domain.toLowerCase() === normalized);

  if (existing) {
    return {
      allowed: false,
      reason: `Domain "${domain}" already has a ${existing.platform} project: "${existing.projectName}" (repo: ${existing.repo}). Do NOT create another one.`,
      existingProject: existing,
    };
  }

  return {
    allowed: true,
    reason: `No existing project for "${domain}" on ${platform}. Safe to create.`,
    suggestion: "After creation, register with godmode.projects.register to prevent future duplicates.",
  };
}
