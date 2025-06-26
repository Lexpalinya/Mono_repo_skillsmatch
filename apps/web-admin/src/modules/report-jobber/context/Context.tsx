import type { IJobberAdminDtoType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";
export type IReportJobberDialogType = "report" | "view" | null;

interface IReportJobberContextType {
  open: IReportJobberDialogType | null;
  setOpen: Dispatch<SetStateAction<IReportJobberDialogType | null>>;
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
      notverified?:number;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IJobberAdminDtoType[]; total: number },
    Error
  >;
}

export const ReportJobberContext =
  createContext<IReportJobberContextType | null>(null);
