import type { IJobberStatusAdminDtoType } from "@skillsmatch/dto";

export interface IJobberStatusProps {
  open: boolean;
}

export interface IJobberStatusCurrentRowProps extends IJobberStatusProps {
  currentRow: IJobberStatusAdminDtoType;
}
