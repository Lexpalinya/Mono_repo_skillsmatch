import { useState, type PropsWithChildren } from "react";
import {
  EducationalInstitutionContext,
  type IEducationalInstitutionDialogType,
} from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { IEducationalInstitutionAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { educationalInstitutionRoute } from "../router";
import { fetchAllEducationalInstitution } from "../services/fetchAll";
import { fetchStatsEducationalInstitution } from "../services/fetchStats";

const EducationalInstitutionProvider = ({ children }: PropsWithChildren) => {
  const navigate = educationalInstitutionRoute.useNavigate();
  const query = educationalInstitutionRoute.useSearch();

  const [open, setOpen] = useState<IEducationalInstitutionDialogType | null>(
    null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] =
    useState<IEducationalInstitutionAdminDtoType | null>(null);

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: educationalInstitutionRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({
      queryKey: ["statsEducationalInstitution"],
    });
  };

  const resetEducationalInstitutionState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listEducationalInstitution",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllEducationalInstitution({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsEducationalInstitution"],
    queryFn: () => fetchStatsEducationalInstitution(),
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
    <EducationalInstitutionContext.Provider
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetEducationalInstitutionState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </EducationalInstitutionContext.Provider>
  );
};

export default EducationalInstitutionProvider;
