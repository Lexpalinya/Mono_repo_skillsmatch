import type { IJobPositionAdminDtoType } from "@skillsmatch/dto";

export interface IJobPositionProps {
  open: boolean;
}

export interface IJobPositionCurrentRowProps extends IJobPositionProps {
  currentRow: IJobPositionAdminDtoType;
}
