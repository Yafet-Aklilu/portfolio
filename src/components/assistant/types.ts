export type AssistantUiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AssistantPanelProps = {
  open: boolean;
  onClose: () => void;
};

export type AssistantClientAskResponse =
  | {
      ok: true;
      answer: string;
      usedTopics?: string[];
    }
  | {
      ok: false;
      error: string;
      code?: string;
    };
