import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useMajor } from "../../context/useMajor";

export default function MajorDialog() {
  const { open, currentRow } = useMajor();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
