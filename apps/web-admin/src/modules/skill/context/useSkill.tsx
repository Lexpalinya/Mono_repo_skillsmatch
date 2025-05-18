import { useContext } from "react";
import { SkillContext } from "./Context";

export const useSkill = () => {
  const skillContext = useContext(SkillContext);
  if (!skillContext)
    throw new Error("useSkill has to be used within <SkillContext>");
  return skillContext;
};
