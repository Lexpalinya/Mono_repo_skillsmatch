import type {
  IEducationalInstitutionAdminDtoType,
  IEducationalInstitutionStatsDtoType,
} from "@skillsmatch/dto";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import type { RowSelectionState } from "@tanstack/react-table";
import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Returns } from "tanstack-table-search-params";

export type IEducationalInstitutionDialogType = "add" | "view" | "edit" | null;

interface IEducationalInstitutionContextType {
  open: IEducationalInstitutionDialogType | null;
  setOpen: Dispatch<SetStateAction<IEducationalInstitutionDialogType | null>>;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  currentRow: IEducationalInstitutionAdminDtoType | null;
  setCurrentRow: Dispatch<SetStateAction<IEducationalInstitutionAdminDtoType | null>>;
  stateAndOnChanges: Returns;
  resetEducationalInstitutionState: () => void;
  statsQuery: DefinedUseQueryResult<
    {
      total: number;
      active: number;
      mostUsedPost: IEducationalInstitutionStatsDtoType;
      mostUsedJobber: IEducationalInstitutionStatsDtoType;
    },
    Error
  >;
  tableQuery: DefinedUseQueryResult<
    { data: IEducationalInstitutionAdminDtoType[]; total: number },
    Error
  >;
}

export const EducationalInstitutionContext = createContext<IEducationalInstitutionContextType | null>(null);
