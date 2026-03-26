# Resource Strip & Sidebar File Viewer — UX Research Spec

## Research Sources: Claude, ChatGPT, Manus AI

### Claude Artifacts (Best-in-Class Reference)
- **Split-pane layout**: Chat left, artifact right. Clean 60/40 default split.
- **Artifact types**: Code, HTML/React (live preview), SVG, Markdown, Mermaid diagrams, images.
- **Version selector**: Navigate between artifact versions with prev/next arrows.
- **Toolbar**: Copy, download, run (for React/HTML), view code toggle. Bottom-right corner.
- **Inline references**: Artifacts referenced in-chat as clickable pill/chip that opens sidebar.
- **Animation**: Smooth slide-in from right with subtle opacity fade (200ms ease-out).
- **Visual hierarchy**: Artifact title prominent, type badge subtle, content fills remaining space.
- **"Try fixing" UX**: Error states show actionable button to auto-fix.

### ChatGPT Canvas / Artifacts
- **Full-width canvas**: Opens as full right panel, squeezes chat to ~40%.
- **File attachments**: Thumbnails in-chat for images, expandable cards for docs.
- **Code viewer**: Syntax highlighting, line numbers, copy button.
- **Content types**: Code, documents, data analysis charts, DALL-E images.
- **Grouped cards**: Multiple outputs shown as horizontal scrollable card strip.
- **Preview mode**: HTML/code can be previewed live in iframe.
- **Download actions**: Each artifact has download/copy/share in header bar.
- **Dark/light aware**: Canvas matches theme seamlessly.

### Manus AI (Web App Builder)
- **Task-based artifacts**: Full web apps, slides, designs as output artifacts.
- **Live preview**: Built sites shown in embedded iframe with URL bar.
- **File tree sidebar**: Shows project structure (files/folders) when building apps.
- **Progress visualization**: Shows build steps while generating.
- **Version control**: Edit history with rollback.
- **Export actions**: Download code, deploy, share link.
- **Rich previews**: Images rendered inline, HTML in sandboxed frames.

## Synthesized Design Patterns for GodMode

### 1. Resource Strip (Bottom of Chat)
**Pattern**: Horizontal scrollable strip of resource chips below the conversation.
- **Thumbnails for images**: Show actual image thumbnails (40x40) instead of emoji icons.
- **Type-specific icons**: SVG icons instead of emoji for cleaner look.
- **Hover preview**: Tooltip with file name, type, size on hover.
- **Click → sidebar**: Single click opens in sidebar file viewer.
- **Pin indicator**: Subtle star/pin icon on pinned resources.
- **Overflow**: Smooth horizontal scroll with fade edges, "+N more" chip.
- **Collapse/expand**: Toggle to minimize strip to single line.

### 2. Sidebar File Viewer (Right Panel)
**Pattern**: Full-featured file viewer that handles ALL content types.
- **Images**: Inline render with zoom, pan. Lightbox on click.
- **Video**: HTML5 video player with controls (mp4, webm, mov).
- **Audio**: Waveform player with play/pause/seek (mp3, wav, m4a).
- **HTML**: Sandboxed iframe with "Open in browser" action.
- **Markdown**: Rendered with syntax highlighting, clickable file links.
- **Code**: Syntax-highlighted with line numbers, language badge, copy button.
- **PDF**: Embedded PDF viewer (iframe with data URL).
- **SVG**: Rendered inline with zoom controls.
- **CSV/Data**: Simple table preview with sortable columns.
- **JSON**: Formatted/collapsible tree view.
- **Plain text**: Monospace with line numbers.

### 3. Visual Quality Standards
- **Smooth animations**: 200ms slide-in, opacity transitions.
- **Theme-aware**: All viewers respect dark/light theme.
- **Responsive**: Full-screen modal on mobile, split-pane on desktop.
- **Loading states**: Skeleton shimmer while content loads.
- **Error states**: Friendly message + "View Raw" fallback.
- **Typography**: Clean, readable. 14px body, 13px mono for code.
