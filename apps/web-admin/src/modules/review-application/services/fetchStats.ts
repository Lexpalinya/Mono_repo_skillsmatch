import trpcClient from "@/libs/trpc-client";

export const fetchStatsReviewApplication = async () => {
  const res = await trpcClient.review.fetchStats.query();
  return res;
};
