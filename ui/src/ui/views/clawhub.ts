/**
 * ClawHub view — stub (killed in lean audit).
 * Retained as empty export to satisfy skills.ts dependency.
 */
import { html } from "lit";

export type ClawHubProps = {
  loading: boolean;
  error: string | null;
  query: string;
  results: unknown[] | null;
  exploreItems: unknown[] | null;
  exploreSort: string;
  detailSlug: string | null;
  detail: unknown | null;
  importing: string | null;
  message: unknown | null;
  onSearch: (query: string) => void;
  onExplore: (sort?: string) => void;
  onDetail: (slug: string) => void;
  onCloseDetail: () => void;
  onImport: (slug: string) => void;
  onImportAndPersonalize: (slug: string) => void;
};

export function renderClawHub(_props: ClawHubProps) {
  return html`<div class="muted" style="padding: 16px;">ClawHub has been retired.</div>`;
}
