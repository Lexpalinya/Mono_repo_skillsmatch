import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from "@skillsmatch/ui";
import { Calendar, Briefcase, Building } from "lucide-react";
import { formatDate } from "@/utils/formatDateTime";
import * as React from "react";
import type { IMemberAdminViewDtoType } from "@skillsmatch/dto";

export default function AccountInfoCard({
  data,
}: {
  data: IMemberAdminViewDtoType;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Row
              label="Created:"
              value={formatDate(data?.createdAt) || "N/A"}
            />
            <Row label="Login Version:" value={data?.loginVersion} />
            <Row
              label="Has Company:"
              icon={<Building className="h-4 w-4" />}
              value={
                <Badge variant={data?.Company ? "default" : "secondary"}>
                  {data?.Company ? "Yes" : "No"}
                </Badge>
              }
            />
          </div>
          <div className="space-y-4">
            <Row
              label="Updated:"
              value={formatDate(data?.updatedAt) || "N/A"}
            />
            <Row
              label="Has Jobber:"
              icon={<Briefcase className="h-4 w-4" />}
              value={
                <Badge variant={data?.Jobber ? "default" : "secondary"}>
                  {data?.Jobber ? "Yes" : "No"}
                </Badge>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Row = ({
  label,
  icon,
  value,
}: {
  label?: string;
  icon?: React.ReactElement;
  value: string | React.ReactElement | number;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      {label}
    </div>
    <span className="font-medium">{value}</span>
  </div>
);
