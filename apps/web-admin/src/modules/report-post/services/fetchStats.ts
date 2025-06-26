import trpcClient from "@/libs/trpc-client";

export const fetchStatsJobber = async () => {
  const res = await trpcClient.jobber.fetchStats.query();
  return res;
};
