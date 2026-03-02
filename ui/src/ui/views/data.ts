/**
 * Data view — DEPRECATED (view removed, types kept for backward compatibility)
 */

export type DataSource = {
  id: string;
  name: string;
  type: string;
  status: "connected" | "pending" | "disconnected";
  skill: string | null;
  lastSync?: string;
};
