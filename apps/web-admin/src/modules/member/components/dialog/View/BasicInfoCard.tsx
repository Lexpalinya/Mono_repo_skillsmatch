import type { IMemberAdminViewDtoType } from "@skillsmatch/dto";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from "@skillsmatch/ui";
import { Phone, Mail, Shield, Crown, User } from "lucide-react";

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "moderator":
      return "default";
    default:
      return "secondary";
  }
};

export default function BasicInfoCard({
  data,
}: {
  data: IMemberAdminViewDtoType;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="Phone:" icon={<Phone />} value={data.phoneNumber} />
        <InfoRow label="Email:" icon={<Mail />} value={data.email} />
        <InfoRow
          label="Block:"
          icon={<Shield />}
          value={
            <Badge variant={data?.block ? "destructive" : "secondary"}>
              {data?.block ? "Blocked" : "Not Blocked"}
            </Badge>
          }
        />
        <InfoRow
          label="Role:"
          icon={<Crown />}
          value={
            <Badge
              variant={getRoleBadgeVariant(data?.role ?? "")}
              className="capitalize"
            >
              {data?.role}
            </Badge>
          }
        />
      </CardContent>
    </Card>
  );
}

const InfoRow = ({
  label,
  icon,
  value,
}: {
  label: string;
  icon: any;
  value: string | React.ReactElement;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      {label}
    </div>
    <span>{value}</span>
  </div>
);
