import type { IJobberAdminDtoType } from "@skillsmatch/dto";

export interface IJobberProps {
  open: boolean;
}

export interface IJobberCurrentRowProps extends IJobberProps {
  currentRow: IJobberAdminDtoType;
}
