import Add from "./Add";
import View from "./View";
import Edit from "./Edit";
import { useEducationalInstitution } from "../../context/useEducationalInstitution";

export default function EducationalInstitutionDialog() {
  const { open, currentRow } = useEducationalInstitution();

  return (
    <>
      <Add open={open === "add"} />
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
      {currentRow && <Edit open={open === "edit"} currentRow={currentRow} />}
    </>
  );
}
