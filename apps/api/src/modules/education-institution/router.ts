import { z } from "zod";
import {
  CreateEducationalInstitution,
  DeleteEducationalInstitution,
  GetEducationalInstitution,
  GetEducationalInstitutionById,
  GetEducationalInstitutionCombobox,
  GetStatsEducationalInstitution,
  UpdateEducationalInstitution,
} from "./service";
import {
  idDto,
  IIdDtoType,
  IEducationalInstitutionCreateDtoType,
  EducationalInstitutionCreateDto,
  EducationalInstitutionUpdateDto,
  EducationalInstitutionPaginationDto,
  ComboboxDto,
} from "@skillsmatch/dto";
import { t } from "../../lib/trpc";

export const educationalInstitutionRouter = t.router({
  getAll: t.procedure
    .input(EducationalInstitutionPaginationDto)
    .query(async ({ input }) => {
      return GetEducationalInstitution(input);
    }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetEducationalInstitutionById(input.id);
    }),

  create: t.procedure
    .input(EducationalInstitutionCreateDto)
    .mutation(
      async ({ input }: { input: IEducationalInstitutionCreateDtoType }) => {
        return CreateEducationalInstitution(input);
      }
    ),

  update: t.procedure
    .input(EducationalInstitutionUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateEducationalInstitution(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteEducationalInstitution(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsEducationalInstitution();
  }),
  fetchEducationalInstitutionCombobox: t.procedure
    .input(ComboboxDto)
    .query(async ({ input }) => {
      return GetEducationalInstitutionCombobox(input);
    }),
});
