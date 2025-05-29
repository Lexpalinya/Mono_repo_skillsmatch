import type {
  IJobberStatusAdminDtoType,
  IJobberStatusStatsDtoType,
} from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IJobberStatusDialogType = "add" | "view" | "edit" | null;

interface IJobberStatusContextType {
  open: IJobberStatusDialogType | null;
  setOpen: Dispatch<SetStateAction<IJobberStatusDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IJobberStatusAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IJobberStatusAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetJobberStatusState: () => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      mostUsed: IJobberStatusStatsDtoType;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IJobberStatusAdminDtoType[]; total: number },
    Error
  >;
}

export const JobberStatusContext =
  createContext<IJobberStatusContextType | null>(null);
