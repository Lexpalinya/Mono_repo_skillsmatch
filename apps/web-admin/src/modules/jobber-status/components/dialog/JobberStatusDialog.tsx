import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useJobberStatus } from "../../context/useJobberStatus"; // เปลี่ยนชื่อ hook ให้ตรงกับ context จริง

export default function JobberStatusDialog() {
  const { open, currentRow } = useJobberStatus();
  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
