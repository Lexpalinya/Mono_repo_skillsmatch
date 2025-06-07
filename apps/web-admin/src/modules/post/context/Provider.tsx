import { useMemo, useState, type PropsWithChildren } from "react";
import { PostContext, type IPostDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IPostAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { postRoute } from "../router";
import { fetchStatsPost } from "../services/fetchStats";
import { fetchAllPost } from "../services/fetchAll";

const PostProvider = ({ children }: PropsWithChildren) => {
  const navigate = postRoute.useNavigate();
  const query = postRoute.useSearch();

  const [open, setOpen] = useState<IPostDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<IPostAdminDtoType | null>(null);

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: postRoute.path,
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
    ]
  );

  return (
    <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
  );
};

export default PostProvider;
