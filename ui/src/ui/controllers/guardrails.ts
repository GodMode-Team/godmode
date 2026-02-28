import type { GodModeApp } from "../app.js";

export type GuardrailGateView = {
  id: string;
  name: string;
  description: string;
  icon: string;
  hook: string;
  enabled: boolean;
  thresholds?: Record<string, number>;
  thresholdLabels?: Record<string, string>;
};

export type GuardrailActivityView = {
  id: string;
  gateId: string;
  action: "fired" | "blocked" | "cleaned";
  detail: string;
  sessionKey?: string;
  timestamp: string;
};

export type GuardrailsViewData = {
  gates: GuardrailGateView[];
  activity: GuardrailActivityView[];
};

export async function loadGuardrails(host: GodModeApp): Promise<void> {
  if (!host.client || !host.connected) return;
  (host as unknown as { guardrailsLoading: boolean }).guardrailsLoading = true;
  try {
    const [listResult, historyResult] = await Promise.all([
      host.client.request<{ gates: GuardrailGateView[] }>("guardrails.list", {}),
      host.client.request<{ activity: GuardrailActivityView[]; total: number }>(
        "guardrails.history",
        { limit: 50 },
      ),
    ]);
    (host as unknown as { guardrailsData: GuardrailsViewData | null }).guardrailsData = {
      gates: listResult.gates,
      activity: historyResult.activity,
    };
  } catch (err) {
    console.error("[Guardrails] load error:", err);
    (host as unknown as { guardrailsData: GuardrailsViewData | null }).guardrailsData = null;
  } finally {
    (host as unknown as { guardrailsLoading: boolean }).guardrailsLoading = false;
  }
}

export async function toggleGuardrail(
  host: GodModeApp,
  gateId: string,
  enabled: boolean,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("guardrails.set", { gateId, enabled });
    const data = (host as unknown as { guardrailsData: GuardrailsViewData | null }).guardrailsData;
    const label = data?.gates.find((g) => g.id === gateId)?.name ?? gateId;
    host.showToast(`${label} ${enabled ? "enabled" : "disabled"}`, "success", 2000);
    await loadGuardrails(host);
  } catch (err) {
    host.showToast("Failed to update guardrail", "error");
    console.error("[Guardrails] toggle error:", err);
  }
}

export async function updateGuardrailThreshold(
  host: GodModeApp,
  gateId: string,
  key: string,
  value: number,
): Promise<void> {
  if (!host.client || !host.connected) return;
  try {
    await host.client.request("guardrails.set", { gateId, thresholds: { [key]: value } });
    host.showToast("Threshold updated", "success", 2000);
    await loadGuardrails(host);
  } catch (err) {
    host.showToast("Failed to update threshold", "error");
    console.error("[Guardrails] threshold error:", err);
  }
}
