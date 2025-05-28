import type { IMemberAdminDtoType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IMemberDialogType = "add" | "view" | "edit" | null;

interface IMemberContextType {
  open: IMemberDialogType | null;
  setOpen: Dispatch<SetStateAction<IMemberDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IMemberAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IMemberAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetMemberState: (id?: string) => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      jobber: number;
      company: number;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IMemberAdminDtoType[]; total: number },
    Error
  >;
}

export const MemberContext = createContext<IMemberContextType | null>(null);
