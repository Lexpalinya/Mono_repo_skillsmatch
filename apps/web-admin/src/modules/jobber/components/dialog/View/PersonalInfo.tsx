import { calculateAge } from "@/utils/extractChangedFields";
import { formatDate } from "@/utils/formatDateTime";
import type { IJobberAdminViewDto } from "@skillsmatch/dto";

import { Calendar, Flag, Users } from "lucide-react";

export default function PersonalInfo({ data }: { data: IJobberAdminViewDto }) {
  const age = calculateAge(data.birthday);
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="font-medium">Basic Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Birthday:
            </div>
            <div>{age.toString()}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Flag className="h-4 w-4" />
              Nationality:
            </div>
            <div>{data.nationality}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              Ethnicity:
            </div>
            <div>{data.ethnicity}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              Religion:
            </div>
            <div>{data.religion}</div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="font-medium">Account Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              Member ID:
            </div>
            <div className="truncate font-mono text-xs">{data.member.id}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              Username:
            </div>
            <div>{data.member.username}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              Created:
            </div>
            <div>{formatDate(data.createdAt)}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              Updated:
            </div>
            <div>{formatDate(data.updatedAt)}</div>
          </div>
        </div>
      </div>
      {data.reason && (
        <div className="rounded-lg border p-4">
          <h4 className="font-medium">Notes/Reason</h4>
          <p className="mt-2 text-sm">{data.reason}</p>
        </div>
      )}
    </>
  );
}
