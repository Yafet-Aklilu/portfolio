import { NextResponse } from "next/server";
import { isAdminAuthenticated, isAdminPasswordConfigured } from "@/lib/admin-auth";
import { hasSupabasePublicConfig } from "@/lib/supabase/client";

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isAdminPasswordConfigured() || !hasSupabasePublicConfig()) {
    return NextResponse.json(
      {
        error:
          "Admin is not configured. Set ADMIN_PASSWORD and NEXT_PUBLIC_SUPABASE_* env vars.",
      },
      { status: 503 },
    );
  }
  return null;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
