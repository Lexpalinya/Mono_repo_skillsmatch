import SkillStatsCard from "../components/SkillStatsCard";
import { SkillTable } from "../components/table/Table";
import SkillProvider from "../context/Provider";
import { Main } from "@/layouts/components/Main";

export default function SkillPage() {
  return (
    <SkillProvider>
      <SkillContext />
    </SkillProvider>
  );
}

export const SkillContext = () => (
  <Main>
    <div>
      <h1 className="text-2xl font-semibold">Skills Management</h1>
      <p className="text-sm text-muted-foreground">
        Create and manage skills for job positions
      </p>
    </div>
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12"></div>
    <SkillStatsCard />
    <SkillTable />
  </Main>
);
