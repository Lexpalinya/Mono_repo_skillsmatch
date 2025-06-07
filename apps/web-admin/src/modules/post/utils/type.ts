import type { IPostAdminDtoType } from "@skillsmatch/dto";

export interface IPostProps {
  open: boolean;
}

export interface IPostCurrentRowProps extends IPostProps {
  currentRow: IPostAdminDtoType;
}
