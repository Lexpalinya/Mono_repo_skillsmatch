import { useState, type PropsWithChildren } from "react";
import { MajorContext, type IMajorDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IMajorAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { majorRoute } from "../router";
import { fetchAllMajor } from "../services/fetchAll";
import { fetchStatsMajor } from "../services/fetchStats";

const MajorProvider = ({ children }: PropsWithChildren) => {
  const navigate = majorRoute.useNavigate();
  const query = majorRoute.useSearch();

  const [open, setOpen] = useState<IMajorDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<IMajorAdminDtoType | null>(null);

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: majorRoute.path,
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
      fetchAllMajor({
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
    queryFn: () => fetchStatsMajor(),
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
    <MajorContext.Provider
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
    </MajorContext.Provider>
  );
};

export default MajorProvider;
