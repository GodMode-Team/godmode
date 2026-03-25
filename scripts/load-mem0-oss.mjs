const MEM0_COMMON_PEERS = [
  "@anthropic-ai/sdk",
  "@google/genai",
  "openai",
  "groq-sdk",
  "@qdrant/js-client-rest",
  "@supabase/supabase-js",
  "redis",
  "sqlite3",
  "neo4j-driver",
  "ollama",
  "pg",
];

function buildMem0ImportMessage(err) {
  const detail = err instanceof Error ? err.message : String(err);
  const missingMem0 = detail.includes("mem0ai/oss")
    || detail.includes("ERR_PACKAGE_PATH_NOT_EXPORTED")
    || detail.includes("Package subpath './oss'")
    || detail.includes("Cannot find package 'mem0ai'");
  const missingPeer = detail.includes("Cannot find package")
    || detail.includes("Cannot find module");
  const reason = missingMem0
    ? "mem0ai is missing or older than ^2.3.0, so the ./oss export is unavailable."
    : missingPeer
      ? "mem0ai/oss loaded its OSS bundle, but a required peer SDK for your configured providers is missing."
      : "mem0ai/oss failed to load.";

  return [
    `[Mem0] ${reason}`,
    "The OSS entry point eagerly imports provider SDKs during module load.",
    `Install mem0ai@^2.3.0 and any peers your config needs, for example: ${MEM0_COMMON_PEERS.join(", ")}.`,
    `Original error: ${detail}`,
  ].join(" ");
}

export async function loadMem0Oss() {
  try {
    return await import("mem0ai/oss");
  } catch (err) {
    throw new Error(buildMem0ImportMessage(err), {
      cause: err instanceof Error ? err : undefined,
    });
  }
}
