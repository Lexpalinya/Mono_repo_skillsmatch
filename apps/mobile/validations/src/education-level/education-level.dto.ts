import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const EducationLevelCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
});

export const EducationLevelUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const EducationLevelAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  postUsageCount: z.number(),
  jobberUsageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const EducationLevelPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});

export const EducationLevelStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  jobberUsageCount: z.number(),
  postUsageCount: z.number(),
});

export type IEducationLevelCreateDtoType = z.infer<typeof EducationLevelCreateDto>;
export type IEducationLevelUpdateDtoType = z.infer<typeof EducationLevelUpdateDto>;
export type IEducationLevelAdminDtoType = z.infer<typeof EducationLevelAdminDto>;
export type IEducationLevelPaginationDtoType = z.infer<typeof EducationLevelPaginationDto>;
export type IEducationLevelStatsDtoType = z.infer<typeof EducationLevelStatsDto>;
