import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skillsmatch/ui";
import { useRef } from "react";
import ReportPostProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { ReportPostTable } from "../components/table/Table";
import { useReportPost } from "../context/useReportPost";
import { Printer } from "lucide-react";
import { ReportPrintArea } from "../components/ReportPrintArea";
import { ReportPrintAreaPost } from "../components/ReportPrintAreaPosition";
import ReportPostDialog from "../components/dialog/PostDialog";
import ReportPostStatsCards from "../components/PostStatsCard";
import { ReportPostTablePostion } from "../components/tablePosition/Table";
import { useRouter } from "@tanstack/react-router";

export default function ReportPostPage() {
  return (
    <ReportPostProvider>
      <ReportPostContent />
      <ReportPostDialog />
    </ReportPostProvider>
  );
}

export const ReportPostContent = () => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.navigate({
      to: router.state.location.pathname,
      search: {},
    });
  };
  return (
    <Main fixed>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Report Post</h1>
          <p className="text-sm text-muted-foreground">
            View and Report all Post in the system
          </p>
        </div>
      </div>
      <div className="-mx-4 overflow-y px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12 h-full">
        {" "}
      </div>{" "}
      <ReportPostStatsCards />
      <Tabs
        defaultValue="Normal"
        className="w-full h-full mt-[20px] mb-[-100px]"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Normal">Normal</TabsTrigger>
          <TabsTrigger value="position">Job Position</TabsTrigger>
        </TabsList>
        <TabsContent value="Normal">
          <div className="p-[10px] flex justify-end">
            <ReportButton type={"normal"} />
          </div>
          <ReportPostTable />
        </TabsContent>
        <TabsContent value="position">
          <div className="p-[10px] flex justify-end">
            <ReportButton type={"position"} />
          </div>
          <ReportPostTablePostion />
        </TabsContent>
      </Tabs>
    </Main>
  );
};

const ReportButton: React.FC<{ type: "normal" | "position" }> = ({ type }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useReportPost();

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "PRINT", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Post Report</title>
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
      <Button
        onClick={() => {
          setOpen("report");
          handlePrint();
        }}
        className="mt-4"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print {type === "normal" ? "normal" : "position"}
      </Button>

      {/* Render only the selected report based on type */}
      <div style={{ display: "none" }} ref={printRef}>
        {type === "normal" && <ReportPrintArea />}
        {type === "position" && <ReportPrintAreaPost />}
      </div>
    </>
  );
};
