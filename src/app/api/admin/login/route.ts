import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  createAdminSessionToken,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server." },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!verifyAdminPassword(body.password ?? "")) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const cookie = adminCookieOptions(createAdminSessionToken());
  response.cookies.set(cookie);
  return response;
}
