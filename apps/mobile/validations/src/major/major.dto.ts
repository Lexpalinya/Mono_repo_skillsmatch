import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const MajorCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
});

export const MajorUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const MajorAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  postUsageCount: z.number(),
  jobberUsageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MajorPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});

export const MajorStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  jobberUsageCount: z.number(),
  postUsageCount: z.number(),
});

export type IMajorCreateDtoType = z.infer<typeof MajorCreateDto>;
export type IMajorUpdateDtoType = z.infer<typeof MajorUpdateDto>;
export type IMajorAdminDtoType = z.infer<typeof MajorAdminDto>;
export type IMajorPaginationDtoType = z.infer<typeof MajorPaginationDto>;
export type IMajorStatsDtoType = z.infer<typeof MajorStatsDto>;
