import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const CourseCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required"),
});

export const CourseUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, "Name is required").optional(),
});

export const CourseAdminDto = z.object({
  id: z.string(),
  name: z.string(),
  visible: z.boolean(),
  postUsageCount: z.number(),
  jobberUsageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const CoursePaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
});
export const CourseStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  jobberUsageCount: z.number(),
  postUsageCount: z.number(),
});

export type ICourseCreateDtoType = z.infer<typeof CourseCreateDto>;
export type ICourseUpdateDtoType = z.infer<typeof CourseUpdateDto>;
export type ICourseAdminDtoType = z.infer<typeof CourseAdminDto>;
export type ICoursePaginationDtoType = z.infer<typeof CoursePaginationDto>;
export type ICourseStatsDtoType = z.infer<typeof CourseStatsDto>;
