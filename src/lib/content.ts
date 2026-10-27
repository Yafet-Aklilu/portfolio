/**
 * Typed content model for the portfolio.
 * Site identity, category copy, CVs, and tech strip live here.
 * Project case content is managed in Supabase via /admin (see src/lib/projects.ts).
 */

export const site = {
  name: "Yafet Aklilu",
  monogram: "YA",
  role: "Full stack developer & digital creative",
  email: "yafet.aklilu0@gmail.com",
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
    treatment: "cards" as const,
  },
  {
    id: "ui-ux",
    label: "UI / UX",
    title: "UI / UX Design",
    href: "/work/ui-ux",
    description: "Interface design, systems, and product flows.",
    empty:
      "UI and UX case studies will appear here as interface work is ready to publish.",
    treatment: "frames" as const,
  },
  {
    id: "graphic",
    label: "Graphic",
    title: "Graphic Design",
    href: "/work/graphic",
    description: "Identity, visual systems, and graphic work.",
    empty:
      "Graphic pieces will appear here when finished work is ready to show.",
    treatment: "cards" as const,
  },
  {
    id: "video",
    label: "Video",
    title: "Video / Motion",
    href: "/work/video",
    description: "Motion, edit, and visual storytelling.",
    empty:
      "Motion and edit work will appear here when finished cuts are ready to show.",
    treatment: "motion" as const,
  },
] as const;

export type WorkCategoryId = (typeof workCategories)[number]["id"];
export type WorkCategory = (typeof workCategories)[number];

/** Role-specific CVs under /public/cv */
export const cvs = [
  {
    id: "software",
    label: "Software Engineering",
    shortLabel: "Software",
    href: "/cv/software.pdf",
    categories: ["software"] as const satisfies readonly WorkCategoryId[],
  },
  {
    id: "ui-ux",
    label: "UI / UX Design",
    shortLabel: "UI / UX",
    href: "/cv/ui-ux.pdf",
    categories: ["ui-ux"] as const satisfies readonly WorkCategoryId[],
  },
  {
    id: "creative",
    label: "Video & Graphics",
    shortLabel: "Creative",
    href: "/cv/creative.pdf",
    categories: ["graphic", "video"] as const satisfies readonly WorkCategoryId[],
  },
] as const;

export type CvItem = (typeof cvs)[number];

export function getCvForCategory(categoryId: WorkCategoryId): CvItem | undefined {
  return cvs.find((cv) =>
    (cv.categories as readonly WorkCategoryId[]).includes(categoryId),
  );
}

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

/**
 * Asset convention (under /public):
 *   /images/projects/<slug>/cover.webp|png|jpg
 *   /images/projects/<slug>/screens/01.webp …
 *   /images/projects/<slug>/mobile.webp|png|jpg  (optional; only when hasMobileApp)
 */
export type Project = {
  id: string;
  slug: string;
  name: string;
  year: string;
  role: string;
  /** Short card blurb */
  summary: string;
  /** Modal hero intro; falls back to summary when omitted */
  intro?: string;
  /** Product / problem overview for the modal */
  overview?: string;
  /** Actual role and work on the project */
  contribution?: string;
  /** Important implemented features */
  features?: string[];
  categories: WorkCategoryId[];
  softwareFocus?: SoftwareFocus[];
  technologies: string[];
  /** Card + modal hero cover */
  cover?: ProjectImage;
  /** Additional website screenshots for the visual showcase */
  screenshots?: ProjectImage[];
  /**
   * @deprecated Prefer cover + screenshots. Still read as a cover fallback
   * for older entries.
   */
  images: ProjectImage[];
  /** Set when a mobile app exists and a mockup asset is available */
  hasMobileApp?: boolean;
  mobileMockup?: ProjectImage;
  liveUrl?: string;
  githubUrl?: string;
  presentation: "modal" | "page";
  featured: boolean;
  draft?: boolean;
  problem?: string;
  approach?: string;
  outcome?: string;
};

export function getProjectCover(project: Project): ProjectImage | undefined {
  return project.cover ?? project.images[0];
}

export function getProjectScreenshots(project: Project): ProjectImage[] {
  if (project.screenshots && project.screenshots.length > 0) {
    return project.screenshots;
  }
  if (project.cover && project.images.length > 0) {
    return project.images;
  }
  if (!project.cover && project.images.length > 1) {
    return project.images.slice(1);
  }
  return [];
}

export type TechStripItem = {
  id: string;
  name: string;
  logoSrc: string;
  href?: string;
};

/**
 * Brand marks for tools used in the practice (software lead, creative as
 * complementary). Icons are official Simple Icons marks where available.
 */
export const techStrip: TechStripItem[] = [
  { id: "react", name: "React", logoSrc: "/tech/react.svg" },
  { id: "nextjs", name: "Next.js", logoSrc: "/tech/nextjs.svg" },
  { id: "typescript", name: "TypeScript", logoSrc: "/tech/typescript.svg" },
  { id: "javascript", name: "JavaScript", logoSrc: "/tech/javascript.svg" },
  { id: "nodejs", name: "Node.js", logoSrc: "/tech/nodejs.svg" },
  { id: "python", name: "Python", logoSrc: "/tech/python.svg" },
  { id: "django", name: "Django", logoSrc: "/tech/django.svg" },
  { id: "laravel", name: "Laravel", logoSrc: "/tech/laravel.svg" },
  { id: "php", name: "PHP", logoSrc: "/tech/php.svg" },
  { id: "vue", name: "Vue", logoSrc: "/tech/vue.svg" },
  { id: "postgres", name: "PostgreSQL", logoSrc: "/tech/postgres.svg" },
  { id: "tailwind", name: "Tailwind CSS", logoSrc: "/tech/tailwind.svg" },
  { id: "gsap", name: "GSAP", logoSrc: "/tech/gsap.svg" },
  { id: "framer", name: "Framer Motion", logoSrc: "/tech/framer.svg" },
  { id: "figma", name: "Figma", logoSrc: "/tech/figma.svg" },
  { id: "photoshop", name: "Photoshop", logoSrc: "/tech/photoshop.svg" },
  { id: "canva", name: "Canva", logoSrc: "/tech/canva.svg" },
  { id: "davinci", name: "DaVinci Resolve", logoSrc: "/tech/davinci.svg" },
  { id: "capcut", name: "CapCut", logoSrc: "/tech/capcut.svg" },
];

/**
 * Offline fallback only. Live project content is managed in Supabase via /admin
 * and loaded through src/lib/projects.ts.
 */
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

const techMarkAliases: Record<string, string> = {
  "next.js": "nextjs",
  nextjs: "nextjs",
  "node.js": "nodejs",
  node: "nodejs",
  "vue.js": "vue",
  vue: "vue",
  tailwind: "tailwind",
  "tailwind css": "tailwind",
  "framer motion": "framer",
  framer: "framer",
  "adobe photoshop": "photoshop",
  photoshop: "photoshop",
  "davinci resolve": "davinci",
  davinci: "davinci",
  postgresql: "postgres",
  postgres: "postgres",
  "green sock": "gsap",
  greensock: "gsap",
  gsap: "gsap",
  capcut: "capcut",
  canva: "canva",
  figma: "figma",
};

export function findTechMark(name: string): TechStripItem | undefined {
  const normalized = name.trim().toLowerCase();
  const aliasId = techMarkAliases[normalized];
  if (aliasId) {
    return techStrip.find((item) => item.id === aliasId);
  }
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
