import type { GodModeApp } from "../app.js";

/** How often to check for updates in the background (30 minutes). */
const UPDATE_POLL_INTERVAL_MS = 30 * 60 * 1000;

export async function checkForUpdates(app: GodModeApp) {
  if (!app.client || !app.connected) return;

  app.updateLoading = true;
  app.updateError = null;

  try {
    const result = (await app.client.request("system.checkUpdates", {
      fetch: true,
    })) as {
      version: string;
      branch: string | null;
      sha: string | null;
      upstream: string | null;
      ahead: number | null;
      behind: number | null;
      dirty: boolean | null;
      fetchOk: boolean | null;
      error?: string;
    };

    if (result.error) {
      app.updateError = result.error;
    }

    app.updateStatus = result;
    app.updateLastChecked = Date.now();
  } catch (err) {
    app.updateError = String(err);
  } finally {
    app.updateLoading = false;
  }
}

/** Quiet background check — no loading spinner, no error display. */
async function checkForUpdatesQuiet(app: GodModeApp) {
  if (!app.client || !app.connected) return;

  try {
    const result = (await app.client.request("system.checkUpdates", {
      fetch: true,
    })) as {
      version: string;
      branch: string | null;
      sha: string | null;
      upstream: string | null;
      ahead: number | null;
      behind: number | null;
      dirty: boolean | null;
      fetchOk: boolean | null;
      error?: string;
    };

    app.updateStatus = result;
    app.updateLastChecked = Date.now();
  } catch {
    // Silently ignore — heartbeat failures shouldn't disturb the user
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
