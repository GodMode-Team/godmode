/**
 * Work view types — render function removed in v2 slim cleanup.
 * Types retained for controllers and app state.
 */

// ===== Resource Types =====

export type ResourceType =
  | "html_report"
  | "plan"
  | "analysis"
  | "code"
  | "doc"
  | "data"
  | "image"
  | "script";

export type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  path?: string;
  url?: string;
  sessionKey: string;
  createdAt: string;
  pinned: boolean;
  summary?: string;
  tags?: string[];
};

export type ResourceFilter = "all" | "pinned" | "html_report" | "plan" | "code" | "recent";

// ===== Types =====

export type ProjectTask = {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
};

export type ProjectOutput = {
  id: string;
  title: string;
  url?: string;
  type: string;
};

export type Project = {
  id: string;
  name: string;
  emoji: string;
  folder?: string | null;
  tasks: ProjectTask[];
  outputs: ProjectOutput[];
  people: string[];
  skills: string[];
  automations?: string[];
  status: "active" | "archived" | "paused";
};

export type WorkspaceFile = {
  id: string;
  name: string;
  type: "file" | "directory";
  path: string;
  size?: number;
  modifiedAt?: number;
  children?: WorkspaceFile[];
};
