import type { GatewayBrowserClient } from "../gateway";
import type {
  ClawHubSearchResult,
  ClawHubSkillDetail,
  ClawHubSkillItem,
} from "../types";

export type ClawHubMessage = {
  kind: "success" | "error";
  message: string;
};

export type ClawHubState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  clawhubQuery: string;
  clawhubResults: ClawHubSearchResult[] | null;
  clawhubExploreItems: ClawHubSkillItem[] | null;
  clawhubExploreSort: string;
  clawhubLoading: boolean;
  clawhubError: string | null;
  clawhubDetailSlug: string | null;
  clawhubDetail: ClawHubSkillDetail | null;
  clawhubImporting: string | null;
  clawhubMessage: ClawHubMessage | null;
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function searchClawHub(state: ClawHubState, query: string) {
  if (!state.client || !state.connected) return;
  if (!query.trim()) {
    state.clawhubResults = null;
    return;
  }
  state.clawhubLoading = true;
  state.clawhubError = null;
  state.clawhubMessage = null;
  try {
    const res = await state.client.request("clawhub.search", {
      query: query.trim(),
      limit: 25,
    });
    if (res?.results) {
      state.clawhubResults = res.results;
    }
  } catch (err) {
    state.clawhubError = getErrorMessage(err);
  } finally {
    state.clawhubLoading = false;
  }
}

export async function exploreClawHub(state: ClawHubState, sort?: string) {
  if (!state.client || !state.connected) return;
  state.clawhubLoading = true;
  state.clawhubError = null;
  state.clawhubMessage = null;
  if (sort) state.clawhubExploreSort = sort;
  try {
    const res = await state.client.request("clawhub.explore", {
      sort: state.clawhubExploreSort,
      limit: 30,
    });
    if (res?.items) {
      state.clawhubExploreItems = res.items;
    }
  } catch (err) {
    state.clawhubError = getErrorMessage(err);
  } finally {
    state.clawhubLoading = false;
  }
}

export async function getClawHubDetail(state: ClawHubState, slug: string) {
  if (!state.client || !state.connected) return;
  state.clawhubDetailSlug = slug;
  state.clawhubDetail = null;
  state.clawhubLoading = true;
  state.clawhubError = null;
  try {
    const res = await state.client.request("clawhub.detail", { slug });
    if (res) {
      state.clawhubDetail = res;
    }
  } catch (err) {
    state.clawhubError = getErrorMessage(err);
  } finally {
    state.clawhubLoading = false;
  }
}

export async function importFromClawHub(
  state: ClawHubState,
  slug: string,
  version?: string,
): Promise<boolean> {
  if (!state.client || !state.connected) return false;
  state.clawhubImporting = slug;
  state.clawhubError = null;
  state.clawhubMessage = null;
  try {
    const res = await state.client.request("clawhub.import", { slug, version });
    const displayName = res?.displayName ?? slug;
    state.clawhubMessage = {
      kind: "success",
      message: `Imported "${displayName}" v${res?.version ?? "latest"}`,
    };
    if (res?.suspicious) {
      state.clawhubMessage = {
        kind: "success",
        message: `Imported "${displayName}" — review before use (flagged as suspicious)`,
      };
    }
    return true;
  } catch (err) {
    state.clawhubMessage = { kind: "error", message: getErrorMessage(err) };
    return false;
  } finally {
    state.clawhubImporting = null;
  }
}

export async function getPersonalizePrompt(
  state: ClawHubState,
  slug: string,
): Promise<string | null> {
  if (!state.client || !state.connected) return null;
  try {
    const res = await state.client.request("clawhub.personalizeContext", { slug });
    return res?.personalizePrompt ?? null;
  } catch {
    return null;
  }
}

export function clearClawHubDetail(state: ClawHubState) {
  state.clawhubDetailSlug = null;
  state.clawhubDetail = null;
}
