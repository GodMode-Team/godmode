/**
 * x-browser.ts — Headless Brave lifecycle manager for X/Twitter access.
 *
 * Manages a headless Brave browser instance with a dedicated profile
 * logged into X. Uses native CDP (Chrome DevTools Protocol) over
 * HTTP + WebSocket — zero external dependencies.
 */

import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

// ── Constants ──────────────────────────────────────────────────────────

const CDP_PORT = 18850;
const CDP_BASE = `http://127.0.0.1:${CDP_PORT}`;

/** Well-known Brave path on macOS. */
const BRAVE_MAC = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";

/** How long to wait for a page to load before extracting content. */
const PAGE_LOAD_WAIT_MS = 4_000;

/** Auto-restart backoff schedule (ms). */
const RESTART_BACKOFF = [1_000, 5_000, 30_000];

// ── Types ──────────────────────────────────────────────────────────────

export type XBrowserHealth = {
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

type CdpTarget = {
  id: string;
  webSocketDebuggerUrl: string;
  url: string;
  title: string;
  type: string;
};

// ── State ──────────────────────────────────────────────────────────────

let _proc: ChildProcess | null = null;
let _restartCount = 0;
let _lastSessionCheck: { valid: boolean; ts: number } | null = null;

function profileDir(): string {
  const root = process.env.GODMODE_ROOT || join(process.env.HOME || "", "godmode");
  return join(root, "data", "x-browser-profile");
}

// ── CDP helpers (native fetch + WebSocket) ─────────────────────────────

/** Check if a CDP endpoint is reachable. */
async function cdpReachable(base: string, timeoutMs = 2_000): Promise<boolean> {
  try {
    const resp = await fetch(`${base}/json/version`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    return resp.ok;
  } catch {
    return false;
  }
}

/** Create a new browser tab and return its target info. */
async function cdpNewTab(base: string, url: string): Promise<CdpTarget | null> {
  try {
    const resp = await fetch(`${base}/json/new?${encodeURIComponent(url)}`, {
      method: "PUT",
      signal: AbortSignal.timeout(5_000),
    });
    if (!resp.ok) return null;
    return (await resp.json()) as CdpTarget;
  } catch {
    return null;
  }
}

/** Close a browser tab by target ID. */
async function cdpCloseTab(base: string, targetId: string): Promise<void> {
  try {
    await fetch(`${base}/json/close/${targetId}`, { signal: AbortSignal.timeout(3_000) });
  } catch {
    // Best effort
  }
}

/** Execute JavaScript in a tab via CDP WebSocket. Returns the stringified result. */
async function cdpEvaluate(wsUrl: string, expression: string, timeoutMs = 10_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error("CDP evaluate timed out"));
    }, timeoutMs);

    ws.addEventListener("open", () => {
      ws.send(
        JSON.stringify({
          id: 1,
          method: "Runtime.evaluate",
          params: { expression, returnByValue: true, awaitPromise: true },
        }),
      );
    });

    ws.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(String(event.data)) as {
          id?: number;
          result?: { result?: { value?: unknown } };
        };
        if (msg.id === 1) {
          clearTimeout(timer);
          ws.close();
          resolve(String(msg.result?.result?.value ?? ""));
        }
      } catch {
        // ignore non-JSON messages
      }
    });

    ws.addEventListener("error", () => {
      clearTimeout(timer);
      reject(new Error(`CDP WebSocket error connecting to ${wsUrl}`));
    });
  });
}

// ── Browser lifecycle ──────────────────────────────────────────────────

/**
 * Find a reachable CDP endpoint:
 * 1. GodMode-managed port (18850)
 * 2. OpenClaw brave profile port (9222)
 */
export async function findReachableCdp(): Promise<string | null> {
  if (await cdpReachable(CDP_BASE)) return CDP_BASE;
  if (await cdpReachable("http://127.0.0.1:9222")) return "http://127.0.0.1:9222";
  return null;
}

/**
 * Launch headless Brave with the GodMode X browser profile.
 * No-op if a browser is already reachable.
 */
export async function launchBrave(): Promise<{ cdpUrl: string } | { error: string }> {
  const existing = await findReachableCdp();
  if (existing) {
    _restartCount = 0;
    return { cdpUrl: existing };
  }

  const bravePath = existsSync(BRAVE_MAC) ? BRAVE_MAC : null;
  if (!bravePath) {
    return { error: "Brave Browser not found at /Applications/Brave Browser.app" };
  }

  const dir = profileDir();
  await mkdir(dir, { recursive: true });

  try {
    _proc = spawn(bravePath, [
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${dir}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
    ], {
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
      if (await cdpReachable(CDP_BASE)) {
        _restartCount = 0;
        console.log(`[x-browser] Brave launched on CDP port ${CDP_PORT}`);
        return { cdpUrl: CDP_BASE };
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

/** Stop the GodMode-managed Brave process. */
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

  let xSessionValid: boolean | null = null;

  if (browserRunning && cdpUrl) {
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
    cdpReachable: browserRunning,
    xSessionValid,
    cdpUrl: cdpUrl || CDP_BASE,
  };

  // Persist health
  try {
    const root = process.env.GODMODE_ROOT || join(process.env.HOME || "", "godmode");
    await mkdir(join(root, "data"), { recursive: true });
    await writeFile(
      join(root, "data", "x-browser-health.json"),
      JSON.stringify(health, null, 2),
      "utf-8",
    );
  } catch {
    // Non-critical
  }

  return health;
}

async function validateXSession(base: string): Promise<boolean> {
  const tab = await cdpNewTab(base, "https://x.com/home");
  if (!tab) return false;

  try {
    await sleep(3_000);
    const finalUrl = await cdpEvaluate(tab.webSocketDebuggerUrl, "window.location.href");
    return !finalUrl.includes("/login") && !finalUrl.includes("/i/flow/login");
  } catch {
    return false;
  } finally {
    await cdpCloseTab(base, tab.id);
  }
}

// ── Page operations ────────────────────────────────────────────────────

async function navigateAndExtract(
  url: string,
  opts?: { waitMs?: number },
): Promise<{ text: string; finalUrl: string } | { error: string }> {
  const base = await findReachableCdp();
  if (!base) return { error: "No browser available. Run x.setup to configure." };

  const tab = await cdpNewTab(base, url);
  if (!tab) return { error: "Failed to open new browser tab" };

  try {
    await sleep(opts?.waitMs ?? PAGE_LOAD_WAIT_MS);

    const finalUrl = await cdpEvaluate(tab.webSocketDebuggerUrl, "window.location.href");
    const text = await cdpEvaluate(
      tab.webSocketDebuggerUrl,
      "document.body?.innerText || ''",
    );

    return { text, finalUrl };
  } catch (err) {
    return { error: `Navigation failed: ${err instanceof Error ? err.message : String(err)}` };
  } finally {
    await cdpCloseTab(base, tab.id);
  }
}

// ── X-specific operations ──────────────────────────────────────────────

function parseTweetId(urlOrId: string): string {
  const match = urlOrId.match(/(?:x\.com|twitter\.com)\/\w+\/status\/(\d+)/);
  return match ? match[1] : urlOrId;
}

function parseHandle(urlOrHandle: string): string {
  const match = urlOrHandle.match(/(?:x\.com|twitter\.com)\/(@?\w+)/);
  const raw = match ? match[1] : urlOrHandle;
  return raw.replace(/^@/, "");
}

export async function getBookmarks(
  count = 20,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const result = await navigateAndExtract("https://x.com/i/bookmarks", { waitMs: 5_000 });
  if ("error" in result) return { tweets: [], error: result.error };
  if (result.finalUrl.includes("/login")) {
    return { tweets: [], error: "X session expired. Run x.setup to re-login." };
  }
  return { tweets: extractTweetsFromText(result.text, count) };
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
  return { tweets: extractTweetsFromText(result.text, 50) };
}

export async function getUserTimeline(
  handleOrUrl: string,
  count = 10,
): Promise<{ tweets: ExtractedTweet[]; error?: string }> {
  const handle = parseHandle(handleOrUrl);
  const result = await navigateAndExtract(`https://x.com/${handle}`, { waitMs: 5_000 });
  if ("error" in result) return { tweets: [], error: result.error };
  return { tweets: extractTweetsFromText(result.text, count) };
}

export async function readArticle(
  urlOrTweetUrl: string,
): Promise<{ title: string; text: string; url: string } | { error: string }> {
  const isTweetUrl = /(?:x\.com|twitter\.com)\/\w+\/status\/\d+/.test(urlOrTweetUrl);
  const result = await navigateAndExtract(urlOrTweetUrl, { waitMs: isTweetUrl ? 4_000 : 5_000 });
  if ("error" in result) return { error: result.error };

  const lines = result.text.split("\n").filter((l) => l.trim());
  const title = lines[0]?.slice(0, 200) ?? "Article";

  return { title, text: result.text.slice(0, 10_000), url: result.finalUrl };
}

// ── Setup ──────────────────────────────────────────────────────────────

export async function setupLogin(): Promise<{ message: string } | { error: string }> {
  const bravePath = existsSync(BRAVE_MAC) ? BRAVE_MAC : null;
  if (!bravePath) return { error: "Brave Browser not found" };

  const dir = profileDir();
  await mkdir(dir, { recursive: true });

  stopBrave();

  const proc = spawn(bravePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${dir}`,
    "--no-first-run",
    "--no-default-browser-check",
  ], { stdio: "ignore", detached: true });

  proc.on("error", (err) => {
    console.error(`[x-browser] Login spawn error: ${err.message}`);
  });

  proc.unref();

  return {
    message:
      "Brave has opened. Log into X (twitter.com) in the browser window, " +
      "then close it. GodMode will switch to headless mode automatically.",
  };
}

// ── Text extraction helpers ────────────────────────────────────────────

function extractTweetsFromText(text: string, maxCount: number): ExtractedTweet[] {
  const tweets: ExtractedTweet[] = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentAuthor = "";
  let currentHandle = "";
  let currentText = "";

  for (const line of lines) {
    const handleMatch = line.match(/^@(\w{1,15})$/);
    if (handleMatch) {
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

    if (!currentHandle && /^[A-Z]/.test(line) && line.length < 50) {
      currentAuthor = line;
      continue;
    }

    if (currentHandle && line.length > 10) {
      currentText += (currentText ? " " : "") + line;
    }
  }

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
