import { z } from "zod";
import {
    CreateEducationLevel,
    DeleteEducationLevel,
    GetEducationLevel,
    GetEducationLevelById,
    UpdateEducationLevel,
} from "./service";
import {
    idDto,
    IIdDtoType,
    IEducationLevelCreateDtoType,
    EducationLevelCreateDto,
    EducationLevelUpdateDto,
    QueryDto,
    IQueryDtoType,
} from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";

export const educationLevelRouter = router({
    getAll: publicProcedure.input(QueryDto)
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetEducationLevel(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetEducationLevelById(input.id);
        }),

    create: publicProcedure
        .input(EducationLevelCreateDto)
        .mutation(async ({ input }: { input: IEducationLevelCreateDtoType }) => {
            return CreateEducationLevel(input);
        }),

    update: publicProcedure
        .input(EducationLevelUpdateDto.extend(idDto.shape))
        .mutation(
            async ({ input }: { input: z.infer<typeof EducationLevelUpdateDto> & IIdDtoType }) => {
                const { id, ...data } = input;
                return UpdateEducationLevel(id, data);
            }
        ),

    delete: publicProcedure
        .input(idDto)
        .mutation(async ({ input }: { input: IIdDtoType }) => {
            return DeleteEducationLevel(input.id);
        }),
});
