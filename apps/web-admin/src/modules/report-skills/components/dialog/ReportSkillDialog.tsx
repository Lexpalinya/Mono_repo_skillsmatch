import View from "./View";
import { useReportSkill } from "../../context/useReportSkills";

export default function ReportSkillDialog() {
  const { open, currentRow } = useReportSkill();
  return (
    <>{currentRow && <View open={open === "view"} currentRow={currentRow} />}</>
  );
}
