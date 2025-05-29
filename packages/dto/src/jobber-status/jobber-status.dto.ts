import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const JobberStatusCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
 
});

export const JobberStatusUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),

});

export const JobberStatusAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  jobberUsageCount: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const JobberStatusPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});

export const JobberStatusStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  jobberUsageCount: z.number(),
});

export type IJobberStatusCreateDtoType = z.infer<typeof JobberStatusCreateDto>;
export type IJobberStatusUpdateDtoType = z.infer<typeof JobberStatusUpdateDto>;
export type IJobberStatusAdminDtoType = z.infer<typeof JobberStatusAdminDto>;
export type IJobberStatusPaginationDtoType = z.infer<
  typeof JobberStatusPaginationDto
>;
export type IJobberStatusStatsDtoType = z.infer<typeof JobberStatusStatsDto>;
