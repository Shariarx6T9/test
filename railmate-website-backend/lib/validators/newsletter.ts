import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address."),
  source: z
    .string()
    .trim()
    .max(100, "Source must not exceed 100 characters.")
    .optional()
    .default("website"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
