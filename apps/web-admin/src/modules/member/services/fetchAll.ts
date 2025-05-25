import trpcClient from "@/libs/trpc-client";
import type { IMemberPaginationDtoType } from "@skillsmatch/dto";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface FetchAllMemberParams {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState;
}

export const fetchAllMember = async ({
  pagination,
  globalFilter,
  columnFilters,
  sorting,
}: FetchAllMemberParams) => {
  const getColumnFilterValue = (id: string, defaultValue: string) =>
    (columnFilters.find((filter) => filter.id === id)?.value as string) ||
    defaultValue;

  const role = getColumnFilterValue("role", "all") as
    | "company"
    | "admin"
    | "jobber"
    | "all";
  const queryParams: IMemberPaginationDtoType = {
    search: globalFilter || "",
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? ("desc" as const) : ("asc" as const),
    role: role === "all" ? undefined : role,
  };

  const result = await trpcClient.member.getAll.query(queryParams);
  return { data: result.data, total: result.total };
};
