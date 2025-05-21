import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const SkillCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
});

export const SkillUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const SkillAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  postUsageCount: z.number(),
  jobberUsageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const SkillPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});
export const SkillStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  jobberUsageCount: z.number(),
  postUsageCount: z.number(),
});

export type ISkillCreateDtoType = z.infer<typeof SkillCreateDto>;
export type ISkillUpdateDtoType = z.infer<typeof SkillUpdateDto>;
export type ISkillAdminDtoType = z.infer<typeof SkillAdminDto>;
export type ISkillPaginationDtoType = z.infer<typeof SkillPaginationDto>;
export type ISkillStatsDtoType = z.infer<typeof SkillStatsDto>;
