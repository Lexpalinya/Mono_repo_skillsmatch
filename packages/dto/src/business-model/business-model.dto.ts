import { z } from 'zod'

export const BusinessModelCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'),
})

export const BusinessModelUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

export type IBusinessModelCreateDtoType = z.infer<typeof BusinessModelCreateDto>
export type IBusinessModelUpdateDtoType = z.infer<typeof BusinessModelUpdateDto>
