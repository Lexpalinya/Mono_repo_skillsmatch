import type { ICompanyAdminViewDtoType } from "@skillsmatch/dto";
import { MapPin } from "lucide-react";

export default function Location({
  data,
}: Readonly<{ data: ICompanyAdminViewDtoType }>) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <h4 className="font-medium">Birth Location</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Province:
        </div>
        <div>{data.province}</div>

        <div className="flex items-center gap-2 text-muted-foreground">
          District:
        </div>
        <div>{data.district}</div>

        <div className="flex items-center gap-2 text-muted-foreground">
          Village:
        </div>
        <div>{data.province}</div>
      </div>
    </div>
  );
}
