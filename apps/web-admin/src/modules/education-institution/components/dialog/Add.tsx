import type { IEducationalInstitutionProps } from "../../utils/type";
import EducationalInstitutionForm from "../../utils/Form";
import { useEducationalInstitution } from "../../context/useEducationalInstitution";
import { useForm } from "react-hook-form";
import {
  EducationalInstitutionCreateDto,
  type IEducationalInstitutionCreateDtoType,
} from "@skillsmatch/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import trpcClient from "@/libs/trpc-client";
import { confirm } from "@skillsmatch/ui";

export default function Add({ open }: IEducationalInstitutionProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetEducationalInstitutionState,
  } = useEducationalInstitution();

  const form = useForm<IEducationalInstitutionCreateDtoType>({
    defaultValues: {
      name: "",
      visible: true,
    },
    resolver: zodResolver(EducationalInstitutionCreateDto),
  });

  const onSubmit = async (values: IEducationalInstitutionCreateDtoType) => {
    try {
      await trpcClient.educationInstitution.create.mutate({
        ...values,
      });

      resetEducationalInstitutionState();
      form.reset();
      refetch();

      toast.success("Educational Institution created successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the educational institution. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Create Educational Institution",
        description: errorMessage,
        CancelProps: { className: "hidden" },
      });
    }
  };

  return EducationalInstitutionForm({
    open,
    setOpen: (value) => setOpen(value as any),
    form,
    onSubmit,
    title: "Create New Educational Institution",
    description: "Add a new educational institution associated with courses",
  });
}
