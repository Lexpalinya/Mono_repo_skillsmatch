import { z } from "zod";
import {
    CreateJobPosition,
    DeleteJobPosition,
    GetJobPosition,
    GetJobPositionById,
    UpdateJobPosition,
} from "./service";
import {
    idDto,
    IIdDtoType,
    IJobPositionCreateDtoType,
    IQueryDtoType,
    JobPositionCreateDto,
    JobPositionUpdateDto,
    QueryDto,
} from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";

export const jobPositionRouter = router({
    getAll: publicProcedure.input(QueryDto)
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetJobPosition(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetJobPositionById(input.id);
        }),

    create: publicProcedure
        .input(JobPositionCreateDto)
        .mutation(async ({ input }: { input: IJobPositionCreateDtoType }) => {
            return CreateJobPosition(input);
        }),

    update: publicProcedure
        .input(JobPositionUpdateDto.extend(idDto.shape))
        .mutation(
            async ({ input }: { input: z.infer<typeof JobPositionUpdateDto> & IIdDtoType }) => {
                const { id, ...data } = input;
                return UpdateJobPosition(id, data);
            }
        ),

    delete: publicProcedure
        .input(idDto)
        .mutation(async ({ input }: { input: IIdDtoType }) => {
            return DeleteJobPosition(input.id);
        }),
});
