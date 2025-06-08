import { z } from "zod";
import {
  CreateCourse,
  DeleteCourse,
  GetCourse,
  GetCourseById,
  GetCourseCombobox,
  GetStatsCourse,
  UpdateCourse,
} from "./service";
import {
  idDto,
  IIdDtoType,
  ICourseCreateDtoType,
  CourseCreateDto,
  CourseUpdateDto,
  CoursePaginationDto,
  ComboboxDto,
} from "@skillsmatch/dto";
import { t } from "../../lib/trpc";

export const courseRouter = t.router({
  getAll: t.procedure.input(CoursePaginationDto).query(async ({ input }) => {
    return GetCourse(input);
  }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetCourseById(input.id);
    }),

  create: t.procedure
    .input(CourseCreateDto)
    .mutation(async ({ input }: { input: ICourseCreateDtoType }) => {
      return CreateCourse(input);
    }),

  update: t.procedure
    .input(CourseUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateCourse(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteCourse(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsCourse();
  }),
  fetchCourseCombobox: t.procedure
    .input(ComboboxDto)
    .query(async ({ input }) => {
      return GetCourseCombobox(input);
    }),
});
