import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useCourse } from "../../context/useCourse";

export default function CourseDialog() {
  const { open, currentRow } = useCourse();
  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
