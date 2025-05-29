import { useContext } from "react";
import { JobberContext } from "./Context";

export const useJobber = () => {
  const jobberContext = useContext(JobberContext);
  if (!jobberContext)
    throw new Error("Jobber has to be used within <JobberContext>");
  return jobberContext;
};
