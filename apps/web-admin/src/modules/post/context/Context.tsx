import type { IPostAdminDtoType, IPostStatsDtoType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IPostDialogType = "add" | "view" | "edit" | "verified" | null;

interface IPostContextType {
  open: IPostDialogType | null;
  setOpen: Dispatch<SetStateAction<IPostDialogType | null>>;
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
}

export const PostContext = createContext<IPostContextType | null>(null);
