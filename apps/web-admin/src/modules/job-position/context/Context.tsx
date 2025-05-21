import type {
  IJobPositionAdminDtoType,
  IJobPositionStatsDtoType,
} from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IJobPositionDialogType = "add" | "view" | "edit" | null;

interface IJobPositionContextType {
  open: IJobPositionDialogType | null;
  setOpen: Dispatch<SetStateAction<IJobPositionDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IJobPositionAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IJobPositionAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetJobPositionState: () => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      mostUsedPost: IJobPositionStatsDtoType;
      mostUsedJobber: IJobPositionStatsDtoType;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IJobPositionAdminDtoType[]; total: number },
    Error
  >;
}

export const JobPositionContext = createContext<IJobPositionContextType | null>(null);
