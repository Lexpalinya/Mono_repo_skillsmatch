import { z } from "zod";
import {
  CreateBusinessModel,
  DeleteBusinessModel,
  GetBusinessModel,
  GetBusinessModelById,
  GetStatsBusinessModel,
  UpdateBusinessModel,
} from "./service";
import {
  idDto,
  IIdDtoType,
  IBusinessModelCreateDtoType,
  BusinessModelCreateDto,
  BusinessModelUpdateDto,
  BusinessModelPaginationDto,
} from "@skillsmatch/dto";
import { t, router } from "../../lib/trpc";

export const businessModelRouter = router({
  getAll: t.procedure
    .input(BusinessModelPaginationDto)
    .query(async ({ input }) => {
      return GetBusinessModel(input);
    }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetBusinessModelById(input.id);
    }),

  create: t.procedure
    .input(BusinessModelCreateDto)
    .mutation(async ({ input }: { input: IBusinessModelCreateDtoType }) => {
      return CreateBusinessModel(input);
    }),

  update: t.procedure
    .input(BusinessModelUpdateDto.extend(idDto.shape))
    .mutation(
      async ({
        input,
      }: {
        input: z.infer<typeof BusinessModelUpdateDto> & IIdDtoType;
      }) => {
        const { id, ...data } = input;
        return UpdateBusinessModel(id, data);
      }
    ),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteBusinessModel(input.id);
    }),
  fetchStats: t.procedure.query(async () => {
    return GetStatsBusinessModel();
  }),
});
