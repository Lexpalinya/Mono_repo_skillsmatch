import { useContext } from "react";
import { ReportJobberContext } from "./Context";

export const useReportJobber = () => {
  const ReportjobberContext = useContext(ReportJobberContext);
  if (!ReportjobberContext)
    throw new Error("ReportJobber has to be used within <ReportJobberContext>");
  return ReportjobberContext;
};
