import { getAssistantConfig, isAssistantReady } from "@/lib/ai/config";
import { formatAssistantAnswer } from "@/lib/ai/formatAnswer";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { getAssistantProvider } from "@/lib/ai/provider";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { retrieveContext } from "@/lib/ai/retrieve";
import { validateAskInput } from "@/lib/ai/validate";
import type { AssistantAskResult, AssistantMessage } from "@/lib/ai/types";

function trimHistory(
  history: AssistantMessage[] | undefined,
  maxMessages: number,
): AssistantMessage[] {
  if (!history?.length) return [];
  if (history.length <= maxMessages) return history;
  return history.slice(-maxMessages);
}

export async function askAssistant(
  body: unknown,
  clientKey: string,
): Promise<AssistantAskResult> {
  const config = getAssistantConfig();

  const rate = checkRateLimit(
    clientKey,
    config.rateLimitMaxRequests,
    config.rateLimitWindowMs,
  );
  if (!rate.allowed) {
    return {
      ok: false,
      code: "rate_limited",
      error: "Too many requests. Please try again shortly.",
    };
  }

  const validated = validateAskInput(body, config.maxInputChars);
  if (!validated.ok) {
    return {
      ok: false,
      code: "validation_error",
      error: validated.error,
    };
  }

  if (!isAssistantReady(config)) {
    return {
      ok: false,
      code: "not_configured",
      error:
        "The portfolio assistant is temporarily unavailable. Please email hello@yafet.dev instead.",
    };
  }

  const history = trimHistory(
    validated.data.history,
    config.maxHistoryMessages,
  );

  // Retrieve from the latest user question (not the whole history dump)
  const context = retrieveContext(validated.data.message);
  const system = buildSystemPrompt(context);
  const provider = getAssistantProvider();

  if (!provider.isConfigured()) {
    return {
      ok: false,
      code: "not_configured",
      error:
        "The portfolio assistant is temporarily unavailable. Please email hello@yafet.dev instead.",
    };
  }

  try {
    const answer = await provider.generate({
      system,
      messages: [
        ...history,
        { role: "user", content: validated.data.message },
      ],
    });

    return {
      ok: true,
      answer: formatAssistantAnswer(answer),
      provider: provider.id,
      usedTopics: context.topics,
    };
  } catch {
    return {
      ok: false,
      code: "provider_error",
      error:
        "Something went wrong while answering. Please try again in a moment, or email hello@yafet.dev.",
    };
  }
}
