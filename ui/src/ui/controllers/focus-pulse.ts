/**
 * Focus Pulse controller — RETIRED in lean audit.
 * Type export kept for backward compat with app-view-state.ts.
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

/** No-op stubs — focus pulse service was removed in lean audit. */
export async function loadFocusPulse(_host: GodModeApp): Promise<void> {}
export async function startMorningSet(_host: GodModeApp): Promise<void> {}
export async function setFocus(_host: GodModeApp, _index: number): Promise<void> {}
export async function completeFocus(_host: GodModeApp): Promise<void> {}
export async function runPulseCheck(_host: GodModeApp): Promise<void> {}
export async function endDay(_host: GodModeApp): Promise<void> {}
