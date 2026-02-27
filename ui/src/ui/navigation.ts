import type { IconName } from "./icons.js";

export const TAB_GROUPS = [
  { label: "", tabs: ["chat", "today", "workspaces"] },
  {
    label: "Control",
    tabs: ["overview", "channels", "instances", "sessions", "cron"],
  },
  { label: "Agent", tabs: ["skills", "nodes"] },
  { label: "Settings", tabs: ["options", "trust", "config", "debug", "logs"] },
] as const;

// Mission Control hidden from sidebar — code kept for future rebuild.
// To re-enable: add "mission" back to first TAB_GROUPS entry.

export type Tab =
  | "options"
  | "overview"
  | "mission"
  | "workspaces"
  | "today"
  | "work"
  | "people"
  | "life"
  | "data"
  | "my-day"
  | "wheel-of-life"
  | "vision-board"
  | "channels"
  | "instances"
  | "sessions"
  | "cron"
  | "skills"
  | "nodes"
  | "chat"
  | "config"
  | "trust"
  | "debug"
  | "logs";

const TAB_PATHS: Record<Tab, string> = {
  options: "/options",
  overview: "/overview",
  mission: "/mission",
  workspaces: "/workspaces",
  today: "/today",
  work: "/work",
  people: "/people",
  life: "/life",
  data: "/data",
  "my-day": "/today",
  "wheel-of-life": "/wheel-of-life",
  "vision-board": "/vision-board",
  channels: "/channels",
  instances: "/instances",
  sessions: "/sessions",
  cron: "/cron",
  skills: "/skills",
  nodes: "/nodes",
  chat: "/chat",
  trust: "/trust",
  config: "/config",
  debug: "/debug",
  logs: "/logs",
};

const PATH_TO_TAB = new Map(Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab as Tab]));
// Ensure /today resolves to "today" (not "my-day" which also maps to /today)
PATH_TO_TAB.set("/today", "today");
// Legacy URL support: /my-day redirects to today tab
PATH_TO_TAB.set("/my-day", "today");
// Legacy URL support: /work redirects to workspaces.
PATH_TO_TAB.set("/work", "workspaces");

export function normalizeBasePath(basePath: string): string {
  if (!basePath) {
    return "";
  }
  let base = basePath.trim();
  if (!base.startsWith("/")) {
    base = `/${base}`;
  }
  if (base === "/") {
    return "";
  }
  if (base.endsWith("/")) {
    base = base.slice(0, -1);
  }
  return base;
}

export function normalizePath(path: string): string {
  if (!path) {
    return "/";
  }
  let normalized = path.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function pathForTab(tab: Tab, basePath = ""): string {
  const base = normalizeBasePath(basePath);
  const path = TAB_PATHS[tab];
  return base ? `${base}${path}` : path;
}

export function tabFromPath(pathname: string, basePath = ""): Tab | null {
  const base = normalizeBasePath(basePath);
  let path = pathname || "/";
  if (base) {
    if (path === base) {
      path = "/";
    } else if (path.startsWith(`${base}/`)) {
      path = path.slice(base.length);
    }
  }
  let normalized = normalizePath(path).toLowerCase();
  if (normalized.endsWith("/index.html")) {
    normalized = "/";
  }
  if (normalized === "/") {
    return "chat";
  }
  return PATH_TO_TAB.get(normalized) ?? null;
}

export function inferBasePathFromPathname(pathname: string): string {
  let normalized = normalizePath(pathname);
  if (normalized.endsWith("/index.html")) {
    normalized = normalizePath(normalized.slice(0, -"/index.html".length));
  }
  if (normalized === "/") {
    return "";
  }
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }
  for (let i = 0; i < segments.length; i++) {
    const candidate = `/${segments.slice(i).join("/")}`.toLowerCase();
    if (PATH_TO_TAB.has(candidate)) {
      const prefix = segments.slice(0, i);
      if (!prefix.length) {
        return "";
      }
      // If any prefix segment is itself a known tab path, the URL has
      // accumulated tab names from navigation — basePath is empty.
      const hasTabInPrefix = prefix.some((seg) => PATH_TO_TAB.has(`/${seg.toLowerCase()}`));
      if (hasTabInPrefix) {
        return "";
      }
      return `/${prefix.join("/")}`;
    }
  }
  return `/${segments.join("/")}`;
}

export function iconForTab(tab: Tab): IconName {
  switch (tab) {
    case "chat":
      return "messageSquare";
    case "today":
    case "my-day":
      return "calendar";
    case "work":
      return "folder";
    case "people":
      return "users";
    case "life":
      return "heart";
    case "data":
      return "barChart";
    case "overview":
      return "barChart";
    case "mission":
      return "zap";
    case "workspaces":
      return "folder";
    case "wheel-of-life":
      return "pieChart";
    case "vision-board":
      return "star";
    case "channels":
      return "link";
    case "instances":
      return "radio";
    case "sessions":
      return "fileText";
    case "cron":
      return "loader";
    case "skills":
      return "zap";
    case "nodes":
      return "monitor";
    case "options":
      return "wrench";
    case "trust":
      return "shield";
    case "config":
      return "settings";
    case "debug":
      return "bug";
    case "logs":
      return "scrollText";
    default:
      return "folder";
  }
}

export function titleForTab(tab: Tab) {
  switch (tab) {
    case "chat":
      return "Chat";
    case "today":
    case "my-day":
      return "Today";
    case "work":
      return "Workspaces";
    case "people":
      return "People";
    case "life":
      return "Life";
    case "data":
      return "Data";
    case "overview":
      return "Overview";
    case "mission":
      return "Mission Control";
    case "workspaces":
      return "Workspaces";
    case "wheel-of-life":
      return "Wheel of Life";
    case "vision-board":
      return "Vision Board";
    case "channels":
      return "Channels";
    case "instances":
      return "Instances";
    case "sessions":
      return "Sessions";
    case "cron":
      return "Cron Jobs";
    case "skills":
      return "Skills";
    case "nodes":
      return "Nodes";
    case "options":
      return "Options";
    case "trust":
      return "Trust";
    case "config":
      return "Config";
    case "debug":
      return "Debug";
    case "logs":
      return "Logs";
    default:
      return "Control";
  }
}

export function emojiForTab(tab: Tab): string {
  switch (tab) {
    case "chat":
      return "\u{1F4AC}";
    case "today":
    case "my-day":
      return "\u{2600}\uFE0F";
    case "work":
      return "\u{1F4BC}";
    case "people":
      return "\u{1F465}";
    case "life":
      return "\u{2728}";
    case "data":
      return "\u{1F4CA}";
    case "overview":
      return "\u{1F3AF}";
    case "mission":
      return "\u{26A1}";
    case "workspaces":
      return "\u{1F4C2}";
    case "wheel-of-life":
      return "\u{1F3A1}";
    case "vision-board":
      return "\u{1F320}";
    case "channels":
      return "\u{1F517}";
    case "instances":
      return "\u{1F4E1}";
    case "sessions":
      return "\u{1F4C4}";
    case "cron":
      return "\u{23F0}";
    case "skills":
      return "\u{1F9E9}";
    case "nodes":
      return "\u{1F5A5}\uFE0F";
    case "options":
      return "\u{2699}\uFE0F";
    case "trust":
      return "\u{1F6E1}\uFE0F";
    case "config":
      return "\u{2699}\uFE0F";
    case "debug":
      return "\u{1F41B}";
    case "logs":
      return "\u{1F4DC}";
    default:
      return "\u{1F4C1}";
  }
}

export function subtitleForTab(tab: Tab) {
  switch (tab) {
    case "chat":
      return "Your command center. Ask anything, customize any view.";
    case "today":
    case "my-day":
      return "Calendar, brief, tasks, and schedule for the day.";
    case "work":
      return "Your projects, files, tasks, and team — organized by workspace.";
    case "people":
      return "Contacts, relationships, and follow-up suggestions.";
    case "life":
      return "Vision board, goals, life scores, and LifeTracks.";
    case "data":
      return "Connected integrations, data sources, and query interface.";
    case "overview":
      return "Gateway status, entry points, and a fast health read.";
    case "mission":
      return "Agent orchestration — active runs, fleet status, and task queue.";
    case "workspaces":
      return "Content explorer organized by project and client.";
    case "wheel-of-life":
      return "Track balance across 8 life dimensions with scores, targets, and trends.";
    case "vision-board":
      return "Your Chief Definite Aim, annual themes, values, and identity statements.";
    case "channels":
      return "Manage channels and settings.";
    case "instances":
      return "Presence beacons from connected clients and nodes.";
    case "sessions":
      return "Inspect active sessions and adjust per-session defaults.";
    case "cron":
      return "Schedule wakeups and recurring agent runs.";
    case "skills":
      return "Manage skill availability and API key injection.";
    case "nodes":
      return "Paired devices, capabilities, and command exposure.";
    case "options":
      return "Toggle GodMode features on and off.";
    case "trust":
      return "Track how well your AI handles specific workflows.";
    case "config":
      return "Edit ~/.openclaw/config.json safely.";
    case "debug":
      return "Gateway snapshots, events, and manual RPC calls.";
    case "logs":
      return "Live tail of the gateway file logs.";
    default:
      return "";
  }
}
