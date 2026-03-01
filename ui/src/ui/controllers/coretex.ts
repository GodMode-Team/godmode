/**
 * CoreTex Controller
 * Loads context profile data from ~/godmode/memory/ via gateway RPC
 */

import type { GatewayBrowserClient } from "../gateway";
import type {
  CoreTexAiPacketData,
  CoreTexEntryDetail,
  CoreTexIdentityData,
  CoreTexMemoryBankData,
  CoreTexResearchData,
  CoreTexSourcesData,
  CoreTexSubtab,
  ResearchAddForm,
} from "../views/coretex";

export type CoreTexState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  coretexSubtab?: CoreTexSubtab;
  coretexLoading?: boolean;
  coretexError?: string | null;
  coretexIdentity?: CoreTexIdentityData | null;
  coretexMemoryBank?: CoreTexMemoryBankData | null;
  coretexAiPacket?: CoreTexAiPacketData | null;
  coretexSourcesData?: CoreTexSourcesData | null;
  coretexResearchData?: CoreTexResearchData | null;
  coretexResearchAddFormOpen?: boolean;
  coretexResearchAddForm?: ResearchAddForm;
  coretexResearchCategories?: string[];
  coretexSelectedEntry?: CoreTexEntryDetail | null;
  coretexSearchQuery?: string;
  coretexSyncing?: boolean;
  coretexBrowsingFolder?: string | null;
  coretexFolderEntries?: CoreTexMemoryBankData["sections"][0]["entries"] | null;
  coretexFolderName?: string | null;
};

export async function loadCoretex(state: CoreTexState): Promise<void> {
  if (!state.client || !state.connected) return;

  const subtab = state.coretexSubtab ?? "identity";
  state.coretexLoading = true;
  state.coretexError = null;

  try {
    if (subtab === "identity") {
      const result = await state.client.request<CoreTexIdentityData>("coretex.identity", {});
      state.coretexIdentity = result;
    } else if (subtab === "memory-bank") {
      const result = await state.client.request<CoreTexMemoryBankData>("coretex.memoryBank", {});
      state.coretexMemoryBank = result;
      state.coretexBrowsingFolder = null;
      state.coretexFolderEntries = null;
      state.coretexFolderName = null;
    } else if (subtab === "ai-packet") {
      const result = await state.client.request<CoreTexAiPacketData>("coretex.aiPacket", {});
      state.coretexAiPacket = result;
    } else if (subtab === "sources") {
      const result = await state.client.request<CoreTexSourcesData>("coretex.sources", {});
      state.coretexSourcesData = result;
    } else if (subtab === "research") {
      const result = await state.client.request<CoreTexResearchData>("coretex.research", {});
      state.coretexResearchData = result;
      state.coretexBrowsingFolder = null;
      state.coretexFolderEntries = null;
      state.coretexFolderName = null;
      try {
        const cats = await state.client.request<{ categories: string[] }>("coretex.researchCategories", {});
        state.coretexResearchCategories = cats.categories;
      } catch { /* non-critical */ }
    }
  } catch (err) {
    console.error("[CoreTex] Failed to load:", err);
    state.coretexError = err instanceof Error ? err.message : "Failed to load CoreTex data";
  } finally {
    state.coretexLoading = false;
  }
}

export async function browseFolder(state: CoreTexState, folderPath: string): Promise<void> {
  if (!state.client || !state.connected) return;

  state.coretexLoading = true;
  try {
    const result = await state.client.request<{
      folder: string;
      folderName: string;
      entries: CoreTexMemoryBankData["sections"][0]["entries"];
    }>("coretex.memoryBank", { folder: folderPath });
    state.coretexBrowsingFolder = result.folder;
    state.coretexFolderName = result.folderName;
    state.coretexFolderEntries = result.entries;
  } catch (err) {
    console.error("[CoreTex] Failed to browse folder:", err);
    state.coretexError = err instanceof Error ? err.message : "Failed to browse folder";
  } finally {
    state.coretexLoading = false;
  }
}

export async function loadCoretexEntry(state: CoreTexState, path: string): Promise<void> {
  if (!state.client || !state.connected) return;

  state.coretexLoading = true;
  try {
    const result = await state.client.request<CoreTexEntryDetail>("coretex.memoryBankEntry", { path });
    state.coretexSelectedEntry = result;
  } catch (err) {
    console.error("[CoreTex] Failed to load entry:", err);
    state.coretexError = err instanceof Error ? err.message : "Failed to load entry";
  } finally {
    state.coretexLoading = false;
  }
}

export async function syncCoretex(state: CoreTexState): Promise<void> {
  if (!state.client || !state.connected) return;

  state.coretexSyncing = true;
  try {
    const result = await state.client.request<{
      ok: boolean;
      consciousness: CoreTexAiPacketData["consciousness"];
      working: CoreTexAiPacketData["working"];
    }>("coretex.sync", {});

    state.coretexAiPacket = {
      consciousness: result.consciousness ?? null,
      working: result.working ?? null,
    } as CoreTexAiPacketData;
  } catch (err) {
    console.error("[CoreTex] Sync failed:", err);
    state.coretexError = err instanceof Error ? err.message : "Sync failed";
  } finally {
    state.coretexSyncing = false;
  }
}

export async function addResearch(state: CoreTexState): Promise<void> {
  if (!state.client || !state.connected) return;
  const form = state.coretexResearchAddForm;
  if (!form || !form.title.trim()) return;

  state.coretexLoading = true;
  try {
    const tags = form.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    await state.client.request("coretex.addResearch", {
      title: form.title.trim(),
      url: form.url.trim() || undefined,
      category: form.category.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      notes: form.notes.trim() || undefined,
      source: "manual",
    });

    // Reset form and refresh
    state.coretexResearchAddForm = { title: "", url: "", category: "", tags: "", notes: "" };
    state.coretexResearchAddFormOpen = false;

    const result = await state.client.request<CoreTexResearchData>("coretex.research", {});
    state.coretexResearchData = result;
    try {
      const cats = await state.client.request<{ categories: string[] }>("coretex.researchCategories", {});
      state.coretexResearchCategories = cats.categories;
    } catch { /* non-critical */ }
  } catch (err) {
    console.error("[CoreTex] Failed to add research:", err);
    state.coretexError = err instanceof Error ? err.message : "Failed to add research";
  } finally {
    state.coretexLoading = false;
  }
}
