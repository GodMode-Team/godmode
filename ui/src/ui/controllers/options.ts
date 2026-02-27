/**
 * Options controller — RPC helpers for GodMode feature options.
 */
import type { GodModeApp } from "../app.js";

export async function loadOptions(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  const app = host as unknown as {
    godmodeOptions: Record<string, unknown> | null;
    godmodeOptionsLoading: boolean;
  };
  app.godmodeOptionsLoading = true;
  try {
    const result = await host.client.request<Record<string, unknown>>(
      "godmode.options.get",
      {},
    );
    app.godmodeOptions = result;
  } catch {
    // Options methods may not be registered — silent fail
    app.godmodeOptions = null;
  } finally {
    app.godmodeOptionsLoading = false;
  }
}

export async function saveOption(
  host: GodModeApp,
  key: string,
  value: unknown,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request<{
      key: string;
      value: unknown;
      options: Record<string, unknown>;
    }>("godmode.options.set", { key, value });
    const app = host as unknown as {
      godmodeOptions: Record<string, unknown> | null;
    };
    app.godmodeOptions = result.options;
    host.showToast(`${key} ${value ? "enabled" : "disabled"}`, "success", 2000);
  } catch (err) {
    host.showToast("Failed to save option", "error");
    console.error("[Options] saveOption error:", err);
  }
}
