import { z } from "zod";

export const getProjectStateSchema = z.object({
  params: z.object({
    projectId: z.coerce.number().int(),
  }),
});
