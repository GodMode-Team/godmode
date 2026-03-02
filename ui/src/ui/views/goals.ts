/**
 * Goals view — DEPRECATED (view removed, types kept for backward compatibility)
 */

export type Goal = {
  id: string;
  title: string;
  area?: string;
  target?: string;
  progress?: number;
  status: "active" | "completed" | "paused";
};
