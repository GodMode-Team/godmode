import type { GatewayBrowserClient } from "../gateway.js";
import type { WheelOfLifeData } from "../views/wheel-of-life.js";

export type WheelOfLifeState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  wheelOfLifeLoading?: boolean;
  wheelOfLifeError?: string | null;
  wheelOfLifeData?: WheelOfLifeData | null;
  wheelOfLifeEditMode?: boolean;
};

/**
 * Load Wheel of Life data from gateway
 */
export async function loadWheelOfLife(state: WheelOfLifeState): Promise<void> {
  if (!state.client || !state.connected) {
    state.wheelOfLifeError = "Not connected to gateway";
    return;
  }

  state.wheelOfLifeLoading = true;
  state.wheelOfLifeError = null;

  try {
    const result = await state.client.request<WheelOfLifeData>("wheelOfLife.get", {});

    if (result) {
      state.wheelOfLifeData = result;
    } else {
      state.wheelOfLifeError = "No data returned";
    }
  } catch (err) {
    state.wheelOfLifeError = err instanceof Error ? err.message : "Failed to load wheel data";
  } finally {
    state.wheelOfLifeLoading = false;
  }
}

/**
 * Update spoke scores
 */
export async function updateWheelOfLife(
  state: WheelOfLifeState,
  updates: Record<string, { current?: number; target?: number }>,
): Promise<boolean> {
  if (!state.client || !state.connected) {
    state.wheelOfLifeError = "Not connected to gateway";
    return false;
  }

  try {
    const result = await state.client.request<{ updated: boolean }>("wheelOfLife.update", {
      updates,
    });

    if (result?.updated) {
      // Reload data after update
      await loadWheelOfLife(state);
      return true;
    }
    return false;
  } catch (err) {
    state.wheelOfLifeError = err instanceof Error ? err.message : "Failed to update wheel";
    return false;
  }
}

/**
 * Enter edit mode
 */
export function enterWheelEditMode(state: WheelOfLifeState): void {
  state.wheelOfLifeEditMode = true;
}

/**
 * Exit edit mode without saving
 */
export function cancelWheelEditMode(state: WheelOfLifeState): void {
  state.wheelOfLifeEditMode = false;
}
