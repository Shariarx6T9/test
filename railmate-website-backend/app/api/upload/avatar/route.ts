// ============================================================
// POST /api/upload/avatar
// Authenticated endpoint. Uploads image to 'avatars' bucket.
// Returns the public URL for immediate display.
// ============================================================

import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth/helpers";
import { uploadAvatar } from "@/lib/auth/upload";
import { rateLimit } from "@/lib/rate-limit";
import {
  handleApiError,
  rateLimitResponse,
  successResponse,
  unauthorizedResponse,
  errorResponse,
  ErrorCode,
} from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ── Auth guard ───────────────────────────────────────
    const user = await getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // ── Rate limit ───────────────────────────────────────
    const rl = await rateLimit(req, "upload", "avatar-upload");
    if (!rl.success) {
      return rateLimitResponse(rl.reset);
    }

    // ── Parse multipart form data ─────────────────────────
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return errorResponse("Invalid multipart form data.", 400, ErrorCode.BAD_REQUEST);
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return errorResponse(
        "A file field named 'file' is required.",
        422,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // ── Upload ────────────────────────────────────────────
    const result = await uploadAvatar(user.id, file);

    return successResponse(result, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
