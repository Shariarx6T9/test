// ============================================================
// RailMate Bangladesh – HTML Escaping Utility
//
// Every user-supplied string that gets interpolated into an
// HTML email template (lib/email/templates.ts) MUST be passed
// through escapeHtml() first. Without this, form fields like
// "name", "subject", "message", "company_name" allow arbitrary
// HTML injection into emails sent from our domain.
// ============================================================

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(input: string | null | undefined): string {
  if (!input) return "";
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}
