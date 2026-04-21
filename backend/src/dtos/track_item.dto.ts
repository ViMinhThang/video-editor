import { z } from "zod";

export const cutTrackSchema = z.object({
  body: z.object({
    currentTime: z.number().nonnegative(),
  }),
});

export const updateTrackSchema = z.object({
  body: z.object({
    id: z.number().int().optional(),
    track_id: z.number().int(),
    project_id: z.number().int(),
    asset_id: z.number().int().optional(),
    start_time: z.number().optional(),
    end_time: z.number().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    scale: z.number().optional(),
    rotation: z.number().optional(),
    text_content: z.string().optional(),
  }),
  params: z.object({
    id: z.coerce.number().int(),
  }),
});

export const downloadTrackItemSchema = z.object({
  query: z.object({
    track_item_id: z.coerce.number().int(),
  }),
});

export const exportProjectSchema = z.object({
  query: z.object({
    projectId: z.coerce.number().int(),
  }),
});
