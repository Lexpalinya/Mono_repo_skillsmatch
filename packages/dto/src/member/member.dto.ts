import { EUserRole } from "@prisma/client";
import { z } from "zod";
import { idDto } from "../id/id.dto";
import { QueryDto } from "../query/query.dto";
import { fileSchema } from "../file.dto";

export const MemberCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profile: z.string().url("Invalid URL").optional().nullable(),
  background: z.string().url("Invalid URL").optional().nullable(),
  role: z.nativeEnum(EUserRole),
  block: z.boolean().optional(),
  loginVersion: z.number().optional(),
});

export const MemberCreateFileDto = MemberCreateDto.omit({
  profile: true,
  background: true,
}).extend({
  background: z.union([fileSchema, z.string().url(), z.null()]).optional(),
  profile: z.union([fileSchema, z.string().url(), z.null()]).optional(),
});
export const MemberUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  password: z.string().min(6).optional(),
  username: z.string().min(1).optional(),
  email: z.string().email("Invalid email").optional(),
  phoneNumber: z.string().optional(),
  profile: z.string().url("Invalid URL").optional().nullable(),
  background: z.string().url("Invalid URL").optional().nullable(),
  role: z.nativeEnum(EUserRole).optional(),
  block: z.boolean().optional(),
});
export const MemberUpdateFileDto = MemberUpdateDto.omit({
  profile: true,
  background: true,
}).extend({
  background: z.union([fileSchema, z.string().url(), z.null()]).optional(),
  profile: z.union([fileSchema, z.string().url(), z.null()]).optional(),
});

export const MemberLoginDtoType = z.object({
  phoneNumber: z.string(),
  password: z.string().min(6),
});
export const MemberChangePasswordDtoType = z
  .object({
    oldPassword: z.string(),
    password: z.string().min(6),
  })
  .extend(idDto.shape);

export const MemberAdminDto = z.object({
  id: z.string(),
  isActive: z.boolean(),
  visible: z.boolean(),
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  profile: z.string().url().optional().nullable(),
  role: z.nativeEnum(EUserRole),
  block: z.boolean(),
  password: z.string().optional(),
  background: z.string().url().optional().nullable(),
  loginVersion: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const MemberAdminViewDto = z.object({
  id: z.string(),
  isActive: z.boolean(),
  visible: z.boolean(),
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  profile: z.string().url().optional().nullable(),
  role: z.nativeEnum(EUserRole),
  block: z.boolean(),
  password: z.string().optional(),
  background: z.string().url().optional().nullable(),
  loginVersion: z.number(),
  Jobber: z.object({
    id: z.string(),
  }),
  Company: z.object({
    id: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const MemberPaginationDto = QueryDto.extend({
  role: z.nativeEnum(EUserRole).optional(),
});

// ✅ Export TypeScript types
export type IMemberCreateDtoType = z.infer<typeof MemberCreateDto>;
export type IMemberFileCreateDtoType = z.infer<typeof MemberCreateFileDto>;

export type IMemberUpdateDtoType = z.infer<typeof MemberUpdateDto>;
export type IMemberFileUpdateDtoType = z.infer<typeof MemberUpdateFileDto>;

export type IMemberLoginDtoType = z.infer<typeof MemberLoginDtoType>;
export type IMemberChangePasswordDtoType = z.infer<
  typeof MemberChangePasswordDtoType
>;
export type IMemberAdminDtoType = z.infer<typeof MemberAdminDto>;
export type IMemberAdminViewDtoType = z.infer<typeof MemberAdminViewDto>;
export type IMemberPaginationDtoType = z.infer<typeof MemberPaginationDto>;
