import type { IJobberAdminViewDto } from "@skillsmatch/dto";
import FullImageViewer from "../../../../../../../../packages/ui/src/components/ui/full-image-viewer";

export default function Documents({ data }: { data: IJobberAdminViewDto }) {
  return (
    <div className="rounded-lg border p-4">
      <h4 className="mb-4 font-medium">Verification Documents</h4>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.docImage.map((image, index) => (
          <FullImageViewer
            key={index}
            src={image}
            alt={data.member.username}
            imageList={data.docImage.map((image) => ({
              src: image,
              alt: data.member.username,
            }))}
          />
        ))}
      </div>
    </div>
  );
}
