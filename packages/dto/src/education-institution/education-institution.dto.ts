import { z } from 'zod'

export const EducationalInstitutionCreateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'),
})

export const EducationalInstitutionUpdateDto = z.object({
  isActive: z.boolean().optional(),
  visible: z.boolean().optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

export type IEducationalInstitutionCreateDtoType = z.infer<typeof EducationalInstitutionCreateDto>
export type IEducationalInstitutionUpdateDtoType = z.infer<typeof EducationalInstitutionUpdateDto>
