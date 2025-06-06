import { t } from "../../lib/trpc";
import {
  CompanyPaginationDto,
  CompanyCreateDTO,
  ICompanyCreateDTOType,
  ICompanyUpdateDTOType,
  idDto,
  IIdDtoType,
  CompanyUpdateDTO,
} from "@skillsmatch/dto";
import {
  CreateCompany,
  DeleteCompany,
  GetCompany,
  GetCompanyById,
  GetStatsCompany,
  UpdateCompany,
} from "./service";

export const companyRouter = t.router({
  getAll: t.procedure.input(CompanyPaginationDto).query(async ({ input }) => {
    return GetCompany(input);
  }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetCompanyById(input.id);
    }),

  create: t.procedure.input(CompanyCreateDTO).mutation(async ({ input }) => {
    return CreateCompany(input);
  }),

  update: t.procedure
    .input(CompanyUpdateDTO.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateCompany(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteCompany(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsCompany();
  }),
});
