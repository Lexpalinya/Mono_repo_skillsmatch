import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useReviewApplication } from "../../context/useReviewApplication";

export default function ReviewApplicationDialog() {
  const { open, currentRow } = useReviewApplication();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
