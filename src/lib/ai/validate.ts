import type { AssistantAskInput, AssistantMessage } from "@/lib/ai/types";

export type ValidationSuccess = { ok: true; data: AssistantAskInput };
export type ValidationFailure = { ok: false; error: string };

export function validateAskInput(
  body: unknown,
  maxInputChars: number,
): ValidationSuccess | ValidationFailure {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const record = body as Record<string, unknown>;
  const message = record.message;

  if (typeof message !== "string" || !message.trim()) {
    return { ok: false, error: "Please include a non-empty message." };
  }

  const trimmed = message.trim();
  if (trimmed.length > maxInputChars) {
    return {
      ok: false,
      error: `Message is too long (max ${maxInputChars} characters).`,
    };
  }

  let history: AssistantMessage[] | undefined;
  if (record.history !== undefined) {
    if (!Array.isArray(record.history)) {
      return { ok: false, error: "history must be an array when provided." };
    }
    if (record.history.length > 12) {
      return { ok: false, error: "history is too long." };
    }
    history = [];
    for (const item of record.history) {
      if (!item || typeof item !== "object") {
        return { ok: false, error: "Invalid history item." };
      }
      const row = item as Record<string, unknown>;
      if (
        (row.role !== "user" && row.role !== "assistant") ||
        typeof row.content !== "string"
      ) {
        return { ok: false, error: "Invalid history item." };
      }
      const content = row.content.trim();
      if (!content || content.length > maxInputChars) {
        return { ok: false, error: "Invalid history content." };
      }
      history.push({ role: row.role, content });
    }
  }

  return {
    ok: true,
    data: {
      message: trimmed,
      history,
    },
  };
}
