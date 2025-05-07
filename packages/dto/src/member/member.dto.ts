import { EUserRole } from '@prisma/client'
import { z } from 'zod'
import { idDto } from '../id/id.dto'

export const MemberCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  profile: z.string().url('Invalid URL').optional().nullable(),
  background: z.string().url('Invalid URL').optional().nullable(),
  role: z.nativeEnum(EUserRole),
  block: z.boolean().optional(),
  loginVersion: z.number().optional(),
})

export const MemberUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  username: z.string().min(1).optional(),
  email: z.string().email('Invalid email').optional(),
  phoneNumber: z.string().optional(),
  profile: z.string().url('Invalid URL').optional().nullable(),
  background: z.string().url('Invalid URL').optional().nullable(),
  role: z.nativeEnum(EUserRole).optional(),
  block: z.boolean().optional(),

})

export const MemberLoginDtoType = z.object({
  phoneNumber: z.string(),
  password: z.string().min(6)
})
export const MemberChangePasswordDtoType = z.object({
  oldPassword: z.string(),
  password: z.string().min(6)
}).extend(idDto.shape)



// ✅ Export TypeScript types
export type IMemberCreateDtoType = z.infer<typeof MemberCreateDto>
export type IMemberUpdateDtoType = z.infer<typeof MemberUpdateDto>
export type IMemberLoginDtoType = z.infer<typeof MemberLoginDtoType>
export type IMemberChangePasswordDtoType = z.infer<typeof MemberChangePasswordDtoType>