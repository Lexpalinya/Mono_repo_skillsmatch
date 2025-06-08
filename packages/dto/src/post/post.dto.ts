import { z } from "zod";
import { QueryDto } from "../query/query.dto";
import { fileSchema } from "../file.dto";

// 🔸 ENUMS
const CurrencyEnum = z.enum(["KIP", "USD", "THB", "CNY"]);

// 🔸 Time Format
const TimeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
  message: "Time must be in HH:mm format (24-hour)",
});

// 🔸 Shared jobPosition schema
const JobPositionSchema = z.object({
  jpId: z.string().uuid({ message: "Invalid JobPosition ID" }),
  description: z.string().optional(),
  amount: z
    .number({ message: "Amount is required" })
    .min(1, { message: "Amount must be greater than 0" }),
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
  minSalary: z.number({ message: "Minimum salary is required" }).min(1),
  maxSalary: z.number({ message: "Maximum salary is required" }).min(1),
  checkInTime: TimeString,
  checkOutTime: TimeString,
  gpa: z.number().min(0).max(4),
  currency: CurrencyEnum,
  workday: z.array(z.string()).min(1),
  endDate: z.coerce.date({ message: "End date is required" }),
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

// 🔸 Stats Dto
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

// 🔸 Detail Dtos
export const PostJobPositionDetailSkillDto = z.object({
  id: z.string(),
  amount: z.number(),
  jp: z.object({
    id: z.string(),
    name: z.string(),
  }),
  postJobPositionDetailSkill: z.array(
    z.object({
      pjpId: z.string(),
      skId: z.string(),
      sk: z.object({
        id: z.string(),
        name: z.string(),
      }),
    })
  ),
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
    province: z.string().optional(),
    district: z.string().optional(),
    village: z.string().optional(),
    bm: z.object({
      name: z.string(),
    }),
  }),
  image: z.array(z.string()),
  welfare: z.string(),
  more: z.string(),
  postJobPositionDetail: z.array(PostJobPositionDetailDto),

  currency: z.string(),
  minSalary: z.number(),
  maxSalary: z.number(),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  endDate: z.string(),
  isActive: z.boolean(),
});

export const PostAdminViewDto = z.object({
  id: z.string(),
  title: z.string(),
  gpa: z.number(),
  workday: z.array(z.string()),
  postCourse: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  postMajor: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  postEducationLevel: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  postEducationInstitution: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  postJobPositionDetail: z.array(PostJobPositionDetailDto),
});
// 🔸 Pagination Dto
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
export type IPostAdminViewDtoType = z.infer<typeof PostAdminViewDto>;
