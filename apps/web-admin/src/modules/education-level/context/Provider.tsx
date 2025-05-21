import { useState, type PropsWithChildren } from "react";
import { EducationLevelContext, type IEducationLevelDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IEducationLevelAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { educationLevelRoute } from "../router";  // สมมติว่าคุณมี router สำหรับ EducationLevel
import { fetchAllEducationLevel } from "../services/fetchAll";
import { fetchStatsEducationLevel } from "../services/fetchStats";

const EducationLevelProvider = ({ children }: PropsWithChildren) => {
  const navigate = educationLevelRoute.useNavigate();
  const query = educationLevelRoute.useSearch();

  const [open, setOpen] = useState<IEducationLevelDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<IEducationLevelAdminDtoType | null>(null);

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: educationLevelRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["statsEducationLevel"] });
  };

  const resetEducationLevelState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listEducationLevel",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllEducationLevel({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsEducationLevel"],
    queryFn: () => fetchStatsEducationLevel(),
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
    <EducationLevelContext.Provider
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetEducationLevelState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </EducationLevelContext.Provider>
  );
};

export default EducationLevelProvider;
