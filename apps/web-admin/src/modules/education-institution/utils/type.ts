import type { IEducationalInstitutionAdminDtoType } from "@skillsmatch/dto";

export interface IEducationalInstitutionProps {
  open: boolean;
}

export interface IEducationalInstitutionCurrentRowProps
  extends IEducationalInstitutionProps {
  readonly currentRow: IEducationalInstitutionAdminDtoType;
}
