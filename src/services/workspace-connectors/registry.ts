/**
 * Connector registry — maps connection types to their implementations.
 */

import type { WorkspaceConnector, ConnectionTypeDescriptor } from "./types.js";
import { googleDriveConnector } from "./google-drive.js";
import { clickupConnector } from "./clickup.js";
import { hubspotConnector } from "./hubspot.js";

const CONNECTORS: Record<string, WorkspaceConnector> = {
  "google-drive": googleDriveConnector,
  clickup: clickupConnector,
  hubspot: hubspotConnector,
};

export function getConnector(type: string): WorkspaceConnector | null {
  return CONNECTORS[type] ?? null;
}

export function listConnectorTypes(): string[] {
  return Object.keys(CONNECTORS);
}

/** Available connections that can be configured (for the setup wizard). */
export const AVAILABLE_CONNECTIONS: ConnectionTypeDescriptor[] = [
  {
    type: "google-drive",
    name: "Google Drive",
    icon: "📁",
    description: "Search and browse shared team folders",
    configFields: [
      { key: "folderId", label: "Shared Folder ID", placeholder: "1abc...", required: true },
      { key: "account", label: "Google Account", placeholder: "team@company.com", required: true },
    ],
    secretField: null, // gog CLI handles OAuth
  },
  {
    type: "clickup",
    name: "ClickUp",
    icon: "✅",
    description: "View tasks, projects, and team activity",
    configFields: [
      { key: "teamId", label: "Team ID", placeholder: "12345678", required: true },
    ],
    secretField: { key: "apiToken", label: "Personal API Token", placeholder: "pk_..." },
  },
  {
    type: "hubspot",
    name: "HubSpot",
    icon: "🔶",
    description: "Search contacts, deals, and pipeline",
    configFields: [
      { key: "portalId", label: "Portal ID", placeholder: "12345", required: false },
    ],
    secretField: { key: "accessToken", label: "Private App Token", placeholder: "pat-..." },
  },
  {
    type: "ghl",
    name: "GoHighLevel",
    icon: "⚡",
    description: "CRM contacts and pipeline (via API key)",
    configFields: [
      { key: "locationId", label: "Location ID", required: true },
    ],
    secretField: { key: "apiKey", label: "API Key" },
  },
  {
    type: "slack",
    name: "Slack",
    icon: "💬",
    description: "Read team channels and search messages",
    configFields: [
      { key: "teamId", label: "Team/Workspace ID", required: false },
    ],
    secretField: { key: "botToken", label: "Bot Token", placeholder: "xoxb-..." },
  },
  {
    type: "notion",
    name: "Notion",
    icon: "📓",
    description: "Search team wiki and databases",
    configFields: [],
    secretField: { key: "integrationToken", label: "Integration Token", placeholder: "secret_..." },
  },
];
