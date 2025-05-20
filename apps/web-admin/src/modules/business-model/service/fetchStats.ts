import trpcClient from "@/libs/trpc-client";

export const fetchStats = async () => {
  const res = await trpcClient.businessModel.fetchStats.query();
  return res;
};
