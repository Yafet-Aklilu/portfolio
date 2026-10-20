import { NextResponse } from "next/server";
import { askAssistant } from "@/lib/ai/service";

export const runtime = "nodejs";

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * POST /api/assistant
 * Body: { message: string, history?: { role, content }[] }
 *
 * Provider calls stay on the server. Returns structured errors when
 * the assistant is not configured (preparation phase).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "validation_error", error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const result = await askAssistant(body, clientKey(request));

  if (!result.ok) {
    const status =
      result.code === "validation_error"
        ? 400
        : result.code === "rate_limited"
          ? 429
          : result.code === "not_configured"
            ? 503
            : 502;

    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
