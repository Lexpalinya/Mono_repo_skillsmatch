import type { ICompanyAdminViewDtoType } from "@skillsmatch/dto";
import { FullImageViewer, ScrollArea } from "@skillsmatch/ui";

export default function Documents({
  data,
}: Readonly<{
  data: ICompanyAdminViewDtoType;
}>) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="rounded-lg border p-4">
        <h4 className="mb-4 font-medium">Verification Documents</h4>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.docImage.map((image, index) => (
            <FullImageViewer
              key={image}
              src={image}
              alt={data.member.username}
              currentIndex={index}
              imageList={data.docImage.map((image) => ({
                src: image,
                alt: data.member.username,
              }))}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
