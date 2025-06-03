import { EGender } from "@prisma/client";
import { z } from "zod";
import { QueryDto } from "../query/query.dto";
import { fileSchema } from "../file.dto";

export const JobberCreateDto = z.object({
  isVerify: z.boolean().optional(),
  statusId: z.string().min(1, "Status ID is required"),
  memberId: z.string().min(1, "User ID is required"),
  gender: z.nativeEnum(EGender),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthday: z.coerce.date(),
  nationality: z.string().min(1, "Nationality is required"),
  ethnicity: z.string().min(1, "Ethnicity is required"),
  religion: z.string().min(1, "Religion is required"),
  bProvince: z.string().min(1, "Birth province is required"),
  bDistrict: z.string().min(1, "Birth district is required"),
  bVillage: z.string().min(1, "Birth village is required"),
  cProvince: z.string().min(1, "Current province is required"),
  cDistrict: z.string().min(1, "Current district is required"),
  cVillage: z.string().min(1, "Current village is required"),
  docImage: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one document image is required"),
  reason: z.string().optional().nullable(),
});
export const JobberFileCreateDto = JobberCreateDto.omit({
  docImage: true,
}).extend({
  docImage: z
    .union([fileSchema.array(), z.array(z.string().url()), z.null()])
    .optional(),
});

export const JobberUpdateDto = z.object({
  isVerify: z.boolean().optional(),
  statusId: z.string().optional(),
  memberId: z.string().optional(),
  gender: z.nativeEnum(EGender).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthday: z.coerce.date().optional(),
  nationality: z.string().optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  bProvince: z.string().optional(),
  bDistrict: z.string().optional(),
  bVillage: z.string().optional(),
  cProvince: z.string().optional(),
  cDistrict: z.string().optional(),
  cVillage: z.string().optional(),
  docImage: z.array(z.string().url("Invalid URL")).optional(),
  reason: z.string().optional().nullable(),
});
export const JobberFileUpdateDto = JobberUpdateDto.omit({
  docImage: true,
}).extend({
  docImage: z
    .union([fileSchema.array(), z.array(z.string().url()), z.null()])
    .optional(),
});

export const JobberAdminDto = z.object({
  id: z.string(),
  memberId: z.string(),
  gender: z.nativeEnum(EGender),
  firstName: z.string(),
  lastName: z.string(),
  birthday: z.string(),
  isVerify: z.boolean(),
  nationality: z.string(),
  createdAt: z.string(),
  statusId: z.string(),
  reason: z.string(),
  status: z.object({
    name: z.string(),
  }),
  member: z.object({
    username: z.string(),
    profile: z.string(),
    email: z.string(),
  }),
});
export const JobberPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
  status: z.string().optional(),
});

export const JobberStatsDto = z.object({
  total: z.number(),
  active: z.number(),
  verified: z.number(),
  status: z.number(),
});

export const JobberAdminViewDto = z.object({
  id: z.string(),
  isVerify: z.boolean().default(false),
  isActive: z.boolean().default(true),
  status: z.object({
    id: z.string(),
    name: z.string(),
  }),
  member: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    profile: z.string().nullable().optional(),
  }),
  gender: z.nativeEnum(EGender),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthday: z.date(),
  nationality: z.string(),
  ethnicity: z.string(),
  religion: z.string(),
  bProvince: z.string(),
  bDistrict: z.string(),
  bVillage: z.string(),
  cProvince: z.string(),
  cDistrict: z.string(),
  cVillage: z.string(),
  docImage: z.array(z.string()),
  reason: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const JobberStatusStatsDto = z.object({
  id: z.string(),
  name: z.string(),
  companyUsageCount: z.number(),
});
export type IJobberCreateDtoType = z.infer<typeof JobberCreateDto>;
export type IJobberUpdateDtoType = z.infer<typeof JobberUpdateDto>;
export type IJobberAdminDtoType = z.infer<typeof JobberAdminDto>;
export type IJobberPaginationDtoType = z.infer<typeof JobberPaginationDto>;
export type IJobberStatsDtoType = z.infer<typeof JobberStatsDto>;
export type IJobberAdminViewDto = z.infer<typeof JobberAdminViewDto>;
export type IJobberFileCreateDtoType = z.infer<typeof JobberFileCreateDto>;
export type IJobberFileUpdateDtoType = z.infer<typeof JobberFileUpdateDto>;
