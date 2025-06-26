import { useMemo, useState, type PropsWithChildren } from "react";

import { useTableSearchParams } from "tanstack-table-search-params";
import type { IPostAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { reportpostRoute } from "../router";
import { ReportPostContext, type IReportPostDialogType } from "./Context";
import { fetchAllPost } from "@/modules/post/services/fetchAll";
import { fetchStatsPost } from "@/modules/post/services/fetchStats";
import { fetchMostJobpostion } from "../services/fetchMostJobpostion";

const ReportPostProvider = ({ children }: PropsWithChildren) => {
  const navigate = reportpostRoute.useNavigate();
  const query = reportpostRoute.useSearch();

  const [open, setOpen] = useState<IReportPostDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<IPostAdminDtoType | null>(null);

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: reportpostRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["statsPost"] });
    if (typeof id === "string")
      queryClient.invalidateQueries({ queryKey: ["postDetail", id] });
  };

  const resetPostState = (id?: string) => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache(id);
  };

  const tableQuery = useQuery({
    queryKey: [
      "listPost",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
      query.cIds,
      query.startDate,
      query.endDate,
    ],
    queryFn: () =>
      fetchAllPost({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
        cIds: query.cIds,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const tableQueryMosJobposition = useQuery({
    queryKey: [
      "listPost",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchMostJobpostion({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [] },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsPost"],
    queryFn: () => fetchStatsPost(),
    initialData: {
      total: 0,
      published: 0,
      verified: 0,
      hiring: 0,
    },
    placeholderData: keepPreviousData,
  });

  const contextValue = useMemo(
    () => ({
      query,
      open,
      setOpen,
      rowSelection,
      setRowSelection,
      selectedIds,
      setSelectedIds,
      currentRow,
      setCurrentRow,
      resetPostState,
      stateAndOnChanges,
      tableQuery,
      statsQuery,
      tableQueryMosJobposition
    }),
    [
      query,
      open,
      rowSelection,
      selectedIds,
      currentRow,
      resetPostState,
      stateAndOnChanges,
      tableQuery,
      statsQuery,
      tableQueryMosJobposition
    ]
  );

  return (
    <ReportPostContext.Provider value={contextValue}>
      {children}
    </ReportPostContext.Provider>
  );
};

export default ReportPostProvider;
