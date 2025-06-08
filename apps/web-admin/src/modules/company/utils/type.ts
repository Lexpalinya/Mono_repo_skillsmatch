import type { ICompanyAdminDataType } from "@skillsmatch/dto";

export interface ICompanyProps {
  open: boolean;
}

export interface ICompanyCurrentRowProps extends ICompanyProps {
  currentRow: ICompanyAdminDataType;
}
