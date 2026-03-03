/**
 * Onboarding Setup Controller
 * Handles integration status, testing, and configuration via gateway RPCs.
 *
 * Uses a proxy object that maps state to the LitElement properties.
 */

import type { GatewayBrowserClient } from "../gateway";

export type OnboardingSetupHost = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  onboardingIntegrations?: unknown[] | null;
  onboardingCoreProgress?: { connected: number; total: number } | null;
  onboardingExpandedCard?: string | null;
  onboardingLoadingGuide?: string | null;
  onboardingActiveGuide?: any | null;
  onboardingTestingId?: string | null;
  onboardingTestResult?: { id: string; result: { success: boolean; message: string } } | null;
  onboardingConfigValues?: Record<string, string>;
  onboardingProgress?: number | null;
  requestUpdate(): void;
};

export async function loadIntegrations(host: OnboardingSetupHost) {
  if (!host.client || !host.connected) return;
  try {
    const result = await host.client.request<{
      integrations: unknown[];
      coreProgress: { connected: number; total: number };
    }>("integrations.status", {});
    host.onboardingIntegrations = result.integrations;
    host.onboardingCoreProgress = result.coreProgress;
    host.onboardingProgress = Math.round(
      (result.coreProgress.connected / result.coreProgress.total) * 100,
    );
    host.requestUpdate();
  } catch (err) {
    console.error("[onboarding-setup] Failed to load integrations:", err);
  }
}

export function expandCard(host: OnboardingSetupHost, id: string | null) {
  host.onboardingExpandedCard = id;
  if (id !== host.onboardingActiveGuide?.integrationId) {
    host.onboardingActiveGuide = null;
    host.onboardingTestResult = null;
  }
  host.requestUpdate();
}

export async function loadGuide(host: OnboardingSetupHost, id: string) {
  if (!host.client || !host.connected) return;
  host.onboardingLoadingGuide = id;
  host.requestUpdate();
  try {
    const guide = await host.client.request<unknown>("integrations.setupGuide", { integrationId: id });
    host.onboardingActiveGuide = guide;
    host.onboardingLoadingGuide = null;
    host.requestUpdate();
  } catch (err) {
    console.error("[onboarding-setup] Failed to load guide:", err);
    host.onboardingLoadingGuide = null;
    host.requestUpdate();
  }
}

export async function testIntegration(host: OnboardingSetupHost, id: string) {
  if (!host.client || !host.connected) return;
  host.onboardingTestingId = id;
  host.onboardingTestResult = null;
  host.requestUpdate();
  try {
    const result = await host.client.request<{ success: boolean; message: string }>(
      "integrations.test",
      { integrationId: id },
    );
    host.onboardingTestResult = { id, result };
    host.onboardingTestingId = null;
    await loadIntegrations(host);
  } catch (err) {
    host.onboardingTestResult = {
      id,
      result: { success: false, message: err instanceof Error ? err.message : String(err) },
    };
    host.onboardingTestingId = null;
    host.requestUpdate();
  }
}

export async function configureIntegration(host: OnboardingSetupHost, id: string, values: Record<string, string>) {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("integrations.configure", { integrationId: id, values });
    await testIntegration(host, id);
  } catch (err) {
    console.error("[onboarding-setup] Failed to configure:", err);
    host.onboardingTestResult = {
      id,
      result: { success: false, message: err instanceof Error ? err.message : String(err) },
    };
    host.requestUpdate();
  }
}

export function updateConfigValue(host: OnboardingSetupHost, key: string, value: string) {
  if (!host.onboardingConfigValues) host.onboardingConfigValues = {};
  host.onboardingConfigValues[key] = value;
}

export function skipIntegration(host: OnboardingSetupHost, _id: string) {
  host.onboardingExpandedCard = null;
  host.onboardingActiveGuide = null;
  host.onboardingTestResult = null;
  host.requestUpdate();
}

export async function markComplete(host: OnboardingSetupHost) {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("onboarding.complete", {});
  } catch (err) {
    console.error("[onboarding-setup] Failed to mark complete:", err);
  }
}
