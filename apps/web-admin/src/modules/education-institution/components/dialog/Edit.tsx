import type { IEducationalInstitutionCurrentRowProps } from "../../utils/type";
import { confirm } from "@skillsmatch/ui";
import { useForm } from "react-hook-form";
import { 
  EducationalInstitutionUpdateDto, 
  type IEducationalInstitutionUpdateDtoType 
} from "@skillsmatch/dto";
import trpcClient from "@/libs/trpc-client";
import { useEducationalInstitution } from "../../context/useEducationalInstitution";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractChangedFields } from "@/utils/extractChangedFields";
import EducationalInstitutionForm from "../../utils/Form";

export default function Edit({ open, currentRow }: IEducationalInstitutionCurrentRowProps) {
  const {
    tableQuery: { refetch },
    setOpen,
    resetEducationalInstitutionState,
  } = useEducationalInstitution();

  const form = useForm<IEducationalInstitutionUpdateDtoType>({
    defaultValues: {
      name: currentRow.name || "",
      visible: currentRow.visible ?? false,
    },
    resolver: zodResolver(EducationalInstitutionUpdateDto),
  });

  const onSubmit = async (values: IEducationalInstitutionUpdateDtoType) => {
    try {
      const changedFields = extractChangedFields(currentRow, values);
      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes detected.", {
          icon: <CheckCircle className="text-warning size-4" />,
        });
        return;
      }

      await trpcClient.educationInstitution.update.mutate({
        ...changedFields,
        id: currentRow.id,
      });

      resetEducationalInstitutionState();
      form.reset();
      refetch();

      toast.success("Educational Institution updated successfully!", {
        icon: <CheckCircle className="text-success size-4" />,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the educational institution. Please try again.";

      confirm({
        actionText: "Retry",
        title: "Failed to Update Educational Institution",
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
  });
}
