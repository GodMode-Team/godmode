import { html, nothing } from "lit";

export type OverviewProps = {
  connected: boolean;
  updateStatus: {
    openclawVersion: string;
    openclawLatest: string | null;
    openclawUpdateAvailable: boolean;
    openclawInstallKind: string;
    openclawChannel: string | null;
    pluginVersion: string;
    pluginLatest: string | null;
    pluginUpdateAvailable: boolean;
    pendingDeploy: { summary: string; ts: number; files?: string[] } | null;
    fetchOk: boolean | null;
  } | null;
  updateLoading: boolean;
  onCheckUpdates: () => void;
  onUpdateOpenclaw: () => void;
  onUpdatePlugin: () => void;
};

export function renderOverview(props: OverviewProps) {
  const { connected, updateStatus, updateLoading, onCheckUpdates, onUpdateOpenclaw, onUpdatePlugin } = props;

  return html`
    <section class="tab-body" style="max-width: 600px; margin: 0 auto;">
      <!-- Gateway connection -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
        <span style="
          display: inline-block; width: 10px; height: 10px; border-radius: 50%;
          background: ${connected ? "var(--color-success, #22c55e)" : "var(--color-error, #ef4444)"};
        "></span>
        <span style="font-weight: 600;">Gateway</span>
        <span style="color: var(--text-muted, #888);">${connected ? "Connected" : "Disconnected"}</span>
      </div>

      ${updateStatus
        ? html`
            <!-- OpenClaw version -->
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="font-weight: 500; min-width: 100px;">OpenClaw</span>
              <span>v${updateStatus.openclawVersion}</span>
              ${updateStatus.openclawUpdateAvailable && updateStatus.openclawLatest
                ? html`
                    <span style="color: var(--text-muted, #888);">\u2192 v${updateStatus.openclawLatest}</span>
                    <button class="btn btn--primary btn--sm" @click=${onUpdateOpenclaw}>Update</button>
                  `
                : html`<span style="color: var(--text-muted, #888); font-size: 0.85rem;">up to date</span>`}
            </div>

            <!-- GodMode version -->
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="font-weight: 500; min-width: 100px;">GodMode</span>
              <span>v${updateStatus.pluginVersion}</span>
              ${updateStatus.pluginUpdateAvailable && updateStatus.pluginLatest
                ? html`
                    <span style="color: var(--text-muted, #888);">\u2192 v${updateStatus.pluginLatest}</span>
                    <button class="btn btn--primary btn--sm" @click=${onUpdatePlugin}>Update</button>
                  `
                : html`<span style="color: var(--text-muted, #888); font-size: 0.85rem;">up to date</span>`}
            </div>

            ${updateStatus.pendingDeploy
              ? html`
                  <div style="margin-top: 12px; padding: 8px 12px; border-radius: 6px; background: var(--surface-raised, #1a1a2e); font-size: 0.85rem; color: var(--text-muted, #888);">
                    Pending deploy: ${updateStatus.pendingDeploy.summary}
                  </div>
                `
              : nothing}
          `
        : html`<div style="color: var(--text-muted, #888); margin-bottom: 12px;">No version data yet.</div>`}

      <!-- Check for updates -->
      <div style="margin-top: 20px;">
        <button
          class="btn btn--secondary"
          ?disabled=${updateLoading || !connected}
          @click=${onCheckUpdates}
        >
          ${updateLoading ? "Checking\u2026" : "Check for Updates"}
        </button>
      </div>
    </section>
  `;
}
