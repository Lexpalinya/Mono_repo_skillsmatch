import type { IMemberAdminDtoType } from "@skillsmatch/dto";

export interface IMemberProps {
  open: boolean;
}

export interface IMemberCurrentRowProps extends IMemberProps {
  currentRow: IMemberAdminDtoType;
}
