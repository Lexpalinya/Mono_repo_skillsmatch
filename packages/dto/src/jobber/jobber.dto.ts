import { EGender } from '@prisma/client'
import { z } from 'zod'

export const JobberCreateDto = z.object({
  isVerify: z.boolean().optional(),
  statusId: z.string().min(1, 'Status ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  gender: z.nativeEnum(EGender),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  birthday: z.coerce.date(),
  nationality: z.string().min(1, 'Nationality is required'),
  ethnicity: z.string().min(1, 'Ethnicity is required'),
  religion: z.string().min(1, 'Religion is required'),
  bProvice: z.string().min(1, 'Birth province is required'),
  bDistrict: z.string().min(1, 'Birth district is required'),
  bVillage: z.string().min(1, 'Birth village is required'),
  cProvice: z.string().min(1, 'Current province is required'),
  cDistrict: z.string().min(1, 'Current district is required'),
  cVillage: z.string().min(1, 'Current village is required'),
  docImage: z.array(z.string().url('Invalid URL')).min(1, 'At least one document image is required'),
  reason: z.string().optional().nullable(),
})

export const JobberUpdateDto = z.object({
  isVerify: z.boolean().optional(),
  statusId: z.string().optional(),
  userId: z.string().optional(),
  gender: z.nativeEnum(EGender).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthday: z.coerce.date().optional(),
  nationality: z.string().optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  bProvice: z.string().optional(),
  bDistrict: z.string().optional(),
  bVillage: z.string().optional(),
  cProvice: z.string().optional(),
  cDistrict: z.string().optional(),
  cVillage: z.string().optional(),
  docImage: z.array(z.string().url('Invalid URL')).optional(),
  reason: z.string().optional().nullable(),
})

// ✅ Export TypeScript types
export type IJobberCreateDtoType = z.infer<typeof JobberCreateDto>
export type IJobberUpdateDtoType = z.infer<typeof JobberUpdateDto>
