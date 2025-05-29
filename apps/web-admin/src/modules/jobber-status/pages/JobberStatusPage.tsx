import { Button } from "@skillsmatch/ui";
import JobberStatusDialog from "../components/dialog/JobberStatusDialog";
import JobberStatusStatsCard from "../components/JobberStatusStatsCard";
import { JobberStatusTable } from "../components/table/Table";
import JobberStatusProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useJobberStatus } from "../context/useJobberStatus";

export default function JobberStatusPage() {
  return (
    <JobberStatusProvider>
      <JobberStatusContent />
      <JobberStatusDialog />
    </JobberStatusProvider>
  );
}

export const JobberStatusContent = () => (
  <Main>
    <div className="flex items-center justify-between ">
      <div>
        <h1 className="text-2xl font-semibold">Jobber Status Management</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage jobber status types
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <JobberStatusStatsCard />
    <JobberStatusTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useJobberStatus();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Jobber Status
    </Button>
  );
};
