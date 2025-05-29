import { Main } from "@/layouts/components/Main";
import JobberProvider from "../context/Provider";
import { Button } from "@skillsmatch/ui";
import { PlusCircle } from "lucide-react";
import { useJobber } from "../context/useJobber";
import JobberStatsCard from "../components/JobberStatsCard";
import { JobberTable } from "../components/table/Table";
import JobberDialog from "../components/dialog/JobberDialog";

export default function JobberPage() {
  return (
    <JobberProvider>
      <JobberContent />
      <JobberDialog />
    </JobberProvider>
  );
}

export const JobberContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Jobber Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all Jobbers in the system
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <JobberStatsCard />
    <JobberTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useJobber();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Jobber
    </Button>
  );
};
