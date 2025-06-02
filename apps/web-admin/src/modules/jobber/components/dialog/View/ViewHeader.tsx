import type { IJobberAdminViewDto } from "@skillsmatch/dto";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@skillsmatch/ui";
import { Mail, Phone, UserRound } from "lucide-react";

export default function ViewHeader({ data }: { data: IJobberAdminViewDto }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={data.member.profile || "/placeholder.svg?height=80&width=80"}
          alt={`${data.firstName} ${data.lastName}`}
        />
        <AvatarFallback>
          <UserRound className="h-10 w-10" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold">
          {data.firstName.toLocaleUpperCase()} {data.lastName}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{data.member.email}</span>
          <span className="mx-1">•</span>
          <Phone className="h-4 w-4" />
          <span>{data.member.phoneNumber}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge className="capitalize">{data.status.name}</Badge>
          <Badge
         
            variant={data.isVerify ? "default" : "outline"}
          >
            {data.isVerify ? "Verified" : "Unverified"}
          </Badge>
          <Badge variant="secondary">{data.gender.toUpperCase()}</Badge>
        </div>
      </div>
    </div>
  );
}
