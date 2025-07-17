import Add from "./Add/Add";

import Edit from "./Edit/Edit";
import { usePost } from "../../context/usePost";
import JobDetailDialog from "./View/View";

export default function PostDialog() {
  const { open, currentRow } = usePost();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && (
        <JobDetailDialog open={open === "view"} id={currentRow.id} />
      )}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
