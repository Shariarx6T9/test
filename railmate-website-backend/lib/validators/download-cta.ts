import { z } from "zod";

export const downloadCtaSchema = z.object({
  platform: z.enum(["ios", "android", "unknown"]).default("unknown"),
  locale: z
    .string()
    .max(20, "Locale must not exceed 20 characters.")
    .optional()
    .nullable(),
  source_page: z
    .string()
    .max(200, "Source page path must not exceed 200 characters.")
    .optional()
    .nullable(),
  referrer: z
    .string()
    .max(500, "Referrer must not exceed 500 characters.")
    .optional()
    .nullable(),
});

export type DownloadCtaInput = z.infer<typeof downloadCtaSchema>;
