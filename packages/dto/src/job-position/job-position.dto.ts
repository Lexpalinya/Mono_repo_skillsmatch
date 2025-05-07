import { z } from 'zod'

export const JobPositionCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'),
})

export const JobPositionUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

export type IJobPositionCreateDtoType = z.infer<typeof JobPositionCreateDto>
export type IJobPositionUpdateDtoType = z.infer<typeof JobPositionUpdateDto>
