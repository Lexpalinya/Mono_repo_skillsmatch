import { Users, UserCheck, Briefcase, Building2 } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useMember } from "../context/useMember";

export default function MemberStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useMember();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        name="All Members"
        icon={Users}
        value={data?.total ?? 0}
        description="Total number of registered members"
      />
      <StatsCard
        name="Active Members"
        icon={UserCheck}
        value={data?.active ?? 0}
        description="Members currently active on the platform"
      />
      <StatsCard
        name="Job Seekers"
        icon={Briefcase}
        value={data?.jobber ?? 0}
        description="Members looking for jobs (Jobbers)"
      />
      <StatsCard
        name="Companies"
        icon={Building2}
        value={data?.company ?? 0}
        description="Company accounts registered on the platform"
      />
    </div>
  );
}
