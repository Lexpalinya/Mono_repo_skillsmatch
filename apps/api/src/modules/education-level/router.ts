import { z } from "zod";
import {
  CreateEducationLevel,
  DeleteEducationLevel,
  GetEducationLevel,
  GetEducationLevelById,
  GetEducationLevelCombobox,
  GetStatsEducationLevel,
  UpdateEducationLevel,
} from "./service";
import {
  idDto,
  IIdDtoType,
  IEducationLevelCreateDtoType,
  EducationLevelCreateDto,
  EducationLevelUpdateDto,
  EducationLevelPaginationDto,
  ComboboxDto,
} from "@skillsmatch/dto";
import { t } from "../../lib/trpc";

export const educationLevelRouter = t.router({
  getAll: t.procedure
    .input(EducationLevelPaginationDto)
    .query(async ({ input }) => {
      return GetEducationLevel(input);
    }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetEducationLevelById(input.id);
    }),

  create: t.procedure
    .input(EducationLevelCreateDto)
    .mutation(async ({ input }: { input: IEducationLevelCreateDtoType }) => {
      return CreateEducationLevel(input);
    }),

  update: t.procedure
    .input(EducationLevelUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateEducationLevel(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteEducationLevel(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsEducationLevel();
  }),
  fetchEducationLevelCombobox: t.procedure
    .input(ComboboxDto)
    .query(async ({ input }) => {
      return GetEducationLevelCombobox(input);
    }),
});
