
import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useBusinessModel } from "../../context/useBusinessModel";

export default function BusinessModelDialog() {
  const { open, currentRow } = useBusinessModel();
  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
