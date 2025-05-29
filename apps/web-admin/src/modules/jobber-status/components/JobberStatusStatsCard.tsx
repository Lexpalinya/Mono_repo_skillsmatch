import { BookOpenCheck, Activity, TrendingUp } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useJobberStatus } from "../context/useJobberStatus";

export default function JobberStatusStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useJobberStatus();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        name="Total Jobber Status"
        icon={BookOpenCheck}
        value={data?.total ?? 0}
        description="Total number of jobber statuses recorded in the system"
      />
      <StatsCard
        name="Active Jobber Status"
        icon={Activity}
        value={data?.active ?? 0}
        description="Jobber statuses currently visible and in use across the platform"
      />
      <StatsCard
        name="Most Used Model"
        icon={TrendingUp}
        value={data?.mostUsed?.name ?? "No data"}
        description={
          data?.mostUsed
            ? `${data.mostUsed.jobberUsageCount} companies are using this model`
            : "No usage data available"
        }
      />
    </div>
  );
}
