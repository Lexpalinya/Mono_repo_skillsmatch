import type { IJobberAdminDtoType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";
export type IJobberDialogType = "add" | "view" | "edit" | null;

interface IJobberContextType {
  open: IJobberDialogType | null;
  setOpen: Dispatch<SetStateAction<IJobberDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IJobberAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IJobberAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetJobberState: (id?: string) => void;
  statsQuery: DefinedUseQueryResult<
    {
      status: number;
      total: number;
      active: number;
      verified: number;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IJobberAdminDtoType[]; total: number },
    Error
  >;
}

export const JobberContext = createContext<IJobberContextType | null>(null);
