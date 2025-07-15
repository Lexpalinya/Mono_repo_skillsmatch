import { Building2, ShieldCheck, ShieldOff } from "lucide-react";
import { StatsCard } from "../../../utils/StatsCard";
import { useReportJobber } from "../context/useReportJobber";


export default function ReportJobberStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useReportJobber();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        name="Total Jobber"
        icon={Building2}
        value={data?.total ?? 0}
        description="All companies registered on the platform"
      />
      <StatsCard
        name="Verified Jobber"
        icon={ShieldCheck}
        value={data?.verified ?? 0}
        description="Jobber that have been verified"
      />
      <StatsCard
        name="Not Verified Jobber"
        icon={ShieldOff}
        value={data?.notverified ?? 0}
        description="Companies that had not verified"
      />
    </div>
  );
}
