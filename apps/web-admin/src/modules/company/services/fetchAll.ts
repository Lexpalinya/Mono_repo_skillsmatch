import trpcClient from "@/libs/trpc-client";
import type { ICompanyPaginationDtoType } from "@skillsmatch/dto";
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
  bmIds?: string[] | undefined;
}

export const fetchAllCompany = async ({
  pagination,
  globalFilter,
  columnFilters,
  sorting,
  bmIds,
}: FetchAllJobberParams) => {
  const queryParams: ICompanyPaginationDtoType = {
    search: globalFilter || "",
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? ("desc" as const) : ("asc" as const),
    bmIds: Array.isArray(bmIds) && bmIds.length === 0 ? undefined : bmIds,
  };

  const result = await trpcClient.company.getAll.query(queryParams);
  return { data: result.data, total: result.total };
};
