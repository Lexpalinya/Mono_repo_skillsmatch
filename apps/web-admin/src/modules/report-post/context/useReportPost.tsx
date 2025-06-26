import { useContext } from "react";
import { ReportPostContext } from "./Context";


export const useReportPost = () => {
  const reportpostContext = useContext(ReportPostContext);
  if (!reportpostContext)
    throw new Error("useReportPost must be used within <ReportPostProvider>");
  return reportpostContext;
};
