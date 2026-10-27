import type {
  Project,
  ProjectImage,
  SoftwareFocus,
  WorkCategoryId,
} from "@/lib/content";

export type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  year: string;
  role: string;
  summary: string;
  intro: string;
  overview: string;
  contribution: string;
  features: string[] | null;
  categories: string[] | null;
  software_focus: string[] | null;
  technologies: string[] | null;
  cover: ProjectImage | null;
  screenshots: ProjectImage[] | null;
  images: ProjectImage[] | null;
  has_mobile_app: boolean;
  mobile_mockup: ProjectImage | null;
  live_url: string | null;
  github_url: string | null;
  presentation: "modal" | "page";
  featured: boolean;
  draft: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

/** Ensure external links work even if https:// was omitted in admin. */
export function normalizeExternalUrl(
  value: string | null | undefined,
): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `https://${trimmed}`;
}

export function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    year: row.year ?? "",
    role: row.role ?? "",
    summary: row.summary ?? "",
    intro: row.intro || undefined,
    overview: row.overview || undefined,
    contribution: row.contribution || undefined,
    features: row.features ?? [],
    categories: (row.categories ?? []) as WorkCategoryId[],
    softwareFocus: (row.software_focus ?? []) as SoftwareFocus[],
    technologies: row.technologies ?? [],
    cover: row.cover ?? undefined,
    screenshots: row.screenshots ?? [],
    images: row.images ?? [],
    hasMobileApp: row.has_mobile_app,
    mobileMockup: row.mobile_mockup ?? undefined,
    liveUrl: normalizeExternalUrl(row.live_url),
    githubUrl: normalizeExternalUrl(row.github_url),
    presentation: row.presentation ?? "modal",
    featured: row.featured,
    draft: row.draft,
  };
}

export function projectToRow(
  project: Partial<Project> & { id: string; slug: string; name: string },
  sortOrder = 0,
): Omit<ProjectRow, "created_at" | "updated_at"> {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    year: project.year ?? "",
    role: project.role ?? "",
    summary: project.summary ?? "",
    intro: project.intro ?? "",
    overview: project.overview ?? "",
    contribution: project.contribution ?? "",
    features: project.features ?? [],
    categories: project.categories ?? [],
    software_focus: project.softwareFocus ?? [],
    technologies: project.technologies ?? [],
    cover: project.cover ?? null,
    screenshots: project.screenshots ?? [],
    images: project.images ?? [],
    has_mobile_app: Boolean(project.hasMobileApp),
    mobile_mockup: project.mobileMockup ?? null,
    live_url: normalizeExternalUrl(project.liveUrl) ?? null,
    github_url: normalizeExternalUrl(project.githubUrl) ?? null,
    presentation: project.presentation ?? "modal",
    featured: Boolean(project.featured),
    draft: Boolean(project.draft),
    sort_order: sortOrder,
  };
}
