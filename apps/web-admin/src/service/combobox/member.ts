import trpcClient from "@/libs/trpc-client";

export const memberJobberComboboxService = async ({
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
  const result = await trpcClient.member.fetchMemberCombobox.query({
    offset: pageParam + 1,
    limit,
    search,
    role: "jobber",
  });

  return {
    items: result,
    nextOffset: result.length === limit ? pageParam + 2 : undefined,
  };
};

export const memberCompanyComboboxService = async ({
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
  const result = await trpcClient.member.fetchMemberCombobox.query({
    offset: pageParam + 1,
    limit,
    search,
    role: "company",
  });

  return {
    items: result,
    nextOffset: result.length === limit ? pageParam + 2 : undefined,
  };
};

export const memberComboboxService = async ({
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
  const result = await trpcClient.member.fetchMemberCombobox.query({
    offset: pageParam + 1,
    limit,
    search,
  });

  return {
    items: result,
    nextOffset: result.length === limit ? pageParam + 2 : undefined,
  };
};
