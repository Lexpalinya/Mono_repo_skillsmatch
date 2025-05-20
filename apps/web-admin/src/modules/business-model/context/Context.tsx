import type {
  IBusinessModelAdminDtoType,
  IBusinessModelStateDtoType,
} from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IBusinessModelDialogType = "add" | "edit" | "view" | null;
interface IBusinessModelContextType {
  open: IBusinessModelDialogType;
  setOpen: Dispatch<SetStateAction<IBusinessModelDialogType>>;

  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IBusinessModelAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IBusinessModelAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetState: () => void;
  statsQuery: DefinedUseQueryResult<
    { total: number; active: number; mostUsed: IBusinessModelStateDtoType },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IBusinessModelAdminDtoType[]; total: number },
    Error
  >;
}

export const BusinessModelContext =
  createContext<IBusinessModelContextType | null>(null);
