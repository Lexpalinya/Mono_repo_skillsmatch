import { Button } from "@skillsmatch/ui";
import JobPositionDialog from "../components/dialog/JobPositionDialog";
import JobPositionStatsCard from "../components/JobPositionStatsCard";
import { JobPositionTable } from "../components/table/Table";
import JobPositionProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useJobPosition } from "../context/useJobPosition";

export default function JobPositionPage() {
  return (
    <JobPositionProvider>
      <JobPositionContent />
      <JobPositionDialog />
    </JobPositionProvider>
  );
}

export const JobPositionContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Job Positions Management</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage job positions for training
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <JobPositionStatsCard />
    <JobPositionTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useJobPosition();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Job Position
    </Button>
  );
};
