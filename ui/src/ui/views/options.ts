import { html } from "lit";

export type OptionsViewProps = {
  connected: boolean;
  loading: boolean;
  options: Record<string, unknown> | null;
  onToggle: (key: string, value: boolean) => void;
  onRefresh: () => void;
  onOpenWizard?: () => void;
};

export function renderOptions(props: OptionsViewProps) {
  if (!props.connected) {
    return html`<div class="view-placeholder">Not connected</div>`;
  }
  if (props.loading) {
    return html`<div class="view-placeholder">Loading options…</div>`;
  }
  return html`<div class="view-placeholder">Options</div>`;
}
