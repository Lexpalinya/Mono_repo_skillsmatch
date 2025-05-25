import { Button } from "@skillsmatch/ui";
import MemberDialog from "../components/dialog/MemberDialog";

import MemberProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useMember } from "../context/useMember";
import MemberStatsCard from "../components/MemberStatsCard";
import { MemberTable } from "../components/table/Table";

export default function MemberPage() {
  return (
    <MemberProvider>
      <MemberContent />
      <MemberDialog />
    </MemberProvider>
  );
}

export const MemberContent = () => (
  <Main>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Member Management</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all members in the system
        </p>
      </div>
      <AddButton />
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <MemberStatsCard />
    <MemberTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useMember();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Member
    </Button>
  );
};
