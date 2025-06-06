import Add from "./Add";
import View from "./View/View";

import Verified from "./Verified";
import Edit from "./Edit/Edit";
import { useCompany } from "../../context/useCompany";

export default function CompanyDialog() {
  const { open, currentRow } = useCompany();

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
