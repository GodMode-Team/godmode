/**
 * Second Brain Controller
 * Loads context profile data from Obsidian vault (PARA structure) via gateway RPC.
 * Falls back to ~/godmode/memory/ when vault is unavailable.
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
  ResearchAddForm,
  CommunityResourcesData,
  CommunityResourceAddForm,
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
  secondBrainResearchAddFormOpen?: boolean;
  secondBrainResearchAddForm?: ResearchAddForm;
  secondBrainResearchCategories?: string[];
  secondBrainSelectedEntry?: SecondBrainEntryDetail | null;
  secondBrainSearchQuery?: string;
  secondBrainSyncing?: boolean;
  secondBrainBrowsingFolder?: string | null;
  secondBrainFolderEntries?: SecondBrainMemoryBankData["sections"][0]["entries"] | null;
  secondBrainFolderName?: string | null;
  secondBrainCommunityResources?: CommunityResourcesData | null;
  secondBrainCommunityResourceAddFormOpen?: boolean;
  secondBrainCommunityResourceAddForm?: CommunityResourceAddForm;
  secondBrainVaultHealth?: VaultHealthData | null;
};

/** Load vault health stats (called alongside any subtab load). */
export async function loadVaultHealth(state: SecondBrainState): Promise<void> {
  if (!state.client || !state.connected) return;
  try {
    const result = await state.client.request<VaultHealthData>("secondBrain.vaultHealth", {});
    state.secondBrainVaultHealth = result;
  } catch {
    // Non-critical — vault health is supplemental
  }
}

export async function loadSecondBrain(state: SecondBrainState): Promise<void> {
  if (!state.client || !state.connected) return;

  const subtab = state.secondBrainSubtab ?? "identity";
  state.secondBrainLoading = true;
  state.secondBrainError = null;

  // Always load vault health alongside the current subtab
  loadVaultHealth(state).catch(() => {});

  try {
    if (subtab === "identity") {
      const result = await state.client.request<SecondBrainIdentityData>("secondBrain.identity", {});
      state.secondBrainIdentity = result;
    } else if (subtab === "memory-bank") {
      const result = await state.client.request<SecondBrainMemoryBankData>("secondBrain.memoryBank", {});
      state.secondBrainMemoryBank = result;
      state.secondBrainBrowsingFolder = null;
      state.secondBrainFolderEntries = null;
      state.secondBrainFolderName = null;
    } else if (subtab === "ai-packet") {
      const result = await state.client.request<SecondBrainAiPacketData>("secondBrain.aiPacket", {});
      state.secondBrainAiPacket = result;
    } else if (subtab === "sources") {
      const result = await state.client.request<SecondBrainSourcesData>("secondBrain.sources", {});
      state.secondBrainSourcesData = result;
    } else if (subtab === "research") {
      const result = await state.client.request<SecondBrainResearchData>("secondBrain.research", {});
      state.secondBrainResearchData = result;
      state.secondBrainBrowsingFolder = null;
      state.secondBrainFolderEntries = null;
      state.secondBrainFolderName = null;
      try {
        const cats = await state.client.request<{ categories: string[] }>("secondBrain.researchCategories", {});
        state.secondBrainResearchCategories = cats.categories;
      } catch { /* non-critical */ }
    } else if (subtab === "resources") {
      const result = await state.client.request<CommunityResourcesData>("secondBrain.communityResources", {});
      state.secondBrainCommunityResources = result;
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
      consciousness: SecondBrainAiPacketData["consciousness"];
      working: SecondBrainAiPacketData["working"];
    }>("secondBrain.sync", {});

    state.secondBrainAiPacket = {
      consciousness: result.consciousness ?? null,
      working: result.working ?? null,
    } as SecondBrainAiPacketData;
  } catch (err) {
    console.error("[SecondBrain] Sync failed:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Sync failed";
  } finally {
    state.secondBrainSyncing = false;
  }
}

export async function addResearch(state: SecondBrainState): Promise<void> {
  if (!state.client || !state.connected) return;
  const form = state.secondBrainResearchAddForm;
  if (!form || !form.title.trim()) return;

  state.secondBrainLoading = true;
  try {
    const tags = form.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    await state.client.request("secondBrain.addResearch", {
      title: form.title.trim(),
      url: form.url.trim() || undefined,
      category: form.category.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      notes: form.notes.trim() || undefined,
      source: "manual",
    });

    // Reset form and refresh
    state.secondBrainResearchAddForm = { title: "", url: "", category: "", tags: "", notes: "" };
    state.secondBrainResearchAddFormOpen = false;

    const result = await state.client.request<SecondBrainResearchData>("secondBrain.research", {});
    state.secondBrainResearchData = result;
    try {
      const cats = await state.client.request<{ categories: string[] }>("secondBrain.researchCategories", {});
      state.secondBrainResearchCategories = cats.categories;
    } catch { /* non-critical */ }
  } catch (err) {
    console.error("[SecondBrain] Failed to add research:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Failed to add research";
  } finally {
    state.secondBrainLoading = false;
  }
}

export async function addCommunityResource(state: SecondBrainState): Promise<void> {
  if (!state.client || !state.connected) return;
  const form = state.secondBrainCommunityResourceAddForm;
  if (!form || !form.url.trim()) return;

  state.secondBrainLoading = true;
  try {
    const tags = form.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    await state.client.request("secondBrain.communityResourcesAdd", {
      url: form.url.trim(),
      label: form.label.trim() || undefined,
      description: form.description.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    // Reset form and refresh
    state.secondBrainCommunityResourceAddForm = { url: "", label: "", description: "", tags: "" };
    state.secondBrainCommunityResourceAddFormOpen = false;

    const result = await state.client.request<CommunityResourcesData>("secondBrain.communityResources", {});
    state.secondBrainCommunityResources = result;
  } catch (err) {
    console.error("[SecondBrain] Failed to add community resource:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Failed to add resource";
  } finally {
    state.secondBrainLoading = false;
  }
}

export async function removeCommunityResource(state: SecondBrainState, id: string): Promise<void> {
  if (!state.client || !state.connected) return;

  state.secondBrainLoading = true;
  try {
    await state.client.request("secondBrain.communityResourcesRemove", { id });

    const result = await state.client.request<CommunityResourcesData>("secondBrain.communityResources", {});
    state.secondBrainCommunityResources = result;
  } catch (err) {
    console.error("[SecondBrain] Failed to remove community resource:", err);
    state.secondBrainError = err instanceof Error ? err.message : "Failed to remove resource";
  } finally {
    state.secondBrainLoading = false;
  }
}
