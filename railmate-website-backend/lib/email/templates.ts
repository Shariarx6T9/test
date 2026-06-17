// ============================================================
// RailMate Bangladesh – Email HTML Templates
// ============================================================

import { escapeHtml } from "@/lib/utils/escape-html";

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  color: #1a1a2e;
`;

const headerStyle = `
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 32px 40px;
  border-radius: 12px 12px 0 0;
`;

const contentStyle = `
  padding: 32px 40px;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 12px 12px;
`;

const labelStyle = `
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
  margin-bottom: 4px;
`;

const valueStyle = `
  font-size: 15px;
  color: #1a1a2e;
  margin: 0 0 20px 0;
`;

const footerStyle = `
  text-align: center;
  padding: 24px;
  font-size: 12px;
  color: #94a3b8;
`;

const badgeStyle = (color: string) => `
  display: inline-block;
  background: ${color};
  color: white;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RailMate Bangladesh</title>
</head>
<body style="margin:0;padding:20px;background:#f1f5f9;">
<div style="${baseStyle}">
  <div style="${headerStyle}">
    <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">
      🚂 RailMate Bangladesh
    </h1>
  </div>
  <div style="${contentStyle}">
    ${content}
  </div>
  <div style="${footerStyle}">
    <p style="margin:0;">© ${new Date().getFullYear()} RailMate Bangladesh. All rights reserved.</p>
    <p style="margin:4px 0 0;">This is an automated notification. Do not reply to this email.</p>
  </div>
</div>
</body>
</html>`;
}

// ─── Contact Submission Admin Notification ────────────────
export function contactAdminEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}): string {
  return layout(`
    <h2 style="margin:0 0 24px;font-size:20px;color:#1a1a2e;">
      New Contact Form Submission
    </h2>
    <p style="${labelStyle}">From</p>
    <p style="${valueStyle}">${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p style="${labelStyle}">Subject</p>
    <p style="${valueStyle}">${escapeHtml(data.subject)}</p>
    <p style="${labelStyle}">Message</p>
    <p style="white-space:pre-wrap;line-height:1.6;color:#334155;border-left:3px solid #e2e8f0;padding-left:16px;margin:0 0 20px;">${escapeHtml(data.message)}</p>
    <p style="${labelStyle}">Received</p>
    <p style="${valueStyle}">${escapeHtml(data.submittedAt)}</p>
    <a href="mailto:${encodeURIComponent(data.email)}?subject=Re: ${encodeURIComponent(data.subject)}"
       style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
      Reply to ${escapeHtml(data.name)}
    </a>
  `);
}

// ─── Contact Submission User Confirmation ─────────────────
export function contactConfirmationEmail(name: string): string {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">
      Thanks for reaching out, ${escapeHtml(name)}!
    </h2>
    <p style="line-height:1.7;color:#475569;margin:0 0 16px;">
      We've received your message and a member of our team will get back to you 
      within <strong>1–2 business days</strong>.
    </p>
    <p style="line-height:1.7;color:#475569;margin:0 0 24px;">
      In the meantime, feel free to explore the RailMate app and follow Bangladesh 
      Railway trains in real time.
    </p>
    <a href="https://railmatebd.com" 
       style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
      Visit RailMate →
    </a>
  `);
}

// ─── Newsletter Welcome ───────────────────────────────────
export function newsletterWelcomeEmail(email: string): string {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">
      You're subscribed! 🎉
    </h2>
    <p style="line-height:1.7;color:#475569;margin:0 0 16px;">
      Welcome to the RailMate newsletter. You'll be among the first to hear about:
    </p>
    <ul style="color:#475569;line-height:2;padding-left:24px;margin:0 0 24px;">
      <li>New features and app updates</li>
      <li>Bangladesh Railway schedule improvements</li>
      <li>Tips for hassle-free train travel</li>
      <li>Community stories and announcements</li>
    </ul>
    <a href="https://railmatebd.com"
       style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
      Explore RailMate →
    </a>
    <p style="font-size:12px;color:#94a3b8;margin:24px 0 0;">
      Not you? <a href="https://railmatebd.com/unsubscribe?email=${encodeURIComponent(email)}" style="color:#94a3b8;">Unsubscribe</a>
    </p>
  `);
}

// ─── Waitlist Confirmation ─────────────────────────────────
export function waitlistConfirmationEmail(name: string): string {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">
      You're on the waitlist, ${escapeHtml(name)}! 🚂
    </h2>
    <p style="line-height:1.7;color:#475569;margin:0 0 16px;">
      You've secured your spot on the RailMate waitlist. We're working hard to 
      roll out access to everyone as quickly as possible.
    </p>
    <p style="line-height:1.7;color:#475569;margin:0 0 24px;">
      We'll notify you the moment your access is ready. In the meantime, share 
      RailMate with friends to move up the queue!
    </p>
    <a href="https://railmatebd.com"
       style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
      Learn More →
    </a>
  `);
}

// ─── Business Inquiry Admin Notification ──────────────────
export function businessInquiryAdminEmail(data: {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  inquiry_type: string;
  message: string;
  submittedAt: string;
}): string {
  const typeColors: Record<string, string> = {
    partnership: "#7c3aed",
    enterprise: "#1d4ed8",
    api_access: "#0369a1",
    advertising: "#0f766e",
    other: "#64748b",
  };
  const color = typeColors[data.inquiry_type] ?? "#64748b";

  return layout(`
    <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a2e;">
      New Business Inquiry
    </h2>
    <span style="${badgeStyle(color)}">${escapeHtml(data.inquiry_type.replace("_", " ").toUpperCase())}</span>
    <br/><br/>
    <p style="${labelStyle}">Company</p>
    <p style="${valueStyle}">${escapeHtml(data.company_name)}</p>
    <p style="${labelStyle}">Contact</p>
    <p style="${valueStyle}">${escapeHtml(data.contact_name)} &lt;${escapeHtml(data.email)}&gt;${data.phone ? ` · ${escapeHtml(data.phone)}` : ""}</p>
    <p style="${labelStyle}">Message</p>
    <p style="white-space:pre-wrap;line-height:1.6;color:#334155;border-left:3px solid #e2e8f0;padding-left:16px;margin:0 0 20px;">${escapeHtml(data.message)}</p>
    <p style="${labelStyle}">Received</p>
    <p style="${valueStyle}">${escapeHtml(data.submittedAt)}</p>
    <a href="mailto:${encodeURIComponent(data.email)}?subject=Re: Business Inquiry from ${encodeURIComponent(data.company_name)}"
       style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
      Reply to ${escapeHtml(data.contact_name)}
    </a>
  `);
}

// ─── Business Inquiry User Confirmation ───────────────────
export function businessInquiryConfirmationEmail(contactName: string, companyName: string): string {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a2e;">
      Thank you, ${escapeHtml(contactName)}!
    </h2>
    <p style="line-height:1.7;color:#475569;margin:0 0 16px;">
      We've received your business inquiry from <strong>${escapeHtml(companyName)}</strong>. 
      Our partnerships team will review your message and reach out within 
      <strong>2–3 business days</strong>.
    </p>
    <p style="line-height:1.7;color:#475569;margin:0 0 24px;">
      For urgent matters, please contact us directly at 
      <a href="mailto:partnerships@railmatebd.com" style="color:#4f46e5;">partnerships@railmatebd.com</a>.
    </p>
    <a href="https://railmatebd.com"
       style="display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
      Back to RailMate →
    </a>
  `);
}
