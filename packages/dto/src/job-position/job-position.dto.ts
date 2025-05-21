import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const JobPositionCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
});

export const JobPositionUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const JobPositionAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  postUsageCount: z.number(),
  jobberUsageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const JobPositionPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});

export const JobPositionStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  jobberUsageCount: z.number(),
  postUsageCount: z.number(),
});

// Type exports
export type IJobPositionCreateDtoType = z.infer<typeof JobPositionCreateDto>;
export type IJobPositionUpdateDtoType = z.infer<typeof JobPositionUpdateDto>;
export type IJobPositionAdminDtoType = z.infer<typeof JobPositionAdminDto>;
export type IJobPositionPaginationDtoType = z.infer<typeof JobPositionPaginationDto>;
export type IJobPositionStatsDtoType = z.infer<typeof JobPositionStatsDto>;
