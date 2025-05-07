import { z } from "zod";
import {
    CreateMajor,
    DeleteMajor,
    GetMajor,
    GetMajorById,
    UpdateMajor,
} from "./service";
import {
    idDto,
    IIdDtoType,
    IMajorCreateDtoType,
    IQueryDtoType,
    MajorCreateDto,
    MajorUpdateDto,
    QueryDto,
} from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";

export const majorRouter = router({
    getAll: publicProcedure.input(QueryDto)
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetMajor(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetMajorById(input.id);
        }),

    create: publicProcedure
        .input(MajorCreateDto)
        .mutation(async ({ input }: { input: IMajorCreateDtoType }) => {
            return CreateMajor(input);
        }),

    update: publicProcedure
        .input(MajorUpdateDto.extend(idDto.shape))
        .mutation(
            async ({ input }: { input: z.infer<typeof MajorUpdateDto> & IIdDtoType }) => {
                const { id, ...data } = input;
                return UpdateMajor(id, data);
            }
        ),

    delete: publicProcedure
        .input(idDto)
        .mutation(async ({ input }: { input: IIdDtoType }) => {
            return DeleteMajor(input.id);
        }),
});
