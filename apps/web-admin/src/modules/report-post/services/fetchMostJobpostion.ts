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
  startDate?: string;
  endDate?: string;
}
export const fetchMostJobpostion = async ({
  pagination,
  globalFilter,
  sorting,
  startDate,
  endDate
}: FetchAllPostParams) => {
  const queryParams: IPostPaginationDtoType = {
    search: globalFilter || "",
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? ("desc" as const) : ("asc" as const),
    startDate: startDate || "",
    endDate: endDate || "",
  };
  const result = await trpcClient.post.getMostPostion.query(queryParams);
  return { data: result };
};
