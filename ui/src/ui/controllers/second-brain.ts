/**
 * Second Brain Controller
 * Loads context profile data from Obsidian vault (PARA structure) via gateway RPC.
 * 3-tab model: Identity | Knowledge | Context
 */

import type { GatewayBrowserClient } from "../gateway";
import type {
  SecondBrainAiPacketData,
  SecondBrainEntryDetail,
  SecondBrainIdentityData,
  SecondBrainMemoryBankData,
  SecondBrainResearchData,
  SecondBrainSourcesData,
  SecondBrainSubtab,
  BrainTreeNode,
  VaultHealthData,
} from "../views/second-brain";

export type SecondBrainState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  secondBrainSubtab?: SecondBrainSubtab;
  secondBrainLoading?: boolean;
  secondBrainError?: string | null;
  secondBrainIdentity?: SecondBrainIdentityData | null;
  secondBrainMemoryBank?: SecondBrainMemoryBankData | null;
  secondBrainAiPacket?: SecondBrainAiPacketData | null;
  secondBrainSourcesData?: SecondBrainSourcesData | null;
  secondBrainResearchData?: SecondBrainResearchData | null;
  secondBrainSelectedEntry?: SecondBrainEntryDetail | null;
  secondBrainSearchQuery?: string;
  secondBrainSyncing?: boolean;
  secondBrainBrowsingFolder?: string | null;
  secondBrainFolderEntries?: SecondBrainMemoryBankData["sections"][0]["entries"] | null;
  secondBrainFolderName?: string | null;
  secondBrainVaultHealth?: VaultHealthData | null;
  secondBrainFileTree?: BrainTreeNode[] | null;
  secondBrainFileTreeLoading?: boolean;
  secondBrainFileSearchQuery?: string;
  secondBrainFileSearchResults?: import("../views/second-brain").BrainSearchResult[] | null;
};

export async function loadSecondBrain(state: SecondBrainState): Promise<void> {
  if (!state.client || !state.connected) return;

  const subtab = state.secondBrainSubtab ?? "identity";
  state.secondBrainLoading = true;
  state.secondBrainError = null;

  try {
    if (subtab === "identity") {
      const result = await state.client.request<SecondBrainIdentityData>("secondBrain.identity", {});
      state.secondBrainIdentity = result;
    } else if (subtab === "knowledge") {
      // Load memory bank + research + file tree in parallel
      const [memoryBank, research, fileTree] = await Promise.all([
        state.client.request<SecondBrainMemoryBankData>("secondBrain.memoryBank", {}),
        state.client.request<SecondBrainResearchData>("secondBrain.research", {}),
        state.client.request<{ tree: BrainTreeNode[] }>("secondBrain.fileTree", { depth: 4 }),
      ]);
      state.secondBrainMemoryBank = memoryBank;
      state.secondBrainResearchData = research;
      state.secondBrainFileTree = fileTree.tree ?? [];
      state.secondBrainBrowsingFolder = null;
      state.secondBrainFolderEntries = null;
      state.secondBrainFolderName = null;
    } else if (subtab === "context") {
      // Load ai packet + sources + vault health in parallel
      const [aiPacket, sources, vaultHealth] = await Promise.all([
        state.client.request<SecondBrainAiPacketData>("secondBrain.aiPacket", {}),
        state.client.request<SecondBrainSourcesData>("secondBrain.sources", {}),
        state.client.request<VaultHealthData>("secondBrain.vaultHealth", {}),
      ]);
      state.secondBrainAiPacket = aiPacket;
      state.secondBrainSourcesData = sources;
      state.secondBrainVaultHealth = vaultHealth;
    }
  } catch (err) {
    console.error("[SecondBrain] Failed to load:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Failed to load Second Brain data";
  } finally {
    state.secondBrainLoading = false;
  }
}

export async function browseFolder(state: SecondBrainState, folderPath: string): Promise<void> {
  if (!state.client || !state.connected) return;

  state.secondBrainLoading = true;
  try {
    const result = await state.client.request<{
      folder: string;
      folderName: string;
      entries: SecondBrainMemoryBankData["sections"][0]["entries"];
    }>("secondBrain.memoryBank", { folder: folderPath });
    state.secondBrainBrowsingFolder = result.folder;
    state.secondBrainFolderName = result.folderName;
    state.secondBrainFolderEntries = result.entries;
  } catch (err) {
    console.error("[SecondBrain] Failed to browse folder:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Failed to browse folder";
  } finally {
    state.secondBrainLoading = false;
  }
}

export async function loadSecondBrainEntry(state: SecondBrainState, path: string): Promise<void> {
  if (!state.client || !state.connected) return;

  state.secondBrainLoading = true;
  try {
    const result = await state.client.request<SecondBrainEntryDetail>("secondBrain.memoryBankEntry", { path });
    state.secondBrainSelectedEntry = result;
  } catch (err) {
    console.error("[SecondBrain] Failed to load entry:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Failed to load entry";
  } finally {
    state.secondBrainLoading = false;
  }
}

export async function syncSecondBrain(state: SecondBrainState): Promise<void> {
  if (!state.client || !state.connected) return;

  state.secondBrainSyncing = true;
  try {
    const result = await state.client.request<{
      ok: boolean;
      snapshot?: { content: string; updatedAt?: string; lineCount: number };
    }>("secondBrain.sync", {});

    state.secondBrainAiPacket = {
      snapshot: result.snapshot ?? null,
    };
  } catch (err) {
    console.error("[SecondBrain] Sync failed:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Sync failed";
  } finally {
    state.secondBrainSyncing = false;
  }
}
