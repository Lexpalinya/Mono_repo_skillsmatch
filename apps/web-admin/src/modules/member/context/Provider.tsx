import { useState, type PropsWithChildren } from "react";
import { MemberContext, type IMemberDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IMemberAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { fetchStatsMember } from "../services/fetchStats";
import { memberRoute } from "../router";
import { fetchAllMember } from "../services/fetchAll";

const MemberProvider = ({ children }: PropsWithChildren) => {
  const navigate = memberRoute.useNavigate();
  const query = memberRoute.useSearch();

  const [open, setOpen] = useState<IMemberDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<IMemberAdminDtoType | null>(
    null
  );

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: memberRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["statsMember"] });
    if (typeof id === "string")
      queryClient.invalidateQueries({ queryKey: ["memberDetail", id] });
  };

  const resetMemberState = (id?: string) => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache(id);
  };

  const tableQuery = useQuery({
    queryKey: [
      "listMember",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllMember({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsMember"],
    queryFn: () => fetchStatsMember(),
    initialData: { total: 0, active: 0, jobber: 0, company: 0 },
    placeholderData: keepPreviousData,
  });

  return (
    <MemberContext.Provider
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetMemberState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider;
