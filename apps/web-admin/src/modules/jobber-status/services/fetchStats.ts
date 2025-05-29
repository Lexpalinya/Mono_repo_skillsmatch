import trpcClient from "@/libs/trpc-client";

export const fetchStatsJobberStatus = async () => {
  const res = await trpcClient.jobberStatus.fetchStats.query();
  return res;
};
