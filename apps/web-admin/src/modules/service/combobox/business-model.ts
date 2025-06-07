import trpcClient from "@/libs/trpc-client";

export const businessModelComboboxService = async ({
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
  const result =
    await trpcClient.businessModel.fetchBusinessStatusCombobox.query({
      offset: pageParam + 1,
      limit,
      search,
    });

  return {
    items: result,
    nextOffset: result.length === limit ? pageParam + 2 : undefined,
  };
};
