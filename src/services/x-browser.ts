/**
 * x-browser.ts — Headless Brave lifecycle manager for X/Twitter access.
 *
 * Manages a headless Brave browser instance with a dedicated profile
 * logged into X. Provides CDP-based page operations for reading tweets,
 * bookmarks, timelines, and articles.
 *
 * Uses OpenClaw plugin-sdk browser functions — zero new dependencies.
 */

import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

// SDK browser functions
import {
  findChromeExecutableMac,
  isChromeReachable,
  getChromeWebSocketUrl,
} from "openclaw/plugin-sdk/browser/chrome";
import {
  createTargetViaCdp,
  evaluateJavaScript,
  getDomText,
} from "openclaw/plugin-sdk/browser/cdp";
import { closePageByTargetIdViaPlaywright } from "openclaw/plugin-sdk/browser/pw-session";

// ── Constants ──────────────────────────────────────────────────────────

const CDP_PORT = 18850;
const CDP_URL = `http://127.0.0.1:${CDP_PORT}`;

/** How long to wait for a page to load before extracting content. */
const PAGE_LOAD_WAIT_MS = 4_000;

/** Max time for a single browser operation. */
const OP_TIMEOUT_MS = 15_000;

/** Auto-restart backoff schedule (ms). */
const RESTART_BACKOFF = [1_000, 5_000, 30_000];

// ── Types ──────────────────────────────────────────────────────────────

export type XBrowserHealth = {
  browserRunning: boolean;
  cdpReachable: boolean;
  xSessionValid: boolean | null; // null = not checked yet
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

let _proc: ChildProcess | null = null;
let _restartCount = 0;
let _lastSessionCheck: { valid: boolean; ts: number } | null = null;

function profileDir(): string {
  const root = process.env.GODMODE_ROOT || join(process.env.HOME || "", "godmode");
  return join(root, "data", "x-browser-profile");
}

function healthFile(): string {
  const root = process.env.GODMODE_ROOT || join(process.env.HOME || "", "godmode");
  return join(root, "data", "x-browser-health.json");
}

// ── Browser lifecycle ──────────────────────────────────────────────────

/**
 * Try to connect to an already-running Brave/Chrome on the configured CDP port,
 * or to the OpenClaw-managed brave profile on port 9222.
 * Returns the CDP URL that's reachable, or null.
 */
export async function findReachableCdp(): Promise<string | null> {
  // Check GodMode-managed port first
  if (await isChromeReachable(CDP_URL, 2_000)) return CDP_URL;
  // Check OpenClaw brave profile port
  const ocUrl = "http://127.0.0.1:9222";
  if (await isChromeReachable(ocUrl, 2_000)) return ocUrl;
  return null;
}

/**
 * Launch headless Brave with the GodMode X browser profile.
 * No-op if a browser is already reachable on the CDP port.
 */
export async function launchBrave(): Promise<{ cdpUrl: string } | { error: string }> {
  // Already running?
  const existing = await findReachableCdp();
  if (existing) {
    _restartCount = 0;
    return { cdpUrl: existing };
  }

  // Find Brave executable
  const exe = findChromeExecutableMac();
  if (!exe || exe.kind !== "brave") {
    return { error: "Brave Browser not found. Install it from https://brave.com" };
  }

  // Ensure profile directory exists
  const dir = profileDir();
  await mkdir(dir, { recursive: true });

  // Launch headless
  const args = [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${dir}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
  ];

  try {
    _proc = spawn(exe.path, args, {
      stdio: "ignore",
      detached: false,
    });

    _proc.on("exit", (code) => {
      console.log(`[x-browser] Brave exited with code ${code}`);
      _proc = null;
      scheduleRestart();
    });

    _proc.on("error", (err) => {
      console.error(`[x-browser] Brave spawn error: ${err.message}`);
      _proc = null;
    });

    // Wait for CDP to become reachable
    for (let i = 0; i < 10; i++) {
      await sleep(500);
      if (await isChromeReachable(CDP_URL, 1_000)) {
        _restartCount = 0;
        console.log(`[x-browser] Brave launched on CDP port ${CDP_PORT}`);
        return { cdpUrl: CDP_URL };
      }
    }

    return { error: `Brave launched but CDP not reachable on port ${CDP_PORT} after 5s` };
  } catch (err) {
    return { error: `Failed to launch Brave: ${err instanceof Error ? err.message : String(err)}` };
  }
}

function scheduleRestart(): void {
  if (_restartCount >= RESTART_BACKOFF.length) {
    console.error("[x-browser] Gave up restarting Brave after 3 attempts");
    return;
  }
  const delay = RESTART_BACKOFF[_restartCount] ?? 30_000;
  _restartCount++;
  console.log(`[x-browser] Scheduling restart in ${delay}ms (attempt ${_restartCount})`);
  setTimeout(() => {
    launchBrave().catch((err) => {
      console.error(`[x-browser] Restart failed: ${err}`);
    });
  }, delay);
}

/**
 * Stop the GodMode-managed Brave process.
 */
export function stopBrave(): void {
  if (_proc) {
    _proc.removeAllListeners("exit");
    _proc.kill("SIGTERM");
    _proc = null;
  }
}

// ── Health check ───────────────────────────────────────────────────────

export async function checkHealth(): Promise<XBrowserHealth> {
  const cdpUrl = await findReachableCdp();
  const browserRunning = cdpUrl !== null;
  const cdpReachable = browserRunning;

  let xSessionValid: boolean | null = null;

  if (cdpReachable && cdpUrl) {
    // Check if X session is still valid (cached for 30 min)
    if (_lastSessionCheck && Date.now() - _lastSessionCheck.ts < 30 * 60_000) {
      xSessionValid = _lastSessionCheck.valid;
    } else {
      try {
        xSessionValid = await validateXSession(cdpUrl);
        _lastSessionCheck = { valid: xSessionValid, ts: Date.now() };
      } catch {
        xSessionValid = null;
      }
    }
  }

  const health: XBrowserHealth = {
    browserRunning,
    cdpReachable,
    xSessionValid,
    cdpUrl: cdpUrl || CDP_URL,
  };

  // Persist health for other tools to read
  try {
    const dir = join(
      process.env.GODMODE_ROOT || join(process.env.HOME || "", "godmode"),
      "data",
    );
    await mkdir(dir, { recursive: true });
    await writeFile(healthFile(), JSON.stringify(health, null, 2), "utf-8");
  } catch {
    // Non-critical
  }

  return health;
}

/**
 * Navigate to x.com/home and check if we're redirected to login.
 */
async function validateXSession(cdpUrl: string): Promise<boolean> {
  let targetId: string | undefined;
  try {
    const target = await createTargetViaCdp({ cdpUrl, url: "about:blank" });
    targetId = target.targetId;

    const wsUrl = await getChromeWebSocketUrl(cdpUrl);
    if (!wsUrl) return false;

    // Navigate to X home
    const { result } = await evaluateJavaScript({
      wsUrl: wsUrl.replace(/\/devtools\/browser\/.*/, `/devtools/page/${targetId}`),
      expression: `
        await new Promise(r => {
          window.location.href = 'https://x.com/home';
          setTimeout(r, 3000);
        });
        window.location.href;
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    const finalUrl = String(result.value ?? "");
    // If we end up on login page, session is expired
    const isLoggedIn = !finalUrl.includes("/login") && !finalUrl.includes("/i/flow/login");
    return isLoggedIn;
  } catch {
    return false;
  } finally {
    if (targetId) {
      try {
        const cdp = cdpUrl;
        await closePageByTargetIdViaPlaywright({ cdpUrl: cdp, targetId });
      } catch {
        // Best effort cleanup
      }
    }
  }
}

// ── Page operations ────────────────────────────────────────────────────

/**
 * Navigate to a URL, wait for load, extract text content.
 * Opens a new tab, extracts content, closes tab.
 */
async function navigateAndExtract(
  url: string,
  opts?: { waitMs?: number },
): Promise<{ text: string; finalUrl: string } | { error: string }> {
  const cdpUrl = await findReachableCdp();
  if (!cdpUrl) return { error: "No browser available. Run x.setup to configure." };

  let targetId: string | undefined;
  try {
    const target = await createTargetViaCdp({ cdpUrl, url });
    targetId = target.targetId;

    // Wait for page to load
    await sleep(opts?.waitMs ?? PAGE_LOAD_WAIT_MS);

    // Get the WebSocket URL for this page
    const browserWsUrl = await getChromeWebSocketUrl(cdpUrl);
    if (!browserWsUrl) return { error: "Could not get CDP WebSocket URL" };
    const pageWsUrl = browserWsUrl.replace(/\/devtools\/browser\/.*/, `/devtools/page/${targetId}`);

    // Get final URL (after redirects)
    const { result: urlResult } = await evaluateJavaScript({
      wsUrl: pageWsUrl,
      expression: "window.location.href",
      returnByValue: true,
    });
    const finalUrl = String(urlResult.value ?? url);

    // Extract text content
    const { text } = await getDomText({
      wsUrl: pageWsUrl,
      format: "text",
      maxChars: 20_000,
    });

    return { text, finalUrl };
  } catch (err) {
    return { error: `Navigation failed: ${err instanceof Error ? err.message : String(err)}` };
  } finally {
    if (targetId) {
      try {
        await closePageByTargetIdViaPlaywright({ cdpUrl, targetId });
      } catch {
        // Best effort
      }
    }
  }
}

// ── X-specific operations ──────────────────────────────────────────────

/**
 * Parse a tweet ID from a URL like https://x.com/user/status/123456.
 */
function parseTweetId(urlOrId: string): string {
  const match = urlOrId.match(/(?:x\.com|twitter\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : urlOrId;
}

/**
 * Parse a handle from a URL like https://x.com/username.
 */
function parseHandle(urlOrHandle: string): string {
  const match = urlOrHandle.match(/(?:x\.com|twitter\.com)\/(@?\w+)/);
  const raw = match ? match[1] : urlOrHandle;
  return raw.replace(/^@/, "");
}

export async function getBookmarks(
  count = 20,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const result = await navigateAndExtract("https://x.com/i/bookmarks", {
    waitMs: 5_000, // bookmarks page loads slower
  });

  if ("error" in result) return { tweets: [], error: result.error };

  // Check for login redirect
  if (result.finalUrl.includes("/login")) {
    return { tweets: [], error: "X session expired. Run x.setup to re-login." };
  }

  const tweets = extractTweetsFromText(result.text, count);
  return { tweets };
}

export async function getTweet(
  urlOrId: string,
): Promise<{ tweet: ExtractedTweet | null; error?: string }> {
  const id = parseTweetId(urlOrId);
  const handle = urlOrId.match(/(?:x\.com|twitter\.com)\/(\w+)\/status/)?.[1] ?? "unknown";
  const url = `https://x.com/${handle}/status/${id}`;

  const result = await navigateAndExtract(url);
  if ("error" in result) return { tweet: null, error: result.error };

  const tweets = extractTweetsFromText(result.text, 1);
  return { tweet: tweets[0] ?? null };
}

export async function getThread(
  urlOrId: string,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const id = parseTweetId(urlOrId);
  const handle = urlOrId.match(/(?:x\.com|twitter\.com)\/(\w+)\/status/)?.[1] ?? "unknown";
  const url = `https://x.com/${handle}/status/${id}`;

  const result = await navigateAndExtract(url, { waitMs: 5_000 });
  if ("error" in result) return { tweets: [], error: result.error };

  const tweets = extractTweetsFromText(result.text, 50);
  return { tweets };
}

export async function getUserTimeline(
  handleOrUrl: string,
  count = 10,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const handle = parseHandle(handleOrUrl);
  const url = `https://x.com/${handle}`;

  const result = await navigateAndExtract(url, { waitMs: 5_000 });
  if ("error" in result) return { tweets: [], error: result.error };

  const tweets = extractTweetsFromText(result.text, count);
  return { tweets };
}

export async function readArticle(
  urlOrTweetUrl: string,
): Promise<{ title: string; text: string; url: string } | { error: string }> {
  // If it's a tweet URL, navigate to the tweet first to find the article link
  const isTweetUrl = /(?:x\.com|twitter\.com)\/\w+\/status\/\d+/.test(urlOrTweetUrl);

  if (isTweetUrl) {
    const tweetResult = await navigateAndExtract(urlOrTweetUrl);
    if ("error" in tweetResult) return { error: tweetResult.error };

    // For now, return the tweet's content. In the future, we can extract linked article URLs.
    return {
      title: "Tweet content",
      text: tweetResult.text.slice(0, 10_000),
      url: urlOrTweetUrl,
    };
  }

  // Direct article URL
  const result = await navigateAndExtract(urlOrTweetUrl, { waitMs: 5_000 });
  if ("error" in result) return { error: result.error };

  // Extract title from first line or heading
  const lines = result.text.split("\n").filter((l) => l.trim());
  const title = lines[0]?.slice(0, 200) ?? "Article";

  return {
    title,
    text: result.text.slice(0, 10_000),
    url: result.finalUrl,
  };
}

// ── Setup ──────────────────────────────────────────────────────────────

/**
 * Launch Brave non-headless for user to log into X.
 * Returns instructions for the user.
 */
export async function setupLogin(): Promise<{ message: string } | { error: string }> {
  const exe = findChromeExecutableMac();
  if (!exe || exe.kind !== "brave") {
    return { error: "Brave Browser not found. Install it from https://brave.com" };
  }

  const dir = profileDir();
  await mkdir(dir, { recursive: true });

  // Stop headless if running
  stopBrave();

  // Launch non-headless
  const proc = spawn(exe.path, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${dir}`,
    "--no-first-run",
    "--no-default-browser-check",
  ], {
    stdio: "ignore",
    detached: true,
  });

  proc.unref();

  return {
    message:
      "Brave has opened. Please log into X (twitter.com) in the browser window, " +
      "then close the window. GodMode will switch to headless mode automatically.",
  };
}

// ── Text extraction helpers ────────────────────────────────────────────

/**
 * Best-effort extraction of tweet-like content from raw page text.
 * This is intentionally loose — X's DOM changes frequently but the
 * text content structure is relatively stable.
 */
function extractTweetsFromText(text: string, maxCount: number): ExtractedTweet[] {
  const tweets: ExtractedTweet[] = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentAuthor = "";
  let currentHandle = "";
  let currentText = "";

  for (const line of lines) {
    // Detect handle patterns like @username
    const handleMatch = line.match(/^@(\w{1,15})$/);
    if (handleMatch) {
      // Save previous tweet if we have one
      if (currentText && currentHandle) {
        tweets.push({
          author: currentAuthor || currentHandle,
          handle: currentHandle,
          text: currentText.trim(),
        });
        if (tweets.length >= maxCount) break;
      }
      currentHandle = `@${handleMatch[1]}`;
      currentAuthor = "";
      currentText = "";
      continue;
    }

    // Detect display name patterns (capitalized, before @handle)
    if (!currentHandle && /^[A-Z]/.test(line) && line.length < 50) {
      currentAuthor = line;
      continue;
    }

    // Accumulate text content
    if (currentHandle && line.length > 10) {
      currentText += (currentText ? " " : "") + line;
    }
  }

  // Don't forget the last tweet
  if (currentText && currentHandle && tweets.length < maxCount) {
    tweets.push({
      author: currentAuthor || currentHandle,
      handle: currentHandle,
      text: currentText.trim(),
    });
  }

  return tweets;
}

// ── Utility ────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
