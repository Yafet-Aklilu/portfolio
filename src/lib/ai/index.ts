export { assistantKnowledge, getProjectById } from "@/lib/ai/knowledge";
export { askAssistant } from "@/lib/ai/service";
export { getAssistantConfig, isAssistantReady } from "@/lib/ai/config";
export { retrieveContext } from "@/lib/ai/retrieve";
export type {
  AssistantAskInput,
  AssistantAskResult,
  AssistantKnowledge,
  ProjectRecord,
} from "@/lib/ai/types";
