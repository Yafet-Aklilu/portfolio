import { getAssistantConfig } from "@/lib/ai/config";
import { createGeminiProvider } from "@/lib/ai/providers/gemini";
import { createGroqProvider } from "@/lib/ai/providers/groq";
import { createStubProvider } from "@/lib/ai/providers/stub";
import type { AssistantProvider } from "@/lib/ai/types";

/**
 * Provider factory: change AI_ASSISTANT_PROVIDER in env to switch.
 */
export function getAssistantProvider(): AssistantProvider {
  const config = getAssistantConfig();

  switch (config.provider) {
    case "groq":
      return createGroqProvider();
    case "gemini":
      return createGeminiProvider();
    case "stub":
    default:
      return createStubProvider("stub");
  }
}
