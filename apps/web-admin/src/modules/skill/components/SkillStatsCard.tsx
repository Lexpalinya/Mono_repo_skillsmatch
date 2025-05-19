import {  Wrench } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useSkill } from "../context/useSkill";

export default function SkillStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useSkill();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        name="Total Skills"
        icon={Wrench}
        value={data?.total || 0}
        description="recorded in the system"
      />
      <StatsCard
        name="Active Skills"
        icon={Wrench}
        value={data?.active || 0}
        description="Currently in use across the platform"
      />
      <StatsCard
        name="Most Used"
        icon={Wrench}
        value={data?.mostUsed.name || 0}
        description={`${data?.mostUsed?.jobberUsageCount || 0} job postings require this skill`}
      />
    </div>
  );
}

