import { t } from "../../lib/trpc";
import {
  CompanyPaginationDto,
  CompanyCreateDto,
  idDto,
  CompanyUpdateDto,
  IIdDtoType,
  ComboboxDto,
} from "@skillsmatch/dto";
import {
  CreateCompany,
  DeleteCompany,
  GetCompany,
  GetCompanyById,
  GetCompanyByMemberId,
  GetCompanyCombobox,
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
  getByMemberId:
    t.procedure
      .input(idDto)
      .query(async ({ input }: { input: IIdDtoType }) => {
        return GetCompanyByMemberId(input.id);
      }),
  create: t.procedure.input(CompanyCreateDto).mutation(async ({ input }) => {
    return CreateCompany(input);
  }),

  update: t.procedure
    .input(CompanyUpdateDto.extend(idDto.shape))
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
  fetchCompanyCombobox: t.procedure
    .input(ComboboxDto)
    .query(async ({ input }) => {
      return GetCompanyCombobox(input);
    }),
});
