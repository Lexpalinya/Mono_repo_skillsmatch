import { z } from 'zod';

const PostCreateDTO = z.object({
    isActive: z.boolean().optional(),
    cId: z.string().uuid({ message: 'Invalid company ID' }),
    title: z.string().min(1, 'Title is required'),
    image: z.array(z.string().url({ message: 'Invalid image URL' })),
    minSalary: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid minSalary format'),
    maxSalary: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid maxSalary format'),
    checkInTime: z.coerce.date({ message: 'Invalid check-in time' }),
    checkOutTime: z.coerce.date({ message: 'Invalid check-out time' }),
    gpa: z.number().min(0).max(4),
    currency: z.enum(['KIP', 'USD', 'THB', 'CNY']),
    workday: z.array(z.string()),
    endDate: z.coerce.date({ message: 'Invalid end date' }),
    welfare: z.string().min(1, 'Welfare is required'),
    more: z.string().min(1, 'More information is required'),

    courseIds: z.array(z.string().uuid()).optional(),
    majorIds: z.array(z.string().uuid()).optional(),
    educationLevelIds: z.array(z.string().uuid()).optional(),
    educationInstitutionIds: z.array(z.string().uuid()).optional(),

    jobPositions: z.array(
        z.object({
            jpId: z.string().uuid({ message: 'Invalid JobPosition ID' }),
            description: z.string().min(1),
            skillIds: z.array(z.string().uuid()).optional(),
        })
    ).optional(),
});

const PostUpdateDTO = z.object({
    id: z.string().uuid({ message: 'Invalid post ID' }),
    isActive: z.boolean().optional(),
    cId: z.string().uuid().optional(),
    title: z.string().optional(),
    image: z.array(z.string().url()).optional(),
    minSalary: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid minSalary format').optional(),
    maxSalary: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid maxSalary format').optional(),
    checkInTime: z.coerce.date().optional(),
    checkOutTime: z.coerce.date().optional(),
    gpa: z.number().min(0).max(4).optional(),
    currency: z.enum(['KIP', 'USD', 'THB', 'CNY']).optional(),
    workday: z.array(z.string()).optional(),
    endDate: z.coerce.date().optional(),
    welfare: z.string().optional(),
    more: z.string().optional(),
    courseIds: z.array(z.string().uuid()).optional(),
    majorIds: z.array(z.string().uuid()).optional(),
    educationLevelIds: z.array(z.string().uuid()).optional(),
    educationInstitutionIds: z.array(z.string().uuid()).optional(),
    jobPositions: z.array(
        z.object({
            id: z.string().uuid().optional(),
            jpId: z.string().uuid().optional(),
            description: z.string().optional(),
            skillIds: z.array(z.string().uuid()).optional(),
        })
    ).optional(),
});



export {
    PostCreateDTO,
    PostUpdateDTO,
};

export type IPostCreateDTOType = z.infer<typeof PostCreateDTO>;
export type IPostUpdateDTOType = z.infer<typeof PostUpdateDTO>;
