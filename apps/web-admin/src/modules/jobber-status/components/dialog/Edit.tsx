import type { IJobberStatusCurrentRowProps } from "../../utils/type"; // เปลี่ยนเป็น type ของ JobberStatus
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { JobberStatusUpdateDto, type IJobberStatusUpdateDtoType } from "@skillsmatch/dto"; // เปลี่ยนเป็น DTO ของ JobberStatus
import trpcClient from "@/libs/trpc-client";
import { useJobberStatus } from "../../context/useJobberStatus"; // เปลี่ยน hook ให้ตรงกับ JobberStatus
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import JobberStatusForm from "../../utils/Form"; 

export default function Edit({ open, currentRow }: IJobberStatusCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobberStatusState,
  } = useJobberStatus();

  const form = useForm<IJobberStatusUpdateDtoType>({
    defaultValues: {
      name: currentRow.name || "",
      visible: currentRow.visible ?? false,
    
    },
    resolver: zodResolver(JobberStatusUpdateDto),
  });

  const onSubmit = async (values: IJobberStatusUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.jobberStatus.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetJobberStatusState();
      form.reset();
      refetch();

      toast.success("Jobber Status updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the jobber status. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Jobber Status",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return JobberStatusForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
  });
}
