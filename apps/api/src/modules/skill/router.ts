import { z } from "zod";
import {
  CreateSkill,
  DeleteSkill,
  GetSkill,
  GetSkillById,
  UpdateSkill,
} from "./service";
import {
  idDto,
  IIdDtoType,
  ISkillCreateDtoType,
  SkillCreateDto,
  SkillUpdateDto,
  SkillPaginationDto,
} from "@skillsmatch/dto";
import { t } from "../../lib/trpc"; // Ensure this uses `initTRPC().create()`

export const skillRouter = t.router({
  getAll: t.procedure
    .input(SkillPaginationDto)
    .query(async ({ input }) => {
      return GetSkill(input);
    }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetSkillById(input.id);
    }),

  create: t.procedure
    .input(SkillCreateDto)
    .mutation(async ({ input }: { input: ISkillCreateDtoType }) => {
      return CreateSkill(input);
    }),

  update: t.procedure
    .input(SkillUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateSkill(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteSkill(input.id);
    }),
});
