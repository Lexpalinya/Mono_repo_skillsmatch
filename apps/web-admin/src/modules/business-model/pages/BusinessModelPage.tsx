import { Main } from "@/layouts/components/Main";
import { BusinessModelProvider } from "../context/Provider";
import { Button } from "@skillsmatch/ui";
import { PlusCircle } from "lucide-react";
import { useBusinessModel } from "../context/useBusinessModel";
import BusinessModelStatsCard from "../components/BusinessModelStatsCard";
import BusinessModelTable from "../components/table/Table";
import BusinessModelDialog from "../components/dialog/BusinessModelDialog";

export default function BusinessModelPage() {
  return (
    <BusinessModelProvider>
      <BusinessModelContent />
      <BusinessModelDialog/>
    </BusinessModelProvider>
  );
}

const BusinessModelContent = () => {
  return (
    <Main>
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-semibold">Skills Management</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage skills for job positions
          </p>
        </div>
        <AddButton />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
      <BusinessModelStatsCard />
      <BusinessModelTable />
    </Main>
  );
};
const AddButton = () => {
  const { setOpen } = useBusinessModel();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New BusinessModel
    </Button>
  );
};
