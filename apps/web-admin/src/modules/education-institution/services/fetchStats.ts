import trpcClient from "@/libs/trpc-client";

export const fetchStatsEducationalInstitution = async () => {
  const res = await trpcClient.educationInstitution.fetchStats.query();
  return res;
};
