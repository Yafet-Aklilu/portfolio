/**
 * Typed content model for the portfolio.
 * Only verified site identity + structural copy here.
 * Projects stay empty until real case content is added.
 */

export const site = {
  name: "Yafet Aklilu",
  monogram: "YA",
  role: "Full stack developer & digital creative",
  email: "hello@yafet.dev",
  url: "https://yafet.dev",
  headline:
    "I design and build digital products: full stack systems with interface, visual, and motion craft.",
  description:
    "Full stack development first, with mobile and AI integration for businesses, plus UI/UX, graphic design, and video editing as one continuous practice.",
  socials: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/Yafet-Aklilu",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/yafet-aklilu",
    },
  ],
  resumeUrl: undefined as string | undefined,
} as const;

export type SocialLink = (typeof site.socials)[number];

export const homeCopy = {
  heroLabel: "Portfolio",
  heroLines: ["Yafet", "Aklilu"] as const,
  heroSupport:
    "Full stack products with interface, visual, and motion craft. One practice from concept to ship.",
  introLabel: "Introduction",
  introHeadline: "One practice. Many surfaces.",
  introBody:
    "I build full stack systems people can rely on, shape the interfaces they touch, and carry the visual finish through graphic and motion work. Mobile experiences and AI integration for businesses sit inside that same loop: not as side offers, but as ways the product needs to live.",
  techLabel: "Tools in the stack",
  workLabel: "Selected work",
  workHeadline: "Experiences worth entering.",
  workEmpty:
    "Featured projects will land in this chapter as soon as case studies are ready. Until then, the four work lanes below are open and structured for real entries.",
  workCta: "Browse categories",
  disciplinesLabel: "Practice",
  disciplinesHeadline: "How the work holds together.",
  contactLabel: "Contact",
  contactHeadline: "Have something worth making?",
  contactBody:
    "Open to remote full stack and hybrid creative engineering roles, plus freelance product, interface, visual, and motion collaborations.",
} as const;

export const disciplines = [
  {
    id: "full-stack",
    title: "Full stack",
    summary:
      "Web systems from API to interface: products that hold up under real use. AI integration for businesses lives here when it serves the product.",
  },
  {
    id: "product-surfaces",
    title: "Product surfaces",
    summary:
      "Mobile and web experiences people actually touch: flows, hierarchy, and clarity on the devices that matter.",
  },
  {
    id: "interface-visual",
    title: "Interface & visual",
    summary:
      "UI/UX and graphic direction as one shaping pass: systems, identity, and composition before and during build.",
  },
  {
    id: "motion-story",
    title: "Motion & story",
    summary:
      "Video and motion craft that carry pace and atmosphere beyond the UI shell.",
  },
] as const;

export type Discipline = (typeof disciplines)[number];

/** Primary work category routes */
export const workCategories = [
  {
    id: "software",
    label: "Software",
    title: "Software Development",
    href: "/work/software",
    description: "Full stack, mobile, and AI integration.",
    empty:
      "This lane is reserved for full stack products, mobile surfaces, and AI integrations for businesses. Project stories will open here as they are ready to show.",
    treatment: "list" as const,
  },
  {
    id: "ui-ux",
    label: "UI / UX",
    title: "UI / UX Design",
    href: "/work/ui-ux",
    description: "Interface design, systems, and product flows.",
    empty:
      "Interface work will sit in framed studies: flows, systems, and UI crops. Composition is ready; projects publish when the assets are.",
    treatment: "frames" as const,
  },
  {
    id: "graphic",
    label: "Graphic",
    title: "Graphic Design",
    href: "/work/graphic",
    description: "Identity, visual systems, and graphic work.",
    empty:
      "Graphic pieces will occupy poster scale slots. No filler artwork: only finished work when it is ready to show.",
    treatment: "poster" as const,
  },
  {
    id: "video",
    label: "Video",
    title: "Video / Motion",
    href: "/work/video",
    description: "Motion, edit, and visual storytelling.",
    empty:
      "Motion work will use poster frames and intentional play: never autoplay backgrounds. Slots are held for lead cuts and supporting edits.",
    treatment: "motion" as const,
  },
] as const;

export type WorkCategoryId = (typeof workCategories)[number]["id"];
export type WorkCategory = (typeof workCategories)[number];

export type SoftwareFocus = "full-stack" | "mobile" | "ai-integration";

export const softwareFocusFilters: {
  id: SoftwareFocus | "all";
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "full-stack", label: "Full stack" },
  { id: "mobile", label: "Mobile" },
  { id: "ai-integration", label: "AI integration" },
];

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  year: string;
  role: string;
  summary: string;
  categories: WorkCategoryId[];
  softwareFocus?: SoftwareFocus[];
  technologies: string[];
  images: ProjectImage[];
  liveUrl?: string;
  githubUrl?: string;
  presentation: "modal" | "page";
  featured: boolean;
  draft?: boolean;
  problem?: string;
  approach?: string;
  outcome?: string;
};

export type TechStripItem = {
  id: string;
  name: string;
  logoSrc: string;
  href?: string;
};

/** Monochrome marks for tools used in the practice; not project claims */
export const techStrip: TechStripItem[] = [
  { id: "react", name: "React", logoSrc: "/tech/react.svg" },
  { id: "nextjs", name: "Next.js", logoSrc: "/tech/nextjs.svg" },
  { id: "typescript", name: "TypeScript", logoSrc: "/tech/typescript.svg" },
  { id: "nodejs", name: "Node.js", logoSrc: "/tech/nodejs.svg" },
  { id: "laravel", name: "Laravel", logoSrc: "/tech/laravel.svg" },
  { id: "postgres", name: "PostgreSQL", logoSrc: "/tech/postgres.svg" },
  { id: "tailwind", name: "Tailwind", logoSrc: "/tech/tailwind.svg" },
  { id: "gsap", name: "GSAP", logoSrc: "/tech/gsap.svg" },
  { id: "figma", name: "Figma", logoSrc: "/tech/figma.svg" },
];

export const projects: Project[] = [];

export function getWorkCategory(id: string): WorkCategory | undefined {
  return workCategories.find((category) => category.id === id);
}

export function getPublishedProjects(): Project[] {
  return projects.filter((project) => !project.draft);
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getProjectsByCategory(category: WorkCategoryId): Project[] {
  return getPublishedProjects().filter((project) =>
    project.categories.includes(category),
  );
}

export function getProjectsBySoftwareFocus(focus: SoftwareFocus): Project[] {
  return getPublishedProjects().filter((project) =>
    project.softwareFocus?.includes(focus),
  );
}

export function findTechMark(name: string): TechStripItem | undefined {
  const normalized = name.trim().toLowerCase();
  return techStrip.find(
    (item) =>
      item.name.toLowerCase() === normalized ||
      item.id === normalized ||
      item.name.toLowerCase().replace(".js", "") ===
        normalized.replace(".js", ""),
  );
}

export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/#contact" },
] as const;
