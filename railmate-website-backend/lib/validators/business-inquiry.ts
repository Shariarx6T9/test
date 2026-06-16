import { z } from "zod";

export const businessInquirySchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(200, "Company name must not exceed 200 characters."),
  contact_name: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters.")
    .max(100, "Contact name must not exceed 100 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9\s\-().]{7,20}$/,
      "Please provide a valid phone number."
    )
    .optional()
    .nullable(),
  inquiry_type: z.enum([
    "partnership",
    "enterprise",
    "api_access",
    "advertising",
    "other",
  ]),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(5000, "Message must not exceed 5,000 characters."),
});

export type BusinessInquiryInput = z.infer<typeof businessInquirySchema>;
