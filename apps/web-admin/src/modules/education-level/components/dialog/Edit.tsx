import type { IEducationLevelCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { EducationLevelUpdateDto, type IEducationLevelUpdateDtoType } from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { useEducationLevel } from "../../context/useEducationLevel";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import EducationLevelForm from "../../utils/Form";

export default function Edit({ open, currentRow }: IEducationLevelCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetEducationLevelState,
  } = useEducationLevel();

  const form = useForm<IEducationLevelUpdateDtoType>({
    defaultValues: {
      name: currentRow.name || "",
      visible: currentRow.visible ?? false,
    },
    resolver: zodResolver(EducationLevelUpdateDto),
  });

  const onSubmit = async (values: IEducationLevelUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.educationLevel.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetEducationLevelState();
      form.reset();
      refetch();

      toast.success("Education Level updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the education level. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Education Level",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return EducationLevelForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
  });
}
