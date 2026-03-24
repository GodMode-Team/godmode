/**
 * WorkspaceConnector — interface for shared tool connectors.
 *
 * Each connector queries a shared tool on behalf of the workspace.
 * Connectors do NOT ingest data — they query live.
 */

export interface ConnectorTestResult {
  ok: boolean;
  error?: string;
  meta?: Record<string, unknown>;
}

export interface ConnectorSearchResult {
  title: string;
  excerpt: string;
  url?: string;
  type: string; // "file", "task", "contact", "deal", etc.
  updatedAt?: string;
}

export interface ConnectorActivityItem {
  title: string;
  detail: string;
  timestamp: string;
  type: string;
  url?: string;
}

export interface WorkspaceConnector {
  type: string;

  /** Test if the connection is working (API key valid, service reachable). */
  testConnection(
    config: Record<string, string>,
    secret: string,
  ): Promise<ConnectorTestResult>;

  /** Search within the connected tool. */
  search(
    query: string,
    config: Record<string, string>,
    secret: string,
  ): Promise<{ results: ConnectorSearchResult[] }>;

  /** Get a summary of recent activity from the tool. */
  recentActivity(
    config: Record<string, string>,
    secret: string,
    limit?: number,
  ): Promise<{ items: ConnectorActivityItem[] }>;
}

/** Descriptor for UI — available connection types for the setup wizard. */
export interface ConnectionTypeDescriptor {
  type: string;
  name: string;
  icon: string;
  description: string;
  configFields: Array<{
    key: string;
    label: string;
    placeholder?: string;
    required: boolean;
  }>;
  secretField: { key: string; label: string; placeholder?: string } | null;
}
