import { useState, type PropsWithChildren } from "react";
import { BusinessModelContext, type IBusinessModelDialogType } from "./Context";
import type { IBusinessModelAdminDtoType } from "@skillsmatch/dto";
import { useTableSearchParams } from "tanstack-table-search-params";
import { URLSearchParams } from "url";

import { businessModelRoute } from "../router";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchAllBusinessModel } from "../service/fetchAll";

export const BusinessModelProvider = ({ children }: PropsWithChildren) => {
  const navigate = businessModelRoute.useNavigate();
  const query = businessModelRoute.useSearch();

  const [open, setOpen] = useState<IBusinessModelDialogType>(null);
  const [currentRow, setCurrentRow] =
    useState<IBusinessModelAdminDtoType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: businessModelRoute.path,
  });
  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["businessModelStats"] });
  };
  const resetState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };
  const tableQuery = useQuery({
    queryKey: [
      "businessModel",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllBusinessModel({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: {
      data: [],
      total: 0,
    },
    placeholderData: keepPreviousData,
  });
  const statsQuery = useQuery({
    queryKey: ["businessModelStats"],
    initialData: {
      total: 0,
      active: 0,
      mostUsed: { id: "", name: "", companyUsageCount: 0 },
    },
    placeholderData: keepPreviousData,
  });
  return (
    <BusinessModelContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        selectedIds,
        setSelectedIds,
        rowSelection,
        setRowSelection,
        stateAndOnChanges,
        tableQuery,
        resetState,
        statsQuery,
      }}
    >
      {children}
    </BusinessModelContext>
  );
};
