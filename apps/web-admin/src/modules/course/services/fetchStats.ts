import trpcClient from "@/libs/trpc-client";

export const fetchStatsCourse = async () => {
  const res = await trpcClient.course.fetchStats.query();
  return res;
};
