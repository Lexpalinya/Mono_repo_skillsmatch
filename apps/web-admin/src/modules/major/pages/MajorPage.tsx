import { Button } from "@skillsmatch/ui";
import MajorDialog from "../components/dialog/MajorDialog";
import MajorStatsCard from "../components/MajorStatsCard";
import { MajorTable } from "../components/table/Table";
import MajorProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useMajor } from "../context/useMajor";

export default function MajorPage() {
  return (
    <MajorProvider>
      <MajorContent />
      <MajorDialog />
    </MajorProvider>
  );
}

export const MajorContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Majors Management</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage majors for training
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <MajorStatsCard />
    <MajorTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useMajor();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Major
    </Button>
  );
};
