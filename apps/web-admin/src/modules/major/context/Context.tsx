import type {
  IMajorAdminDtoType,
  IMajorStatsDtoType,
} from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IMajorDialogType = "add" | "view" | "edit" | null;

interface IMajorContextType {
  open: IMajorDialogType | null;
  setOpen: Dispatch<SetStateAction<IMajorDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IMajorAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IMajorAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetMajorState: () => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      mostUsedPost: IMajorStatsDtoType;
      mostUsedJobber: IMajorStatsDtoType;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IMajorAdminDtoType[]; total: number },
    Error
  >;
}

export const MajorContext = createContext<IMajorContextType | null>(null);
