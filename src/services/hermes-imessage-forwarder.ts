/**
 * hermes-imessage-forwarder.ts — Forward iMessages to Hermes for dual-reply.
 *
 * When OC receives an iMessage, this fires a request to Hermes's API,
 * then sends Hermes's reply back via `imsg send`.
 *
 * This gives both Prosper (OC) and Hermes independent replies to every iMessage.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const HERMES_API_URL = process.env.HERMES_API_URL || "http://127.0.0.1:8642";
const HERMES_API_KEY = process.env.HERMES_API_KEY || "";
const IMSG_CLI = process.env.IMSG_CLI_PATH || "/opt/homebrew/bin/imsg";

// Debounce: don't forward if Hermes just replied (prevent echo loops)
const _recentForwards = new Map<string, number>();
const DEBOUNCE_MS = 10_000;

/**
 * Extract the phone/handle from an iMessage session key.
 * Format: agent:main:imessage:direct:+19166987764
 */
function extractHandle(sessionKey: string): string | null {
  // Try direct:+number format first, then any phone-like suffix
  const match = sessionKey.match(/imessage:(?:direct:)?([+\d][\d.-]+)/)
    ?? sessionKey.match(/imessage:.*?([+]\d{10,})/);
  return match?.[1] ?? null;
}

/**
 * Forward an incoming iMessage to Hermes and send the reply via imsg.
 * Fire-and-forget — errors are logged, never thrown.
 */
export async function forwardToHermes(
  sessionKey: string,
  content: string,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
): Promise<void> {
  // Only forward iMessage sessions
  if (!sessionKey.includes("imessage")) return;

  const handle = extractHandle(sessionKey);
  if (!handle) return;

  // Debounce
  const lastForward = _recentForwards.get(handle);
  if (lastForward && Date.now() - lastForward < DEBOUNCE_MS) return;
  _recentForwards.set(handle, Date.now());

  // Evict old entries
  if (_recentForwards.size > 50) {
    const cutoff = Date.now() - DEBOUNCE_MS * 6;
    for (const [k, v] of _recentForwards) {
      if (v < cutoff) _recentForwards.delete(k);
    }
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (HERMES_API_KEY) headers["Authorization"] = `Bearer ${HERMES_API_KEY}`;

    const body = JSON.stringify({
      model: "default",
      messages: [
        {
          role: "system",
          content:
            "You are Hermes, replying to an iMessage from Caleb. " +
            "HARD RULES for text messages: " +
            "NEVER use tables, markdown headers, bold, italic, code blocks, or any rich formatting. " +
            "NEVER wrap links in markdown or bold — just paste the raw URL. Markdown links are NOT clickable in texts. " +
            "Write like a human texting — short, casual, direct. 2-4 sentences max. " +
            "No bullet lists longer than 3 items. Plain text only. " +
            "Sign off with '— Hermes' at the end.",
        },
        { role: "user", content },
      ],
    });

    const resp = await fetch(`${HERMES_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(120_000),
    });

    if (!resp.ok) {
      logger.warn(`[GodMode][HermesForward] Hermes API returned ${resp.status}`);
      return;
    }

    const data = (await resp.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      logger.warn("[GodMode][HermesForward] Empty reply from Hermes");
      return;
    }

    // Send via imsg
    await execFileAsync(IMSG_CLI, ["send", "--to", handle, "--text", reply], {
      timeout: 15_000,
    });

    logger.info(`[GodMode][HermesForward] Hermes replied to ${handle} (${reply.length} chars)`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`[GodMode][HermesForward] Failed: ${msg}`);
  }
}
