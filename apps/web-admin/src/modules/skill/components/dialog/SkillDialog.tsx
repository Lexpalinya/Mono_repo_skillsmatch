
import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useSkill } from "../../context/useSkill";

export default function SkillDialog() {
  const { open, currentRow } = useSkill();
  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
