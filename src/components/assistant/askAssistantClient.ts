import type {
  AssistantClientAskResponse,
  AssistantUiMessage,
} from "@/components/assistant/types";

export async function askAssistantClient(
  message: string,
  history: AssistantUiMessage[],
): Promise<AssistantClientAskResponse> {
  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history.map((item) => ({
        role: item.role,
        content: item.content,
      })),
    }),
  });

  let data: AssistantClientAskResponse;
  try {
    data = (await response.json()) as AssistantClientAskResponse;
  } catch {
    return {
      ok: false,
      error:
        "Something went wrong while answering. Please try again in a moment.",
    };
  }

  if (!response.ok && data && typeof data === "object" && "ok" in data) {
    return data;
  }

  return data;
}
