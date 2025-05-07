import { z } from "zod";

export const QueryDto = z.object({
    page: z.number().min(1).default(1).optional(),
    pageSize: z.number().min(1).max(100).default(10).optional(),
    orderBy: z
        .array(
            z.object({
                field: z.string(),
                direction: z.enum(["asc", "desc"]),
            })
        )
        .optional(),
    where: z.record(z.any()).optional(),
    include: z.record(z.any()).optional(),
});

export type IQueryDtoType = z.infer<typeof QueryDto>;
