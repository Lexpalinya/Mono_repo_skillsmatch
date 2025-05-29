import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";
import { useJobber } from "../../context/useJobber";
import JobberForm from "../../utils/Form";
import { uploadImageToCloudinary } from "@skillsmatch/config";
import type { IJobberProps } from "../../utils/type";
import {
  JobberFileCreateDto,
  type IJobberFileCreateDtoType,
} from "@skillsmatch/dto";

export default function Add({ open }: IJobberProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobberState,
  } = useJobber();

  const form = useForm<IJobberFileCreateDtoType>({
    resolver: zodResolver(JobberFileCreateDto),
  });

  const onSubmit = async (values: IJobberFileCreateDtoType) => {
    try {
      // Upload if `docImage` is array of File
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

      // Send to backend
      await trpcClient.jobber.create.mutate({
        ...values,
        docImage: Array.isArray(values.docImage) && values.docImage[0] instanceof File
          ? []
          : (values.docImage as string[]),
      });

      resetJobberState();
      form.reset();
      refetch();

      toast.success("Jobber created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the jobber. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Jobber",
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
    title: "Create New Jobber",
    description: "Add a new Jobber to the system.",
  });
}
