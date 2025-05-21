import type { IJobPositionCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { JobPositionUpdateDto, type IJobPositionUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { useJobPosition } from "../../context/useJobPosition";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import JobPositionForm from "../../utils/Form";

export default function Edit({ open, currentRow }: IJobPositionCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobPositionState,
  } = useJobPosition();

  const form = useForm<IJobPositionUpdateDtoType>({
    defaultValues: {
      name: currentRow.name || "",
      visible: currentRow.visible ?? false,
    },
    resolver: zodResolver(JobPositionUpdateDto),
  });

  const onSubmit = async (values: IJobPositionUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.jobPosition.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetJobPositionState();
      form.reset();
      refetch();

      toast.success("Job Position updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the job position. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Job Position",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return JobPositionForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
  });
}
