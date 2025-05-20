import type { IBusinessModelAdminDtoType } from "@skillsmatch/dto";

export interface IBusinessModelProps {
  open: boolean;
}

export interface IBusinessModelCurrentRowProps extends IBusinessModelProps {
  currentRow: IBusinessModelAdminDtoType;
}
