import { z, type TypeOf } from "zod";
import { PostJobSchema } from "../post/post.dto";

const ApplyForJobCreateDTO = z.object({
  isActive: z.boolean().optional(), // optional since it defaults to true in DB
  pId: z.string().min(1, "Project ID is required"),
  jId: z.string().uuid({ message: "Invalid Jobber ID" }),
  status: z.string().min(1, "Status is required"),
  jp: z.string(),
});

const ApplyForJobUpdateDTO = z.object({
  id: z.string().uuid({ message: "Invalid ApplyForJob ID" }),
  isActive: z.boolean().optional(),
  pId: z.string().optional(),
  jId: z.string().uuid().optional(),
  status: z.string().optional(),
});

const ApplyForJobGetJobberDTO = z.object({
  id: z.string(),
  pId: z.string(),
  jp: z.string(),
  status: z.string(),
  post: PostJobSchema,
});
export { ApplyForJobCreateDTO, ApplyForJobUpdateDTO };

// Skill
const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const JobProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// PostJobPositionDetailSkill
const PostJobPositionDetailSkillSchema = z.object({
  sk: SkillSchema,
});

// JobPosition
const JobPositionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// PostJobPositionDetail
const PostJobPositionDetailSchema = z.object({
  amount: z.number(),
  jp: JobPositionSchema,
  postJobPositionDetailSkill: z
    .array(PostJobPositionDetailSkillSchema)
    .optional(),
});

// BusinessType (bm)
const BusinessTypeSchema = z.object({
  name: z.string(),
});

// Member profile
const MemberSchema = z.object({
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  profile: z.string().url().optional().nullable(),
  background: z.string().url().optional().nullable(),
});

// Company
const CompanySchema = z.object({
  name: z.string(),
  province: z.string(),
  district: z.string(),
  village: z.string(),
  isVerify: z.boolean(),
  member: MemberSchema.optional(),
  bm: BusinessTypeSchema.optional(),
});

// Jobber status
const JobberStatusSchema = z.object({
  name: z.string(),
});

// Major
const MajorSchema = z.object({
  name: z.string().optional(),
});

// JobberProfileSkill
const JobberProfileSkillSchema = z.object({
  skill: SkillSchema,
});
const JobberProfilePositionSchema = z.object({
  jP: JobProfileSchema,
});

// JobberProfile (เพิ่ม field ใหม่ทั้งหมดที่ขาด)
const JobberProfileSchema = z.object({
  id: z.string().optional(),
  jId: z.string().optional(),
  elId: z.string().optional(),
  eiId: z.string().optional(),
  mId: z.string().optional(),
  cId: z.string().optional(),
  gpa: z.number().optional().nullable(),
  cv: z.array(z.string().url()).optional(),
  startSalary: z.number().optional().nullable(),
  currency: z.string().optional(),
  workDay: z
    .array(z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]))
    .optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  major: MajorSchema.optional(),
  course: z.object({ name: z.string().optional() }).optional(),
  educationalInstitutions: z.object({ name: z.string().optional() }).optional(),
  educationLevels: z.object({ name: z.string().optional() }).optional(),
  JobberProfileSkill: z.array(JobberProfileSkillSchema).optional(),
  JobberProfilePosition: z.array(JobberProfilePositionSchema).optional(), // ปรับ schema ได้ภายหลัง
});

// Jobber (เพิ่ม field ใหม่ทั้งหมดที่ขาด)
const JobberSchema = z.object({
  id: z.string(),
  isVerify: z.boolean(),
  isActive: z.boolean(),
  statusId: z.string().optional(),
  memberId: z.string().optional(),
  gender: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthday: z.union([z.string(), z.date()]).optional(), // ISO format
  nationality: z.string(),
  ethnicity: z.string(),
  religion: z.string(),
  bProvince: z.string(),
  bDistrict: z.string(),
  bVillage: z.string(),
  cProvince: z.string(),
  cDistrict: z.string(),
  cVillage: z.string(),
  docImage: z.array(z.string().url()).optional(),
  reason: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  member: MemberSchema.optional(),
  status: JobberStatusSchema.optional(),
  JobberProfile: JobberProfileSchema.optional(),
});
const ApplyForJobSchema = z.object({
  id: z.string(),
  status: z.string(),
  createdAt: z.string(),
  jobber: JobberSchema.optional().nullable(),
});

// 🧱 สร้าง Schema ของโพสต์ที่มีผู้สมัคร
export const PostWithApplicantsSchema = z.object({
  id: z.string(),
  title: z.string(),
  gpa: z.number().nullable().optional(),
  workday: z.union([z.string(), z.array(z.string())]).optional(),
  currency: z.string(),
  minSalary: z.number(),
  maxSalary: z.number(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  endDate: z.string(), // ISO
  createdAt: z.string().optional(),
  // isActive: z.boolean(),
  company: CompanySchema.optional(),
  postJobPositionDetail: z.array(PostJobPositionDetailSchema).optional(),
  ApplyForJob: z.array(ApplyForJobSchema).optional(), // 👈 ผู้สมัครทั้งหมดของโพสต์
});

export type IPostWithApplicants = z.infer<typeof PostWithApplicantsSchema>;
export type IApplyForJobSchema = z.infer<typeof ApplyForJobSchema>;
export type ICompanyApplyForJobSchema = z.infer<typeof CompanySchema>;
export type IPostJobPositionDetailSchema = z.infer<
  typeof PostJobPositionDetailSchema
>;
export type IJobberDetailApplyForJobDTO = z.infer<typeof JobberSchema>;

export type IApplyForJobCreateDTOType = z.infer<typeof ApplyForJobCreateDTO>;
export type IApplyForJobUpdateDTOType = z.infer<typeof ApplyForJobUpdateDTO>;
export type IApplyForJobGetJobberDTO = z.infer<typeof ApplyForJobGetJobberDTO>;
