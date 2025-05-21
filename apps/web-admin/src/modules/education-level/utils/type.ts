import type { IEducationLevelAdminDtoType } from "@skillsmatch/dto";

export interface IEducationLevelProps {
  open: boolean;
}

export interface IEducationLevelCurrentRowProps extends IEducationLevelProps {
  currentRow: IEducationLevelAdminDtoType;
}
