import { assistantKnowledge } from "@/lib/ai/knowledge";
import type { ProjectRecord, SkillGroup } from "@/lib/ai/types";

export type RetrievedContext = {
  topics: string[];
  profileSnippet: string;
  skillGroups: SkillGroup[];
  projects: ProjectRecord[];
  goals: string[];
  contact: {
    email: string;
    url: string;
    socials: { label: string; href: string }[];
  };
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  profile: [
    "who",
    "about",
    "yourself",
    "background",
    "yafet",
    "introduce",
    "bio",
  ],
  skills: [
    "skill",
    "stack",
    "tech",
    "technologies",
    "react",
    "next",
    "laravel",
    "django",
    "python",
    "typescript",
    "frontend",
    "backend",
    "full-stack",
    "fullstack",
    "mobile",
    "gsap",
    "figma",
    "design",
    "video",
  ],
  projects: [
    "project",
    "portfolio",
    "work",
    "built",
    "delala",
    "bekur",
    "bekurguide",
    "org-360",
    "org360",
    "ourmoment",
    "our moment",
  ],
  goals: [
    "hire",
    "hiring",
    "job",
    "freelance",
    "remote",
    "available",
    "collaborat",
    "client",
    "recruiter",
    "opportunity",
  ],
  contact: ["contact", "email", "reach", "linkedin", "github", "resume", "cv"],
};

function normalize(text: string) {
  return text.toLowerCase();
}

/**
 * Lightweight topic retrieval: no embeddings / vector DB.
 * Select only the slices needed for the current question.
 */
export function retrieveContext(message: string): RetrievedContext {
  const q = normalize(message);
  const topics = new Set<string>();

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((keyword) => q.includes(keyword))) {
      topics.add(topic);
    }
  }

  // Default to a compact overview when intent is unclear
  if (topics.size === 0) {
    topics.add("profile");
    topics.add("skills");
    topics.add("contact");
  }

  const namedOnly = topics.has("projects")
    ? assistantKnowledge.projects.filter((project) => {
        const n = normalize(project.name);
        return (
          q.includes(n) ||
          q.includes(project.id) ||
          (project.id === "bekurguide" && q.includes("bekur")) ||
          (project.id === "org-360" &&
            (q.includes("360") || q.includes("org-360"))) ||
          (project.id === "ourmoment" && q.includes("moment"))
        );
      })
    : [];

  const selectedProjects =
    namedOnly.length > 0
      ? namedOnly
      : topics.has("projects")
        ? assistantKnowledge.projects
        : [];

  return {
    topics: [...topics],
    profileSnippet: topics.has("profile")
      ? assistantKnowledge.profile.summary
      : "",
    skillGroups: topics.has("skills") ? assistantKnowledge.skills : [],
    projects: selectedProjects,
    goals: topics.has("goals") ? assistantKnowledge.goals : [],
    contact: {
      email: assistantKnowledge.profile.email,
      url: assistantKnowledge.profile.url,
      socials: assistantKnowledge.profile.socials.map((social) => ({
        label: social.label,
        href: social.href,
      })),
    },
  };
}

export function formatContextForPrompt(context: RetrievedContext): string {
  const parts: string[] = [];

  parts.push(`Knowledge version: ${assistantKnowledge.version}`);
  parts.push(`Matched topics: ${context.topics.join(", ") || "none"}`);

  if (context.profileSnippet) {
    parts.push(`## Profile\n${context.profileSnippet}`);
    parts.push(
      `Name: ${assistantKnowledge.profile.name}\nRole: ${assistantKnowledge.profile.role}`,
    );
    parts.push(
      `Availability (confirmed framing): ${assistantKnowledge.profile.availability.value}`,
    );
    if (assistantKnowledge.profile.location.value == null) {
      parts.push("Location: not specified (TBD; do not invent).");
    }
  }

  if (context.skillGroups.length > 0) {
    parts.push("## Skills (areas of work; not expertise ratings)");
    for (const group of context.skillGroups) {
      parts.push(`${group.label}: ${group.items.join("; ")}`);
    }
  }

  if (context.projects.length > 0) {
    parts.push("## Projects (use only known facts; mark gaps honestly)");
    for (const project of context.projects) {
      parts.push(
        [
          `### ${project.name}`,
          `Summary (${project.summary.status}): ${project.summary.value}`,
          `Known: ${project.knownFacts.join("; ") || "none listed"}`,
          `Unconfirmed constraints: ${project.unconfirmedNotes.join("; ") || "none"}`,
          `Technologies (${project.technologies.status}): ${
            project.technologies.value.length
              ? project.technologies.value.join(", ")
              : "TBD"
          }`,
          `Live URL: ${project.liveUrl.value ?? "TBD"}`,
          `GitHub: ${project.githubUrl.value ?? "TBD"}`,
          `Contributions: ${project.contributions.value ?? "TBD"}`,
        ].join("\n"),
      );
    }
  }

  if (context.goals.length > 0) {
    parts.push(`## Goals\n${context.goals.map((goal, i) => `${i + 1}) ${goal}`).join("\n")}`);
  }

  parts.push(
    [
      "## Contact",
      `Email: ${context.contact.email}`,
      `Site: ${context.contact.url}`,
      ...context.contact.socials.map(
        (social) => `${social.label}: ${social.href}`,
      ),
    ].join("\n"),
  );

  return parts.join("\n\n");
}
