import trpcClient from "@/libs/trpc-client";
import type { IPostPaginationDtoType } from "@skillsmatch/dto";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
interface FetchAllPostParams {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState;
  cIds: string[] | undefined;
}
export const fetchAllPost = async ({
  pagination,
  globalFilter,
  sorting,
  cIds,
}: FetchAllPostParams) => {
  const queryParams: IPostPaginationDtoType = {
    search: globalFilter || "",
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? ("desc" as const) : ("asc" as const),
    cIds: Array.isArray(cIds) && cIds.length === 0 ? undefined : cIds,
  };
  const result = await trpcClient.post.getAll.query(queryParams);
  return { data: result.data, total: result.total };
};
