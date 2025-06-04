import { Briefcase, Building2, Building2Icon, ShieldCheck,  } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useCompany } from "../context/useCompany";

export default function CompanyStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useCompany();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        name="Total Companies"
        icon={Building2}
        value={data?.total ?? 0}
        description="All companies registered on the platform"
      />
      <StatsCard
        name="Active Companies"
        icon={Building2Icon}
        value={data?.active ?? 0}
        description="Companies currently active and operational"
      />
      <StatsCard
        name="Verified Companies"
        icon={ShieldCheck}
        value={data?.verified ?? 0}
        description="Companies that have been verified"
      />
      <StatsCard
        name="Hiring Now"
        icon={Briefcase}
        value={data?.hiring ?? 0}
        description="Companies actively hiring for job positions"
      />
    </div>
  );
}
