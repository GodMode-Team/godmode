import { execFile as execFileCb } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { ensureWorkspaceFolders } from "./workspaces-config.js";

const execFile = promisify(execFileCb);

export type WorkspaceMetadata = {
  name: string;
  id: string;
  created: string;
  github?: string;
  members: WorkspaceMember[];
};

export type WorkspaceMember = {
  id: string;
  name: string;
  role: "admin" | "member";
  joined: string;
};

export type ScaffoldParams = {
  workspacePath: string;
  name: string;
  id: string;
  github?: string;
  creatorName: string;
  creatorId: string;
};

async function writeIfMissing(filePath: string, content: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, content, "utf-8");
  }
}

export async function resolveGitMemberId(workspacePath: string): Promise<string> {
  try {
    const result = await execFile("git", ["config", "user.name"], {
      cwd: workspacePath,
      maxBuffer: 1024 * 1024,
    });
    const name = (result.stdout ?? "").trim();
    if (name) {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);
    }
  } catch {
    // Fall through to hostname
  }

  const os = await import("node:os");
  return os.hostname().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "unknown";
}

export async function scaffoldTeamWorkspace(params: ScaffoldParams): Promise<WorkspaceMetadata> {
  const { workspacePath, name, id, github, creatorName, creatorId } = params;

  await ensureWorkspaceFolders(workspacePath, "team");

  const metadata: WorkspaceMetadata = {
    name,
    id,
    created: new Date().toISOString(),
    github,
    members: [
      {
        id: creatorId,
        name: creatorName,
        role: "admin",
        joined: new Date().toISOString(),
      },
    ],
  };

  const metadataPath = path.join(workspacePath, ".godmode", "workspace.json");
  await writeIfMissing(metadataPath, JSON.stringify(metadata, null, 2) + "\n");

  const commsYaml = `# Team communication configuration
feed:
  enabled: true
  path: comms/feed.jsonl
notifications:
  slack: null
`;
  await writeIfMissing(path.join(workspacePath, ".godmode", "comms.yaml"), commsYaml);

  const syncYaml = `# Sync configuration
include:
  - memory/
  - skills/
  - tools/
  - comms/
  - artifacts/
  - clients/
  - integrations/
  - AGENTS.md
exclude:
  - .godmode/local/
  - "*.secret"
  - .env
  - .env.*
`;
  await writeIfMissing(path.join(workspacePath, ".godmode", "sync.yaml"), syncYaml);

  const agentsMd = `# ${name} — Agent SOPs

## Overview
Shared operating procedures for all agents working in this workspace.

## Rules
- Write memory entries to \`memory/\` after significant discoveries or decisions
- Use \`team_message\` tool to communicate with other agents
- Follow the patterns documented in \`skills/\` for recurring tasks

## Conventions
- File names: kebab-case
- Memory entries: \`YYYY-MM-DD-topic.md\`
- Commit messages: descriptive, prefixed with workspace name
`;
  await writeIfMissing(path.join(workspacePath, "AGENTS.md"), agentsMd);

  const memoryMd = `# ${name} — Shared Memory

Team knowledge base. Updated by agents and curated nightly.
`;
  await writeIfMissing(path.join(workspacePath, "memory", "MEMORY.md"), memoryMd);

  const gitignore = `# GodMode team workspace
.godmode/local/
.env
.env.*
*.pem
*.key
*.secret
.DS_Store
node_modules/
`;
  await writeIfMissing(path.join(workspacePath, ".gitignore"), gitignore);

  const readme = `# ${name}

GodMode team workspace. Synced via git.

## Structure
- \`memory/\` — Shared team knowledge
- \`skills/\` — Reusable agent skills
- \`tools/\` — Tool configurations and docs
- \`comms/\` — Inter-agent communication feed
- \`artifacts/\` — Shared documents, templates, exports
- \`clients/\` — Client-specific folders
- \`integrations/\` — External service configs
- \`AGENTS.md\` — Agent SOPs (emergent operating procedures)
`;
  await writeIfMissing(path.join(workspacePath, "README.md"), readme);

  return metadata;
}

export async function readWorkspaceMetadata(
  workspacePath: string,
): Promise<WorkspaceMetadata | null> {
  const metadataPath = path.join(workspacePath, ".godmode", "workspace.json");
  try {
    const raw = await fs.readFile(metadataPath, "utf-8");
    return JSON.parse(raw) as WorkspaceMetadata;
  } catch {
    return null;
  }
}

export async function addMemberToWorkspace(params: {
  workspacePath: string;
  memberId: string;
  memberName: string;
  role?: "admin" | "member";
}): Promise<WorkspaceMetadata | null> {
  const metadata = await readWorkspaceMetadata(params.workspacePath);
  if (!metadata) {
    return null;
  }

  const existing = metadata.members.find((m) => m.id === params.memberId);
  if (existing) {
    return metadata;
  }

  metadata.members.push({
    id: params.memberId,
    name: params.memberName,
    role: params.role ?? "member",
    joined: new Date().toISOString(),
  });

  const metadataPath = path.join(params.workspacePath, ".godmode", "workspace.json");
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2) + "\n", "utf-8");

  return metadata;
}
