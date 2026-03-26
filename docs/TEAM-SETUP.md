# GodMode Team Setup Guide

## For Team Admins

### 1. Create workspace repos
For each project, create a GitHub repo in the godmode-team org:
- `godmode-team/workspace-godmode-dev`
- `godmode-team/workspace-project-alpha`
- `godmode-team/workspace-project-beta`

### 2. Initialize workspaces

**Option A: From templates (recommended)**

In your GodMode chat:
> "Set up the GodMode dev workspace from template"

Or call the RPC directly:
```
workspace.setupFromTemplate { template: "godmode-dev", github: "godmode-team/workspace-godmode-dev" }
workspace.setupFromTemplate { template: "project-alpha", github: "godmode-team/workspace-project-alpha" }
workspace.setupFromTemplate { template: "project-beta", github: "godmode-team/workspace-project-beta" }
```

**Option B: From scratch**

```
workspace.createTeam { name: "GodMode", github: "godmode-team/workspace-godmode-dev" }
workspace.createTeam { name: "Project Alpha", github: "godmode-team/workspace-project-alpha" }
workspace.createTeam { name: "Project Beta", github: "godmode-team/workspace-project-beta" }
```

**Option C: Full provision (creates GitHub repo + workspace)**

```
workspace.provisionTeam { name: "GodMode", org: "godmode-team", repo: "workspace-godmode-dev" }
```

### 3. Push initial content
Templates include starter memory, skills, and README files. They auto-push to the remote on creation. Verify:
```
workspace.syncStatus { workspaceId: "godmode" }
```

### 4. Invite team members
Team members need:
- GodMode plugin installed
- GodMode team org membership (GitHub)
- SSH key or git credentials for workspace repos

## For Team Members

### 1. Install GodMode
```
npm install -g @godmode-team/godmode
openclaw gateway restart
```

### 2. Quick Setup
Open GodMode UI → Enter your name and API key → Get your first brief.

### 3. Join Team Workspaces
```
workspace.joinTeam { github: "godmode-team/workspace-godmode-dev" }
workspace.joinTeam { github: "godmode-team/workspace-project-alpha" }
workspace.joinTeam { github: "godmode-team/workspace-project-beta" }
```

Or tell your ally: "Join the GodMode team workspace" and provide the GitHub repo URL.

### 4. Start Working
- Switch to a workspace: "Let's work on Project Alpha"
- Your ally now has the team's shared context
- Any memory you create in the workspace is shared with the team
- Queue tasks scoped to a workspace for team visibility

## How Team Collaboration Works

### Shared Memory
Memory files in each workspace sync via git. When you write a note, create a meeting summary, or capture a decision, it's available to every team member's ally. The curation agent periodically consolidates memory entries into MEMORY.md.

### Shared Skills
Skills in a workspace run for the whole team. If someone creates a "weekly standup prep" skill in the GodMode workspace, every team member gets it.

### Agent Communication
Your ally can post updates to the team feed using the `team_message` tool. Message types:
- **handoff** — task handover to another agent
- **question** — needs input from the team
- **alert** — urgent issue
- **blocked** — stuck on something
- **fyi** — informational update

Read the feed: `comms.feed { workspaceId: "godmode" }`
Check unread: `comms.unread { workspaceId: "godmode", memberId: "your-id" }`

### Workspace Isolation
Each workspace is isolated. Project Alpha data stays in Project Alpha. GodMode dev data stays in GodMode. Your ally loads the right context based on which workspace you're in.

### GitSync
Workspaces sync automatically:
- **Auto-pull**: Every 30 seconds, pulls latest from remote
- **Auto-push**: After file changes, debounced to 5 seconds
- **Manual sync**: `workspace.syncNow { workspaceId: "godmode" }`
- **Conflict resolution**: Last-write-wins for markdown, with backup for JSON

### Curation Agent
The curation agent runs periodically (or manually via `curation.run`) to:
1. Read all memory files in the workspace
2. Consolidate duplicate information
3. Update MEMORY.md with merged content
4. Identify SOP candidates for AGENTS.md

## Workspace Directory Structure

```
~/godmode/clients/{workspace-id}/
├── .godmode/
│   ├── workspace.json       ← metadata: name, members, created
│   ├── comms.yaml            ← communication config
│   ├── sync.yaml             ← include/exclude patterns
│   └── local/                ← per-user state (not synced)
├── memory/                   ← shared team knowledge
│   ├── MEMORY.md             ← consolidated knowledge base
│   └── *.md                  ← individual memory entries
├── skills/                   ← reusable agent skills
├── tools/                    ← tool configurations
├── comms/
│   └── feed.jsonl            ← inter-agent message feed
├── artifacts/                ← shared documents and outputs
├── clients/                  ← client-specific folders
├── integrations/             ← external service configs
├── AGENTS.md                 ← agent SOPs
├── README.md                 ← workspace overview
└── .gitignore
```

## Available Templates

| Template | Slug | Type | Use Case |
|----------|------|------|----------|
| GodMode | `godmode-dev` | development | Plugin development with code review & build verify skills |
| Project Alpha | `project-alpha` | project | General team collaboration |
| Project Beta | `project-beta` | project | General team collaboration |

List templates programmatically: `workspace.listTemplates`

## RPC Reference

| Method | Description |
|--------|-------------|
| `workspace.createTeam` | Create team workspace (with optional GitHub remote) |
| `workspace.provisionTeam` | Create GitHub repo + workspace in one step |
| `workspace.joinTeam` | Clone and join an existing team workspace |
| `workspace.leaveTeam` | Remove workspace from local config |
| `workspace.syncNow` | Trigger immediate git sync |
| `workspace.syncStatus` | Get sync state for workspace(s) |
| `workspace.setupFromTemplate` | Create workspace from bundled template |
| `workspace.listTemplates` | List available templates |
| `comms.send` | Post message to team feed |
| `comms.feed` | Read recent team messages |
| `comms.unread` | Get unread messages for a member |
| `curation.run` | Manually trigger memory curation |
| `curation.status` | Get curation status |
| `curation.candidates` | Read SOP candidate suggestions |
