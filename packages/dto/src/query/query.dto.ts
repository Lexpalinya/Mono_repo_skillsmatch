import { z } from "zod";

export const QueryDto = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  sortBy: z.string().optional().default("createdAt"),
});

export type IQueryDtoType = z.infer<typeof QueryDto>;
