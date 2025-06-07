import { z } from "zod";
import { QueryDto } from "../query/query.dto";
import { fileSchema } from "../file.dto";

// 🔸 ENUMS
const CurrencyEnum = z.enum(["KIP", "USD", "THB", "CNY"]);

// 🔸 Time Format
const TimeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, {
  message: "Time must be in HH:mm:ss format (24-hour)",
});

// 🔸 Shared jobPosition schema
const JobPositionSchema = z.object({
  jpId: z.string().uuid({ message: "Invalid JobPosition ID" }),
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.number({ message: "Amount is required" }),
  skillIds: z
    .array(z.string().uuid({ message: "Each skill ID must be a valid UUID" }))
    .optional(),
});

// 🔸 Optional job position for update (with `id`)
const OptionalJobPositionSchema = JobPositionSchema.extend({
  id: z.string().uuid({ message: "Invalid ID" }).optional(),
}).partial();

// 🔸 Shared Fields (Base Schema)
const PostBaseFields = {
  isActive: z.boolean().optional(),
  cId: z.string().uuid({ message: "Invalid company ID" }),
  title: z.string().min(1, { message: "Title is required" }),
  image: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .min(1, { message: "At least one image is required" }),
  minSalary: z.number({ message: "Minimum salary is required" }),
  maxSalary: z.number({ message: "Maximum salary is required" }),
  checkInTime: TimeString,
  checkOutTime: TimeString,
  gpa: z.number().min(0).max(4),
  currency: CurrencyEnum,
  workday: z.array(z.string()).min(1),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date",
  }),
  welfare: z.string().min(1),
  more: z.string().min(1),
  courseIds: z
    .array(z.string().uuid({ message: "Each course ID must be valid UUID" }))
    .optional(),
  majorIds: z
    .array(z.string().uuid({ message: "Each major ID must be valid UUID" }))
    .optional(),
  educationLevelIds: z
    .array(
      z.string().uuid({ message: "Each education level ID must be valid UUID" })
    )
    .optional(),
  educationInstitutionIds: z
    .array(
      z.string().uuid({ message: "Each institution ID must be valid UUID" })
    )
    .optional(),
  jobPositions: z.array(JobPositionSchema).optional(),
};

// 🔸 Post Create Schema
export const PostCreateDto = z
  .object(PostBaseFields)
  .refine((data) => data.minSalary <= data.maxSalary, {
    message: "Minimum salary cannot be greater than maximum salary",
    path: ["minSalary"],
  });

// 🔸 Post File Create Schema
const PostCreateBaseSchema = PostCreateDto._def.schema;
export const PostFileCreateDto = PostCreateBaseSchema.omit({
  image: true,
}).extend({
  image: z
    .union([fileSchema.array(), z.array(z.string().url()), z.null()])
    .optional(),
});

// 🔸 Post Update Schema
export const PostUpdateDto = z
  .object({
    ...z.object(PostBaseFields).partial().shape,
    jobPositions: z.array(OptionalJobPositionSchema).optional(),
  })
  .refine(
    (data) =>
      !data.minSalary ||
      !data.maxSalary ||
      (data.minSalary !== undefined &&
        data.maxSalary !== undefined &&
        data.minSalary <= data.maxSalary),
    {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["minSalary"],
    }
  );

// 🔸 Post File Update Schema
const PostUpdateBaseSchema = PostUpdateDto._def.schema;
export const PostFileUpdateDto = PostUpdateBaseSchema.omit({
  image: true,
}).extend({
  image: z
    .union([z.array(z.union([fileSchema, z.string().url()])), z.null()])
    .optional(),
});

// 🔸 Stats DTO
export const PostStatsDto = z.object({
  totalPosts: z.number(),
  activePosts: z.number(),
  activePercentage: z.number(),
  uniqueCompanies: z.number(),
  totalPositions: z.number(),
  averageSalary: z.number(),
  averageGPA: z.number(),
  expiredPosts: z.number(),
});

// 🔸 Detail DTOs
export const PostJobPositionDetailSkillDto = z.object({
  sk: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const PostJobPositionDetailDto = z.object({
  jp: z.object({
    id: z.string(),
    name: z.string(),
  }),
  PostJobPositionDetailSkill: z.array(PostJobPositionDetailSkillDto),
});

export const PostAdminDto = z.object({
  id: z.string(),
  title: z.string(),
  gpa: z.number(),
  workday: z.array(z.string()),
  company: z.object({
    name: z.string(),
    address: z.string().optional(),
  }),
  currency: z.string(),
  minSalary: z.number(),
  maxSalary: z.number(),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  PostJobPositionDetail: z.array(PostJobPositionDetailDto).optional(),
  endDate: z.string(),
  isActive: z.boolean(),
});

// 🔸 Pagination DTO
export const PostPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
  status: z.string().optional(),
  cIds: z.array(z.string().uuid()).optional(),
});

// 🔸 Type exports
export type IPostCreateDtoType = z.infer<typeof PostCreateDto>;
export type IPostFileCreateDtoType = z.infer<typeof PostFileCreateDto>;
export type IPostUpdateDtoType = z.infer<typeof PostUpdateDto>;
export type IPostFileUpdateDtoType = z.infer<typeof PostFileUpdateDto>;
export type IPostStatsDtoType = z.infer<typeof PostStatsDto>;
export type IPostAdminDtoType = z.infer<typeof PostAdminDto>;
export type IPostPaginationDtoType = z.infer<typeof PostPaginationDto>;
