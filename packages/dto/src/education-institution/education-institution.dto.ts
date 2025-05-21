import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const EducationalInstitutionCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
});

export const EducationalInstitutionUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const EducationalInstitutionAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  postUsageCount: z.number(),
  jobberUsageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const EducationalInstitutionPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});

export const EducationalInstitutionStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  jobberUsageCount: z.number(),
  postUsageCount: z.number(),
});

export type IEducationalInstitutionCreateDtoType = z.infer<typeof EducationalInstitutionCreateDto>;
export type IEducationalInstitutionUpdateDtoType = z.infer<typeof EducationalInstitutionUpdateDto>;
export type IEducationalInstitutionAdminDtoType = z.infer<typeof EducationalInstitutionAdminDto>;
export type IEducationalInstitutionPaginationDtoType = z.infer<typeof EducationalInstitutionPaginationDto>;
export type IEducationalInstitutionStatsDtoType = z.infer<typeof EducationalInstitutionStatsDto>;
