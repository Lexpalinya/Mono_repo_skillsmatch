import trpcClient from "@/libs/trpc-client";
import { usePost } from "@/modules/post/context/usePost";
import type { IPostDetailddddDto } from "@skillsmatch/dto";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from "@skillsmatch/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";

interface JobDetailDialogProps {
  open: boolean;
  id: string;
}

export const JobDetailDialog: React.FC<JobDetailDialogProps> = ({
  open,
  id,
}) => {
  const { setOpen } = usePost();
  const { data, isLoading } = useQuery<IPostDetailddddDto>({
    queryKey: ["postDetailView", id],
    queryFn: () => trpcClient.post.getById.query({ id }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <></>;
  if (!isLoading && !data) <></>;
  const WORKDAY_OPTIONS = [
    { label: "ຈ.", value: "MO" },
    { label: "ອ.", value: "TU" },
    { label: "ພ.", value: "WE" },
    { label: "ພຫ.", value: "TH" },
    { label: "ສຸ.", value: "FR" },
    { label: "ສ.", value: "SA" },
    { label: "ອ.", value: "SU" },
  ];

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>ລາຍລະອຽດວຽກ</DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 py-4 max-h-[70vh]">
          <div className="flex items-center gap-4 border p-4 rounded-lg">
            <img
              src={data?.company?.member.profile || "/placeholder.png"}
              alt="company"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2 font-semibold">
                {data?.company?.name}
                {data?.company?.isVerify && (
                  <CheckCircle className="text-blue-500 w-4 h-4" />
                )}
              </div>
              <p className="text-muted-foreground">{data?.company?.bm?.name}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <h2 className="font-bold text-lg">ຕຳແໜ່ງທີຕ້ອງການ</h2>
              <span className="text-sm text-muted-foreground">
                📆 ປິດຮັບ {data?.endDate}
              </span>
            </div>

            {data?.jobPositions?.map((pos, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 space-y-2 bg-white"
              >
                <div className="flex justify-between items-end">
                  <h3 className="text-xl font-semibold">{pos.name}</h3>
                  <span>ຈຳນວນ: {pos.amount}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">ທັກສະ</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pos.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 border text-sm rounded bg-blue-50 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {pos.description && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {pos.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="font-bold text-lg">💼 ລາຍລະອຽດວຽກ</h2>
            <div className="border p-4 rounded-lg space-y-2 bg-white">
              <p>
                💰 ເງິນເດືອນ: {data?.minSalary} - {data?.maxSalary}{" "}
                {data?.currency}
              </p>
              <p>⏰ ເວລາ: {data?.workTime}</p>
              <p>📚 GPA: {data?.gpa}</p>

              <div>
                <p className="font-medium">📅 ວັນເຮັດວຽກ</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {WORKDAY_OPTIONS.map((day) => {
                    const isActive = data?.workDay?.includes(day.value as any);
                    return (
                      <span
                        key={day.value}
                        className={clsx(
                          "px-3 py-1 text-sm rounded border",
                          isActive
                            ? "bg-blue-100 text-blue-700 border-blue-400"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                        )}
                      >
                        {day.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {[
                { label: "🎓 ລະດັບການສຶກສາ", data: data?.educationLevels },
                { label: "🏫 ສະຖານບັນ", data: data?.institutions },
                { label: "🧪 ສາຂາ", data: data?.majors },
                { label: "📘 ຫຼັກສູດ", data: data?.courses },
              ].map(
                (section, i) =>
                  (section.data ?? []).length > 0 && (
                    <div key={i}>
                      <p className="font-medium">{section.label}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {section.data?.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded border bg-gray-100 text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
              )}

              {data?.welfare && (
                <div>
                  <p className="font-medium">🎁 ສະຫວັດດີການ</p>
                  <p className="text-sm text-muted-foreground">
                    {data?.welfare}
                  </p>
                </div>
              )}

              {data?.more && (
                <div>
                  <p className="font-medium">📝 ລາຍລະອຽດເພີມເຕີມ</p>
                  <p className="text-sm text-muted-foreground">{data?.more}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailDialog;
