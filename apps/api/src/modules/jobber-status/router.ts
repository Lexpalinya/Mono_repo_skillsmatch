import {
  CreateJobberStatus,
  DeleteJobberStatus,
  GetJobberStatus,
  GetJobberStatusById,
  GetJobberStatusCombobox,
  GetStatsJobberStatus,
  UpdateJobberStatus,
} from "./service";
import {
  idDto,
  IJobberStatusCreateDtoType,
  JobberStatusCreateDto,
  JobberStatusUpdateDto,
  JobberStatusPaginationDto,
  ComboboxDto,
  IIdDtoType,
} from "@skillsmatch/dto";
import { t } from "../../lib/trpc";

export const jobberStatusRouter = t.router({
  getAll: t.procedure
    .input(JobberStatusPaginationDto)
    .query(async ({ input }) => {
      return GetJobberStatus(input);
    }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetJobberStatusById(input.id);
    }),

  create: t.procedure
    .input(JobberStatusCreateDto)
    .mutation(async ({ input }: { input: IJobberStatusCreateDtoType }) => {
      return CreateJobberStatus(input);
    }),

  update: t.procedure
    .input(JobberStatusUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateJobberStatus(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteJobberStatus(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsJobberStatus();
  }),
  fetchJobberStatusCombobox: t.procedure
    .input(ComboboxDto)
    .query(async ({ input }) => {
      return GetJobberStatusCombobox(input);
    }),
});
