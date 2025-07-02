import { z } from 'zod';
import { PostJobSchema } from '../post/post.dto';

const ApplyForJobCreateDTO = z.object({
  isActive: z.boolean().optional(), // optional since it defaults to true in DB
  pId: z.string().min(1, 'Project ID is required'),
  jId: z.string().uuid({ message: 'Invalid Jobber ID' }),
  status: z.string().min(1, 'Status is required'),
});

const ApplyForJobUpdateDTO
  = z.object({
    id: z.string().uuid({ message: 'Invalid ApplyForJob ID' }),
    isActive: z.boolean().optional(),
    pId: z.string().optional(),
    jId: z.string().uuid().optional(),
    status: z.string().optional(),
  });


const ApplyForJobGetJobberDTO = z.object({
  id: z.string(),
  pId: z.string(),
  status: z.string(),
  post: PostJobSchema
})
export {
  ApplyForJobCreateDTO,
  ApplyForJobUpdateDTO,
};

export type IApplyForJobCreateDTOType = z.infer<typeof ApplyForJobCreateDTO>;
export type IApplyForJobUpdateDTOType = z.infer<typeof ApplyForJobUpdateDTO>;
export type IApplyForJobGetJobberDTO = z.infer<typeof ApplyForJobGetJobberDTO>