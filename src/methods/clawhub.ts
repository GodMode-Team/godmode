/**
 * clawhub.ts — ClawHub marketplace integration.
 *
 * Provides search, browse, import, and personalization-context generation
 * for skills from the ClawHub public registry (https://clawhub.ai).
 *
 * RPC methods:
 *   clawhub.search            — vector search across ClawHub
 *   clawhub.explore           — browse/sort skills (trending, popular, etc.)
 *   clawhub.detail            — full skill metadata + moderation status
 *   clawhub.import            — download, extract, and register a skill locally
 *   clawhub.personalizeContext — assemble a prompt blob for conversational personalization
 */

import { readFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";
import { GODMODE_ROOT, DATA_DIR } from "../data-paths.js";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

// ── Constants ────────────────────────────────────────────────────────

const DEFAULT_REGISTRY = "https://clawhub.ai";
const SKILLS_DIR = join(GODMODE_ROOT, "skills");
const LOCKFILE_DIR = SKILLS_DIR;
const REQUEST_TIMEOUT_MS = 15_000;

// ── In-memory cache (avoids hammering ClawHub on tab switches) ───────

type CacheEntry<T> = { data: T; expiresAt: number };
const apiCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60_000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = apiCache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    apiCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  apiCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ── Lightweight HTTP helpers (avoid importing clawhub internals) ─────

const MAX_RETRIES = 2;
const BASE_BACKOFF_MS = 1_500;

async function registryGet<T>(path: string, query?: Record<string, string>): Promise<T> {
  const url = new URL(path, DEFAULT_REGISTRY);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      url.searchParams.set(k, v);
    }
  }
  const cacheKey = url.toString();

  // Check cache first
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, BASE_BACKOFF_MS * attempt));
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (response.status === 429) {
      const retryAfter = response.headers.get("retry-after");
      const waitMs = retryAfter ? Math.min(Number(retryAfter) * 1000, 10_000) : BASE_BACKOFF_MS * (attempt + 1);
      lastError = new Error("Rate limit exceeded");
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `ClawHub API error: HTTP ${response.status}`);
    }
    const data = (await response.json()) as T;
    setCache(cacheKey, data);
    return data;
  }
  throw lastError ?? new Error("ClawHub request failed after retries");
}

async function registryDownloadZip(slug: string, version?: string): Promise<Uint8Array> {
  const url = new URL("/api/v1/download", DEFAULT_REGISTRY);
  url.searchParams.set("slug", slug);
  if (version) url.searchParams.set("version", version);
  const response = await fetch(url.toString(), {
    method: "GET",
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Download failed: HTTP ${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

// ── Zip extraction (uses system unzip — available on macOS/Linux) ────

async function extractZip(zipBytes: Uint8Array, targetDir: string): Promise<void> {
  const { writeFile: fsWriteFile, mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { exec: nodeExec } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const execAsync = promisify(nodeExec);

  const tempDir = await mkdtemp(join(tmpdir(), "clawhub-"));
  const zipPath = join(tempDir, "skill.zip");
  try {
    await fsWriteFile(zipPath, zipBytes);
    await mkdir(targetDir, { recursive: true });
    await execAsync(`unzip -o -q "${zipPath}" -d "${targetDir}"`, { timeout: 30_000 });
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ── Lockfile helpers ─────────────────────────────────────────────────

type Lockfile = {
  version: 1;
  skills: Record<string, { version: string | null; installedAt: number }>;
};

async function readLockfile(): Promise<Lockfile> {
  const lockPath = join(LOCKFILE_DIR, ".clawdhub", "lock.json");
  try {
    const raw = await readFile(lockPath, "utf-8");
    return JSON.parse(raw) as Lockfile;
  } catch {
    return { version: 1, skills: {} };
  }
}

async function writeLockfile(lock: Lockfile): Promise<void> {
  const { writeFile: fsWriteFile } = await import("node:fs/promises");
  const lockDir = join(LOCKFILE_DIR, ".clawdhub");
  await mkdir(lockDir, { recursive: true });
  await fsWriteFile(join(lockDir, "lock.json"), JSON.stringify(lock, null, 2), "utf-8");
}

// ── Safe file reading ────────────────────────────────────────────────

function safeReadFileSync(path: string): string | null {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

// ── Slug validation ──────────────────────────────────────────────────

function validateSlug(slug: unknown): string {
  if (typeof slug !== "string" || !slug.trim()) {
    throw new Error("slug is required");
  }
  const trimmed = slug.trim();
  if (trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("..")) {
    throw new Error(`Invalid slug: ${trimmed}`);
  }
  return trimmed;
}

// ── API response types ───────────────────────────────────────────────

type SearchResult = {
  score: number;
  slug?: string;
  displayName?: string;
  summary?: string | null;
  version?: string | null;
  updatedAt?: number;
};

type SearchResponse = { results: SearchResult[] };

type SkillListItem = {
  slug: string;
  displayName: string;
  tags: unknown;
  stats: unknown;
  createdAt: number;
  updatedAt: number;
  summary?: string | null;
  latestVersion?: { version: string; createdAt: number; changelog: string };
};

type SkillListResponse = { items: SkillListItem[]; nextCursor: string | null };

type SkillDetailResponse = {
  skill: {
    slug: string;
    displayName: string;
    tags: unknown;
    stats: unknown;
    createdAt: number;
    updatedAt: number;
    summary?: string | null;
  } | null;
  latestVersion: { version: string; createdAt: number; changelog: string } | null;
  owner: { handle: string | null; displayName?: string | null; image?: string | null } | null;
  moderation?: { isSuspicious: boolean; isMalwareBlocked: boolean } | null;
};

// ── RPC Handlers ─────────────────────────────────────────────────────

const search: GatewayRequestHandler = async ({ params, respond }) => {
  const { query, limit } = params as { query?: string; limit?: number };
  if (!query || typeof query !== "string" || !query.trim()) {
    respond(false, null, { code: "INVALID_REQUEST", message: "query is required" });
    return;
  }
  try {
    const q: Record<string, string> = { q: query.trim() };
    if (typeof limit === "number" && Number.isFinite(limit)) {
      q.limit = String(Math.min(Math.max(1, limit), 50));
    }
    const result = await registryGet<SearchResponse>("/api/v1/search", q);
    respond(true, result);
  } catch (err) {
    respond(false, null, { code: "CLAWHUB_ERROR", message: err instanceof Error ? err.message : String(err) });
  }
};

const explore: GatewayRequestHandler = async ({ params, respond }) => {
  const { sort, limit } = params as { sort?: string; limit?: number };
  try {
    const q: Record<string, string> = {};
    const boundedLimit = Math.min(Math.max(1, limit ?? 25), 100);
    q.limit = String(boundedLimit);
    if (sort && typeof sort === "string" && sort !== "updated") {
      q.sort = sort;
    }
    const result = await registryGet<SkillListResponse>("/api/v1/skills", q);
    respond(true, result);
  } catch (err) {
    respond(false, null, { code: "CLAWHUB_ERROR", message: err instanceof Error ? err.message : String(err) });
  }
};

const detail: GatewayRequestHandler = async ({ params, respond }) => {
  try {
    const slug = validateSlug((params as { slug?: string }).slug);
    const result = await registryGet<SkillDetailResponse>(
      `/api/v1/skills/${encodeURIComponent(slug)}`,
    );
    respond(true, result);
  } catch (err) {
    respond(false, null, { code: "CLAWHUB_ERROR", message: err instanceof Error ? err.message : String(err) });
  }
};

const importSkill: GatewayRequestHandler = async ({ params, respond }) => {
  const { slug: rawSlug, version } = params as { slug?: string; version?: string };
  try {
    const slug = validateSlug(rawSlug);

    // 1. Fetch metadata + moderation check
    const meta = await registryGet<SkillDetailResponse>(
      `/api/v1/skills/${encodeURIComponent(slug)}`,
    );
    if (meta.moderation?.isMalwareBlocked) {
      respond(false, null, {
        code: "BLOCKED",
        message: `"${slug}" is flagged as malicious and cannot be installed.`,
      });
      return;
    }

    const resolvedVersion = version ?? meta.latestVersion?.version ?? null;
    if (!resolvedVersion) {
      respond(false, null, { code: "NO_VERSION", message: "Could not resolve latest version" });
      return;
    }

    // 2. Download zip
    const zip = await registryDownloadZip(slug, resolvedVersion);

    // 3. Extract to skills dir
    const target = join(SKILLS_DIR, slug);
    const { rm } = await import("node:fs/promises");
    await rm(target, { recursive: true, force: true });
    await mkdir(target, { recursive: true });
    await extractZip(zip, target);

    // 4. Write origin metadata
    const originPath = join(target, ".clawhub-origin.json");
    const { writeFile: fsWriteFile } = await import("node:fs/promises");
    await fsWriteFile(
      originPath,
      JSON.stringify({
        version: 1,
        registry: DEFAULT_REGISTRY,
        slug,
        installedVersion: resolvedVersion,
        installedAt: Date.now(),
      }, null, 2),
      "utf-8",
    );

    // 5. Update lockfile
    const lock = await readLockfile();
    lock.skills[slug] = { version: resolvedVersion, installedAt: Date.now() };
    await writeLockfile(lock);

    respond(true, {
      slug,
      version: resolvedVersion,
      target,
      suspicious: meta.moderation?.isSuspicious ?? false,
      displayName: meta.skill?.displayName ?? slug,
    });
  } catch (err) {
    respond(false, null, { code: "IMPORT_ERROR", message: err instanceof Error ? err.message : String(err) });
  }
};

// ── Skill inventory helpers (for cross-skill analysis) ───────────────

type SkillSummary = { slug: string; name: string; description: string; bins: string[]; env: string[] };

function readInstalledSkillSummaries(): SkillSummary[] {
  const summaries: SkillSummary[] = [];
  try {
    const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("."));
    for (const dir of dirs) {
      const md = safeReadFileSync(join(SKILLS_DIR, dir.name, "SKILL.md"));
      if (!md) continue;
      // Extract frontmatter fields
      const fmMatch = md.match(/^---\n([\s\S]*?)\n---/);
      const fm = fmMatch?.[1] ?? "";
      const nameMatch = fm.match(/^name:\s*(.+)$/m);
      const descMatch = fm.match(/^description:\s*(.+)$/m);
      const binsMatch = fm.match(/^bins:\s*\[([^\]]*)\]/m);
      const envMatch = fm.match(/^env:\s*\[([^\]]*)\]/m);
      // First paragraph after frontmatter as fallback description
      const body = md.replace(/^---[\s\S]*?---\n*/, "").trim();
      const firstParagraph = body.split(/\n\n/)[0]?.slice(0, 200) ?? "";
      summaries.push({
        slug: dir.name,
        name: nameMatch?.[1]?.trim() ?? dir.name,
        description: descMatch?.[1]?.trim() ?? firstParagraph,
        bins: binsMatch?.[1]?.split(",").map((b) => b.trim().replace(/['"]/g, "")).filter(Boolean) ?? [],
        env: envMatch?.[1]?.split(",").map((e) => e.trim().replace(/['"]/g, "")).filter(Boolean) ?? [],
      });
    }
  } catch { /* empty */ }
  return summaries;
}

// ── personalizeContext handler ────────────────────────────────────────

const personalizeContext: GatewayRequestHandler = async ({ params, respond }) => {
  const { slug: rawSlug } = params as { slug?: string };
  try {
    const slug = validateSlug(rawSlug);
    const skillDir = join(SKILLS_DIR, slug);
    const skillMd = safeReadFileSync(join(skillDir, "SKILL.md"));
    if (!skillMd) {
      respond(false, null, {
        code: "NOT_FOUND",
        message: `Skill "${slug}" not found locally. Import it first.`,
      });
      return;
    }

    // Gather user context
    const onboarding = safeReadFileSync(join(DATA_DIR, "onboarding.json"));
    const dataSources = safeReadFileSync(join(DATA_DIR, "data-sources.json"));
    const userMd = safeReadFileSync(join(GODMODE_ROOT, "USER.md"));
    const optionsRaw = safeReadFileSync(join(DATA_DIR, "godmode-options.json"));

    // Read full inventory of installed skills
    const installedSkills = readInstalledSkillSummaries();
    const otherSkills = installedSkills.filter((s) => s.slug !== slug);

    // Build context sections
    const contextParts: string[] = [];

    if (onboarding) {
      try {
        const ob = JSON.parse(onboarding);
        if (ob.profile || ob.tools || ob.workflows) {
          contextParts.push(`## User Profile (from onboarding)\n${JSON.stringify(ob.profile || ob, null, 2)}`);
        }
      } catch { /* skip */ }
    }

    if (dataSources) {
      try {
        const ds = JSON.parse(dataSources);
        const names = Array.isArray(ds) ? ds.map((d: { name?: string }) => d.name).filter(Boolean) : Object.keys(ds);
        if (names.length > 0) {
          contextParts.push(`## Connected Integrations\n${names.join(", ")}`);
        }
      } catch { /* skip */ }
    }

    if (optionsRaw) {
      try {
        const opts = JSON.parse(optionsRaw);
        const relevant: Record<string, unknown> = {};
        if (opts.dailyIntel) relevant.dailyIntel = opts.dailyIntel;
        if (opts.features) relevant.features = opts.features;
        if (Object.keys(relevant).length > 0) {
          contextParts.push(`## GodMode Configuration\n${JSON.stringify(relevant, null, 2)}`);
        }
      } catch { /* skip */ }
    }

    // Full skill inventory with descriptions so agent can detect overlaps
    if (otherSkills.length > 0) {
      const skillLines = otherSkills.map((s) => {
        const tools = [...s.bins, ...s.env].filter(Boolean);
        const toolNote = tools.length > 0 ? ` (uses: ${tools.join(", ")})` : "";
        return `- **${s.name}** (${s.slug}): ${s.description}${toolNote}`;
      });
      contextParts.push(
        `## Installed Skills (${otherSkills.length} already active)\n` +
        `Review these for overlaps, conflicts, or integration opportunities with the new skill:\n` +
        skillLines.join("\n"),
      );
    }

    if (userMd) {
      const excerpt = userMd.slice(0, 1500);
      contextParts.push(`## User Identity (USER.md excerpt)\n${excerpt}`);
    }

    const userContext = contextParts.join("\n\n");

    // Build the personalization prompt
    const personalizePrompt = [
      `I just imported the "${slug}" skill from ClawHub. Before I start using it, I want you to review it against my current setup and help me personalize it.`,
      "",
      "Here's the skill definition:",
      "```markdown",
      skillMd,
      "```",
      "",
      userContext ? `Here's my current GodMode setup:\n${userContext}` : "",
      "",
      "Please do the following:",
      "",
      "**1. Compatibility Review** — Before anything else, analyze this skill against my existing setup:",
      "   - Does it overlap or conflict with any of my installed skills? If so, which ones and how?",
      "   - Does it require tools or API keys I don't already have?",
      "   - Does it complement any existing skills in a useful way?",
      "   - Is there anything I should disable, remove, or reconfigure to avoid conflicts?",
      "",
      "**2. Personalization** — Then help me tailor it:",
      "   - Ask me what I want to use this skill for specifically",
      "   - Understand which of my tools and workflows it should integrate with",
      "   - Remove or simplify parts I won't use, and enhance parts that matter to me",
      "   - Tailor invocation patterns, examples, and instructions to my actual workflow",
      "",
      "**3. Write It** — When we're aligned, write the personalized SKILL.md to ~/godmode/skills/" + slug + "/SKILL.md",
      "",
      "Start with the compatibility review, then ask me questions.",
    ].filter(Boolean).join("\n");

    respond(true, { slug, skillContent: skillMd, personalizePrompt });
  } catch (err) {
    respond(false, null, {
      code: "CONTEXT_ERROR",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

export const clawhubHandlers: GatewayRequestHandlers = {
  "clawhub.search": search,
  "clawhub.explore": explore,
  "clawhub.detail": detail,
  "clawhub.import": importSkill,
  "clawhub.personalizeContext": personalizeContext,
};
