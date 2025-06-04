import { t } from "../../lib/trpc";
import {
  CompanyPaginationDto,
  CreateCompanyDTO,
  ICompanyCreateDTOType,
  ICompanyUpdateDTOType,
  idDto,
  IIdDtoType,
  UpdateCompanyDTO,
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

  create: t.procedure
    .input(CreateCompanyDTO)
    .mutation(async ({ input }: { input: ICompanyCreateDTOType }) => {
      return CreateCompany(input);
    }),

  update: t.procedure
    .input(UpdateCompanyDTO.extend(idDto.shape))
    .mutation(async ({ input }: { input: ICompanyUpdateDTOType }) => {
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
