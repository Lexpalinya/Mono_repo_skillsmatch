import { useContext } from "react";
import { CompanyContext } from "./Context";

export const useCompany = () => {
  const companyContext = useContext(CompanyContext);
  if (!companyContext)
    throw new Error("useCompany must be used within <CompanyProvider>");
  return companyContext;
};
