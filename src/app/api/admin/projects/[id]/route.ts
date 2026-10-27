import { NextResponse } from "next/server";
import { requireAdmin, slugify } from "@/lib/admin-api";
import {
  adminDeleteProject,
  adminGetProject,
  adminUpsertProject,
} from "@/lib/supabase/admin-db";
import type { Project } from "@/lib/content";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await context.params;
  try {
    const project = await adminGetProject(id);
    if (!project) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await context.params;
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

  const slug = body.slug?.trim() || slugify(name);

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

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await context.params;
  try {
    await adminDeleteProject(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete" },
      { status: 500 },
    );
  }
}
