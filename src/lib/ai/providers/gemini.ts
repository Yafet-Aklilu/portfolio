import { getAssistantConfig, getProviderApiKey } from "@/lib/ai/config";
import type { AssistantMessage, AssistantProvider } from "@/lib/ai/types";

export function createGeminiProvider(): AssistantProvider {
  return {
    id: "gemini",
    isConfigured() {
      const config = getAssistantConfig();
      return (
        config.provider === "gemini" &&
        Boolean(getProviderApiKey("gemini")) &&
        Boolean(config.model)
      );
    },
    async generate({ system, messages }) {
      const config = getAssistantConfig();
      const apiKey = getProviderApiKey("gemini");
      if (!apiKey || !config.model) {
        throw new Error("Gemini is not configured.");
      }

      const model = config.model;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

      const contents = toGeminiContents(messages);
      if (contents.length === 0) {
        throw new Error("No messages to send to Gemini.");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: system }],
          },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed (${response.status}).`);
      }

      const data = (await response.json()) as {
        candidates?: {
          content?: { parts?: { text?: string }[] };
        }[];
      };

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }
      return text;
    },
  };
}

function toGeminiContents(messages: AssistantMessage[]) {
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const message of messages) {
    const role = message.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n\n${message.content}`;
    } else {
      contents.push({
        role,
        parts: [{ text: message.content }],
      });
    }
  }

  // Gemini requires the first content role to be "user"
  if (contents[0]?.role === "model") {
    contents.unshift({
      role: "user",
      parts: [{ text: "(continued conversation)" }],
    });
  }

  return contents;
}
