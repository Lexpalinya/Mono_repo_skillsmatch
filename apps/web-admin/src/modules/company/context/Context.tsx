import type { ICompanyAdminViewDtoType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type ICompanyDialogType = "add" | "view" | "edit" | "verified" | null;

interface ICompanyContextType {
  open: ICompanyDialogType | null;
  setOpen: Dispatch<SetStateAction<ICompanyDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: ICompanyAdminViewDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<ICompanyAdminViewDtoType | null>>;
  stateAndOnChanges: Returns;
  resetCompanyState: (id?: string) => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      verified: number;
      hiring: number;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: ICompanyAdminViewDtoType[]; total: number },
    Error
  >;
}

export const CompanyContext = createContext<ICompanyContextType | null>(null);
