/**
 * clawhub.ts — STUB (removed in v2 slim, skills browser in Second Brain replaces this)
 */
import { html, type TemplateResult } from "lit";

export type ClawHubSearchResult = {
  slug: string;
  name: string;
  description: string;
  downloads: number;
};

export type ClawHubSkillItem = {
  slug: string;
  name: string;
  description: string;
  downloads: number;
  author: string;
  version: string;
};

export type ClawHubSkillDetail = {
  slug: string;
  name: string;
  description: string;
  readme: string;
  downloads: number;
  author: string;
  version: string;
};

export interface ClawHubProps {
  loading: boolean;
  error: string | null;
  query: string;
  results: ClawHubSearchResult[] | null;
  exploreItems: ClawHubSkillItem[] | null;
  exploreSort: string;
  detailSlug: string | null;
  detail: ClawHubSkillDetail | null;
  importing: string | null;
  message: import("../controllers/clawhub").ClawHubMessage | null;
  onSearch: (query: string) => void;
}

export function renderClawHub(_props: ClawHubProps): TemplateResult {
  return html`<div style="padding: 16px; color: var(--text-secondary, #888);">
    <p>ClawHub browser removed. Skills are managed in the Second Brain tab.</p>
  </div>`;
}
