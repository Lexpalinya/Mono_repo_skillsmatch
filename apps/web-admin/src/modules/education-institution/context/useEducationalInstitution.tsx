import { useContext } from "react";
import { EducationalInstitutionContext } from "./Context";

export const useEducationalInstitution = () => {
  const context = useContext(EducationalInstitutionContext);
  if (!context)
    throw new Error("useEducationalInstitution must be used within <EducationalInstitutionContext.Provider>");
  return context;
};
