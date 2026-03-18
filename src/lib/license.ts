/**
 * license.ts — License state (open-source edition).
 *
 * All license gates are bypassed. GodMode is free and open-source.
 * This file preserves the export signatures so callers don't need changes.
 */

export type LicenseState = {
  status: "pending" | "validating" | "valid" | "invalid" | "no-key" | "expired";
  tier?: string;
  email?: string;
  checkedAt?: number;
  error?: string;
};

const VALID_STATE: LicenseState = {
  status: "valid",
  checkedAt: Date.now(),
  tier: "open-source",
};

export function getLicenseState(): LicenseState {
  return VALID_STATE;
}

export function setLicenseState(_state: LicenseState): void {
  // no-op — always valid
}

export function isDevKey(_key: string): boolean {
  return true;
}

export async function validateLicense(
  _key: string,
  _logger: { warn: (msg: string) => void; info: (msg: string) => void },
): Promise<boolean> {
  return true;
}

/**
 * Passthrough — no license gate. Handler is returned unwrapped.
 */
export function withLicenseGate(
  _key: string | undefined,
  _logger: { warn: (msg: string) => void; info: (msg: string) => void },
  handler: Function,
): Function {
  return handler;
}

export function initLicenseFromConfig(
  _licenseKey: string | undefined,
  logger: { warn: (msg: string) => void; info: (msg: string) => void },
): LicenseState {
  logger.info("[GodMode] Open-source edition — no license required");
  return VALID_STATE;
}

export async function refreshLicenseOnStart(
  _logger: { warn: (msg: string) => void; info: (msg: string) => void },
): Promise<void> {
  // no-op
}
