import { Main } from "@/layouts/components/Main";

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skillsmatch/ui";
import { Printer } from "lucide-react";

import { useRef } from "react";

import { ReportPrintArea } from "../components/ReportPrintArea";
import ReportSkillProvider from "../context/Provider";
import ReportSkillDialog from "../components/dialog/ReportSkillDialog";
import ReportSkillStatsCard from "../components/ReportSkillStatsCard";
import { ReportSkillTable } from "../components/table/Table";
import { useReportSkill } from "../context/useReportSkills";
import { ReportSkillTablePost } from "../components/tablePost/Table";
import { ReportPrintAreaPost } from "../components/ReportPrintAreaPost";
import { useRouter } from "@tanstack/react-router";

export default function ReportSkillPage() {
  return (
    <ReportSkillProvider>
      <ReportSkillContent />
      <ReportSkillDialog />
    </ReportSkillProvider>
  );
}

export const ReportSkillContent = () => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.navigate({
      to: router.state.location.pathname,
      search: {},
    });
  };
  return (
    <Main fixed > 
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Report Skill</h1>
          <p className="text-sm text-muted-foreground">
            View and Report all Skill in the system
          </p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
      <ReportSkillStatsCard />
      <Tabs
        defaultValue="Jobber"
        className="flex flex-col mt-[20px] mb-[-100px] h-[100%]"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Jobber">Joober Usage</TabsTrigger>
          <TabsTrigger value="post">Post Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="Jobber" className="flex-1 overflow-auto">
          <div className="p-[10px] flex justify-end">
            <ReportButton type={"Jobber"} />
          </div>
          <ReportSkillTable />
        </TabsContent>
        <TabsContent value="post" className="flex-1 overflow-auto">
          <div className="p-[10px] flex justify-end">
            <ReportButton type={"post"} />
          </div>
          <ReportSkillTablePost />
        </TabsContent>
      </Tabs>
    </Main>
  );
};

const ReportButton: React.FC<{ type: "Jobber" | "post" }> = ({ type }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useReportSkill();

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "PRINT", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Skills Report</title>
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
        Print {type === "Jobber" ? "Jobber" : "Posts"}
      </Button>

      {/* Render only the selected report based on type */}
      <div style={{ display: "none" }} ref={printRef}>
        {type === "Jobber" && <ReportPrintArea />}
        {type === "post" && <ReportPrintAreaPost />}
      </div>
    </>
  );
};
