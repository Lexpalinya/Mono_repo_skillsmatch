import { useState, type PropsWithChildren } from "react";
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

const MajorProvider = ({ children }: PropsWithChildren) => {
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
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["statsMajor"] });
  };

  const resetMajorState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listMajor",
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
    queryKey: ["statsMajor"],
    queryFn: () => fetchStatsJobber(),
    initialData: {
      total: 0,
      active: 0,
       verified: 0;
      padding: 0;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <JobberContext.Provider
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetMajorState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </JobberContext.Provider>
  );
};

export default MajorProvider;
