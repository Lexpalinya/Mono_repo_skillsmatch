import { useState, type PropsWithChildren } from "react";

import { useTableSearchParams } from "tanstack-table-search-params";
import type { ISkillAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { fetchAllSkill } from "../services/fetchAll";
import { fetchStats } from "../services/fetchStats";
import { ReportSkillContext, type IReportSkillDialogType } from "./Context";
import { reportskillRoute } from "../router";

const ReportSkillProvider = ({ children }: PropsWithChildren) => {
  const navigate = reportskillRoute.useNavigate();
  const query = reportskillRoute.useSearch();

  const [open, setOpen] = useState<IReportSkillDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<ISkillAdminDtoType | null>(null);
  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: reportskillRoute.path,
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
      query.statusVisibility,
      query.startDate,
      query.endDate,
    ],
    queryFn: () =>
      fetchAllSkill({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
        statusVisibility: query.statusVisibility,
        startDate: query.startDate,
        endDate: query.endDate,
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
    <ReportSkillContext
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
    </ReportSkillContext>
  );
};
export default ReportSkillProvider;
