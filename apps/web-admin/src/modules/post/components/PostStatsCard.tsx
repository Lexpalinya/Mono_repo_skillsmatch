import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { usePost } from "../context/usePost";

export default function PostStatsCards() {
  const {
    statsQuery: { data, error, isLoading },
  } = usePost();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatsCard
        name="Total Posts"
        icon={Briefcase}
        value={data.totalPosts}
        description="Job postings"
      />
      <StatsCard
        name="Active Posts"
        icon={Clock}
        value={data.activePosts}
        description={`${data.activePercentage}% of total`}
        badge={`${data.activePercentage}%`}
        badgeVariant="secondary"
      />
      <StatsCard
        name="Companies"
        icon={Building2}
        value={data.uniqueCompanies}
        description="Hiring companies"
      />
      <StatsCard
        name="Positions"
        icon={Users}
        value={data.totalPositions}
        description="Available positions"
      />
      <StatsCard
        name="Avg. Salary"
        icon={DollarSign}
        value={
          data.averageSalary > 0 ? data.averageSalary.toLocaleString() : "0"
        }
        description="THB average"
      />
      <StatsCard
        name="Avg. GPA"
        icon={Calendar}
        value={data.averageGPA}
        description="Required GPA"
        badge={
          data.expiredPosts > 0 ? `${data.expiredPosts} expired` : undefined
        }
        badgeVariant="destructive"
      />
    </div>
  );
}
