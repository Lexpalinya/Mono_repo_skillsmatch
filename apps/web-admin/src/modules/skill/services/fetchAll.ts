import trpcClient from "@/libs/trpc-client";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

interface FetchAllSkillParams {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState;
}
export const fetchAllSkill = async ({
  pagination,
  globalFilter,
  columnFilters,
  sorting,
}: FetchAllSkillParams) => {
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
    visible: visible === "" ? undefined : visible === "true",
  };

  const result = await trpcClient.skill.getAll.query(queryParams);

  return { data: result.data, total: result.total };
};
