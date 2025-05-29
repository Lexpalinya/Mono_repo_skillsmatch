import { useState, type PropsWithChildren } from "react";
import { JobberStatusContext, type IJobberStatusDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IJobberStatusAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { jobberStatusRoute } from "../router";
import { fetchAllJobberStatus } from "../services/fetchAll";
import { fetchStatsJobberStatus } from "../services/fetchStats";

const JobberStatusProvider = ({ children }: PropsWithChildren) => {
  const navigate = jobberStatusRoute.useNavigate();
  const query = jobberStatusRoute.useSearch();

  const [open, setOpen] = useState<IJobberStatusDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] =
    useState<IJobberStatusAdminDtoType | null>(null);

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: jobberStatusRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["statsJobberStatus"] });
  };

  const resetJobberStatusState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listJobberStatus",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllJobberStatus({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsJobberStatus"],
    queryFn: () => fetchStatsJobberStatus(),
    initialData: {
      total: 0,
      active: 0,
      mostUsed: { id: "", name: "", jobberUsageCount: 0 },
    },
    placeholderData: keepPreviousData,
  });

  return (
    <JobberStatusContext.Provider
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetJobberStatusState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </JobberStatusContext.Provider>
  );
};

export default JobberStatusProvider;
