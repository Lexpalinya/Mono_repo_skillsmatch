import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useEducationLevel } from "../../context/useEducationLevel";

export default function EducationLevelDialog() {
  const { open, currentRow } = useEducationLevel();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
