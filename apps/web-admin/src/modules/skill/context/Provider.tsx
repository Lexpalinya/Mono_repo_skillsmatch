import { useState, type PropsWithChildren } from "react";
import { SkillContext, type ISkillDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { ISkillAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { skillRoute } from "../router";
import { fetchAllSkill } from "../services/fetchAll";
import { fetchStats } from "../services/fetchStats";

const SkillProvider = ({ children }: PropsWithChildren) => {
  const navigate = skillRoute.useNavigate();
  const query = skillRoute.useSearch();

  const [open, setOpen] = useState<ISkillDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<ISkillAdminDtoType | null>(null);
  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: skillRoute.path,
  });
  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["statsSkill"] });
  };
  const resetSkillState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listSkill",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllSkill({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsSkill"],
    queryFn: () => fetchStats(),
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
    <SkillContext
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetSkillState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </SkillContext>
  );
};
export default SkillProvider;
