import trpcClient from "@/libs/trpc-client";

export const fetchStatsReportCompany = async () => {
  const res = await trpcClient.company.fetchStats.query();
  return res;
};
