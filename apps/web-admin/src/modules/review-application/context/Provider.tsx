import { useMemo, useState, type PropsWithChildren } from "react";
import { ReViewApplicationContext } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import { reviewApplicationRoute } from "../router";
import type { IReviewAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchAllReviewApplication } from "../services/fetchAll";
import { fetchStatsReviewApplication } from "../services/fetchStats";
import type { RowSelectionState } from "@tanstack/react-table";

const ReViewApplicationProvider = ({ children }: PropsWithChildren) => {
  const navigate = reviewApplicationRoute.useNavigate();
  const query = reviewApplicationRoute.useSearch();

  const [open, setOpen] = useState<"add" | "view" | "edit" | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [currentRow, setCurrentRow] = useState<IReviewAdminDtoType | null>(
    null
  );

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: reviewApplicationRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["statsReviewApplication"] });
  };

  const resetReViewApplicationState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listReviewApplication",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllReviewApplication({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsReviewApplication"],
    queryFn: fetchStatsReviewApplication,
    initialData: {
      totalReviews: 0,
      averageRating: 0,
      recentReviews: 0,
      highRatingPercentage: 0,
      lowRatingPercentage: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      roleDistribution: {},
    },
    placeholderData: keepPreviousData,
    select: (data) => ({
      ...data,
      ratingDistribution: {
        1: data.ratingDistribution[1] ?? 0,
        2: data.ratingDistribution[2] ?? 0,
        3: data.ratingDistribution[3] ?? 0,
        4: data.ratingDistribution[4] ?? 0,
        5: data.ratingDistribution[5] ?? 0,
      },
    }),
  });

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      selectedIds,
      setSelectedIds,
      rowSelection,
      setRowSelection,
      currentRow,
      setCurrentRow,
      stateAndOnChanges,
      resetReViewApplicationState,
      tableQuery,
      statsQuery,
    }),
    [
      open,
      selectedIds,
      rowSelection,
      currentRow,
      stateAndOnChanges,
      tableQuery,
      statsQuery,
    ]
  );

  return (
    <ReViewApplicationContext.Provider value={contextValue}>
      {children}
    </ReViewApplicationContext.Provider>
  );
};

export default ReViewApplicationProvider;
