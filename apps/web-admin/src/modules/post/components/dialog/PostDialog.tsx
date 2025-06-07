import Add from "./Add/Add";
import View from "./View/View";

import Edit from "./Edit/Edit";
import { usePost } from "../../context/usePost";

export default function PostDialog() {
  const { open, currentRow } = usePost();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
