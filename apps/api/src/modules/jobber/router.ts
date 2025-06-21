import {
  CreateJobber,
  DeleteJobber,
  GetJobber,
  GetJobberByMemberId,
  GetJobbers,
  GetStatsJobber,
  UpdateJobber,
} from "./service";
import {
  idDto,
  IIdDtoType,
  IJobberCreateDtoType,
  JobberCreateDto,
  JobberUpdateDto,
  JobberPaginationDto,
} from "@skillsmatch/dto";
import { t } from "../../lib/trpc";

export const jobberRouter = t.router({
  getAll: t.procedure.input(JobberPaginationDto).query(async ({ input }) => {
    return GetJobbers(input);
  }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetJobber(input.id);
    }),
  getByMemberId: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetJobberByMemberId(input.id);
    }),

  create: t.procedure
    .input(JobberCreateDto)
    .mutation(async ({ input }: { input: IJobberCreateDtoType }) => {
      return CreateJobber(input);
    }),

  update: t.procedure
    .input(JobberUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateJobber(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteJobber(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsJobber();
  }),
});
