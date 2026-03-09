/**
 * x-browser.ts — X/Twitter access via twitter-cli.
 *
 * Replaces the old headless Brave CDP approach with the `twitter` CLI tool.
 * Authentication uses cookies extracted from Brave's profile or env vars.
 * No running browser process needed — survives reboots cleanly.
 *
 * Install: `uv tool install twitter-cli`
 * Auth:    Set TWITTER_AUTH_TOKEN + TWITTER_CT0 in ~/godmode/.env
 *          or let twitter-cli auto-extract from Brave/Chrome.
 */

import { execFile } from "node:child_process";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

// ── Constants ──────────────────────────────────────────────────────────

/** Max time to wait for a twitter-cli command. */
const CMD_TIMEOUT_MS = 30_000;

// ── Types ──────────────────────────────────────────────────────────────

export type XBrowserHealth = {
  cliAvailable: boolean;
  authenticated: boolean;
  /** @deprecated kept for backward compat with x-client.ts */
  browserRunning: boolean;
  cdpReachable: boolean;
  xSessionValid: boolean | null;
  cdpUrl: string;
  error?: string;
};

export type ExtractedTweet = {
  author: string;
  handle: string;
  text: string;
  url?: string;
  timestamp?: string;
};

// ── State ──────────────────────────────────────────────────────────────

let _lastHealthCheck: { valid: boolean; ts: number } | null = null;
let _twitterBin: string | null = null;

function godmodeRoot(): string {
  return process.env.GODMODE_ROOT || join(process.env.HOME || "", "godmode");
}

// ── Cookie / env helpers ───────────────────────────────────────────────

/**
 * Load TWITTER_AUTH_TOKEN and TWITTER_CT0 from ~/godmode/.env if not
 * already in the process environment.
 */
function loadTwitterEnv(): Record<string, string> {
  const env: Record<string, string> = { ...process.env } as Record<string, string>;

  // Already set — nothing to do
  if (env.TWITTER_AUTH_TOKEN && env.TWITTER_CT0) return env;

  // Try ~/godmode/.env
  try {
    const envPath = join(godmodeRoot(), ".env");
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^(TWITTER_AUTH_TOKEN|TWITTER_CT0)\s*=\s*(.+)/);
      if (m?.[1] && m[2]) {
        const v = m[2].trim();
        env[m[1]] = (v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))
          ? v.slice(1, -1)
          : v;
      }
    }
  } catch {
    // no .env — twitter-cli will try browser extraction
  }

  // Also try ~/.openclaw/.env as secondary
  try {
    const envPath = join(process.env.HOME || "", ".openclaw", ".env");
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^(TWITTER_AUTH_TOKEN|TWITTER_CT0)\s*=\s*(.+)/);
      if (m?.[1] && m[2] && !env[m[1]]) {
        const v = m[2].trim();
        env[m[1]] = (v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))
          ? v.slice(1, -1)
          : v;
      }
    }
  } catch {
    // ignore
  }

  return env;
}

// ── CLI runner ─────────────────────────────────────────────────────────

/** Find the twitter binary path. */
async function findTwitterBin(): Promise<string | null> {
  if (_twitterBin) return _twitterBin;

  // Check common paths
  const candidates = [
    "twitter",
    join(process.env.HOME || "", ".local", "bin", "twitter"),
    "/usr/local/bin/twitter",
    "/opt/homebrew/bin/twitter",
  ];

  for (const bin of candidates) {
    try {
      await new Promise<void>((resolve, reject) => {
        execFile(bin, ["--help"], { timeout: 5_000 }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      _twitterBin = bin;
      return bin;
    } catch {
      // try next
    }
  }
  return null;
}

/** Run a twitter-cli command and return parsed JSON output. */
async function runTwitter(
  args: string[],
  timeoutMs = CMD_TIMEOUT_MS,
): Promise<{ data: unknown; error?: string }> {
  const bin = await findTwitterBin();
  if (!bin) {
    return { data: null, error: "twitter-cli not installed. Run: uv tool install twitter-cli" };
  }

  const env = loadTwitterEnv();

  return new Promise((resolve) => {
    execFile(bin, [...args, "--json"], { timeout: timeoutMs, env, maxBuffer: 5 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        const msg = stderr?.trim() || err.message;
        // Check for auth errors — twitter-cli prints "Cookie expired or invalid (HTTP 401)"
        const combined = `${msg} ${stdout ?? ""}`.toLowerCase();
        if (combined.includes("cookie expired") || combined.includes("401") || combined.includes("re-login") || combined.includes("auth")) {
          resolve({ data: null, error: "X session expired or cookies invalid. Run x.setup to configure authentication." });
          return;
        }
        resolve({ data: null, error: `twitter-cli error: ${msg.slice(0, 300)}` });
        return;
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve({ data: parsed });
      } catch {
        // Non-JSON output — return as text
        resolve({ data: { text: stdout.trim() } });
      }
    });
  });
}

// ── CDP stubs (backward compat — no longer used) ─────────────────────

/** @deprecated No longer uses CDP. Kept for import compat. */
export async function findReachableCdp(): Promise<string | null> {
  return null;
}

/** @deprecated No longer launches Brave. */
export async function launchBrave(): Promise<{ cdpUrl: string } | { error: string }> {
  const bin = await findTwitterBin();
  if (bin) return { cdpUrl: "twitter-cli" };
  return { error: "twitter-cli not installed. Run: uv tool install twitter-cli" };
}

/** @deprecated No longer manages a browser process. */
export function stopBrave(): void {
  // no-op — no browser to stop
}

// ── Health check ───────────────────────────────────────────────────────

export async function checkHealth(): Promise<XBrowserHealth> {
  const bin = await findTwitterBin();
  const cliAvailable = bin !== null;
  let authenticated = false;

  if (cliAvailable) {
    // Use cache for 30 min
    if (_lastHealthCheck && Date.now() - _lastHealthCheck.ts < 30 * 60_000) {
      authenticated = _lastHealthCheck.valid;
    } else {
      // Quick test: try fetching 1 bookmark
      const result = await runTwitter(["favorites", "--max", "1"], 15_000);
      authenticated = !result.error;
      _lastHealthCheck = { valid: authenticated, ts: Date.now() };
    }
  }

  const health: XBrowserHealth = {
    cliAvailable,
    authenticated,
    // backward compat fields
    browserRunning: cliAvailable,
    cdpReachable: cliAvailable,
    xSessionValid: authenticated,
    cdpUrl: "twitter-cli",
  };

  // Persist health
  try {
    const dataDir = join(godmodeRoot(), "data");
    await mkdir(dataDir, { recursive: true });
    await writeFile(
      join(dataDir, "x-browser-health.json"),
      JSON.stringify(health, null, 2),
      "utf-8",
    );
  } catch {
    // Non-critical
  }

  return health;
}

// ── X operations ──────────────────────────────────────────────────────

function parseTweetId(urlOrId: string): string {
  const match = urlOrId.match(/(?:x\.com|twitter\.com)\/\w+\/status\/(\d+)/);
  return match?.[1] ?? urlOrId;
}

function parseHandle(urlOrHandle: string): string {
  const match = urlOrHandle.match(/(?:x\.com|twitter\.com)\/(@?\w+)/);
  const raw = match ? match[1] : urlOrHandle;
  return raw.replace(/^@/, "");
}

/** Normalize twitter-cli JSON output into ExtractedTweet[]. */
function normalizeTweets(data: unknown, maxCount: number): ExtractedTweet[] {
  if (!data || !Array.isArray(data)) {
    // Single tweet object?
    if (data && typeof data === "object" && "text" in data) {
      const t = data as Record<string, unknown>;
      return [{
        author: String(t.name ?? t.username ?? t.user ?? ""),
        handle: `@${String(t.username ?? t.screen_name ?? t.user ?? "")}`,
        text: String(t.text ?? t.full_text ?? ""),
        url: t.url ? String(t.url) : undefined,
        timestamp: t.created_at ? String(t.created_at) : undefined,
      }];
    }
    return [];
  }

  return (data as Array<Record<string, unknown>>).slice(0, maxCount).map((t) => ({
    author: String(t.name ?? t.username ?? t.user ?? ""),
    handle: `@${String(t.username ?? t.screen_name ?? t.user ?? "")}`,
    text: String(t.text ?? t.full_text ?? ""),
    url: t.url ? String(t.url) : undefined,
    timestamp: t.created_at ? String(t.created_at) : undefined,
  }));
}

export async function getBookmarks(
  count = 20,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const result = await runTwitter(["favorites", "--max", String(count)]);
  if (result.error) return { tweets: [], error: result.error };
  return { tweets: normalizeTweets(result.data, count) };
}

export async function getTweet(
  urlOrId: string,
): Promise<{ tweet: ExtractedTweet | null; error?: string }> {
  const id = parseTweetId(urlOrId);
  const result = await runTwitter(["tweet", id]);
  if (result.error) return { tweet: null, error: result.error };
  const tweets = normalizeTweets(result.data, 1);
  return { tweet: tweets[0] ?? null };
}

export async function getThread(
  urlOrId: string,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const id = parseTweetId(urlOrId);
  const result = await runTwitter(["tweet", id]);
  if (result.error) return { tweets: [], error: result.error };

  // twitter-cli returns the tweet + replies in the same call
  const data = result.data;
  if (data && typeof data === "object" && "replies" in data) {
    const obj = data as Record<string, unknown>;
    const mainTweets = normalizeTweets([obj], 1);
    const replyTweets = normalizeTweets(obj.replies, 50);
    return { tweets: [...mainTweets, ...replyTweets] };
  }
  return { tweets: normalizeTweets(data, 50) };
}

export async function getUserTimeline(
  handleOrUrl: string,
  count = 10,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const handle = parseHandle(handleOrUrl);
  const result = await runTwitter(["user-posts", handle, "--max", String(count)]);
  if (result.error) return { tweets: [], error: result.error };
  return { tweets: normalizeTweets(result.data, count) };
}

export async function readArticle(
  urlOrTweetUrl: string,
): Promise<{ title: string; text: string; url: string } | { error: string }> {
  // For articles, we still need the tweet text first, then the linked URL
  const isTweetUrl = /(?:x\.com|twitter\.com)\/\w+\/status\/\d+/.test(urlOrTweetUrl);
  if (isTweetUrl) {
    const id = parseTweetId(urlOrTweetUrl);
    const result = await runTwitter(["tweet", id]);
    if (result.error) return { error: result.error };
    const tweets = normalizeTweets(result.data, 1);
    const tweet = tweets[0];
    if (!tweet) return { error: "Tweet not found" };
    return {
      title: `Tweet by ${tweet.author}`,
      text: tweet.text,
      url: urlOrTweetUrl,
    };
  }
  // Non-tweet URL — we can't fetch arbitrary articles without a browser
  return { error: "Article reading requires a tweet URL. Non-tweet URLs are not supported without a browser." };
}

// ── Setup ──────────────────────────────────────────────────────────────

export async function setupLogin(): Promise<{ message: string } | { error: string }> {
  const bin = await findTwitterBin();
  if (!bin) {
    return {
      error:
        "twitter-cli is not installed. Install it with:\n\n" +
        "  uv tool install twitter-cli\n\n" +
        "Then set your X cookies in ~/godmode/.env:\n\n" +
        "  TWITTER_AUTH_TOKEN=your_auth_token_cookie\n" +
        "  TWITTER_CT0=your_ct0_cookie\n\n" +
        "To get these cookies: open X in your browser → DevTools → Application → Cookies → x.com → copy auth_token and ct0 values.",
    };
  }

  // Check if env vars are already set
  const env = loadTwitterEnv();
  if (env.TWITTER_AUTH_TOKEN && env.TWITTER_CT0) {
    // Validate
    const result = await runTwitter(["favorites", "--max", "1"], 15_000);
    if (!result.error) {
      _lastHealthCheck = { valid: true, ts: Date.now() };
      return { message: "X authentication is working! Cookies are valid." };
    }
    return {
      message:
        "Cookies are set but appear invalid/expired. Update them in ~/godmode/.env:\n\n" +
        "  TWITTER_AUTH_TOKEN=<new value>\n" +
        "  TWITTER_CT0=<new value>\n\n" +
        "To get fresh cookies: open X in your browser → DevTools (F12) → Application tab → Cookies → x.com → copy auth_token and ct0 values.",
    };
  }

  // twitter-cli will try browser extraction automatically
  const result = await runTwitter(["favorites", "--max", "1"], 15_000);
  if (!result.error) {
    _lastHealthCheck = { valid: true, ts: Date.now() };
    return { message: "X authentication working! twitter-cli extracted cookies from your browser." };
  }

  return {
    message:
      "Set your X cookies in ~/godmode/.env:\n\n" +
      "  TWITTER_AUTH_TOKEN=<your auth_token cookie>\n" +
      "  TWITTER_CT0=<your ct0 cookie>\n\n" +
      "To get these: open x.com in any browser → DevTools (F12) → Application tab → Cookies → x.com → copy the values for 'auth_token' and 'ct0'.\n\n" +
      "This works from any machine — no browser needed on the server.",
  };
}

// ── Init (called from x-client.ts) ────────────────────────────────────

export async function initTwitterCli(
  logger?: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<void> {
  const log = logger ?? console;

  const bin = await findTwitterBin();
  if (!bin) {
    log.warn("[GodMode] X client: twitter-cli not found. Install with: uv tool install twitter-cli");
    return;
  }
  log.info(`[GodMode] X client: twitter-cli found at ${bin}`);

  // Quick auth check
  const env = loadTwitterEnv();
  if (env.TWITTER_AUTH_TOKEN && env.TWITTER_CT0) {
    log.info("[GodMode] X client: auth cookies configured via env");
  } else {
    log.info("[GodMode] X client: no env cookies — twitter-cli will try browser extraction");
  }
}
