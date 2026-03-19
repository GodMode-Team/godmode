import { execFile as execFileCb } from "node:child_process";
import { promisify } from "node:util";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

const execFile = promisify(execFileCb);

type NotificationConfig = {
  enabled?: boolean;
  channel?: string;
  to?: string;
  service?: "imessage" | "sms" | "auto";
  accountId?: string;
  onlyWhenDesktopIdle?: boolean;
  desktopIdleSeconds?: number;
};

type CodingPluginConfig = {
  coding?: {
    notifications?: NotificationConfig;
  };
};

async function readDesktopIdleSeconds(): Promise<number | null> {
  if (process.platform !== "darwin") return null;
  try {
    const { stdout } = await execFile("ioreg", ["-c", "IOHIDSystem", "-d", "4", "-S"]);
    const match = stdout.match(/"HIDIdleTime"\s*=\s*(\d+)/);
    if (!match?.[1]) return null;
    return Math.floor(Number(match[1]) / 1_000_000_000);
  } catch {
    return null;
  }
}

export class CodingNotificationService {
  private api: OpenClawPluginApi;

  constructor(api: OpenClawPluginApi) {
    this.api = api;
  }

  private config(): NotificationConfig {
    const pluginConfig = this.api.pluginConfig as CodingPluginConfig;
    return pluginConfig?.coding?.notifications ?? {};
  }

  async sendCompletionNotification(params: {
    taskId: string;
    description: string;
    outcome: string;
    prUrl?: string;
    error?: string;
  }): Promise<void> {
    const config = this.config();
    if (!config.enabled) return;

    const to = config.to?.trim();
    if (!to) return;

    // Desktop idle check
    if (config.onlyWhenDesktopIdle !== false) {
      const idleSeconds = await readDesktopIdleSeconds();
      const threshold = config.desktopIdleSeconds ?? 120;
      if (idleSeconds !== null && idleSeconds < threshold) {
        this.api.logger.info(`[GodMode][Coding] Skipping notification — desktop active (${idleSeconds}s idle)`);
        return;
      }
    }

    const lines = [`Coding task ${params.outcome}: ${params.description}`];
    if (params.prUrl) lines.push(`PR: ${params.prUrl}`);
    if (params.error) lines.push(`Error: ${params.error.slice(0, 200)}`);
    const text = lines.join("\n");

    try {
      await this.api.runtime.channel.imessage.sendMessageIMessage(to, text, {
        config: this.api.config,
        accountId: config.accountId,
        service: config.service ?? "imessage",
      });
    } catch (err) {
      this.api.logger.warn(`[GodMode][Coding] iMessage notification failed: ${String(err)}`);
    }
  }
}
