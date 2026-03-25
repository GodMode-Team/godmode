import type { IconName } from "./icons.js";

export const TAB_GROUPS = [
  { label: "", tabs: ["chat", "today", "team", "workspaces", "brain", "dashboards"] },
  { label: "Settings", tabs: ["overview", "config", "connections", "skills", "agents", "trust", "guardrails"] },
] as const;

export const POWER_USER_GROUPS = [
  { label: "System", tabs: ["channels", "sessions", "cron", "debug"] },
] as const;

/** Tabs that can be dynamically inserted but aren't in static groups. */
// "onboarding" removed — Setup Bar is now the default entry point for onboarding.
// The old wizard is still accessible from Settings > "Run Setup Wizard".
export const DYNAMIC_TABS = [] as const;

/** Tabs that open an external URL instead of rendering a view. */
export const EXTERNAL_TABS: ReadonlySet<Tab> = new Set<Tab>([]);

export type Tab =
  | "onboarding"
  | "guardrails"
  | "workspaces"
  | "today"
  | "team"
  | "channels"
  | "connections"
  | "instances"
  | "sessions"
  | "cron"
  | "skills"
  | "agents"
  | "nodes"
  | "chat"
  | "config"
  | "trust"
  | "debug"
  | "logs"
  | "brain"
  | "second-brain"
  | "dashboards"
  // Legacy tab aliases — not in navigation, but kept for type compat
  | "setup"
  | "work"
  | "my-day"
  | "overview"
  | "mission-control";

const TAB_PATHS: Partial<Record<Tab, string>> = {
  onboarding: "/onboarding",
  workspaces: "/workspaces",
  today: "/today",
  team: "/team",
  connections: "/connections",
  channels: "/channels",
  instances: "/instances",
  sessions: "/sessions",
  cron: "/cron",
  skills: "/skills",
  agents: "/agents",
  nodes: "/nodes",
  chat: "/chat",
  trust: "/trust",
  guardrails: "/guardrails",
  config: "/config",
  debug: "/debug",
  logs: "/logs",
  brain: "/brain",
  "second-brain": "/second-brain",
  dashboards: "/dashboards",
  overview: "/overview",
};

const PATH_TO_TAB = new Map(Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab as Tab]));
// Legacy URL support: /my-day redirects to today tab
PATH_TO_TAB.set("/my-day", "today");
// Legacy URL support: /work redirects to workspaces.
PATH_TO_TAB.set("/work", "workspaces");
// Legacy URL support: /setup redirects to onboarding
PATH_TO_TAB.set("/setup", "onboarding");
// /overview is now a real tab again (no redirect needed)
// Legacy URL support: /mission-control redirects to dashboards
PATH_TO_TAB.set("/mission-control", "dashboards");
// Legacy URL support: /second-brain redirects to brain
PATH_TO_TAB.set("/second-brain", "brain");

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
  const path = TAB_PATHS[tab] ?? `/${tab}`;
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
    case "onboarding":
      return "compass";
    case "chat":
      return "messageSquare";
    case "today":
      return "calendar";
    case "team":
      return "users";
    case "workspaces":
      return "folder";
    case "connections":
      return "link";
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
    case "agents":
      return "radio";
    case "nodes":
      return "monitor";
    case "trust":
      return "shield";
    case "guardrails":
      return "shield";
    case "brain":
    case "second-brain":
      return "brain";
    case "dashboards":
      return "barChart";
    case "overview":
      return "monitor";
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
    case "onboarding":
      return "Connect Your World";
    case "chat":
      return "Chat";
    case "today":
      return "Today";
    case "team":
      return "Team";
    case "workspaces":
      return "Workspaces";
    case "connections":
      return "Connections";
    case "channels":
      return "Integrations";
    case "instances":
      return "Devices";
    case "sessions":
      return "Sessions";
    case "cron":
      return "Schedules";
    case "skills":
      return "Skills";
    case "agents":
      return "Agents";
    case "nodes":
      return "Network";
    case "trust":
      return "Trust";
    case "guardrails":
      return "Safety";
    case "brain":
      return "Brain";
    case "second-brain":
      return "Second Brain";
    case "dashboards":
      return "Dashboards";
    case "overview":
      return "Overview";
    case "config":
      return "Settings";
    case "debug":
      return "Developer";
    case "logs":
      return "Logs";
    default:
      return "Control";
  }
}

export function emojiForTab(tab: Tab): string {
  switch (tab) {
    case "onboarding":
      return "\u{1F9ED}";
    case "chat":
      return "\u{1F4AC}";
    case "today":
      return "\u{2600}\uFE0F";
    case "team":
      return "\u{1F916}";
    case "workspaces":
      return "\u{1F4C2}";
    case "connections":
      return "\u{1F50C}";
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
    case "agents":
      return "\u{1F916}";
    case "nodes":
      return "\u{1F5A5}\uFE0F";
    case "trust":
      return "\u{1F6E1}\uFE0F";
    case "guardrails":
      return "\u{1F6A7}";
    case "brain":
    case "second-brain":
      return "\u{1F9E0}";
    case "dashboards":
      return "\u{1F4CA}";
    case "overview":
      return "\u{2139}\uFE0F";
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
    case "onboarding":
      return "Set up the integrations that power your daily brief and agent features. Everything is optional.";
    case "chat":
      return "Your command center. Ask anything, customize any view.";
    case "today":
      return "Calendar, brief, tasks, and schedule for the day.";
    case "workspaces":
      return "Projects, clients, and personal operating context.";
    case "connections":
      return "Your integrations and third-party connections.";
    case "channels":
      return "Connected apps — iMessage, Slack, email, calendar, and more.";
    case "instances":
      return "Your connected devices and where GodMode is running.";
    case "sessions":
      return "Inspect active sessions and adjust per-session defaults.";
    case "cron":
      return "Recurring tasks — daily briefs, overnight agents, and timed automations.";
    case "skills":
      return "Manage your skills, discover new ones from ClawHub, and personalize them for your workflow.";
    case "agents":
      return "Your agent roster — sub-agents that handle queue tasks, grouped by category.";
    case "nodes":
      return "Devices in your GodMode network and what they can do.";
    case "trust":
      return "Scores build automatically as you use and rate skills.";
    case "guardrails":
      return "Boundaries that keep agents focused, honest, and within scope.";
    case "brain":
      return "Your Brain — identity, people, knowledge, and live AI context.";
    case "second-brain":
      return "Your Second Brain — identity, knowledge, and live AI context. Stores what your ally needs to act on your behalf.";
    case "dashboards":
      return "Custom data views built by your AI ally — remix anything.";
    case "team":
      return "Your AI agent team — orchestrated by Paperclip.";
    case "overview":
      return "Version info, gateway status, and updates.";
    case "config":
      return "Core settings — model, plugins, and API configuration.";
    case "debug":
      return "Gateway internals, events, and manual RPC calls.";
    case "logs":
      return "Live tail of the gateway file logs.";
    default:
      return "";
  }
}
