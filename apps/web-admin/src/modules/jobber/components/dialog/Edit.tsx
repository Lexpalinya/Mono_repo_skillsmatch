import type { IJobberCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";

import trpcClient from "@/libs/trpc-client";

import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";

import { useJobber } from "../../context/useJobber";
import { uploadImageToCloudinary } from "@skillsmatch/config";
import JobberForm from "../../utils/Form";
import {
  JobberFileUpdateDto,
  type IJobberFileUpdateDtoType,
} from "@skillsmatch/dto";

export default function Edit({ open, currentRow }: IJobberCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobberState,
  } = useJobber();

  const form = useForm<IJobberFileUpdateDtoType>({
    values: {
      ...currentRow,
      birthday: currentRow.birthday ? new Date(currentRow.birthday) : undefined,
    },
    resolver: zodResolver(JobberFileUpdateDto),
  });

  const onSubmit = async (values: IJobberFileUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(
        {
          ...currentRow,
          birthday: currentRow.birthday
            ? new Date(currentRow.birthday)
            : undefined,
        },
        values
      );
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }
      if (
        Array.isArray(values.docImage) &&
        values.docImage[0] instanceof File
      ) {
        const uploadedUrls = await Promise.all(
          values.docImage
            .filter((file): file is File => file instanceof File)
            .map((file) => uploadImageToCloudinary(file))
        );
        values.docImage = uploadedUrls;
      }

      // Set value back to form (optional for UI sync)
      form.setValue("docImage", values.docImage);

      await trpcClient.jobber.update.mutate({
        id: currentRow.id,
        ...values,

        docImage:
          Array.isArray(values.docImage) && values.docImage[0] instanceof File
            ? []
            : (values.docImage as string[]),
      });

      resetJobberState(currentRow.id);
      form.reset();
      refetch();

      toast.success("Jobber updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the major. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Jobber",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return JobberForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
    title: "Edit Jobber",
    description: "Update Jobber information.",
  });
}
