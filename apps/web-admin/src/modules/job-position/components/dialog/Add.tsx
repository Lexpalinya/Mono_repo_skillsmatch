import type { IJobPositionProps } from "../../utils/type";
import JobPositionForm from "../../utils/Form";
import { useJobPosition } from "../../context/useJobPosition";
import { useForm } from "react-hook-form";
import { JobPositionCreateDto, type IJobPositionCreateDtoType } from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: IJobPositionProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetJobPositionState,
  } = useJobPosition();

  const form = useForm<IJobPositionCreateDtoType>({
    defaultValues: {
      name: "",
      visible: false,
    },
    resolver: zodResolver(JobPositionCreateDto),
  });

  const onSubmit = async (values: IJobPositionCreateDtoType) => {
    try {
      // TODO: upload image to s3

      await trpcClient.jobPosition.create.mutate({
        ...values,
      });

      resetJobPositionState();
      form.reset();
      refetch();

      toast.success("Job Position created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the job position. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Job Position",
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
    title: "Create New Job Position",
    description: "Add a new job position that can be associated with courses",
  });
}
