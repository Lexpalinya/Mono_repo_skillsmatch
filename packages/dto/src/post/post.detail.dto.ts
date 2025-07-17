import { z } from "zod";
const CompanydddSchema = z.object({
  name: z.string(),
  province: z.string(),
  district: z.string(),
  village: z.string(),
  isVerify: z.boolean(),
  member: z.object({
    id: z.string(),
    profile: z.string(),
  }),
  bm: z.object({
    name: z.string(),
  }),
});
export const PostDetailddddDto = z.object({
  id: z.string().uuid(),
  title: z.string(),
  imageUrls: z.array(z.string().url()),
  company: CompanydddSchema,
  workDay: z.array(z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"])),
  minSalary: z
    .string()
    .regex(/^\d{1,3}(,\d{3})*$/, { message: "Invalid number format" }),
  maxSalary: z
    .string()
    .regex(/^\d{1,3}(,\d{3})*$/, { message: "Invalid number format" }),
  currency: z.enum(["KIP", "USD", "THB", "CNY"]),

  workTime: z.string(), // ex. "08:00 - 17:30"
  gpa: z.number().min(0).max(4),
  endDate: z.string(), // "30/6/2568" หรือใช้ z.date().transform(...) หากต้องการแปลง

  welfare: z.string(),
  more: z.string(),

  educationLevels: z.array(z.string()),
  institutions: z.array(z.string()),
  majors: z.array(z.string()),
  courses: z.array(z.string()),

  jobPositions: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      amount: z.number().min(1),
      skills: z.array(z.string()),
    })
  ),
});

export type IPostDetailddddDto = z.infer<typeof PostDetailddddDto>;
