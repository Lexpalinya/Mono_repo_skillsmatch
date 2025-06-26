import { Main } from "@/layouts/components/Main";


import { Button } from "@skillsmatch/ui";
import { Printer } from "lucide-react";

import { ReportPrintArea } from "../components/ReportPrintArea";
import { useRef } from "react";
import ReportJobberProvider from "../context/Provider";
import ReportJobberDialog from "../components/dialog/ReportJobberDialog";
import ReportJobberStatsCard from "../components/ReportJobberStatsCard";
import { useReportJobber } from "../context/useReportJobber";
import { ReportJobberTable } from "../components/table/Table";

export default function reportCompanyPage() {
  return <ReportJobberProvider>
    <ReportJobberContent/>
    <ReportJobberDialog />
  </ReportJobberProvider>;
}

export const ReportJobberContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Report Jobber</h1>
        <p className="text-sm text-muted-foreground">
          View and Report all Jobber in the system
        </p>
      </div>
      <ReportButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <ReportJobberStatsCard />
    <ReportJobberTable/>
  </Main>
);

const ReportButton = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useReportJobber();

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "PRINT", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Jobber Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <>
      <Button onClick={() => {setOpen("report");handlePrint()}} className="mt-4">
        <Printer className="mr-2 h-4 w-4" />
        Print Jobber
      </Button>

      <div style={{ display: "none" }}>
        <ReportPrintArea ref={printRef} />
      </div>
    </>
  );
};

