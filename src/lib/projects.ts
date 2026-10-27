import {
  projects as staticProjects,
  type Project,
  type WorkCategoryId,
  type SoftwareFocus,
} from "@/lib/content";
import {
  createAnonClient,
  hasSupabasePublicConfig,
} from "@/lib/supabase/client";
import {
  adminGetProject,
  adminListProjects,
} from "@/lib/supabase/admin-db";
import { rowToProject, type ProjectRow } from "@/lib/supabase/types";
import { isAdminPasswordConfigured } from "@/lib/admin-auth";

function staticPublished(): Project[] {
  return staticProjects.filter((project) => !project.draft);
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!hasSupabasePublicConfig()) {
    return staticPublished();
  }

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("draft", false)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!data?.length) return staticPublished();
    return (data as ProjectRow[]).map(rowToProject);
  } catch (error) {
    console.error("Failed to load projects from Supabase", error);
    return staticPublished();
  }
}

export async function getProjectsByCategory(
  category: WorkCategoryId,
): Promise<Project[]> {
  const all = await getPublishedProjects();
  return all.filter((project) => project.categories.includes(category));
}

export async function getProjectsBySoftwareFocus(
  focus: SoftwareFocus,
): Promise<Project[]> {
  const all = await getPublishedProjects();
  return all.filter((project) => project.softwareFocus?.includes(focus));
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const all = await getPublishedProjects();
  return all.find((project) => project.slug === slug);
}

/** Admin: all projects including drafts */
export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (!hasSupabasePublicConfig() || !isAdminPasswordConfigured()) {
    return staticProjects;
  }
  return adminListProjects();
}

export async function getProjectByIdAdmin(
  id: string,
): Promise<Project | undefined> {
  if (!hasSupabasePublicConfig() || !isAdminPasswordConfigured()) {
    return staticProjects.find((project) => project.id === id);
  }
  return adminGetProject(id);
}
