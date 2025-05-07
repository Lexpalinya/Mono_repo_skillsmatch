
import { z } from "zod";
import { CreateSkill, DeleteSkill, GetSkill, GetSkillById, UpdateSkill } from "./service";
import { idDto, IIdDtoType, IQueryDtoType, ISkillCreateDtoType, QueryDto, SkillCreateDto, SkillUpdateDto } from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";

export const skillRouter = router({
    getAll: publicProcedure.input(QueryDto)
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetSkill(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetSkillById(input.id);
        }),

    create: publicProcedure
        .input(
            SkillCreateDto
        )
        .mutation(async ({ input }: { input: ISkillCreateDtoType }) => {
            return CreateSkill(input);
        }),

    update: publicProcedure
        .input(
            SkillUpdateDto.extend(idDto.shape)
        )
        .mutation(async ({ input }: { input: z.infer<typeof SkillUpdateDto> & IIdDtoType }) => {
            const { id, ...data } = input;
            return UpdateSkill(id, data);
        }),

    delete: publicProcedure
        .input(idDto)
        .mutation(async ({ input }: { input: IIdDtoType }) => {
            return DeleteSkill(input.id);
        }),
});
