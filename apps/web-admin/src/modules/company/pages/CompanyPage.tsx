import { Main } from "@/layouts/components/Main";
import CompanyProvider from "../context/Provider";
import { Button } from "@skillsmatch/ui";
import { PlusCircle } from "lucide-react";
import { useCompany } from "../context/useCompany";
import CompanyStatsCard from "../components/CompanyStatsCard";
import { CompanyTable } from "../components/table/Table";
import CompanyDialog from "../components/dialog/CompanyDialog";

export default function CompanyPage() {
  return (
    <CompanyProvider>
      <CompanyContent />
      <CompanyDialog />
    </CompanyProvider>
  );
}

export const CompanyContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Company Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all Companies in the system
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <CompanyStatsCard />
    <CompanyTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useCompany();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Company
    </Button>
  );
};
