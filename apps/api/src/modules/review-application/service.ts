import {
  IReviewCreateDtoType,
  IReviewUpdateDtoType,
  IReviewPaginationDtoType,
} from "@skillsmatch/dto";
import prisma from "../../lib/prisma-client";
import { ensureRecordExists } from "../../utils/ensure";
import { queryTable } from "../../utils/pagination";

export const CreateReview = async (data: IReviewCreateDtoType) => {
  await ensureRecordExists({
    table: "member",
    column: "id",
    value: data.memberId,
  });
  const review = await prisma.review.create({ data });
  return review;
};

export const UpdateReview = async (id: string, data: IReviewUpdateDtoType) => {
  try {
    const review = await prisma.review.update({
      where: { id },
      data,
    });

    return review;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const DeleteReview = async (id: string) => {
  const review = await prisma.review.delete({
    where: { id },
  });
  return review;
};

export const GetReviewById = async (id: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: { id },
  });
  return review;
};

export const GetReviews = async ({
  page,
  limit,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  memberId,
}: IReviewPaginationDtoType) => {
  try {
    const where: any = {};
    if (memberId) where.memberId = memberId;
    if (search)
      where.comment = {
        contains: search,
        mode: "insensitive",
      };

    const items = await queryTable("review", {
      page,
      limit,
      where,
      select: {
        id: true,
        comment: true,
        score: true,
        createdAt: true,
        member: {
          select: {
            username: true,
            profile: true,
            role: true,
          },
        },
        updatedAt: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return items;
  } catch (error) {
    throw error;
  }
};

export const GetReviewStats = async () => {
  // Total number of reviews
  const totalReviews = await prisma.review.count();

  // Average score (rating)
  const avgResult = await prisma.review.aggregate({
    _avg: { score: true },
  });
  const averageRating = avgResult._avg.score ?? 0;

  // Number of recent reviews (e.g. last 30 days)
  const recentReviews = await prisma.review.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
    },
  });

  // Rating distribution (count of each score 1 to 5)
  const ratingDistributionRaw = await prisma.review.groupBy({
    by: ["score"],
    _count: { score: true },
  });

  // Convert groupBy result to full distribution object with keys 1 to 5
  const ratingDistribution = [1, 2, 3, 4, 5].reduce(
    (acc, score) => {
      const found = ratingDistributionRaw.find((r) => r.score === score);
      acc[score] = found?._count.score ?? 0;
      return acc;
    },
    {} as Record<number, number>
  );

  // High rating percentage (e.g. percentage of scores >=4)
  const highRatingCount = ratingDistribution[4] + ratingDistribution[5];
  const highRatingPercentage = totalReviews
    ? (highRatingCount / totalReviews) * 100
    : 0;

  // Low rating percentage (e.g. percentage of scores <=2)
  const lowRatingCount = ratingDistribution[1] + ratingDistribution[2];
  const lowRatingPercentage = totalReviews
    ? (lowRatingCount / totalReviews) * 100
    : 0;

  // Role distribution (example: count reviews by member role)
  // Assuming you have Member model with a role field:
  const roleGroups = await prisma.review.groupBy({
    by: ["memberId"],
    _count: { memberId: true },
  });
  // You might want to join member roles, here's a simple example:
  const roleCounts: Record<string, number> = {};

  // For demo, fetch all members with their roles by IDs:
  const memberIds = roleGroups.map((r) => r.memberId);
  const members = await prisma.member.findMany({
    where: { id: { in: memberIds } },
    select: { id: true, role: true },
  });

  members.forEach((member) => {
    const count =
      roleGroups.find((r) => r.memberId === member.id)?._count.memberId ?? 0;
    if (member.role) {
      roleCounts[member.role] = (roleCounts[member.role] ?? 0) + count;
    }
  });

  return {
    totalReviews,
    averageRating,
    recentReviews,
    highRatingPercentage,
    lowRatingPercentage,
    ratingDistribution,
    roleDistribution: roleCounts,
  };
};
