/**
 * Minimal type shim for the Composio SDK session object.
 *
 * The @composio/core SDK does not ship clean TypeScript types for session
 * methods, so we define the subset we use to avoid `as any` casts.
 */

export interface ComposioConnectedAccount {
  id?: string;
  connectionId?: string;
  appName?: string;
  app?: string;
  status?: string;
  authScheme?: string;
  auth_scheme?: string;
}

export interface ComposioConnectionResult {
  redirectUrl?: string;
  redirect_url?: string;
  url?: string;
  connectionId?: string;
  id?: string;
}

export interface ComposioTool {
  name?: string;
  toolName?: string;
  description?: string;
  appName?: string;
  app?: string;
}

export interface ComposioSession {
  connectedAccounts?: () => Promise<ComposioConnectedAccount[]>;
  initiateConnection?: (opts: { appName: string; callbackUrl?: string }) => Promise<ComposioConnectionResult>;
  connect?: (opts: { appName: string; redirectUrl?: string }) => Promise<ComposioConnectionResult>;
  executeAction?: (opts: { toolName: string; params: Record<string, unknown> }) => Promise<unknown>;
  tools?: () => Promise<ComposioTool[]>;
}
