import { z } from 'zod'

export const CourseCreateDto = z.object({
  isActive: z.boolean().optional(),  
  visible: z.boolean().optional(),  
  name: z.string().min(1, 'Name is required'),
})

export const CourseUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})


export type ICourseCreateDtoType = z.infer<typeof CourseCreateDto>
export type ICourseUpdateDtoType = z.infer<typeof CourseUpdateDto>