import {
  CreateJobPosition,
  DeleteJobPosition,
  GetJobPosition,
  GetJobPositionById,
  GetStatsJobPosition,
  UpdateJobPosition,
} from "./service";
import {
  idDto,
  IIdDtoType,
  IJobPositionCreateDtoType,
  JobPositionCreateDto,
  JobPositionPaginationDto,
  JobPositionUpdateDto,
} from "@skillsmatch/dto";
import { t } from "../../lib/trpc";
export const jobPositionRouter = t.router({
  getAll: t.procedure
    .input(JobPositionPaginationDto)
    .query(async ({ input }) => {
      return GetJobPosition(input);
    }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetJobPositionById(input.id);
    }),

  create: t.procedure
    .input(JobPositionCreateDto)
    .mutation(async ({ input }: { input: IJobPositionCreateDtoType }) => {
      return CreateJobPosition(input);
    }),

  update: t.procedure
    .input(JobPositionUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateJobPosition(id, data);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteJobPosition(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetStatsJobPosition();
  }),
});
