import { SortingState, PaginationState } from "@tanstack/react-table";

export function parseTableStateFromQueryParams(searchParams: URLSearchParams): {
  globalFilter?: string;
  sorting: SortingState;
  pagination: PaginationState;
} {
  const globalFilter = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sort_by");
  const sortOrder = searchParams.get("sort_order");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // const columnFilters: ColumnFiltersState = []

  // if (role) columnFilters.push({ id: 'role', value: role })
  // if (status) columnFilters.push({ id: 'status', value: status })

  const sorting: SortingState = [];
  if (sortBy) {
    sorting.push({ id: sortBy, desc: sortOrder === "desc" });
  }

  const pagination: PaginationState = {
    pageIndex: Math.max(page - 1, 0),
    pageSize: limit,
  };

  return {
    globalFilter,
    sorting,
    pagination,
  };
}