import type { UseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import type {
  IReviewAdminDtoType,
  IReviewStatsDtoType,
} from "@skillsmatch/dto";
import { createContext } from "react";
import type { Returns } from "tanstack-table-search-params";

export interface IReViewApplicationContextType {
  open: "add" | "view" | "edit" | null;
  setOpen: React.Dispatch<React.SetStateAction<"add" | "view" | "edit" | null>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  currentRow: IReviewAdminDtoType | null;
  setCurrentRow: React.Dispatch<
    React.SetStateAction<IReviewAdminDtoType | null>
  >;
  stateAndOnChanges: Returns;
  resetReViewApplicationState: () => void;
  tableQuery: UseQueryResult<
    { data: IReviewAdminDtoType[]; total: number },
    unknown
  >;
  statsQuery: UseQueryResult<IReviewStatsDtoType, unknown>;
}

export const ReViewApplicationContext =
  createContext<IReViewApplicationContextType | null>(null);
