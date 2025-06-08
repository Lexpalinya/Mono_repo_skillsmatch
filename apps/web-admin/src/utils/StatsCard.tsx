import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from "@skillsmatch/ui";
import type { LucideIcon } from "lucide-react";

type StatsCardProps = Readonly<{
  readonly name: string;
  readonly icon: LucideIcon;
  readonly value: string | number;
  readonly description?: string;
  readonly badge?: string;
  readonly badgeVariant?: "default" | "secondary" | "destructive";
}>;

export function StatsCard({
  name,
  icon: Icon,
  value,
  description,
  badge,
  badgeVariant = "default",
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {badge && (
            <Badge variant={badgeVariant} className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
