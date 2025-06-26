import trpcClient from "@/libs/trpc-client";

export const fetchStats = async () => {
  const res = await trpcClient.skill.fetchStats.query();
  return res;
};
