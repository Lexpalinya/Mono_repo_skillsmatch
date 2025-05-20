import { Button } from "@skillsmatch/ui";
import SkillDialog from "../components/dialog/SkillDialog";
import SkillStatsCard from "../components/SkillStatsCard";
import { SkillTable } from "../components/table/Table";
import SkillProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";
import { PlusCircle } from "lucide-react";
import { useSkill } from "../context/useSkill";

export default function SkillPage() {
  return (
    <SkillProvider>
      <SkillContent />
      <SkillDialog />
    </SkillProvider>
  );
}

export const SkillContent = () => (
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
    <SkillStatsCard />
    <SkillTable />
  </Main>
);

const AddButton = () => {
  const { setOpen } = useSkill();
  return (
    <Button onClick={() => setOpen("add")} className="mt-4">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Skill
    </Button>
  );
};
