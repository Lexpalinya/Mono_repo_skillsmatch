import { Wrench } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";

export default function SkillStatsCard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        name="Total Skills"
        icon={Wrench}
        value={15}
        description="+3 from last month"
      />
      <StatsCard
        name="Active Skills"
        icon={Wrench}
        value={1}
        description="+2 from last month"
      />
      <StatsCard
        name="Most Used"
        icon={Wrench}
        value={15}
        description={"+3 from last month"}
      />
    </div>
  );
}
