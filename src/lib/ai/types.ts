export type KnowledgeStatus = "confirmed" | "unconfirmed" | "tbd";

export type KnowledgeFact<T> = {
  value: T;
  status: KnowledgeStatus;
  notes?: string;
};

export type ProjectRecord = {
  id: string;
  name: string;
  /** Short public-safe summary; may mix confirmed framing with TBD gaps */
  summary: KnowledgeFact<string>;
  knownFacts: string[];
  unconfirmedNotes: string[];
  technologies: KnowledgeFact<string[]>;
  contributions: KnowledgeFact<string | null>;
  challenges: KnowledgeFact<string | null>;
  solutions: KnowledgeFact<string | null>;
  liveUrl: KnowledgeFact<string | null>;
  githubUrl: KnowledgeFact<string | null>;
  status: KnowledgeFact<string | null>;
  screenshots: KnowledgeFact<string[]>;
};

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
  notes?: string;
};

export type AssistantKnowledge = {
  version: string;
  profile: {
    name: string;
    role: string;
    summary: string;
    email: string;
    url: string;
    socials: { id: string; label: string; href: string }[];
    resumeUrl: string | null;
    location: KnowledgeFact<string | null>;
    availability: KnowledgeFact<string>;
  };
  audiences: string[];
  skills: SkillGroup[];
  projects: ProjectRecord[];
  goals: string[];
  behavior: {
    voice: string[];
    avoid: string[];
    identityDisclosure: string;
    contactFallback: string;
  };
  safety: string[];
};

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AssistantAskInput = {
  message: string;
  /** Optional prior turns for future multi-turn chat */
  history?: AssistantMessage[];
};

export type AssistantAskResult =
  | {
      ok: true;
      answer: string;
      provider: string;
      usedTopics: string[];
    }
  | {
      ok: false;
      error: string;
      code:
        | "not_configured"
        | "validation_error"
        | "rate_limited"
        | "provider_error";
    };

export type AssistantProvider = {
  id: string;
  isConfigured(): boolean;
  generate(args: {
    system: string;
    messages: AssistantMessage[];
  }): Promise<string>;
};
