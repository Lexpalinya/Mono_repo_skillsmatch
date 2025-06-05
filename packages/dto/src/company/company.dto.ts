import { boolean, z } from "zod";
import { fileSchema } from "../file.dto";
import { QueryDto } from "../query/query.dto";

export const CompanyCreateCompanyDTO = z.object({
  isActive: z.boolean().optional(), // default = true
  isVerify: z.boolean().optional(), // default = false
  memberId: z.string().uuid({ message: "Invalid member ID" }),
  name: z.string().min(1, "Company name is required"),
  bmId: z.string().uuid({ message: "Invalid Business Model ID" }),
  taxPayId: z.string().min(1, "Tax Pay ID is required"),
  dob: z.coerce.date({ message: "Invalid company DOB" }),
  owner_firstname: z.string().min(1, "Owner first name is required"),
  owner_lastname: z.string().min(1, "Owner last name is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  village: z.string().min(1, "Village is required"),
  docImage: z.array(z.string().url({ message: "Invalid document image URL" })),
  reason: z.string().optional(),
});
export const CompanyFileCreateDTO = CompanyCreateCompanyDTO.omit({
  docImage: true,
}).extend({
  docImage: z
    .union([fileSchema.array(), z.array(z.string().url()), z.null()])
    .optional(),
});

export const CompanyUpdateCompanyDTO = z.object({
  isActive: z.boolean().optional(),
  isVerify: z.boolean().optional(),
  memberId: z.string().uuid().optional(),
  name: z.string().optional(),
  bmId: z.string().uuid().optional(),
  taxPayId: z.string().optional(),
  dob: z.coerce.date().optional(),
  owner_firstname: z.string().optional(),
  owner_lastname: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
  docImage: z.array(z.string().url()).optional(),
  reason: z.string().optional(),
});
export const CompanyFileUpdateDTO = CompanyUpdateCompanyDTO.omit({
  docImage: true,
}).extend({
  docImage: z
    .union([z.array(z.union([fileSchema, z.string().url()])), z.null()])
    .optional(),
});

export const CompanyAdminViewDto = z.object({
  id: z.string(),
  isVerify: z.boolean().default(false),
  isActive: z.boolean().default(true),
  member: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    profile: z.string().nullable().optional(),
  }),
  memberId: z.string(),
  name: z.string(),
  bmId: z.string(),
  bm: z.object({
    id: z.string(),
    name: z.string(),
  }),
  taxPayId: z.string(),
  dob: z.date(),
  owner_firstname: z.string(),
  owner_lastname: z.string(),
  province: z.string(),
  district: z.string(),
  village: z.string(),
  docImage: z.array(z.string().url({ message: "Invalid document image URL" })),
  reason: z.string(),
});

export const CompanyAdminDto = z.object({
  id: z.string(),
  isVerify: z.boolean(),
  name: z.string(),
  taxPayId: z.string(),
  owner_firstname: z.string(),
  owner_lastname: z.string(),
  bmId: z.string().nullable(),
  createdAt: z.string(),
  reason: z.string().nullable(),
  memberId: z.string(),
  province: z.string(),
  district: z.string(),
  village: z.string(),

  member: z.object({
    username: z.string(),
    profile: z.string().nullable(),
    email: z.string().email(),
  }),

  bm: z
    .object({
      name: z.string(),
    })
    .nullable(),
});

export const CompanyStatsDto = z.object({
  total: z.number(),
  active: z.number(),
  verified: z.number(),
  status: z.number(),
});

export const CompanyPaginationDto = QueryDto.extend({
  visible: z.boolean().optional(),
  bmIds: z.array(z.string()).optional(),
  verified: boolean().optional(),
});
export type ICompanyCreateDTOType = z.infer<typeof CompanyCreateCompanyDTO>;
export type ICompanyUpdateDTOType = z.infer<typeof CompanyUpdateCompanyDTO>;
export type ICompanyAdminViewDtoType = z.infer<typeof CompanyAdminViewDto>;
export type ICompanyPaginationDtoType = z.infer<typeof CompanyPaginationDto>;
export type ICompanyStatusDtoType = z.infer<typeof CompanyStatsDto>;
export type ICompanyAdminDataType = z.infer<typeof CompanyAdminDto>;
export type ICompanyFileCreateDTOType = z.infer<typeof CompanyFileCreateDTO>;
export type ICompanyFileUpdateDTOType = z.infer<typeof CompanyFileUpdateDTO>;
