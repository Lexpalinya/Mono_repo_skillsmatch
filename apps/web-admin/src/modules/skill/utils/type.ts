import type { ISkillAdminDtoType } from "@skillsmatch/dto";

export interface ISkillProps {
  open: boolean;
}

export interface ISkillCurrentRowProps extends ISkillProps {
  currentRow: ISkillAdminDtoType;
}
