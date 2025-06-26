import { Building2, ShieldCheck, ShieldOff } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useReportCompany } from "../context/useReportCompany";

export default function ReportCompanyStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useReportCompany();

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
        name="Verified Companies"
        icon={ShieldCheck}
        value={data?.verified ?? 0}
        description="Companies that have been verified"
      />
      <StatsCard
        name="Not Verified Companies"
        icon={ShieldOff}
        value={data?.notverified ?? 0}
        description="Companies that had not verified"
      />
    </div>
  );
}
