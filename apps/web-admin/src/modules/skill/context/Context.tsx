import type { ISkillAdminDtoType } from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";
export type ISkillDialogType = "create" | "view" | "update";

interface ISkillContextType {
  open: ISkillDialogType | null;
  setOpen: Dispatch<SetStateAction<ISkillDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: ISkillAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<ISkillAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetSkillState: () => void;
  tableQuery: DefinedUseQueryResult<
    { data: ISkillAdminDtoType[]; total: number },
    Error
  >;
}

export const SkillContext = createContext<ISkillContextType | null>(null);
