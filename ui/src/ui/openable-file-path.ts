const LOCAL_PATH_HINT_RE = /(^~\/|^\/|^\.\.?\/|[\\/])/;

export function extractOpenableFilePath(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const unquoted = trimmed.replace(/^["']|["']$/g, "").trim();
  if (!unquoted) {
    return null;
  }

  // Keep external URLs as normal browser links.
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(unquoted)) {
    return null;
  }

  if (/[*?<>|]/.test(unquoted)) {
    return null;
  }

  if (unquoted.includes("\0") || unquoted.includes("\n") || unquoted.includes("\r")) {
    return null;
  }

  if (!LOCAL_PATH_HINT_RE.test(unquoted) && !/\.[a-z0-9]{1,12}$/i.test(unquoted)) {
    return null;
  }

  return unquoted;
}

export function extractOpenablePathFromEventTarget(target: EventTarget | null): string | null {
  const el =
    target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
  if (!el) {
    return null;
  }

  const anchor = el.closest("a");
  if (anchor) {
    const href = anchor.getAttribute("href") ?? "";
    let decoded = href;
    if (href.includes("%")) {
      try {
        decoded = decodeURIComponent(href);
      } catch {
        decoded = href;
      }
    }
    return extractOpenableFilePath(decoded);
  }

  const code = el.closest("code");
  if (!code || code.closest("pre")) {
    return null;
  }
  return extractOpenableFilePath(code.textContent ?? "");
}
