
import { useReportPost } from "../../context/useReportPost";
import View from "./View/View";


export default function ReportPostDialog() {
  const { open, currentRow } = useReportPost();

  return (
    <>
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}

    </>
  );
}
