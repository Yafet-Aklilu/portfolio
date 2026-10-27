import { NextResponse } from "next/server";
import { requireAdmin, slugify } from "@/lib/admin-api";
import {
  adminListProjects,
  adminUpsertProject,
} from "@/lib/supabase/admin-db";
import type { Project } from "@/lib/content";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const projects = await adminListProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: Partial<Project> & { sortOrder?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const id =
    body.id?.trim() ||
    `${slugify(name)}-${Math.random().toString(36).slice(2, 8)}`;
  const slug = body.slug?.trim() || slugify(name);
  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  try {
    const project = await adminUpsertProject(
      {
        ...body,
        id,
        slug,
        name,
        categories: body.categories?.length ? body.categories : ["software"],
        presentation: body.presentation ?? "modal",
        images: body.images ?? [],
        technologies: body.technologies ?? [],
      },
      body.sortOrder ?? 0,
    );
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 },
    );
  }
}
