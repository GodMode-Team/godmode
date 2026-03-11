---
domain: files
triggers: file, read file, write file, save, artifact, document, export, drive, google drive, readme, push to, save to, create an artifact
tools: files.read, files.listDriveAccounts, files.pushToDrive
---
## When to Use
- User asks to read, write, or manage files
- Creating artifacts (documents, plans, reports)
- Pushing files to Google Drive

## How to Use
- `files.read` — { path } — read file content (must be within allowed roots)
- `files.pushToDrive` — { filePath, driveFolderPath? } — push to Google Drive
- `files.batchPushToDrive` — { files[] } — push multiple files
- `files.listDriveAccounts` — list connected Drive accounts

## Allowed Paths
- ~/godmode/ — all GodMode data, memory, artifacts
- Vault path (OBSIDIAN_VAULT_PATH or ~/Documents/VAULT/)
- NEVER read/write outside these roots

## Gotchas
- Path traversal protection — `../` is normalized and checked
- Always use absolute paths, not relative
- Large files may be truncated — check response for truncation markers
- Drive push requires Google integration — check integrations.status first

## Tips
- For artifacts (project plans, reports), write to ~/godmode/memory/artifacts/
- For vault notes, write to the appropriate PARA folder
- When user says "save this", create a well-named markdown file — don't ask where
- Proactively suggest "Want me to save this to your vault?" after creating anything substantial
