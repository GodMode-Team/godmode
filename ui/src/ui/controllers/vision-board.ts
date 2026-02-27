import type { GatewayBrowserClient } from "../gateway.js";
import type { VisionBoardData } from "../views/vision-board.js";

export type VisionBoardState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  visionBoardLoading?: boolean;
  visionBoardError?: string | null;
  visionBoardData?: VisionBoardData | null;
  visionBoardIdentityToday?: string | null;
};

/**
 * Load Vision Board data from gateway
 */
export async function loadVisionBoard(state: VisionBoardState): Promise<void> {
  if (!state.client || !state.connected) {
    state.visionBoardError = "Not connected to gateway";
    return;
  }

  state.visionBoardLoading = true;
  state.visionBoardError = null;

  try {
    // Load vision board data and today's identity in parallel
    const [boardResult, identityResult] = await Promise.all([
      state.client.request<VisionBoardData>("visionBoard.get", {}),
      state.client.request<{ identity: string | null }>("visionBoard.identityToday", {}),
    ]);

    if (boardResult) {
      state.visionBoardData = boardResult;
    } else {
      state.visionBoardError = "No data returned";
    }

    if (identityResult) {
      state.visionBoardIdentityToday = identityResult.identity;
    }
  } catch (err) {
    state.visionBoardError = err instanceof Error ? err.message : "Failed to load vision board";
  } finally {
    state.visionBoardLoading = false;
  }
}

/**
 * Update Vision Board data
 */
export async function updateVisionBoard(
  state: VisionBoardState,
  updates: Partial<VisionBoardData>,
): Promise<boolean> {
  if (!state.client || !state.connected) {
    state.visionBoardError = "Not connected to gateway";
    return false;
  }

  try {
    const result = await state.client.request<{ updated: boolean }>("visionBoard.update", updates);

    if (result?.updated) {
      // Reload data after update
      await loadVisionBoard(state);
      return true;
    }
    return false;
  } catch (err) {
    state.visionBoardError = err instanceof Error ? err.message : "Failed to update vision board";
    return false;
  }
}
