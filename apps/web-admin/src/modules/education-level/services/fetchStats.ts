import trpcClient from "@/libs/trpc-client";

export const fetchStatsEducationLevel = async () => {
  const res = await trpcClient.educationLevel.fetchStats.query();
  return res;
};
