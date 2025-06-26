import { Main } from "@/layouts/components/Main";
import ReportCompanyProvider from "../context/Provider";
import {useReportCompany} from "../context/useReportCompany";
import { Button } from "@skillsmatch/ui";
import { Printer } from "lucide-react";
import { ReportCompanyTable } from "../components/table/Table";
import ReportCompanyStatsCard from "../components/ReportCompanyStatsCard";
import ReportCompanyDialog from "../components/dialog/ReportCompanyDialog";
import { ReportPrintArea } from "../components/ReportPrintArea";
import { useRef } from "react";

export default function reportCompanyPage() {
  return <ReportCompanyProvider>
    <ReportCompanyContent/>
    <ReportCompanyDialog />
  </ReportCompanyProvider>;
}

export const ReportCompanyContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Report Company</h1>
        <p className="text-sm text-muted-foreground">
          View and Report all Companies in the system
        </p>
      </div>
      <ReportButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <ReportCompanyStatsCard />
    <ReportCompanyTable/>
  </Main>
);

const ReportButton = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useReportCompany();

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "PRINT", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Company Report</title>
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
        Print Company
      </Button>

      <div style={{ display: "none" }}>
        <ReportPrintArea ref={printRef} />
      </div>
    </>
  );
};

