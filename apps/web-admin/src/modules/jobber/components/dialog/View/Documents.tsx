import type { IJobberAdminViewDto } from "@skillsmatch/dto";

export default function Documents({ data }: { data: IJobberAdminViewDto }) {
  return (
    <div className="rounded-lg border p-4">
      <h4 className="mb-4 font-medium">Verification Documents</h4>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.docImage}
      </div>
    </div>
  );
}
