/**
 * Setup controller — RPC helpers for the Setup tab (quick onboarding).
 */
import type { GodModeApp } from "../app.js";

type OnboardingChecklist = {
  milestones: Array<{
    id: string;
    phase: number;
    title: string;
    description: string;
    emoji: string;
    status: "complete" | "in-progress" | "locked";
    steps: Array<{
      id: string;
      label: string;
      completed: boolean;
      detail?: string;
    }>;
  }>;
  percentComplete: number;
  currentPhase: number;
  completedAt: string | null;
};

type OnboardingState = {
  phase: number;
  completedPhases: number[];
  identity: { name: string; mission: string; emoji: string } | null;
  completedAt: string | null;
  [key: string]: unknown;
};

export async function loadChecklist(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  const app = host as unknown as {
    setupChecklist: OnboardingChecklist | null;
    setupChecklistLoading: boolean;
  };
  app.setupChecklistLoading = true;
  try {
    const result = await host.client.request<OnboardingChecklist>(
      "onboarding.checklist",
      {},
    );
    app.setupChecklist = result;
  } catch {
    app.setupChecklist = null;
  } finally {
    app.setupChecklistLoading = false;
  }
}

export async function loadOnboardingStatus(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  const app = host as unknown as {
    onboardingData: OnboardingState | null;
    showSetupTab: boolean;
    setupQuickDone: boolean;
  };
  try {
    const result = await host.client.request<OnboardingState>(
      "onboarding.status",
      {},
    );
    app.onboardingData = result;
    app.showSetupTab = !result.completedAt;
    app.setupQuickDone = Boolean(result.identity?.name);
  } catch {
    // Onboarding methods may not be registered — silent fail
  }
}

export async function quickSetup(
  host: GodModeApp,
  name: string,
  licenseKey: string,
  dailyIntelTopics: string,
): Promise<boolean> {
  if (!host.client) return false;
  try {
    // If license key provided, activate it first
    if (licenseKey) {
      await host.client.request("onboarding.activateLicense", { key: licenseKey });
    }
    // Run quick setup
    const result = await host.client.request<{ state: OnboardingState }>(
      "onboarding.quickSetup",
      { name, dailyIntelTopics },
    );
    const app = host as unknown as {
      onboardingData: OnboardingState | null;
      setupQuickDone: boolean;
      showSetupTab: boolean;
      onboardingActive: boolean;
    };
    app.onboardingData = result.state;
    app.setupQuickDone = true;
    app.onboardingActive = false;
    host.showToast(`Welcome, ${name}!`, "success", 3000);
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Setup failed";
    host.showToast(msg, "error");
    console.error("[Setup] quickSetup error:", err);
    return false;
  }
}

export async function hideSetup(host: GodModeApp): Promise<void> {
  if (!host.client) return;
  try {
    await host.client.request("godmode.options.set", {
      key: "onboarding.hidden",
      value: true,
    });
    const app = host as unknown as { showSetupTab: boolean };
    app.showSetupTab = false;
    host.showToast("Setup hidden. Re-enable in Lab.", "success", 3000);
  } catch (err) {
    host.showToast("Failed to hide setup", "error");
    console.error("[Setup] hideSetup error:", err);
  }
}
