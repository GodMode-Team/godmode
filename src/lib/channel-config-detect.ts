type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as JsonRecord;
}

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasStringArray(value: unknown): boolean {
  return Array.isArray(value) && value.some((item) => hasNonEmptyString(item));
}

function hasNonEmptyRecord(value: unknown): boolean {
  const record = asRecord(value);
  return record != null && Object.keys(record).length > 0;
}

function resolveChannelSection(config: JsonRecord, channelId: string): JsonRecord | null {
  const channels = asRecord(config.channels);
  return asRecord(channels?.[channelId]) ?? asRecord(config[channelId]);
}

function hasTokenLikeConfig(section: JsonRecord | null): boolean {
  if (!section) {
    return false;
  }

  return [
    "token",
    "botToken",
    "appToken",
    "apiKey",
    "tokenSource",
    "botTokenSource",
    "appTokenSource",
    "credentialSource",
  ].some((key) => hasNonEmptyString(section[key]));
}

function hasSlackAudienceConfig(section: JsonRecord | null): boolean {
  if (!section) {
    return false;
  }

  return (
    hasNonEmptyString(section.channelId) ||
    hasNonEmptyString(section.defaultChannelId) ||
    hasNonEmptyString(section.teamId) ||
    hasNonEmptyString(section.workspaceId) ||
    hasNonEmptyString(section.accountId) ||
    hasNonEmptyString(section.dmPolicy) ||
    hasStringArray(section.allowFrom) ||
    hasStringArray(section.groupAllowFrom) ||
    hasStringArray(section.channelIds) ||
    hasNonEmptyRecord(section.channels)
  );
}

export function hasChannelConfiguration(config: JsonRecord, channelId: string): boolean {
  const section = resolveChannelSection(config, channelId);
  if (!section) {
    return false;
  }

  const dm = asRecord(section.dm);
  const auth = asRecord(section.auth);
  const oauth = asRecord(section.oauth);

  const genericConfigured =
    section.enabled === true ||
    hasNonEmptyString(section.phoneNumber) ||
    hasTokenLikeConfig(section) ||
    hasTokenLikeConfig(dm) ||
    hasTokenLikeConfig(auth) ||
    hasTokenLikeConfig(oauth);

  if (channelId !== "slack") {
    return genericConfigured;
  }

  return (
    genericConfigured ||
    hasSlackAudienceConfig(section) ||
    hasSlackAudienceConfig(dm) ||
    hasSlackAudienceConfig(auth) ||
    hasSlackAudienceConfig(oauth)
  );
}

export function getConfiguredChannels(config: JsonRecord, channelIds: string[]): string[] {
  return channelIds.filter((channelId) => hasChannelConfiguration(config, channelId));
}
