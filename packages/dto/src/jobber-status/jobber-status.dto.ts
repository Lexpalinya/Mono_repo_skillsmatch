import { z } from 'zod'

export const JobberStatusCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'),
})

export const JobberStatusUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

export type IJobberStatusCreateDtoType = z.infer<typeof JobberStatusCreateDto>
export type IJobberStatusUpdateDtoType = z.infer<typeof JobberStatusUpdateDto>
