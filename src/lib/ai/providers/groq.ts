import { getAssistantConfig, getProviderApiKey } from "@/lib/ai/config";
import type { AssistantMessage, AssistantProvider } from "@/lib/ai/types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export function createGroqProvider(): AssistantProvider {
  return {
    id: "groq",
    isConfigured() {
      const config = getAssistantConfig();
      return (
        config.provider === "groq" &&
        Boolean(getProviderApiKey("groq")) &&
        Boolean(config.model)
      );
    },
    async generate({ system, messages }) {
      const config = getAssistantConfig();
      const apiKey = getProviderApiKey("groq");
      if (!apiKey || !config.model) {
        throw new Error("Groq is not configured.");
      }

      const payloadMessages: { role: string; content: string }[] = [
        { role: "system", content: system },
        ...messages.map((message: AssistantMessage) => ({
          role: message.role,
          content: message.content,
        })),
      ];

      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          messages: payloadMessages,
          temperature: 0.4,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        // Avoid logging provider payloads (may include prompt fragments).
        throw new Error(`Groq request failed (${response.status}).`);
      }

      const data = (await response.json()) as {
        choices?: {
          message?: { content?: string | null; reasoning?: string | null };
        }[];
      };
      const message = data.choices?.[0]?.message;
      const content = message?.content?.trim();
      if (content) return content;

      // Some reasoning models may return empty content when max_tokens is tight.
      throw new Error("Groq returned an empty response.");
    },
  };
}
