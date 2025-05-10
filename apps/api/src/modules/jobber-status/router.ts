import { z } from "zod";
import { CreateCourse, DeleteCourse, GetCourse, GetCourseById, UpdateCourse } from "./service";
import { idDto, IIdDtoType, ICourseCreateDtoType, CourseCreateDto, CourseUpdateDto, QueryDto, IQueryDtoType } from "@skillsmatch/dto";
import { publicProcedure, router } from "../../lib/trpc";

export const courseRouter = router({
    getAll: publicProcedure.input(QueryDto)
        .query(async ({ input }: { input?: IQueryDtoType }) => {
            return GetCourse(input || {});
        }),

    getById: publicProcedure
        .input(idDto)
        .query(async ({ input }: { input: IIdDtoType }) => {
            return GetCourseById(input.id);
        }),

    create: publicProcedure
        .input(
            CourseCreateDto
        )
        .mutation(async ({ input }: { input: ICourseCreateDtoType }) => {
            return CreateCourse(input);
        }),

    update: publicProcedure
        .input(
            CourseUpdateDto.extend(idDto.shape)
        )
        .mutation(async ({ input }: { input: z.infer<typeof CourseUpdateDto> & IIdDtoType }) => {
            const { id, ...data } = input;
            return UpdateCourse(id, data);
        }),

    delete: publicProcedure
        .input(idDto)
        .mutation(async ({ input }: { input: IIdDtoType }) => {
            return DeleteCourse(input.id);
        }),
});
