import type { IMostPostionDtoType, IPostAdminDtoType, IPostStatsDtoType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IReportPostDialogType = "view" | "report" | null;

interface IReportPostContextType {
  open: IReportPostDialogType | null;
  setOpen: Dispatch<SetStateAction<IReportPostDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IPostAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IPostAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetPostState: (id?: string) => void;
  statsQuery: DefinedUseQueryResult<IPostStatsDtoType, Error>;
  query: Record<string, string>;
  tableQuery: DefinedUseQueryResult<
    { data: IPostAdminDtoType[]; total: number },
    Error
  >;
  tableQueryMosJobposition: DefinedUseQueryResult<
    { data: IMostPostionDtoType[] },
    Error
  >;
}

export const ReportPostContext = createContext<IReportPostContextType | null>(
  null
);
