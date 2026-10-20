import type { AssistantProvider } from "@/lib/ai/types";

/**
 * Default provider before credentials are connected.
 * Never calls an external network API.
 */
export function createStubProvider(
  label: string = "stub",
): AssistantProvider {
  return {
    id: label,
    isConfigured() {
      return false;
    },
    async generate() {
      throw new Error(
        "Assistant provider is not configured. Set AI_ASSISTANT_ENABLED and provider credentials on the server.",
      );
    },
  };
}
