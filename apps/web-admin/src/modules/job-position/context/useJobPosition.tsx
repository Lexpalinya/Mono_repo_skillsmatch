import { useContext } from "react";
import { JobPositionContext } from "./Context";

export const useJobPosition = () => {
  const jobPositionContext = useContext(JobPositionContext);
  if (!jobPositionContext)
    throw new Error("JobPosition has to be used within <JobPositionContext>");
  return jobPositionContext;
};
