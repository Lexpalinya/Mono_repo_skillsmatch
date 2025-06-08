import type { IEducationalInstitutionProps } from "../../utils/type";
import EducationalInstitutionForm from "../../utils/Form"; // เปลี่ยนชื่อ Form ให้ตรงกับ EducationalInstitution
import { useEducationalInstitution } from "../../context/useEducationalInstitution"; // เปลี่ยน context ให้ตรงกัน
import { useForm } from "react-hook-form";
import {
  EducationalInstitutionCreateDto,
  type IEducationalInstitutionCreateDtoType,
} from "@skillsmatch/dto"; // เปลี่ยน DTO
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
      // TODO: upload image to s3

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
