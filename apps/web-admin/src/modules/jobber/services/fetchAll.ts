import trpcClient from "@/libs/trpc-client";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface FetchAllJobberParams {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState;
}

export const fetchAllJobber = async ({
  pagination,
  globalFilter,
  columnFilters,
  sorting,
}: FetchAllJobberParams) => {
  const getColumnFilterValue = (id: string, defaultValue: string) =>
    (columnFilters.find((filter) => filter.id === id)?.value as string) ||
    defaultValue;
  const status = getColumnFilterValue("status", "");

  const queryParams = {
    search: globalFilter || "",
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? ("desc" as const) : ("asc" as const),
    status,
  };

  const result = await trpcClient.jobber.getAll.query(queryParams);
  return { data: result.data, total: result.total };
};
