
import { useReportJobber } from "../../context/useReportJobber";
import View from "./View/View";


export default function ReportJobberDialog() {
  const { open, currentRow } = useReportJobber();
  return (
    <>
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
    </>
  );
}
