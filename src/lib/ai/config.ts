/**
 * Server-only assistant configuration.
 * Never expose secret keys via NEXT_PUBLIC_* or client bundles.
 */

export type AssistantProviderId = "stub" | "groq" | "gemini";

export type AssistantConfig = {
  enabled: boolean;
  provider: AssistantProviderId;
  model: string | null;
  apiKeyPresent: boolean;
  maxInputChars: number;
  maxHistoryMessages: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
};

function readProvider(): AssistantProviderId {
  const value = (process.env.AI_ASSISTANT_PROVIDER ?? "stub").toLowerCase();
  if (value === "groq" || value === "gemini" || value === "stub") {
    return value;
  }
  return "stub";
}

function readApiKey(provider: AssistantProviderId): string | undefined {
  if (provider === "groq") return process.env.GROQ_API_KEY?.trim();
  if (provider === "gemini") return process.env.GEMINI_API_KEY?.trim();
  return undefined;
}

export function getAssistantConfig(): AssistantConfig {
  const provider = readProvider();
  const apiKey = readApiKey(provider);
  const enabled = process.env.AI_ASSISTANT_ENABLED === "true";

  return {
    enabled,
    provider,
    model: process.env.AI_ASSISTANT_MODEL?.trim() || null,
    apiKeyPresent: Boolean(apiKey),
    maxInputChars: Number(process.env.AI_ASSISTANT_MAX_INPUT_CHARS ?? 2000),
    maxHistoryMessages: Number(
      process.env.AI_ASSISTANT_MAX_HISTORY_MESSAGES ?? 10,
    ),
    rateLimitWindowMs: Number(
      process.env.AI_ASSISTANT_RATE_LIMIT_WINDOW_MS ?? 60_000,
    ),
    rateLimitMaxRequests: Number(
      process.env.AI_ASSISTANT_RATE_LIMIT_MAX ?? 20,
    ),
  };
}

export function getProviderApiKey(provider: AssistantProviderId) {
  return readApiKey(provider);
}

export function isAssistantReady(config = getAssistantConfig()) {
  return (
    config.enabled &&
    config.provider !== "stub" &&
    config.apiKeyPresent &&
    Boolean(config.model)
  );
}
