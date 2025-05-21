import { z } from "zod";
import {
  CreateMajor,
  DeleteMajor,
  GetMajor,
  GetMajorById,
  GetStatsMajor,
  UpdateMajor,
} from "./service";
import {
  idDto,
  IIdDtoType,
  IMajorCreateDtoType,
  MajorCreateDto,
  MajorUpdateDto,
  MajorPaginationDto,
} from "@skillsmatch/dto"; 
import { t } from "../../lib/trpc";

export const majorRouter = t.router({
  getAll: t.procedure.input(MajorPaginationDto).query(async ({ input }) => {
    return GetMajor(input);
  }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetMajorById(input.id);
    }),

  create: t.procedure
    .input(MajorCreateDto)
    .mutation(async ({ input }: { input: IMajorCreateDtoType }) => {
      return CreateMajor(input);
    }),

  update: t.procedure
    .input(MajorUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateMajor(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteMajor(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsMajor();
  }),
});
