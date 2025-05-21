import {  Factory, Activity, TrendingUp } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useBusinessModel } from "../context/useBusinessModel";

export default function BusinessModelStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useBusinessModel();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        name="Total Business Models"
        icon={Factory}
        value={data?.total ?? 0}
        description="Total models recorded in the system"
      />
      <StatsCard
        name="Active Business Models"
        icon={Activity}
        value={data?.active ?? 0}
        description="Currently active and visible to companies"
      />
      <StatsCard
        name="Most Used Model"
        icon={TrendingUp}
        value={data?.mostUsed?.name ?? "No data"}
        description={
          data?.mostUsed
            ? `${data.mostUsed.companyUsageCount} companies are using this model`
            : "No usage data available"
        }
      />
    </div>
  );
}
