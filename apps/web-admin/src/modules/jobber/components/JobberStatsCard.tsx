import { Users, UserCheck, Search, ShieldCheck } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useJobber } from "../context/useJobber";

export default function JobberStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useJobber();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        name="Total Jobbers"
        icon={Users}
        value={data?.total ?? 0}
        description="All jobber profiles created on the platform"
      />
      <StatsCard
        name="Active Jobbers"
        icon={UserCheck}
        value={data?.active ?? 0}
        description="Jobbers currently active and not deactivated"
      />
      <StatsCard
        name="Verified Jobbers"
        icon={ShieldCheck}
        value={data?.verified ?? 0}
        description="Jobbers who have completed verification"
      />
      <StatsCard
        name="Looking for Jobs"
        icon={Search}
        value={data?.status ?? 0}
        description="Jobbers actively seeking job opportunities"
      />
    </div>
  );
}
