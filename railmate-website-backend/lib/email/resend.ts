// ============================================================
// RailMate Bangladesh – Resend Email Client
// ============================================================

import { Resend } from "resend";
import { env } from "@/lib/env";

let _resend: Resend | undefined;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(env.resendApiKey);
  }
  return _resend;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: env.emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo ?? env.emailReplyTo,
      tags: options.tags,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[Email] Send failed:", message);
    return { success: false, error: message };
  }
}
