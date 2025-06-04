import trpcClient from "@/libs/trpc-client";

export const fetchStatsCompany = async () => {
  const res = await trpcClient.company.fetchStats.query();
  return res;
};
