import { useMemo, useState } from "react";
import { SortingState, PaginationState } from "@tanstack/react-table";
import { parseTableStateFromQueryParams } from "../../lib/parseTableStateFromQueryParams";
import { useLocation } from "@tanstack/react-router";

export function useInitialTableStateFromQuery() {
  const { searchStr } = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(searchStr),
    [searchStr]
  );

  const initialState = useMemo(
    () => parseTableStateFromQueryParams(searchParams),
    [searchParams]
  );

  const [sorting, setSorting] = useState<SortingState>(initialState.sorting);
  const [pagination, setPagination] = useState<PaginationState>(
    initialState.pagination
  );
  const [globalFilter, setGlobalFilter] = useState<string | undefined>(
    initialState.globalFilter
  );

  return {
    sorting,
    setSorting,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
  };
}
