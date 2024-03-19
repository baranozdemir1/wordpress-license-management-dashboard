import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const licensesSchema = z.object({
  id: z.number(),
  domain: z.string(),
  name: z.string().nullable(),
  license_key: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type License = z.infer<typeof licensesSchema>;
