/**
 * Typed content model for the portfolio.
 * Only verified site identity + structural copy here.
 * Projects stay empty until real case content is added.
 */

export const site = {
  name: "Yafet Aklilu",
  monogram: "YA",
  role: "Full stack developer & digital creative",
  email: "yafet.aklilu3@gmail.com",
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
    treatment: "cards" as const,
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
 * Software projects shown on /work/software.
 * Only confirmed facts below; TBD fields stay empty.
 * Covers live under public/images/projects/<slug>/cover.png (BekuGuide pending).
 */
export const projects: Project[] = [
  {
    id: "delala",
    slug: "delala",
    name: "Delala",
    year: "",
    role: "Full stack development",
    summary:
      "Real estate rental product connecting owners and customers with less middleman friction.",
    intro:
      "A rental platform direction focused on clearer property discovery between owners and customers.",
    overview:
      "Delala targets the rental journey: owners manage properties and images, customers browse listings, and a read-only REST API backs the product. Broader product direction includes a modern frontend and AI-assisted discovery; that direction is not claimed as fully shipped.",
    contribution: "",
    features: [
      "Property and property image models",
      "Owner and customer roles",
      "Read-only REST API",
    ],
    categories: ["software"],
    softwareFocus: ["full-stack"],
    technologies: ["Django", "Python", "REST API"],
    cover: {
      src: "/images/projects/delala/cover.png",
      alt: "Delala project cover",
    },
    screenshots: [],
    images: [],
    hasMobileApp: false,
    presentation: "modal",
    featured: true,
  },
  {
    id: "ourmoment",
    slug: "ourmoment",
    name: "OurMoment.one",
    year: "",
    role: "Full stack development",
    summary:
      "Personalized digital gifting: customize a moment, share a private link, collect reactions.",
    intro:
      "Personalized digital moments designed to be created, shared, and experienced through a private link.",
    overview:
      "Users choose a template, customize a moment, activate or publish it, and share a private link. Recipients can experience the moment and leave reactions. Production readiness of every feature is not confirmed yet.",
    contribution: "",
    features: [
      "Template selection and moment customization",
      "Activate or publish a moment",
      "Private link sharing",
      "Recipient experience with reactions",
    ],
    categories: ["software"],
    softwareFocus: ["full-stack"],
    technologies: ["Laravel", "Vue", "Inertia.js", "Tailwind CSS"],
    cover: {
      src: "/images/projects/ourmoment/cover.png",
      alt: "OurMoment.one project cover",
    },
    screenshots: [],
    images: [],
    hasMobileApp: false,
    presentation: "modal",
    featured: true,
  },
  {
    id: "gebeta",
    slug: "gebeta",
    name: "Gebeta.one",
    year: "",
    role: "",
    summary: "Software product in the portfolio. Details to be completed.",
    intro: "",
    overview: "",
    contribution: "",
    features: [],
    categories: ["software"],
    softwareFocus: ["full-stack"],
    technologies: [],
    cover: {
      src: "/images/projects/gebeta/cover.png",
      alt: "Gebeta.one project cover",
    },
    screenshots: [],
    images: [],
    hasMobileApp: false,
    presentation: "modal",
    featured: true,
  },
  {
    id: "bekuguide",
    slug: "bekuguide",
    name: "BekuGuide",
    year: "",
    role: "",
    summary: "City discovery platform focused on Addis Ababa.",
    intro:
      "City discovery for Addis Ababa, presented at a high level until fuller case details are ready.",
    overview:
      "BekuGuide is a city discovery platform focused on Addis Ababa. Features, implementation specifics, current status, and links are still to be confirmed.",
    contribution: "",
    features: [],
    categories: ["software"],
    softwareFocus: ["full-stack"],
    technologies: [],
    // Cover pending: add public/images/projects/bekuguide/cover.png (or bekurguide/)
    screenshots: [],
    images: [],
    hasMobileApp: false,
    presentation: "modal",
    featured: true,
  },

  // ---------------------------------------------------------------------------
  // Graphic design — assets in public/images/graphics/
  // Card previews use a 1:1 (1080×1080) frame. Replace placeholder copy anytime.
  // ---------------------------------------------------------------------------
  {
    id: "graphic-logo-design",
    slug: "logo-design",
    name: "Logo Design",
    year: "",
    role: "Graphic design",
    summary: "Placeholder description for this logo design. Replace with final copy.",
    intro: "Placeholder intro for this logo design project.",
    overview:
      "Placeholder overview. Add the concept, audience, and design direction here when ready.",
    contribution:
      "Placeholder contribution notes. Describe your role and process here.",
    categories: ["graphic"],
    technologies: [],
    cover: {
      src: "/images/graphics/Logo-Design.PNG",
      alt: "Logo Design",
    },
    screenshots: [],
    images: [],
    presentation: "modal",
    featured: false,
  },
  {
    id: "graphic-business-card",
    slug: "business-card-design",
    name: "Business Card Design",
    year: "",
    role: "Graphic design",
    summary:
      "Placeholder description for this business card design. Replace with final copy.",
    intro: "Placeholder intro for this business card project.",
    overview:
      "Placeholder overview. Add layout intent, print details, and usage notes when ready.",
    contribution:
      "Placeholder contribution notes. Describe your role and process here.",
    categories: ["graphic"],
    technologies: [],
    cover: {
      src: "/images/graphics/Business-card-design.PNG",
      alt: "Business card design",
    },
    screenshots: [],
    images: [],
    presentation: "modal",
    featured: false,
  },
  {
    id: "graphic-id-badge",
    slug: "id-badge-design",
    name: "ID Badge Design",
    year: "",
    role: "Graphic design",
    summary: "Placeholder description for this ID badge design. Replace with final copy.",
    intro: "Placeholder intro for this ID badge project.",
    overview:
      "Placeholder overview. Add hierarchy, branding constraints, and production notes when ready.",
    contribution:
      "Placeholder contribution notes. Describe your role and process here.",
    categories: ["graphic"],
    technologies: [],
    cover: {
      src: "/images/graphics/ID-badge-design.PNG",
      alt: "ID badge design",
    },
    screenshots: [],
    images: [],
    presentation: "modal",
    featured: false,
  },
  {
    id: "graphic-brochure",
    slug: "brochure-design",
    name: "Brochure Design",
    year: "",
    role: "Graphic design",
    summary: "Placeholder description for this brochure design. Replace with final copy.",
    intro: "Placeholder intro for this brochure project.",
    overview:
      "Placeholder overview. Add fold format, messaging structure, and visual system notes when ready.",
    contribution:
      "Placeholder contribution notes. Describe your role and process here.",
    categories: ["graphic"],
    technologies: [],
    cover: {
      // Filename spelling: Brocher-design.JPG
      src: "/images/graphics/Brocher-design.JPG",
      alt: "Brochure design",
    },
    screenshots: [],
    images: [],
    presentation: "modal",
    featured: false,
  },
  {
    id: "graphic-rollup-banner",
    slug: "roll-up-banner-design",
    name: "Roll-up Banner Design",
    year: "",
    role: "Graphic design",
    summary:
      "Placeholder description for this roll-up banner design. Replace with final copy.",
    intro: "Placeholder intro for this roll-up banner project.",
    overview:
      "Placeholder overview. Add event context, hierarchy, and print specs when ready.",
    contribution:
      "Placeholder contribution notes. Describe your role and process here.",
    categories: ["graphic"],
    technologies: [],
    cover: {
      src: "/images/graphics/Roll-up-banner-design.PNG",
      alt: "Roll-up banner design",
    },
    screenshots: [],
    images: [],
    presentation: "modal",
    featured: false,
  },
  {
    id: "graphic-instagram-posts",
    slug: "instagram-posts",
    name: "Instagram Posts",
    year: "",
    role: "Graphic design",
    summary:
      "Placeholder description for these Instagram post designs. Replace with final copy.",
    intro: "Placeholder intro for this Instagram posts collection.",
    overview:
      "Placeholder overview. Add campaign theme, formats, and posting intent when ready.",
    contribution:
      "Placeholder contribution notes. Describe your role and process here.",
    categories: ["graphic"],
    technologies: [],
    cover: {
      src: "/images/graphics/Instagram-post.PNG",
      alt: "Instagram post design 1",
    },
    screenshots: [
      {
        // Filename spelling: Instagrm-post-design.PNG
        src: "/images/graphics/Instagrm-post-design.PNG",
        alt: "Instagram post design 2",
      },
      {
        src: "/images/graphics/Instagram-post-3.png",
        alt: "Instagram post design 3",
      },
    ],
    images: [],
    presentation: "modal",
    featured: false,
  },
];

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
