// ============================================================
// RailMate Bangladesh – Error Handling Utilities
// ============================================================

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiErrorResponse } from "@/types";

// ─── Error Codes ──────────────────────────────────────────
export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  BAD_REQUEST: "BAD_REQUEST",
  UPLOAD_ERROR: "UPLOAD_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// ─── Application Error Class ──────────────────────────────
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    statusCode = 500,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ─── Zod Error Flattener ──────────────────────────────────
function flattenZodError(error: ZodError): Record<string, string[]> {
  const fieldErrors = error.flatten().fieldErrors;
  const result: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages && messages.length > 0) {
      result[key] = messages;
    }
  }
  return result;
}

// ─── Response Builders ────────────────────────────────────
export function errorResponse(
  message: string,
  statusCode: number,
  code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
  details?: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    success: false,
    error: message,
    code,
    ...(details && Object.keys(details).length > 0 ? { details } : {}),
  };

  return NextResponse.json(body, { status: statusCode });
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiErrorResponse> {
  return errorResponse(
    "Validation failed. Please check the highlighted fields.",
    422,
    ErrorCode.VALIDATION_ERROR,
    flattenZodError(error)
  );
}

export function rateLimitResponse(resetAt: number): NextResponse<ApiErrorResponse> {
  const retryAfterSeconds = Math.ceil((resetAt - Date.now()) / 1000);
  const response = errorResponse(
    "Too many requests. Please try again later.",
    429,
    ErrorCode.RATE_LIMIT_EXCEEDED
  );
  response.headers.set("Retry-After", String(retryAfterSeconds));
  response.headers.set("X-RateLimit-Reset", String(resetAt));
  return response;
}

export function duplicateErrorResponse(resource: string): NextResponse<ApiErrorResponse> {
  return errorResponse(
    `${resource} already exists.`,
    409,
    ErrorCode.DUPLICATE_ENTRY
  );
}

export function unauthorizedResponse(): NextResponse<ApiErrorResponse> {
  return errorResponse("Authentication required.", 401, ErrorCode.UNAUTHORIZED);
}

export function forbiddenResponse(): NextResponse<ApiErrorResponse> {
  return errorResponse(
    "You do not have permission to perform this action.",
    403,
    ErrorCode.FORBIDDEN
  );
}

export function internalServerErrorResponse(
  err?: unknown
): NextResponse<ApiErrorResponse> {
  if (process.env.NODE_ENV !== "production" && err) {
    console.error("[Internal Server Error]", err);
  }
  return errorResponse(
    "An unexpected error occurred. Please try again.",
    500,
    ErrorCode.INTERNAL_SERVER_ERROR
  );
}

// ─── Generic Error Handler ────────────────────────────────
export function handleApiError(err: unknown): NextResponse<ApiErrorResponse> {
  if (err instanceof AppError) {
    return errorResponse(err.message, err.statusCode, err.code, err.details);
  }

  if (err instanceof ZodError) {
    return validationErrorResponse(err);
  }

  // Log unexpected errors in all environments (structured for Vercel/DataDog)
  console.error("[Unhandled API Error]", {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });

  return internalServerErrorResponse(err);
}

// ─── Success Response ─────────────────────────────────────
export function successResponse<T>(
  data?: T,
  statusCode = 200
): NextResponse {
  const body =
    data !== undefined ? { success: true, data } : { success: true };
  return NextResponse.json(body, { status: statusCode });
}
