import { z } from "zod";

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address."),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters."),
  source_page: z
    .string()
    .trim()
    .max(200, "Source page path must not exceed 200 characters.")
    .optional()
    .nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
