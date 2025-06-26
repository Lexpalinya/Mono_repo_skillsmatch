import { useContext } from "react";
import { ReportCompanyContext } from "./Context";

export const useReportCompany = () => {
  const reportcompanyContext = useContext(ReportCompanyContext);
  if (!reportcompanyContext)
    throw new Error(
      "useReportCompany must be used within <ReportCompanyProvider>"
    );
  return reportcompanyContext;
}
