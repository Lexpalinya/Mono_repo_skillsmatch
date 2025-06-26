import { useContext } from "react";
import { ReportMemberContext } from "./Context";


export const useReportMember = () => {
  const reportMemberContext = useContext(ReportMemberContext);
  if (!reportMemberContext)
    throw new Error("ReportMember has to be used within <ReportMemberContext>");
  return reportMemberContext;
};
