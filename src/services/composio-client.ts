/**
 * composio-client.ts — Singleton Composio client for third-party tool auth.
 *
 * Composio provides managed OAuth flows and 850+ pre-built tool connectors
 * so AI agents can securely call third-party APIs. This module wraps the
 * Composio SDK in a thin service layer with graceful degradation.
 *
 * Env: COMPOSIO_API_KEY
 */

import { Composio } from "@composio/core";
import type { ComposioSession, ComposioConnectedAccount, ComposioTool } from "../types/composio.js";

import type { Logger } from "../types/plugin-api.js";

let client: Composio | null = null;
let configured = false;

// ── init ────────────────────────────────────────────────────────────────
export async function init(apiKey: string | undefined, logger?: Logger): Promise<boolean> {
  if (!apiKey) {
    logger?.info("[Composio] Not configured — third-party tool auth disabled");
    configured = false;
    return false;
  }

  try {
    client = new Composio({ apiKey });
    configured = true;
    logger?.info("[Composio] Client initialized");
    return true;
  } catch (err) {
    logger?.warn(`[Composio] Init failed: ${String(err)}`);
    client = null;
    configured = false;
    return false;
  }
}

// ── getConnections ──────────────────────────────────────────────────────
export async function getConnections(userId: string): Promise<
  Array<{ id: string; appName: string; status: string; authScheme: string }>
> {
  if (!client) return [];
  try {
    const session = await client.create(userId) as unknown as ComposioSession;
    const accounts = await session.connectedAccounts?.() ?? [];
    return Array.isArray(accounts)
      ? accounts.map((a: ComposioConnectedAccount) => ({
          id: String(a.id ?? a.connectionId ?? ""),
          appName: String(a.appName ?? a.app ?? "unknown"),
          status: String(a.status ?? "unknown"),
          authScheme: String(a.authScheme ?? a.auth_scheme ?? "unknown"),
        }))
      : [];
  } catch (err) {
    console.warn(`[Composio] getConnections error: ${String(err)}`);
    return [];
  }
}

// ── initiateConnection ──────────────────────────────────────────────────
export async function initiateConnection(
  userId: string,
  appName: string,
  callbackUrl?: string,
): Promise<{ redirectUrl?: string; connectionId?: string; error?: string }> {
  if (!client) return { error: "Composio not configured" };
  try {
    const session = await client.create(userId) as unknown as ComposioSession;
    // The SDK exposes connection initiation through the session or via REST
    const result = await session.initiateConnection?.({ appName, callbackUrl }) ??
      await session.connect?.({ appName, redirectUrl: callbackUrl });

    if (!result) return { error: "Connection initiation not supported by SDK version" };

    return {
      redirectUrl: String(result.redirectUrl ?? result.redirect_url ?? result.url ?? ""),
      connectionId: String(result.connectionId ?? result.id ?? ""),
    };
  } catch (err) {
    return { error: `Failed to initiate connection: ${String(err)}` };
  }
}

// ── executeAction ───────────────────────────────────────────────────────
export async function executeAction(
  userId: string,
  actionName: string,
  args: Record<string, unknown> = {},
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  if (!client) return { success: false, error: "Composio not configured" };
  try {
    const session = await client.create(userId) as unknown as ComposioSession;
    const result = await session.executeAction?.({
      toolName: actionName,
      params: args,
    });
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: `Action failed: ${String(err)}` };
  }
}

// ── getAvailableTools ───────────────────────────────────────────────────
export async function getAvailableTools(userId: string): Promise<
  Array<{ name: string; description: string; appName: string }>
> {
  if (!client) return [];
  try {
    const session = await client.create(userId) as unknown as ComposioSession;
    const tools = await session.tools?.() ?? [];
    return Array.isArray(tools)
      ? tools.map((t: ComposioTool) => ({
          name: String(t.name ?? t.toolName ?? ""),
          description: String(t.description ?? ""),
          appName: String(t.appName ?? t.app ?? ""),
        }))
      : [];
  } catch (err) {
    console.warn(`[Composio] getAvailableTools error: ${String(err)}`);
    return [];
  }
}

// ── getStatus ───────────────────────────────────────────────────────────
export async function getStatus(userId?: string): Promise<{
  ready: boolean;
  connectedApps: string[];
  expiredApps: string[];
}> {
  if (!configured || !client) {
    return { ready: false, connectedApps: [], expiredApps: [] };
  }
  if (!userId) {
    return { ready: true, connectedApps: [], expiredApps: [] };
  }
  try {
    const connections = await getConnections(userId);
    const connectedApps = connections.filter((c) => c.status === "active" || c.status === "connected")
      .map((c) => c.appName);
    const expiredApps = connections.filter((c) => c.status === "expired" || c.status === "revoked")
      .map((c) => c.appName);
    return { ready: true, connectedApps, expiredApps };
  } catch {
    return { ready: true, connectedApps: [], expiredApps: [] };
  }
}

// ── isConfigured ────────────────────────────────────────────────────────
export function isConfigured(): boolean {
  return configured;
}
