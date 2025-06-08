import trpcClient from "@/libs/trpc-client";

export const skillComboboxService = async ({
  pageParam,
  limit,
  search,
}: {
  pageParam: number;
  limit: number;
  search: string;
}): Promise<{
  items: any[];
  nextOffset?: number;
}> => {
  const result = await trpcClient.skill.fetchSkillCombobox.query({
    offset: pageParam + 1,
    limit,
    search,
  });

  return {
    items: result,
    nextOffset: result.length === limit ? pageParam + 2 : undefined,
  };
};
