import type { IMajorAdminDtoType } from "@skillsmatch/dto";

export interface IMajorProps {
  open: boolean;
}

export interface IMajorCurrentRowProps extends IMajorProps {
  currentRow: IMajorAdminDtoType;
}
