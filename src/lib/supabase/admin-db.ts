import { createAnonClient } from "@/lib/supabase/client";
import { projectToRow, rowToProject, type ProjectRow } from "@/lib/supabase/types";
import type { Project } from "@/lib/content";

function adminSecret(): string {
  const value = process.env.ADMIN_PASSWORD?.trim();
  if (!value) throw new Error("ADMIN_PASSWORD is not configured");
  return value;
}

export async function adminListProjects(): Promise<Project[]> {
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("admin_list_projects", {
    p_secret: adminSecret(),
  });
  if (error) throw error;
  return ((data as ProjectRow[]) ?? []).map(rowToProject);
}

export async function adminGetProject(id: string): Promise<Project | undefined> {
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("admin_get_project", {
    p_secret: adminSecret(),
    p_id: id,
  });
  if (error) throw error;
  if (!data) return undefined;
  return rowToProject(data as ProjectRow);
}

export async function adminUpsertProject(
  project: Partial<Project> & { id: string; slug: string; name: string },
  sortOrder = 0,
): Promise<Project> {
  const row = projectToRow(project, sortOrder);
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("admin_upsert_project", {
    p_secret: adminSecret(),
    p_row: row,
  });
  if (error) throw error;
  return rowToProject(data as ProjectRow);
}

export async function adminDeleteProject(id: string): Promise<void> {
  const supabase = createAnonClient();
  const { error } = await supabase.rpc("admin_delete_project", {
    p_secret: adminSecret(),
    p_id: id,
  });
  if (error) throw error;
}
