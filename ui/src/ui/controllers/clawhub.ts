/**
 * ClawHub controller — stub (killed in lean audit).
 */

export type ClawHubMessage = {
  kind: "success" | "error";
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function searchClawHub(_state: unknown, _query: string): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exploreClawHub(_state: unknown, _sort?: string): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getClawHubDetail(_state: unknown, _slug: string): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function clearClawHubDetail(_state: unknown): void {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function importFromClawHub(_state: unknown, _slug: string): Promise<boolean> {
  return false;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPersonalizePrompt(_state: unknown, _slug: string): Promise<string | null> {
  return null;
}
