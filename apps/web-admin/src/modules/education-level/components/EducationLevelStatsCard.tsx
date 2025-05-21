import { BookOpenCheck, Activity, Wrench, Users } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useEducationLevel } from "../context/useEducationLevel";

export default function EducationLevelStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useEducationLevel();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        name="Total Education Levels"
        icon={BookOpenCheck}
        value={data?.total ?? 0}
        description="Total number of education levels recorded in the system"
      />
      <StatsCard
        name="Active Education Levels"
        icon={Activity}
        value={data?.active ?? 0}
        description="Education levels currently visible and in use across the platform"
      />
      <StatsCard
        name="Most Used in Posts"
        icon={Wrench}
        value={data?.mostUsedPost?.name ?? "No data"}
        description={
          data?.mostUsedPost
            ? `Used in ${data.mostUsedPost.postUsageCount} posts`
            : "No usage data available"
        }
      />
      <StatsCard
        name="Most Used by Users"
        icon={Users}
        value={data?.mostUsedJobber?.name ?? "No data"}
        description={
          data?.mostUsedJobber
            ? `Used by ${data.mostUsedJobber.jobberUsageCount} users`
            : "No usage data available"
        }
      />
    </div>
  );
}
