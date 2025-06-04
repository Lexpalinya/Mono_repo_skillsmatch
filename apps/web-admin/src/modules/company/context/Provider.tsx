import { useState, type PropsWithChildren } from "react";
import { CompanyContext, type ICompanyDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { ICompanyAdminViewDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { companyRoute } from "../router";
import { fetchStatsCompany } from "../services/fetchStats";
import { fetchAllCompany } from "../services/fetchAll";

const CompanyProvider = ({ children }: PropsWithChildren) => {
  const navigate = companyRoute.useNavigate();
  const query = companyRoute.useSearch();

  const [open, setOpen] = useState<ICompanyDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<ICompanyAdminViewDtoType | null>(
    null
  );

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: companyRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["statsCompany"] });
    if (typeof id === "string")
      queryClient.invalidateQueries({ queryKey: ["companyDetail", id] });
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
    ],
    queryFn: () =>
      fetchAllCompany({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsCompany"],
    queryFn: () => fetchStatsCompany(),
    initialData: {
      total: 0,
      active: 0,
      verified: 0,
      hiring: 0,
    },
    placeholderData: keepPreviousData,
  });

  return (
    <CompanyContext.Provider
      value={{
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
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
