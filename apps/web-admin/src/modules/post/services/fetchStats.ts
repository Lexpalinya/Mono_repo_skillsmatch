import trpcClient from "@/libs/trpc-client";

export const fetchStatsPost = async () => {
  const res = await trpcClient.post.fetchStats.query();
  return res;
};
