import type { IEducationLevelProps } from "../../utils/type";
import EducationLevelForm from "../../utils/Form";
import { useEducationLevel } from "../../context/useEducationLevel";
import { useForm } from "react-hook-form";
import { EducationLevelCreateDto, type IEducationLevelCreateDtoType } from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: IEducationLevelProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetEducationLevelState,
  } = useEducationLevel();

  const form = useForm<IEducationLevelCreateDtoType>({
    defaultValues: {
      name: "",
      visible: false,
    },
    resolver: zodResolver(EducationLevelCreateDto),
  });

  const onSubmit = async (values: IEducationLevelCreateDtoType) => {
    try {
      // TODO: upload image to s3 if needed

      await trpcClient.educationLevel.create.mutate({
        ...values,
      });

      resetEducationLevelState();
      form.reset();
      refetch();

      toast.success("Education Level created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the education level. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Education Level",
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
    title: "Create New Education Level",
    description: "Add a new education level that can be associated with users",
  });
}
