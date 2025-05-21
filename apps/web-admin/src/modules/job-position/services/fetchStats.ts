import trpcClient from "@/libs/trpc-client";

export const fetchStatsJobPosition = async () => {
  const res = await trpcClient.jobPosition.fetchStats.query();
  return res;
};
