/**
 * People Controller
 * Loads contacts from ~/godmode/data/people/ via gateway RPC
 */

import type { GatewayBrowserClient } from "../gateway";
import type { Person } from "../views/people";

export type PeopleState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  peopleList?: Person[];
  peopleLoading?: boolean;
  peopleError?: string | null;
  peopleSelected?: string | null;
  peopleSearchQuery?: string;
};

export async function loadPeople(state: PeopleState): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }
  state.peopleLoading = true;
  state.peopleError = null;

  try {
    const result = await state.client.request<{
      people: Person[];
    }>("people.list", {});
    state.peopleList = result.people ?? [];
  } catch (err) {
    console.error("[People] Failed to load contacts:", err);
    state.peopleError = err instanceof Error ? err.message : "Failed to load contacts";
  } finally {
    state.peopleLoading = false;
  }
}

export async function searchPeople(client: GatewayBrowserClient, query: string): Promise<Person[]> {
  try {
    const result = await client.request<{
      people: Person[];
    }>("people.search", { query });
    return result.people ?? [];
  } catch (err) {
    console.error("[People] Search failed:", err);
    return [];
  }
}
