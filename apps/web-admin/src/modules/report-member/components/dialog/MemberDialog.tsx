
import View from "./View/View";
import { useReportMember } from "../../context/useReportMember";



export default function ReportMemberDialog() {
  const { open, currentRow } = useReportMember();

  return (
    <>

      {currentRow && <View open={open === "view"} currentRow={currentRow} />}

    </>
  );
}
