import { z } from 'zod'

export const MajorCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'),
})

export const MajorUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

export type IMajorCreateDtoType = z.infer<typeof MajorCreateDto>
export type IMajorUpdateDtoType = z.infer<typeof MajorUpdateDto>
