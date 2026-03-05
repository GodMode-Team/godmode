import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { DATA_DIR } from "../data-paths.js";
import { secureWriteFile, secureMkdir } from "../lib/secure-fs.js";
import type { GatewayRequestHandler } from "openclaw/plugin-sdk";

type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;

const PROJECTS_FILE = join(DATA_DIR, "projects.json");

type Project = {
  id: string;
  name: string;
  emoji: string;
  folder?: string | null;
  tasks: Array<{ id: string; title: string; status: string; dueDate?: string }>;
  outputs: Array<{ id: string; title: string; url?: string; type: string }>;
  people: string[];
  skills: string[];
  automations?: string[];
  status: "active" | "archived" | "paused";
};

type ProjectsData = { projects: Project[] };

async function readProjects(): Promise<ProjectsData> {
  try {
    const raw = await readFile(PROJECTS_FILE, "utf-8");
    return JSON.parse(raw) as ProjectsData;
  } catch {
    return { projects: [] };
  }
}

const MAX_KEY_FILES = 20;

const KEY_NAMES = new Set([
  "readme.md", "readme", "index.ts", "index.js", "index.html",
  "package.json", "tsconfig.json", "vite.config.ts", "vite.config.js",
  "claude.md", "runbook.md", "playbook.md", ".env.example",
  "dockerfile", "docker-compose.yml", "docker-compose.yaml",
  "makefile", "cargo.toml", "pyproject.toml", "go.mod",
]);

const KEY_EXTENSIONS = new Set([
  ".md", ".html", ".json", ".yaml", ".yml", ".toml",
  ".ts", ".js", ".py", ".sh", ".css",
]);

const SKIP_DIRS = new Set([
  "node_modules", "dist", "build", ".git", "__pycache__",
  "venv", ".next", ".nuxt", "coverage", ".turbo", ".cache",
]);

type ScannedItem = {
  id: string;
  name: string;
  type: "file" | "directory";
  path: string;
  size?: number;
  modifiedAt?: number;
  children?: ScannedItem[];
};

function filterKeyFiles(items: ScannedItem[]): ScannedItem[] {
  const result: ScannedItem[] = [];
  function collect(nodes: ScannedItem[]) {
    for (const node of nodes) {
      if (result.length >= MAX_KEY_FILES) return;
      if (node.type === "directory") {
        if (SKIP_DIRS.has(node.name.toLowerCase())) continue;
        if (node.children) collect(node.children);
        continue;
      }
      const lower = node.name.toLowerCase();
      const ext = extname(lower);
      if (KEY_NAMES.has(lower) || KEY_EXTENSIONS.has(ext)) {
        result.push({ ...node, children: undefined });
      }
    }
  }
  collect(items);
  return result;
}

const listProjects: GatewayRequestHandler = async ({ respond }) => {
  const data = await readProjects();
  respond(true, data);
};

const getProject: GatewayRequestHandler = async ({ params, respond }) => {
  const { id, includeFiles, depth } = params as {
    id?: string;
    includeFiles?: boolean;
    depth?: number;
  };
  if (!id) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing project id" });
    return;
  }
  const data = await readProjects();
  const project = data.projects.find((p) => p.id === id);
  if (!project) {
    respond(true, null);
    return;
  }

  if (includeFiles && project.folder) {
    try {
      // Dynamic import to avoid circular deps — expandPath and scanDirectory
      // come from the workspaces handler
      const { expandPath, scanDirectory } = await import("./workspaces.js");
      const expandedPath = expandPath(project.folder);
      const rawFiles = await scanDirectory(expandedPath, Math.min(depth ?? 2, 4));
      const files = filterKeyFiles(rawFiles);
      respond(true, { ...project, files });
    } catch (err) {
      console.warn("[Projects] Failed to scan folder:", err);
      respond(true, { ...project, files: [] });
    }
  } else {
    respond(true, project);
  }
};

const createProject: GatewayRequestHandler = async ({ params, respond }) => {
  const { name, emoji, folder, status } = params as {
    name?: string;
    emoji?: string;
    folder?: string;
    status?: "active" | "archived" | "paused";
  };
  if (!name) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing project name" });
    return;
  }

  const project: Project = {
    id: randomUUID(),
    name,
    emoji: emoji || "\u{1F4C1}",
    folder: folder || null,
    tasks: [],
    outputs: [],
    people: [],
    skills: [],
    automations: [],
    status: status || "active",
  };

  if (project.folder) {
    try {
      const { expandPath } = await import("./workspaces.js");
      const expandedFolder = expandPath(project.folder);
      await secureMkdir(expandedFolder);
    } catch (err) {
      console.warn("[Projects] mkdir warning:", err);
    }
  }

  const data = await readProjects();
  data.projects.push(project);
  await secureWriteFile(PROJECTS_FILE, JSON.stringify(data, null, 2));
  respond(true, project);
};

const updateProjects: GatewayRequestHandler = async ({ params, respond }) => {
  const { projects } = params as { projects?: Project[] };
  if (!projects || !Array.isArray(projects)) {
    respond(false, null, { code: "INVALID_REQUEST", message: "Missing projects array" });
    return;
  }
  const data: ProjectsData = { projects };
  await secureWriteFile(PROJECTS_FILE, JSON.stringify(data, null, 2));
  respond(true, data);
};

export const projectsHandlers: GatewayRequestHandlers = {
  "projects.list": listProjects,
  "projects.get": getProject,
  "projects.create": createProject,
  "projects.update": updateProjects,
};
