import { useContext } from "react";
import { ReportSkillContext } from "./Context";

export const useReportSkill = () => {
  const reportskillContext = useContext(ReportSkillContext);
  if (!reportskillContext)
    throw new Error("useSkill has to be used within <SkillContext>");
  return reportskillContext;
};
