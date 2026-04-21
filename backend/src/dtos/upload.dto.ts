import { z } from "zod";

export const uploadFileSchema = z.object({
  body: z.object({
    project_id: z.coerce.number().int(),
    asset_id: z.coerce.number().int().optional(),
  }),
});
