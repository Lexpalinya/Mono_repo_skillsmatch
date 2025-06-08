import type { IJobberStatusProps } from "../../utils/type";
import JobberStatusForm from "../../utils/Form";
import { useJobberStatus } from "../../context/useJobberStatus";
import { useForm } from "react-hook-form";
import {
  JobberStatusCreateDto,
  type IJobberStatusCreateDtoType,
} from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: IJobberStatusProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobberStatusState,
  } = useJobberStatus();

  const form = useForm<IJobberStatusCreateDtoType>({
    defaultValues: {
      name: "",
      visible: true,
    },
    resolver: zodResolver(JobberStatusCreateDto),
  });

  const onSubmit = async (values: IJobberStatusCreateDtoType) => {
    try {
      await trpcClient.jobberStatus.create.mutate({
        ...values,
      });

      resetJobberStatusState();
      form.reset();
      refetch();

      toast.success("Jobber Status created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the jobber status. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Jobber Status",
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
    title: "Create New Jobber Status",
    description:
      "Add a new jobber status that can be associated with job positions",
  });
}
