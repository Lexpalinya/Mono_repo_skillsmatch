import { useMemo, useState, type PropsWithChildren } from "react";

import { useTableSearchParams } from "tanstack-table-search-params";
import type { IJobberAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ReportJobberContext, type IReportJobberDialogType } from "./Context";
import { reportjobberRoute } from "../router";
import { fetchAllJobber } from "../services/fetchAll";
import { fetchStatsJobber } from "../services/fetchStats";

const ReportJobberProvider = ({ children }: PropsWithChildren) => {
  const navigate = reportjobberRoute.useNavigate();
  const query = reportjobberRoute.useSearch();

  const [open, setOpen] = useState<IReportJobberDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<IJobberAdminDtoType | null>(
    null
  );

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: reportjobberRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["statsJobber"] });
    if (typeof id === "string")
      queryClient.invalidateQueries({ queryKey: ["jobberDetail", id] });
  };

  const resetJobberState = (id?: string) => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache(id);
  };

  const tableQuery = useQuery({
    queryKey: [
      "listJobber",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
      query.statusVerify,
      query.startDate,
      query.endDate,
    ],
    queryFn: () =>
      fetchAllJobber({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
        statusVerify: query.statusVerify,
        startDate: query.startDate,
        endDate: query.endDate,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsJobber"],
    queryFn: () => fetchStatsJobber(),
    initialData: {
      total: 0,
      active: 0,
      verified: 0,
      status: 0,
      notverified: 0,
    },
    placeholderData: keepPreviousData,
  });

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      rowSelection,
      setRowSelection,
      selectedIds,
      setSelectedIds,
      currentRow,
      setCurrentRow,
      resetJobberState,
      stateAndOnChanges,
      tableQuery,
      statsQuery,
    }),
    [
      open,
      rowSelection,
      selectedIds,
      currentRow,
      resetJobberState,
      stateAndOnChanges,
      tableQuery,
      statsQuery,
    ]
  );

  return (
    <ReportJobberContext.Provider value={contextValue}>
      {children}
    </ReportJobberContext.Provider>
  );
};

export default ReportJobberProvider;
