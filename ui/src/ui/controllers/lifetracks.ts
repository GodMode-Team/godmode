import { localDateString } from "../format.js";
import type { GatewayBrowserClient } from "../gateway.js";
import type { LifetracksConfig } from "../views/lifetracks.js";

export type LifetrackEntry = {
  date: string;
  url: string;
  pathname: string;
  contentType?: string;
  size?: number;
  title?: string;
  generatedAt?: string;
};

export type LifetracksState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  lifetracksLoading?: boolean;
  lifetracksError?: string | null;
  lifetracksData?: LifetrackEntry[] | null;
  lifetracksCurrentTrack?: LifetrackEntry | null;
  lifetracksPlaying?: boolean;
  lifetracksConfig?: LifetracksConfig | null;
  lifetracksGenerating?: boolean;
  lifetracksGenerationError?: string | null;
};

/**
 * Load LifeTracks config from gateway
 */
export async function loadLifetracksConfig(state: LifetracksState): Promise<void> {
  if (!state.client || !state.connected) {
    return;
  }

  try {
    const result = await state.client.request<LifetracksConfig>("lifetracks.config.get", {});
    if (result) {
      state.lifetracksConfig = result;
    }
  } catch (err) {
    console.error("Failed to load lifetracks config:", err);
  }
}

/**
 * Load all Lifetracks from gateway
 */
export async function loadLifetracks(state: LifetracksState): Promise<void> {
  if (!state.client || !state.connected) {
    state.lifetracksError = "Not connected to gateway";
    return;
  }

  state.lifetracksLoading = true;
  state.lifetracksError = null;

  try {
    // Load config first
    await loadLifetracksConfig(state);

    const result = await state.client.request<{
      lifetracks: LifetrackEntry[];
      total: number;
      enabled?: boolean;
      message?: string;
    }>("lifetracks.list", {});

    if (result?.lifetracks) {
      state.lifetracksData = result.lifetracks;

      // Set current track to today's or most recent
      if (result.lifetracks.length > 0) {
        const today = localDateString();
        const todayTrack = result.lifetracks.find((t) => t.date === today);
        state.lifetracksCurrentTrack = todayTrack || result.lifetracks[0];
      } else {
        state.lifetracksCurrentTrack = null;
      }
    } else {
      state.lifetracksData = [];
      state.lifetracksCurrentTrack = null;
    }
  } catch (err) {
    state.lifetracksError = err instanceof Error ? err.message : "Failed to load lifetracks";
  } finally {
    state.lifetracksLoading = false;
  }
}

/**
 * Select a specific Lifetrack to play
 */
export function selectLifetrack(state: LifetracksState, track: LifetrackEntry): void {
  state.lifetracksCurrentTrack = track;
}

/**
 * Enable LifeTracks feature
 */
export async function enableLifetracks(state: LifetracksState): Promise<boolean> {
  if (!state.client || !state.connected) {
    state.lifetracksError = "Not connected to gateway";
    return false;
  }

  try {
    const result = await state.client.request<{ updated: boolean; config: LifetracksConfig }>(
      "lifetracks.config.update",
      { enabled: true },
    );

    if (result?.updated) {
      state.lifetracksConfig = result.config;
      // Reload tracks list
      await loadLifetracks(state);
      return true;
    }
    return false;
  } catch (err) {
    state.lifetracksError = err instanceof Error ? err.message : "Failed to enable lifetracks";
    return false;
  }
}

/**
 * Disable LifeTracks feature
 */
export async function disableLifetracks(state: LifetracksState): Promise<boolean> {
  if (!state.client || !state.connected) {
    state.lifetracksError = "Not connected to gateway";
    return false;
  }

  try {
    const result = await state.client.request<{ updated: boolean; config: LifetracksConfig }>(
      "lifetracks.config.update",
      { enabled: false },
    );

    if (result?.updated) {
      state.lifetracksConfig = result.config;
      return true;
    }
    return false;
  } catch (err) {
    state.lifetracksError = err instanceof Error ? err.message : "Failed to disable lifetracks";
    return false;
  }
}

/**
 * Generate a LifeTrack for today
 */
export async function generateLifetrack(
  state: LifetracksState,
  options?: { date?: string; force?: boolean },
): Promise<boolean> {
  if (!state.client || !state.connected) {
    state.lifetracksGenerationError = "Not connected to gateway";
    return false;
  }

  state.lifetracksGenerating = true;
  state.lifetracksGenerationError = null;

  try {
    const result = await state.client.request<{
      generated: boolean;
      track?: LifetrackEntry;
      error?: string;
      alreadyExists?: boolean;
    }>("lifetracks.generate", options || {});

    if (result?.generated && result.track) {
      // Add new track to the list
      state.lifetracksData = [result.track, ...(state.lifetracksData || [])];
      state.lifetracksCurrentTrack = result.track;

      // Reload config to get updated stats
      await loadLifetracksConfig(state);
      return true;
    }

    if (result?.alreadyExists && result.track) {
      // Track already exists, just select it
      state.lifetracksCurrentTrack = result.track;
      return true;
    }

    state.lifetracksGenerationError = result?.error || "Generation failed";
    return false;
  } catch (err) {
    state.lifetracksGenerationError =
      err instanceof Error ? err.message : "Failed to generate lifetrack";
    return false;
  } finally {
    state.lifetracksGenerating = false;
  }
}

/**
 * Check prerequisites for generation
 */
export async function checkLifetrackPrerequisites(state: LifetracksState): Promise<{
  ready: boolean;
  missingItems: string[];
}> {
  if (!state.client || !state.connected) {
    return { ready: false, missingItems: ["Gateway connection"] };
  }

  try {
    const result = await state.client.request<{
      ready: boolean;
      ffmpeg: boolean;
      anthropicKey: boolean;
      elevenLabsKey: boolean;
      missingItems: string[];
    }>("lifetracks.prerequisites", {});

    return {
      ready: result?.ready ?? false,
      missingItems: result?.missingItems ?? [],
    };
  } catch (err) {
    return { ready: false, missingItems: ["Failed to check prerequisites"] };
  }
}

/**
 * Get generation stats
 */
export async function getLifetrackStats(state: LifetracksState): Promise<{
  totalGenerated: number;
  estimatedTotalCost: number;
  currentTrackCount: number;
} | null> {
  if (!state.client || !state.connected) {
    return null;
  }

  try {
    const result = await state.client.request<{
      totalGenerated: number;
      estimatedTotalCost: number;
      currentTrackCount: number;
    }>("lifetracks.stats", {});

    return result ?? null;
  } catch {
    return null;
  }
}
