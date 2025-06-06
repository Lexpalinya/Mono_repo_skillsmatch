import { useMemo, useState, type PropsWithChildren } from "react";
import { JobberContext, type IJobberDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IJobberAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { jobberRoute } from "../router";
import { fetchStatsJobber } from "../services/fetchStats";
import { fetchAllJobber } from "../services/fetchAll";

const JobberProvider = ({ children }: PropsWithChildren) => {
  const navigate = jobberRoute.useNavigate();
  const query = jobberRoute.useSearch();

  const [open, setOpen] = useState<IJobberDialogType | null>(null);
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
    pathname: jobberRoute.path,
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
    ],
    queryFn: () =>
      fetchAllJobber({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
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
    <JobberContext.Provider value={contextValue}>
      {children}
    </JobberContext.Provider>
  );
};

export default JobberProvider;
