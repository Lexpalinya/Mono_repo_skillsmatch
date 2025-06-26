import type { ICompanyAdminDataType } from "@skillsmatch/dto";

export interface IReportCompanyProps {
    open: boolean;
}

export interface IReportCompanyCurrentRowProps extends IReportCompanyProps {
  currentRow: ICompanyAdminDataType;
}
