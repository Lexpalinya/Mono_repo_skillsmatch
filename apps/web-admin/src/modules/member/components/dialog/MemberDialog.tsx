import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useMember } from "../../context/useMember";


export default function MemberDialog() {
  const { open, currentRow } = useMember();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
