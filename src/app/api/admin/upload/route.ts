import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import {
  createServiceClient,
  hasSupabaseAdminConfig,
} from "@/lib/supabase/client";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json(
      {
        error:
          "Image upload needs SUPABASE_SERVICE_ROLE_KEY. Paste an image URL in the form instead, or add the service role key.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are allowed." },
      { status: 400 },
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image must be under 10MB." },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return NextResponse.json({ src: data.publicUrl, alt: file.name });
}
