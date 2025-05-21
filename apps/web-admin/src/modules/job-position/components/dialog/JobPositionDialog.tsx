import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useJobPosition } from "../../context/useJobPosition";

export default function JobPositionDialog() {
  const { open, currentRow } = useJobPosition();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
