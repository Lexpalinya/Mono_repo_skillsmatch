import type {
  ICourseAdminDtoType,
  ICourseStatsDtoType,
} from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type ICourseDialogType = "add" | "view" | "edit" | null;

interface ICourseContextType {
  open: ICourseDialogType | null;
  setOpen: Dispatch<SetStateAction<ICourseDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: ICourseAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<ICourseAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetCourseState: () => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      mostUsedPost: ICourseStatsDtoType;
      mostUsedJobber: ICourseStatsDtoType;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: ICourseAdminDtoType[]; total: number },
    Error
  >;
}

export const CourseContext = createContext<ICourseContextType | null>(null);
