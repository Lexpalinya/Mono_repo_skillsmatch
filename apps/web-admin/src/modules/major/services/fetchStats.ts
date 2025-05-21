import trpcClient from "@/libs/trpc-client";

export const fetchStatsMajor = async () => {
  const res = await trpcClient.major.fetchStats.query();
  return res;
};
