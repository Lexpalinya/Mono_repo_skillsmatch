import { useContext } from "react";
import { JobberStatusContext } from "./Context";

export const useJobberStatus = () => {
  const jobberStatusContext = useContext(JobberStatusContext);
  if (!jobberStatusContext)
    throw new Error("useJobberStatus must be used within <JobberStatusProvider>");
  return jobberStatusContext;
};
