import { Card, CardHeader, CardTitle, CardContent } from "@skillsmatch/ui";
import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  name: string;
  icon: LucideIcon;
  value: string | number;
  description?: string;
};

export function StatsCard({
  name,
  icon: Icon,
  value,
  description,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
