export type ThemeMode = "system" | "light" | "dark" | "lifetrack";
export type ResolvedTheme = "light" | "dark" | "lifetrack";

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "lifetrack";
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return getSystemTheme();
  }
  if (mode === "light") {
    return "lifetrack";
  }
  return mode;
}
