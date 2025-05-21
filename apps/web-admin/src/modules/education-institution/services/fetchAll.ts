import trpcClient from "@/libs/trpc-client";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface FetchAllEducationalInstitutionParams {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState;
}

export const fetchAllEducationalInstitution = async ({
  pagination,
  globalFilter,
  columnFilters,
  sorting,
}: FetchAllEducationalInstitutionParams) => {
  const getColumnFilterValue = (id: string, defaultValue: string) =>
    (columnFilters.find((filter) => filter.id === id)?.value as string) ||
    defaultValue;

  const visible = getColumnFilterValue("visible", "");
  const queryParams = {
    search: globalFilter || "",
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? ("desc" as const) : ("asc" as const),
    visible: visible === "" ? undefined : visible === "true" ? true : false,
  };

  // เรียก API ของ educationalInstitution แทน course
  const result = await trpcClient.educationInstitution.getAll.query(queryParams);
  return { data: result.data, total: result.total };
};
