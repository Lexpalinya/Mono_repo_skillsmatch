import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const BusinessModelCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
});

export const BusinessModelUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const BusinessModelAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  companyUsageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const BusinessModelPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});
export const BusinessModelStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  companyUsageCount: z.number(),
});
export type IBusinessModelCreateDtoType = z.infer<
  typeof BusinessModelCreateDto
>;
export type IBusinessModelUpdateDtoType = z.infer<
  typeof BusinessModelUpdateDto
>;

export type IBusinessModelPaginationDto = z.infer<
  typeof BusinessModelPaginationDto
>;

export type IBusinessModelStateDtoType = z.infer<typeof BusinessModelStatsDto>;
export type IBusinessModelAdminDtoType = z.infer<typeof BusinessModelAdminDto>;
