import { BookOpenCheck, Activity, Wrench, Users } from "lucide-react";
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
        name="Total Members"
        icon={BookOpenCheck}
        value={data?.total ?? 0}
        description="Total number of Member recorded in the system"
      />
      <StatsCard
        name="Active Majors"
        icon={Activity}
        value={data?.active ?? 0}
        description="Member currently visible and in use across the platform"
      />
      <StatsCard
        name="Jobbers"
        icon={Wrench}
        value={data?.mostUsedPost?.name ?? "No data"}
        description={
          data?.mostUsedPost
            ? `Used in ${data.mostUsedPost.postUsageCount} job posts`
            : "No usage data available"
        }
      />
      <StatsCard
        name="Companies"
        icon={Users}
        value={data?.mostUsedJobber?.name ?? "No data"}
        description={
          data?.mostUsedJobber
            ? `Used by ${data.mostUsedJobber.jobberUsageCount} jobbers`
            : "No usage data available"
        }
      />
    </div>
  );
}
