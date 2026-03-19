/**
 * Delegated click handler for file links in chat text.
 * Intercepts clicks on file:// and godmode-file:// anchors and routes to onOpenFile.
 */
export function handleChatFileClick(
  e: Event,
  onOpenFile?: (filePath: string) => void,
) {
  if (!onOpenFile) return;
  const target = e.target as HTMLElement;
  const anchor = target.closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href) return;

  // Handle file:// links (absolute paths linkified by linkifyFilePaths)
  if (href.startsWith("file://")) {
    e.preventDefault();
    e.stopPropagation();
    let filePath = href.slice("file://".length);
    // file:///~/... → ~/...
    if (filePath.startsWith("/~/")) {
      filePath = "~" + filePath.slice(2);
    }
    try {
      filePath = decodeURIComponent(filePath);
    } catch {
      // keep as-is
    }
    onOpenFile(filePath);
    return;
  }

  // Handle godmode-file:// links (bare filenames detected by linkifyFilePaths)
  if (href.startsWith("godmode-file://")) {
    e.preventDefault();
    e.stopPropagation();
    let filename = href.slice("godmode-file://".length);
    try {
      filename = decodeURIComponent(filename);
    } catch {
      // keep as-is
    }
    onOpenFile(filename);
    return;
  }
}
