import trpcClient from "@/libs/trpc-client";
import type { IMemberStatsDtoType } from "@skillsmatch/dto";

export const fetchStatsMember = async ():Promise<IMemberStatsDtoType> => {
  const res = await trpcClient.member.fetchStats.query();
  const typedRes: IMemberStatsDtoType = {
    total: res.total || 0,
    active: res.active || 0,
    jobber: res.jobber || 0,
    company: res.company || 0,
  };
  return typedRes;
};
