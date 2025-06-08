import { z } from "zod";
import { QueryDto } from "../query/query.dto";

export const ReviewCreateDto = z.object({
  memberId: z.string().min(1, "memberId is required"),
  comment: z.string().min(1, "Comment is required"),
  score: z.number().int().min(1).max(5),
});

export const ReviewUpdateDto = z.object({
  comment: z.string().min(1, "Comment is required").optional(),
  score: z.number().int().min(1).max(5).optional(),
});

export const ReviewAdminDto = z.object({
  id: z.string(),
  member: z.object({
    username: z.string(),
    profile: z.string(),
    role: z.string(),
  }),
  memberId: z.string(),
  comment: z.string(),
  score: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ReviewPaginationDto = QueryDto.extend({
  memberId: z.string().optional(),
});
export const ReviewStatsDto = z.object({
  totalReviews: z.number().int().nonnegative(),
  averageRating: z.number().min(0).max(5),
  recentReviews: z.number().int().nonnegative(),
  highRatingPercentage: z.number().min(0).max(100),
  lowRatingPercentage: z.number().min(0).max(100),
  ratingDistribution: z.object({
    1: z.number().int().nonnegative(),
    2: z.number().int().nonnegative(),
    3: z.number().int().nonnegative(),
    4: z.number().int().nonnegative(),
    5: z.number().int().nonnegative(),
  }),
  roleDistribution: z.record(z.string(), z.number().int().nonnegative()),
});

export type IReviewStatsDtoType = z.infer<typeof ReviewStatsDto>;

export type IReviewCreateDtoType = z.infer<typeof ReviewCreateDto>;
export type IReviewUpdateDtoType = z.infer<typeof ReviewUpdateDto>;
export type IReviewAdminDtoType = z.infer<typeof ReviewAdminDto>;
export type IReviewPaginationDtoType = z.infer<typeof ReviewPaginationDto>;
