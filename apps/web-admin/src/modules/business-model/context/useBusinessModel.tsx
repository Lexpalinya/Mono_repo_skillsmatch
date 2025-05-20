import { useContext } from "react";
import { BusinessModelContext } from "./Context";

export const useBusinessModel = () => {
  const businessModelContext = useContext(BusinessModelContext);
  if (!businessModelContext)
    throw new Error(
      "useBusinessModel has to be used within <BusinessModelContext>"
    );
  return businessModelContext;
};
