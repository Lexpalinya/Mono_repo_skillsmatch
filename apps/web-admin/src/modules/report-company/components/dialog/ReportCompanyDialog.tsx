
import View from "./View/View";

import { useReportCompany } from "../../context/useReportCompany";

export default function ReportCompanyDialog() {
  const { open, currentRow } = useReportCompany();
  return (
    <>
      {currentRow && <View open={open === "view"} currentRow={currentRow} />}
    </>
  );
}
