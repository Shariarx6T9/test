import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address."),
  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters.")
    .max(200, "Subject must not exceed 200 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(5000, "Message must not exceed 5,000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
