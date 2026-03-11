import { html, nothing } from "lit";
import type { AppViewState } from "../app-view-state";

export function renderGatewayRestartConfirmation(state: AppViewState) {
  if (!state.gatewayRestartPending) {
    return nothing;
  }

  const sessionCount = state.sessionsResult?.sessions?.length ?? 0;
  const sessionLabel =
    sessionCount === 1 ? "1 active session" : `${sessionCount} active sessions`;

  return html`
    <div class="exec-approval-overlay" role="dialog" aria-modal="true" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Restart Gateway</div>
            <div class="exec-approval-sub">${sessionLabel} will be terminated</div>
          </div>
        </div>
        <div class="callout danger" style="margin-top: 12px;">
          This will kill all active sessions. The UI will reconnect automatically when the gateway comes back up.
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn danger"
            ?disabled=${state.gatewayRestartBusy}
            @click=${() => state.handleGatewayRestartConfirm()}
          >
            ${state.gatewayRestartBusy ? "Restarting…" : "Restart Gateway"}
          </button>
          <button
            class="btn"
            ?disabled=${state.gatewayRestartBusy}
            @click=${() => state.handleGatewayRestartCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
}
