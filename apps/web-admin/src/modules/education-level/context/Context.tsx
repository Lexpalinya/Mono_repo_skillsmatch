import type {
  IEducationLevelAdminDtoType,
  IEducationLevelStatsDtoType,
} from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IEducationLevelDialogType = "add" | "view" | "edit" | null;

interface IEducationLevelContextType {
  open: IEducationLevelDialogType | null;
  setOpen: Dispatch<SetStateAction<IEducationLevelDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IEducationLevelAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IEducationLevelAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetEducationLevelState: () => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      mostUsedPost: IEducationLevelStatsDtoType;
      mostUsedJobber: IEducationLevelStatsDtoType;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IEducationLevelAdminDtoType[]; total: number },
    Error
  >;
}

export const EducationLevelContext = createContext<IEducationLevelContextType | null>(null);
