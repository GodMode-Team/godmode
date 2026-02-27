/**
 * Focus Pulse controller — RPC helpers for the Focus Pulse feature.
 */
import type { GodModeApp } from "../app.js";

export type FocusPulseItem = {
  index: number;
  title: string;
  context: string;
  completed: boolean;
};

export type FocusPulseData = {
  active: boolean;
  morningSetDone: boolean;
  currentFocus: { index: number; title: string; context: string } | null;
  items: FocusPulseItem[];
  score: number;
  streak: number;
  aligned: boolean;
  lastCheckReason: string;
};

export async function loadFocusPulse(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request<FocusPulseData>(
      "focusPulse.getState",
      {},
    );
    host.focusPulseData = result;
  } catch {
    // Focus Pulse may not be registered — silent fail
    host.focusPulseData = null;
  }
}

export async function startMorningSet(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request<{
      items: FocusPulseItem[];
      noteFound: boolean;
      message: string;
    }>("focusPulse.startMorningSet", {});
    host.showToast(result.message, "info", 4000);
    await loadFocusPulse(host);
  } catch (err) {
    host.showToast("Failed to start morning set", "error");
    console.error("[FocusPulse] startMorningSet error:", err);
  }
}

export async function setFocus(
  host: GodModeApp,
  index: number,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request<{
      currentFocus: FocusPulseItem;
      message: string;
    }>("focusPulse.setFocus", { index });
    host.showToast(result.message, "success", 3000);
    await loadFocusPulse(host);
  } catch (err) {
    host.showToast("Failed to set focus", "error");
    console.error("[FocusPulse] setFocus error:", err);
  }
}

export async function completeFocus(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request<{
      completed: string;
      nextFocus: string | null;
      message: string;
    }>("focusPulse.complete", {});
    host.showToast(result.message, "success", 4000);
    await loadFocusPulse(host);
  } catch (err) {
    host.showToast("Failed to complete focus", "error");
    console.error("[FocusPulse] completeFocus error:", err);
  }
}

export async function runPulseCheck(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("focusPulse.pulseCheck", {});
    await loadFocusPulse(host);
  } catch (err) {
    console.error("[FocusPulse] pulseCheck error:", err);
  }
}

export async function endDay(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request<{
      score: number;
      streak: number;
      message: string;
    }>("focusPulse.endDay", {});
    host.showToast(result.message, "info", 5000);
    await loadFocusPulse(host);
  } catch (err) {
    host.showToast("Failed to end day", "error");
    console.error("[FocusPulse] endDay error:", err);
  }
}
