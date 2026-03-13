import type { GatewayBrowserClient } from "../gateway";
import type { AgentsListResult } from "../types";
import type { RosterAgent } from "../views/agents";

export type AgentsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  agentsLoading: boolean;
  agentsError: string | null;
  agentsList: AgentsListResult | null;
};

export type RosterState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  rosterLoading: boolean;
  rosterError: string | null;
  rosterData: RosterAgent[];
};

export async function loadAgents(state: AgentsState) {
  if (!state.client || !state.connected) return;
  if (state.agentsLoading) return;
  state.agentsLoading = true;
  state.agentsError = null;
  try {
    const res = (await state.client.request("agents.list", {})) as AgentsListResult | undefined;
    if (res) state.agentsList = res;
  } catch (err) {
    state.agentsError = String(err);
  } finally {
    state.agentsLoading = false;
  }
}

export async function loadRoster(state: RosterState) {
  if (!state.client || !state.connected) return;
  if (state.rosterLoading) return;
  state.rosterLoading = true;
  state.rosterError = null;
  try {
    const res = await state.client.request<{ roster: RosterAgent[] }>("queue.roster", {});
    if (res?.roster) state.rosterData = res.roster;
  } catch (err) {
    state.rosterError = String(err);
  } finally {
    state.rosterLoading = false;
  }
}
