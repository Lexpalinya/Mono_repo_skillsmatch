import { z } from 'zod';

const AttendInterViewCreateDTO = z.object({
  isActive: z.boolean().optional(), // Defaults to true
  status: z.string().min(1, 'Status is required'),
  ajId: z.string().uuid({ message: 'Invalid ApplyForJob ID' }),
  data: z.coerce.date({ message: 'Invalid interview date' }),
  result: z.string().min(1, 'Result is required'),
  more: z.string().min(1, 'More detail is required'),
});
const AttendInterViewUpdateDTO = z.object({
    id: z.string().uuid({ message: 'Invalid AttendInterView ID' }),
    isActive: z.boolean().optional(),
    status: z.string().optional(),
    ajId: z.string().uuid().optional(),
    data: z.coerce.date().optional(),
    result: z.string().optional(),
    more: z.string().optional(),
  });
  export {
    AttendInterViewCreateDTO,
    AttendInterViewUpdateDTO,
  };
  
  export type IAttendInterViewCreateDTOType = z.infer<typeof AttendInterViewCreateDTO>;
  export type IAttendInterViewUpdateDTOType = z.infer<typeof AttendInterViewUpdateDTO>;
  