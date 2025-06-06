import { formatDate } from "@/utils/formatDateTime";
import type { ICompanyAdminViewDtoType } from "@skillsmatch/dto";

import { Briefcase } from "lucide-react";

export default function CompanyDetails({
  data,
}: Readonly<{
  data: ICompanyAdminViewDtoType;
}>) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="font-medium">Basic Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              Business Model:
            </div>
            <div>{data.bm.name}</div>

            <div className="flex items-center gap-2 text-muted-foreground">
              Owner:
            </div>
            <div>
              {data.owner_firstname} {data.owner_lastname}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              Job Posts:
            </div>
            <div>{data.postCount || 0}</div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <h4 className="font-medium">Account Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              Member ID:
            </div>
            <div className="truncate font-mono text-xs">{data.memberId}</div>

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
