import type { IJobberAdminViewDto } from "@skillsmatch/dto";
import { MapPin } from "lucide-react";

export default function Location({ data }: { data: IJobberAdminViewDto }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 rounded-lg border p-4">
        <h4 className="font-medium">Birth Location</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Province:
          </div>
          <div>{data.bProvince}</div>

          <div className="flex items-center gap-2 text-muted-foreground">
            District:
          </div>
          <div>{data.bDistrict}</div>

          <div className="flex items-center gap-2 text-muted-foreground">
            Village:
          </div>
          <div>{data.bVillage}</div>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        <h4 className="font-medium">Current Location</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Province:
          </div>
          <div>{data.cProvince}</div>

          <div className="flex items-center gap-2 text-muted-foreground">
            District:
          </div>
          <div>{data.cDistrict}</div>

          <div className="flex items-center gap-2 text-muted-foreground">
            Village:
          </div>
          <div>{data.cVillage}</div>
        </div>
      </div>
    </div>
  );
}
