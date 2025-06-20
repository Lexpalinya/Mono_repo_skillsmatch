import Add from "./Add";
import View from "./View/View";

import { useJobber } from "../../context/useJobber";
import Verified from "./Verified";
import Edit from "./Edit/Edit";

export default function JobberDialog() {
  const { open, currentRow } = useJobber();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
      {currentRow && (
        <Verified open={open === "verified"} currentRow={currentRow} />
      )}
    </>
  );
}
