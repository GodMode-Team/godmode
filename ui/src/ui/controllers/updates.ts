import type { GodModeApp } from "../app.js";

/** How often to check for updates in the background (30 minutes). */
const UPDATE_POLL_INTERVAL_MS = 30 * 60 * 1000;

type GodModeUpdateCheckResult = {
  openclaw: {
    version: string;
    latest: string | null;
    updateAvailable: boolean;
    installKind: string;
    channel: string;
  };
  plugin: {
    version: string;
    latest: string | null;
    updateAvailable: boolean;
  };
  pendingDeploy: { summary: string; ts: number; files?: string[] } | null;
  fetchOk: boolean;
};

/** Map the backend response to the UI UpdateStatus shape. */
function mapToUpdateStatus(result: GodModeUpdateCheckResult) {
  return {
    openclawVersion: result.openclaw.version,
    openclawLatest: result.openclaw.latest,
    openclawUpdateAvailable: result.openclaw.updateAvailable,
    openclawInstallKind: result.openclaw.installKind,
    openclawChannel: result.openclaw.channel,
    pluginVersion: result.plugin.version,
    pluginLatest: result.plugin.latest,
    pluginUpdateAvailable: result.plugin.updateAvailable,
    pendingDeploy: result.pendingDeploy ?? null,
    fetchOk: result.fetchOk,
  };
}

/** Fallback: map the legacy system.checkUpdates response. */
function mapLegacyStatus(result: Record<string, unknown>) {
  const behind = typeof result.behind === "number" ? result.behind : null;
  return {
    openclawVersion: String(result.version ?? "unknown"),
    openclawLatest: null,
    openclawUpdateAvailable: (behind ?? 0) > 0,
    openclawInstallKind: "unknown",
    openclawChannel: null,
    pluginVersion: "unknown",
    pluginLatest: null,
    pluginUpdateAvailable: false,
    pendingDeploy: null as { summary: string; ts: number; files?: string[] } | null,
    fetchOk: result.fetchOk as boolean | null,
  };
}

export async function checkForUpdates(app: GodModeApp) {
  if (!app.client || !app.connected) return;

  app.updateLoading = true;
  app.updateError = null;

  try {
    // Try the new GodMode RPC method first
    const result = (await app.client.request(
      "godmode.update.check",
      {},
    )) as GodModeUpdateCheckResult;

    app.updateStatus = mapToUpdateStatus(result);
    app.updateLastChecked = Date.now();
  } catch {
    // Fallback to legacy OpenClaw core RPC
    try {
      const legacy = (await app.client.request("system.checkUpdates", {
        fetch: true,
      })) as Record<string, unknown>;

      if (legacy.error) {
        app.updateError = String(legacy.error);
      }

      app.updateStatus = mapLegacyStatus(legacy);
      app.updateLastChecked = Date.now();
    } catch (err) {
      app.updateError = String(err);
    }
  } finally {
    app.updateLoading = false;
  }
}

/** Quiet background check — no loading spinner, no error display. */
async function checkForUpdatesQuiet(app: GodModeApp) {
  if (!app.client || !app.connected) return;

  try {
    const result = (await app.client.request(
      "godmode.update.check",
      {},
    )) as GodModeUpdateCheckResult;

    app.updateStatus = mapToUpdateStatus(result);
    app.updateLastChecked = Date.now();
  } catch {
    // Fallback to legacy
    try {
      const legacy = (await app.client.request("system.checkUpdates", {
        fetch: true,
      })) as Record<string, unknown>;

      app.updateStatus = mapLegacyStatus(legacy);
      app.updateLastChecked = Date.now();
    } catch {
      // Silently ignore — background check failures shouldn't disturb the user
    }
  }
}

export function startUpdatePolling(app: GodModeApp) {
  if ((app as unknown as { updatePollInterval: number | null }).updatePollInterval != null) return;

  // Initial check on connect (quiet)
  void checkForUpdatesQuiet(app);

  (app as unknown as { updatePollInterval: number | null }).updatePollInterval = window.setInterval(
    () => void checkForUpdatesQuiet(app),
    UPDATE_POLL_INTERVAL_MS,
  );
}

export function stopUpdatePolling(app: GodModeApp) {
  const host = app as unknown as { updatePollInterval: number | null };
  if (host.updatePollInterval == null) return;
  clearInterval(host.updatePollInterval);
  host.updatePollInterval = null;
}

/** Check for post-update audit results on reconnect. Shows a toast if an update just completed. */
export async function checkPostUpdateStatus(app: GodModeApp) {
  if (!app.client || !app.connected) return;

  try {
    const status = await app.client.request<Record<string, unknown>>(
      "godmode.update.postStatus",
      {},
    );
    if (!status) return;

    const overall = status.overallStatus as string | undefined;
    const summary = status.summary as string | undefined;
    if (!summary) return;

    // Show toast based on overall status
    const toastType: "success" | "warning" | "error" =
      overall === "healthy" ? "success" : overall === "degraded" ? "error" : "warning";

    if (typeof (app as any).showToast === "function") {
      (app as any).showToast(summary, toastType);
    }

    // Trigger an update check to refresh version display
    void checkForUpdates(app);
  } catch {
    // Non-fatal — post-update status is informational only
  }
}
