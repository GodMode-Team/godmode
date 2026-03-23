# Contributing to GodMode

Thanks for your interest in GodMode! This guide covers everything you need to get started.

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9
- **OpenClaw** runtime (`npm install -g openclaw`)

## Local Development

```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm build

# Type-check without emitting
pnpm typecheck

# Run tests
npx vitest run

# UI development (Vite dev server)
pnpm dev:ui

# Build UI + sync snapshot fallback
pnpm build:ui && pnpm ui:sync
```

## Architecture Overview

```
index.ts                    → Plugin entry point (hooks + handler registration)
src/
  hooks/                    → Lifecycle hooks (before_prompt_build, message_received, etc.)
  methods/                  → RPC handlers exposed to UI and ally
  tools/                    → LLM-callable tools (ally uses these in conversation)
  services/                 → Background services (queue, heartbeat, vault capture)
  lib/                      → Shared helpers (memory, context budget, identity, etc.)
  types/                    → TypeScript type definitions
  adapter/                  → Hermes adapter (standalone mode)
ui/
  src/                      → Lit web components (Vite build)
assets/
  godmode-ui/               → Committed UI snapshot fallback
  agent-roster/             → Persona markdown files
  skills/                   → Executable skill files
skill-cards/                → Skill card YAML+markdown files
```

## How to Add a New Tool

Tools are LLM-callable functions the ally can invoke during conversation.

1. Create `src/tools/my-tool.ts`:
   ```typescript
   import type { PluginToolDefinition } from "../types/plugin-api.js";

   export function myTool(): PluginToolDefinition {
     return {
       name: "godmode_my_tool",
       description: "What this tool does",
       input_schema: {
         type: "object",
         properties: { /* params */ },
         required: [],
       },
       execute: async (_toolCallId, params) => {
         // Implementation
         return { type: "text", text: JSON.stringify({ ok: true }) };
       },
     };
   }
   ```

2. Register it in `src/hooks/lifecycle-hooks.ts` inside the `before_prompt_build` tool array.

3. Build and verify: `pnpm build && pnpm typecheck`

## How to Add a New RPC Method

RPC methods are called by the UI or external clients via the gateway.

1. Create `src/methods/my-method.ts`:
   ```typescript
   import type { GatewayRequestHandler } from "../types/plugin-api.js";

   const myHandler: GatewayRequestHandler = async ({ params, respond }) => {
     // Implementation
     respond(true, { result: "ok" });
   };

   export default { "godmode.my-method": myHandler };
   ```

2. Import and spread into the handlers object in `src/methods/register-all.ts`.

3. Build and verify: `pnpm build && pnpm typecheck`

## Branch Discipline

- **Never work directly on `main`** — always create a feature branch.
- **One branch per task**: `feat/my-feature`, `fix/bug-name`, `chore/cleanup`.
- Branch protection requires CI pass + PR review before merge.

## Pull Request Process

1. Create your feature branch from `main`.
2. Make your changes with clear, atomic commits.
3. Run the full check suite: `pnpm build && pnpm typecheck && npx vitest run`
4. Open a PR with a description of what changed and why.
5. Address review feedback.

## Coding Conventions

- TypeScript ESM only (`.ts` files, `.js` extensions in imports).
- Prefer explicit error objects: `{ code, message }`.
- Validate all user-controlled paths.
- Do not read/write outside allowed data roots (`~/godmode/`).
- Keep runtime dependencies minimal.

## License

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0](LICENSE) license.
