import { z } from 'zod';

const CreateCompanyDTO = z.object({
    isActive: z.boolean().optional(), // default = true
    isVerify: z.boolean().optional(), // default = false
    memberId: z.string().uuid({ message: 'Invalid member ID' }),
    name: z.string().min(1, 'Company name is required'),
    bmId: z.string().uuid({ message: 'Invalid Business Model ID' }),
    taxPayId: z.string().min(1, 'Tax Pay ID is required'),
    dob: z.coerce.date({ message: 'Invalid company DOB' }),
    owner_firstname: z.string().min(1, 'Owner first name is required'),
    owner_lastname: z.string().min(1, 'Owner last name is required'),
    province: z.string().min(1, 'Province is required'),
    district: z.string().min(1, 'District is required'),
    village: z.string().min(1, 'Village is required'),
    docImage: z.array(z.string().url({ message: 'Invalid document image URL' })),
    reason: z.string().optional(),
});
const UpdateCompanyDTO = z.object({
    id: z.string().uuid({ message: 'Invalid company ID' }),
    isActive: z.boolean().optional(),
    isVerify: z.boolean().optional(),
    memberId: z.string().uuid().optional(),
    name: z.string().optional(),
    bmId: z.string().uuid().optional(),
    taxPayId: z.string().optional(),
    dob: z.coerce.date().optional(),
    owner_firstname: z.string().optional(),
    owner_lastname: z.string().optional(),
    province: z.string().optional(),
    district: z.string().optional(),
    village: z.string().optional(),
    docImage: z.array(z.string().url()).optional(),
    reason: z.string().optional(),
});
export {
    CreateCompanyDTO,
    UpdateCompanyDTO,
};

export type ICompanyCreateDTOType = z.infer<typeof CreateCompanyDTO>;
export type ICompanyUpdateDTOType = z.infer<typeof UpdateCompanyDTO>;
