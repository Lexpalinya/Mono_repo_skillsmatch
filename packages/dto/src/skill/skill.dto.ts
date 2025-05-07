import { z } from 'zod'

export const SkillCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'),
})

export const SkillUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

export type ISkillCreateDtoType = z.infer<typeof SkillCreateDto>
export type ISkillUpdateDtoType = z.infer<typeof SkillUpdateDto>
