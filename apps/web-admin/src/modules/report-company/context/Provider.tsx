import { useMemo, useState, type PropsWithChildren } from "react";
import { reportCompanyRoute } from "../router";
import type { ICompanyAdminDataType } from "@skillsmatch/dto";
import { useTableSearchParams } from "tanstack-table-search-params";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ReportCompanyContext, type IreportcompanyDialogType } from "./Context";
import { fetchStatsReportCompany } from "../services/fetchStats";
import { fetchAllReportCompany } from "../services/fetchAll";

const ReportCompanyProvider = ({ children }: PropsWithChildren) => {
  const navigate = reportCompanyRoute.useNavigate();
  const query = reportCompanyRoute.useSearch();

  const [open, setOpen] = useState<IreportcompanyDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<ICompanyAdminDataType | null>(
    null
  );

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: reportCompanyRoute.path,
  });

  const queryClient = useQueryClient();

  const handleResetCache = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["statusCompany"] });
    if (typeof id === "string") {
      queryClient.invalidateQueries({ queryKey: ["companyDetail", id] });
    }
  };

  const resetCompanyState = (id?: string) => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache(id);
  };

  const tableQuery = useQuery({
    queryKey: [
      "listCompany",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
      query.bmIds,
      query.status,
      query.startDate,
      query.endDate,
    ],
    queryFn: () =>
      fetchAllReportCompany({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
        bmIds: query.bmIds,
        status: query.status,
        startDate: query.startDate,
        endDate: query.endDate,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsCompany"],
    queryFn: () => fetchStatsReportCompany(),
    initialData: {
      total: 0,
      active: 0,
      verified: 0,
      status: 0,
      notverified: 0
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
      resetCompanyState,
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
      resetCompanyState,
      stateAndOnChanges,
      tableQuery,
      statsQuery,
    ]
  );

  return (
    <ReportCompanyContext.Provider value={contextValue}>
      {children}
    </ReportCompanyContext.Provider>
  );
};

export default ReportCompanyProvider;
