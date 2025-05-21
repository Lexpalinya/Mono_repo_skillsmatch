import { Button } from "@skillsmatch/ui";
import EducationalInstitutionDialog from "../components/dialog/EducationalInstitutionDialog";
import EducationalInstitutionStatsCard from "../components/EducationalInstitutionStatsCard";
import { EducationalInstitutionTable } from "../components/table/Table";
import EducationalInstitutionProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useEducationalInstitution } from "../context/useEducationalInstitution";

export default function EducationalInstitutionPage() {
  return (
    <EducationalInstitutionProvider>
      <EducationalInstitutionContent />
      <EducationalInstitutionDialog />
    </EducationalInstitutionProvider>
  );
}

export const EducationalInstitutionContent = () => (
  <Main>
    <div className="flex items-center justify-between ">
      <div>
        <h1 className="text-2xl font-semibold">
          Educational Institutions Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage educational institutions
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <EducationalInstitutionStatsCard />
    <EducationalInstitutionTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useEducationalInstitution();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Educational Institution
    </Button>
  );
};
