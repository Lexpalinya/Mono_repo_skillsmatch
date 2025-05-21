import { useState, type PropsWithChildren } from "react";
import { CourseContext, type ICourseDialogType } from "./Context";
import { useTableSearchParams } from "tanstack-table-search-params";
import type { ICourseAdminDtoType } from "@skillsmatch/dto";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { courseRoute } from "../router";
import { fetchAllCourse } from "../services/fetchAll";
import { fetchStatsCourse } from "../services/fetchStats";

const CourseProvider = ({ children }: PropsWithChildren) => {
  const navigate = courseRoute.useNavigate();
  const query = courseRoute.useSearch();

  const [open, setOpen] = useState<ICourseDialogType | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [currentRow, setCurrentRow] = useState<ICourseAdminDtoType | null>(
    null
  );

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: courseRoute.path,
  });

  const queryClient = useQueryClient();
  const handleResetCache = () => {
    queryClient.invalidateQueries({ queryKey: ["statsCourse"] });
  };

  const resetCourseState = () => {
    setOpen(null);
    setCurrentRow(null);
    setRowSelection({});
    setSelectedIds([]);
    handleResetCache();
  };

  const tableQuery = useQuery({
    queryKey: [
      "listCourse",
      stateAndOnChanges.state.columnFilters,
      stateAndOnChanges.state.globalFilter,
      stateAndOnChanges.state.pagination,
      stateAndOnChanges.state.sorting,
    ],
    queryFn: () =>
      fetchAllCourse({
        columnFilters: stateAndOnChanges.state.columnFilters,
        globalFilter: stateAndOnChanges.state.globalFilter,
        pagination: stateAndOnChanges.state.pagination,
        sorting: stateAndOnChanges.state.sorting,
      }),
    initialData: { data: [], total: 0 },
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: ["statsCourse"],
    queryFn: () => fetchStatsCourse(),
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
    <CourseContext
      value={{
        open,
        setOpen,
        rowSelection,
        setRowSelection,
        selectedIds,
        setSelectedIds,
        currentRow,
        setCurrentRow,
        resetCourseState,
        stateAndOnChanges,
        tableQuery,
        statsQuery,
      }}
    >
      {children}
    </CourseContext>
  );
};

export default CourseProvider;
