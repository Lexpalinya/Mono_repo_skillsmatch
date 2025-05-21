import { BookOpenCheck, Activity, Wrench, Users } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useJobPosition } from "../context/useJobPosition"; // เปลี่ยน context

export default function JobPositionStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useJobPosition(); // ใช้ hook ของ JobPosition

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        name="Total Job Positions"
        icon={BookOpenCheck}
        value={data?.total ?? 0}
        description="Total number of job positions recorded in the system"
      />
      <StatsCard
        name="Active Job Positions"
        icon={Activity}
        value={data?.active ?? 0}
        description="Job positions currently visible and in use across the platform"
      />
      <StatsCard
        name="Most Used in Job Posts"
        icon={Wrench}
        value={data?.mostUsedPost?.name ?? "No data"}
        description={
          data?.mostUsedPost
            ? `Used in ${data.mostUsedPost.postUsageCount} job posts`
            : "No usage data available"
        }
      />
      <StatsCard
        name="Most Used by Jobbers"
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
