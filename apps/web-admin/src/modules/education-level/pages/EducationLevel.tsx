import { Button } from "@skillsmatch/ui";
import EducationLevelDialog from "../components/dialog/EducationLevelDialog";
import EducationLevelStatsCard from "../components/EducationLevelStatsCard";
import { EducationLevelTable } from "../components/table/Table";
import EducationLevelProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useEducationLevel } from "../context/useEducationLevel";

export default function EducationLevelPage() {
  return (
    <EducationLevelProvider>
      <EducationLevelContent />
      <EducationLevelDialog />
    </EducationLevelProvider>
  );
}

export const EducationLevelContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Education Levels Management</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage education levels for training
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <EducationLevelStatsCard />
    <EducationLevelTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useEducationLevel();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Education Level
    </Button>
  );
};
