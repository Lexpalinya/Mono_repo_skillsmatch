import { useContext } from "react";
import { EducationLevelContext } from "./Context";

export const useEducationLevel = () => {
  const educationLevelContext = useContext(EducationLevelContext);
  if (!educationLevelContext)
    throw new Error("useEducationLevel must be used within <EducationLevelContext>");
  return educationLevelContext;
};
