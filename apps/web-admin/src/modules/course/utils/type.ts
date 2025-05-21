import type { ICourseAdminDtoType } from "@skillsmatch/dto";

export interface ICourseProps {
  open: boolean;
}

export interface ICourseCurrentRowProps extends ICourseProps {
  currentRow: ICourseAdminDtoType;
}
