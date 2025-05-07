import { z } from 'zod'

export const EducationLevelCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'),
})

export const EducationLevelUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

export type IEducationLevelCreateDtoType = z.infer<typeof EducationLevelCreateDto>
export type IEducationLevelUpdateDtoType = z.infer<typeof EducationLevelUpdateDto>
