import {
  idDto,
  ReviewCreateDto,
  ReviewUpdateDto,
  ReviewPaginationDto,
  IReviewCreateDtoType,
  IReviewUpdateDtoType,
  IIdDtoType,
} from "@skillsmatch/dto";

import {
  CreateReview,
  DeleteReview,
  GetReviewById,
  GetReviews,
  UpdateReview,
  GetReviewStats,
} from "./service";

import { t } from "../../lib/trpc";

export const reviewRouter = t.router({
  getAll: t.procedure.input(ReviewPaginationDto).query(async ({ input }) => {
    return GetReviews(input);
  }),

  getById: t.procedure
    .input(idDto)
    .query(async ({ input }: { input: IIdDtoType }) => {
      return GetReviewById(input.id);
    }),

  create: t.procedure
    .input(ReviewCreateDto)
    .mutation(async ({ input }: { input: IReviewCreateDtoType }) => {
      return CreateReview(input);
    }),

  update: t.procedure
    .input(ReviewUpdateDto.extend(idDto.shape))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return UpdateReview(id, data as IReviewUpdateDtoType);
    }),

  delete: t.procedure
    .input(idDto)
    .mutation(async ({ input }: { input: IIdDtoType }) => {
      return DeleteReview(input.id);
    }),

  fetchStats: t.procedure.query(async () => {
    return GetReviewStats();
  }),
});
