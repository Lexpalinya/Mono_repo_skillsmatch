import { z } from "zod";

export const idDto = z.object({
  id: z.string().min(1, "Role Id is required"),
});

export type IIdDtoType = z.infer<typeof idDto>;
