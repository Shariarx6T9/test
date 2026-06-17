// ============================================================
// RailMate Bangladesh – Storage Upload Helpers
// Buckets: avatars | community-photos
// Uses admin client to bypass RLS for signed-URL generation.
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import type { UploadResult } from "@/types";
import { AppError, ErrorCode } from "@/lib/errors";

// ─── Config ───────────────────────────────────────────────
const BUCKETS = {
  avatars: "avatars",
  communityPhotos: "community-photos",
} as const;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;       // 5 MB
const MAX_COMMUNITY_SIZE = 10 * 1024 * 1024;   // 10 MB

// ─── Magic-Byte Validation ────────────────────────────────
// `file.type` is a client-supplied MIME hint and is trivially
// spoofable (rename anything, set the multipart Content-Type).
// We verify the first few bytes against the real file signature
// before trusting the declared type and writing it to Storage.
function detectImageMimeType(bytes: Uint8Array): string | null {
  if (bytes.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  ) {
    return "image/png";
  }
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  // GIF: "GIF87a" or "GIF89a"
  if (
    bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38
  ) {
    return "image/gif";
  }
  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

function assertRealImageType(buffer: ArrayBuffer, declaredType: string): void {
  const detected = detectImageMimeType(new Uint8Array(buffer));
  if (!detected || !ALLOWED_IMAGE_TYPES.has(detected)) {
    throw new AppError(
      "File content does not match an allowed image format.",
      ErrorCode.VALIDATION_ERROR,
      422
    );
  }
  if (detected !== declaredType) {
    throw new AppError(
      "Declared file type does not match the actual file content.",
      ErrorCode.VALIDATION_ERROR,
      422
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────
function sanitizeFileName(original: string): string {
  return original
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-{2,}/g, "-");
}

function buildPath(folder: string, userId: string, fileName: string): string {
  const ext = fileName.split(".").pop() ?? "jpg";
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${folder}/${userId}/${unique}.${ext}`;
}

function getPublicUrl(bucket: string, path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

// ─── Avatar Upload ────────────────────────────────────────
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<UploadResult> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new AppError(
      "Only JPEG, PNG, WebP, and GIF images are allowed.",
      ErrorCode.VALIDATION_ERROR,
      422
    );
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new AppError(
      "Avatar image must not exceed 5 MB.",
      ErrorCode.VALIDATION_ERROR,
      422
    );
  }

  const admin = createAdminClient();
  const path = buildPath("avatars", userId, sanitizeFileName(file.name));
  const buffer = await file.arrayBuffer();
  assertRealImageType(buffer, file.type);

  const { error } = await admin.storage
    .from(BUCKETS.avatars)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    console.error("[Upload] Avatar upload failed:", error.message);
    throw new AppError(
      "Failed to upload avatar. Please try again.",
      ErrorCode.UPLOAD_ERROR,
      500
    );
  }

  return {
    path,
    public_url: getPublicUrl(BUCKETS.avatars, path),
    size: file.size,
    mime_type: file.type,
  };
}

// ─── Avatar Delete ────────────────────────────────────────
export async function deleteAvatar(path: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKETS.avatars).remove([path]);
  if (error) {
    console.error("[Upload] Avatar delete failed:", error.message);
    throw new AppError("Failed to delete avatar.", ErrorCode.UPLOAD_ERROR, 500);
  }
}

// ─── Community Photo Upload ───────────────────────────────
export async function uploadCommunityPhoto(
  userId: string,
  file: File
): Promise<UploadResult> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new AppError(
      "Only JPEG, PNG, WebP, and GIF images are allowed.",
      ErrorCode.VALIDATION_ERROR,
      422
    );
  }

  if (file.size > MAX_COMMUNITY_SIZE) {
    throw new AppError(
      "Community photo must not exceed 10 MB.",
      ErrorCode.VALIDATION_ERROR,
      422
    );
  }

  const admin = createAdminClient();
  const path = buildPath("community", userId, sanitizeFileName(file.name));
  const buffer = await file.arrayBuffer();
  assertRealImageType(buffer, file.type);

  const { error } = await admin.storage
    .from(BUCKETS.communityPhotos)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    console.error("[Upload] Community photo upload failed:", error.message);
    throw new AppError(
      "Failed to upload photo. Please try again.",
      ErrorCode.UPLOAD_ERROR,
      500
    );
  }

  return {
    path,
    public_url: getPublicUrl(BUCKETS.communityPhotos, path),
    size: file.size,
    mime_type: file.type,
  };
}

// ─── Signed URL (time-limited access) ────────────────────
export async function getSignedUrl(
  bucket: "avatars" | "community-photos",
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new AppError("Failed to generate signed URL.", ErrorCode.UPLOAD_ERROR, 500);
  }

  return data.signedUrl;
}
