import { useState, type PropsWithChildren } from "react";
import { JobPositionContext, type IJobPositionDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IJobPositionAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { jobPositionRoute } from "../router";
import { fetchAllJobPosition } from "../services/fetchAll";
import { fetchStatsJobPosition } from "../services/fetchStats";

const JobPositionProvider = ({ children }: PropsWithChildren) => {
  const navigate = jobPositionRoute.useNavigate();
  const query = jobPositionRoute.useSearch();

  const [open, setOpen] = useState<IJobPositionDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<IJobPositionAdminDtoType | null>(null);

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: jobPositionRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["statsJobPosition"] });
  };

  const resetJobPositionState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listJobPosition",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllJobPosition({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsJobPosition"],
    queryFn: () => fetchStatsJobPosition(),
    initialData: {
      total: 0,
      active: 0,
      mostUsedPost: {
        id: "",
        name: "",
        postUsageCount: 0,
        jobberUsageCount: 0,
      },
      mostUsedJobber: {
        id: "",
        name: "",
        postUsageCount: 0,
        jobberUsageCount: 0,
      },
    },
    placeholderData: keepPreviousData,
  });

  return (
    <JobPositionContext.Provider
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetJobPositionState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </JobPositionContext.Provider>
  );
};

export default JobPositionProvider;
