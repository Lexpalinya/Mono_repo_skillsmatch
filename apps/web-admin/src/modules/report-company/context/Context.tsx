import type { ICompanyAdminDataType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IreportcompanyDialogType = "report" | "view" | null;

interface IreportCompanyContextType {
  open: IreportcompanyDialogType | null;
  setOpen: Dispatch<SetStateAction<IreportcompanyDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: ICompanyAdminDataType | null;
  setCurrentRow: Dispatch<SetStateAction<ICompanyAdminDataType | null>>;
  stateAndOnChanges: Returns;
  resetCompanyState: (id?: string) => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      verified: number;
      notverified?: number;
    },
    Error
  >;
  query: Record<string, string>;
  tableQuery: DefinedUseQueryResult<
    { data: ICompanyAdminDataType[]; total: number },
    Error
  >;
}

export const ReportCompanyContext = createContext<IreportCompanyContextType | null>(null);