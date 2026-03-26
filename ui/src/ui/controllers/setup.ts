/**
 * Setup controller — RPC helpers for the Setup tab (progressive onboarding).
 */
import type { GodModeApp } from "../app.js";
import type { SetupProgress } from "../views/setup-bar.js";

type CapabilityCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "active" | "available" | "coming-soon";
  detail?: string;
  action?: string;
};

type CapabilitiesResult = {
  capabilities: CapabilityCard[];
  percentComplete: number;
};

type OnboardingState = {
  phase: number;
  completedPhases: number[];
  identity: { name: string; mission: string; emoji: string } | null;
  completedAt: string | null;
  [key: string]: unknown;
};

// ── Setup Progress (new unified flow) ──────────────────────────

export async function loadSetupProgress(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  const app = host as unknown as { setupProgress: SetupProgress | null };
  try {
    const result = await host.client.request<SetupProgress>(
      "onboarding.setupProgress",
      {},
    );
    app.setupProgress = result;
  } catch {
    // setupProgress endpoint may not exist on older gateways — silent fail
  }
}

export async function dismissSetupBar(host: GodModeApp): Promise<void> {
  if (!host.client) return;
  try {
    await host.client.request("onboarding.setupDismiss", {});
    const app = host as unknown as { setupBarDismissed: boolean };
    app.setupBarDismissed = true;
    host.showToast("Setup hidden — continue anytime from Settings.", "success", 3000);
  } catch {
    // Fall back to options-based hide
    void hideSetup(host);
  }
}

export async function loadCapabilities(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  const app = host as unknown as {
    setupCapabilities: CapabilitiesResult | null;
    setupCapabilitiesLoading: boolean;
  };
  app.setupCapabilitiesLoading = true;
  try {
    const result = await host.client.request<CapabilitiesResult>(
      "onboarding.capabilities",
      {},
    );
    app.setupCapabilities = result;
  } catch {
    app.setupCapabilities = null;
  } finally {
    app.setupCapabilitiesLoading = false;
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
): Promise<boolean> {
  if (!host.client) return false;
  try {
    const result = await host.client.request<{ state: OnboardingState }>(
      "onboarding.quickSetup",
      { name },
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
    // Persist the user's display name to UI settings so chat shows it
    if (name) {
      (host as unknown as { userName: string }).userName = name;
      host.applySettings({ ...host.settings, userName: name });
    }
    host.showToast(`Welcome, ${name}!`, "success", 3000);
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Setup failed";
    host.showToast(msg, "error");
    console.error("[Setup] quickSetup error:", err);
    return false;
  }
}

export async function capabilityAction(host: GodModeApp, id: string): Promise<void> {
  if (!host.client) return;

  switch (id) {
    case "identity":
      // Open the memory wizard
      (host as unknown as { wizardActive: boolean }).wizardActive = true;
      break;
    case "daily-brief":
      // Enable daily brief and navigate to Today
      try {
        await host.client.request("godmode.options.set", {
          key: "dailyBrief.enabled",
          value: true,
        });
        host.setTab("today" as import("../navigation").Tab);
        host.showToast("Daily Brief enabled!", "success", 3000);
      } catch {
        host.showToast("Failed to enable Daily Brief", "error");
      }
      break;
    case "google-calendar":
    case "github":
      // Auto-install integration
      try {
        host.showToast("Setting up...", "success", 2000);
        await host.client.request("integrations.autoInstall", { integrationId: id });
        host.showToast("Connected!", "success", 3000);
        void loadCapabilities(host);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Setup failed";
        host.showToast(msg, "error");
      }
      break;
    case "obsidian-vault":
      // Navigate to Memory tab for vault setup
      host.setTab("memory" as import("../navigation").Tab);
      break;
    default:
      host.showToast("Coming soon!", "success", 2000);
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
