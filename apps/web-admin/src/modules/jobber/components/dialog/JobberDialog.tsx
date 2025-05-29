import Add from "./Add";
import View from "./View/View";
import Edit from "./Edit";
import { useJobber } from "../../context/useJobber";


export default function JobberDialog() {
  const { open, currentRow } = useJobber();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
